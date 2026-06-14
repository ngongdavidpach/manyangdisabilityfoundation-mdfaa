## Plan: Update Favicon with Uploaded Logo

The uploaded image is a square circular logo (589×591px). The existing `public/images/logo.png` is a wide banner (1408×768px). All favicon, apple-touch-icon, and PWA manifest references already point to `/images/logo.png`.

### Changes

1. **Replace `public/images/logo.png`** with the uploaded `image.png`.
2. **No code changes needed** — `src/routes/__root.tsx` and `vite.config.ts` already reference `/images/logo.png` for favicon, apple-touch-icon, and PWA manifest icons.

The new circular logo will automatically become the favicon, apple-touch-icon, and PWA icon across the site.

### Optional add-on
I can also generate smaller sizes (e.g., 32×32, 180×180) and add explicit `<link rel="icon">` sizes for optimal browser/PWA support. Let me know if you'd like that.