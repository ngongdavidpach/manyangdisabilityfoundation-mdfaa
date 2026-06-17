import React, { useEffect } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "../contexts/AuthContext";
import type { UserRole } from "../types/auth";
import { Lock, AlertTriangle, LogIn } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles }) => {
  const { isAuthenticated, isLoading, hasRole, user } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: "/auth/login", search: { redirect: pathname } });
    }
  }, [isLoading, isAuthenticated, navigate, pathname]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-medium text-slate-500">Restoring secure session...</p>
        </div>
      </div>
    );
  }

  if (requiredRoles && requiredRoles.length > 0 && !hasRole(requiredRoles)) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl border border-red-200 p-8 sm:p-12 text-center max-w-md shadow-xs mx-auto">
          <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Hello {user?.fullName?.split(" ")[0] || "friend"}, you are signed in, but your current
            role does not grant permission to view this section.
          </p>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Required clearance:{" "}
              <strong className="text-slate-700">{requiredRoles.join(" or ")}</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export const AuthenticationGate: React.FC<{
  title?: string;
  description?: string;
  onLoginClick: () => void;
  onRegisterClick: () => void;
}> = ({
  title = "Authentication Required",
  description = "Please sign in or create a free account to access this feature and securely track your submissions.",
  onLoginClick,
  onRegisterClick,
}) => (
  <div className="bg-white rounded-2xl border border-blue-100 p-8 sm:p-10 text-center space-y-4 shadow-xs">
    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
      <Lock className="w-6 h-6" />
    </div>
    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
    <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">{description}</p>
    <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2 max-w-xs mx-auto">
      <button
        onClick={onLoginClick}
        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
      >
        <LogIn className="w-4 h-4" />
        <span>Sign In</span>
      </button>
      <button
        onClick={onRegisterClick}
        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-lg text-xs transition-colors"
      >
        Create Account
      </button>
    </div>
  </div>
);
