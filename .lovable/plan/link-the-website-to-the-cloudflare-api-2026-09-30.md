# Link the website to the Cloudflare API

## Goal
Link your Cloudflare connection ("My Cloudflare API") to this project so the site's domain can be read and managed through Cloudflare from here.

## Current state (verified just now)
- A Cloudflare connection named "My Cloudflare API" exists in the workspace with access, but it is **not linked to this project** (it appears to have been re-created, so the old link is gone).
- The domain manyangdisabilityfoundation.org already runs on Cloudflare nameservers; website DNS and SSL were verified correct in the previous check.
- The remaining email fix (the `_lovable-email` TXT and two `notify` NS records) needs the connection linked so the records can be added and verified.

## Steps
1. Link the "My Cloudflare API" connection to this project — an in-chat card will ask you to confirm.
2. Verify access: read the zone for manyangdisabilityfoundation.org and its DNS records through the linked connection.
3. If DNS read works, report the current records (website + any email records already present) so we know exactly what's missing for the email fix.

## Notes
- Linking does not change any DNS records or affect the website — it only grants this project the ability to read/manage your Cloudflare account through the saved API token.
- Adding or changing DNS records will only happen after you see and approve the exact records.
