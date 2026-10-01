import type { PageSeo } from "./pageSeo.functions";

const BASE = "https://manyangdisabilityfoundation.org";
export const DEFAULT_OG_IMAGE = `${BASE}/images/logo.png`;

export function buildRouteHead(opts: {
  path: string; // leading slash, e.g. "/about"
  defaultTitle: string;
  defaultDescription: string;
  seo: PageSeo | undefined;
}) {
  const seo = opts.seo ?? {};
  const title = seo.title || opts.defaultTitle;
  const description = seo.description || opts.defaultDescription;
  const url = `${BASE}${opts.path}`;
  const meta: any[] = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
  ];
  const ogImage = seo.ogImage || seo.heroImage || DEFAULT_OG_IMAGE;
  meta.push({ property: "og:image", content: ogImage });
  meta.push({ name: "twitter:image", content: ogImage });
  if (seo.noindex) meta.push({ name: "robots", content: "noindex" });
  return {
    meta,
    links: [{ rel: "canonical", href: url }],
  };
}
