## Goal
Add missing HTTP security headers (CSP, X-Frame-Options, Permissions-Policy) plus related hardening to every response served by the app.

## Approach
Wrap the response in `src/server.ts` (the Worker entry) so headers apply uniformly to SSR pages, static assets, and API/server-function responses. Skip overriding `Content-Type` and streaming bodies — only append/replace headers.

## Headers to set

- **Content-Security-Policy**  
  `default-src 'self'; script-src 'self' 'unsafe-inline' https://*.lovable.app https://*.lovable.dev; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.lovable.app https://*.lovable.dev; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests`  
  (`'unsafe-inline'` for script kept because TanStack Start injects inline SSR hydration + JSON-LD script tags; switching to nonces would require deeper router changes and is out of scope.)

- **X-Frame-Options**: `DENY` (redundant with `frame-ancestors` but kept for legacy browsers).

- **Permissions-Policy**: `camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=(), browsing-topics=()`.

- **Referrer-Policy**: `strict-origin-when-cross-origin`.
- **X-Content-Type-Options**: `nosniff`.
- **Strict-Transport-Security**: `max-age=31536000; includeSubDomains; preload` (only for HTTPS requests).

## Changes

1. `src/server.ts` — after `handler.fetch(...)` and `normalizeCatastrophicSsrResponse`, clone the response, mutate headers, return the new `Response`. Same treatment inside the outer `catch` (500 page).
2. No changes needed to `wrangler.jsonc`, routes, or `__root.tsx`.

## Verification
- Run production build, curl `/` and confirm all headers present.
- Load site in preview, confirm no CSP violations in console for fonts, images, Supabase XHR/WebSocket, or hydration script.
- If a violation appears (e.g. an analytics domain), extend the relevant CSP directive.
