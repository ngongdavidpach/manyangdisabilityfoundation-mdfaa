# Switch site emails to Resend

## Goal
Send all site emails (pledge confirmations, receipts, RSVPs, notifications) through your Resend account instead of Lovable's built-in email service.

## Verified current state
- A Resend connection named "My Resend" exists in your workspace (API key, gateway-backed) but is not linked to this project yet.
- The site currently sends through Lovable's managed email service via `sendTemplateEmail` in `src/lib/email-templates/send-email.ts` (sender domain `notify.manyangdisabilityfoundation.org`), called from `src/lib/email/managed-send.server.ts`. All templates live in `src/lib/email-templates/` and are registered in `registry.ts`.
- The subdomain `notify.manyangdisabilityfoundation.org` is delegated to Lovable's nameservers (NS records in Cloudflare). Resend cannot verify that same subdomain, so Resend will use a **different** subdomain: `send.manyangdisabilityfoundation.org`.
- Your Cloudflare connection is already linked, so the DNS records Resend needs can be added automatically.

## Steps
1. Link the "My Resend" connection to this project (an in-chat card will ask you to confirm).
2. Register the domain `send.manyangdisabilityfoundation.org` in Resend through the API and read back the DNS records Resend requires (DKIM, SPF, MX).
3. Add those records in Cloudflare through your linked Cloudflare connection, then trigger Resend's domain verification and confirm it passes.
4. Rewrite the send helper (`send-email.ts`) to send through the Resend API via the connector gateway, from `Manyang Disability Foundation <noreply@send.manyangdisabilityfoundation.org>`. Keep the existing templates, preference checks, and email history logging unchanged — only the delivery step changes.
5. Remove the now-unused Lovable email sender config and the Lovable email events webhook route (`src/routes/lovable/email/events.ts`), which only receives events from Lovable's service.
6. Build check, then a real test: send a test pledge confirmation and confirm it appears in your Resend dashboard as delivered.

## About "email routing" (receiving mail)
Resend's inbound email receiving is limited and not needed for this site — the site only sends email. If you meant receiving replies (e.g. mail to noreply@ or info@), tell me and I'll extend the plan; otherwise the plan covers sending only.

## Technical details
- Gateway calls: `POST https://connector-gateway.lovable.dev/resend/...` with `Authorization: Bearer LOVABLE_API_KEY` and `X-Connection-Api-Key: RESEND_API_KEY`, server-side only.
- Auth (sign-in) emails are separate: they currently also go through Lovable's email service. Switching those to Resend is possible but adds risk to sign-in; this plan leaves auth emails as-is unless you ask otherwise.
- Lovable-side suppression/unsubscribe handling is replaced by Resend's own suppression; the site's own per-category email preferences keep working.

## Risks
- Until the Resend domain verifies and the new code is published, emails keep going through the current (failing) path.
- The `notify` subdomain NS records in Cloudflare stay in place; removing them is optional and can be done later.
