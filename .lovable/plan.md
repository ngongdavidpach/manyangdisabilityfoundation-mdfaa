## Replace ACNC Charity Tick with official asset

1. Upload the user-provided `ACNC_Registered_Charity_Tick-2.JPG` to the Lovable CDN via `lovable-assets create`, writing the pointer to `src/assets/acnc-charity-tick.jpg.asset.json` (overwriting the existing pointer).
2. Update `src/ported/components/Footer.tsx`:
   - Import the asset pointer JSON.
   - Replace `src="/images/acnc-charity-tick.png"` with the CDN URL from the pointer.
   - Remove the white background wrapper classes (`bg-white rounded-full p-1`) since the official tick has its own transparent/white background — keep sizing at 64×64.
3. Delete the outdated placeholder `public/images/acnc-charity-tick.png`.
4. Verify by viewing the footer in the preview.
