import { createFileRoute } from "@tanstack/react-router";
import { StaffLoginView } from "../ported/components/views/StaffLoginView";

type Search = { redirect?: string };

export const Route = createFileRoute("/auth/staff-login")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Staff Sign In — Manyang Disability Foundation" },
      { name: "description", content: "Restricted staff sign-in area." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: StaffLoginView,
});
