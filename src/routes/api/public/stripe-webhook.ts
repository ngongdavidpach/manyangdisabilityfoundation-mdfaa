import { createFileRoute } from "@tanstack/react-router";

async function alreadyProcessed(supabase: any, eventId: string, eventType: string) {
  const { error } = await supabase
    .from("processed_stripe_events")
    .insert({ event_id: eventId, event_type: eventType });
  // Unique violation => this event was handled before.
  if (error && (error.code === "23505" || `${error.message}`.includes("duplicate"))) return true;
  return false;
}

function centsToAmount(cents: number) {
  return (cents / 100).toFixed(2);
}

async function recordDonation(
  supabase: any,
  row: Record<string, unknown>,
  emailContext: {
    donorEmail: string | null;
    donorName: string | null;
    amountCents: number;
    currency: string;
    frequency: "one-time" | "monthly";
    designation: string | null;
    reference: string | null;
  },
) {
  const { error } = await supabase.from("donations").insert(row);
  if (error) {
    // Duplicate Stripe reference: already recorded, nothing more to do.
    if (error.code === "23505") return;
    console.error("[stripe-webhook] failed to record donation", error.message);
    throw new Error("record_failed");
  }

  if (!emailContext.donorEmail) return;
  const { enqueueTransactionalEmail } = await import("@/lib/email/enqueue.server");
  await enqueueTransactionalEmail({
    templateName: "donation-receipt",
    recipientEmail: emailContext.donorEmail,
    idempotencyKey: `donation-receipt:${emailContext.reference ?? crypto.randomUUID()}`,
    templateData: {
      donorName: emailContext.donorName || "Friend",
      amount: centsToAmount(emailContext.amountCents),
      currency: emailContext.currency,
      frequency: emailContext.frequency,
      designation: emailContext.designation,
      reference: emailContext.reference,
      date: new Date().toLocaleDateString("en-AU", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
  });
}

export const Route = createFileRoute("/api/public/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["STRIPE_WEBHOOK_SECRET"];
        if (!secret) {
          console.error("[stripe-webhook] STRIPE_WEBHOOK_SECRET is not configured");
          return new Response("Not configured", { status: 500 });
        }

        const { verifyStripeSignature } = await import("@/lib/payments/stripe.server");
        const rawBody = await request.text();
        const signature = request.headers.get("stripe-signature");
        if (!verifyStripeSignature(rawBody, signature, secret)) {
          return new Response("Invalid signature", { status: 401 });
        }

        let event: any;
        try {
          event = JSON.parse(rawBody);
        } catch {
          return new Response("Invalid payload", { status: 400 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const supabase: any = supabaseAdmin;

        if (await alreadyProcessed(supabase, event.id, event.type)) {
          return Response.json({ received: true, duplicate: true });
        }

        try {
          switch (event.type) {
            case "checkout.session.completed": {
              const session = event.data.object;
              if (session.mode === "subscription") {
                // Recurring gifts are recorded from invoice.paid so renewals are captured too.
                break;
              }
              if (session.payment_status !== "paid") break;

              const metadata = session.metadata ?? {};
              const isAnonymous = metadata.is_anonymous === "true";
              const donorName = isAnonymous
                ? null
                : metadata.donor_name || session.customer_details?.name || null;
              const donorEmail = session.customer_details?.email || session.customer_email || null;

              await recordDonation(
                supabase,
                {
                  amount_cents: session.amount_total ?? 0,
                  currency: (session.currency ?? "aud").toUpperCase(),
                  method: "stripe",
                  status: "completed",
                  designation: metadata.designation || null,
                  donor_name: donorName,
                  donor_email: donorEmail,
                  is_anonymous: isAnonymous,
                  message: metadata.message || null,
                  received_at: new Date((session.created ?? Date.now() / 1000) * 1000).toISOString(),
                  stripe_session_id: session.id,
                  stripe_payment_intent_id: session.payment_intent || null,
                },
                {
                  donorEmail,
                  donorName,
                  amountCents: session.amount_total ?? 0,
                  currency: (session.currency ?? "aud").toUpperCase(),
                  frequency: "one-time",
                  designation: metadata.designation || null,
                  reference: session.payment_intent || session.id,
                },
              );
              break;
            }

            case "invoice.paid": {
              const invoice = event.data.object;
              if (!invoice.subscription) break;
              const metadata = invoice.subscription_details?.metadata ?? invoice.metadata ?? {};
              const isAnonymous = metadata.is_anonymous === "true";
              const donorName = isAnonymous ? null : metadata.donor_name || invoice.customer_name || null;
              const donorEmail = invoice.customer_email || null;
              const amountCents = invoice.amount_paid ?? 0;
              if (amountCents <= 0) break;

              await recordDonation(
                supabase,
                {
                  amount_cents: amountCents,
                  currency: (invoice.currency ?? "aud").toUpperCase(),
                  method: "stripe",
                  status: "completed",
                  designation: metadata.designation || null,
                  donor_name: donorName,
                  donor_email: donorEmail,
                  is_anonymous: isAnonymous,
                  message: null,
                  received_at: new Date((invoice.created ?? Date.now() / 1000) * 1000).toISOString(),
                  stripe_invoice_id: invoice.id,
                  stripe_subscription_id: invoice.subscription,
                  stripe_payment_intent_id: invoice.payment_intent || null,
                },
                {
                  donorEmail,
                  donorName,
                  amountCents,
                  currency: (invoice.currency ?? "aud").toUpperCase(),
                  frequency: "monthly",
                  designation: metadata.designation || null,
                  reference: invoice.id,
                },
              );
              break;
            }

            case "charge.refunded": {
              const charge = event.data.object;
              if (!charge.payment_intent) break;
              await supabase
                .from("donations")
                .update({ status: "refunded" })
                .eq("stripe_payment_intent_id", charge.payment_intent);
              break;
            }

            case "payment_intent.payment_failed": {
              const intent = event.data.object;
              await supabase
                .from("donations")
                .update({ status: "failed" })
                .eq("stripe_payment_intent_id", intent.id);
              break;
            }

            default:
              break;
          }
        } catch (err) {
          // Let Stripe retry; the event row is removed so the retry isn't skipped.
          await supabase.from("processed_stripe_events").delete().eq("event_id", event.id);
          console.error("[stripe-webhook] handler error", err instanceof Error ? err.message : err);
          return new Response("Handler error", { status: 500 });
        }

        return Response.json({ received: true });
      },
    },
  },
});
