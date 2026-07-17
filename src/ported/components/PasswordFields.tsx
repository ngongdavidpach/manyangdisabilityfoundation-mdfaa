import React, { useState } from "react";
import { Lock, Eye, EyeOff, Check, X } from "lucide-react";
import { getPasswordStrength } from "../utils/auth";

export interface PasswordValidationResult {
  ok: boolean;
  reason?: string;
}

export function validateNewPassword(password: string, confirm: string): PasswordValidationResult {
  if (!password) return { ok: false, reason: "Password is required." };
  const s = getPasswordStrength(password);
  const missing = Object.entries(s.requirements)
    .filter(([, met]) => !met)
    .map(([k]) => k);
  if (missing.length > 0) {
    return { ok: false, reason: "Password does not meet all requirements." };
  }
  if (!confirm) return { ok: false, reason: "Please confirm your password." };
  if (password !== confirm) return { ok: false, reason: "Passwords do not match." };
  return { ok: true };
}

interface PasswordFieldsProps {
  password: string;
  confirm: string;
  onPasswordChange: (v: string) => void;
  onConfirmChange: (v: string) => void;
  passwordLabel?: string;
  confirmLabel?: string;
  autoComplete?: string;
}

const RULE_LABELS: Record<string, string> = {
  length: "At least 8 characters",
  uppercase: "One uppercase letter (A–Z)",
  lowercase: "One lowercase letter (a–z)",
  number: "One number (0–9)",
  special: "One special character (!@#$…)",
};

export const PasswordFields: React.FC<PasswordFieldsProps> = ({
  password,
  confirm,
  onPasswordChange,
  onConfirmChange,
  passwordLabel = "New Password",
  confirmLabel = "Confirm Password",
  autoComplete = "new-password",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [pwTouched, setPwTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  const strength = password ? getPasswordStrength(password) : null;
  const barColor =
    strength?.color === "red"
      ? "bg-red-500 w-1/5"
      : strength?.color === "amber"
        ? "bg-amber-500 w-2/5"
        : strength?.color === "blue"
          ? "bg-blue-500 w-4/5"
          : strength?.color === "emerald"
            ? "bg-emerald-500 w-full"
            : "w-0";

  const confirmMismatch = confirmTouched && confirm.length > 0 && confirm !== password;
  const confirmMatch = confirm.length > 0 && confirm === password;

  return (
    <>
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">{passwordLabel}</label>
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-slate-500">
            <Lock className="w-4 h-4" />
          </span>
          <input
            type={showPassword ? "text" : "password"}
            required
            autoComplete={autoComplete}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            onBlur={() => setPwTouched(true)}
            placeholder="At least 8 characters"
            aria-describedby="password-requirements"
            className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2.5 pl-10 pr-10 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-700"
            aria-label="Toggle password visibility"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {strength && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full transition-all ${barColor}`} />
            </div>
            <span className="text-[11px] text-slate-600 font-semibold">{strength.label}</span>
          </div>
        )}

        {(pwTouched || password.length > 0) && (
          <ul
            id="password-requirements"
            className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1"
          >
            {Object.entries(strength?.requirements ?? {
              length: false,
              uppercase: false,
              lowercase: false,
              number: false,
              special: false,
            }).map(([key, met]) => (
              <li
                key={key}
                className={`flex items-center gap-1.5 text-[11px] ${
                  met ? "text-emerald-600" : "text-slate-500"
                }`}
              >
                {met ? (
                  <Check className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <X className="w-3.5 h-3.5 shrink-0" />
                )}
                <span>{RULE_LABELS[key]}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">{confirmLabel}</label>
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-slate-500">
            <Lock className="w-4 h-4" />
          </span>
          <input
            type={showPassword ? "text" : "password"}
            required
            autoComplete={autoComplete}
            value={confirm}
            onChange={(e) => onConfirmChange(e.target.value)}
            onBlur={() => setConfirmTouched(true)}
            placeholder="Re-enter password"
            aria-invalid={confirmMismatch || undefined}
            className={`w-full bg-slate-50 border rounded-lg py-2.5 pl-10 pr-3 text-xs text-slate-900 focus:outline-hidden focus:ring-2 ${
              confirmMismatch
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : confirmMatch
                  ? "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-100"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
            }`}
          />
        </div>
        {confirmMismatch && (
          <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1">
            <X className="w-3 h-3" />
            Passwords do not match.
          </p>
        )}
        {confirmMatch && (
          <p className="mt-1 text-[11px] text-emerald-600 flex items-center gap-1">
            <Check className="w-3 h-3" />
            Passwords match.
          </p>
        )}
      </div>
    </>
  );
};
