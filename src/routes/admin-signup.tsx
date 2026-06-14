import { createFileRoute } from "@tanstack/react-router";
import { AdminSignupView } from "../ported/components/views/AdminSignupView";

export const Route = createFileRoute("/admin-signup")({
  head: () => ({
    meta: [
      { title: "Admin Signup — Manyang Disability Foundation" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminSignupView,
});
