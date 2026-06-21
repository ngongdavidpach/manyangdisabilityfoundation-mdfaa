## Goal
Expose the existing `StaffLoginView` at a dedicated `/admin-login` route so admins can sign in, and redirect unauthenticated visitors of `/admin` there instead of the homepage.

## Changes

1. **New route `src/routes/admin-login.tsx`**
   - Renders `StaffLoginView`.
   - `head()` with title "Admin Login — Manyang Disability Foundation", `robots: noindex`, basic OG tags.
   - Reads `?redirect=` search param (already used by `StaffLoginView`) so after sign-in users return to the originally requested page.

2. **Update `src/ported/components/ProtectedRoute.tsx`**
   - On unauthenticated, navigate to `/admin-login?redirect=<current-path>` instead of `/`.
   - Keep the "Access Restricted" UI for authenticated users without the required role.

3. **Update `src/ported/components/views/AdminDashboardView.tsx` / Navbar (only if currently linking to a homepage login modal)**
   - Add a small "Admin Login" link in the footer or keep the existing entry point; no visual redesign.

## Out of scope
- No changes to auth logic, Supabase config, Apple/Google providers (already wired).
- No new database tables or roles.
- No redesign of the login form itself.

## Acceptance
- Visiting `/admin` while signed out lands on `/admin-login` with the form visible.
- Successful sign-in as an admin returns to `/admin`.
- Non-admin authenticated users still see "Access Restricted" on `/admin`.