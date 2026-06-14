import { createFileRoute } from "@tanstack/react-router";
import { NewsView } from "../ported/components/views/NewsView";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News & Events — Manyang Disability Foundation" },
      { name: "description", content: "Field dispatches, outreach updates, and upcoming foundation events." },
      { property: "og:title", content: "News & Events — Manyang Disability Foundation" },
      { property: "og:url", content: "https://manyangfoundation.lovable.app/news" },
    ],
    links: [{ rel: "canonical", href: "https://manyangfoundation.lovable.app/news" }],
  }),
  component: () => <NewsView />,
});
