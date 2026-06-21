import React, { useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { lovable } from "@/integrations/lovable/index";

export const StaffLoginView: React.FC = () => {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { redirect?: string };
  const { login, hasAdminAccess } = useAuth();

  const [form, setForm] = useState({ email: "", password: "", rememberMe: true });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setIsProcessing(true);
    (async () => {
      const result = await login(form.email, form.password);
      if (result.success) {
        const dest = search.redirect || (hasAdminAccess() ? "/admin" : "/dashboard");
        navigate({ to: dest });
      } else {
        setError(result.error || "Authentication failed.");
      }
      setIsProcessing(false);
    })();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3 mb-6">
          <img src="/images/logo.png" alt="MDF Logo" className="w-12 h-12 object-contain" />
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">
              Staff Sign In
            </h1>
            <p className="text-xs text-slate-500">Restricted area · Authorized users only</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2.5 pl-10 pr-3 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Enter your password"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2.5 pl-10 pr-10 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={form.rememberMe}
              onChange={(e) => setForm({ ...form, rememberMe: e.target.checked })}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Remember me for 30 days</span>
          </label>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
              <span className="bg-white px-2 text-slate-400">or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={async () => {
              setError("");
              const result = await lovable.auth.signInWithOAuth("apple", {
                redirect_uri: window.location.origin,
              });
              if (result.error) {
                setError("Apple sign-in failed. Please try again.");
              }
            }}
            className="w-full bg-black hover:bg-slate-800 text-white font-semibold py-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
              <path d="M16.365 1.43c0 1.14-.413 2.225-1.24 3.057-.852.86-1.88 1.355-3.005 1.262-.027-1.07.41-2.184 1.21-3.018.832-.86 2.005-1.395 3.035-1.301zM20.78 17.21c-.39.9-.85 1.726-1.39 2.486-.733 1.04-1.336 1.762-1.804 2.165-.722.65-1.498.984-2.327 1.005-.594 0-1.31-.169-2.144-.512-.836-.343-1.604-.512-2.307-.512-.738 0-1.527.17-2.366.512-.84.343-1.516.523-2.034.54-.797.034-1.59-.31-2.38-1.034-.508-.44-1.137-1.189-1.887-2.246-.804-1.124-1.464-2.428-1.98-3.912-.55-1.604-.825-3.158-.825-4.66 0-1.726.373-3.215 1.12-4.466A6.572 6.572 0 0 1 3.7 4.187a6.21 6.21 0 0 1 3.097-.834c.629 0 1.452.195 2.473.577 1.018.384 1.671.578 1.956.578.214 0 .94-.227 2.177-.679 1.169-.42 2.156-.594 2.964-.524 2.187.177 3.832 1.04 4.93 2.595-1.96 1.19-2.93 2.856-2.91 4.99.018 1.66.621 3.04 1.808 4.135.537.51 1.137.904 1.802 1.183-.144.42-.297.823-.46 1.21z" />
            </svg>
            <span>Sign in with Apple</span>
          </button>

          <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>This page is not linked from the public site.</span>
          </div>
        </form>
      </div>
    </div>
  );
};
