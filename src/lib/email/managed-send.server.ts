// Server-only: sends a registered app email through Lovable's managed email
// API, keeping the foundation's own per-category email preferences and the
// email_send_log history. Suppression, retries and unsubscribe are handled by
// Lovable at send time.
import { sendTemplateEmail } from "@/lib/email-templates/send-email";
import { TEMPLATES } from "@/lib/email-templates/registry";

export interface ManagedSendArgs {
  templateName: string;
  recipientEmail?: string;
  templateData?: Record<string, any>;
  idempotencyKey?: string;
  /** Skip the foundation's per-category preference check (direct responses to a user action). */
  bypassPreferences?: boolean;
}

export async function sendManagedEmail(
  args: ManagedSendArgs,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const template = TEMPLATES[args.templateName];
  if (!template) {
    console.error("[sendManagedEmail] unknown template", args.templateName);
    return { ok: false, reason: "unknown_template" };
  }
  const recipient = (template.to || args.recipientEmail || "").trim();
  if (!recipient) return { ok: false, reason: "no_recipient" };

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const normalised = recipient.toLowerCase();

  const log = async (row: { status: string; error_message?: string }) => {
    const { error } = await supabaseAdmin.from("email_send_log").insert({
      message_id: null,
      template_name: args.templateName,
      recipient_email: recipient,
      ...row,
    } as any);
    if (error) console.error("[sendManagedEmail] log write failed", error.code, error.message);
  };

  if (!args.bypassPreferences) {
    const { categoryForTemplate } = await import("@/lib/email/preferences");
    const category = categoryForTemplate(args.templateName);
    if (category) {
      const { data: prefs } = await supabaseAdmin
        .from("email_preferences")
        .select("unsubscribed_all, receipts, events, coordinators, fundraisers, account")
        .eq("email", normalised)
        .maybeSingle();
      if (prefs && (prefs.unsubscribed_all || (prefs as any)[category] === false)) {
        await log({ status: "suppressed", error_message: `category_opted_out:${category}` });
        return { ok: false, reason: "category_opted_out" };
      }
    }
  }

  try {
    const result = await sendTemplateEmail(args.templateName, recipient, {
      templateData: args.templateData,
      idempotencyKey: args.idempotencyKey,
    });
    if (!result.sent) {
      await log({ status: "suppressed" });
      return { ok: false, reason: "suppressed" };
    }
    await log({ status: "sent" });
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[sendManagedEmail] send failed", args.templateName, message);
    await log({ status: "failed", error_message: message });
    return { ok: false, reason: "send_failed" };
  }
}
