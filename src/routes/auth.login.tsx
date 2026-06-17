import { createFileRoute } from "@tanstack/react-router";
import { LoginView } from "../ported/components/views/LoginView";

type Search = { redirect?: string };

export const Route = createFileRoute("/auth/login")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Contact Us — Manyang Disability Foundation" },
      { name: "description", content: "Send a message to the Manyang Disability Foundation team or sign in as staff." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginView,
});
