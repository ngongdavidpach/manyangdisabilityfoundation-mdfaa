# Horizontal menu on desktop, hamburger on mobile

## Goal
The navbar already switches from hamburger to a horizontal page menu at desktop widths (1024px+). The gap is the tablet range (768–1023px), which still shows the hamburger. We will move the switch point down so every screen 768px and wider shows the horizontal menu, and only phones (below 768px) show the hamburger.

## Current state (verified in live preview)
- 1280px wide: horizontal menu shows, no hamburger — already correct.
- 820px wide (tablet): hamburger shows — to be fixed.
- 360px wide (phone): hamburger shows — correct, unchanged.

## Changes — `src/ported/components/Navbar.tsx` only
1. Desktop page links row: change `hidden lg:flex` to `hidden md:flex`.
2. Hamburger buttons (desktop-right and mobile rows): change `lg:hidden` to `md:hidden` so the button disappears at 768px and wider.

No other files, no logic changes. Admin-editable nav order/flags and the Donate button behavior are untouched.

## Verification
- Playwright at 1280px, 820px, and 360px: horizontal menu visible at 1280 and 820; hamburger only at 360.
- Open the hamburger menu at 360px to confirm the mobile menu still works.
- Check `build-errors.log` for a clean build.
