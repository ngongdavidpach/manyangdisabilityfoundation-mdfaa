## Remove auth redirect from protected pages

Update `src/ported/components/ProtectedRoute.tsx` so it no longer redirects unauthenticated users to `/admin`. Instead, when the visitor is not signed in, render the existing `AuthenticationGate` panel in place, letting them stay on the current URL.

### Changes
- `src/ported/components/ProtectedRoute.tsx`
  - Remove the `useEffect` that calls `navigate({ to: "/admin", ... })`.
  - Remove the now-unused `useNavigate` / `useRouterState` imports.
  - When `!isAuthenticated` (after loading), render an inline sign-in prompt (reuse `AuthenticationGate`) instead of the spinner-then-redirect.
  - Keep the role-based "Access Restricted" branch unchanged.

No other files, routes, or business logic are touched. `/admin` continues to handle its own login view separately.
