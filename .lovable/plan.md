Remove the two items from the top micro-bar in `src/ported/components/Navbar.tsx`:

1. Delete the "Emergency Aid Line:" `<span>` (lines 100-103), keeping the email span.
2. Delete the "Request Aid" `<button>` (lines 111-116), leaving only the "Non-Profit 501(c)(3) Equivalent" badge in the right group.

No other files change. The main-nav "Request Aid" link (from `navItems.ts`) remains untouched.