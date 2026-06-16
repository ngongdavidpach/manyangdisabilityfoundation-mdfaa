import { createFileRoute } from "@tanstack/react-router";
import { ProgramsView } from "../ported/components/views/ProgramsView";
import { getPageSeo, type PageSeo } from "../lib/pageSeo.functions";
import { buildRouteHead } from "../lib/routeHead";

export const Route = createFileRoute("/programs")({
  loader: () => getPageSeo({ data: { pageKey: "programs" } }).catch((): PageSeo => ({})),
  head: ({ loaderData }) =>
    buildRouteHead({
      path: "/programs",
      defaultTitle: "Programs — Manyang Disability Foundation",
      defaultDescription: "Mobility aids, surgical rehab, inclusive education, livelihood micro-grants, and advocacy.",
      seo: loaderData,
    }),
  component: ProgramsView,
});
