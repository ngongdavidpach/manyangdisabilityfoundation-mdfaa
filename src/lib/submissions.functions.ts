import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAdmin } from "@/integrations/supabase/admin-middleware";

export const SUBMISSION_KINDS = [
  "donation_intents",
  "aid_requests",
  "volunteer_applications",
  "partner_inquiries",
  "event_rsvps",
  "contact_messages",
] as const;
export type SubmissionKind = (typeof SUBMISSION_KINDS)[number];

const kindSchema = z.enum(SUBMISSION_KINDS);

export const listSubmissions = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d) =>
    z.object({ kind: kindSchema, page: z.number().int().min(0).max(10000) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const sb = (context as any).supabase;
    const from = data.page * 50;
    const { data: rows, error, count } = await sb
      .from(data.kind)
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, from + 49);
    if (error) throw new Error(error.message);
    return { rows: (rows ?? []) as Record<string, any>[], total: count ?? 0 };
  });

export const countNewSubmissions = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .handler(async ({ context }) => {
    const sb = (context as any).supabase;
    const out: Record<string, number> = {};
    await Promise.all(
      SUBMISSION_KINDS.map(async (k) => {
        const { count } = await sb
          .from(k)
          .select("id", { count: "exact", head: true })
          .in("status", ["new", "pending", "pledged", "submitted", "unread"]);
        out[k] = count ?? 0;
      }),
    );
    return out;
  });

export const updateSubmissionStatus = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d) =>
    z
      .object({
        kind: kindSchema,
        id: z.string().uuid(),
        status: z.string().regex(/^[a-z_]{2,30}$/),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const sb = (context as any).supabase;
    const { error } = await sb.from(data.kind).update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const markPledgeReceived = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const ctx = context as any;
    const sb = ctx.supabase;
    const { data: p, error } = await sb
      .from("donation_intents")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error || !p) throw new Error("Pledge not found");
    if (p.status === "received") throw new Error("Already marked received");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error: insErr } = await supabaseAdmin.from("donations").insert({
      amount_cents: p.amount_cents,
      currency: p.currency,
      method: p.channel === "paypal" ? "other" : p.channel === "momo" ? "mobile_money" : "bank_transfer",
      status: "completed",
      designation: `Pledge ${p.reference}`,
      donor_name: p.donor_name,
      donor_email: p.donor_email,
      is_anonymous: p.is_anonymous,
      message: p.message,
      notes: `From pledge ${p.reference} (${p.channel})`,
      received_at: new Date().toISOString(),
      created_by: ctx.userId,
    });
    if (insErr) throw new Error(insErr.message);
    await sb.from("donation_intents").update({ status: "received" }).eq("id", data.id);
    return { ok: true };
  });
