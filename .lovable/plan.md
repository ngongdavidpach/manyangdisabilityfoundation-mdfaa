## Goal
Extend the existing Staff Accounts page so admins can view each user's current role and assign or change it between **Admin**, **Staff**, or **None** — not just the current admin on/off toggle.

## Current state (verified)
- `StaffAccountsManager.tsx` lists accounts with roles and offers only a "Make admin / Remove admin" button.
- `setUserAdmin` in `src/lib/staffAccounts.functions.ts` inserts/deletes the `admin` row in `user_roles` but has no concept of `staff`.
- `inviteStaffAccount` has a `makeAdmin` boolean; no staff option.
- The `staff` role already exists in the `app_role` enum and is honoured by `requireStaffOrAdmin`.

## Changes

### Server — `src/lib/staffAccounts.functions.ts`
- Replace `setUserAdmin` with `setUserRole({ userId, role: 'admin' | 'staff' | 'none' })`:
  - Delete any existing `admin`/`staff` rows for that user.
  - Insert the new role row unless `none`.
  - Preserve the "cannot remove the last admin" guard: if the change would drop the final admin, throw.
  - Keep `requireAdmin` middleware.
- Update `inviteStaffAccount` to take `role: 'admin' | 'staff' | 'none'` instead of `makeAdmin`, and grant that role on invite.
- Keep `listStaffAccounts` as-is (it already returns the `roles[]` array).

### UI — `src/ported/components/admin/StaffAccountsManager.tsx`
- Show the current role as a badge (Admin / Staff / Member).
- Replace the single toggle button with a small role selector per row (segmented control or dropdown) with three options: Admin, Staff, None. Changing it calls `setUserRole`. Confirm before demoting yourself out of admin.
- In the invite form, replace the "Grant admin role on signup" checkbox with a role selector (Admin / Staff / None, default None).
- Keep the existing loading, error, and success states.

### Access
Page is already reachable at Admin Dashboard → **Team → Staff Accounts** (admin-only section). No routing changes needed.

## Files changed
- `src/lib/staffAccounts.functions.ts`
- `src/ported/components/admin/StaffAccountsManager.tsx`

## Verification
1. As admin, open Team → Staff Accounts: each row shows current role and a selector.
2. Change a user Staff → Admin → None; list refreshes and role badge updates.
3. Attempt to demote the sole admin: request is rejected with the existing "Cannot remove the last admin" error.
4. Invite a new user with role = Staff: after accepting, they can sign in and see the staff-limited dashboard.
