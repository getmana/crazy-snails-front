#!/usr/bin/env bash
# Collects everything the Dependabot review needs into $OUT_DIR, so the Claude step only reads files.
# Never runs code from the updated packages: tarballs are only downloaded, extracted and diffed.
#
# Env: PR_NUMBER, DEPS_JSON (fetch-metadata's updated-dependencies-json), PACKAGE_ECOSYSTEM
# (fetch-metadata's package-ecosystem), OUT_DIR, GH_TOKEN.
# Expects the PR merge commit checked out with fetch-depth >= 2 (HEAD^1 is the base branch).
set -uo pipefail

readonly NPM_ECOSYSTEM='npm_and_yarn'
readonly ACTIONS_ECOSYSTEM='github_actions'
readonly REGISTRY_PREFIX='https://registry.npmjs.org/'
readonly MAX_TARBALL_BYTES=$((25 * 1024 * 1024))
readonly MAX_DIFF_BYTES=$((200 * 1024))
readonly MAX_LOCKFILE_LOOKUPS=150
readonly MAX_RELEASE_VERSIONS=20
readonly MAX_RELEASE_NOTES_BYTES=$((100 * 1024))
readonly MAX_ACTION_RELEASES_SCANNED=100
readonly MAX_COMPARE_COMMITS=50
readonly MAX_COMPARE_FILES=100
readonly NAME_PATTERN='^(@[a-z0-9][a-z0-9._~-]*/)?[a-z0-9][a-z0-9._~-]*$'
# "owner/repo" or "owner/repo/sub/path" (actions living in a subdirectory, e.g. github/codeql-action/init).
readonly ACTION_NAME_PATTERN='^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+(/[A-Za-z0-9_./-]+)?$'
readonly VERSION_PATTERN='^[0-9A-Za-z][0-9A-Za-z.+-]*$'
readonly MAJOR_PATTERN='^[0-9]+$'
readonly GITHUB_REPO_PATTERN='github\.com[/:]([A-Za-z0-9_.-]+)/([A-Za-z0-9_.-]+)'

mkdir -p "$OUT_DIR/packages"
NOTES="$OUT_DIR/notes.txt"
: > "$NOTES"

note() { echo "$*" >> "$NOTES"; }

isValidSpec() { [[ "$1" =~ $NAME_PATTERN ]] && [[ "$2" =~ $VERSION_PATTERN ]]; }

isValidActionSpec() { [[ "$1" =~ $ACTION_NAME_PATTERN ]] && [[ "$1" != *..* ]] && [[ "$2" =~ $VERSION_PATTERN ]]; }

packageDir() {
    local dir="$OUT_DIR/packages/${1//\//__}"
    mkdir -p "$dir"
    echo "$dir"
}

# Publisher, provenance, install scripts, integrity, publish times and advisories for one version.
collectMetadata() {
    local name=$1 version=$2 dir
    dir=$(packageDir "$name")
    npm view "$name@$version" _npmUser maintainers dist scripts repository --json > "$dir/meta-$version.json" 2>> "$NOTES" ||
        note "npm view failed: $name@$version"
    [ -s "$dir/time.json" ] || npm view "$name" time --json > "$dir/time.json" 2>> "$NOTES" ||
        note "npm view time failed: $name"
    gh api -X GET /advisories -f ecosystem=npm -f affects="$name@$version" > "$dir/advisories-$version.json" 2>> "$NOTES" ||
        note "advisory lookup failed: $name@$version"
}

