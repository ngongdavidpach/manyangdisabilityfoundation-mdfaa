# Trust pages, field reports, sharing and live email test

## 1. Programs page and audit wording
- Replace the saved unproven figures (1,200+ devices, 320+ surgeries, 480+ students, 210+ graduates, 15+ policy briefs) with one figure: "500+ people supported (to November 2026)".
- Confirm no "independently audited" / "audited by CPAs" wording remains anywhere, including saved page content.
- Update the saved footer address from "Melbourne Airport, VIC" to 512 Derrimut Road, Tarneit, Victoria.

## 2. Accountability page (/accountability)
- Incorporated association number A0116724S (Victoria, Consumer Affairs Victoria).
- Committee: Manyang Malet Manyang (CEO), Manyang Maler Manyang (Director).
- Latest dated field report summary (2026), linking to Field Reports.
- Clear note that the foundation is not currently endorsed for tax-deductible gifts.
- Linked from the About page; added to sitemap; own title and description.

## 3. Field Reports page (/field-reports)
- Report 1: Wheelchairs for children with disabilities, Kakuma, 2026.
- Report 2: Surgery for children from Juba and Kakuma, 2026.
- Combined: more than 100 children helped in 2026 (no per-report split shown, since none was given).
- Gallery photos used where available.
- "Download PDF" button producing the reports with the foundation logo.
- Linked from the Programs page; added to sitemap.

## 4. Social links and sharing
- Footer Facebook, Instagram, LinkedIn icons, editable in Admin → Footer & Contact, hidden until an address is entered (none provided yet).
- Share button on the homepage and each News post: the phone share sheet where available, otherwise Facebook, LinkedIn, X, WhatsApp and Copy link.

## 5. Publish and test pledge email
- Check Resend shows the sending domain verified. If not verified, report this and stop before the test.
- Publish the site, submit a test pledge on /donate with machel568@gmail.com, confirm Resend accepted it and the confirmation shows in the email history. Ask you to confirm it arrived in the inbox.
- Remove the test pledge afterwards from Finance → Submissions.

## Technical details
- Data updates to page_settings rows `programs` (impactStats) and `footer` (address, new social fields).
- New routes src/routes/accountability.tsx and src/routes/field-reports.tsx with head(); field report content in a shared module so page and PDF match; PDF built in the browser with pdf-lib.
- ShareButton component using navigator.share with link fallbacks; social URLs validated with the existing safe-link helper.
