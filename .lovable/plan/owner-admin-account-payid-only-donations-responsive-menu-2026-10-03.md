# Owner admin account, PayID-only donations, responsive menu

## 1. Owner admin account
- Invite **manyangmalet@hotmail.com** (name: Manyang Malet Manyang) as an **admin** using the existing staff invite flow.
- The owner receives an invite email to set their own password, then signs in at /admin to manage pledges (Finance → Submissions) and receipts.
- Note: site emails are still blocked until the email domain check is retried. If the invite email cannot be delivered, I will create the account with a temporary password instead and tell you how to pass it on safely; the owner should change it on first sign-in.

## 2. Donate page: PayID only
- Remove all bank transfer details (bank name, account name, BSB, account number) and their copy buttons from the Donate page, the post-pledge confirmation and the pledge confirmation email.
- Keep PayID (0434133392) with its copy button.
- Remove "Bank transfer" as a payment method choice in the pledge form; existing pledge records stay untouched.

## 3. Menu
- Desktop (1024px and wider): page links in one horizontal row with logo and Donate button.
- Tablets and phones: hamburger menu.
- Make the desktop row fit cleanly: tighter link spacing and smaller text at 1024–1279px so nothing clips, normal spacing on wider screens.

## Verification
- Confirm the owner account exists with the admin role.
- Check the Donate page shows only PayID, before and after a test pledge.
- Screenshot the menu at 1440, 1024, 820 and 360px; open the phone menu.

## Technical details
- Account: `inviteStaffAccount` logic via admin client (role `admin` in `user_roles`); fallback `auth.admin.createUser` with `email_confirm: true`.
- Donate: `DonateView.tsx` defaults + `PageSettingsEditor` donate fields, pledge email template; channel default becomes `payid`.
- Menu: `Navbar.tsx` gap/text sizes at `lg` vs `xl`.
