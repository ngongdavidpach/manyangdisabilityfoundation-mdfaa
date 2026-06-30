# Compliance, CSR & Portal Hardening

## 1. ACNC Charity Tick (Footer)
- Register the uploaded `ACNC_Registered_Charity_Tick.JPG` via `lovable-assets` from `/mnt/user-uploads/` (avoids committing the binary).
- Replace `public/images/acnc-charity-tick.png` reference in `Footer.tsx` with the CDN asset URL.
- Keep the existing link to `acnc.gov.au/charity/...` and `alt="ACNC Registered Charity"`.

## 2. CSR Prospectus & Tier List PDFs (/csr-sponsorship)
- Regenerate `public/downloads/mdf-csr-prospectus.pdf` and `public/downloads/mdf-sponsorship-tiers.pdf` using a Python `reportlab` script so the content actually matches the on-page tiers (Bronze/Silver/Gold/Platinum), includes ABN 75 986 228 179, contact email, impact metrics, and benefits per tier.
- Prospectus: cover, mission, programme impact, shipment logistics, tier summary, partnership process, contact.
- Tier list: one-page table of the four tiers (range, impact, benefits).
- Verify by rendering each PDF page to PNG and inspecting before finalising.
- No code change needed on `CsrSponsorshipView.tsx`; existing download buttons already point at these paths.

## 3. /portal/coordinators — Secure intake + email confirmation
- Server fn `submitCoordinatorRegistration` already validates with Zod + rate limit. Extend it to:
  - Send a confirmation email to the applicant using the existing app-email send route (`/lovable/email/transactional/send`) with a new template `coordinator-confirmation`.
  - Send an admin notification to `partnerships@manyangdisabilityfoundation.org` via the same route with template `coordinator-admin-notification`.
- Add the two React Email templates under `src/lib/email-templates/` and register them in `registry.ts`.
- Confirm `CoordinatorPortalView` shows clear field-level validation errors (already wired); add a "we've emailed you a confirmation" line on the success screen.

## 4. /portal/fundraisers — Signup + confirmations + admin review
- Reuse pattern from coordinators:
  - Add `fundraiser-confirmation` + `fundraiser-admin-notification` templates.
  - Extend `submitFundraiserRegistration` to enqueue both emails after insert.
- `FundraiserPortalView` already has event-type selection; add a short list of upcoming foundation events from `events` table (public read) so volunteers can optionally pick an existing event to fundraise for, stored in a new `event_id` column on `fundraiser_registrations`.
- Update success screen copy to confirm the email was sent.

### Admin review actions
- `FundraisersManager.tsx` (and `CoordinatorsManager.tsx`) currently support status + delete. Add:
  - Row action **Approve** → sets status `approved` and sends `fundraiser-approved` / `coordinator-approved` email to applicant.
  - Row action **Decline** → sets status `declined` (no email by default; admin can copy/paste).
  - Row action **Email applicant** → opens `mailto:` with prefilled subject.
- Approval emails go through the same app-email route using a new template each.

## Database
Single migration:
- `ALTER TABLE public.fundraiser_registrations ADD COLUMN event_id uuid REFERENCES public.events(id) ON DELETE SET NULL;`
- No new tables, no new policies (existing admin-only RLS still applies; inserts go through server fns with `supabaseAdmin`).

## Technical notes
- All email sends use `idempotencyKey` = `${table}-${row.id}-${templateName}` to make retries safe.
- Email templates follow existing brand styling (white `Body`, blue/amber accents matching `CsrSponsorshipView`).
- PDFs generated with `reportlab` in `/tmp`, then moved into `public/downloads/`. QA images written to `/tmp` only.
- ACNC asset served from Lovable CDN via `*.asset.json` import — no binary added to repo.

## Files touched
- `src/ported/components/Footer.tsx` (ACNC img src)
- `src/assets/acnc-charity-tick.jpg.asset.json` (new pointer)
- `public/downloads/mdf-csr-prospectus.pdf` (regenerated)
- `public/downloads/mdf-sponsorship-tiers.pdf` (regenerated)
- `src/lib/intake.functions.ts` (email sends, approve actions)
- `src/lib/email-templates/coordinator-confirmation.tsx` (new)
- `src/lib/email-templates/coordinator-admin-notification.tsx` (new)
- `src/lib/email-templates/coordinator-approved.tsx` (new)
- `src/lib/email-templates/fundraiser-confirmation.tsx` (new)
- `src/lib/email-templates/fundraiser-admin-notification.tsx` (new)
- `src/lib/email-templates/fundraiser-approved.tsx` (new)
- `src/lib/email-templates/registry.ts` (register 6 templates)
- `src/ported/components/views/CoordinatorPortalView.tsx` (success copy)
- `src/ported/components/views/FundraiserPortalView.tsx` (event select + success copy)
- `src/ported/components/admin/CoordinatorsManager.tsx` (approve/email actions)
- `src/ported/components/admin/FundraisersManager.tsx` (approve/email actions, show event)
- 1 migration adding `event_id` to `fundraiser_registrations`
