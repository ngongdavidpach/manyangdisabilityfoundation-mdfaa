import { createClient } from "@supabase/supabase-js";
import { createFileRoute } from "@tanstack/react-router";

const CATEGORIES = ["receipts", "events", "coordinators", "fundraisers", "account"] as const;

function serverClient() {
  const url = import.meta.env.VITE_SUPABASE_URL as string;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  if (!url || !key) return null;
  return createClient<any>(url, key);
}

function defaultPrefs() {
  return {
    receipts: true,
    events: true,
    coordinators: true,
    fundraisers: true,
    account: true,
    unsubscribed_all: false,
  };
}

async function resolveEmail(
  supabase: any,
  request: Request,
  bodyToken?: string,
): Promise<
  | { email: string; source: "token" | "auth"; userId?: string }
  | { error: Response }
> {
  const url = new URL(request.url);
  const token = bodyToken || url.searchParams.get("token");
  if (token) {
    const { data } = await supabase
      .from("email_unsubscribe_tokens")
      .select("email")
      .eq("token", token)
      .maybeSingle();
    if (!data) return { error: Response.json({ error: "Invalid token" }, { status: 404 }) };
    return { email: String(data.email).toLowerCase(), source: "token" };
  }
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return { error: Response.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const jwt = auth.slice("Bearer ".length).trim();
  const { data: userRes, error: authError } = await supabase.auth.getUser(jwt);
  if (authError || !userRes?.user?.email) {
    return { error: Response.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return {
    email: String(userRes.user.email).toLowerCase(),
    source: "auth",
    userId: userRes.user.id,
  };
}

export const Route = createFileRoute("/api/public/email-preferences")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const supabase = serverClient();
        if (!supabase) return Response.json({ error: "Server config error" }, { status: 500 });
        const resolved = await resolveEmail(supabase, request);
        if ("error" in resolved) return resolved.error;
        const { email } = resolved;
        const { data: prefs } = await supabase
          .from("email_preferences")
          .select("receipts, events, coordinators, fundraisers, account, unsubscribed_all")
          .eq("email", email)
          .maybeSingle();
        const { data: suppressed } = await supabase
          .from("suppressed_emails")
          .select("id")
          .eq("email", email)
          .maybeSingle();
        return Response.json({
          email,
          preferences: prefs ?? defaultPrefs(),
          globallySuppressed: !!suppressed,
        });
      },
      POST: async ({ request }) => {
        const supabase = serverClient();
        if (!supabase) return Response.json({ error: "Server config error" }, { status: 500 });
        let body: any = {};
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }
        const resolved = await resolveEmail(supabase, request, body?.token);
        if ("error" in resolved) return resolved.error;
        const { email, source, userId } = resolved;

        const update: Record<string, unknown> = { email };
        for (const c of CATEGORIES) {
          if (typeof body[c] === "boolean") update[c] = body[c];
        }
        if (typeof body.unsubscribed_all === "boolean") {
          update.unsubscribed_all = body.unsubscribed_all;
        }
        if (source === "auth" && userId) update.user_id = userId;

        const { error: upErr } = await supabase
          .from("email_preferences")
          .upsert(update, { onConflict: "email" });
        if (upErr) {
          console.error("email_preferences upsert failed", upErr);
          return Response.json({ error: "Failed to save preferences" }, { status: 500 });
        }

        if (typeof body.unsubscribed_all === "boolean") {
          if (body.unsubscribed_all) {
            await supabase
              .from("suppressed_emails")
              .upsert({ email, reason: "unsubscribe" }, { onConflict: "email" });
          } else {
            await supabase
              .from("suppressed_emails")
              .delete()
              .eq("email", email)
              .eq("reason", "unsubscribe");
          }
        }

        return Response.json({ success: true });
      },
    },
  },
});
