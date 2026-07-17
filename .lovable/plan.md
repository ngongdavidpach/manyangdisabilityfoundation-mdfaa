
## Goal

Give staff a self-service password reset flow. The recovery email template + auth webhook already exist; we just need the two public pages and a "Forgot password?" entry point on the staff sign-in screen.

## New routes (public, top-level)

1. `src/routes/auth.forgot-password.tsx` — `/auth/forgot-password`
   - Form with a single email field.
   - Calls `supabase.auth.resetPasswordForEmail(email, { redirectTo: ${window.location.origin}/auth/reset-password })`.
   - Always shows a generic success state ("If an account exists, we've sent a reset link") to avoid account enumeration. Renders errors only for network/validation failures.
   - Link back to `/admin` (staff sign-in).

2. `src/routes/auth.reset-password.tsx` — `/auth/reset-password`
   - Public route (NOT under `_authenticated/`). SSR-safe: all Supabase calls in effects/handlers.
   - On mount:
     - Supabase auto-processes the recovery link and fires `PASSWORD_RECOVERY` via `onAuthStateChange`. Subscribe once; mark the form ready when that event fires OR when `supabase.auth.getSession()` returns a session with a user.
     - If no recovery session is detected after a short check, show "This reset link is invalid or has expired" with a link to `/auth/forgot-password`.
   - Form: new password + confirm password, with the existing `getPasswordStrength` helper for the strength meter.
   - Submit calls `supabase.auth.updateUser({ password })`. On success, sign the user out (`supabase.auth.signOut()`) so they must sign in fresh with the new password, then redirect to `/admin` with a success toast/inline message.

## Entry point

3. Edit `src/ported/components/views/StaffLoginView.tsx`
   - Add a "Forgot password?" `<Link to="/auth/forgot-password">` under the password field. No other changes to the sign-in flow.

## Styling / conventions

- Match the visual language of `StaffLoginView` (white card, `rounded-2xl`, slate palette, lucide icons: `Mail`, `Lock`, `Eye/EyeOff`, `ShieldCheck`, `AlertTriangle`, `CheckCircle2`).
- Each route sets its own `head()` with a real title + description; noindex both (`<meta name="robots" content="noindex" />` via head meta) since they're transactional.
- Both route files include the required `errorComponent` / `notFoundComponent` (none of them use a loader, so no data-loader boundaries needed beyond defaults).

## Out of scope

- Email template changes (recovery template already branded).
- Any change to auth middleware, RLS, or the `_authenticated/` layout.
- Public self-signup (staff accounts are still created by admins).
