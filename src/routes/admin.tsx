import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboard } from "../ported/components/views/AdminDashboardView";
import { ProtectedRoute } from "../ported/components/ProtectedRoute";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Console — Manyang Disability Foundation" },
      {
        name: "description",
        content: "Admin dashboard for managing the Manyang Disability Foundation platform.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Console — Manyang Disability Foundation" },
      {
        property: "og:description",
        content: "Admin dashboard for managing the Manyang Disability Foundation platform.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://manyangdisabilityfoundation.org/admin" },
      { property: "og:image", content: "https://manyangdisabilityfoundation.org/images/logo.png" },
    ],
  }),
  component: () => (
    <ProtectedRoute requiredRoles={["admin"]}>
      <AdminDashboard />
    </ProtectedRoute>
  ),
});
