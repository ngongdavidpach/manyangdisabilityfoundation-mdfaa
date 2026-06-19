## Goal
Cross-check every client and server write path (INSERT/UPDATE/UPSERT/DELETE) against the actual RLS policies, GRANTs, NOT NULL columns, and defaults — then produce a report of likely-failing endpoints. No code changes in this pass.

## Scope
Tables in `public`: aid_requests, contacts, contact_messages, contact_interactions, donations, donation_intents, events, event_rsvps, news_articles, gallery/media_assets, staff_members, expenses/budgets/expense_categories, partner_inquiries, volunteer_applications, profiles, user_roles, page_settings, receipts, rate_limits, email_* tables.

## Method
1. **Pull policy + schema truth from DB** for each table:
   - RLS enabled? Policies (cmd, roles, USING, WITH CHECK).
   - GRANTs per role (anon / authenticated / service_role).
   - Columns: NOT NULL, defaults, FK to `auth.users`.
2. **Inventory write call sites** in code:
   - Client writes: `rg "\.from\(['\"]\w+['\"]\)\.(insert|update|upsert|delete)" src` (browser supabase client → runs as the signed-in user, RLS applies).
   - Server-fn writes: same pattern inside `src/lib/**/*.functions.ts` and `*.server.ts`; classify each as `requireSupabaseAuth` (user RLS) vs `supabaseAdmin` (bypasses RLS).
   - Public route loaders that trigger writes (should be none).
3. **Match each call against the policy**:
   - Does the payload include the column the policy checks (e.g. `user_id = auth.uid()`)?
   - Are all NOT NULL columns without defaults supplied?
   - Does the caller's role have the required GRANT?
   - For admin-only tables (donations, expenses, staff, page_settings, etc.), is the server fn gated by `has_role(..., 'admin')`?
4. **Cross-reference with runtime evidence**:
   - Postgres logs for `new row violates row-level security policy`, `null value in column ... violates not-null`, `permission denied for table`.
   - Recent ~24h slice via `supabase--analytics_query` on `postgres_logs`.

## Deliverable
A single report per table with:
- Policy summary (one line per cmd).
- Each write site (file:line, client vs server, auth context).
- Verdict: OK / Risk (with reason: missing field, role mismatch, RLS predicate not satisfied, missing GRANT).
- Suggested fix (one line) — no edits applied.
- Top endpoints with observed failures from logs.

## Out of scope
- No migrations, no code edits. If the audit finds real bugs, I'll propose a follow-up plan with concrete fixes for your approval.
