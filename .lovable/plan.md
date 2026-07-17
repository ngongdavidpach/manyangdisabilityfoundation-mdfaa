
## Summary

Change-password already exists from the previous turn (`/auth/change-password`) and reset-password already calls `supabase.auth.signOut()` after `updateUser` (invalidates the active session). This turn focuses on the remaining gaps: clearer token error states, a rate-limited "Resend recovery email" button, and belt-and-braces session invalidation.

## 1. Distinguish token error states on `/auth/reset-password`

Supabase redirects invalid/expired recovery links back to the `redirectTo` URL with error info in the hash: `#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired`.

- Parse `window.location.hash` on mount before running the current session check.
- Map to three distinct UI states, each with tailored copy:
  - `otp_expired` → "This reset link has expired. Reset links are valid for a short time and can only be used once."
  - `access_denied` / no session detected within 2.5s → "This reset link is invalid or has already been used."
  - Generic Supabase error → show `error_description`.
- All error states show the same "Request new link" CTA to `/auth/forgot-password`.

Supabase already enforces expiration and single-use natively — no schema change needed. We just surface the reason.

## 2. Resend recovery email button

Show it in two places on `/auth/reset-password`:
- Inside the invalid/expired panel ("Send a new link to <email>").
- Below the form in the `ready` state (in case the user opened the link late and wants a fresh one before submitting).

Behaviour:
- Read the recipient email from `supabase.auth.getUser()` when a recovery session exists; otherwise the invalid-state panel shows a single email input instead.
- On click, call a new server function `requestPasswordReset({ email })` from `src/lib/auth.functions.ts` (no auth required — it's a public endpoint). The server fn:
  - Validates email shape with Zod.
  - Calls `enforceRateLimit` (from the existing `rateLimit.server.ts`) with `bucket: "password-reset"`, keyed by lowercased email, `max: 3` per `600s` (10-minute window). Also enforces a per-IP cap of `max: 10` per `3600s` as a second bucket to prevent enumeration/spraying.
  - Uses the publishable-key server Supabase client to call `resetPasswordForEmail(email, { redirectTo: <site>/auth/reset-password })`. Always returns `{ ok: true }` regardless of whether the email exists (no enumeration).
  - Throws "Too many requests. Please try again later." only for the rate-limit failure so the client can display it.
- Client-side cooldown: after a successful call, disable the button for 60s with a live countdown ("Resend in 42s"). Persist the cooldown deadline in `sessionStorage` under `mdf.recovery.resend.until` so a reload doesn't reset it.
- Show a small success confirmation ("New link sent to j***@example.com") after each resend.

## 3. Session invalidation after reset

Already covered on `/auth/reset-password`: after `updateUser({ password })` succeeds, we call `supabase.auth.signOut()` then redirect to `/admin`. Add one small improvement:
- Call `supabase.auth.signOut({ scope: "global" })` so refresh tokens on **all** devices are revoked, not just the current tab. Supabase's Auth API supports this — no server code needed.
- Apply the same `scope: "global"` sign-out inside the existing `/auth/change-password` flow's re-authentication step is unnecessary (we want to keep the user signed in there), but AFTER a successful password update in change-password we do NOT sign them out — that behaviour stays as-is. (Confirm with user only if they want change-password to also force re-login.)

## 4. Change-password page

Already implemented at `/auth/change-password` from the previous turn. No changes needed unless the user wants it to force sign-out after success. Not in scope.

## Files touched

- `src/routes/auth.reset-password.tsx` — hash parsing, tailored error copy, resend button + cooldown, `scope: "global"` sign-out.
- `src/lib/auth.functions.ts` **new** — `requestPasswordReset` server function with two rate-limit buckets.
- `src/routes/auth.forgot-password.tsx` — swap direct `supabase.auth.resetPasswordForEmail` call to the new `requestPasswordReset` server fn so the initial request is rate-limited the same way as resends.

## Out of scope

- No new database tables (the existing `rate_limits` table + `check_rate_limit` RPC cover this).
- No changes to Supabase Auth settings (token TTL is configured in Auth settings; not modified here — Supabase's default is already short and single-use).
- No change to `change-password`'s post-success behaviour.
