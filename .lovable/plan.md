## Goal
Require a fresh authentication (recent login) before an account deletion request is accepted, so a stolen/idle session cannot be used to schedule deletion.

## Approach
Combine two server-side checks in `requestAccountDeletion` (in `src/lib/auth.functions.ts`), plus small UX affordances on `/auth/delete-account`.

### 1. Server: recent-login check in `requestAccountDeletion`
- Read `auth_time` from `context.claims` (JWT `auth_time` / `iat`) via `requireSupabaseAuth`.
- Compare against `now()`. If older than **5 minutes**, return a new typed failure:
  `{ ok: false, reason: "reauth_required", secondsSinceAuth }`.
- The existing `currentPassword` check stays — it re-verifies the credential, and combined with the freshness check ensures the password was entered *in this session, recently*.
- Order of checks: unauthenticated → rate limit → reauth_required → wrong_email → wrong_password → last_admin → proceed.

### 2. Server: `reauthenticate` helper server fn
New `reauthenticate({ password })` in `auth.functions.ts`:
- Uses `requireSupabaseAuth` to get the user's email.
- Calls `supabase.auth.signInWithPassword({ email, password })` on a fresh server client to mint a new session (updating `auth_time`).
- Returns `{ ok: true, session }` or typed error. Rate-limited per user + per IP (reuse `authRateLimit`).
- Client calls `supabase.auth.setSession()` with the returned tokens so subsequent server fn calls carry a fresh `auth_time`.

### 3. Client: `/auth/delete-account` UX
- On mount, fetch the current session and compute `secondsSinceAuth = now - session.user.last_sign_in_at` (fallback to JWT `iat`).
- If > 5 min, show a **"Confirm it's you"** panel above the delete form:
  - Password field + "Verify" button that calls `reauthenticate`.
  - On success, refresh the session and unlock the delete form.
  - Delete form's submit button stays disabled with helper text "Please re-verify your identity to continue" until reauth completes or freshness check passes.
- If the delete submission returns `reauth_required` (e.g. token aged out mid-form), surface the same panel with an inline message.

### 4. Copy & accessibility
- Error message: "For your security, please re-enter your password to confirm it's you before deleting your account."
- Panel has `role="region"` + `aria-labelledby`; verification result announced via `aria-live="polite"`.

## Files
- **Edit** `src/lib/auth.functions.ts` — add `reauthenticate` server fn; add reauth freshness check + `reauth_required` reason in `requestAccountDeletion`.
- **Edit** `src/routes/auth.delete-account.tsx` — add reauth panel, freshness detection, wire `reauthenticate`, handle `reauth_required`.
- **Edit** `.lovable/plan.md` — record the change.

## Non-goals
- No DB schema changes.
- No changes to other sensitive flows (password change already requires current password). Can extend later if desired.

## Technical details
- 5-minute window is standard for "sudo mode" flows (GitHub uses ~1h, Google ~10 min; 5 min is conservative for a destructive action).
- `context.claims.iat` is issued-at of the current access token. Since Supabase refreshes tokens hourly *without* re-authenticating the user, we must ALSO track a separate "last password verification" timestamp. Simpler: use `auth.users.last_sign_in_at` read via `context.supabase.auth.getUser()` and compare to now. `signInWithPassword` updates it; token refresh does not.
- `reauthenticate` will NOT persist the new session server-side; it returns `access_token` + `refresh_token` and the client calls `supabase.auth.setSession(...)` so the next server-fn call carries the new bearer whose backing user row has an updated `last_sign_in_at`.