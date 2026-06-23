## Goal

Make the content that admins manage in `/admin` actually appear on the public website. Today, several admin sections write to the right tables but the public views ignore them (or no public surface exists).

## Current gap

| Admin tool | Writes to | Public surface today |
|---|---|---|
| Page Content editor | `page_settings` | Already wired through `usePageSettings` (RLS gates on `published=true`). OK. |
| Media Library | `media_assets` | Not displayed. Gallery reads `page_settings.gallery.images` instead. |
| News | `news_articles` (status/published_at) | Not displayed. NewsView reads `page_settings.news.articles`. |
| Events | `events` (status, starts_at…) | Not displayed. NewsView reads `page_settings.news.events`. |
| Foundation Insight | `page_settings.home.insight` | Saved but never rendered on `/` or anywhere public. |

RLS on `news_articles`, `events`, `media_assets`, `page_settings` already allows anon SELECT for published rows, so no schema/policy changes are needed.

## Changes (frontend only)

1. **News — public list & detail from `news_articles`**
   - `NewsView`: fetch from `news_articles` where `status='published'` ordered by `published_at desc`; map to the existing `NewsArticle` shape (`id=slug`, `title`, `summary=excerpt`, `content=body_md`, `image=cover_image`, `date=published_at`, derive `readTime` from word count, default `category='Dispatch'`, `author='MDF Team'`). Keep `page_settings.news.articles` as a fallback only if the table is empty.
   - `/news/$slug` already passes `slug` as `articleId`; switch lookup to match the slug field.

2. **Events — public list from `events`**
   - `NewsView` events tab: fetch from `events` where `status='published'`; split into upcoming/past by `starts_at` vs `now()`; map to `FoundationEvent` (date/time formatted from `starts_at`, `image=cover_image`, `category='Event'`). RSVP wiring stays as-is (`eventExternalId = slug`).

3. **Gallery — public grid from `media_assets`**
   - `GalleryView`: fetch from `media_assets` ordered by `created_at desc`; map to `GalleryImage` (`id`, `url`, `title=alt || 'Field photo'`, `category` derived from first known tag in `mobility|medical|education|livelihood` else `mobility`, `date=created_at`, `description=alt`). Fallback to `page_settings.gallery.images` only when the table is empty so existing manual entries keep working.

4. **Foundation Insight — render on `/`**
   - `HomeView`: read `home.insight` and `home.showInsight` (already saved by `FoundationInsightManager`). When `showInsight && (insight.title || insight.body || insight.brochureUrl || insight.videoUrl)`, render a new "Foundation Insight" section with the cover image, title, body, optional embedded video (reuse `videoEmbed.ts`), and a "Download brochure" link.

5. **Page content** — no code change required; verify each admin-managed page (`home, about, programs, gallery, news, events, get-involved, donate, request, footer, navigation, site, foundation`) is rendered via `usePageSettings` and that the public view degrades gracefully when `published=false` (anon read returns no row → fallback content already in views). Add a `published` check in `usePageSettings` only if we want unpublished drafts to fully hide — current behavior is acceptable since RLS already enforces it.

## Out of scope

- No schema, RLS, or policy changes.
- No new admin features; existing managers are untouched.
- No SEO/OG changes for `/news/$slug` beyond what's already there.
- Pagination / search on news, gallery, events — single-page listings for now.

## Files to edit

- `src/ported/components/views/NewsView.tsx` — fetch news + events from tables.
- `src/ported/components/views/GalleryView.tsx` — fetch media from `media_assets`.
- `src/ported/components/views/HomeView.tsx` — render Foundation Insight section.
- (Possibly) `src/ported/lib/videoEmbed.ts` — reused, no edit expected.

No new files, no migrations.
