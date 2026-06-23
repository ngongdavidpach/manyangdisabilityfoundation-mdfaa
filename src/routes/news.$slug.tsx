import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { NewsView } from "../ported/components/views/NewsView";

const fetchArticleMeta = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ slug: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const { createClient } = await import("@supabase/supabase-js");
    const client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
    );
    const { data: row } = await client
      .from("news_articles")
      .select("title, excerpt, cover_image, published_at")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    return (row as {
      title: string;
      excerpt: string | null;
      cover_image: string | null;
      published_at: string | null;
    } | null) ?? null;
  });


const FALLBACK_TITLE = "Dispatch — MDF News";
const FALLBACK_DESC = "Field dispatch from the Manyang Disability Foundation.";
const FALLBACK_IMG = "https://manyangdisabilityfoundation.org/images/logo.png";

function truncate(s: string, n: number) {
  if (s.length <= n) return s;
  return s.slice(0, n - 1).trimEnd() + "…";
}

export const Route = createFileRoute("/news/$slug")({
  loader: async ({ params }) => {
    const article = await fetchArticleMeta({ data: { slug: params.slug } });
    return { article };
  },
  head: ({ params, loaderData }) => {
    const url = `https://manyangdisabilityfoundation.org/news/${params.slug}`;
    const a = loaderData?.article ?? null;
    const rawTitle = a?.title ?? FALLBACK_TITLE;
    const title = truncate(`${rawTitle} — MDF News`, 60);
    const desc = truncate(a?.excerpt || FALLBACK_DESC, 160);
    const image = a?.cover_image || FALLBACK_IMG;

    const meta = [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:type", content: "article" },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { property: "og:site_name", content: "Manyang Disability Foundation" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: desc },
      { name: "twitter:image", content: image },
    ];

    const scripts = a
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NewsArticle",
              headline: a.title,
              description: a.excerpt || undefined,
              image: a.cover_image ? [a.cover_image] : undefined,
              datePublished: a.published_at || undefined,
              dateModified: a.published_at || undefined,
              author: a.author
                ? [{ "@type": "Person", name: a.author }]
                : [{ "@type": "Organization", name: "Manyang Disability Foundation" }],
              publisher: {
                "@type": "Organization",
                name: "Manyang Disability Foundation",
                logo: {
                  "@type": "ImageObject",
                  url: "https://manyangdisabilityfoundation.org/images/logo.png",
                },
              },
              mainEntityOfPage: { "@type": "WebPage", "@id": url },
            }),
          },
        ]
      : undefined;

    return {
      meta,
      links: [{ rel: "canonical", href: url }],
      scripts,
    };
  },
  component: ArticleRoute,
});

function ArticleRoute() {
  const { slug } = Route.useParams();
  return <NewsView articleId={slug} />;
}
