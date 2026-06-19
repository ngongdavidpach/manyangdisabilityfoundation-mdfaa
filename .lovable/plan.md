## Plan

### 1. Open `/request` to the public (no staff login)
- `src/routes/request.tsx`: remove `ProtectedRoute` wrapper so anyone can submit an aid request without signing in. Keep `robots: noindex`.
- Drop the unused `ProtectedRoute` import.

### 2. Fix ProgramsView runtime crash
- `ProgramsView.tsx` crashes at `selectedStory.date` when `successStories` is empty (DB has been wiped, so `selectedStory` is `null`).
- Wrap the entire "Success Story Deep Spotlight" `<section>` with `{successStories.length > 0 && selectedStory && ( ... )}` so it renders only when stories exist.

### 3. Make country selector alphabetical (and consistent)
- Replace the hard-coded 5-option `<select name="country">` in `RequestView.tsx` (Step 1) with the existing `CountrySelect` component, which already loads the full country list sorted A→Z via `localeCompare`.
- Confirm `GetInvolvedView` already uses `CountrySelect` (it does) — no change needed there.

### 4. Get-involved safety
- No runtime errors are currently logged, but guard against admin-saved `availableSkills` that lack a React `icon` component: when mapping skills, fall back to a default icon (`Sparkles`) if `skill.icon` is missing/not a function. Prevents a future crash once admins edit that section.

### 5. Show hidden pages in navbar + publish all pages
- New migration: `UPDATE public.page_settings SET published = true` for every existing row, and seed any missing rows for the standard page keys (`home`, `about`, `programs`, `gallery`, `news`, `events`, `get-involved`, `donate`, `request`, `footer`, `site`, `navigation`) with `published = true` and empty `content`.
- Same migration: ensure the `navigation` page_settings row has all `show*` flags set to `true` (so every nav item is visible) and a full default `order`.
- `PageSettingsEditor.tsx`: change the "Published" default for newly-loaded pages from `false` to `true` when the row doesn't yet exist, so admins don't have to flip it after creating a new page.

### 6. Verify
- Reload `/programs` (no crash, success-story section hidden until admin adds stories).
- Reload `/request` (loads without redirect, country dropdown is full A→Z list).
- Reload `/` and confirm all nav items are visible.
- Admin → Page Settings: every page shows "● Live".

### Technical notes
- No schema changes — only data updates via `supabase--migration` (the `published` column already exists).
- No new dependencies.
- Files touched: `src/routes/request.tsx`, `src/ported/components/views/ProgramsView.tsx`, `src/ported/components/views/RequestView.tsx`, `src/ported/components/views/GetInvolvedView.tsx`, `src/ported/components/admin/PageSettingsEditor.tsx`, plus one new SQL migration.
