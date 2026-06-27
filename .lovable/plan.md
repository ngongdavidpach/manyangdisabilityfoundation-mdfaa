## Scope

Four changes across navigation, content syndication, SEO, and a new archive page.

### 1. Remove "Sign Out" from dropdown menu
- In `src/ported/components/Navbar.tsx`, remove the "Sign Out" button from the desktop user dropdown and the mobile menu. Keep the `logout()` logic available elsewhere (Dashboard) so users can still sign out — only the navbar entry is removed.

### 2. RSS feeds
Create two new TanStack server routes that return XML:
- `src/routes/rss[.]xml.ts` → News & Events feed. Pulls latest 20 `news_articles` (published) + upcoming `events` from Supabase using a publishable-key server client, outputs RSS 2.0 with `<channel>` metadata, `<item>` entries (title, link, description, pubDate, guid).
- `src/routes/programs.rss[.]xml.ts` → Programs updates feed. Pulls from `page_settings` (page_key='programs') content list and any programs-related news.
- Add `<link rel="alternate" type="application/rss+xml">` tags in `__root.tsx` head (or per-route) so feed readers auto-discover.
- Add the feed URLs to `sitemap[.]xml.ts`.

### 3. Schema.org structured data
- **Organization**: already present on `/about`. Promote to site-wide by adding it to `__root.tsx` head scripts (with logo, sameAs social links from `useFoundationInfo`). Remove duplicate from `/about`.
- **NewsArticle**: already present on `/news/$slug.tsx` — verify completeness (headline, datePublished, author, image, publisher). Add missing fields if any.
- **Event**: add `Event` JSON-LD to `NewsView.tsx` (events section) and to any event detail rendering. Loop over events in the route loader and emit one `Event` per upcoming event with `name`, `startDate`, `location`, `description`, `eventStatus`, `eventAttendanceMode`.

### 4. News & Field Reports archive page
- New route `src/routes/news.archive.tsx` at `/news/archive`.
- Server loader fetches all published `news_articles` with `category`, `published_at`, paginated via search params (`?page=1&category=field-report`).
- Use TanStack search params with Zod validation (`page`, `category`).
- UI: filter chips (All + distinct categories from DB), paginated list (10 per page) using the existing `Pagination` component, article cards linking to `/news/$slug`.
- Add a prominent "View archive" link on `NewsView.tsx`.
- Add `/news/archive` to sitemap and to RSS channel `<link>`.

### Technical notes
- RSS routes use `createFileRoute` with `server.handlers.GET`, return `new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } })`. Read DB via a server publishable client (`SUPABASE_URL` + `SUPABASE_PUBLISHABLE_KEY`) — narrow `TO anon` SELECT policies already exist on `news_articles` and `events` for published rows.
- Escape XML entities in titles/descriptions.
- Archive page uses `validateSearch` with `fallback()` from `@tanstack/zod-adapter`, fetches via TanStack Query `useSuspenseQuery` with `loaderDeps` on `{ page, category }`.
- No DB migrations needed.

### Out of scope
- Email/push notifications for new content (RSS only).
- Per-category RSS feeds (single combined news feed + single programs feed).
