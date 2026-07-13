# Test image uploads end-to-end (no WebP re-encoding)

Same plan as previously approved — re-issued unchanged for this turn.

Goal: prove that when an admin uploads an image through the app, the exact original bytes land in `site-images` storage and are served back unchanged, with the original MIME type and extension.

## What we're verifying

From `src/ported/lib/storage.ts` after the earlier refactor:
- `uploadImage` uploads `file` directly (no `optimizeImage` step).
- `path` keeps the original extension.
- `contentType` is `file.type`.
- `media_assets` row records `storage_path`, `mime_type`, `size_bytes`, and a signed URL.

## Test steps (Playwright via shell, script under `/tmp/browser/img-upload/`)

1. **Fixtures** — generate `sample.png` and `sample.jpg` with PIL under `/tmp/browser/img-upload/fixtures/`. Record SHA-256, byte length, MIME for each.
2. **Restore admin session** — hydrate `LOVABLE_BROWSER_SUPABASE_*` cookies + `localStorage` for `http://localhost:8080`. If `LOVABLE_BROWSER_AUTH_STATUS` is not `injected`, stop and tell the user.
3. **Drive UI** — go to `/admin`, open Gallery, set the `ImageUploader`'s file input to each fixture, wait for the spinner to clear and the preview `<img>` to receive a signed URL. Screenshot each state.
4. **DB row check** — via PostgREST with the restored access token, query the latest `media_assets` row after each upload and assert `mime_type`, extension of `storage_path`, and `size_bytes` match the source.
5. **Served bytes check** — fetch the signed `url`; assert `Content-Type` header, byte length, and SHA-256 of the response equal the source (definitive no-re-encoding check).
6. **Report** — compact pass/fail table per fixture (mime, ext, size, sha), screenshots saved.

## Out of scope

- No code changes; verification only.
- No cleanup of uploaded rows/objects.
- `uploadRawFile` (docs) not tested.

## Deliverables

- `/tmp/browser/img-upload/test.py`
- `/tmp/browser/img-upload/screenshots/*`
- Chat summary: PASS / FAIL per fixture.
