import { createFileRoute } from "@tanstack/react-router";
import { GetInvolvedView } from "../ported/components/views/GetInvolvedView";

export const Route = createFileRoute("/get-involved")({
  head: () => ({
    meta: [
      { title: "Get Involved — Manyang Disability Foundation" },
      { name: "description", content: "Volunteer, partner, fundraise, or join an outreach mission with the foundation." },
      { property: "og:title", content: "Get Involved — Manyang Disability Foundation" },
      { property: "og:description", content: "Volunteer, partner, fundraise, or join an outreach mission with the foundation." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://manyangdisabilityfoundation.org/get-involved" },
      { property: "og:image", content: "https://manyangdisabilityfoundation.org/images/logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Get Involved — Manyang Disability Foundation" },
      { name: "twitter:description", content: "Volunteer, partner, fundraise, or join an outreach mission with the foundation." },
    ],
    links: [{ rel: "canonical", href: "https://manyangdisabilityfoundation.org/get-involved" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Get Involved — Manyang Disability Foundation",
          description: "Volunteer, partner, fundraise, or join an outreach mission with the foundation.",
          url: "https://manyangdisabilityfoundation.org/get-involved",
          publisher: { "@type": "Organization", name: "Manyang Disability Foundation" },
        }),
      },
    ],
  }),
  component: GetInvolvedView,
});
