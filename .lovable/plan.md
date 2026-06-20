Remove the selected warning-triangle SVG from the error display in the CountrySelect component.

- File: `src/ported/components/ui/CountrySelect.tsx`
- Change: Delete the `<svg>` element (lines 155-161) from inside the `{error && !loading}` paragraph, keeping the `{error}` text output.