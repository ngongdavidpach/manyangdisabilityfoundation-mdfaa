import { createFileRoute } from "@tanstack/react-router";
import { ProgramsView } from "../ported/components/views/ProgramsView";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs — Manyang Disability Foundation" },
      { name: "description", content: "Mobility aids, surgical rehab, inclusive education, livelihood micro-grants, and advocacy." },
      { property: "og:title", content: "Programs — Manyang Disability Foundation" },
      { property: "og:description", content: "Mobility aids, surgical rehab, inclusive education, livelihood micro-grants, and advocacy." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://manyangdisabilityfoundation.org/programs" },
      { property: "og:image", content: "https://manyangdisabilityfoundation.org/images/logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Programs — Manyang Disability Foundation" },
      { name: "twitter:description", content: "Mobility aids, surgical rehab, inclusive education, livelihood micro-grants, and advocacy." },
    ],
    links: [{ rel: "canonical", href: "https://manyangdisabilityfoundation.org/programs" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Programs — Manyang Disability Foundation",
          description: "Mobility aids, surgical rehab, inclusive education, livelihood micro-grants, and advocacy.",
          url: "https://manyangdisabilityfoundation.org/programs",
          publisher: { "@type": "Organization", name: "Manyang Disability Foundation" },
        }),
      },
    ],
  }),
  component: ProgramsView,
});
