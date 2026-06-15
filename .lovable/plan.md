## Plan: Switch to npm-only and refresh lockfile

### Steps
1. Delete `bun.lock` from the project root.
2. Remove the `bun.lock` entry from `.prettierignore` (no longer needed).
3. Regenerate `package-lock.json` against current `package.json` and update transitive dependencies to their latest allowed versions:
   - Remove existing `node_modules` and `package-lock.json`
   - Run `npm install` to produce a fresh npm lockfile resolving the newest versions compatible with each `package.json` semver range
4. Verify install succeeds and the dev/build pipeline is unaffected (the harness runs the build automatically).

### Notes
- This does **not** bump semver ranges in `package.json` (no major upgrades). It only refreshes the locked versions within existing ranges. If you also want major version bumps (e.g. via `npm-check-updates`), say so and I'll add that step.
- No application code changes.
