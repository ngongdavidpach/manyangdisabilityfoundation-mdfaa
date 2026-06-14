
# Rate limiting + RLS hardening

Current state (verified): all 14 public tables have RLS on. Policies are mostly aligned with the answers you gave. This plan tightens the edges, adds storage policies, and adds an ad-hoc rate limiter.

> Caveat on rate limiting: the backend has no built-in limiter. The Postgres approach below works but is best-effort — it cannot stop a flood before it hits the DB, and an attacker bypassing the app and hitting Supabase directly is not in scope. For real edge protection, you'd need a WAF/CDN, which isn't available here.

---

## 1. One migration: RLS hardening + rate limiter

### 1a. Rate limiter primitives

- New table `public.rate_limits(id, key text, bucket text, window_start timestamptz, count int)` with unique index on `(key, bucket, window_start)`.
- Function `public.check_rate_limit(_key text, _bucket text, _max int, _window_seconds int) returns boolean` — SECURITY DEFINER, atomic upsert that increments the current window's counter and returns false when over `_max`. Old windows are ignored; a lightweight cleanup happens opportunistically.
- GRANT EXECUTE to `authenticated` and `service_role` only. No table grants — callers go through the function.

### 1b. RLS tightening

- **`user_roles`**: drop the redundant `user_roles_admin_only_write` policy that includes `anon`. Keep `user_roles_admin_all` (authenticated) + `user_roles_self_read`.
- **`page_settings`**: keep public read (the site reads it unauthenticated) but explicitly REVOKE INSERT/UPDATE/DELETE from `anon` to make intent explicit.
- **`donations`**: add explicit `donations_self_read` already exists; add a defensive policy that blocks anon entirely (no `TO anon` grants today, but add `REVOKE ALL ... FROM anon` for belt-and-braces).
- **`contacts` / `contact_interactions` / `expenses` / `expense_categories` / `budgets` / `receipts`**: confirm admin-only — drop the `contacts_self_read` policy (you chose admins-only for CRM).
- **`profiles`**: add `profiles_admin_read` so admins can view all profiles for the CRM (today admins can't see other profiles).
- Re-affirm GRANTs on every table: `authenticated` only where a policy targets them; `service_role` ALL on every table; `anon` SELECT only on `page_settings`, `media_assets`, `news_articles`, `events`.

### 1c. Storage policies

The `receipts` bucket has no `storage.objects` policies yet. Add:
- Admin read/write on objects in `receipts`.
- Donor read on objects whose path matches `donations/{donation_id}/...` where the donation's `user_id = auth.uid()`.
- No public access. `site-images` keeps existing public-read.

### 1d. Triggers

- `set_updated_at` on `rate_limits` not needed (window-based).
- Confirm `assign_receipt_number` trigger is attached to `donations` (sequence exists; verify trigger).

---

## 2. Rate limit wiring (server-side only)

A small helper `src/lib/rateLimit.server.ts` calls `check_rate_limit` via `supabaseAdmin.rpc`. Key = `auth.uid()` when signed in, else the request IP (`getRequestIP({ xForwardedFor: true })`). Bucket + limits per endpoint:

| Endpoint | Bucket | Limit |
|---|---|---|
| `createCheckoutSession` (Stripe) | `checkout` | 10 / 10 min per key |
| `generateReceipt` | `receipt-gen` | 30 / hour per admin |
| `getReceiptUrl` | `receipt-url` | 60 / hour per key |
| Manual donation insert (admin) | `donation-insert` | 120 / hour per admin |
| `/api/public/stripe-webhook` | `stripe-webhook` | 600 / min per IP (after signature verify, defence-in-depth only) |
| Auth-sensitive admin fns (role grants, etc.) | `admin-sensitive` | 30 / hour per admin |

On limit exceeded: throw `new Error("Too many requests")` from server fns; return `429` from server routes. No silent retries.

---

## 3. Files

**Migration**
- `supabase/migrations/<ts>_rls_and_rate_limit.sql` — single file: rate_limits table + function + grants, RLS adjustments listed in 1b, storage policies in 1c.

**Code**
- `src/lib/rateLimit.server.ts` — `enforceRateLimit({ bucket, max, windowSeconds, key })` helper, server-only.
- `src/lib/receipts.functions.ts` — call `enforceRateLimit` at the top of `generateReceipt` and `getReceiptUrl` handlers.
- `src/lib/payments.functions.ts` (existing checkout fn) — same, on `checkout` bucket. (If this file doesn't exist yet because checkout isn't wired, skip; rate limit gets added when checkout lands.)
- `src/routes/api/public/stripe-webhook.ts` — after signature verification, apply the `stripe-webhook` IP limit.
- `src/ported/components/admin/DonationsManager.tsx` insert path — if it writes directly via the browser client, move the insert into a new `src/lib/donations.functions.ts` server fn that enforces the `donation-insert` limit; otherwise add the limit to the existing server fn.

**No client UI changes.** A toast on 429 is added in the existing error handlers of the affected admin forms.

---

## 4. Verification

- After migration: run the Supabase linter, fix anything new it flags.
- `psql` spot-checks: select `pg_policies` to confirm dropped/added policies, and `has_table_privilege('anon', 'public.donations', 'SELECT')` returns `false`.
- Manual test: call `generateReceipt` 31 times in an hour as admin → 31st throws "Too many requests".
- Stripe webhook still succeeds when signature is valid and under the IP limit.

---

## Out of scope

- Edge/CDN rate limiting (not available on this stack).
- Per-route global limits beyond the endpoints listed — easy to extend later by adding a bucket.
- Audit logging of limit hits (could be added if you want a `rate_limit_events` table).
