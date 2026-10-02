# Hide the CSR page and Contact page partnership details

## What will change
- **Admin controls:** Add two Show/Hide switches in Admin Dashboard → Site Content:
  - "Show CSR Sponsorship page" (new CSR Sponsorship entry).
  - "Show partnership details" (Contact page / Foundation Info).
  Both will be switched **off** right away, and you can turn them back on whenever you like.
- **CSR page when off:** Visitors going to /csr-sponsorship see a "page not found" message instead. The CSR link is also removed from the footer Resources and the Contact page, and from any other page that links to it.
- **Contact page when off:** The Contact page heading and intro drop the "Partner / CSR sponsorship" wording and the CSR prospectus note, and the "Partnership" and "Corporate / CSR sponsorship" choices are removed from the form. The contact form itself keeps working.
- **Search engines and link previews:** When off, the CSR page is removed from the sitemap and marked "do not index", and the Contact page's title and description no longer mention partnerships or CSR.

## Technical details
- Store the switches in the existing `page_settings` content (`csr-sponsorship.visible`, `foundation.showPartnership`); missing values are treated as "on", and then both are saved as off. No new table.
- The CSR route loader reads the setting and throws `notFound()` when it is off. Its head adds `robots: noindex`. The sitemap skips the route.
- The Contact route head picks between partnership and general wording based on the setting. The form leaves out the partnership options when the setting is off. The server keeps accepting the existing values, so older submissions still work.
- Footer resources and in-page links leave out `/csr-sponsorship` while it is off.
- Check the setting both off and on: the page, the sitemap, the head tags and the Contact form.
