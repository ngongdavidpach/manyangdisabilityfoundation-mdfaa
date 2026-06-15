import { createFileRoute } from "@tanstack/react-router";
import { DonateView } from "../ported/components/views/DonateView";

export const Route = createFileRoute("/donate")({
  head: () => ({
    meta: [
      { title: "Donate — Manyang Disability Foundation" },
      { name: "description", content: "Fund custom wheelchairs, rehabilitation surgeries, and inclusive classroom tools." },
      { property: "og:title", content: "Donate — Manyang Disability Foundation" },
      { property: "og:description", content: "Fund custom wheelchairs, rehabilitation surgeries, and inclusive classroom tools." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://manyangdisabilityfoundation.org/donate" },
      { property: "og:image", content: "https://manyangdisabilityfoundation.org/images/logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Donate — Manyang Disability Foundation" },
      { name: "twitter:description", content: "Fund custom wheelchairs, rehabilitation surgeries, and inclusive classroom tools." },
    ],
    links: [{ rel: "canonical", href: "https://manyangdisabilityfoundation.org/donate" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Donate — Manyang Disability Foundation",
          description: "Fund custom wheelchairs, rehabilitation surgeries, and inclusive classroom tools.",
          url: "https://manyangdisabilityfoundation.org/donate",
          publisher: { "@type": "Organization", name: "Manyang Disability Foundation" },
        }),
      },
    ],
  }),
  component: DonateView,
});
