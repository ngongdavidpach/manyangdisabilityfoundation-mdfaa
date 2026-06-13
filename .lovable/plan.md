## Goal

Port the contents of `ngongdavidpach/Manyang-Disability-Foundation-Association-of-Australia` into this Lovable project.

## Important constraint

The source repo is a plain **Vite + TypeScript** app (root `index.html`, root `package.json`, root `vite.config.ts`, plain `src/`). This Lovable project is a **TanStack Start** app (file-based routing in `src/routes/`, root layout in `src/routes/__root.tsx`, its own `vite.config.ts`, `package.json`, etc.).

A literal "overwrite everything" clone would break the Lovable build (duplicate `vite.config.ts`, conflicting `package.json`, no `src/routes/`, no router bootstrap). So a "direct clone" here means: pull every source file and asset from the repo, but adapt them to fit this project's structure so the site actually runs.

## Steps

1. **Fetch the repo** by downloading the GitHub tarball (`https://codeload.github.com/.../tar.gz/refs/heads/main`) into `/tmp` and extracting it, so I can see every file (the GitHub web page didn't reveal individual files inside `src/`).
2. **Inventory** what's in the repo: components, pages, styles, assets in `public/images/`, dependencies in `package.json`.
3. **Copy assets** from `public/images/` into this project's `public/images/` (or `src/assets/` as appropriate).
4. **Port the page(s)**:
   - The original `index.html` + Vite entry becomes the home route at `src/routes/index.tsx` (replacing the current placeholder).
   - If the repo has multiple pages/sections as separate components, create a route file per top-level section under `src/routes/` (e.g. `about.tsx`, `contact.tsx`).
   - Copy reusable components into `src/components/`.
   - Migrate global styles into `src/styles.css` (keeping the existing design-token block intact; only appending repo-specific base styles).
5. **Dependencies**: install any npm packages the repo uses that aren't already in this project (`bun add <pkg>`).
6. **Wire metadata**: set `head()` title/description/OG tags per route from the repo's `<head>` content.
7. **Verify** the build succeeds and the home route renders the ported content in the preview.

## What I will NOT do

- Overwrite root-level config files (`vite.config.ts`, `tsconfig.json`, `package.json`, `.gitignore`) — these belong to the Lovable TanStack Start shell.
- Copy `.github/workflows/` (Jekyll CI is irrelevant here).
- Delete `src/routes/__root.tsx`, `src/router.tsx`, `src/start.ts`, `src/server.ts` — required for the app to boot.

## Open question

If you actually wanted a *byte-for-byte* mirror of the repo (no adaptation), the right move is to use Lovable's GitHub integration to connect a fresh project to that repo instead — let me know and I'll point you at that flow instead of porting.
