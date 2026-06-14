import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import App from "../ported/App";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Manyang Disability Foundation — Mobility, Health & Education" },
      {
        name: "description",
        content:
          "Dedicated to uplifting vulnerable individuals and persons with disabilities through tailored mobility aids, advanced healthcare access, inclusive education, and sustainable livelihoods.",
      },
      { property: "og:title", content: "Manyang Disability Foundation" },
      {
        property: "og:description",
        content:
          "Mobility aids, healthcare access, inclusive education, and sustainable livelihoods for persons with disabilities.",
      },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/images/logo.png" },
      { rel: "apple-touch-icon", href: "/images/logo.png" },
    ],
  }),
  component: Index,
});

function Index() {
  // The ported SPA relies on browser-only APIs (localStorage) during render.
  // Mount client-only to avoid SSR mismatches.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return <App />;
}
