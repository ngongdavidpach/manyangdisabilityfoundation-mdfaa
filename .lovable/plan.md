# Test image uploads end-to-end (no WebP re-encoding)

Goal: prove that when an admin uploads an image through the app, the exact original bytes land in `site-images` storage and are served back unchanged — with the original MIME type and extension.

## What we're verifying

From `src/ported/lib/storage.ts` after the earlier refactor:
- `uploadImage` uploads `file` directly (no `optimizeImage` step).
- `path` keeps the original extension.
- `contentType` is `file.type` (falls back to `application/octet-stream`).
- A `media_assets` row records `storage_path`, `mime_type`, `size_bytes`, and a signed URL.

The test confirms all of the above at runtime against the live preview.

## Test steps (Playwright via shell, one script under `/tmp/browser/img-upload/`)

1. **Prepare fixtures** — write two small, distinct source files to `/tmp/browser/img-upload/fixtures/`:
   - `sample.png` — a real PNG (generated with PIL; distinctive pixels).
   - `sample.jpg` — a real JPEG (generated with PIL).
   Record each file's SHA-256, byte length, and MIME.

2. **Restore admin session** — use `LOVABLE_BROWSER_SUPABASE_*` env vars (see browser-use guidance) to hydrate cookies + `localStorage` for `http://localhost:8080`. If `LOVABLE_BROWSER_AUTH_STATUS` is `signed_out`/`external_unmanaged`, stop and tell the user to sign in via the preview so a session can be minted; do not ask for credentials.

3. **Drive the upload UI** — navigate to `/admin`, open the Gallery / media section that renders `ImageUploader`, and use `page.set_input_files()` on the `input[type=file]` for each fixture. Wait for the "Optimizing & uploading…" spinner to disappear and for the preview `<img>` to receive a signed URL. Screenshot each state.

4. **Verify database row** — using the anon Supabase REST endpoint with the restored access token, query `media_assets` ordered by `created_at desc limit 1` after each upload and assert:
   - `mime_type` equals the source MIME (`image/png` / `image/jpeg`).
   - `storage_path` ends with the original extension (`.png` / `.jpg`).
   - `size_bytes` equals the source byte length.

5. **Verify served bytes** — fetch the returned signed `url`, download the response body, and assert:
   - `Content-Type` header matches the source MIME.
   - Response byte length equals the source byte length.
   - SHA-256 of the response equals the source SHA-256. This is the definitive "no re-encoding" check.

6. **Report** — print a compact pass/fail table (fixture, mime, path ext, size match, sha match) and save screenshots. Any mismatch is a failure and gets surfaced with the diff.

## Out of scope

- No code changes. This is a verification-only run.
- No cleanup of uploaded rows/objects (they are small; can be pruned later if desired).
- No test for `uploadRawFile` (docs) unless requested — the concern was images.

## Deliverables

- `/tmp/browser/img-upload/test.py` (Playwright script)
- Screenshots under `/tmp/browser/img-upload/screenshots/`
- A short summary in chat: PASS / FAIL per fixture with the four assertions above.
