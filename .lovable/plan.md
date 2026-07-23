## Part 1 — Admin dashboard: recommended consolidations

Today the sidebar has 18 tabs across 5 sections. Several are thin wrappers or naturally belong together. Recommended merges:

### People (6 → 3)
- **Contacts + Pipeline** → single "Contacts" tab with a Pipeline sub-view (tab switch inside the panel). Pipeline is a filtered view of the same underlying leads.
- **Coordinators + Fundraisers** → single "Programs" tab with two sub-tabs (EA Coordinators / AU Fundraisers). They share the same shape: application list, approve/reject, notes.
- **Staff + Staff Accounts** → single "Team" tab with sub-tabs "Public staff" (bios shown on the site) and "Accounts & roles" (auth users + admin role management). They are two views of the same people.

### Finance (3 → keep 3, but nest)
- Keep Donations, Expenses, Reports as-is. Reports already summarises the other two; no merge needed.

### Content (5 → 4)
- **Page Content + Foundation Info** → merge under "Site Content" with sub-tabs. Both edit CMS-style records; Foundation Info is effectively one more page setting group.
- Keep Media Library, News, Events, Foundation Insight separate — they manage distinct entities.

### System (3 → 2)
- **Settings + Access Log** → merge into "System" tab with sub-tabs "Navigation & site", "Security / access log". Settings today is only NavigationPagesEditor plus two pointers back to Page Content, so it's very thin.

### Result
Sidebar shrinks from 18 items to **12**:
Overview · Contacts · Programs · Team · Donations · Expenses · Reports · Site Content · Media · News · Events · Foundation Insight · System

Implementation approach: keep every existing manager component intact; only change `AdminDashboardView.tsx` — the `Tab` union, the `sections` array, and the `renderTab()` switch — plus add a small in-panel sub-tab bar for the merged tabs. No changes to underlying data or permissions.

## Part 2 — Remove the sign-in-gated email preferences page

Currently `/dashboard/email-preferences` requires an authenticated session (ProtectedRoute) and duplicates what the token link in every email already provides at `/email/preferences`.

Changes:
1. Delete `src/routes/dashboard.email-preferences.tsx` (the auth-gated route).
2. Remove the footer link in `src/ported/components/Footer.tsx` (line 386) pointing to `/dashboard/email-preferences`.
3. Update `src/routes/privacy.emails.tsx` (line 149) link to point to `/email/preferences` instead.
4. Update `src/lib/email-templates/email-preferences-updated.tsx` default `manageUrl` and the `manageUrl` passed in `src/routes/api/public/email-preferences.ts` to point to the token-based `…/email/preferences` link (the platform-injected unsubscribe token is what the user should click).
5. Simplify `src/ported/components/EmailPreferencesPanel.tsx`: drop the `mode="auth"` branch (bearer-token JWT path) since only token-mode is used now. Also drop the auth branch in `src/routes/api/public/email-preferences.ts` so the endpoint only accepts a valid unsubscribe token — the JWT path is no longer callable.

Users manage preferences exclusively via the tokenised link included in every transactional email; there is no in-app page behind sign-in. Auth-required security emails still send regardless.

## Notes / open question
For Part 1, if you'd rather keep the current 18-tab layout and only relabel some sections, say so and I'll skip the consolidation. Otherwise I'll implement both parts together.
