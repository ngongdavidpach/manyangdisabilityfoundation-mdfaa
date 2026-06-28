## Goal
Make the Overview "Recent Articles" table fully functional: real data with correct status, per-row actions (View / Edit / Publish-Unpublish), and server-backed search + pagination.

## Changes (single file: `src/ported/components/views/AdminDashboardView.tsx`)

### 1. Data fetching
- Select `id, title, slug, status, published_at` from `news_articles`.
- Treat an article as **Published** when `status = 'published'` (and `published_at <= now()`), otherwise **Draft**. Render `published_at` date when present, else "—".
- Replace the single `useEffect` fetch with a query that takes `search`, `page`, and `pageSize` (default 7) and refetches when they change.
- Use server-side filtering via `.ilike('title', %q%)` and `.range(from, to)` with `{ count: 'exact' }` to get total rows for pagination.
- Order by `coalesce(published_at, created_at) desc` (using `.order('published_at', { ascending: false, nullsFirst: false })` then secondary `created_at`).

### 2. Search wiring
- Reuse the existing top-bar search input. Debounce 300ms; reset to page 1 on new query.
- Search only filters the Recent Articles table while on the Overview tab (other tabs unaffected). Add a subtle hint under the input on Overview: "Searching news articles".

### 3. Per-row actions
Add an "Actions" column with three icon buttons:
- **View** → opens `/news/{slug}` in a new tab (disabled if no slug).
- **Edit** → switches to the News tab and passes the article id so `NewsManager` opens it. Implementation: lift `tab` + a new `focusArticleId` state; pass `focusArticleId` as a prop to `NewsManager` (small additive prop; NewsManager will auto-select that row if provided, otherwise behave as today).
- **Publish / Unpublish** → toggles `status` between `published` and `draft`; sets `published_at = now()` when publishing, leaves prior value when unpublishing. Optimistic UI update + refetch on completion. Errors show a toast/inline message.

### 4. Pagination
- Footer row below table: "Showing X–Y of N" on the left; Prev / page indicator / Next on the right.
- Disable Prev on page 1, Next when `to >= total - 1`.
- Keep page size at 7 to match current layout.

### 5. Status badge
- Green "Published" when `status === 'published'`.
- Gray "Draft" otherwise.
- Stop using `published_at` alone as the status signal.

## Out of scope
- No schema migrations (status + published_at already exist).
- No changes to NewsManager beyond accepting an optional `focusArticleId` prop used to scroll/select the matching row.
- No changes to other tabs or auth.

## Technical notes
- All queries continue to use the RLS-authenticated `supabase` browser client; admin RLS already permits read/update on `news_articles`.
- Update uses `.update({ status, published_at }).eq('id', id)`.
- Keep counts query (media/news/events/staff) as-is.