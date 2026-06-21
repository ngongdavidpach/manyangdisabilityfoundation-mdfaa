import { createFileRoute } from "@tanstack/react-router";
import { NewsView } from "../ported/components/views/NewsView";

export const Route = createFileRoute("/news/$slug")({
  head: ({ params }) => {
    const url = `https://manyangdisabilityfoundation.org/news/${params.slug}`;
    const title = "Dispatch — MDF News";
    const desc = "Field dispatch from the Manyang Disability Foundation.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        {
          property: "og:image",
          content: "https://manyangdisabilityfoundation.org/images/logo.png",
        },
        { property: "og:site_name", content: "Manyang Disability Foundation" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: ArticleRoute,
});

function ArticleRoute() {
  const { slug } = Route.useParams();
  return <NewsView articleId={slug} />;
}
