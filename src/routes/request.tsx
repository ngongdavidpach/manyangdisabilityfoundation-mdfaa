import { createFileRoute } from "@tanstack/react-router";
import { RequestView } from "../ported/components/views/RequestView";
import { ProtectedRoute } from "../ported/components/ProtectedRoute";

export const Route = createFileRoute("/request")({
  head: () => ({
    meta: [
      { title: "Request Mobility Aid — Manyang Disability Foundation" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <ProtectedRoute>
      <RequestView />
    </ProtectedRoute>
  ),
});
