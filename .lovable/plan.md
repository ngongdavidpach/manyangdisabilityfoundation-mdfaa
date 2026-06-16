## Goal

Run an SEO review on the project, verify Google Search Console ownership for the live site, and submit the sitemap.

## Target site

- Site identifier: `https://manyangdisabilityfoundation.org/`
- Sitemap URL: `https://manyangdisabilityfoundation.org/sitemap.xml` (already served by `src/routes/sitemap[.]xml.ts`)

## Steps

1. **Trigger SEO review**
   - Read current findings via the SEO findings tool, then start a fresh scan (requires user approval). Direct user to the SEO results panel for output.

2. **Verify site ownership via Google Search Console (META method)**
   - Request a `META` verification token from the Site Verification API for `https://manyangdisabilityfoundation.org/`.
   - Inject the returned `<meta name="google-site-verification" content="…">` into the site root by adding it to the `head().meta` array in `src/routes/__root.tsx` so it ships in SSR HTML for every route (including `/`).
   - Note: the verification call in step 3 will only succeed once the change is **published** to `manyangdisabilityfoundation.org` (Google fetches the live domain, not the preview). The plan will surface a publish action so the user can deploy before we proceed.

3. **Call the verify endpoint**
   - After the user publishes, POST to `siteVerification/v1/webResource?verificationMethod=META` to confirm ownership.

4. **Add the verified site to Search Console**
   - PUT `webmasters/v3/sites/https%3A%2F%2Fmanyangdisabilityfoundation.org%2F` to register the property.

5. **Submit the sitemap**
   - PUT `webmasters/v3/sites/https%3A%2F%2Fmanyangdisabilityfoundation.org%2F/sitemaps/https%3A%2F%2Fmanyangdisabilityfoundation.org%2Fsitemap.xml` to submit `/sitemap.xml` for indexing.

## Files to change

- `src/routes/__root.tsx` — add one `{ name: "google-site-verification", content: "<token>" }` entry to the existing `head().meta` array. No other edits.

## Notes

- Steps 1 (SEO scan) and 2 (request token + add meta tag) can run immediately.
- Steps 3–5 require the meta tag to be live on `manyangdisabilityfoundation.org`. After the meta tag is added, you'll need to publish; then I'll run verify, site registration, and sitemap submission in one batch.
- No changes to `sitemap[.]xml.ts` or `robots.txt` are needed — both are already correctly configured for `manyangdisabilityfoundation.org`.
