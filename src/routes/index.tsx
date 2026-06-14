import { createFileRoute } from "@tanstack/react-router";
import { HomeView } from "../ported/components/views/HomeView";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Manyang Disability Foundation — Mobility, Health & Education" },
      { name: "description", content: "Uplifting persons with disabilities through tailored mobility aids, healthcare access, inclusive education, and sustainable livelihoods." },
      { property: "og:title", content: "Manyang Disability Foundation" },
      { property: "og:description", content: "Mobility, healthcare, education, and livelihoods for persons with disabilities." },
      { property: "og:url", content: "https://manyangdisabilityfoundation.org/" },
    ],
    links: [{ rel: "canonical", href: "https://manyangdisabilityfoundation.org/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Manyang Disability Foundation",
          url: "https://manyangdisabilityfoundation.org/",
          logo: "https://manyangdisabilityfoundation.org/images/logo.png",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Manyang Disability Foundation",
          url: "https://manyangdisabilityfoundation.org/",
        }),
      },
    ],
  }),
  component: HomeView,
});
