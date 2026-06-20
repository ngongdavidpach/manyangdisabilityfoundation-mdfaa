## Plan: Add conditional Admin Dashboard link to the navbar user menu

### Scope
Update the `Navbar` component so that authenticated users with the `admin` role see an "Admin Dashboard" link in their profile dropdown (both desktop and mobile menus).

### Changes

1. **Auth hook usage in `src/ported/components/Navbar.tsx`**
   - Destructure `isAdmin` from `useAuth()`.

2. **Desktop user dropdown menu**
   - Add an "Admin Dashboard" button between "My Dashboard" and the divider, conditionally rendered when `isAdmin` is true.
   - Use `navigate({ to: "/admin" })` and close the menu on click.

3. **Mobile menu authenticated section**
   - Add the same "Admin Dashboard" button above "My Dashboard" when `isAdmin` is true.

### Verification
- The link only appears for users whose `role === "admin"` (as determined by the `AuthContext` lookup against the `user_roles` table).
- No change for non-admin authenticated users or guests.
- Existing navigation behavior remains unchanged.