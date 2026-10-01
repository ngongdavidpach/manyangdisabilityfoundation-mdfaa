# Show the saved gallery image on the homepage

## What will change
- Use the image already selected under Admin Dashboard → Site Content → Home Page → Hero image as the homepage’s main photo.
- Place the existing headline, supporting text, and buttons over the photo with enough contrast to read on desktop and mobile. Keep the next section visible below the opening area.
- If the image is cleared or unavailable, retain a readable text-only opening area rather than showing a broken photo.

## Technical details
- The Home Page settings already contain a saved `hero.image`, but the homepage currently reads only the insight settings and does not display that image. Read the saved image from the same `page_settings` entry and render it in the opening section.
- Keep the existing admin image field and saved content unchanged; no new upload or database change is needed.
- Check desktop and mobile appearance and confirm the saved photo displays without obscuring the text or buttons.
