// Server-only: sends an app email from background/system triggers (purge
// jobs, account-deletion flows) through Lovable's managed email delivery.
import { sendManagedEmail } from "@/lib/email/managed-send.server";

export type EnqueueOptions = {
  templateName: string;
  recipientEmail: string;
  templateData?: Record<string, any>;
  idempotencyKey?: string;
  /** Skip the foundation's per-category preference check. Lovable's own
   * suppression (bounces, complaints, unsubscribes) still applies. */
  bypassSuppression?: boolean;
};

export async function enqueueTransactionalEmail(
  opts: EnqueueOptions,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  return sendManagedEmail({
    templateName: opts.templateName,
    recipientEmail: opts.recipientEmail,
    templateData: opts.templateData,
    idempotencyKey: opts.idempotencyKey,
    bypassPreferences: opts.bypassSuppression,
  });
}
