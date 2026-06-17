Replace the login form at `/auth/login` with a dual-purpose page: a "Send a Message" contact form as the default view, plus a "Staff Sign In" tab for admin access. This preserves all existing redirect links while giving visitors a way to contact the foundation.

**Files to modify:**

- `src/ported/components/views/LoginView.tsx` — convert to a tabbed contact/login page
- `src/routes/auth.login.tsx` — update title and meta description
- `src/ported/components/Navbar.tsx` — keep redirect logic unchanged (staff can use the Sign In tab)
- `src/ported/components/ProtectedRoute.tsx` — keep redirect logic unchanged

**Files to create:**

- `src/lib/contact.functions.ts` — server function to store contact messages in Supabase
- Database migration for `contact_messages` table (or reuse existing contacts table if available)

**Detailed plan:**

1. **Tabbed UI in LoginView.tsx**
   - Add a tab switcher at the top of the right panel: [Send a Message] [Staff Sign In]
   - Default active tab: "Send a Message"
   - "Send a Message" tab shows:
     - Full Name input
     - Email input
     - Subject input (select dropdown with common options: General Inquiry, Volunteer, Donation, Partnership, Other)
     - Message textarea
     - Submit button "Send Message"
     - Success message after submission
   - "Staff Sign In" tab shows the existing login form (email, password, sign in button)
   - Keep the left brand panel unchanged (foundation logo, welcome text, security badges)

2. **Backend: store messages**
   - Create `submitContactMessage` server function in `src/lib/contact.functions.ts`
   - Validate inputs (name, email, subject, message)
   - Insert into a new `contact_messages` table in Supabase (or check if `contacts` table exists)
   - Return success/error response

3. **Database migration**
   - Create `contact_messages` table: id, name, email, subject, message, created_at, status (new/read/replied)
   - Add appropriate RLS policies (allow anonymous inserts, admin-only reads)
   - Add GRANT statements for anon and authenticated roles

4. **Route metadata update**
   - Update `src/routes/auth.login.tsx` title to "Contact Us — Manyang Disability Foundation" or keep "Sign In" with updated description

**Open question:** Should the "Send a Message" tab be a completely separate page (e.g., `/contact`) instead of sharing `/auth/login`? If so, we would create a new `/contact` route and keep `/auth/login` purely for staff login. This would be cleaner but requires updating all redirect references. With the tabbed approach, no existing code needs to change.
