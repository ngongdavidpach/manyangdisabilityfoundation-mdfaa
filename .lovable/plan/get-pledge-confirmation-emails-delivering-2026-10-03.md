# Get pledge confirmation emails delivering

## Verified current state
- The pledge form, confirmation email template, and sending queue are already built. No code is missing.
- Sender domain notify.manyangdisabilityfoundation.org shows **Failed** (verification timed out after 7 days).
- Checked just now: the TXT record and both `notify` NS records (ns3/ns4.lovable.cloud) are set correctly in Cloudflare.
- Lovable's email nameservers are not answering for the `notify` zone yet. That's why verification fails, and it happens on the Lovable side, not in your DNS.

## Steps
1. **You:** open Cloud → Emails and click **Retry setup**. This restarts provisioning now that the records are correct. No DNS changes are needed.
2. **Me (next turn):** re-check the domain status and confirm Lovable's nameservers answer for `notify`.
3. Once it shows Active, send a test pledge with an email address on /donate. Then confirm the confirmation email is logged as sent, not failed.
4. Retry any recent pledge confirmations that failed, so donors who already pledged get their payment details (one email per pledge, using the existing idempotency key).
5. If Retry setup fails again with the records still correct, contact Lovable support. Retrying over and over won't help.

## Technical details
- No changes to source files or the database schema. The send path (queue.server.ts → enqueue_email → /lovable/email/queue/process) stays as is.
- Step 4 re-queues failed `donation-pledge-confirmation` entries from email_send_log, using each pledge's donor email and reference from donation_intents.
