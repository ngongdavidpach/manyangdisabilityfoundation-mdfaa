# Add missing email DNS records in Cloudflare

## Goal
Add the three missing DNS records so the site's sender domain (notify.manyangdisabilityfoundation.org) can be verified and donor confirmation/notification emails start sending.

## Verified current state
- Domain is on Cloudflare nameservers (bryce/erin), zone active, site proxied and loading over HTTPS with HSTS.
- Cloudflare API token now has Zone Read + DNS Read/Edit (zone settings read still 403, not needed).
- Missing records confirmed via DNS lookup and zone record list: `_lovable-email` TXT, `notify` NS x2.

## Steps
1. Create TXT record: name `_lovable-email`, content `lovable_email_verify=53d72707ad62fb4835e870138b7413a2c29c7903c33747a46b50393fcd06007a`.
2. Create NS record: name `notify`, target `ns3.lovable.cloud`.
3. Create NS record: name `notify`, target `ns4.lovable.cloud`.
4. Confirm the records resolve publicly (DNS lookup).
5. Re-verify the email domain in Lovable Cloud (Cloud → Emails → Retry setup).
6. Send a test pledge on /donate with an email address and confirm the confirmation email is queued and sent.

## Technical details
- Changes made through the linked Cloudflare connection ("My Cloudflare API") via the connector gateway; zone id 4695b87cc9a6a62a94a51a983cd1cb77.
- All three records are additive; no existing records are modified or deleted. Fully reversible.
- No code changes needed — the email templates, queue, and sender are already built and tested.

## Risks
- Low: adding records does not affect website traffic or existing email routing.
- If verification still fails after records propagate, the fallback is Lovable support.
