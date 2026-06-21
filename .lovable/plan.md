## Context

Your database is already live on Lovable Cloud — there's nothing to "sync." All real content tables exist and most views already read from them. Only two pockets of hardcoded data remain in the app.

## What's still hardcoded

1. **`FOUNDATION_INFO`** (org name, mission, vision, email, phone, address, socials) — used in `Navbar`, `AboutView`, `DonateView`, `GetInvolvedView`, `RequestView`.
2. **`NEWS_ARTICLES`** import in `HomeView.tsx` — referenced but the array is already empty, so the "Latest News" section on the homepage renders nothing.

Everything else (news pages, events, staff, gallery, programs grids, donations, requests, volunteers, contact messages) already uses Supabase.

## Plan

### 1. Make `FOUNDATION_INFO` editable & live-loaded
- Add a `foundation` row in `page_settings` (JSON shape mirrors `FOUNDATION_INFO`: name, shortName, tagline, mission, vision, email, phone, altPhone, address, workingHours, socials).
- Create a small `useFoundationInfo()` hook wrapping `usePageSettings("foundation", FOUNDATION_INFO)` so the static object becomes the fallback and the DB value wins once present.
- Replace direct `FOUNDATION_INFO.*` reads in `Navbar`, `AboutView`, `DonateView`, `GetInvolvedView`, `RequestView` with values from the hook.
- Add a **Foundation Info** editor tab in the admin (`AdminDashboardView`) — simple form (name, tagline, mission, vision, contact, socials) that saves via the hook.

### 2. Wire `HomeView` "Latest News" to live data
- Remove the `NEWS_ARTICLES` import.
- Fetch the 3 latest published rows from `news_articles` (ordered by `published_at` desc) via `supabase.from("news_articles")…limit(3)`.
- Render the same card markup, mapping DB columns (`title`, `summary`, `cover_image_url`, `published_at`, `slug`) to the existing UI; link each card to `/news/$slug`.
- Show a friendly empty state when no articles exist yet.

### 3. Verify CRUD coverage in the admin
- Confirm the existing admin managers all already write through Supabase (they do: `NewsManager`, `EventsManager`, `StaffManager`, `GalleryManager`, `DonationsManager`, `ExpensesManager`, `ContactsManager`, `PageSettingsEditor`, `NavigationPagesEditor`). No changes needed beyond adding the new Foundation Info editor in step 1.

### 4. Clean up
- Keep `foundationData.ts` only for type definitions and the `FOUNDATION_INFO` fallback constant; remove the now-unused empty arrays (`PROGRAMS`, `IMPACT_METRICS`, `SUCCESS_STORIES`, `FAQS`, `GALLERY_IMAGES`, `FOUNDATION_EVENTS`, `NEWS_ARTICLES`) so the file can't drift back into a placeholder source.

### Out of scope
- No schema migration is required — `page_settings` already exists with the right shape and policies. We just write a new row through the admin UI.
- No change to authentication, RLS, or other tables.

## Technical notes
- Files touched: `src/ported/hooks/useFoundationInfo.ts` (new), `src/ported/components/Navbar.tsx`, `src/ported/components/views/{Home,About,Donate,GetInvolved,Request}View.tsx`, `src/ported/components/views/AdminDashboardView.tsx`, a new `src/ported/components/admin/FoundationInfoEditor.tsx`, and a slim-down of `src/ported/data/foundationData.ts`.
- All reads use the existing `@/integrations/supabase/client` browser client; writes go through `usePageSettings.save()` which is already RLS-protected to admins.