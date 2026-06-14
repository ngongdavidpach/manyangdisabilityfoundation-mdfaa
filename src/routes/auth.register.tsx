import { createFileRoute } from "@tanstack/react-router";
import { RegisterView } from "../ported/components/views/RegisterView";

export const Route = createFileRoute("/auth/register")({
  head: () => ({
    meta: [
      { title: "Create account — Manyang Disability Foundation" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RegisterView,
});