# Downloads and extracts a tarball; prints the extraction directory, or nothing on failure.
extractTarball() {
    local name=$1 version=$2 dir=$3 url target
    url=$(jq -r '.dist.tarball // empty' "$dir/meta-$version.json" 2> /dev/null)
    if [[ "$url" != "$REGISTRY_PREFIX"* ]]; then
        note "tarball skipped, unexpected URL for $name@$version: ${url:-none}"
        return
    fi
    target="$RUNNER_TEMP/tarballs/${name//\//__}/$version"
    mkdir -p "$target"
    if ! curl -sSfL --max-filesize "$MAX_TARBALL_BYTES" -o "$target.tgz" "$url" 2>> "$NOTES"; then
        note "tarball download failed or larger than $MAX_TARBALL_BYTES bytes: $name@$version"
        return
    fi
    tar -xzf "$target.tgz" -C "$target" --no-same-owner --no-same-permissions 2>> "$NOTES" || {
        note "tarball extraction failed: $name@$version"
        return
    }
    # A symlink could point at /proc/self/environ or other runner files; diff would follow it.
    local links
    links=$(find "$target" -type l | wc -l)
    if [ "$links" -gt 0 ]; then
        note "$name@$version contained $links symlink(s); removed before diffing"
        find "$target" -type l -delete
    fi
    echo "$target"
}

# Prints "owner/repo" from the npm metadata's repository field, or nothing if it isn't on GitHub.
githubRepoOf() {
    local url
    url=$(jq -r '.repository | if type == "object" then .url else . end // empty' "$1" 2> /dev/null)
    [[ "$url" =~ $GITHUB_REPO_PATTERN ]] || return
    echo "${BASH_REMATCH[1]}/${BASH_REMATCH[2]%.git}"
}

# Version comparisons use sort -V, which orders plain x.y.z versions correctly but not semver prereleases.
# A bare major version ("4", as GitHub Actions tags often are) stands for that whole release line.
isNewerThan() {
    local base=$1 version=$2 major=${2%%.*}
    if [[ "$base" =~ $MAJOR_PATTERN ]]; then
        [[ "$major" =~ $MAJOR_PATTERN ]] && [ "$major" -gt "$base" ]
    else
        [ "$version" != "$base" ] && [ "$(printf '%s\n%s\n' "$base" "$version" | sort -V | head -1)" = "$base" ]
    fi
}

isNotNewerThan() {
    local limit=$1 version=$2 major=${2%%.*}
    if [[ "$limit" =~ $MAJOR_PATTERN ]]; then
        [[ "$major" =~ $MAJOR_PATTERN ]] && [ "$major" -le "$limit" ]
    else
        [ "$(printf '%s\n%s\n' "$version" "$limit" | sort -V | head -1)" = "$version" ]
    fi
}

# True when $3 is in the range ($1, $2]: newer than the old version, not newer than the new one.
isVersionInRange() { isNewerThan "$1" "$3" && isNotNewerThan "$2" "$3"; }

appendReleaseNotes() { jq -r '"## \(.tag_name)\n\n\(.body // "(no notes)")\n"' >> "$1"; }

# Drops an empty releases.md and caps an oversized one.
finishReleaseNotes() {
    local name=$1 file=$2
    if [ ! -s "$file" ]; then
        rm -f "$file"
        return
    fi
    if [ "$(wc -c < "$file")" -gt "$MAX_RELEASE_NOTES_BYTES" ]; then
        head -c "$MAX_RELEASE_NOTES_BYTES" "$file" > "$file.tmp" && mv "$file.tmp" "$file"
        note "release notes for $name truncated at $MAX_RELEASE_NOTES_BYTES bytes"
    fi
}

# Prints the release for one version, trying the usual tag styles: "v1.2.3", "1.2.3", "<package>@1.2.3".
fetchRelease() {
    local name=$1 version=$2 repo=$3 tag
    for tag in "v$version" "$version" "$name@$version"; do
        gh api "repos/$repo/releases/tags/$tag" 2> /dev/null && return
    done
    return 1
}

# Writes the GitHub release notes for every stable version in (prev, next] to releases.md, newest first.
# The version list comes from npm's time.json, so no release-page scanning is needed.
collectReleaseNotes() {
    local name=$1 prev=$2 next=$3 repo=$4 dir version release missing=() count=0
    dir=$(packageDir "$name")
    : > "$dir/releases.md"
    while IFS= read -r version; do
        [[ "$version" == *-* && "$next" != *-* ]] && continue
        isVersionInRange "$prev" "$next" "$version" || continue
        if [ "$count" -ge "$MAX_RELEASE_VERSIONS" ]; then
            note "release notes for $name stopped after $MAX_RELEASE_VERSIONS versions"
            break
        fi
        count=$((count + 1))
        if release=$(fetchRelease "$name" "$version" "$repo"); then
            appendReleaseNotes "$dir/releases.md" <<< "$release"
        else
            missing+=("$version")
        fi
    done < <(jq -r 'keys[] | select(. != "created" and . != "modified")' "$dir/time.json" 2> /dev/null | sort -rV)

    [ "${#missing[@]}" -eq 0 ] || note "no GitHub release in $repo for $name ${missing[*]}"
    finishReleaseNotes "$name" "$dir/releases.md"
}

