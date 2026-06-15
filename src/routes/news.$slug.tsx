import { createFileRoute } from "@tanstack/react-router";
import { NewsView } from "../ported/components/views/NewsView";
import { NEWS_ARTICLES } from "../ported/data/foundationData";

export const Route = createFileRoute("/news/$slug")({
  head: ({ params }) => {
    const article = NEWS_ARTICLES.find((a) => a.id === params.slug);
    const title = article ? `${article.title} — MDF News` : "Dispatch — MDF News";
    const desc = article?.summary || "Field dispatch from the Manyang Disability Foundation.";
    const url = `https://manyangdisabilityfoundation.org/news/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: article?.image || "https://manyangdisabilityfoundation.org/images/logo.png" },
        { property: "og:site_name", content: "Manyang Disability Foundation" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
      ],
      links: [{ rel: "canonical", href: url }],
      ...(article
        ? {
            scripts: [
              {
                type: "application/ld+json",
                children: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "NewsArticle",
                  headline: article.title,
                  datePublished: article.date,
                  author: { "@type": "Person", name: article.author },
                  image: article.image,
                  publisher: {
                    "@type": "Organization",
                    name: "Manyang Disability Foundation",
                    logo: { "@type": "ImageObject", url: "https://manyangdisabilityfoundation.org/images/logo.png" },
                  },
                  mainEntityOfPage: url,
                }),
              },
            ],
          }
        : {}),
    };
  },
  component: ArticleRoute,
});

function ArticleRoute() {
  const { slug } = Route.useParams();
  return <NewsView articleId={slug} />;
}
