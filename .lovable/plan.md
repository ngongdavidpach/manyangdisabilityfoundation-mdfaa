
## Overview

Four related additions to the account/auth flows:

1. Let users download all their personal data before requesting deletion.
2. Replace instant deletion with a 30-day soft-delete grace period (with cancel option).
3. Send a confirmation email once the account is permanently deleted.
4. Prevent reuse of the last 5 passwords on both change-password and reset-password.

## 1. Data export (before delete)

**DB migration:** none — read existing rows.

**Server fn** `exportMyData` in `src/lib/auth.functions.ts`:
- `requireSupabaseAuth`, rate-limited (5/hour per user).
- Uses `context.supabase` (RLS) to gather rows owned by the user across: `profiles`, `user_roles`, `donations`, `donation_intents`, `event_rsvps`, `contact_messages`, `volunteer_applications`, `coordinator_registrations`, `fundraiser_registrations`, `aid_requests`, `partner_inquiries`, plus auth email/metadata from `getUser()`.
- Returns `{ ok: true, data: {...}, generatedAt }` as a single JSON payload.

**UI** on `/auth/delete-account`:
- Add a "Download your data" panel above the destructive form. Button calls `exportMyData`, converts the response to a Blob, and triggers a `mdf-account-data-<date>.json` download.
- Copy explains this is a one-time snapshot the user can save before proceeding.

## 2. Soft-delete with 30-day grace period

**DB migration** (new tables + columns):

```sql
CREATE TABLE public.account_deletion_requests (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  requested_at timestamptz NOT NULL DEFAULT now(),
  purge_after timestamptz NOT NULL,        -- requested_at + 30 days
  email text NOT NULL,                     -- captured for the final email
  status text NOT NULL DEFAULT 'pending',  -- pending | cancelled | purged
  cancelled_at timestamptz,
  purged_at timestamptz
);

GRANT SELECT, INSERT, UPDATE ON public.account_deletion_requests TO authenticated;
GRANT ALL ON public.account_deletion_requests TO service_role;

ALTER TABLE public.account_deletion_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own deletion request"
  ON public.account_deletion_requests
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

**Server fns** (`src/lib/auth.functions.ts`, all rate-limited):
- `requestAccountDeletion({ currentPassword, confirmEmail })` — replaces the current immediate delete. Verifies password + email + last-admin guard (unchanged), inserts an `account_deletion_requests` row with `purge_after = now() + interval '30 days'`, calls `supabaseAdmin.auth.admin.updateUserById(userId, { ban_duration: '720h' })` to block sign-in during grace, then `signOut({ scope: 'global' })` client-side. Returns `{ ok: true, purgeAfter }`.
- `cancelAccountDeletion()` — protected; marks the row `cancelled`, unbans the user, only allowed while `status='pending'` and `purge_after > now()`.
- `getAccountDeletionStatus()` — protected; returns current pending request if any (used by admin dashboard banner).

**Purge job** (server route + pg_cron):
- New route `src/routes/api/public/hooks/purge-deleted-accounts.ts` (POST, apikey-authenticated via anon key header). Loads `supabaseAdmin` inside handler, selects `account_deletion_requests` where `status='pending' AND purge_after <= now()`, for each: enqueue confirmation email (see §3), `supabaseAdmin.auth.admin.deleteUser(user_id)` (FK cascade removes profile/roles/etc.), update row to `status='purged', purged_at=now()`.
- Migration adds `pg_cron` job running daily at 03:00 UTC that POSTs to the stable `project--<id>.lovable.app` URL with `apikey` header (per schedule-jobs-options doc).

**UI updates:**
- `/auth/delete-account` — after successful `requestAccountDeletion`, show a success card explaining the account is scheduled for permanent deletion on `<date>`, that sign-in is disabled until then, and how to cancel (email support or use the recovery link before signing out — we surface a cancel link on the success screen that requires re-signing in via a recovery flow, which cancels the request then re-bans if not confirmed).
- Simpler path: success screen shows date + "Sign back in within 30 days to cancel." Since the user is banned, cancellation actually happens via a dedicated public route `/auth/cancel-deletion` that accepts a signed token emailed at request time. Add:
  - `sendDeletionRequestedEmail` (new template `account-deletion-requested.tsx`) sent at request time, containing purge date + cancel link with a single-use signed token stored in the request row (`cancel_token` + `cancel_token_used_at`).
  - Route `/auth/cancel-deletion?token=...` calls new server fn `cancelAccountDeletionByToken({ token })` which validates, marks cancelled, unbans user, and shows "Deletion cancelled — you can sign in again."
- Admin dashboard sidebar: hide "Delete account" button when a pending request exists; instead show a warning banner with cancel link.

## 3. Confirmation email after permanent deletion

**New React Email template** `src/lib/email-templates/account-deletion-confirmed.tsx` (matches existing brand shell). Fields: user's email (as recipient), `deletedAt`, and support contact block (`info@manyangdisabilityfoundation.org` + phone from `foundationData`).

**Registry:** register in `src/lib/email-templates/registry.ts` alongside a sibling `account-deletion-requested` template.

**Trigger:** purge-deleted-accounts route enqueues both emails via existing `enqueue_email('transactional_emails', ...)` RPC before calling `admin.deleteUser`, so the auth user still exists at enqueue time; the queue processor sends afterward using the stored `email` column (independent of auth row).

## 4. Password history (no reuse of last 5)

**DB migration:**

```sql
CREATE TABLE public.password_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  password_hash text NOT NULL,      -- bcrypt via pgcrypto crypt()
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.password_history (user_id, created_at DESC);

