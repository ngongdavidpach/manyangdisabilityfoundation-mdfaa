import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboard } from "../ported/components/views/AdminDashboardView";
import { StaffLoginView } from "../ported/components/views/StaffLoginView";
import { useAuth } from "../ported/contexts/AuthContext";

function AdminRouteComponent() {
  const { isAuthenticated, isLoading, hasRole, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-medium text-slate-500">Restoring secure session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <StaffLoginView />;
  }

  if (!hasRole(["admin"])) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl border border-red-200 p-8 sm:p-12 text-center max-w-md shadow-xs mx-auto">
          <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Hello {user?.fullName?.split(" ")[0] || "friend"}, you are signed in, but your current
            role does not grant permission to view this section.
          </p>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Required clearance: <strong className="text-slate-700">admin</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
}

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
  component: AdminRouteComponent,
});
