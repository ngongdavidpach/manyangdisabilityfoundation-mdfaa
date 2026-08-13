import { createServerFn } from "@tanstack/react-start";

export type DonationCheckoutInput = {
  amount: number;
  currency?: string;
  frequency: "one-time" | "monthly";
  designation?: string;
  donorName?: string;
  donorEmail?: string;
  isAnonymous?: boolean;
  message?: string;
};

const MIN_CENTS = 200; // AUD 2.00
const MAX_CENTS = 100_000_00; // AUD 100,000

export const createDonationCheckout = createServerFn({ method: "POST" })
  .inputValidator((input: DonationCheckoutInput) => {
    const amountCents = Math.round(Number(input.amount) * 100);
    if (!Number.isInteger(amountCents) || amountCents < MIN_CENTS || amountCents > MAX_CENTS) {
      throw new Error("Please enter an amount between 2 and 100,000.");
    }
    const currency = (input.currency || "AUD").toUpperCase();
    if (!/^[A-Z]{3}$/.test(currency)) throw new Error("Invalid currency.");
    if (input.frequency !== "one-time" && input.frequency !== "monthly") {
      throw new Error("Invalid donation frequency.");
    }
    const email = (input.donorEmail || "").trim();
    if (email && (email.length > 255 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))) {
      throw new Error("Please enter a valid email address.");
    }
    return {
      amountCents,
      currency,
      frequency: input.frequency,
      designation: (input.designation || "").slice(0, 120) || null,
      donorName: (input.donorName || "").slice(0, 120) || null,
      donorEmail: email || null,
      isAnonymous: !!input.isAnonymous,
      message: (input.message || "").slice(0, 400) || null,
    };
  })
  .handler(async ({ data }) => {
    const { getRequest } = await import("@tanstack/react-start/server");
    const { enforceRateLimits } = await import("@/lib/rateLimit.server");
    const { createDonationCheckoutSession } = await import("@/lib/payments/stripe.server");

    await enforceRateLimits([
      { bucket: "stripe-checkout-ip", max: 20, windowSeconds: 3600 },
      ...(data.donorEmail
        ? [
            {
              bucket: "stripe-checkout-email",
              max: 10,
              windowSeconds: 3600,
              key: data.donorEmail.toLowerCase(),
            },
          ]
        : []),
    ]);

    const request = getRequest();
    const origin = new URL(request.url).origin;

    const session = await createDonationCheckoutSession({ ...data, origin });
    if (!session.url) throw new Error("Could not start secure checkout. Please try again.");
    return { url: session.url };
  });

export const getDonationCheckoutResult = createServerFn({ method: "POST" })
  .inputValidator((input: { sessionId: string }) => {
    const sessionId = (input.sessionId || "").trim();
    if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) throw new Error("Invalid checkout reference.");
    return { sessionId };
  })
  .handler(async ({ data }) => {
    const { enforceRateLimit } = await import("@/lib/rateLimit.server");
    await enforceRateLimit({ bucket: "stripe-session-lookup", max: 60, windowSeconds: 3600 });

    const { retrieveCheckoutSession } = await import("@/lib/payments/stripe.server");
    try {
      const session = await retrieveCheckoutSession(data.sessionId);
      return {
        status: (session.payment_status as string) || "unknown",
        amountTotal: (session.amount_total as number) ?? null,
        currency: ((session.currency as string) || "aud").toUpperCase(),
        mode: (session.mode as string) || "payment",
        email: (session.customer_details?.email as string) || null,
      };
    } catch {
      return { status: "unknown", amountTotal: null, currency: "AUD", mode: "payment", email: null };
    }
  });
