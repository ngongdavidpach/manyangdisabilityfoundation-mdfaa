## Goal

Let admins show/hide and reorder pages in the navbar from the Admin Dashboard's **Settings** tab.

## Where it lives

`AdminDashboardView.tsx` → existing **Settings** tab gets a new "Navigation pages" panel above the current links to Page Content. No new top-level tab.

## Storage

Reuse `page_settings` row with `page_key = 'navigation'`. Extend its content shape:

```
{
  showHome: bool, showAbout: bool, showPrograms: bool, showGallery: bool,
  showNews: bool, showEvents: bool, showGetInvolved: bool, showDonate: bool,
  showRequest: bool,
  order: string[]  // NEW — e.g. ['home','about','programs','gallery','request','news','get-involved']
}
```

No schema migration — `content` is JSON. Defaults filled in code when `order` is missing.

## Admin UI — new `NavigationPagesEditor.tsx` (in `components/admin/`)

Single list of nav items (Home, About Us, Our Impact, Gallery, Request Aid, News & Events, Get Involved). For each row:
- drag handle (reorder) — use existing pattern; native HTML5 drag-and-drop, no new dep
- label (read-only, sourced from navbar definition)
- visibility toggle (checkbox)
- up/down buttons as a keyboard-friendly fallback to drag

Single "Save changes" button → upserts `page_settings` row (`page_key='navigation'`) merging `order` + visibility flags. Loads current values on mount.

Mounted inside the Settings tab in `AdminDashboardView.tsx`, above the existing helper links.

## Public wiring — `Navbar.tsx`

- Move the current hard-coded `navLinks` array into a module-level `NAV_ITEMS` constant (id, label, icon, protected) so it can be filtered/reordered.
- Read `page_settings` for `page_key='navigation'` via the existing `usePageSettings` hook.
- Filter `NAV_ITEMS` by the matching `show*` flag (default true when missing), then sort by `content.order` (items not in `order` keep their original position at the end).
- Apply the same filtering to the mobile menu and footer if the footer also lists pages (verify in `Footer.tsx` and apply if needed).

## Technical notes

- The existing "Navigation toggles" section in `PageSettingsEditor` stays as-is — it already writes the same row, so both editors interoperate. The new editor is the friendlier surface.
- Order persistence: store full id list; on render, dedupe + append any new ids introduced by future code so adding a nav item later doesn't disappear behind missing order entries.
- No new tables, no new RLS — `page_settings` already restricts writes to admins.

## Files

- New: `src/ported/components/admin/NavigationPagesEditor.tsx`
- Edit: `src/ported/components/views/AdminDashboardView.tsx` (mount in Settings tab)
- Edit: `src/ported/components/Navbar.tsx` (read + apply order/visibility)
- Edit: `src/ported/components/Footer.tsx` (apply same filter if it lists pages)
