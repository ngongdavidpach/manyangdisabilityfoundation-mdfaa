## Changes

### 1. Delete auth route files
- `src/routes/auth.login.tsx`
- `src/routes/auth.register.tsx`
- `src/routes/auth.staff-login.tsx`

The TanStack route tree regenerates automatically. Toast / inline messages elsewhere in the app are untouched.

### 2. Fix dangling references to the removed routes
- `src/ported/components/ProtectedRoute.tsx` (line 19): change the unauth redirect from `/auth/staff-login` to `/` (no login page exists anymore).
- `src/ported/components/views/RegisterView.tsx` (line 359): remove the "Staff login" button that navigates to `/auth/staff-login`. (The view file itself stays — it's orphaned but harmless; deleting it would risk breaking imports elsewhere.)

### 3. Fix the whole-page flicker on refresh

Two compounding causes:

**a) `AuthContext` double-fires the initial user load.** It subscribes to `onAuthStateChange` (which already fires an `INITIAL_SESSION` event on mount) AND separately calls `getSession().then(buildUser)`. Both paths call `setUser` + `setIsLoading(false)`, so the tree renders → re-renders → re-renders. Combined with `ProtectedRoute`'s `isLoading` spinner this looks like a full-page flash.

Fix: rely solely on `onAuthStateChange` for hydration. Remove the redundant `getSession().then(buildUser)` block — the listener delivers the initial session synchronously enough that no extra fetch is needed.

**b) `Navbar` resets `navConfig` after the `page_settings` fetch resolves.** The initial state uses the full default order, but as soon as the fetch resolves it replaces both `order` and `flags`, which re-renders the whole nav. On a cold refresh this is visible as the top bar repainting.

Fix: only merge `flags` from the fetched content; keep the resolved order stable (`resolveNavOrder` already handles defaults). Wrap the fetch result in a single `setNavConfig` that only updates if `data` exists, so an empty/missing row doesn't trigger a needless re-render.

### Verification
- Navigate to `/auth/login`, `/auth/register`, `/auth/staff-login` → expect the root `NotFoundComponent` (404).
- Refresh `/`, `/request`, `/dashboard` → no visible page-content flash; navbar stays put.
- Sign in / sign out still work via the existing dashboard / auth flows that don't depend on the deleted pages.