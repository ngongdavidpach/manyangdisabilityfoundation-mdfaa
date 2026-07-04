## Inline sign-in with post-login redirect + verified no-redirect on protected routes

### Goal
1. After a successful sign-in, land the user back on the page they originally requested.
2. Confirm every admin/protected route renders the inline sign-in prompt (no bounce to `/admin`).
3. Give the inline sign-in prompt real loading and error states for failed authentication.

### Findings from the codebase
- `ProtectedRoute` is only used by `src/routes/dashboard.tsx`. It already renders `<AuthenticationGate>` inline when unauthenticated (no redirect after the previous change).
- `src/routes/admin.tsx` renders `<StaffLoginView />` inline when unauthenticated — no redirect. It will stay that way.
- `StaffLoginView` already reads `search.redirect` and navigates there on success, so it already supports "return to original page" — but only if callers pass the redirect through.
- The current `AuthenticationGate` just sends users to `/admin` via `window.location.href`, which drops the current URL and loses the return path.

### Changes

**`src/ported/components/ProtectedRoute.tsx`**
- Replace the button-only `AuthenticationGate` with an inline email/password sign-in form (same fields as `StaffLoginView`, compact styling to match the existing card).
- Wire it directly to `useAuth().login`, with:
  - `isProcessing` state → disabled button + spinner ("Signing in…").
  - Inline error banner (red alert) for validation errors and auth failures returned by `login()`.
  - Show/hide password toggle.
- On success: do nothing — `AuthContext` flips `isAuthenticated`, and `ProtectedRoute` renders `children` on the same URL. No navigation, so the user stays on the originally requested page.
- Keep a secondary "Create account" link that navigates via TanStack `useNavigate` to `/admin` with `search: { redirect: currentPath }` (using `useRouterState` for `location.href`) — so if the user goes to the full staff login page, it still returns them to the original page after login.
- Keep the role-based "Access Restricted" branch unchanged.
- Keep `AuthenticationGate` exported (used by nothing else today, but preserved as a named export for compatibility).

**`src/routes/admin.tsx`** (verification only — no functional change)
- Confirm the unauthenticated branch renders `<StaffLoginView />` inline (already true). No edits unless a redirect is discovered.

**`src/routes/dashboard.tsx`** (verification only)
- Uses `<ProtectedRoute>`; will automatically get the new inline form. No edits.

### Out of scope
- No changes to `AuthContext`, routing, or `/admin` page behavior beyond the above.
- No new routes, no changes to role logic, no changes to `StaffLoginView`'s existing redirect behavior.
