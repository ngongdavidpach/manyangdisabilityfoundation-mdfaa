import { createFileRoute } from "@tanstack/react-router";
import { NewsView } from "../ported/components/views/NewsView";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News & Events — Manyang Disability Foundation" },
      { name: "description", content: "Field dispatches, outreach updates, and upcoming foundation events." },
      { property: "og:title", content: "News & Events — Manyang Disability Foundation" },
      { property: "og:description", content: "Field dispatches, outreach updates, and upcoming foundation events." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://manyangdisabilityfoundation.org/news" },
      { property: "og:image", content: "https://manyangdisabilityfoundation.org/images/logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "News & Events — Manyang Disability Foundation" },
      { name: "twitter:description", content: "Field dispatches, outreach updates, and upcoming foundation events." },
    ],
    links: [{ rel: "canonical", href: "https://manyangdisabilityfoundation.org/news" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "News & Events — Manyang Disability Foundation",
          description: "Field dispatches, outreach updates, and upcoming foundation events.",
          url: "https://manyangdisabilityfoundation.org/news",
          publisher: { "@type": "Organization", name: "Manyang Disability Foundation" },
        }),
      },
    ],
  }),
  component: () => <NewsView />,
});
