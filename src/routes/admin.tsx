import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboard } from "../ported/components/views/AdminDashboardView";
import { ProtectedRoute } from "../ported/components/ProtectedRoute";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Console — Manyang Disability Foundation" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <ProtectedRoute requiredRoles={["admin"]}>
      <AdminDashboard />
    </ProtectedRoute>
  ),
});
