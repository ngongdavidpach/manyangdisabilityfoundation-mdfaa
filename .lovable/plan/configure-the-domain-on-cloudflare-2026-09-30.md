# Configure the domain on Cloudflare

## Goal
Connect your Cloudflare account to this project, add the DNS records your domain is missing, and get donor confirmation emails sending again.

## Current state (verified)
- The domain manyangdisabilityfoundation.org already uses Cloudflare nameservers, and its website records are proxied through Cloudflare. The site itself loads fine.
- The email-sending domain (notify.manyangdisabilityfoundation.org) is **not** set up: its records are missing and status is "provisioning_failed". This is why donation confirmation emails are not arriving.
- A Cloudflare connection ("My Cloudflare API") exists in the workspace but is not linked to this project yet.

## Steps

1. **Link Cloudflare** — link the existing "My Cloudflare API" connection to this project (an in-chat card will ask you to confirm).

2. **Review the website records** — read the zone's DNS records through Cloudflare and confirm the root domain and www point to Lovable correctly (A records to 185.158.133.1 or a proxied CNAME), with no conflicting or stale records. Report anything unexpected before changing it.

3. **Add the missing email records** (after showing you the exact records for confirmation):
   - TXT `_lovable-email` → `lovable_email_verify=53d72707ad62fb4835e870138b7413a2c29c7903c33747a46b50393fcd06007a`
   - NS `notify` → `ns3.lovable.cloud`
   - NS `notify` → `ns4.lovable.cloud`

4. **Re-verify the email domain** — trigger the re-check, confirm the sender domain turns verified/active, and send a test through the donation flow.

5. **Verify** — the website still resolves at both addresses, and a test pledge confirmation email is accepted for delivery.

## Risks and notes
- Adding records is low-risk and reversible; I will show each record and get your confirmation before writing anything.
- If Cloudflare refuses the `notify` subdomain delegation (NS records on a subdomain are occasionally restricted on some plans), I will report Cloudflare's exact error and the fallback is contacting Lovable support.
- Nothing about the website's DNS will be changed unless a record is actually wrong — and only after confirming with you.
