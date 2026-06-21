import { createFileRoute } from "@tanstack/react-router";
import { StaffLoginView } from "../ported/components/views/StaffLoginView";

export const Route = createFileRoute("/admin-login")({
  head: () => ({
    meta: [
      { title: "Admin Login — Manyang Disability Foundation" },
      {
        name: "description",
        content: "Secure sign-in for Manyang Disability Foundation staff and administrators.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Login — Manyang Disability Foundation" },
      {
        property: "og:description",
        content: "Secure sign-in for Manyang Disability Foundation staff and administrators.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: StaffLoginView,
});
