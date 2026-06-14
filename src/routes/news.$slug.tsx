import { createFileRoute } from "@tanstack/react-router";
import { NewsView } from "../ported/components/views/NewsView";
import { NEWS_ARTICLES } from "../ported/data/foundationData";

export const Route = createFileRoute("/news/$slug")({
  head: ({ params }) => {
    const article = NEWS_ARTICLES.find(a => a.id === params.slug);
    const title = article ? `${article.title} — MDF News` : "Dispatch — MDF News";
    const desc = article?.summary || "Field dispatch from the Manyang Disability Foundation.";
    const url = `https://manyangfoundation.lovable.app/news/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        ...(article?.image ? [{ property: "og:image", content: article.image }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      ...(article ? {
        scripts: [{
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: article.title,
            datePublished: article.date,
            author: { "@type": "Person", name: article.author },
            image: article.image,
          }),
        }],
      } : {}),
    };
  },
  component: ArticleRoute,
});

function ArticleRoute() {
  const { slug } = Route.useParams();
  return <NewsView articleId={slug} />;
}
