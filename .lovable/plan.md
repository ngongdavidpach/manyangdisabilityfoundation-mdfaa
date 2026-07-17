## Goal
Publish a GDPR-aligned privacy policy for Manyang Disability Foundation, plus a linked email/communications addendum, and wire it up in the footer.

## Sources of truth (from user)
- **Data controller:** Manyang Disability Foundation, Australia. Reaches EU/UK users.
- **Privacy contact:** `privacy@manyangdisabilityfoundation.org`
- **Retention:** 1 month for contact/communications data.
- **Emails sent:** Transactional + auth only. No marketing/newsletter.
- **Existing site facts:** ABN 75 986 228 179; ACNC-registered; contact form at `/contact`; account deletion at `/auth/delete-account`; data export from the same page.

Anything outside these + observable app behaviour will NOT be claimed (no ISO/SOC 2/end-to-end encryption/breach guarantees). Page carries the trust-baseline qualifiers: "maintained by MDF", "not a certification", shared-responsibility note about the hosting platform.

## New routes
1. **`src/routes/privacy.tsx`** — main privacy policy `/privacy`
   Sections:
   - Who we are & how to contact us (entity, ABN, ACNC, privacy@ address, /contact link).
   - Data we collect (contact form; donations — name/email/amount; event RSVPs; volunteer/coordinator/fundraiser/aid-request submissions; staff auth account data; server logs for security).
   - Legal bases (GDPR Art. 6): consent for contact/RSVP, contract for donations, legitimate interest for security logs, legal obligation for donation records where applicable.
   - How we use it (respond to enquiries, process donations, coordinate programs, send transactional + auth emails only).
   - Emails — brief, with a "Read the email addendum" link to `/privacy/emails`.
   - Sharing / subprocessors: hosting + database + email delivery through our platform provider; payment processor for donations; no sale of personal data.
   - International transfers: data may be processed outside the EU/UK/Australia by our providers; safeguards summarised generically.
   - Retention: 1 month for contact-form/communications; donation records retained as required by Australian tax/charity law; auth accounts until you delete them via `/auth/delete-account` (30-day grace period).
   - Your rights (GDPR + Australian Privacy Act): access, rectification, erasure, restriction, objection, portability, withdraw consent, lodge a complaint. Australian users → OAIC; EU users → their local supervisory authority; UK users → ICO.
   - How to exercise rights — email `privacy@…`, or use `/auth/delete-account` (export + delete) for account holders.
   - Cookies & analytics — session/auth cookies only unless stated; no third-party ad tracking.
   - Children — service not directed at under-16s.
   - Changes to this policy + "Last updated" date.

2. **`src/routes/privacy.emails.tsx`** — email addendum `/privacy/emails`
   Sections:
   - Scope: what emails the site sends and why.
   - Categories: (a) **Auth emails** (signup confirm, password reset, magic link, email change, reauth, invite) — legal basis: contract/necessary for the service; (b) **Transactional emails** (donation receipt, event RSVP confirmation, coordinator/fundraiser status, account-deletion request/confirmation, unsubscribe confirmation) — legal basis: contract/legitimate interest.
   - **No marketing emails.** No newsletter. Contact-form replies are 1:1 correspondence.
   - How email addresses are collected (forms, account creation).
   - Where data flows: pre-rendered on our server, queued, delivered by our email-sending infrastructure, with delivery/bounce/complaint records kept.
   - Suppression list: bounces/complaints/unsubscribes stored to protect deliverability (append-only).
   - Unsubscribe / opt-out: link in every eligible email; auth emails cannot be unsubscribed because they secure your account; if you no longer want any email from us, delete your account at `/auth/delete-account` or email privacy@.
   - Retention: log records kept 1 month; suppression list kept while your address remains contactable.
   - Your rights + privacy contact (mirrored).
   - "Last updated" date.

## Wiring
- **Footer** (`src/ported/components/Footer.tsx`, lines ~373-380): replace the "Privacy" button (currently routes to `/about`) with a TanStack `<Link to="/privacy">Privacy</Link>`.
- **Contact form** (`src/routes/contact.tsx` / `ContactView`): add a small helper line under the submit button — "By submitting, you agree to our [Privacy Policy](/privacy)." Only if the current form doesn't already say so.
- **Account deletion page** already links to /auth/change-password; add a "See our Privacy Policy" link at the bottom.
- **Root sitemap** (`src/routes/sitemap[.]xml.ts`) — include `/privacy` and `/privacy/emails` as public URLs.

## Design & implementation
- Reuse existing app shell (root layout, Tailwind tokens, typography). No new palette or components.
- Semantic HTML: single `<h1>`, `<h2>` per section, `<address>` for contact block, table of contents at the top with in-page hash links (this is the trust-page exception — one long page).
- SEO: unique `head()` per route (title, description, `og:title`, `og:description`, robots follow/index). No og:image.
- Both pages are static — no loader, no server fn calls.
- Qualifier line at top: "This page is maintained by Manyang Disability Foundation to describe how we handle personal data. It is not an independent certification."

## Non-goals
- No changes to how data is actually collected or stored.
- No cookie-consent banner (only strictly-necessary cookies are used).
- No DPO appointment claim, no ISO/SOC 2/HIPAA/PCI/GDPR-certified claims.
- No changes to email sending infrastructure.

## Files
- **create** `src/routes/privacy.tsx`
- **create** `src/routes/privacy.emails.tsx`
- **edit** `src/ported/components/Footer.tsx` (wire Privacy link)
- **edit** `src/routes/sitemap[.]xml.ts` (add new URLs)
- **edit** `src/routes/auth.delete-account.tsx` (small "Privacy Policy" link)
- **edit** `src/routes/contact.tsx` or the underlying ContactView (add privacy disclosure line if missing)