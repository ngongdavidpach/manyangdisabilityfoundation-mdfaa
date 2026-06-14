# Code & Pages Review — Recommendations

Below is a focused review of the current app (a ported SPA mounted at `/` inside a TanStack Start shell) with concrete, prioritized recommendations. Nothing has been changed yet — pick which items to implement.

## 1. Routing architecture (highest impact)

**Today:** Every page is rendered by `src/ported/App.tsx` via a `currentPage` state string and a `switch`. The whole app lives at `/`. TanStack Router is essentially unused.

**Problems this creates:**
- No real URLs — users can't bookmark `/about`, `/programs`, `/news/<slug>`, share links, or use back/forward reliably.
- Zero SEO for sub-pages: only `/` has metadata; About / Programs / News / Gallery all share the home page's title and description.
- No per-route OG image, no social previews for individual news articles.
- News detail pages (`news-<id>`) are encoded into one string instead of a real route with params.
- Browser refresh on a "subpage" always returns to home.

**Recommendation:** Split the SPA into real TanStack routes:
- `src/routes/index.tsx` → Home
- `src/routes/about.tsx`, `programs.tsx`, `gallery.tsx`, `get-involved.tsx`, `donate.tsx`
- `src/routes/news.tsx` (list) + `src/routes/news.$slug.tsx` (detail)
- `src/routes/_authenticated.tsx` layout gating `dashboard`, `request`
- `src/routes/admin.tsx` layout gating `admin-dashboard`
- `src/routes/auth/login.tsx`, `auth/register.tsx`
- Each route file owns its own `head()` (title, description, og:title/description, og:image where relevant). News detail derives og:image from loader data.
- Replace `currentPage`/`setCurrentPage` with `<Link>` and `useNavigate`.

This is the single biggest quality improvement available and unblocks SEO, sharing, analytics, and proper auth gating.

## 2. SEO

Independent of the routing refactor:
- Home `<title>` is 79 chars — trim to <60 (e.g. "Manyang Disability Foundation — Mobility, Health, Education").
- Add a single H1 per page (verify in HomeView/AboutView/etc.).
- Add JSON-LD `NGO` / `Organization` schema on Home and `NewsArticle` on news detail.
- Add `<link rel="canonical">` per route once real routes exist.
- Add alt text audits across `GalleryView` and Foundation Insight covers.

## 3. Auth & authorization hardening

- Hidden Ctrl+Shift+L shortcut to open login is fine, but the admin dashboard relying only on `hasAdminAccess()` from client context is risky if `user_roles` isn't enforced via RLS. Verify every admin-writable table (`page_settings`, `media_assets`, `news_articles`, `events`, `staff_members`, foundation insight table) has RLS policies that gate writes via `public.has_role(auth.uid(), 'admin')`. Run the security scanner to confirm.
- Idle auto-logout reads from `page_settings.site.idleLogoutMinutes` — good. Consider a minimum (e.g. 1 min) and surface it in the Settings tab UI rather than only Page Content.

## 4. Admin dashboard UX

- `Settings` tab currently points users to "Page Content → Site / Security" and "Page Content → Footer & Contact". Pull those panels directly into Settings so admins don't have to hop tabs.
- `NavigationPagesEditor` and `PageSettingsEditor` both write `page_settings` rows that contain overlapping `show*` flags. Pick one source of truth — recommend: navigation visibility/order lives only in `page_settings.navigation`; remove the duplicate toggles from `PageSettingsEditor`.
- Overview stat cards are good; add a "Recently updated" feed (last 5 changes across news/events/insight) for quick context.
- Add empty-state hints in each manager (News, Events, Staff, Gallery, Insight) when count = 0.

## 5. Public pages

- **Navbar**: `request` is gated as protected, but `dashboard` and `admin-dashboard` links only appear inside the user menu. Add a clear "Sign in" CTA in the navbar when unauthenticated (currently the only entry is Ctrl+Shift+L or clicking Request).
- **Footer**: confirm Quick Links honors the same `navigation` `page_settings` (you already added this). Add a "Last updated" or copyright year that's not hardcoded.
- **HomeView**: ensure the Foundation Insight section degrades gracefully when no insight rows exist (empty state, not an empty card).
- **Mobile**: verify the top blue micro-bar (emergency line + email) wraps cleanly on <360 px.

## 6. Data loading patterns

The ported app uses ad-hoc `useEffect + supabase.from(...).then(...)` everywhere (Navbar, Footer, AdminDashboard, NavigationPagesEditor, HomeView, etc.). Each mount re-fetches.

**Recommendation:** Standardize on the existing `usePageSettings` hook for all `page_settings` reads, and introduce a similar `useTable` helper or adopt TanStack Query (already in the template) for `news`, `events`, `staff`, `media_assets`. This gives caching, deduping, and SWR for free, and removes the "navbar flickers on every page change" feel.

## 7. Code organization

- The whole app is namespaced under `src/ported/`. After the routing refactor, flatten: views → `src/routes/*`, shared components → `src/components/`, hooks → `src/hooks/`, lib → `src/lib/`. Drop the `ported/` prefix.
- `NAV_ITEM_DEFS` and `resolveNavOrder` are exported from a UI component (`NavigationPagesEditor.tsx`) and imported by `Navbar` and `Footer`. Move them to `src/ported/lib/navItems.ts` so admin UI isn't a dependency of public chrome.
- `videoEmbed.ts`, `imageOptimize.ts`, `storage.ts` are good — keep this pattern.

## 8. Performance

- HomeView likely renders many images; add `loading="lazy"` and `decoding="async"` on non-hero images; use `<picture>` or AVIF/WebP via `imageOptimize`.
- The logo is referenced as `/images/logo.png` from `public/` — fine, but the Foundation Insight cover image should go through Supabase Storage transforms (resize on the fly) instead of full-resolution downloads.

## 9. Suggested execution order

1. **Security scan + RLS audit** (fast, blocking).
2. **Real routes** (biggest UX/SEO win).
3. **Per-route SEO metadata + JSON-LD**.
4. **Consolidate Settings tab + remove duplicate nav toggles in PageSettingsEditor**.
5. **Adopt TanStack Query for tables**, drop ad-hoc `useEffect` fetches.
6. **Flatten `src/ported/` namespace**.

---

Tell me which items to take on (e.g. "do 1, 2, 4" or "start with routing only") and I'll come back with a concrete implementation plan and the file-level changes.
