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
// Silence harmless "use client" directive warnings from libraries like
// @tanstack/react-router. Rollup ignores top-level directives when
// bundling and the notice isn't actionable. The handler is applied to
// every Vite environment (client + ssr) since TanStack Start builds both.
const silenceUseClient = {
  onwarn(warning: { code?: string; message?: string }, defaultHandler: (w: unknown) => void) {
    if (
      (warning.code === "MODULE_LEVEL_DIRECTIVE" || warning.code === "SOURCEMAP_ERROR") &&
      typeof warning.message === "string" &&
      warning.message.includes("use client")
    ) {
      return;
    }
    if (typeof warning.message === "string" && warning.message.includes('"use client"')) {
      return;
    }
    defaultHandler(warning);
  },
};

export default defineConfig({
  vite: {
    build: { rollupOptions: silenceUseClient },
    environments: {
      client: { build: { rollupOptions: silenceUseClient } },
      ssr: { build: { rollupOptions: silenceUseClient } },
    },
  },
});

