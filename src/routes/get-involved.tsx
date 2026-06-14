import { createFileRoute } from "@tanstack/react-router";
import { GetInvolvedView } from "../ported/components/views/GetInvolvedView";

export const Route = createFileRoute("/get-involved")({
  head: () => ({
    meta: [
      { title: "Get Involved — Manyang Disability Foundation" },
      { name: "description", content: "Volunteer, partner, fundraise, or join an outreach mission with the foundation." },
      { property: "og:title", content: "Get Involved — Manyang Disability Foundation" },
      { property: "og:url", content: "https://manyangfoundation.lovable.app/get-involved" },
    ],
    links: [{ rel: "canonical", href: "https://manyangfoundation.lovable.app/get-involved" }],
  }),
  component: GetInvolvedView,
});
