# Plan: Full Admin CMS on Lovable Cloud

A large rebuild. The ported app currently runs entirely off `localStorage` — no real uploads, content, or auth. We will enable Lovable Cloud (database + storage + auth) and rewire the admin + public pages around it.

## 1. Enable Lovable Cloud & Auth

- Enable Cloud (Postgres, Storage, Auth).
- Switch admin auth from localStorage to Cloud email/password auth.
- `profiles` table (id, full_name, avatar_url) auto-created on signup via trigger.
- `user_roles` table + `app_role` enum (`admin`, `editor`, `member`) + `has_role()` security-definer function. Admin gate uses `has_role`, not client flags.
- Migrate `LoginView`, `RegisterView`, `AdminSignupView`, `AuthContext` to use Cloud. Old localStorage users won't carry over — first admin must re-register.
- Reset-password route added.

## 2. 15-minute admin auto-logout

- `useIdleLogout(15 * 60_000)` hook in admin layout: tracks mouse/keyboard/touch, shows "1 min left" toast, calls `supabase.auth.signOut()` + redirect on expiry. Tab-visibility aware.

## 3. Storage + Image optimization

- Public bucket `site-images` for hero/section/gallery/news/events/staff photos.
- Upload pipeline (client-side before upload): resize to max 1920px, convert to WebP via Canvas, target <300 KB. Store original + `?width=` query for hero preloads via Supabase image transform.
- Hero `<img>`: explicit width/height, `fetchpriority="high"`, `loading="eager"`, `decoding="async"`, route-level `<link rel="preload" as="image">`.
- All other images: `loading="lazy"`, `decoding="async"`, responsive `srcSet`.
- Reusable `<UploadImage>` and `<ImageField>` admin components (drag-drop, progress, preview, alt-text required).

## 4. Gallery management

- Tables: `media_assets` (id, storage_path, url, alt, width, height, size, tags[], uploaded_by, created_at), `media_folders` (optional grouping).
- Admin route `/admin/gallery`: grid view, upload, tag, rename alt, delete, copy-URL, "Insert into…" picker.
- Every image field in the admin (hero, section, news, events, staff) opens the gallery picker OR uploads new — same picker reused everywhere.
- Public `/gallery` reads from `media_assets` with `is_public` flag.

## 5. Per-page Settings (site-wide CMS)

- `page_settings` table: `page_key` (home, about, programs, gallery, news, events, get-involved, donate, request, contact, footer), `content jsonb`, `updated_at`, `updated_by`. RLS: public read, admin write.
- Each page has a typed Zod schema for its `content` blob (hero title/subtitle/image, section blocks, CTAs, visibility toggles).
- Admin route `/admin/pages/$pageKey`: form generated from the schema with image fields wired to the gallery picker. Live preview.
- Public pages (`HomeView`, `AboutView`, etc.) refactored to read `page_settings` via TanStack Query loader.

## 6. Home page admin editor with images

- Built on the per-page editor above. Fields: hero image, hero headline/subhead, intro text, mission block image, programs strip (3 cards with image+title+blurb), stats, CTAs.
- "School insight" content block: rich-text intro + uploadable cover image + optional PDF brochure upload → shown on Home and About as a "Get to know us" card.

## 7. News & Events CMS

- Tables `news_articles` (id, slug, title, excerpt, body_md, cover_image, author_id, published_at, status) and `events` (id, title, slug, description, cover_image, starts_at, ends_at, location, status). RLS: public reads published rows; admin writes.
- Admin: `/admin/news` and `/admin/events` — list, create, edit, publish/unpublish, delete. Image upload via gallery picker. Markdown body editor.
- Public `/news`, `/news/$slug`, `/events`, `/events/$slug` — TanStack Query loaders pulling published rows. SEO `head()` per route, og:image from cover.

## 8. Staff profiles

- Table `staff_members` (id, full_name, role_title, bio, photo_url, email, sort_order, is_active).
- Admin `/admin/staff`: CRUD with photo upload.
- Public on About page: staff grid with photo, name, title, bio.

## 9. Social media + Footer

- Stored in `page_settings` under `page_key='footer'`: facebook, twitter, instagram, linkedin, youtube, tiktok (each URL optional + validated).
- Admin `/admin/pages/footer` settings form.
- `Footer.tsx` rewired to render icons (lucide `Facebook`, `Twitter`, `Instagram`, `Linkedin`, `Youtube`, plus inline TikTok SVG) only for URLs that are set. Removes the current placeholder letter chips.

## 10. Wiring & cleanup

- Replace ported localStorage `AuthContext` with Cloud `useAuth`.
- Replace foundationData static text with `page_settings` reads (fallback to defaults).
- Add `/admin` dashboard hub linking gallery, pages, news, events, staff, settings, users.
- Keep existing visual design.

## Technical section

**Tech**: TanStack Start + Cloud (Supabase). All admin server work via `createServerFn` with `requireSupabaseAuth` + `has_role` checks. Image uploads go directly browser→Storage with publishable key (RLS on `storage.objects` restricts writes to authenticated admins).

**Routes added** (file-based): `src/routes/_authenticated/admin.tsx` (layout, idle-logout, role gate), `admin.index.tsx`, `admin.gallery.tsx`, `admin.pages.$pageKey.tsx`, `admin.news.tsx`, `admin.news.$id.tsx`, `admin.events.tsx`, `admin.events.$id.tsx`, `admin.staff.tsx`, `admin.users.tsx`. Public: `news.tsx`, `news.$slug.tsx`, `events.tsx`, `events.$slug.tsx`, `reset-password.tsx`. The integration-managed `_authenticated/route.tsx` handles the session gate.

**Migrations** (one batch): `app_role` enum, `profiles`, `user_roles` + `has_role()`, `page_settings`, `media_assets`, `news_articles`, `events`, `staff_members`. Each public-schema table gets explicit GRANTs and RLS policies. Storage bucket `site-images` created via storage tool with admin-only write policy and public read.

**Image optimization**: client resize/encode helper in `src/lib/image-optimize.ts` using `createImageBitmap` + `OffscreenCanvas.convertToBlob({ type: 'image/webp', quality: 0.82 })`, fallback to regular Canvas.

**Out of scope** (call out): rich WYSIWYG (using markdown), multi-language, draft autosave, audit log, CDN custom domain.

After approval I will execute in this order: Cloud enable → migrations → storage → auth refactor → admin layout + idle logout → gallery → page settings + home editor → footer/social → news → events → staff → public wiring → verification.
