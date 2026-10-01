import { createFileRoute } from "@tanstack/react-router";
import { HomeView } from "../ported/components/views/HomeView";
import { getPageSeo, type PageSeo } from "../lib/pageSeo.functions";
import { DEFAULT_OG_IMAGE } from "../lib/routeHead";

const DEFAULTS = {
  title: "Manyang Disability Foundation — Mobility, Health & Education",
  description:
    "Uplifting persons with disabilities through tailored mobility aids, healthcare access, inclusive education, and sustainable livelihoods.",
};

export const Route = createFileRoute("/")({
  loader: () => getPageSeo({ data: { pageKey: "home" } }).catch((): PageSeo => ({})),
  head: ({ loaderData }) => {
    const seo = loaderData ?? {};
    const title = seo.title || DEFAULTS.title;
    const description = seo.description || DEFAULTS.description;
    const meta: any[] = [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://manyangdisabilityfoundation.org/" },
    ];
    const ogImage = seo.ogImage || seo.heroImage || DEFAULT_OG_IMAGE;
    meta.push({ property: "og:image", content: ogImage });
    meta.push({ name: "twitter:image", content: ogImage });
    if (seo.noindex) meta.push({ name: "robots", content: "noindex" });
    return {
      meta,
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
      ],
    };
  },
  component: HomeView,
});
