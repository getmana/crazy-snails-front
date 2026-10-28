# CrazySnails — User site template for the Basimtuklet platform

**Backend repo:** [crazy-snails-nest](https://github.com/getmana/crazy-snails-nest)

---

## What is this?

This is the reusable user-site template for Basimtuklet — a traveller's platform where each user gets their own subdomain (e.g., `crazysnails.basimtuklet.com`) to publish travel photo-stories and albums. The template is the same for every user; personalisation (logo, theme colours, fonts, background photos, custom section layout) is configured through the admin panel. CrazySnails is the first instance, built for CrazySnails.

The broader Basimtuklet platform — where albums across all users can be browsed by activity type or map location — is a separate future project. For full product context, see the [backend README](https://github.com/getmana/crazy-snails-nest).

Built as a FE repo to NestJS BE project to grow API design skills through real product development (the focus is on the BE repo)

## Tech stack

- **Next.js 15** + **React 19** (App Router)
- **TypeScript**
- **Tailwind CSS v4** — CSS-first configuration; all design tokens defined in `globals.css`, no `tailwind.config.js`
- **shadcn/ui** — component primitives (new-york style); dark mode scoped to the admin panel
- **react-hook-form** + **Zod** — form state and validation
- **Tiptap** — rich-text editor for story, album and photo-note descriptions (stored as JSON)
- **dnd-kit** — drag-and-drop reordering of uploaded photos
- **iron-session** — encrypted, signed session cookie (server-side only)
- **next-themes** — dark/light toggle for the admin panel
- **Radix UI** — accessible primitives underlying shadcn components
- **SVGR** — SVG files imported as typed React components with a11y support

## Architecture highlights

**BFF (Backend-For-Frontend) layer** — Route Handlers (`/api/sign-in`, `/api/sign-up`, `/api/photos`) and Server Actions act as a secure proxy to the external API. The browser never calls the backend API directly (only uploaded images are loaded from the backend's `/uploads`); session tokens stay server-side in an encrypted iron-session cookie.

**Composable middleware pipeline** — instead of a monolithic `middleware.ts`, each concern (locale detection, session validation, token refresh, route guards) is a self-contained module in `src/middlewares/` with its own `match` pattern. The pipeline runs them in sequence and short-circuits on redirect.

**Dual token-refresh safety net** — access tokens are refreshed both proactively in middleware (2-minute lookahead window before expiry, JWT decoded via `jose`) and reactively in `fetchWithAuth` (on 401, with a `refreshInProgress` deduplication lock to prevent concurrent refresh races).

**Custom dictionary-based i18n** (no library) — locale detected from cookie then `Accept-Language` header, embedded in the URL as `/[locale]/...`, propagated to Server Actions via a custom `x-locale` request header injected by middleware. Dictionaries are lazy-loaded and delivered via React Context. Locale preference is also persisted per-user on the backend.

**Server Actions for mutations and authenticated reads** — creating, updating, publishing and deleting stories and albums, updating the user profile, and loading/saving photo notes run as `'use server'` actions. Actions that navigate on success `redirect()` with a `?toast=` key; actions called mid-edit (like saving a photo note) don't navigate.

**Domain-grouped components** — `src/components/` is organised by domain (`story/`, `album/`, `auth/`, `user/`, `home/`) plus shared groups:

- `layout/` for app chrome,
- `shared/` for domain-agnostic pieces,
- `fields/` for form inputs,
- `ui/` for shadcn primitives.

A component with private parts gets its own PascalCase folder (`EditAlbumForm/EditAlbumForm.tsx` with its schema next to it and child components in a flat `components/` folder, at most one level deep).

A single barrel, `src/components/index.ts`, exports what route files in `app/` use; code inside `components/` imports by full path, which an ESLint rule enforces to keep the barrel from creating circular imports.

Admin routes split each entity into a read-only view (`/dashboard/stories/[id]`) and a separate edit page (`/dashboard/stories/[id]/edit`).

## Current state

**Implemented**

- Public site: home page (About, Albums preview, Stories preview, Grandpa section), albums listing, stories listing + single story page, Grandpa page, sign-in, sign-up
- Admin panel (protected): dashboard, edit user profile
- Admin — stories: create, list, read-only view, edit (multilingual title/subtitle/rich-text description; hero, pair, gallery and carousel photo blocks with captions), publish, delete
- Admin — albums: create (activity types, countries, date range, multilingual fields), list, read-only view, edit (rich-text description, photos with cover selection, per-photo notes), publish, delete

**In progress**

- Photo upload and drag-and-drop reordering canvas — partly done: photos upload and reorder by drag-and-drop inside the story and album edit forms; the standalone photo pages (list / upload) are not built yet

**Planned**

- Custom section configuration
- Per-user theming controls (logo, colours, fonts, backgrounds)
- Automated tests (see [Testing](#testing))

## Running locally

The app needs the NestJS backend running locally — `CS_API` points at it. Set it up first by following the **Running locally** section of the [crazy-snails-nest README](https://github.com/getmana/crazy-snails-nest#running-locally).

```bash
npm install
```

Create a `.env.local` file:

```
CS_API=http://localhost:4000              # backend API, used server-side
NEXT_PUBLIC_CS_API=http://localhost:4000  # same backend, used in the browser to load uploaded images
SESSION_SECRET=<random string, min 32 chars>
SITE_OWNER_ID=<backend user id whose public stories and albums this site shows>
```

`4000` matches the `PORT` in the backend's example `.env`; change both if you run the backend elsewhere.

```bash
npm run dev
```

Before considering a change done, run `npx tsc --noEmit`, `npm run lint` and `npm run build`.

## Testing

There are no automated tests yet. The plan:

- **Unit tests** for utilities and hooks — localized-field resolution, payload building, photo-upload state (`usePhotoUpload`)
- **Component tests** for form behaviour — validation, and when Save / Publish / Delete are enabled
- **End-to-end tests** for the main admin flows against a running backend — sign in, create, edit, publish and delete a story and an album

Tooling is not chosen yet; Jest + React Testing Library and Playwright are the likely candidates.

## CI and automation

- **CI** (`.github/workflows/ci.yml`) — runs on every pull request and on pushes to `main`: installs dependencies with `npm ci` (Node version from `.nvmrc`), then runs `npm run lint` and `npm run build`. `next build` also type-checks the project. The build reads `SESSION_SECRET` from a repository secret.
- **Branch rules on `main`** — a repository ruleset requires the CI `build` job to pass, with the branch up to date with `main`, before changes land. Force-pushes and deleting `main` are blocked.
- **Dependabot** (`.github/dependabot.yml`) — opens weekly npm update PRs, grouping minor and patch updates into one PR. They go through the same CI check.

Tests aren't part of CI yet; see [Testing](#testing).

## License

The source code is licensed under the [MIT License](LICENSE).

The name **Basimtuklet**, the name and logo of **CrazySnails**, and any associated content (text, photographs, design assets) are the property of Anastasia Hetman © 2025. All rights reserved. The MIT license does not extend to these materials. If you fork this repository, replace all branding with your own.
