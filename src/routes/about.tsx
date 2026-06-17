import { createFileRoute } from "@tanstack/react-router";
import { AboutView } from "../ported/components/views/AboutView";
import { getPageSeo, type PageSeo } from "../lib/pageSeo.functions";
import { buildRouteHead } from "../lib/routeHead";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Manyang Disability Foundation" },
      { name: "description", content: "Our mission, governance, and approach to supporting persons with disabilities." },
      { property: "og:title", content: "About — Manyang Disability Foundation" },
      { property: "og:description", content: "Our mission, governance, and approach to supporting persons with disabilities." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://manyangdisabilityfoundation.org/about" },
      { property: "og:image", content: "https://manyangdisabilityfoundation.org/images/logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "About — Manyang Disability Foundation" },
      { name: "twitter:description", content: "Our mission, governance, and approach to supporting persons with disabilities." },
    ],
    links: [{ rel: "canonical", href: "https://manyangdisabilityfoundation.org/about" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "About — Manyang Disability Foundation",
          description: "Our mission, governance, and approach to supporting persons with disabilities.",
          url: "https://manyangdisabilityfoundation.org/about",
          publisher: { "@type": "Organization", name: "Manyang Disability Foundation" },
        }),
      },
    ],
  }),
  component: AboutView,
});