GRANT ALL ON public.password_history TO service_role;
-- No authenticated grants: only server-role code touches this table.

ALTER TABLE public.password_history ENABLE ROW LEVEL SECURITY;
-- (No policies → only service_role can read/write, which is what we want.)
```

Two SECURITY DEFINER RPCs (callable only via service role from server functions):

```sql
CREATE FUNCTION public.check_password_reuse(_user_id uuid, _new_password text)
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path=public,extensions AS $$
  SELECT EXISTS (
    SELECT 1 FROM (
      SELECT password_hash FROM public.password_history
       WHERE user_id = _user_id
       ORDER BY created_at DESC LIMIT 5
    ) recent
    WHERE recent.password_hash = extensions.crypt(_new_password, recent.password_hash)
  );
$$;

CREATE FUNCTION public.record_password_hash(_user_id uuid, _new_password text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,extensions AS $$
BEGIN
  INSERT INTO public.password_history(user_id, password_hash)
  VALUES (_user_id, extensions.crypt(_new_password, extensions.gen_salt('bf', 10)));
  -- Trim: keep only the 5 most recent
  DELETE FROM public.password_history
   WHERE user_id = _user_id
     AND id NOT IN (
       SELECT id FROM public.password_history
        WHERE user_id = _user_id ORDER BY created_at DESC LIMIT 5
     );
END; $$;
```

Requires `pgcrypto`; enable in migration if missing.

**Server function changes:**
- `changePassword` handler: before `supabaseAdmin.auth.admin.updateUserById`, call `check_password_reuse` via `supabaseAdmin.rpc`. If true, return `{ ok:false, reason:'password_reused' }`. After successful update, call `record_password_hash`.
- `completePasswordReset` handler: after `setSession` succeeds and password strength passes, run the same reuse check with the resolved `userId`, then update, then record.
- The current "same as current password" check in `changePassword` remains as a fast-path.

**Client copy:** map new `password_reused` reason to `"You cannot reuse any of your last 5 passwords."` on both `/auth/change-password` and `/auth/reset-password`.

## Files

New:
- `src/lib/email-templates/account-deletion-requested.tsx`
- `src/lib/email-templates/account-deletion-confirmed.tsx`
- `src/routes/api/public/hooks/purge-deleted-accounts.ts`
- `src/routes/auth.cancel-deletion.tsx`
- One migration for `account_deletion_requests`, `password_history`, RPCs, pgcrypto, and pg_cron job.

Edited:
- `src/lib/auth.functions.ts` — new fns (`exportMyData`, `requestAccountDeletion` replacing immediate delete, `cancelAccountDeletionByToken`, `getAccountDeletionStatus`), password-history checks in `changePassword` / `completePasswordReset`.
- `src/routes/auth.delete-account.tsx` — data export panel; switch to request-flow success state.
- `src/routes/auth.change-password.tsx` — surface `password_reused` error.
- `src/routes/auth.reset-password.tsx` — surface `password_reused` error.
- `src/lib/email-templates/registry.ts` — register two new templates.
- `src/ported/components/views/AdminDashboardView.tsx` — pending-deletion banner + hide destructive link while pending.

## Out of scope

- No admin UI to purge/cancel other users' deletion requests.
- No SMS notifications.
- Password history depth stays at 5 (not configurable via UI).
- Grace-period length hard-coded to 30 days.
