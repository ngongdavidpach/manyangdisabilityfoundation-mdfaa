## 1. Hide Staff Sign In (manual URL access)

**`src/ported/components/views/LoginView.tsx`** — Remove the tabbed UI. The page becomes the contact ("Send a Message") form only. Staff still reach the login form by typing `/auth/staff-login` directly.

**New route `src/routes/auth.staff-login.tsx`** — Move the existing email/password login form into its own view (`StaffLoginView`) at this URL. No nav links anywhere point to it; admins bookmark it. `robots: noindex`.

**Update redirect references**:
- `src/ported/components/ProtectedRoute.tsx` — redirect unauthenticated users to `/auth/staff-login` instead of `/auth/login`.
- `src/ported/components/views/RegisterView.tsx` — any "back to sign in" link → `/auth/staff-login`.

## 2. Fix `vForm is not defined` runtime error

**`src/ported/components/views/GetInvolvedView.tsx`** — Add the missing `useState` for `vForm` (and any sibling form state that was dropped) near the top of the component, matching the shape already used in handlers (`fullName, email, phone, country, city, skills[], availability, message`). Verify partner form state (`pForm`/`setPForm`) is present too; add if missing.

## 3. Remove seeded data

**New migration** that deletes:
- All rows in `news_articles`, `events`, `media_assets` (gallery), `staff_members`, `programs`-related rows.
- All rows in `contacts`, `contact_messages`, `donations`, `donation_intents`, `volunteer_applications`, `partner_inquiries`, `event_rsvps`, `contact_interactions`, `expenses`, `budgets`.
- All rows in `page_settings` (clears default hero text, intros, etc. — admin fills via Admin → Pages).

The Foundation Insight section and any hard-coded demo content in `src/ported/data/foundationData.ts` already export empty arrays — no change there.

## 4. "Publish to public" — per-page publish toggle

**Migration** — add `published boolean NOT NULL DEFAULT false` to `page_settings`. (Re-grant not needed; column inherits table grants.) Add a public read policy if not already present scoped to `published = true` for `anon`.

**`src/ported/components/admin/PageSettingsEditor.tsx`** — Add a "Published" switch next to Save. Toggling persists to the `published` column. Show a small status pill (Draft / Live).

**`src/ported/hooks/usePageSettings.ts`** — Return `{ content, published, loading, save, setPublished, reload }`. When `published === false` and the viewer is not an admin, components should treat content as empty/fallback.

**Public route views (Home, About, Programs, Gallery, News, Events, Get Involved, Donate)** — If `!published && !isAdmin`, render a simple "This page is being prepared — check back soon." placeholder instead of empty hero. Admins always see live editing.

**SEO loader (`src/lib/pageSeo.functions.ts`)** — Only return SEO when `published = true`; otherwise return empty so defaults kick in.

## 5. Verify

After build:
- Visit `/get-involved` → no `vForm` error.
- Visit `/auth/login` → contact form only, no Staff Sign In tab.
- Visit `/auth/staff-login` → login form works, redirects admin to `/admin`.
- Admin → Pages → toggle Published on/off → public view updates accordingly.
- Confirm seeded rows are gone via DB count check.

## Notes

- Admin role assignment is already wired (`bootstrap_first_admin` + `has_role`); no changes there.
- Navbar already has Sign In hidden — no change.
- `auth.login.tsx` head stays "Contact Us — MDF".
