import { createFileRoute } from "@tanstack/react-router";
import { DonateView } from "../ported/components/views/DonateView";

export const Route = createFileRoute("/donate")({
  head: () => ({
    meta: [
      { title: "Donate — Manyang Disability Foundation" },
      { name: "description", content: "Fund custom wheelchairs, rehabilitation surgeries, and inclusive classroom tools." },
      { property: "og:title", content: "Donate — Manyang Disability Foundation" },
      { property: "og:url", content: "https://manyangfoundation.lovable.app/donate" },
    ],
    links: [{ rel: "canonical", href: "https://manyangfoundation.lovable.app/donate" }],
  }),
  component: DonateView,
});
