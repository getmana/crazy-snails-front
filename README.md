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
- **iron-session** — encrypted, signed session cookie (server-side only)
- **next-themes** — dark/light toggle for the admin panel
- **Radix UI** — accessible primitives underlying shadcn components
- **SVGR** — SVG files imported as typed React components with a11y support

## Architecture highlights

**BFF (Backend-For-Frontend) layer** — Route Handlers (`/api/sign-in`, `/api/sign-up`, `/api/user-update`) act as a secure proxy to the external API. The browser never calls the backend directly; session tokens stay server-side in an encrypted iron-session cookie.

**Composable middleware pipeline** — instead of a monolithic `middleware.ts`, each concern (locale detection, session validation, token refresh, route guards) is a self-contained module in `src/middlewares/` with its own `match` pattern. The pipeline runs them in sequence and short-circuits on redirect.

**Dual token-refresh safety net** — access tokens are refreshed both proactively in middleware (2-minute lookahead window before expiry, JWT decoded via `jose`) and reactively in `fetchWithAuth` (on 401, with a `refreshInProgress` deduplication lock to prevent concurrent refresh races).

**Custom dictionary-based i18n** (no library) — locale detected from cookie then `Accept-Language` header, embedded in the URL as `/[locale]/...`, propagated to Server Actions via a custom `x-locale` request header injected by middleware. Dictionaries are lazy-loaded and delivered via React Context. Locale preference is also persisted per-user on the backend.

**Server Actions for mutations** — album creation and other writes run as `'use server'` actions with `redirect()` on success, keeping mutation logic off the client bundle.

## Current state

**Implemented**
- Public site: home page (About, Albums preview, Stories preview, Grandpa section), albums listing, stories listing, sign-in, sign-up
- Admin panel (protected): dashboard, create album (activity types, countries, date range, multilingual fields), album list + single album view, edit user profile

**Planned / in progress**
- Photo upload and drag-and-drop reordering canvas
- Stories creation and management
- Custom section configuration
- Per-user theming controls (logo, colours, fonts, backgrounds)

## Running locally

```bash
npm install
```

Create a `.env.local` file:
```
CS_API=http://localhost:3001
SESSION_SECRET=<random string, min 32 chars>
```

```bash
npm run dev
```

## License

The source code is licensed under the [MIT License](LICENSE).

The name **Basimtuklet**, the name and logo of **CrazySnails**, and any associated content (text, photographs, design assets) are the property of Anastasia Hetman © 2025. All rights reserved. The MIT license does not extend to these materials. If you fork this repository, replace all branding with your own.
