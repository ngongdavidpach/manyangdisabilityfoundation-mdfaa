
## Goal

Make the public News/Events sections and the Programs page show real content, then redeploy.

## What's broken now

- **News** — One article ("Fundraising for surgery") exists but is `draft`, so `/news` and the homepage "Recent News & Field Reports" section show nothing.
- **Events** — The `events` table is empty, so the "News & Foundation Events" tab is empty.
- **Programs** — The `programs` page_settings row only has a heading/intro. There are no `programs[]`, `successStories[]`, or `crossCutting` entries, so `/programs` renders a header followed by an empty grid.

## Changes

### 1. Publish the existing news article (DB migration)
- Update `news_articles` row "Fundraising for surgery": `status='published'`, `published_at=now()`, and fix the slug from `"fundraise with us"` to `"fundraising-for-surgery"` (URL-safe).
- Tidy excerpt/body if currently empty so the card has something to show. Keep the existing cover image.

### 2. Seed three real events (DB migration)
Insert three `events` rows with `status='published'`:
- **Mobility Aid Distribution Day** — upcoming, Juba, South Sudan.
- **Community Health Screening Camp** — upcoming, Kakuma, Kenya.
- **Inclusive Education Roundtable** — past, Kampala, Uganda.

Each gets a slug, description, location, starts_at/ends_at, and (where available) a cover_image URL from the existing `site-images` bucket placeholders.

### 3. Fill out the Programs page (DB migration)
Update `page_settings` where `page_key='programs'` to extend `content` with:
- **`programs`** (5 entries matching the existing category enum):
  - Mobility & Assistive Devices (`mobility`, icon `Wheelchair`)
  - Healthcare Access & Surgeries (`healthcare`, icon `HeartPulse`)
  - Inclusive Education & Scholarships (`education`, icon `GraduationCap`)
  - Livelihood & Vocational Training (`livelihood`, icon `Briefcase`)
  - Disability Rights & Advocacy (`advocacy`, icon `Scale`)
  Each program gets title, shortDescription, fullDescription, impactStats, and image (reuse foundation-themed placeholders already in the bucket / Unsplash CDN).
- **`successStories`** (3 entries): one mobility, one healthcare, one education beneficiary, each with name, age, location, story, quote, image, aidType, date.
- **`crossCutting`**: title "Cross-Cutting Initiatives", subtitle, body about gender inclusion + climate resilience, 4 highlights, ctaText "Partner with us", ctaLink "/get-involved".

No schema changes — only a JSON patch on the existing row.

### 4. Republish the site
After the three migrations land, call `preview_ui--publish` so the live URL serves the new content. Existing SEO/OG metadata on `/news`, `/programs`, and `/events` is already in place from prior work, so no head() edits are needed.

## Out of scope

- No code changes to `ProgramsView`, `NewsView`, or `HomeView` — they already read from the right sources; only the data is missing.
- No new tables, RLS, or auth changes.
- No new images uploaded; we reuse existing placeholder URLs and Unsplash photos.
