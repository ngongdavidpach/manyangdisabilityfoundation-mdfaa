import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  vite: {
    plugins: [
      tanstackStart(),
      react(),
    ],
  },
});
