## Footer compliance additions

**ABN line**
- Add a new line in `Footer.tsx` (above or beside the copyright): "ABN 75 986 228 179" as a link to `https://abr.business.gov.au/ABN/View?id=75986228179` (opens in new tab, `rel="noopener noreferrer"`).
- Format the ABN with standard spacing (XX XXX XXX XXX).

**ACNC Charity Tick**
- Add the official ACNC Registered Charity Tick image to the footer, linked to the charity's ACNC public profile.
- Place in the "Headquarters" column or as a dedicated "Compliance" mini-block beside the logo.
- Source the official tick from ACNC (`https://www.acnc.gov.au/.../charity-tick`). I'll save it to `public/images/acnc-charity-tick.png` and reference statically.

## CSR sponsorship downloads

New route `/csr-sponsorship` (linked from Footer "Resources" and from `DonateView`) containing:
- Overview of the CSR partnership program.
- **Downloadable prospectus** (PDF) — button linking to `/downloads/mdf-csr-prospectus.pdf`.
- **Sponsorship tier list** (PDF) — button linking to `/downloads/mdf-sponsorship-tiers.pdf`.
- Inline tier table (Bronze / Silver / Gold / Platinum) summarising contribution levels and benefits for equipment-shipment sponsorships, so the page is useful even before clicking the PDF.
- "Contact partnerships" CTA wired to the existing `submitPartnerInquiry` server function.

PDF generation: I'll generate both PDFs from structured content (using the docx/pdf skill or a simple HTML→PDF) and commit them to `public/downloads/`. Content will be branded with foundation info from `useFoundationInfo`.

## Separate registration portals

Two new public intake routes, each with its own form, Zod schema, rate limit, and server function — kept distinct from the existing `/request` (individual aid) and `/get-involved` (general volunteer) flows.

**1. `/portal/coordinators` — East Africa local coordinators**
- Fields: full name, email, phone, country (restricted to East Africa: Kenya, Uganda, Tanzania, Rwanda, Burundi, South Sudan, Ethiopia, Somalia, DRC), region/city, organisation (optional), role/title, years of community work, languages spoken, types of aid requested (multi-select: wheelchairs, prosthetics, mobility aids, rehab supplies, other), estimated beneficiaries, notes.
- New table `coordinator_registrations` with admin-only read, server-function-only insert (matches existing intake pattern in `intake.functions.ts`).
- New `submitCoordinatorRegistration` server function (validation + rate limit + `supabaseAdmin` insert).
- Admin manager (`CoordinatorsManager.tsx`) added to Admin Dashboard sidebar under "People".

**2. `/portal/fundraisers` — Australian volunteer fundraisers**
- Fields: full name, email, phone, state (NSW/VIC/QLD/WA/SA/TAS/ACT/NT), city/suburb, postcode, event type (run/walk, gala, workplace giving, school drive, other), proposed event date, expected participants, fundraising goal (AUD), prior experience, message.
- New table `fundraiser_registrations` with same RLS pattern.
- New `submitFundraiserRegistration` server function.
- Admin manager (`FundraisersManager.tsx`) added to Admin Dashboard.

Both portals are linked from the Footer "Get Involved" section and from `GetInvolvedView`. They are public (no login required); security is enforced via server-side validation, rate limiting, and admin-only read policies — matching the existing intake architecture noted in @security-memory.

## Technical summary

- Files added: `src/routes/csr-sponsorship.tsx`, `src/routes/portal.coordinators.tsx`, `src/routes/portal.fundraisers.tsx`, `src/ported/components/views/CsrSponsorshipView.tsx`, `src/ported/components/views/CoordinatorPortalView.tsx`, `src/ported/components/views/FundraiserPortalView.tsx`, `src/ported/components/admin/CoordinatorsManager.tsx`, `src/ported/components/admin/FundraisersManager.tsx`, `public/images/acnc-charity-tick.png`, `public/downloads/mdf-csr-prospectus.pdf`, `public/downloads/mdf-sponsorship-tiers.pdf`.
- Files modified: `src/ported/components/Footer.tsx` (ABN link, ACNC tick, new resource links), `src/lib/intake.functions.ts` (two new server functions), `src/ported/components/views/AdminDashboardView.tsx` (two new manager tabs), `src/ported/components/views/DonateView.tsx` and `GetInvolvedView.tsx` (cross-links), `src/routes/sitemap[.]xml.ts` (new public routes).
- Migration: create `coordinator_registrations` and `fundraiser_registrations` with GRANTs to `service_role` only, RLS enabled, admin-only SELECT policy via `has_role(auth.uid(), 'admin')`. No anon/authenticated grants — writes go through server functions using `supabaseAdmin`.

## Questions before I build

1. **ACNC registration**: Is the foundation already registered with the ACNC? If yes, please share the charity ABN/ACN profile URL so the tick links correctly. If not yet registered, I'll add the tick image as a placeholder linking to a generic ACNC info page — say the word and I'll wire it up that way.
2. **PDF content**: Should I draft the prospectus and tier-list PDFs from scratch (using existing site copy + standard CSR tiers like Bronze $5k / Silver $15k / Gold $50k / Platinum $150k+), or do you have draft text/figures you want included?
