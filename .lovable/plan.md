# Finish Turnstile (spam protection) integration

## Current state (verified)

The Turnstile integration code is already complete:

- `src/ported/components/views/ContactView.tsx` renders the Turnstile widget on the contact form and blocks submission until the visitor passes the check.
- `src/lib/contact.functions.ts` verifies the token server-side against Cloudflare before saving a message, and rejects submissions when the secret key is missing.
- The `/contact` route reads the site key through `getTurnstileSiteKey`.

The only missing piece is configuration: neither `TURNSTILE_SITE_KEY` nor `TURNSTILE_SECRET_KEY` is stored, so the form currently shows "Spam protection is not configured yet" and cannot send messages.

## What I'll do

1. **Store the site key** — save `TURNSTILE_SITE_KEY` = `0x4AAAAAAFKakaoowdpt9e4H` (the key you provided; site keys are public by design).
2. **Request the secret key** — open the secure secret form for `TURNSTILE_SECRET_KEY`. You paste the secret key from the same Cloudflare Turnstile widget (Cloudflare dashboard → Turnstile → your widget → Settings → Secret Key).
3. **Verify end to end** — load `/contact` in a test browser, confirm the widget renders, and confirm a submission passes verification and is recorded.

## Notes

- No code changes needed — the widget, verification, rate limiting, and error handling already exist.
- If you later want Turnstile on other public forms (donation pledge, request aid, RSVP), that would be a separate change.
