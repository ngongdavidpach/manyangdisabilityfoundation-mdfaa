import { createFileRoute } from "@tanstack/react-router";
import { HomeView } from "../ported/components/views/HomeView";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Manyang Disability Foundation — Mobility, Health & Education" },
      { name: "description", content: "Uplifting persons with disabilities through tailored mobility aids, healthcare access, inclusive education, and sustainable livelihoods." },
      { property: "og:title", content: "Manyang Disability Foundation" },
      { property: "og:description", content: "Mobility, healthcare, education, and livelihoods for persons with disabilities." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://manyangdisabilityfoundation.org/" },
      { property: "og:image", content: "https://manyangdisabilityfoundation.org/images/logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Manyang Disability Foundation" },
      { name: "twitter:description", content: "Mobility, healthcare, education, and livelihoods for persons with disabilities." },
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
          sameAs: [
            "https://twitter.com/manyangfoundation",
            "https://facebook.com/manyangdisabilityfoundation",
            "https://linkedin.com/company/manyang-disability-foundation",
          ],
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+234-XXX-XXXXXX",
            contactType: "customer service",
            availableLanguage: ["English"],
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Manyang Disability Foundation",
          url: "https://manyangdisabilityfoundation.org/",
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: "https://manyangdisabilityfoundation.org/search?q={search_term_string}",
            },
            "query-input": "required name=search_term_string",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Manyang Disability Foundation — Mobility, Health & Education",
          description: "Uplifting persons with disabilities through tailored mobility aids, healthcare access, inclusive education, and sustainable livelihoods.",
          url: "https://manyangdisabilityfoundation.org/",
          publisher: { "@type": "Organization", name: "Manyang Disability Foundation" },
        }),
      },
    ],
  }),
  component: HomeView,
});
