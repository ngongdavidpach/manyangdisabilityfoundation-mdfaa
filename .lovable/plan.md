Remove bun lockfile and configuration, switch to npm, and refresh package-lock.json with latest compatible dependency versions.

### What will happen
1. Delete `bun.lock` and `bunfig.toml` from the project root.
2. Run `npm install` to generate a fresh `package-lock.json` using the latest versions allowed by the existing `package.json` semver ranges.
3. Verify the dev server still starts correctly after the switch.

No changes to `package.json` scripts or application code.