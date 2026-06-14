import { createFileRoute } from "@tanstack/react-router";
import { DashboardView } from "../ported/components/views/DashboardView";
import { ProtectedRoute } from "../ported/components/ProtectedRoute";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "My Dashboard — Manyang Disability Foundation" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <ProtectedRoute>
      <DashboardView />
    </ProtectedRoute>
  ),
});
