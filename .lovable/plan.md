## Goal

Rework `src/ported/components/views/AdminDashboardView.tsx` to use the visual structure from the uploaded `AdminDashboard.jsx` reference, while keeping all existing MDF functionality (tabs, managers, role gate, live Supabase counts).

## Layout changes

```
┌─────────────────────────────────────────────────────┐
│ Sidebar (w-56)  │  Top bar: search + bell + avatar  │
│  - Brand        ├───────────────────────────────────┤
│  - Nav groups   │  4 violet stat cards (grid-4)     │
│  - Sign out     │                                   │
│                 │  Active tab panel in white card   │
│                 │  (Overview → table of latest news)│
├─────────────────┴───────────────────────────────────┤
│ Black footer with violet "ADMIN PANEL" bar          │
└─────────────────────────────────────────────────────┘
```

## Implementation

Edit only `src/ported/components/views/AdminDashboardView.tsx`:

1. **Shell**: outer `min-h-screen bg-white flex flex-col`, inner `flex flex-1` with sidebar + main column (`bg-indigo-50`).
2. **Sidebar (w-56, white, border-r)**: keep existing grouped sections (Overview / People / Finance / Content / System), restyle buttons — active = `bg-violet-100 text-violet-700`, inactive = `text-gray-700 hover:bg-gray-50`, rounded-lg, icon + label. Brand row with MDF logo + "MDF Admin". Sign-out button pinned at bottom.
3. **Top bar**: white, border-b, centered search input with violet rounded-r button, bell icon, avatar circle (`bg-violet-200`) with user initial; keep the existing "Admin" badge next to the avatar.
4. **Stat cards**: 4 violet (`bg-violet-700`) rounded-2xl cards showing live counts (Media, News, Events, Staff) with icon bubble — click still switches tab.
5. **Active panel**: white `rounded-2xl shadow-sm p-6` wrapper. Overview renders a "Recent Articles" style table fed by latest `news_articles` (id/title, views placeholder or published date, comments count if available, Published/Draft badge). All other tabs render their existing manager component inside the same white card.
6. **Footer**: black bar with inner violet pill reading "ADMIN PANEL".
7. **Mobile**: sidebar collapses to a top horizontal scroll nav under `lg:hidden`, main content stacks; keep existing responsive grid for stat cards (`grid-cols-2 md:grid-cols-4`).

## Out of scope

- No changes to managers, RLS, routes, or auth.
- No new dependencies; uses existing lucide-react icons and Tailwind classes.
- Reference's hardcoded GeeksForGeeks branding/sample articles replaced with MDF data.
