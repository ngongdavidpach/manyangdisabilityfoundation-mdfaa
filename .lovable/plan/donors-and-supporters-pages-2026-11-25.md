# Donors and Supporters pages

No names or amounts are invented. Donors appear only after staff approve them, and supporters only after staff add them in the admin area.

## 1. Approving pledges for the public list
- In Admin → Finance → Submissions, every pledge gets a "Show publicly" switch, which is off by default.
- Anonymous pledges show as "Anonymous donor" even when approved.
- Only the name, amount (AUD) and date are ever shown. Email, phone, country and message are never shown.
- The staff-only receipt PDF (the "Pledge page") already shows the donor's name and amount. It stays as it is.

## 2. Donors page (/donors)
- A list of approved pledges with name, amount and date, plus a total.
- When none are approved yet, it says "Donor recognition coming soon".
- A "Download PDF" button creates a Donors list PDF with the logo and registration number A0116724S.
- It is linked from the homepage, added to the sitemap, and gets its own title and description.

## 3. Supporters page (/supporters)
- A new "Supporters" section in Admin → Site Content where staff add a name and how each person helped (for example "Volunteer driver, Kakuma 2026"), with a show/hide switch per entry.
- The page lists the visible entries and has a PDF download. When there are no entries, it says "Supporters coming soon".
- It is linked from the homepage, added to the sitemap, and gets its own title and description.

## 4. Publish
- After the checks pass, I publish and confirm both pages and PDFs work on the live site.

## Technical details
- Migration: add `show_publicly boolean not null default false` to `donation_intents`. Add a security-barrier view `donors_public` that exposes only the reference-free display name (or "Anonymous donor" when `is_anonymous`), `amount_cents`, `currency` and `created_at`, where `show_publicly`. Grant anon/authenticated SELECT on the view through a narrow column grant and policy, following the existing `staff_members_public` pattern.
- Supporters are stored in the `page_settings` row `supporters` (`content.items[]` with name, contribution and visible). They are edited through PageSettingsEditor.
- The server functions are `listPublicDonors` and `getPublicSupporters`. The PDFs are built in the browser with pdf-lib, reusing the `fieldReportsPdf` helpers.
- The SubmissionsManager toggle is staff/admin-gated through existing RLS.
