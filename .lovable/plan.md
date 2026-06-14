
# Plan: PWA, Donor CRM, and Financial Management

Four workstreams, delivered in order so each builds on the last.

---

## 1. PWA — Installable + Offline

- Add `vite-plugin-pwa` with `generateSW`, `registerType: "autoUpdate"`.
- Manifest: name "Manyang Disability Foundation", short name "Manyang", theme/background colors from the design tokens, `display: "standalone"`, icons (192/512/maskable) generated from the existing `/images/logo.png`.
- Head tags in `__root.tsx`: `manifest`, `theme-color`, `apple-touch-icon`.
- Single guarded registration wrapper that refuses to register in dev, iframe previews, Lovable preview hostnames, and when `?sw=off` — unregisters stale workers in those contexts.
- Workbox runtime caching: `NetworkFirst` for HTML navigations, `CacheFirst` for hashed assets, exclude `/~oauth`, `/api/*`, and Supabase auth.
- Offline fallback page for navigation failures.
- Note: offline only works on the published app, not in the Lovable editor preview.

---

## 2. Data Model (one migration)

New tables, all with RLS + GRANTs. Admin-only writes via `has_role(auth.uid(),'admin')`; donors can read their own records via `auth.uid() = user_id`.

- `contacts` — unified CRM record: type (`donor` | `lead` | `partner` | `volunteer`), full_name, email, phone, organization, country, tags (text[]), notes, optional `user_id` link to auth.users, lifecycle_stage, source.
- `contact_interactions` — contact_id, type (`email` | `call` | `meeting` | `note` | `task`), subject, body, occurred_at, follow_up_at, created_by.
- `donations` — contact_id (nullable), user_id (nullable), amount_cents, currency, method (`stripe` | `cash` | `bank_transfer` | `cheque` | `mobile_money`), status (`pending` | `completed` | `refunded` | `failed`), stripe_payment_intent_id, designation (program pillar), received_at, receipt_number (auto-seq), notes.
- `receipts` — donation_id, pdf_url, issued_at, issued_by, receipt_number.
- `expense_categories` — name, parent_id, budget_cents (annual).
- `expenses` — category_id, amount_cents, currency, vendor, description, incurred_at, paid_at, status, receipt_url, program_pillar, created_by.
- `budgets` — fiscal_year, category_id, planned_cents.

Indexes on `contact_id`, `received_at`, `incurred_at`, `status` for report queries. `set_updated_at` triggers on all.

---

## 3. Financial Management

### a. Online donations (Stripe)
- Run `recommend_payment_provider` then `enable_stripe_payments`. The user already chose Lovable built-in Stripe.
- After enable, create Stripe products via the post-enable batch tool: one recurring "Monthly Donation" and several one-time preset amounts ($25/$50/$100/$250/custom), tax handling per the post-enable knowledge.
- Wire the existing `DonateView` "Give now" flow to a `createCheckoutSession` server fn; success page records the donation and triggers receipt PDF.
- Stripe webhook server route at `src/routes/api/public/stripe-webhook.ts` — verifies signature, inserts/updates `donations`, generates receipt.

### b. Manual donations + receipts
- Admin form: `src/ported/components/admin/DonationsManager.tsx` — log offline donation, link to contact, issue receipt.
- Receipt PDF generated server-side with `pdf-lib` (Worker-safe), uploaded to a new private `receipts` storage bucket, signed URL returned. Receipt numbering via Postgres sequence.

### c. Expenses & budgets
- Admin views: `ExpensesManager.tsx`, `BudgetsManager.tsx`, `ExpenseCategoriesManager.tsx`.

### d. Reports & dashboards
- `FinanceReportsView.tsx` under admin: income vs expense by month (recharts), donor retention (new vs repeat), top donors, program-pillar spend breakdown, budget-vs-actual table. Date range filter.

---

## 4. Donor / CRM

- Admin section `CRM` with sub-tabs:
  - **Contacts** — list, filter by type/tag/stage, detail drawer with profile, donation history, interaction timeline.
  - **Pipeline** — kanban by `lifecycle_stage` (lead → qualified → engaged → donor → lapsed), drag to move.
  - **Interactions** — log call/email/meeting/note with follow-up date; "My follow-ups" filtered by `created_by` and due date.
- Donor self-service: extend existing `DashboardView` with a "My giving" panel reading from `donations` where `user_id = auth.uid()`, plus receipt download links.
- New nav entry in admin sidebar; no public nav changes.

---

## Tech notes

- All admin pages live under existing `/admin` route (already gated by `ProtectedRoute requiredRoles=['admin']`).
- Donor self-serve under `_authenticated/` so the integration gate handles SSR.
- Stripe server fns under `src/lib/payments.functions.ts`; webhook under `src/routes/api/public/`. `supabaseAdmin` imported inside handlers only.
- PDF generation is Worker-compatible (`pdf-lib`, no native deps).
- New storage bucket `receipts` (private) created via `storage_create_bucket`; RLS on `storage.objects` so donors read only their own.
- One Supabase migration for all new tables + GRANTs + RLS + triggers + receipt-number sequence.

---

## Delivery order

1. PWA scaffold (smallest, isolated).
2. Migration (tables, RLS, sequence, storage bucket).
3. Stripe enablement → checkout + webhook → online donations end-to-end.
4. Manual donation entry + receipt PDF.
5. Expenses, categories, budgets.
6. CRM contacts + interactions + pipeline.
7. Donor self-serve "My giving".
8. Reports dashboard.

Out of scope for v1 (can follow): email campaigns, recurring-donation management UI beyond Stripe customer portal, multi-currency conversion, automated bank import.
