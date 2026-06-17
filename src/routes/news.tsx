import { createFileRoute } from "@tanstack/react-router";
import { NewsView } from "../ported/components/views/NewsView";
import { getPageSeo, type PageSeo } from "../lib/pageSeo.functions";
import { buildRouteHead } from "../lib/routeHead";

export const Route = createFileRoute("/news")({
  loader: () => getPageSeo({ data: { pageKey: "news" } }).catch((): PageSeo => ({})),
  head: ({ loaderData }) =>
    buildRouteHead({
      path: "/news",
      defaultTitle: "News & Events — Manyang Disability Foundation",
      defaultDescription: "Field dispatches, outreach updates, and upcoming foundation events.",
      seo: loaderData,
    }),
  component: () => <NewsView />,
});
