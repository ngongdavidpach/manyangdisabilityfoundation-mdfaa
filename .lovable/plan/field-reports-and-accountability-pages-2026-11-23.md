# Field Reports and Accountability pages

## What already exists
- A **Field Reports** page (/field-reports) with the two 2026 reports (wheelchairs for children in Kakuma; surgery for children from Juba and Kakuma, more than 100 children) and a PDF download. The Programs page already links to it.
- An **Accountability** page (/accountability) with incorporation number A0116724S and the committee (Manyang Malet Manyang, CEO; Manyang Maler Manyang, Director). It links to Field Reports, and the About page links to it. It has no PDF and isn't linked from Programs.

## What I'll change
1. **Accountability page, full version**
   - Registration block (A0116724S, Consumer Affairs Victoria).
   - Committee list.
   - Each field report written out on the page: program, place, who was helped, number of children, and date (2026).
   - The "500 people helped up to November 2026" total.
   - A **Download PDF** button. The PDF has the logo, registration number, committee and all field reports.
2. **Field Reports page**: keep it as it is. It will use the same report list as the Accountability page so the two always match. Its PDF stays the same.
3. **Programs page**: add an "Accountability & registration" link next to the existing Field Reports link.
4. Check both pages and both PDF downloads in the browser on desktop and mobile.

## Not included
- No made-up numbers, months or photos. Reports only say "2026" and "more than 100 children" unless you send exact months.

## Technical details
- New shared module `src/ported/data/fieldReports.ts` (report list and org facts), used by both routes.
- Shared PDF builder `src/lib/fieldReportsPdf.ts` using pdf-lib, loaded in the browser only. Generate first, then download (in-app download Outcome B).
- Update the head() on /accountability. The sitemap already lists both pages.
