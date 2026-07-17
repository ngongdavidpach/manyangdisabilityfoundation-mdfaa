## Goals

Tighten accessibility, UX, and server-side enforcement on the password reset / change flow.

## 1. Accessible ARIA feedback (`PasswordFields.tsx`)

- Wrap the strength meter in `role="progressbar"` with `aria-valuemin=0`, `aria-valuemax=5`, `aria-valuenow={score}`, `aria-valuetext={label}`, and `aria-label="Password strength"`.
- Wrap the strength label + rule checklist in a single `role="status"` `aria-live="polite"` `aria-atomic="false"` region so SR users hear rule flips as they type (debounced by React re-render only).
- Give each rule `<li>` a stable `id` and set `aria-label="{rule label}: {met|not met}"`; icon becomes `aria-hidden`.
- Add a live region under the confirm field (`role="status"` `aria-live="polite"`) that renders the match/mismatch sentence, so screen readers announce match state changes without moving focus.
- Ensure the input keeps `aria-describedby` pointing to both the requirements list and the confirm-status region.

## 2. Show/hide + live match feedback

- Split the visibility toggle into two independent buttons — one on the new-password field, one on the confirm field — each with `aria-pressed` and `aria-label` reflecting current state ("Show password" / "Hide password").
- On `auth.change-password.tsx`, keep the existing Current Password toggle but rewrite its `aria-label` the same way and add `aria-pressed`.
- Match/mismatch is already computed; add it as a live-region announcement (see §1) and make it visible on every keystroke after the user has typed at least one char in confirm (drop the "touched" gate so feedback is immediate — the CTA remains disabled while invalid, so users aren't punished).

## 3. Server-side password strength enforcement

Currently `supabase.auth.updateUser({ password })` is called from the browser, so client validation can be bypassed. Move the write behind two new server functions in `src/lib/auth.functions.ts` that share one Zod strength schema:

```text
StrongPasswordSchema = z.string()
  .min(8).max(128)
  .regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/).regex(/[!@#$%^&*(),.?":{}|<>]/)
```

- `completePasswordReset({ accessToken, refreshToken, newPassword })` — public server fn.
  - Validates `newPassword` against `StrongPasswordSchema`; on failure returns `{ ok: false, reason: "weak_password", issues }`.
  - Creates a server-scoped Supabase client (publishable key), calls `setSession({ accessToken, refreshToken })`, then `updateUser({ password })`.
  - On expired/invalid token returns `{ ok: false, reason: "expired" | "invalid" }`.
  - On success returns `{ ok: true }`. The route then calls `supabase.auth.signOut({ scope: "global" })` client-side.
- `changePassword({ currentPassword, newPassword })` — protected server fn using `requireSupabaseAuth`.
  - Validates `newPassword` with the same schema, rejects if equal to `currentPassword`.
  - Re-authenticates via a scratch server client `signInWithPassword({ email: claims.email, password: currentPassword })` to verify current password.
  - Uses `supabaseAdmin.auth.admin.updateUserById(userId, { password })` (loaded lazily inside the handler) after authorization succeeds.
  - Returns `{ ok, reason?: "wrong_current" | "same_password" | "weak_password" | "rate_limited" }`.

Both routes are refactored to call these server fns instead of calling `supabase.auth.updateUser` directly. The client still runs its existing validation for UX; the server is now authoritative.

## 4. Hardened rate limiting with consistent 429 messaging

Introduce a single helper in `rateLimit.server.ts`:

```text
const RATE_LIMIT_MESSAGE = "Too many requests. Please try again in a few minutes.";
enforceRateLimits([...opts]) → runs every bucket, aggregates, throws Response(429) on any fail
```

Applied per endpoint:

| Server fn                | Per-email                  | Per-IP                    |
| ------------------------ | -------------------------- | ------------------------- |
| `requestPasswordReset`   | 3 / 10 min                 | 10 / hour                 |
| `completePasswordReset`  | (per user id) 5 / 15 min   | 20 / hour                 |
| `changePassword`         | (per user id) 5 / 15 min   | 20 / hour                 |

- Both counters are always incremented (no short-circuit), so an attacker can't probe one axis for free.
- On limit hit, the server fn calls `setResponseStatus(429)` and returns `{ ok: false, reason: "rate_limited", message: RATE_LIMIT_MESSAGE }` — same string everywhere.
- The three routes render `result.message` (falling back to the shared constant) whenever `reason === "rate_limited"`, so the UI copy is identical across forgot-password, reset-password resend, reset submission, and change-password.

## Files touched

- `src/ported/components/PasswordFields.tsx` — ARIA regions, per-field toggles, always-on match feedback.
- `src/routes/auth.change-password.tsx` — call `changePassword` server fn; rewire Current Password toggle ARIA.
- `src/routes/auth.reset-password.tsx` — call `completePasswordReset` server fn; unify 429 copy.
- `src/routes/auth.forgot-password.tsx` — unify 429 copy via shared message.
- `src/lib/auth.functions.ts` — add `completePasswordReset`, `changePassword`, shared `StrongPasswordSchema`, shared `RATE_LIMIT_MESSAGE`.
- `src/lib/rateLimit.server.ts` — export `RATE_LIMIT_MESSAGE` and small `enforceRateLimits` helper that runs all buckets.

## Out of scope

- No DB schema changes (existing `check_rate_limit` RPC + `rate_limits` table are reused).
- No changes to Supabase Auth project-level password policy.
- No changes to `PasswordFields` visual design beyond adding the second toggle button.
