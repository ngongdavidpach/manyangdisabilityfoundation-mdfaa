## Goal

Give admins a dedicated upload screen to manage the **Foundation Insight** block on the home page — title, brief intro text, cover image, brochure PDF, and an embedded intro video.

## Where it lives

- **Admin:** new "Foundation Insight" tab in the Admin Dashboard, alongside News / Events / Staff / Gallery.
- **Public:** existing home insight section (already rendered by `HomeView`) — extended to show the brochure download and the embedded video when set.

## Storage

Reuse existing infrastructure — no schema changes.
- Text + URLs → `page_settings` row with `page_key = 'home'`, under `insight.*`.
- Cover image → existing `site-images` storage bucket via `ImageUploader`.
- Brochure PDF → same `site-images` bucket under `pages/home/brochures/`, stored as a public URL in `insight.brochureUrl`.

## Admin UI — `src/ported/components/admin/FoundationInsightManager.tsx` (new)

Fields, all saved to `page_settings.content.insight`:
- `title` — text input
- `body` — textarea (brief intro)
- `cover` — image upload (reuses `ImageUploader`)
- `brochureUrl` — file upload button for PDF (new lightweight uploader, same bucket, accepts `application/pdf`) + clear button
- `videoUrl` — text input (YouTube / Vimeo URL); we normalize to an embed URL on render

Single "Save changes" button → upsert into `page_settings` (`page_key='home'`), merging with existing content so other home fields are preserved.

## Wiring

- `src/ported/components/views/AdminDashboardView.tsx` — add new tab "Foundation Insight" that renders `FoundationInsightManager`.
- `src/ported/components/views/HomeView.tsx` — in the insight section, render:
  - cover image (existing)
  - title + body (existing)
  - "Download brochure" button when `brochureUrl` is set
  - responsive 16:9 `<iframe>` for `videoUrl` (YouTube/Vimeo embed) when set
- `PageSettingsEditor.tsx` — leave existing home insight fields in place (admins can still edit there); the new tab is the primary, friendlier entry point.

## Technical notes

- PDF upload: `supabase.storage.from('site-images').upload(...)` then `getPublicUrl`; validate `file.type === 'application/pdf'` and size ≤ 10 MB.
- Video URL: helper `toEmbedUrl(url)` converts `youtube.com/watch?v=…`, `youtu.be/…`, and `vimeo.com/…` to their `/embed/` form; if unrecognized, render as a plain link instead of an iframe.
- Inputs validated with `zod` (title ≤ 120, body ≤ 1000, URLs `.url()`).
- No new tables, no new RLS — `page_settings` already restricts writes to admins.
