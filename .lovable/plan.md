## Goals

1. **Audit log page** at `/dashboard/activity` showing the signed-in user's cookie-consent and email-preference changes.
2. **Confirmation email** on every successful email-preference update (both signed-in and token flows).
3. **Granular cookie controls** — the banner already has necessary/analytics/marketing toggles; add a dedicated `/cookie-settings` page and a "Cookie settings" link in the footer so users can revisit and edit categories after the initial choice.

## What to build

### 1. Audit log

**DB migration** — new `user_activity_log` table:
- `user_id uuid` (nullable — cookie events may be pre-auth), `email citext` (nullable), `event_type text` (`cookie_consent_updated` | `email_preferences_updated`), `details jsonb` (category diff / new values), `ip inet`, `user_agent text`, `created_at`.
- GRANTs: `SELECT` to `authenticated` (own rows only), `ALL` to `service_role`. `INSERT` only via service role from server routes.
- RLS: `SELECT USING (auth.uid() = user_id)`.

**Server writes** (service-role, from existing routes):
- `POST /api/public/email-preferences` — after successful upsert, insert an `email_preferences_updated` row with the diff of changed categories.
- New `POST /api/public/cookie-consent-log` — accepts `{ analytics, marketing, source }` + optional bearer. Client calls it from `useCookieConsent.persist` whenever the user saves. Rate-limited by IP.

**Page** `/dashboard/activity` (protected):
- Server fn `listMyActivity` behind `requireSupabaseAuth` returning last 100 rows for `context.userId` ordered desc.
- Simple table: timestamp, event type, human-readable summary of `details`.

### 2. Confirmation email on preference change

**Template** `email-preferences-updated.tsx` (React Email):
- Shows the new preference state (which categories are on/off, whether globally unsubscribed) and a link to `/dashboard/email-preferences` or the token page.
- Registered in `src/lib/email-templates/registry.ts`.

**Trigger** in `src/routes/api/public/email-preferences.ts` POST handler:
- After the successful upsert, enqueue `email-preferences-updated` via existing `enqueueTransactionalEmail` helper with `templateData` = the new prefs snapshot.
- Skip send if the user just enabled `unsubscribed_all` (they explicitly asked to stop non-essential email) — instead send one final "confirmation of unsubscribe" email, since it's a directly-triggered account notice.
- Idempotency key = `pref-update-${email}-${timestamp}` to avoid duplicate sends on retries within the same batch.

### 3. Granular cookie controls + settings page

The banner (`src/ported/components/CookieConsent.tsx`) already exposes necessary/analytics/marketing toggles behind "Customize" — no schema change needed there.

Additions:
- **`/cookie-settings` route** — dedicated page that uses `useCookieConsent()` to render the same three toggles with save/accept-all/reject-all actions, plus a summary of the current consent and last-updated timestamp.
- **Footer link** — add "Cookie settings" in `Footer.tsx` next to Privacy.
- **Persist call** in `useCookieConsent.persist` — POST to `/api/public/cookie-consent-log` (fire-and-forget) with the new category booleans so the audit log captures it.

## Technical details

- No changes to existing email preferences data model; the audit log is additive.
- The confirmation email is itself an "account" category message and always sends (users cannot silence confirmations of changes they just made) — matches the pattern used for account deletion confirmations.
- Cookie-consent logging works pre-auth (writes `user_id` null, keeps IP + UA), then can be correlated later if the same session signs in — but the dashboard page only shows rows where `user_id = auth.uid()`, so pre-auth events won't appear unless we also match by a stored anonymous id. Keeping scope simple: only signed-in cookie changes appear in the audit page; the log still records anonymous rows for admin/compliance queries.

## Files

New:
- `src/routes/dashboard.activity.tsx`
- `src/routes/cookie-settings.tsx`
- `src/routes/api/public/cookie-consent-log.ts`
- `src/lib/activity.functions.ts` (server fn `listMyActivity`)
- `src/lib/email-templates/email-preferences-updated.tsx`
- Migration for `user_activity_log`

Edited:
- `src/routes/api/public/email-preferences.ts` (log + send confirmation)
- `src/lib/email-templates/registry.ts` (register new template)
- `src/lib/email/preferences.ts` (map new template → `account` category, always-send exception)
- `src/ported/hooks/useCookieConsent.ts` (POST to log route on save)
- `src/ported/components/Footer.tsx` (add Cookie settings link)
- `src/ported/components/views/AdminDashboardView.tsx` / dashboard sidebar (link to Activity)
