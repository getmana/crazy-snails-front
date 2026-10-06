# cs-front

Next.js 15 (App Router) + React 19 admin/public site for travel stories and albums, backed by a separate NestJS
API (`cs-nest`).

## Verifying a change

Run all three before considering anything done: `npx tsc --noEmit`, `npm run lint`, `npm run build`.
`npm run lint` also runs Prettier via `eslint-plugin-prettier`; `npx eslint --fix <file>` resolves most formatting
complaints on its own.

## Components structure

`src/components/` is grouped by domain, plus a few shared groups:

| Folder | Holds |
|---|---|
| `album/`, `story/` | everything specific to that entity: views, create/edit forms, dialogs, list rows/cards |
| `auth/` | sign-in / sign-up forms |
| `user/` | user account forms |
| `home/` | public home page sections |
| `layout/` | app chrome mounted by layouts: header, footer, admin sidebar, theme, locale switcher, toasts |
| `shared/` | generic presentational pieces with no domain knowledge (`Heading`, `Icon`, `ErrorText`, ...) |
| `fields/` | generic form inputs, including `PhotoUploadField` |
| `ui/` | shadcn-generated — don't restructure or rename |

No folders by kind of component (`forms/`, `dialogs/`): a form or dialog lives in the domain it belongs to.

### Folder rules

- **lowercase folder = a group; PascalCase folder = one component plus its private parts.**
- A component gets its own folder only once it has private parts; until then it's a flat file in its group.
- Inside a component folder: `Component.tsx` (no `index.ts`); private child components in `components/`; other
  private files (schema, config, types, single-consumer hooks) flat at the folder root.
- **A `components/` folder holds flat files only** — nesting is at most one level deep. When a child gets children
  of its own, either:
  - **flatten** them into the same `components/` folder when they're just parts of the same parent (siblings may
    import each other) — e.g. `fields/PhotoUploadField/components/` holds `SortablePhotoTile` and the `PhotoTile`
    it renders; or
  - **move the child up** to its group as a component folder of its own when it's a unit of its own — e.g.
    `StoryCarousel` (used by `StoryContent`) lives at `story/StoryCarousel/` with `components/CarouselCaption.tsx`.

```
story/
  StoryContent/
    StoryContent.tsx
    components/  StoryHero.tsx  StoryPair.tsx  StoryGallery.tsx
  StoryCarousel/
    StoryCarousel.tsx
    components/  CarouselCaption.tsx
```

- **Hooks:** a hook with a single consumer lives next to that component; `src/hooks/` is only for shared hooks.
- Private children are never exported from the barrel.

### Barrel

`src/components/index.ts` is the only barrel. It exports what `app/` uses, grouped by source folder, alphabetical
within each group.

Code inside `src/components/` never imports from `@/components` (enforced by ESLint `no-restricted-imports`) —
the barrel imports those files back, so that would create circular imports. Use relative paths for private
children and full alias paths (`@/components/shared/Heading`) for everything else. `app/` imports
components through the barrel. `utils/`, `types/` and `context/` never import the barrel — components import them,
so it would create a cycle; they use full paths instead.

### Naming

- A component's name must make sense without its folder path — editor tabs, React DevTools, stack traces and grep
  show only the name.
- Add the domain prefix when the bare name is generic (`StoryHero`, `StoryGallery`, not `Hero`, `Gallery`).
  Already-specific names stay unprefixed (`CarouselCaption`, `CollapsibleMenuItem`).
- Files are named exactly like their main export, same casing: components and other PascalCase exports are
  PascalCase (`StoryRow.tsx`, `EditAlbumSchema.ts`); functions, hooks and actions are camelCase (`updateAlbum.ts`,
  `usePhotoUpload.ts`). No kebab-case.
- Exception: file names a framework or tool requires stay as they are — Next.js route files (`page.tsx`,
  `layout.tsx`, `not-found.tsx`, …) and shadcn-generated files (`components/ui/*`, `hooks/use-mobile.ts`). Don't
  rename them; `npx shadcn add` will keep creating more.

## Types

- `src/types/` holds only types shared across folders (domain models, API shapes, UI shapes like
  `SelectOption` or `ExistingPhoto`). A type used by one component or folder stays next to it; don't export a type
  nobody else imports.
- Component props: always a named `type <Component>Props = { ... }` right above the component, never inline in
  the signature; not exported unless another file needs it (prefer `React.ComponentProps<typeof X>` there).
- Use `type`, not `interface`.

## Constants

`src/constants/` holds shared constants (e.g. photo-count limits in `photoLimits.ts`). Import them only through the
`@/constants` barrel — full paths like `@/constants/images` are rejected by ESLint `no-restricted-imports`.

## Forms

- The zod schema lives next to its form (`EditAlbumForm.tsx` + `EditAlbumSchema.ts`); forms use react-hook-form
  with `zodResolver`.
- EN/UK fields go in a `Tabs` block, one tab per locale, the current locale first:
  `[locale, ...i18n.locales.filter((l) => l !== locale)]`. Labels inside a tab are generic ("Title", not
  "Title (English)") — the tab carries the locale.

## Server Actions

- `src/actions/<verb><Entity>.ts`, `'use server'`. A mutation returns `{ data, message }` / `{ message }`.
- When a mutation should navigate on success, add an outer `...WithRedirect` wrapper that calls it, returns the
  error string on failure, or `redirect()`s to `<path>?toast=<key>` on success. Not every action needs one — an
  action called mid-edit (e.g. saving one photo's note from a dialog) must not navigate.
- Every new `?toast=<key>` needs an entry in `ToastMessageMap` (`components/layout/ToastMessage.tsx`), mapped to a
  string under `toastMessages` in the dictionaries.
- Server Actions are also used for authenticated reads triggered by user interaction (e.g. loading a note when a
  dialog opens). Their arguments must be serializable, so they can't take an `AbortSignal` — a hook that needs to
  discard a stale result uses a plain flag instead of cancelling the request.

## Photo upload

`PhotoTile` stays presentational and generic — new per-tile controls (edit, drag handle, cover badge, disabled
hint) are passed in as optional props from the top, never special-cased inside it for one entity.

## i18n / dictionaries

`src/dictionaries/en.json` and `uk.json` must stay structurally identical — same keys, same nesting. One namespace
per form/feature (`editAlbumForm`, `editNoteForm`, ...); don't share a key across namespaces just because the
strings currently match — they're allowed to diverge later.

## Styling

shadcn/ui ("new-york" style) + Tailwind v4. Tailwind v4 has a built-in named width scale (`3xs` … `7xl`) usable as
`w-*`/`max-w-*` (e.g. `lg:w-2xl`) — it's real, not a typo.
