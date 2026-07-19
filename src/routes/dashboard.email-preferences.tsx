import { createFileRoute, Link } from "@tanstack/react-router";
import { ProtectedRoute } from "../ported/components/ProtectedRoute";
import { EmailPreferencesPanel } from "../ported/components/EmailPreferencesPanel";

function Page() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link to="/dashboard" className="text-sm text-blue-700 hover:underline">
          ← Back to dashboard
        </Link>
        <div className="mt-3 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Email preferences</h1>
          <p className="mt-2 text-sm text-slate-600">
            Choose which emails you'd like to receive. Account-security emails
            (sign-in, password reset, invites) cannot be turned off while your account
            exists — deleting your account is the way to stop them.
          </p>
          <div className="mt-6">
            <EmailPreferencesPanel mode="auth" />
          </div>
          <p className="mt-6 text-xs text-slate-500">
            See our{" "}
            <Link to="/privacy/emails" className="underline hover:text-slate-700">
              email privacy addendum
            </Link>{" "}
            for details on how these categories are used. You can review your recent
            changes on the{" "}
            <Link to="/dashboard/activity" className="underline hover:text-slate-700">
              account activity
            </Link>{" "}
            page.
          </p>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/dashboard/email-preferences")({
  head: () => ({
    meta: [
      { title: "Email preferences — Manyang Disability Foundation" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <ProtectedRoute>
      <Page />
    </ProtectedRoute>
  ),
});
