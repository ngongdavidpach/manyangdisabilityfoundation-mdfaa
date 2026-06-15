## Plan: Silence harmless "use client" directive warnings

Add a Rollup `onwarn` filter in `vite.config.ts` that drops `MODULE_LEVEL_DIRECTIVE` warnings originating from `node_modules` (these come from `@tanstack/react-router`'s `"use client"` markers, which Vite/Rollup don't need but emit a warning for during SSR/client bundling). All other warnings still surface.

```ts
export default defineConfig({
  vite: {
    build: {
      rollupOptions: {
        onwarn(warning, defaultHandler) {
          if (
            warning.code === "MODULE_LEVEL_DIRECTIVE" &&
            warning.message.includes("use client")
          ) return;
          defaultHandler(warning);
        },
      },
    },
  },
});
```

Then run `npm run build` to confirm the notices are gone and the build still succeeds.