diffTarballs() {
    local name=$1 prev=$2 next=$3 dir oldDir newDir
    dir=$(packageDir "$name")
    oldDir=$(extractTarball "$name" "$prev" "$dir")
    newDir=$(extractTarball "$name" "$next" "$dir")
    [ -n "$oldDir" ] && [ -n "$newDir" ] || return
    # Both versions sit side by side; diffing from their parent keeps paths short ("2.1.0/package/...").
    (cd "$(dirname "$oldDir")" && diff -r "$prev" "$next") | head -c "$MAX_DIFF_BYTES" > "$dir/tarball.diff"
    if [ "$(wc -c < "$dir/tarball.diff")" -ge "$MAX_DIFF_BYTES" ]; then
        note "tarball diff for $name truncated at $MAX_DIFF_BYTES bytes"
    fi
}

# --- GitHub Actions ---

# Prints the git ref for a version as Dependabot writes it ("4", "v4.1.0" or a commit SHA).
resolveActionRef() {
    local repo=$1 version=$2 ref
    for ref in "v${version#v}" "$version"; do
        gh api "repos/$repo/git/ref/tags/$ref" > /dev/null 2>&1 && {
            echo "$ref"
            return
        }
    done
    [[ "$version" =~ ^[0-9a-f]{40}$ ]] && echo "$version"
}

# Saves the action's metadata file (inputs, outputs, runtime) at one ref.
fetchActionYml() {
    local repo=$1 subPath=$2 ref=$3 target=$4 file
    for file in action.yml action.yaml; do
        gh api -H 'Accept: application/vnd.github.raw' "repos/$repo/contents/${subPath:+$subPath/}$file?ref=$ref" \
            > "$target" 2> /dev/null && return
    done
    rm -f "$target"
    note "no action.yml found in $repo${subPath:+/$subPath} at $ref"
}

# Release notes for every stable release in (prev, next], newest first, from the latest releases page.
collectActionReleaseNotes() {
    local name=$1 prev=$2 next=$3 repo=$4 dir release tag count=0
    dir=$(packageDir "$name")
    : > "$dir/releases.md"
    while IFS= read -r release; do
        tag=$(jq -r '.tag_name' <<< "$release")
        isVersionInRange "${prev#v}" "${next#v}" "${tag#v}" || continue
        if [ "$count" -ge "$MAX_RELEASE_VERSIONS" ]; then
            note "release notes for $name stopped after $MAX_RELEASE_VERSIONS versions"
            break
        fi
        count=$((count + 1))
        appendReleaseNotes "$dir/releases.md" <<< "$release"
    done < <(gh api "repos/$repo/releases?per_page=$MAX_ACTION_RELEASES_SCANNED" 2>> "$NOTES" |
        jq -c '.[] | select((.draft or .prerelease) | not)')

    [ "$count" -gt 0 ] || note "no GitHub releases found in $repo for $prev -> $next"
    finishReleaseNotes "$name" "$dir/releases.md"
}

