# Official receipts for donor pledges

## What staff get
In Admin Dashboard → Finance → Submissions, every donation pledge row gets a **Receipt** button that opens a new receipt page for that pledge:
- Branded layout: the foundation logo, name, ABN 75 986 228 179, address, email and phone (taken from the saved Footer & Contact details).
- Receipt number, issue date, pledge reference, donor name (or "Anonymous"), email, country, amount and currency, payment method (bank transfer / PayID), pledge date and any donor message.
- A status stamp: **Received** once the pledge has been marked received, otherwise **Pledged – payment pending** so an unpaid pledge is never mistaken for a paid receipt.
- **Download PDF** button (official file with the logo) and **Print** button.
- A footer line thanking the donor. No tax-deductibility claim is printed unless you confirm the foundation holds that status.

The receipt number is assigned the first time a receipt is created for a received pledge and stays the same on every later download. Only signed-in staff or admins can open these pages.

## Technical details
- New route `src/routes/admin.receipts.$reference.tsx` (staff/admin only, data loaded from the component via `useServerFn`, `noindex`).
- New `getPledgeReceipt` and `downloadPledgeReceiptPdf` server functions in `src/lib/receipts.functions.ts`, gated by `requireStaffOrAdmin`. They read `donation_intents` by reference and, when status is received, reuse the matching `donations` row so the existing `receipt_number` sequence applies.
- PDF built with the existing `pdf-lib` code path, extended to embed `/images/logo.png` and the foundation details; returned as base64 and downloaded in the browser.
- `SubmissionsManager`: add the Receipt link per pledge.
- Verify by generating a receipt for a test pledge and visually checking the PDF.

## Question for you
Is the foundation a registered charity whose donations are tax-deductible (DGR status)? If yes, I'll add the standard "Gifts of $2 or more are tax deductible" line; if not, it stays off.
