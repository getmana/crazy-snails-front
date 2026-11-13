#!/usr/bin/env bash
# Collects everything the Dependabot review needs into $OUT_DIR, so the Claude step only reads files.
# Never runs code from the updated packages: tarballs are only downloaded, extracted and diffed.
#
# Env: PR_NUMBER, DEPS_JSON (fetch-metadata's updated-dependencies-json), OUT_DIR, GH_TOKEN.
# Expects the PR merge commit checked out with fetch-depth >= 2 (HEAD^1 is the base branch).
set -uo pipefail

readonly REGISTRY_PREFIX='https://registry.npmjs.org/'
readonly MAX_TARBALL_BYTES=$((25 * 1024 * 1024))
readonly MAX_DIFF_BYTES=$((200 * 1024))
readonly MAX_LOCKFILE_LOOKUPS=60
readonly NAME_PATTERN='^(@[a-z0-9][a-z0-9._~-]*/)?[a-z0-9][a-z0-9._~-]*$'
readonly VERSION_PATTERN='^[0-9A-Za-z][0-9A-Za-z.+-]*$'

mkdir -p "$OUT_DIR/packages"
NOTES="$OUT_DIR/notes.txt"
: > "$NOTES"

note() { echo "$*" >> "$NOTES"; }

isValidSpec() { [[ "$1" =~ $NAME_PATTERN ]] && [[ "$2" =~ $VERSION_PATTERN ]]; }

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

# --- PR ---
gh pr view "$PR_NUMBER" --json title,body,files > "$OUT_DIR/pr.json" 2>> "$NOTES" || note "gh pr view failed"
gh pr diff "$PR_NUMBER" > "$OUT_DIR/pr.diff" 2>> "$NOTES" || note "gh pr diff failed"
echo "$DEPS_JSON" > "$OUT_DIR/dependabot-metadata.json"

# --- Direct updates: metadata for both versions and a tarball diff ---
while IFS=$'\t' read -r name prev next; do
    if ! isValidSpec "$name" "$next" || { [ -n "$prev" ] && ! isValidSpec "$name" "$prev"; }; then
        note "skipped invalid package spec: $name $prev -> $next"
        continue
    fi
    collectMetadata "$name" "$next"
    if [ -n "$prev" ]; then
        collectMetadata "$name" "$prev"
        diffTarballs "$name" "$prev" "$next"
    fi
done < <(jq -r '.[] | [.dependencyName, .prevVersion, .newVersion] | @tsv' <<< "$DEPS_JSON")

# --- Lockfile: changed entries, registry URLs, integrity, new packages ---
git show HEAD^1:package-lock.json > "$RUNNER_TEMP/base-lock.json" 2>> "$NOTES" || echo '{}' > "$RUNNER_TEMP/base-lock.json"
jq -n --slurpfile base "$RUNNER_TEMP/base-lock.json" --slurpfile head package-lock.json '
    ($base[0].packages // {}) as $b
    | [ ($head[0].packages // {}) | to_entries[]
        | select(.key != "" and (.value.link // false | not))
        | select(($b[.key].version // null) != .value.version)
        | { path: .key,
            name: (.value.name // (.key | sub("^.*node_modules/"; ""))),
            from: ($b[.key].version // null),
            to: .value.version,
            resolved: .value.resolved,
            integrity: .value.integrity } ]' > "$OUT_DIR/lockfile-changes.json"

jq '[.[] | select((.resolved // "") | startswith("'"$REGISTRY_PREFIX"'") | not)]' \
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
done < <(jq -r 'unique_by(.name + "@" + .to)[] | [.name, (.from // ""), .to, (.integrity // "")] | @tsv' "$OUT_DIR/lockfile-changes.json")

echo "Collected into $OUT_DIR"