# action.yml at both refs and its diff, commits and changed files between them, release notes, advisories.
collectActionUpdate() {
    local name=$1 prev=$2 next=$3 repo subPath dir prevRef nextRef newestVersion
    repo=$(cut -d/ -f1-2 <<< "$name")
    subPath=$(cut -s -d/ -f3- <<< "$name")
    dir=$(packageDir "$name")

    collectActionReleaseNotes "$name" "$prev" "$next" "$repo"
    # A bare major ("7") isn't a version advisories match on, so prefer the newest release in the range.
    newestVersion=$(grep -m1 '^## ' "$dir/releases.md" 2> /dev/null | sed 's/^## v\{0,1\}//')
    gh api -X GET /advisories -f ecosystem=actions -f affects="$repo@${newestVersion:-${next#v}}" \
        > "$dir/advisories-$next.json" 2>> "$NOTES" || note "advisory lookup failed: $repo@$next"

    prevRef=$(resolveActionRef "$repo" "$prev")
    nextRef=$(resolveActionRef "$repo" "$next")
    if [ -z "$prevRef" ] || [ -z "$nextRef" ]; then
        note "couldn't resolve tags for $repo $prev -> $next; no action.yml diff or compare"
        return
    fi

    fetchActionYml "$repo" "$subPath" "$prevRef" "$dir/action-$prevRef.yml"
    fetchActionYml "$repo" "$subPath" "$nextRef" "$dir/action-$nextRef.yml"
    if [ -f "$dir/action-$prevRef.yml" ] && [ -f "$dir/action-$nextRef.yml" ]; then
        diff -u --label "action-$prevRef.yml" --label "action-$nextRef.yml" \
            "$dir/action-$prevRef.yml" "$dir/action-$nextRef.yml" > "$dir/action-yml.diff"
    fi

    gh api "repos/$repo/compare/$prevRef...$nextRef" 2>> "$NOTES" |
        jq --argjson maxCommits "$MAX_COMPARE_COMMITS" --argjson maxFiles "$MAX_COMPARE_FILES" '{
            aheadBy: .ahead_by,
            totalFiles: (.files | length),
            commits: [.commits[] | {sha: .sha[0:7], author: .commit.author.name, message: (.commit.message | split("\n")[0])}]
                | .[-$maxCommits:],
            files: [.files[] | {filename, status, additions, deletions}] | .[0:$maxFiles]
        }' > "$dir/compare.json" || note "compare failed: $repo $prevRef...$nextRef"
}

collectActionUpdates() {
    while IFS=$'\t' read -r name prev next; do
        if ! isValidActionSpec "$name" "$next" || ! isValidActionSpec "$name" "$prev"; then
            note "skipped invalid action spec: $name $prev -> $next"
            continue
        fi
        collectActionUpdate "$name" "$prev" "$next"
    done < <(jq -r '.[] | [.dependencyName, .prevVersion, .newVersion] | @tsv' <<< "$DEPS_JSON")
}

# --- npm ---

readonly BASE_LOCKFILE="$RUNNER_TEMP/base-lock.json"
readonly HEAD_LOCKFILE='package-lock.json'

prepareBaseLockfile() {
    git show HEAD^1:package-lock.json > "$BASE_LOCKFILE" 2>> "$NOTES" || echo '{}' > "$BASE_LOCKFILE"
}

# Version of a top-level package in a lockfile, or nothing.
lockfileVersion() {
    jq -r --arg key "node_modules/$2" '.packages[$key].version // empty' "$1" 2> /dev/null
}

# Direct updates: metadata for both versions, a tarball diff and release notes.
# Versions come from the lockfiles, which is what actually gets installed; Dependabot's metadata can lag behind
# (seen after "@dependabot recreate": its YAML block kept the old target versions).
collectNpmUpdates() {
    local name prev next repo lockPrev lockNext
    while IFS=$'\t' read -r name prev next; do
        lockPrev=$(lockfileVersion "$BASE_LOCKFILE" "$name")
        lockNext=$(lockfileVersion "$HEAD_LOCKFILE" "$name")
        if [ -n "$lockNext" ] && [ "$lockNext" != "$next" ]; then
            note "$name: Dependabot metadata says $next, lockfile installs $lockNext; reviewing $lockNext"
            next=$lockNext
        fi
        if [ -n "$lockPrev" ] && [ "$lockPrev" != "$prev" ]; then
            note "$name: Dependabot metadata says previous $prev, base lockfile has $lockPrev; using $lockPrev"
            prev=$lockPrev
        fi
        if ! isValidSpec "$name" "$next" || { [ -n "$prev" ] && ! isValidSpec "$name" "$prev"; }; then
            note "skipped invalid package spec: $name $prev -> $next"
            continue
        fi
        collectMetadata "$name" "$next"
        if [ -n "$prev" ]; then
            collectMetadata "$name" "$prev"
            diffTarballs "$name" "$prev" "$next"
            repo=$(githubRepoOf "$(packageDir "$name")/meta-$next.json")
            if [ -n "$repo" ]; then
                collectReleaseNotes "$name" "$prev" "$next" "$repo"
            else
                note "no GitHub repository in npm metadata for $name; release notes not collected"
            fi
        fi
    done < <(jq -r '.[] | [.dependencyName, .prevVersion, .newVersion] | @tsv' <<< "$DEPS_JSON")
}

