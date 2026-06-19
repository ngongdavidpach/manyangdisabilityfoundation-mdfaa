import { createFileRoute } from "@tanstack/react-router";
import { RegisterView } from "../ported/components/views/RegisterView";

export const Route = createFileRoute("/auth/register")({
  head: () => ({
    meta: [
      { title: "Create account — Manyang Disability Foundation" },
      {
        name: "description",
        content:
          "Create a new account with Manyang Disability Foundation to request mobility aid support.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Create account — Manyang Disability Foundation" },
      {
        property: "og:description",
        content:
          "Create a new account with Manyang Disability Foundation to request mobility aid support.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://manyangdisabilityfoundation.org/auth/register" },
      { property: "og:image", content: "https://manyangdisabilityfoundation.org/images/logo.png" },
    ],
  }),
  component: RegisterView,
});
