// Server-only: sends an app email from public intake flows (contact,
// registration, pledges) through Lovable's managed email delivery.
import { sendManagedEmail } from "@/lib/email/managed-send.server";

export interface EnqueueArgs {
  templateName: string;
  recipientEmail?: string;
  templateData?: Record<string, any>;
  idempotencyKey?: string;
}

export async function enqueueTransactionalEmail(args: EnqueueArgs): Promise<{
  ok: boolean;
  reason?: string;
}> {
  return sendManagedEmail(args);
}
