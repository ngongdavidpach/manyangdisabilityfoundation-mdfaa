import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import {
  Lock,
  Eye,
  EyeOff,
  Mail,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { deleteAccount, RATE_LIMIT_MESSAGE } from "@/lib/auth.functions";

export const Route = createFileRoute("/auth/delete-account")({
  head: () => ({
    meta: [
      { title: "Delete Account — Manyang Disability Foundation" },
      { name: "description", content: "Permanently delete your MDF staff account." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: DeleteAccountRoute,
});

type Status = "checking" | "unauthenticated" | "ready" | "success";

function DeleteAccountRoute() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const deleteFn = useServerFn(deleteAccount);

  const [status, setStatus] = useState<Status>("checking");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        setEmail(data.user.email);
        setStatus("ready");
      } else {
        setStatus("unauthenticated");
      }
    });
  }, []);

  const emailMatches =
    confirmEmail.trim().length > 0 &&
    confirmEmail.trim().toLowerCase() === email.toLowerCase();
  const canSubmit =
    emailMatches && currentPassword.length > 0 && acknowledged && !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!canSubmit) return;

    setSubmitting(true);
    let result: Awaited<ReturnType<typeof deleteFn>>;
    try {
      result = await deleteFn({
        data: {
          currentPassword,
          confirmEmail: confirmEmail.trim().toLowerCase(),
        },
      });
    } catch {
      setError("Could not delete the account. Please try again.");
      setSubmitting(false);
      return;
    }

    if (!result.ok) {
      switch (result.reason) {
        case "wrong_password":
          setError("Current password is incorrect.");
          break;
        case "wrong_email":
          setError("The email you typed doesn't match your account email.");
          break;
        case "rate_limited":
          setError(result.message || RATE_LIMIT_MESSAGE);
          break;
        case "last_admin":
          setError(
            "You are the last administrator on this account. Assign another admin before deleting your account.",
          );
          break;
        case "unauthenticated":
          setStatus("unauthenticated");
          break;
        default:
          setError(
            ("message" in result && result.message) || "Could not delete the account.",
          );
      }
      setSubmitting(false);
      return;
    }

    // Success — tear down all client-side state and go home
    await queryClient.cancelQueries();
    queryClient.clear();
    try {
      await supabase.auth.signOut({ scope: "global" });
    } catch {
      /* session may already be gone */
    }
    setStatus("success");
    setSubmitting(false);
    setTimeout(() => navigate({ to: "/", replace: true }), 2500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-red-600" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">Delete account</h1>
            <p className="text-xs text-slate-500">
              {email ? `Signed in as ${email}` : "Permanently remove your account."}
            </p>
          </div>
        </div>

        {status === "checking" && (
          <div className="flex items-center justify-center py-8 gap-2 text-slate-500 text-xs">
            <div className="w-4 h-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
            <span>Loading…</span>
          </div>
        )}

        {status === "unauthenticated" && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
              <span>You need to be signed in to delete your account.</span>
            </div>
            <Link
              to="/admin"
              className="block text-center w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-sm transition-colors"
            >
              Go to sign in
            </Link>
          </div>
        )}

        {status === "success" && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-lg flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <span>Your account has been permanently deleted. Redirecting…</span>
          </div>
        )}

        {status === "ready" && (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div
              className="bg-red-50 border border-red-200 text-red-800 text-xs p-3 rounded-lg space-y-1"
              role="alert"
            >
              <p className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                This cannot be undone.
              </p>
              <ul className="list-disc pl-5 space-y-0.5 text-red-700">
                <li>Your sign-in credentials will be removed.</li>
                <li>Your staff profile and role assignments will be deleted.</li>
                <li>You will be signed out of every device.</li>
              </ul>
            </div>

            {error && (
              <div
                className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg flex items-start gap-2"
                role="alert"
              >
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="confirm-email"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                Type your email to confirm
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500" aria-hidden="true">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="confirm-email"
                  type="email"
                  required
                  autoComplete="off"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  placeholder={email}
                  aria-invalid={
                    confirmEmail.length > 0 && !emailMatches ? true : undefined
                  }
                  className={`w-full bg-slate-50 border rounded-lg py-2.5 pl-10 pr-3 text-xs text-slate-900 focus:outline-hidden focus:ring-2 ${
                    confirmEmail.length > 0 && !emailMatches
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                      : emailMatches
                        ? "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-100"
                        : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="current-password"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                Current password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500" aria-hidden="true">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="current-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2.5 pl-10 pr-10 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Eye className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
              />
              <span>
                I understand this is <strong>permanent</strong> and cannot be reversed.
              </span>
            </label>

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Deleting…</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                  <span>Permanently delete my account</span>
                </>
              )}
            </button>

            <Link
              to="/auth/change-password"
              className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-700"
            >
              <ArrowLeft className="w-3 h-3" aria-hidden="true" />
              Back to account settings
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
