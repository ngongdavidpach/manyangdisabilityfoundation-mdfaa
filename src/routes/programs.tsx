import { createFileRoute } from "@tanstack/react-router";
import { ProgramsView } from "../ported/components/views/ProgramsView";
import { getPageSeo, type PageSeo } from "../lib/pageSeo.functions";
import { buildRouteHead } from "../lib/routeHead";

export const Route = createFileRoute("/programs")({
  loader: () => getPageSeo({ data: { pageKey: "programs" } }).catch((): PageSeo => ({})),
  head: ({ loaderData }) => {
    const base = buildRouteHead({
      path: "/programs",
      defaultTitle: "Programs — Manyang Disability Foundation",
      defaultDescription:
        "Mobility aids, surgical rehab, inclusive education, livelihood micro-grants, and advocacy.",
      seo: loaderData,
    });
    return {
      ...base,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Programs — Manyang Disability Foundation",
            description:
              "Mobility aids, surgical rehabilitation, inclusive education, livelihood micro-grants, and advocacy programs run by the Manyang Disability Foundation.",
            url: "https://manyangdisabilityfoundation.org/programs",
            isPartOf: {
              "@type": "WebSite",
              name: "Manyang Disability Foundation",
              url: "https://manyangdisabilityfoundation.org/",
            },
            about: [
              { "@type": "Thing", name: "Mobility aids" },
              { "@type": "Thing", name: "Surgical rehabilitation" },
              { "@type": "Thing", name: "Inclusive education" },
              { "@type": "Thing", name: "Livelihood micro-grants" },
              { "@type": "Thing", name: "Disability advocacy" },
            ],
          }),
        },
      ],
    };
  },
  component: ProgramsView,
});
