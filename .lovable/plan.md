## Goal

1. Make sure only users with the `admin` role can reach `/admin` and its widgets (frontend gate + backend RLS check).
2. Reorganize the admin dashboard's 14 flat tabs into clear, grouped sections so it's easier to navigate.

## 1. Role-based authorization for /admin

The route is already gated client-side (`hasRole(["admin"])` in `src/routes/admin.tsx`) via `AuthContext`, which reads `public.user_roles`. I'll harden it:

- **Frontend gate (already correct, light cleanup)** — keep the three states in `src/routes/admin.tsx`: loading → `StaffLoginView` (unauthenticated) → "Access Restricted" panel (signed in, not admin) → `AdminDashboard`.
- **Backend gate (verify, don't rewrite)** — confirm each admin-only table used by the managers (media_assets, news_articles, events, staff_members, contacts, donations, expenses, page_settings, navigation, foundation info, insight) has RLS policies that require `public.has_role(auth.uid(), 'admin')` for INSERT/UPDATE/DELETE. If any table currently allows writes to plain `authenticated` users, add an admin-only policy in a single migration. Read-only public data (e.g. published news/events) stays readable by `anon`.
- No new tables. No new auth providers. The "first signup becomes admin" trigger stays as-is unless you tell me otherwise.

If the linter finds gaps, the migration will add policies like:
```sql
CREATE POLICY "Admins manage X" ON public.<table>
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
```

## 2. Reorganize the dashboard

Today the sidebar in `AdminDashboardView.tsx` is one flat list of 14 items. I'll group them into labeled sections with small section headers in the sidebar — no behavior change, just structure:

```
Overview
  • Overview

People
  • Contacts
  • Pipeline
  • Staff

Finance
  • Donations
  • Expenses
  • Reports

Content
  • Page Content
  • Media Library
  • News
  • Events
  • Foundation Insight

System
  • Foundation Info
  • Settings (navigation pages + site-wide pointers)
```

Implementation notes:
- Replace the flat `tabs` array with a `sections` array of `{ label, items: Tab[] }`.
- Render each section with a muted uppercase header above its items; keep the existing active-tab styling.
- Keep all existing manager components and the overview widgets unchanged.
- Mobile: sidebar already stacks above main on `lg:` breakpoint — sections render the same way; no new responsive work.

## Out of scope

- No redesign of individual manager screens.
- No new roles beyond `admin` / `member`.
- No changes to `StaffLoginView` or `AuthContext` API.

## Files touched

- `src/routes/admin.tsx` — minor (keep gate, no functional change unless cleanup needed).
- `src/ported/components/views/AdminDashboardView.tsx` — sidebar restructured into sections.
- Possibly one Supabase migration if the linter shows a table missing an admin-only write policy.
