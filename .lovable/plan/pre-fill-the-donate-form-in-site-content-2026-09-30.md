# Pre-fill the Donate form in Site Content

## Problem
In Admin Dashboard → Site Content → Donate, the fields (Heading, Intro, Bank name, Account name, BSB, Account number, PayID) appear empty. The saved `donate` settings row only contains `showDonateButton`, so the editor shows blanks even though the live Donate page displays the real details from its built-in defaults.

## Change
In `src/ported/components/admin/PageSettingsEditor.tsx`, add a small defaults map for the `donate` page so the editor pre-fills with the same values the public page shows:

- Bank name: Commonwealth Bank
- Account name: Manyang M Manyang
- BSB: 063132
- Account number: 11477543
- PayID: 0434133392
- Show Donate Now button: on

Saved values still win — if staff have already saved content, it loads exactly as before. The defaults only fill fields that have never been saved, so what you see in the editor matches what visitors see on the site.

## Verification
- Open Admin Dashboard → Site Content → Donate and confirm the fields show the real bank and PayID details.
- Edit a value, save, and confirm the live Donate page reflects it.
- Build passes.
