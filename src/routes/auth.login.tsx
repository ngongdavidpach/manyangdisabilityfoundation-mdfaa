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
      { property: "og:title", content: "Sign in — Manyang Disability Foundation" },
      { property: "og:description", content: "Sign in to your Manyang Disability Foundation account to manage requests and profile." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://manyangdisabilityfoundation.org/auth/login" },
      { property: "og:image", content: "https://manyangdisabilityfoundation.org/images/logo.png" },
    ],
  }),
  component: LoginView,
});
