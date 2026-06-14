import { createFileRoute } from "@tanstack/react-router";
import { GalleryView } from "../ported/components/views/GalleryView";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Manyang Disability Foundation" },
      { name: "description", content: "Photos from outreach missions, wheelchair distributions, and community events." },
      { property: "og:title", content: "Gallery — Manyang Disability Foundation" },
      { property: "og:url", content: "https://manyangdisabilityfoundation.org/gallery" },
    ],
    links: [{ rel: "canonical", href: "https://manyangdisabilityfoundation.org/gallery" }],
  }),
  component: GalleryView,
});
