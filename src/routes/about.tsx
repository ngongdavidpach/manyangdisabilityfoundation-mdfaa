import { createFileRoute } from "@tanstack/react-router";
import { AboutView } from "../ported/components/views/AboutView";
import { getPageSeo, type PageSeo } from "../lib/pageSeo.functions";
import { buildRouteHead } from "../lib/routeHead";

export const Route = createFileRoute("/about")({
  loader: () => getPageSeo({ data: { pageKey: "about" } }).catch((): PageSeo => ({})),
  head: ({ loaderData }) =>
    buildRouteHead({
      path: "/about",
      defaultTitle: "About — Manyang Disability Foundation",
      defaultDescription: "Our mission, governance, and approach to supporting persons with disabilities.",
      seo: loaderData,
    }),
  component: AboutView,
});
