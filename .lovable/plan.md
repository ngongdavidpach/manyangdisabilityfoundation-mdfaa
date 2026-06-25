# Plan: Donation FAQ, Mobility Aid Grants guide, internal linking, publish & rescan

## 1. New route: `/guides/mobility-aid-grants`
Create `src/routes/guides.mobility-aid-grants.tsx` modeled on the existing guide routes.
- Full `head()` with title, description, og:*, twitter:*, canonical, and Article + FAQPage JSON-LD.
- Content sections: Intro, What counts as a mobility aid grant, Who is eligible, How to apply (step-by-step), Required documents, Timeline, FAQs (8–10 Q&As), CTA to `/request` and `/donate`.
- Internal links to `/guides/free-medical-equipment`, `/guides/donate-supplies`, `/faq/donations`, `/programs`, `/request`, `/donate`.

## 2. New route: `/faq/donations` (Donation FAQ)
Create `src/routes/faq.donations.tsx`.
- Full `head()` with title/description/og/twitter/canonical and FAQPage JSON-LD.
- Accordion-style Q&A covering: tax deductibility, what items are accepted, monetary vs in-kind, recurring donations, refund policy, anonymity, receipts, international donations, where the money goes, how to volunteer instead.
- Internal links back to `/donate`, `/guides/donate-supplies`, `/guides/mobility-aid-grants`, `/programs`, `/about`.

## 3. Internal linking updates
- **`src/ported/components/views/DonateView.tsx`** — add a "Learn more" / "Related resources" section linking to the three guides and the new FAQ.
- **`src/routes/guides.donate-supplies.tsx`** and **`src/routes/guides.free-medical-equipment.tsx`** — add cross-links to the new mobility aid guide and donation FAQ.
- **`src/ported/components/Footer.tsx`** — add a "Resources" column linking to all guides + FAQ (verify Footer exists; add if applicable).

## 4. Sitemap
Update `src/routes/sitemap[.]xml.ts` to add `/guides/mobility-aid-grants` and `/faq/donations`.

## 5. Publish
After edits land, call `preview_ui--publish` (website info already relevant from prior turns) to deploy frontend changes.

## 6. Re-run scans
- Trigger Lighthouse + Semrush via `seo_chat--trigger_scan` (single SEO review covers both) and direct user to the SEO panel for results.
- Mark the Semrush "Add a guide on mobility aid grants" finding as fixed after the guide is live.

## Technical notes
- Guides use plain Tailwind sections with semantic `<h1>`/`<h2>`/`<h3>` and a single H1 per page.
- FAQPage JSON-LD must mirror the visible Q&A text exactly.
- Nav (`navItems.ts`) is admin-flag-driven, so guides/FAQ stay out of the top nav — surfaced via Footer + in-page links instead. Confirm if you'd prefer a top-nav "Resources" dropdown instead.
