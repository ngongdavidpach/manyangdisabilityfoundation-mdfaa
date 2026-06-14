import { createFileRoute } from "@tanstack/react-router";
import { AboutView } from "../ported/components/views/AboutView";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Manyang Disability Foundation" },
      { name: "description", content: "Our mission, governance, and approach to supporting persons with disabilities." },
      { property: "og:title", content: "About — Manyang Disability Foundation" },
      { property: "og:url", content: "https://manyangdisabilityfoundation.org/about" },
    ],
    links: [{ rel: "canonical", href: "https://manyangdisabilityfoundation.org/about" }],
  }),
  component: AboutView,
});
