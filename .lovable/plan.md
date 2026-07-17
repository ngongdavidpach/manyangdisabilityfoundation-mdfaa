## 1. Cookie consent banner

New component `src/ported/components/CookieConsent.tsx`, mounted once in `__root.tsx` `ClientShell` (hidden on `/admin`).

- Reads `mdf.cookieConsent` from `localStorage`. If missing, shows a fixed bottom banner.
- Banner shows short notice + three buttons: **Accept all**, **Reject non-essential**, **Customize**.
- **Customize** expands per-category toggles:
  - Necessary (always on, disabled toggle) — auth/session cookies
  - Analytics (default off) — currently unused, reserved for future
  - Marketing (default off) — currently unused, reserved for future
- Stores `{ necessary: true, analytics: bool, marketing: bool, updatedAt, version: 1 }` in `localStorage`.
- Exposes a `useCookieConsent()` hook returning current prefs + `openPreferences()` to reopen the banner.
- Footer gets a **"Cookie preferences"** link that calls `openPreferences()`.
- Privacy policy (`/privacy`) gets a "Manage cookie preferences" link in the Cookies section.
- No analytics/marketing scripts are currently loaded — banner only records intent for now, ready for future gating.

## 2. Email preferences

### Data model (new migration)

New table `public.email_preferences`:

```text
id uuid pk
email citext unique not null      -- normalized recipient email
user_id uuid null references auth.users(id) on delete set null
receipts boolean default true     -- donation receipts
events boolean default true       -- event RSVP / reminders
coordinators boolean default true -- coordinator confirmations/approvals
fundraisers boolean default true  -- fundraiser confirmations/approvals
account boolean default true      -- account-deletion etc. (non-security)
unsubscribed_all boolean default false
updated_at timestamptz default now()
```

- GRANTs: `authenticated` SELECT/INSERT/UPDATE own row; `service_role` ALL; no anon.
- RLS: authenticated users can read/write rows where `email = auth.jwt() ->> 'email'` OR `user_id = auth.uid()`.
- Trigger to keep `updated_at` current.

Auth emails (signup, recovery, magic-link, reauth, invite, email-change) are **always sent** — required for account security — and are documented as such on the page.

### Send-path enforcement

`src/lib/email/enqueue.server.ts` gains a `category` field (e.g. `"receipts" | "events" | "coordinators" | "fundraisers" | "account" | null`). Before enqueue:

1. Existing suppression check.
2. New check: look up `email_preferences` by normalized email. If `unsubscribed_all` or the category flag is false, skip with `reason: "category_opted_out"` and log to `email_send_log` as `skipped`.
3. Auth emails route through the auth webhook and are not gated by this table.

All existing transactional call sites (donations, event RSVP, coordinator/fundraiser flows, account deletion) pass the appropriate `category`.

### Access surfaces

**A. Signed-in users** — new route `src/routes/_authenticated/dashboard.email-preferences.tsx` (or plain `dashboard/email-preferences` matching existing convention). Reachable from Dashboard via a "Email preferences" card.

**B. Token link from emails** — new public route `src/routes/email/preferences.tsx` (page) + `src/routes/email/preferences.ts` (API):

- Reuses existing `email_unsubscribe_tokens` table (already keyed by email); no new token infra.
- Page reads `?token=…`, GETs `/email/preferences?token=…` to validate and fetch current prefs, renders toggles, POSTs to save.
- API validates token, resolves the email, upserts `email_preferences`. Does **not** mark the token used (so the user can revisit).
- Footer of every transactional email gets a "Manage email preferences" link alongside the existing "Unsubscribe" link, pointing to `/email/preferences?token=…` using the same token variable.

### Admin dashboard toggle sync

The existing dashboard shows a global unsubscribe status via `suppressed_emails`. The new page renders both:
- Category toggles (writes `email_preferences`)
- "Unsubscribe from all non-essential emails" master toggle (writes `unsubscribed_all` and adds/removes from `suppressed_emails` to stay consistent with existing suppression logic)

### Privacy policy updates

- `/privacy/emails`: add a "Manage your preferences" section linking to `/email/preferences` (token) and `/dashboard/email-preferences` (signed in).
- Clarify that auth/security emails cannot be disabled while an account exists; deleting the account is the way to stop them.

## 3. Files changed / created

Created:
- `src/ported/components/CookieConsent.tsx`
- `src/ported/hooks/useCookieConsent.ts`
- `src/routes/email/preferences.tsx` (user-facing page)
- `src/routes/email/preferences.ts` (GET/POST JSON API)
- `src/routes/dashboard.email-preferences.tsx` (signed-in view; placed to match existing dashboard routing)
- SQL migration for `email_preferences` table, grants, RLS, trigger

Edited:
- `src/routes/__root.tsx` — mount `<CookieConsent />` in `ClientShell`
- `src/ported/components/Footer.tsx` — "Cookie preferences" link
- `src/lib/email/enqueue.server.ts` — accept `category`, enforce preferences
- Existing send call sites — pass `category`
- `src/lib/email-templates/_shared.tsx` — footer gets "Manage preferences" link next to unsubscribe
- `src/routes/privacy.emails.tsx` and `src/routes/privacy.tsx` — link to preferences pages, clarify auth-email policy
- `src/routes/sitemap[.]xml.ts` — no additions (token/auth pages are noindex)
- `src/ported/components/views/DashboardView.tsx` — card linking to email preferences

## Non-goals

- No changes to the auth webhook or auth email content.
- No cookie category currently gates any real script (no analytics/ads today) — banner records intent only.
- No token rotation / expiry changes to `email_unsubscribe_tokens`.
- No new email templates.
