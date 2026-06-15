import { createFileRoute } from "@tanstack/react-router";
import { GalleryView } from "../ported/components/views/GalleryView";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Manyang Disability Foundation" },
      { name: "description", content: "Photos from outreach missions, wheelchair distributions, and community events." },
      { property: "og:title", content: "Gallery — Manyang Disability Foundation" },
      { property: "og:description", content: "Photos from outreach missions, wheelchair distributions, and community events." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://manyangdisabilityfoundation.org/gallery" },
      { property: "og:image", content: "https://manyangdisabilityfoundation.org/images/logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Gallery — Manyang Disability Foundation" },
      { name: "twitter:description", content: "Photos from outreach missions, wheelchair distributions, and community events." },
    ],
    links: [{ rel: "canonical", href: "https://manyangdisabilityfoundation.org/gallery" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Gallery — Manyang Disability Foundation",
          description: "Photos from outreach missions, wheelchair distributions, and community events.",
          url: "https://manyangdisabilityfoundation.org/gallery",
          publisher: { "@type": "Organization", name: "Manyang Disability Foundation" },
        }),
      },
    ],
  }),
  component: GalleryView,
});
