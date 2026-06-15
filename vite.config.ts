// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// NOTE: vite-plugin-pwa is intentionally not used here. It assumes a
// classic SPA build with index.html as the entry, which TanStack Start
// does not have (SSR via Nitro). A static service worker can be added
// under public/sw.js if PWA behavior is needed later.
export default defineConfig({
  vite: {
    build: {
      rollupOptions: {
        onwarn(warning, defaultHandler) {
          // Silence harmless "use client" directive warnings from
          // @tanstack/react-router (and other RSC-tagged libraries).
          // Rollup ignores top-level directives during bundling; the
          // notice doesn't indicate a real issue.
          if (
            warning.code === "MODULE_LEVEL_DIRECTIVE" &&
            typeof warning.message === "string" &&
            warning.message.includes("use client")
          ) {
            return;
          }
          defaultHandler(warning);
        },
      },
    },
  },
});
