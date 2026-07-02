## Goal

Remove `'unsafe-inline'` from the `script-src` CSP directive in `src/server.ts` and authorize the SSR-emitted inline scripts (TanStack Start hydration payload, dehydrated Query cache, router state) via a per-request cryptographic nonce instead.

## Approach

All responses flow through `applySecurityHeaders` in `src/server.ts`. I'll extend that path so that, for HTML responses, we:

1. Generate a fresh 128-bit nonce per request using `crypto.getRandomValues` (base64-encoded). Runs in the Cloudflare Worker — Web Crypto is available.
2. Stream/parse the HTML body and add `nonce="<value>"` to every inline `<script>` tag emitted by SSR (both `<script>...</script>` and `<script ...src="/_build/...">` — nonce on external scripts is harmless and required by `strict-dynamic`).
3. Emit CSP with `script-src 'self' 'nonce-<value>' 'strict-dynamic' https:` and drop `'unsafe-inline'`. `'strict-dynamic'` lets the nonced hydration bootstrap import the rest of the chunk graph without having to nonce every dynamically-injected script.
4. Non-HTML responses (JSON server-fn output, RSS, sitemap, images) skip HTML rewriting and get CSP without a nonce (they don't execute scripts).

## Scope of the CSP change

```text
script-src 'self' 'nonce-<value>' 'strict-dynamic' https:
```

- Removes `'unsafe-inline'` from `script-src` (the requested fix).
- Keeps `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com` unchanged. Nonces do not cover React's inline `style={...}` attributes (component styles, Tailwind arbitrary values via CSS vars, chart libs), and removing `'unsafe-inline'` from styles would visually break the app. That's a separate, larger refactor and outside this request.
- All other directives (`img-src`, `connect-src`, `frame-ancestors`, etc.) stay as-is.

## Files touched

- `src/server.ts` — add `generateNonce()`, add an HTML rewriter (Cloudflare `HTMLRewriter` is available in Workers) that stamps `nonce` on `<script>` tags, thread the nonce into the CSP string builder, and only run the rewriter on `text/html` responses. Fallback (non-Worker environments where `HTMLRewriter` is absent) uses a small regex-based injector on the response text.

## Verification

- Load `/`, `/admin`, `/programs` in the preview and confirm no CSP violation reports in the console and the app hydrates (buttons/links interactive).
- Curl the HTML and confirm every `<script>` tag carries the same nonce and the `Content-Security-Policy` header contains the matching `'nonce-...'` and no `'unsafe-inline'` in `script-src`.

## Notes / trade-offs

- `'strict-dynamic'` intentionally makes the `https:` / `'self'` host allowlist ignored by CSP3-compliant browsers; the nonce transitively authorizes further scripts. Older browsers fall back to the host list, so behavior degrades safely.
- If a third-party embed (analytics, chat widget) is added later that injects inline scripts without a nonce, it will be blocked — that's the intended behavior.
