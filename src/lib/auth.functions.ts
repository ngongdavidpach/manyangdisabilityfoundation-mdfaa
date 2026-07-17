import { createServerFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import {
  enforceRateLimit,
  enforceRateLimits,
  RATE_LIMIT_MESSAGE,
} from "@/lib/rateLimit.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export { RATE_LIMIT_MESSAGE };

// Shared password strength schema — MUST match the client-side rules in
// src/ported/utils/auth.ts getPasswordStrength(). Enforced server-side so
// client validation can't be bypassed.
const StrongPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(128, "Password must be at most 128 characters.")
  .regex(/[A-Z]/, "Password must contain an uppercase letter.")
  .regex(/[a-z]/, "Password must contain a lowercase letter.")
  .regex(/[0-9]/, "Password must contain a number.")
  .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain a special character.");

function validateStrength(pw: string): { ok: true } | { ok: false; issues: string[] } {
  const r = StrongPasswordSchema.safeParse(pw);
  if (r.success) return { ok: true };
  return { ok: false, issues: r.error.issues.map((i) => i.message) };
}

function makePublishableClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const EmailSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
  origin: z.string().url().optional(),
});

/**
 * Public server function: request a password-reset email.
 * Rate-limited per lowercased email AND per client IP (both counters always run).
 * Always resolves ok=true regardless of whether the account exists (no enumeration).
 */
export const requestPasswordReset = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailSchema.parse(input))
  .handler(async ({ data }) => {
    try {
      await enforceRateLimits([
        { bucket: "password-reset:email", key: data.email, max: 3, windowSeconds: 600 },
        { bucket: "password-reset:ip", max: 10, windowSeconds: 3600 },
      ]);
    } catch {
      setResponseStatus(429);
      return { ok: false as const, reason: "rate_limited" as const, message: RATE_LIMIT_MESSAGE };
    }

    const supabase = makePublishableClient();
    const origin = data.origin || "https://manyangdisabilityfoundation.org";
    const redirectTo = `${origin.replace(/\/$/, "")}/auth/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(data.email, { redirectTo });
    if (error) {
      console.error("[requestPasswordReset] supabase error", error.message);
    }

    return { ok: true as const };
  });

const CompleteResetSchema = z.object({
  accessToken: z.string().min(10).max(4096),
  refreshToken: z.string().min(10).max(4096),
  newPassword: z.string().min(1).max(200),
});

/**
 * Public server function: complete a password reset using recovery tokens.
 * Enforces strength server-side + per-IP rate limit. On success the client
 * still calls signOut({ scope: "global" }) so all device sessions are killed.
 */
export const completePasswordReset = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => CompleteResetSchema.parse(input))
  .handler(async ({ data }) => {
    try {
      await enforceRateLimits([
        { bucket: "password-reset-complete:ip", max: 20, windowSeconds: 3600 },
      ]);
    } catch {
      setResponseStatus(429);
      return { ok: false as const, reason: "rate_limited" as const, message: RATE_LIMIT_MESSAGE };
    }

    const strength = validateStrength(data.newPassword);
    if (!strength.ok) {
      return { ok: false as const, reason: "weak_password" as const, issues: strength.issues };
    }

    const supabase = makePublishableClient();
    const { error: sessErr } = await supabase.auth.setSession({
      access_token: data.accessToken,
      refresh_token: data.refreshToken,
    });
    if (sessErr) {
      const msg = sessErr.message?.toLowerCase() ?? "";
      const reason = msg.includes("expired") ? ("expired" as const) : ("invalid" as const);
      return { ok: false as const, reason };
    }

    // Per-user cap once we know who this is
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (userId) {
      try {
        await enforceRateLimit({
          bucket: "password-reset-complete:user",
          key: userId,
          max: 5,
          windowSeconds: 900,
        });
      } catch {
        setResponseStatus(429);
        return { ok: false as const, reason: "rate_limited" as const, message: RATE_LIMIT_MESSAGE };
      }
    }

    const { error: updErr } = await supabase.auth.updateUser({ password: data.newPassword });
    if (updErr) {
      const msg = updErr.message?.toLowerCase() ?? "";
      if (msg.includes("expired")) return { ok: false as const, reason: "expired" as const };
      if (msg.includes("invalid") || msg.includes("token")) {
        return { ok: false as const, reason: "invalid" as const };
      }
      return { ok: false as const, reason: "update_failed" as const, message: updErr.message };
    }

    return { ok: true as const };
  });

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: z.string().min(1).max(200),
});

/**
 * Protected server function: change the signed-in user's password.
 * Enforces strength server-side, verifies current password by re-auth, and
 * writes via the admin API. Rate-limited per user id and per IP.
 */
export const changePassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => ChangePasswordSchema.parse(input))
  .handler(async ({ data, context }) => {
    const userId = context.userId;
    try {
      await enforceRateLimits([
        { bucket: "change-password:user", key: userId, max: 5, windowSeconds: 900 },
        { bucket: "change-password:ip", max: 20, windowSeconds: 3600 },
      ]);
    } catch {
      setResponseStatus(429);
      return { ok: false as const, reason: "rate_limited" as const, message: RATE_LIMIT_MESSAGE };
    }

    if (data.currentPassword === data.newPassword) {
      return { ok: false as const, reason: "same_password" as const };
    }

    const strength = validateStrength(data.newPassword);
    if (!strength.ok) {
      return { ok: false as const, reason: "weak_password" as const, issues: strength.issues };
    }

    // Get the caller's email under RLS
    const { data: userData, error: userErr } = await context.supabase.auth.getUser();
    const email = userData?.user?.email;
    if (userErr || !email) {
      return { ok: false as const, reason: "unauthenticated" as const };
    }

    // Verify current password with a fresh client (don't disturb caller session)
    const verifier = makePublishableClient();
    const { error: signInError } = await verifier.auth.signInWithPassword({
      email,
      password: data.currentPassword,
    });
    if (signInError) {
      return { ok: false as const, reason: "wrong_current" as const };
    }
    // Clean up the scratch session
    try {
      await verifier.auth.signOut();
    } catch {
      /* ignore */
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error: updErr } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: data.newPassword,
    });
    if (updErr) {
      return { ok: false as const, reason: "update_failed" as const, message: updErr.message };
    }

    return { ok: true as const };
  });
