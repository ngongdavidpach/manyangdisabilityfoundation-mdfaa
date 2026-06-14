// Server-only rate-limit helper. Calls the SECURITY DEFINER
// public.check_rate_limit function via the service-role client.
import { getRequestIP } from "@tanstack/react-start/server";

export type RateLimitOptions = {
  bucket: string;
  max: number;
  windowSeconds: number;
  /** Optional explicit key (e.g. user id). Falls back to request IP. */
  key?: string | null;
};

export async function enforceRateLimit(opts: RateLimitOptions): Promise<void> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  let key = opts.key;
  if (!key) {
    try {
      key = getRequestIP({ xForwardedFor: true }) ?? "unknown";
    } catch {
      key = "unknown";
    }
  }
  const { data, error } = await supabaseAdmin.rpc("check_rate_limit", {
    _key: String(key),
    _bucket: opts.bucket,
    _max: opts.max,
    _window_seconds: opts.windowSeconds,
  });
  if (error) {
    // Fail-open on infra error rather than block legitimate users
    console.error("[rateLimit] check_rate_limit error", error);
    return;
  }
  if (data === false) {
    throw new Error("Too many requests. Please try again later.");
  }
}
