import { createMiddleware } from "@tanstack/react-start";
import { requireSupabaseAuth } from "./auth-middleware";

/**
 * Server-side admin authorization guard.
 *
 * Chains after `requireSupabaseAuth` (which validates the bearer token and
 * populates `context.supabase` + `context.userId`) and then consults the
 * SECURITY DEFINER `public.has_role` RPC. Non-admins are rejected before any
 * handler code runs, so admin server functions cannot be executed by client
 * routing bypasses, direct RPC calls, or tampered local auth state.
 *
 * Usage:
 *   createServerFn({ method: "POST" })
 *     .middleware([requireAdmin])
 *     .handler(async ({ context }) => { ... context.userId ... });
 */
export const requireAdmin = createMiddleware({ type: "function" })
  .middleware([requireSupabaseAuth])
  .server(async ({ next, context }) => {
    const ctx = context as { supabase: any; userId: string };
    const { data: isAdmin, error } = await ctx.supabase.rpc("has_role", {
      _user_id: ctx.userId,
      _role: "admin",
    });
    if (error) {
      throw new Error("Forbidden: authorization check failed");
    }
    if (!isAdmin) {
      throw new Error("Forbidden: admin role required");
    }
    return next({ context: { isAdmin: true as const } });
  });
