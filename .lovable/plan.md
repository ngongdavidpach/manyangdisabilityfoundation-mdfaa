# Hide Sign In, Make Manually Accessible via Shortcut

## Goal
Remove all visible "Sign In" / "Create Account" entry points from the public site. Login remains fully functional but only reachable by a hidden keyboard shortcut (and by protected-route redirects, e.g. clicking "Request Aid").

## Changes

### 1. `src/ported/components/Navbar.tsx`
When the user is **not** authenticated:
- Remove the desktop "Sign In" button (right-side CTA area, lines ~199–207).
- Remove the mobile drawer "Sign In" and "Create Free Account" buttons (lines ~308–329).
- Keep the user dropdown (avatar + Dashboard/Admin/Sign Out) intact for when a user *is* signed in.
- Keep "Donate Now" button as-is.

When authenticated, the navbar is unchanged.

### 2. `src/ported/App.tsx`
Add a global keyboard listener inside `AppContent`:

```ts
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    // Ctrl+Shift+L (or Cmd+Shift+L on macOS) opens the login page
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      setCurrentPage('login');
    }
  };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}, []);
```

### 3. `src/ported/components/views/LoginView.tsx`
- Remove the bottom "New to MDF? Create a free account" link block (lines ~199–210) so registration is also not publicly advertised. Registration remains reachable by typing the shortcut, then no link — or, optionally, keep that link. Default: remove it to fully hide signup too. **Confirming default**: keep it removed; registration is for admin-invited users only since the first signup becomes admin.

### What stays the same
- `LoginView`, `RegisterView`, `AuthContext`, all auth flows work unchanged.
- Protected routes (Request Aid, Dashboard) still redirect to login when clicked.
- Authenticated user avatar/menu, Sign Out, Admin Console all unchanged.
- The top-bar "Need a Wheelchair?" / "My Applications" link stays (it goes to `/request` which triggers the login redirect for non-auth'd users).

## Shortcut
**Ctrl+Shift+L** (Windows/Linux) and **Cmd+Shift+L** (macOS) opens the login screen.

## Out of scope
- No URL routing changes (the app uses internal `currentPage` state, not real routes).
- No changes to backend/auth logic.
