## Plan: Event RSVP form with confirmation email

The `submitEventRsvp` server function and `event_rsvps` table already exist. This plan wires up the UI, adds a confirmation email, and updates the server function to send it.

### 1. Extend `submitEventRsvp` in `src/lib/intake.functions.ts`
- Keep existing Zod schema (fullName, email, phone, eventTitle, eventExternalId).
- After successful insert, enqueue an `event-rsvp-confirmation` email via `enqueueTransactionalEmail` using an idempotency key derived from the inserted RSVP id (mirrors the coordinator/fundraiser pattern). Errors from the email step are logged, never thrown, so a mail failure doesn't fail the RSVP.

### 2. New email template `src/lib/email-templates/event-rsvp-confirmation.tsx`
- React Email template branded to match the existing confirmation templates (same shared header/footer style).
- Props: `fullName`, `eventTitle`, `eventDate` (optional pretty string), `eventLocation` (optional).
- Register it in `src/lib/email-templates/registry.ts`.

### 3. New component `src/ported/components/EventRsvpForm.tsx`
- Controlled form: Full name, email, phone (optional). Client-side validation for required fields + email format; server remains source of truth.
- Calls `submitEventRsvp` via `useServerFn`, passing `eventExternalId` (event id) and `eventTitle`.
- States: idle → submitting → success (shows thank-you card) / error (inline message). Disables submit while pending.

### 4. Wire form into `src/routes/events.$slug.tsx`
- Render `<EventRsvpForm />` below the event description, above/replacing the current external "RSVP for this event" button when `rsvp_url` is not set. If `rsvp_url` exists, show both: external RSVP link and the internal form (external takes visual priority).

### Technical notes
- No schema changes. `event_rsvps` already stores name/email/phone/event_title/event_external_id.
- Rate limiting already enforced in the existing server function (10/hour).
- Uses existing email queue infrastructure; no new routes or migrations.
