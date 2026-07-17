import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { enforceRateLimit } from "@/lib/rateLimit.server";

const EmailSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email()
    .max(255),
  origin: z.string().url().optional(),
});

/**
 * Public server function: request a password-reset email.
 * Rate-limited per lowercased email and per client IP so the resend button
 * can't be spammed. Always resolves ok=true regardless of whether the
 * account exists (no enumeration).
 */
export const requestPasswordReset = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailSchema.parse(input))
  .handler(async ({ data }) => {
    // Per-email cap: 3 requests per 10 minutes
    try {
      await enforceRateLimit({
        bucket: "password-reset:email",
        key: data.email,
        max: 3,
        windowSeconds: 600,
      });
    } catch {
      return { ok: false, reason: "rate_limited" as const };
    }

    // Per-IP cap: 10 requests per hour (spraying protection)
    try {
      await enforceRateLimit({
        bucket: "password-reset:ip",
        max: 10,
        windowSeconds: 3600,
      });
    } catch {
      return { ok: false, reason: "rate_limited" as const };
    }

    const url = process.env.SUPABASE_URL!;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
    const supabase = createClient(url, key, {
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

    const origin = data.origin || "https://manyangdisabilityfoundation.org";
    const redirectTo = `${origin.replace(/\/$/, "")}/auth/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo,
    });
    if (error) {
      // Log server-side only; still return ok to avoid enumeration
      console.error("[requestPasswordReset] supabase error", error.message);
    }

    return { ok: true as const };
  });
