# Editable Programs, Footer Resources, and Contact Details

## What will change
- **Our Programs:** Add an editable heading and a clear Show/Hide control for the home page’s “Our Programs” section in Admin Dashboard → Site Content → Home Page. Keep the existing Programs admin screen for editing the program entries themselves. Make the Programs page’s currently hardcoded opening heading and introduction use its existing Site Content fields, with their current wording as the initial fallback.
- **Footer Resources:** In Site Content → Footer & Contact, add a Show/Hide control for the Resources section and editable labels, destinations, and individual visibility controls for its seven existing links. Keep the current links visible by default; do not remove any page when its footer link is hidden.
- **Contact and Headquarters:** Keep the already-editable contact details in Foundation Info (Contact page) and Footer & Contact (footer Headquarters). Add separate Show/Hide controls for the Contact page’s “Reach us directly” details and the footer’s Headquarters section. Hiding contact details will not hide the contact form or the Contact page.

## Technical approach
- Extend the existing `page_settings` content for `home`, `programs`, `footer`, and `foundation`; no new table or migration is needed.
- Make public sections honor explicit off settings while treating unset settings as on, so the live site stays unchanged until an admin chooses to hide something. Show the current text and link destinations in the editor before the first save; preserve saved values and unrelated settings.
- Keep footer destinations safe and functional as edited, including internal site links and valid external HTTPS links. Validate entries, show save errors rather than a false success, and preserve the existing navigation and donation-button controls.
- Check desktop and mobile views, then verify that edits and off/on changes survive reload and affect the intended public sections without hiding their pages or forms.
