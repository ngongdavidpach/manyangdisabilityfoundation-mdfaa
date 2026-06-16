# Plan

## 1. Hide Sign in from the navbar (desktop + mobile)

`src/ported/components/Navbar.tsx`
- Remove the desktop `Sign in` `<Link>` block (only shown when `!isAuthenticated`).
- Remove the mobile `Sign in` button in the mobile menu's auth branch.
- Keep everything else intact: signed-in user menu, Donate button, Request Aid flow that still redirects to `/auth/login` when triggered, and the user-menu's Sign Out.

Users can still reach `/auth/login` directly or via protected actions (Request Aid, dashboard, admin) — only the visible navbar entry is removed.

## 2. Confirm/expose existing admin controls for pages

Admins already have (no changes needed, just confirming surface in the Admin Console):
- **Navigation visibility & order** — `NavigationPagesEditor` (toggle each nav item on/off, reorder).
- **Page content** — `PageSettingsEditor` (hero text/image, headings, intros, section toggles for Home, About, Programs, Gallery, News, Events, Get Involved, Donate, Request, Footer/Contact, Site).

## 3. New: per-page SEO management

Add an editable SEO block (title, description, og:image, optional canonical/noindex) for each public page, stored in `page_settings.content.seo`, and consumed by the routes' `head()`.

### Editor
`src/ported/components/admin/PageSettingsEditor.tsx`
- Append four SEO fields to every page entry in `PAGES`:
  - `seo.title` (text), `seo.description` (textarea), `seo.ogImage` (image), `seo.noindex` (bool).

### Server fn to read SEO
`src/lib/pageSeo.functions.ts` (new) — public `getPageSeo({ pageKey })` server fn using the server publishable client to read `page_settings.content.seo` for one key. Returns `{ title?, description?, ogImage?, noindex? }` or `{}`.

Add a narrow RLS `TO anon` SELECT policy on `page_settings` (already has admin policies; need to confirm anon read access via migration if missing) so the publishable client can read it.

### Route wiring (public pages)
For each public route — `index.tsx`, `about.tsx`, `programs.tsx`, `gallery.tsx`, `news.tsx`, `get-involved.tsx`, `donate.tsx`, `request.tsx`:
- Add a `loader` that calls `getPageSeo({ pageKey: '<key>' })` via `queryClient.ensureQueryData`, with a graceful fallback to `{}` on error.
- Update `head({ loaderData })` to merge loader SEO over the existing static defaults: `title`, `description`, `og:title`, `og:description`, `og:image` / `twitter:image`, and `{ name: 'robots', content: 'noindex' }` when `seo.noindex` is true.
- Keep current canonical/og:url logic untouched.

Each loader must set `errorComponent` and `notFoundComponent` (template-standard fallback) per project rules.

## Technical Details

- **Files edited**: `src/ported/components/Navbar.tsx`, `src/ported/components/admin/PageSettingsEditor.tsx`, `src/routes/index.tsx`, `src/routes/about.tsx`, `src/routes/programs.tsx`, `src/routes/gallery.tsx`, `src/routes/news.tsx`, `src/routes/get-involved.tsx`, `src/routes/donate.tsx`, `src/routes/request.tsx`.
- **Files created**: `src/lib/pageSeo.functions.ts`.
- **Migration**: add `GRANT SELECT ON public.page_settings TO anon` and a `TO anon` SELECT RLS policy if not already present, so SSR can read SEO without a session. Verify current policies first; only add what's missing.
- **No changes** to auth, user roles, `__root.tsx` defaults, sitemap, or the existing `NavigationPagesEditor`/admin shell — admins already get to the SEO fields through the existing "Page settings" tab.

## Out of scope
- Drag-and-drop page reordering beyond what `NavigationPagesEditor` already supports.
- A WYSIWYG/block editor — content edits stay in the existing structured form.
- Changing how Request Aid / dashboard / admin routes redirect to `/auth/login`.
