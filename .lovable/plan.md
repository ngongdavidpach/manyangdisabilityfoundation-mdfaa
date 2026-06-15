## Plan: Verify the production build compiles cleanly

### Steps
1. Run `npm run build` and capture full output (the previous error log was truncated to just the rolldown stack tail).
2. If it fails, read the actual plugin/source error from the full output and fix it.
3. Re-run `npm run build` to confirm a clean exit (and `npm run build:dev` since that's the script the earlier failure was attributed to).

### Notes
- No Cloudflare config files will be added — `@lovable.dev/vite-tanstack-config` already targets Cloudflare Workers via Nitro, and Lovable manages the deploy.
- No `package.json` semver changes; this only validates the regenerated `package-lock.json`.
