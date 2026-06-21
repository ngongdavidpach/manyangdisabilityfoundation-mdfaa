## Goal
Remove the standalone `/admin-login` route and show the login form inline at `/admin` when the user isn't authenticated.

## Changes

1. **Delete `src/routes/admin-login.tsx`** — the dedicated login route goes away.

2. **Update `src/routes/admin.tsx`** — instead of wrapping `<AdminDashboard />` in `<ProtectedRoute>`, render `<StaffLoginView />` when unauthenticated and `<AdminDashboard />` (still role-gated) when signed in. URL stays `/admin` whether logged in or not.

3. **Update `src/ported/components/ProtectedRoute.tsx`** — change the unauthenticated redirect target from `/admin-login` to `/admin` (so any other protected page sends users to the admin login surface).

4. **Update `src/ported/components/views/StaffLoginView.tsx`** — after successful login, navigate to the `redirect` search param or `/admin` (no longer `/admin-login` aware). Confirm it doesn't link back to `/admin-login` anywhere.

5. **Search for other references to `/admin-login`** (e.g. in Navbar, AuthContext, or links) and repoint them to `/admin`.

No backend/database changes. No new dependencies.