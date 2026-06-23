## Goal

Add an admin-only screen to manage **staff login accounts** (the people who can sign in to `/admin`) and grant or revoke the `admin` role. This is distinct from the existing **Staff** tab, which manages the public About-page roster (`staff_members` table) and is unchanged.

## What the new screen does

In the admin dashboard, add a new tab **"Staff Accounts"** under the **People** group with three capabilities:

1. **List accounts** — show every auth user with: full name (from `profiles`), email, current role (`admin` / `member`), created date, last sign-in.
2. **Toggle admin** — switch the `admin` role on/off per user (writes to `public.user_roles`). Self-demotion is blocked client-side with a confirmation, and the server prevents removing the last admin.
3. **Invite a new staff account** — form with email + full name + "Make admin" checkbox. Uses Supabase Auth Admin `inviteUserByEmail`, then optionally inserts the admin role.

No schema changes — `user_roles`, `profiles`, and `app_role` enum already exist with the right policies.

## Server functions (admin-gated)

All new functions live in `src/lib/staffAccounts.functions.ts`, use `requireSupabaseAuth`, and verify `has_role(userId, 'admin')` before doing anything. The service-role client (`supabaseAdmin`) is loaded inside each handler via `await import(...)` so it never leaks into the client bundle.

- `listStaffAccounts()` → uses `supabaseAdmin.auth.admin.listUsers()`, then joins with `profiles.full_name` and `user_roles.role`. Returns `{ id, email, fullName, roles: string[], createdAt, lastSignInAt }[]`.
- `setUserAdmin({ userId, isAdmin })` → inserts or deletes the `(user_id, 'admin')` row in `user_roles`. Refuses if it would remove the final admin.
- `inviteStaffAccount({ email, fullName, makeAdmin })` → `supabaseAdmin.auth.admin.inviteUserByEmail(email, { data: { full_name } })`, then optionally inserts admin role for the new user id.

Every function: verify caller is admin first; on failure throw with a clean message (no raw provider errors).

## UI

New file `src/ported/components/admin/StaffAccountsManager.tsx`:
- Table of accounts: name, email, role badge, last sign-in, an admin toggle, and a "Remove admin" / "Make admin" action.
- "Invite staff" button opens a small inline form (email, full name, "Make admin" checkbox).
- Toast/inline feedback for success and errors.
- Disables the toggle on the currently-signed-in user's row when they are the only admin.

Wire-up in `src/ported/components/views/AdminDashboardView.tsx`:
- Add `"staff-accounts"` to the `Tab` union.
- Add an entry under the **People** section (label: "Staff Accounts", icon: `ShieldCheck`).
- Render `<StaffAccountsManager />` when active.

## Out of scope

- No changes to the existing `Staff` tab (`staff_members`).
- No new roles beyond `admin` / `member`.
- No password reset / account deletion in this pass (can add later).
- No bulk import.

## Files touched

- New `src/lib/staffAccounts.functions.ts`
- New `src/ported/components/admin/StaffAccountsManager.tsx`
- Edit `src/ported/components/views/AdminDashboardView.tsx` (one new tab in the People group)