# Lockfile: changed entries, registry URLs, integrity, metadata for new packages.
# Bundled entries (inBundle) ship inside their parent's tarball, so npm records no resolved/integrity for them;
# the parent's integrity covers them, and they're left out of those two checks.
collectLockfileChecks() {
    jq -n --slurpfile base "$BASE_LOCKFILE" --slurpfile head "$HEAD_LOCKFILE" '
        ($base[0].packages // {}) as $b
        | [ ($head[0].packages // {}) | to_entries[]
            | select(.key != "" and (.value.link // false | not))
            | select(($b[.key].version // null) != .value.version)
            | { path: .key,
                name: (.value.name // (.key | sub("^.*node_modules/"; ""))),
                from: ($b[.key].version // null),
                to: .value.version,
                inBundle: (.value.inBundle // false),
                resolved: .value.resolved,
                integrity: .value.integrity } ]' > "$OUT_DIR/lockfile-changes.json"

    jq '[.[] | select(.inBundle | not) | select((.resolved // "") | startswith("'"$REGISTRY_PREFIX"'") | not)]' \
        "$OUT_DIR/lockfile-changes.json" > "$OUT_DIR/lockfile-unexpected-resolved.json"

    : > "$OUT_DIR/lockfile-integrity-mismatches.txt"
    lookups=0
    while IFS=$'\t' read -r name from to integrity; do
        if [ "$lookups" -ge "$MAX_LOCKFILE_LOOKUPS" ]; then
            note "lockfile checks stopped after $MAX_LOCKFILE_LOOKUPS packages"
            break
        fi
        isValidSpec "$name" "$to" || { note "skipped invalid lockfile entry: $name@$to"; continue; }
        lookups=$((lookups + 1))
        registryIntegrity=$(npm view "$name@$to" dist.integrity 2>> "$NOTES")
        if [ "$registryIntegrity" != "$integrity" ]; then
            echo "$name@$to lockfile=$integrity registry=${registryIntegrity:-none}" >> "$OUT_DIR/lockfile-integrity-mismatches.txt"
        fi
        [ -z "$from" ] && collectMetadata "$name" "$to"
    # Riskiest first, so the limit cuts off the least interesting entries: new packages, then major bumps.
    done < <(jq -r '[.[] | select(.inBundle | not)]
        | unique_by(.name + "@" + .to)
        | sort_by(if .from == null then 0
                  elif (.from | split(".")[0]) != (.to | split(".")[0]) then 1
                  else 2 end)
        | .[] | [.name, (.from // ""), .to, (.integrity // "")] | @tsv' "$OUT_DIR/lockfile-changes.json")
}

# --- Main ---
gh pr view "$PR_NUMBER" --json title,body,files > "$OUT_DIR/pr.json" 2>> "$NOTES" || note "gh pr view failed"
gh pr diff "$PR_NUMBER" > "$OUT_DIR/pr.diff" 2>> "$NOTES" || note "gh pr diff failed"
echo "$DEPS_JSON" > "$OUT_DIR/dependabot-metadata.json"

case "$PACKAGE_ECOSYSTEM" in
    "$NPM_ECOSYSTEM")
        prepareBaseLockfile
        collectNpmUpdates
        collectLockfileChecks
        ;;
    "$ACTIONS_ECOSYSTEM")
        collectActionUpdates
        ;;
    *)
        note "ecosystem '$PACKAGE_ECOSYSTEM' isn't supported; only the PR and Dependabot metadata were collected"
        ;;
esac

echo "Collected into $OUT_DIR"
