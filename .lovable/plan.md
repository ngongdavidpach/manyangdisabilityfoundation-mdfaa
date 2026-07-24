## Goal
Introduce a `staff` role alongside `admin` and gate admin dashboard sections so only admins can see Contacts/Pipeline, Team, System, and Activity (Access Log). Staff can see all other tabs. Enforcement happens both in the UI and on the server.

## Roles model

Add `staff` to the existing `app_role` enum (currently `admin | editor | member`). `admin` retains full access; `staff` gets everything except restricted areas.

Restricted (admin-only):
- **Contacts** section (both `Contacts` and `Pipeline` sub-tabs)
- **Team** section (both `Staff` and `Staff Accounts` sub-tabs)
- **System** section (`Settings` and `Access Log` sub-tabs)
- **Activity** — the Access Log viewer (already lives under System > Access Log)

Staff-accessible: Overview, Programs, Donations, Expenses, Reports, Site Content, Gallery, News, Events, Insight.

## Server enforcement

1. **New middleware** `requireStaffOrAdmin` in `src/integrations/supabase/admin-middleware.ts` — mirrors `requireAdmin` but accepts either role via `has_role`. Denials logged to `admin_access_log` the same way.
2. **New server fn** `verifyDashboardAccess` in `src/lib/adminAccess.functions.ts` returning `{ role: 'admin' | 'staff' | null }`. Used by the client to decide which tabs to render.
3. **Retag existing admin server fns** by area:
   - Keep `requireAdmin` on: staff account management, access log reads, contacts CRUD, pipeline updates, system/settings writes.
   - Switch to `requireStaffOrAdmin` on: donations reads/writes, expenses, reports, gallery/media, news, events, insight, page/foundation content, programs (coordinators/fundraisers).
4. `admin_access_log` continues to record forbidden attempts (existing behaviour, no schema change).

## Client enforcement

`src/routes/admin.tsx`:
- Replace `verifyIsAdmin` call with `verifyDashboardAccess`. Allow render when role is `admin` or `staff`. Otherwise show existing `AccessRestricted` panel.

`src/ported/components/views/AdminDashboardView.tsx`:
- Read role from the same query and pass it down (or via a small context).
- Filter the `sections` array so the `People > Contacts`, `People > Team`, and `System` items only appear when role is `admin`.
- In `renderTab()`, if the current `tab` is restricted and role is `staff`, redirect (`setTab('overview')`).
- Guard the initial `useState<Tab>('overview')` deep-link case: on mount, if a persisted/queried tab is restricted for staff, fall back to `overview`.
- Sub-tab guard inside System/Team/Contacts is unnecessary since the whole section is hidden, but keep a defensive `if (role !== 'admin') return null` inside those section renderers.

## Migration

```sql
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'staff';
```

No table or policy changes required — `has_role(_user_id, 'staff')` works with the existing security-definer function and `user_roles` table.

## Assigning the role

`StaffAccountsManager` already lets admins pick a role from the enum. After the migration, `staff` becomes selectable there — no UI change needed beyond the enum regeneration.

## Files changed

- `supabase` migration (enum value)
- `src/integrations/supabase/admin-middleware.ts` (add `requireStaffOrAdmin`)
- `src/lib/adminAccess.functions.ts` (add `verifyDashboardAccess`)
- `src/lib/donations.functions.ts`, `src/lib/receipts.functions.ts`, `src/lib/intake.functions.ts` (retag where they cover staff-allowed areas; keep admin-only handlers as-is)
- `src/routes/admin.tsx` (use new gate)
- `src/ported/components/views/AdminDashboardView.tsx` (role-aware sidebar + tab guard)

## Verification

1. Sign in as an admin — all sections visible; Access Log loads.
2. Grant a test user `staff` via Staff Accounts; sign in as them — Contacts, Team, System hidden; deep-linking `?tab=system` falls back to Overview; server calls to admin-only fns return 403 and are logged in `admin_access_log`.
3. Sign in as neither — existing "Access Restricted" panel shows.