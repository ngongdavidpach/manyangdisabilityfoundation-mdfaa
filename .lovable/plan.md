## Scope

Three focused changes:

1. Move hard-coded content in `src/routes/about.tsx` and `src/routes/programs.tsx` into admin-editable `page_settings` so nothing on those routes is baked into code.
2. Remove the "Sign in with Apple" button from the staff login screen used by `/admin`.
3. Remove client-side image optimization so uploads use the original file.

## 1. Push seeded data in the route files to admin control

The two route files contain hardcoded JSON-LD structured data (the only content still literally embedded in the route files themselves — page copy already comes from `page_settings`). Move these to admin control alongside existing SEO fields.

**`src/routes/about.tsx`** — currently hardcodes an `Organization` JSON-LD block (name, url, logo, description, `sameAs[]`).
**`src/routes/programs.tsx`** — currently hardcodes a `CollectionPage` JSON-LD block (name, description, url, `about[]` topic list).

Changes:

- Extend `getPublicAboutFaqs` (rename to a more general `getPublicAboutPage`) and add a `getPublicProgramsPage` server function in `src/lib/publicContent.functions.ts` that return a typed slice of `page_settings.content` including new `structuredData` fields.
- Add new admin fields for `about` and `programs` in `src/ported/components/admin/PageSettingsEditor.tsx`:
  - About: `structuredData.orgName`, `structuredData.orgUrl`, `structuredData.orgLogo`, `structuredData.orgDescription`, `structuredData.orgSameAs` (comma-separated list rendered as textarea).
  - Programs: `structuredData.name`, `structuredData.description`, `structuredData.url`, `structuredData.topics` (comma-separated list as textarea).
- Update `about.tsx` and `programs.tsx` `loader` + `head` to build JSON-LD from the loaded content (fall back to current defaults if unset so nothing breaks on first load, then the admin can override).

No migration is needed — the JSON blob column already stores arbitrary content.

## 2. Remove Apple sign-in from the admin login screen

The `/admin` route renders `StaffLoginView`. In `src/ported/components/views/StaffLoginView.tsx`, remove:

- The "or continue with" divider block.
- The `<button>` that calls `lovable.auth.signInWithOAuth("apple", …)`.
- The now-unused `lovable` import.

Email/password sign-in remains the only path.

## 3. Remove image optimization

- In `src/ported/lib/storage.ts`, drop the `optimizeImage` import and call; upload the raw `File` directly with its original mime type and size (adjust the surrounding upload call so the untouched file is passed through).
- Delete `src/ported/lib/imageOptimize.ts`.
- Verify no other file imports `imageOptimize` (grep confirms only `storage.ts` does).

## Out of scope

Non-JSON-LD hardcoded UI copy inside `AboutView.tsx` / `ProgramsView.tsx` (Four Pillars cards, category filter labels, financial-transparency intro copy) — the user's request targets the route files specifically. Happy to move those too in a follow-up if wanted.
