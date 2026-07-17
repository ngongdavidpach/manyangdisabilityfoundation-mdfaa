## 1. Fix the build error (client bundle pulled server-only imports)

The last change made `auth.functions.ts` reach `rateLimit.server.ts` and `@tanstack/react-start/server` **at the module top level**. The `.functions.ts` splitter only strips `.handler()` bodies, not top-level imports, so the client graph now hits `getRequestIP` in a `.server.ts` file and the import-protection plugin fails the build.

Fix (surgical, no behavior change):

- Create `src/lib/rateLimit.constants.ts` — a client-safe module exporting `RATE_LIMIT_MESSAGE`. Both `rateLimit.server.ts` and `auth.functions.ts` import it from there; the three route files also import `RATE_LIMIT_MESSAGE` from this constants file instead of re-exporting through `auth.functions.ts`.
- In `src/lib/auth.functions.ts`, drop the top-level imports of `@/lib/rateLimit.server` and `@tanstack/react-start/server`. Load them via `await import(...)` **inside each handler**, matching the pattern already used for `@/integrations/supabase/client.server`. Keep `requireSupabaseAuth` at top level (integration file is client-safe by design).
- Leave `rateLimit.server.ts` unchanged.

Verify with `bun run build:dev`.

## 2. Delete account feature

### Route

New authenticated page `src/routes/auth.delete-account.tsx`:
- Shows the signed-in email.
- Warning panel listing what gets removed (profile row + linked data cascade via existing `ON DELETE CASCADE`, role assignments, and access to Lovable Cloud).
- Requires two independent confirmations before the submit button enables:
  1. Type the account email exactly (case-insensitive compare after trim).
  2. Password field (current password, re-authenticated server-side).
  3. Checkbox: "I understand this is permanent and cannot be undone."
- Submit calls new server fn `deleteAccount`. On success: `supabase.auth.signOut({ scope: "global" })` + `queryClient.clear()` + navigate to `/` with a toast/inline "Your account has been deleted."
- `head()` with title / description / `noindex,nofollow`, same styling shell as `auth.change-password.tsx`.

### Server fn (`src/lib/auth.functions.ts`)

`deleteAccount({ currentPassword, confirmEmail })` — protected via `requireSupabaseAuth`.
1. Rate-limit (per-user `5/900s`, per-IP `10/3600s`) via the shared helper. 429 uses `RATE_LIMIT_MESSAGE`.
2. Read caller email via `context.supabase.auth.getUser()`; reject if missing.
3. Verify `confirmEmail.trim().toLowerCase() === email.toLowerCase()` — reject `wrong_email` if not.
4. Re-authenticate with a scratch publishable-key client (`signInWithPassword`) to confirm the password — reject `wrong_password` on failure. Sign the scratch session out.
5. Guard: refuse to delete if the caller is the only remaining `admin` in `user_roles`. Query with `context.supabase` and return `last_admin` so the UI can explain. This prevents locking the org out.
6. Lazy-import `supabaseAdmin` and call `supabaseAdmin.auth.admin.deleteUser(userId)`. FK cascades clean up `profiles` and `user_roles` (already `ON DELETE CASCADE`).
7. Return `{ ok: true }`.

### Entry points

- Add a small "Danger zone" section to `src/routes/auth.change-password.tsx` with a link to `/auth/delete-account`, so users can find it from the account settings area.
- Add a "Delete account" link under the Sign-out button in `AdminDashboardView.tsx` sidebar (line 314 area) styled as a subdued destructive link (`text-red-600`), routed to `/auth/delete-account`.

### Not included

- No new DB tables or migrations. Cascade is already set up on `profiles` and `user_roles`.
- No admin UI to delete other users (only self-service).
- No 30-day soft-delete grace period — deletion is immediate via `auth.admin.deleteUser`. If the user later wants soft-delete, that's a separate change.

## Files touched

- `src/lib/rateLimit.constants.ts` — new, exports `RATE_LIMIT_MESSAGE`.
- `src/lib/rateLimit.server.ts` — import the constant from the new module (re-export kept for backward compat).
- `src/lib/auth.functions.ts` — move server-only imports inside handlers, add `deleteAccount`.
- `src/routes/auth.change-password.tsx`, `src/routes/auth.reset-password.tsx`, `src/routes/auth.forgot-password.tsx` — import `RATE_LIMIT_MESSAGE` from the new constants module; reset-password gets a "Danger zone" link.
- `src/routes/auth.delete-account.tsx` — new page.
- `src/ported/components/views/AdminDashboardView.tsx` — add "Delete account" link near Sign out.
