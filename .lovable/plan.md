# Public Staff Page

## Goal
Create a public **Staff** page headed:

> Meet the people behind the success of Manyang Disability Foundation

The page will use the staff details already managed in the admin dashboard, so future changes appear automatically.

## What will change

1. **Create the public Staff page**
   - Add `/staff` with the requested heading.
   - Show each active staff member's photo, full name, role/title, and biography.
   - Use a polished responsive card grid and a professional placeholder when no photo has been uploaded.
   - Hide inactive staff members and respect the existing admin sort order.
   - Show a clear empty state if no active staff are available.

2. **Use the existing staff manager**
   - Read from the existing public-safe staff listing rather than creating duplicate content.
   - Keep staff email addresses private; the public page will only show safe profile details.
   - Continue managing staff through **Admin Dashboard → Team → Staff**.

3. **Add navigation and discoverability**
   - Add **Staff** to the site's page menu and its mobile hamburger menu.
   - Make its visibility and position configurable through the existing navigation editor.
   - Add the page to the sitemap.

4. **Add page metadata**
   - Give `/staff` its own title, description, canonical URL, social title/description, social preview image fallback, and organization/team structured data.

5. **Verify the result**
   - Check the page on desktop, tablet, and mobile.
   - Confirm both current active staff members appear in the saved order.
   - Confirm the desktop menu still fits and the mobile hamburger menu reaches the page.
   - Confirm inactive staff and email addresses are not exposed.

## Current content to display
The database currently contains two active staff profiles:
- Manyang Malat Manyang — CEO
- Manyang Maler Manyang — Director

Neither profile currently has a photo, so the page will show placeholders until photos are added in the admin dashboard.

## Technical details
- Add a public read function for the existing `staff_members_public` view, selecting only name, role, bio, photo, and sort order.
- Add a TanStack route and a focused Staff view component.
- Extend the shared navigation definitions and route mapping rather than creating a separate menu system.
- No database schema change is required.
