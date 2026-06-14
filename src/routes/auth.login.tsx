import { createFileRoute } from "@tanstack/react-router";
import { LoginView } from "../ported/components/views/LoginView";

type Search = { redirect?: string };

export const Route = createFileRoute("/auth/login")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — Manyang Disability Foundation" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginView,
});
