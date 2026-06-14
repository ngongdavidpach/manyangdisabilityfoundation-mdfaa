import { createFileRoute } from "@tanstack/react-router";
import { ProgramsView } from "../ported/components/views/ProgramsView";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs — Manyang Disability Foundation" },
      { name: "description", content: "Mobility aids, surgical rehab, inclusive education, livelihood micro-grants, and advocacy." },
      { property: "og:title", content: "Programs — Manyang Disability Foundation" },
      { property: "og:url", content: "https://manyangfoundation.lovable.app/programs" },
    ],
    links: [{ rel: "canonical", href: "https://manyangfoundation.lovable.app/programs" }],
  }),
  component: ProgramsView,
});
