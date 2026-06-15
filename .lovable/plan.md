## Plan: Replace `.inputValidator()` with `.validator()`

Rename every `createServerFn().inputValidator(...)` call to `.validator(...)` in:
- `src/lib/receipts.functions.ts`
- `src/lib/donations.functions.ts`
- `src/lib/api/example.functions.ts`
- `src/lib/intake.functions.ts` (if any uses are present there)

Then run `npm run build` to confirm the deprecation warnings are gone and the build still succeeds. Pure rename — no behavior changes.
