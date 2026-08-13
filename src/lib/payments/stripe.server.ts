// Server-only Stripe helpers. Uses the Stripe REST API directly over fetch so
// nothing depends on Node-only SDK internals in the Worker runtime.
import { createHmac, timingSafeEqual } from "node:crypto";

const STRIPE_API = "https://api.stripe.com/v1";

function secretKey(): string {
  const key = process.env["STRIPE_SECRET_KEY"];
  if (!key) throw new Error("Stripe is not configured");
  return key;
}

/** Flattens nested objects/arrays into Stripe's bracketed form-encoding. */
function encodeForm(obj: Record<string, unknown>, prefix = "", out?: URLSearchParams) {
  const params = out ?? new URLSearchParams();
  for (const [rawKey, value] of Object.entries(obj)) {
    if (value === undefined || value === null || value === "") continue;
    const key = prefix ? `${prefix}[${rawKey}]` : rawKey;
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item && typeof item === "object") {
          encodeForm(item as Record<string, unknown>, `${key}[${index}]`, params);
        } else {
          params.append(`${key}[${index}]`, String(item));
        }
      });
    } else if (typeof value === "object") {
      encodeForm(value as Record<string, unknown>, key, params);
    } else {
      params.append(key, String(value));
    }
  }
  return params;
}

async function stripeRequest<T = any>(
  path: string,
  init?: { method?: "GET" | "POST"; body?: Record<string, unknown>; idempotencyKey?: string },
): Promise<T> {
  const method = init?.method ?? "GET";
  const headers: Record<string, string> = {
    Authorization: `Bearer ${secretKey()}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };
  if (init?.idempotencyKey) headers["Idempotency-Key"] = init.idempotencyKey;

  const body = init?.body ? encodeForm(init.body).toString() : undefined;
  const url = method === "GET" && body ? `${STRIPE_API}${path}?${body}` : `${STRIPE_API}${path}`;

  const response = await fetch(url, {
    method,
    headers,
    body: method === "POST" ? body : undefined,
  });

  const text = await response.text();
  if (!response.ok) {
    console.error(`Stripe request failed [${response.status}] ${path}: ${text}`);
    throw new Error("Payment provider request failed. Please try again.");
  }
  return JSON.parse(text) as T;
}

export type CheckoutInput = {
  amountCents: number;
  currency: string;
  frequency: "one-time" | "monthly";
  designation?: string | null;
  donorName?: string | null;
  donorEmail?: string | null;
  isAnonymous: boolean;
  message?: string | null;
  origin: string;
};

export async function createDonationCheckoutSession(input: CheckoutInput) {
  const recurring = input.frequency === "monthly";
  const productName = recurring
    ? "Monthly donation — Manyang Disability Foundation"
    : "Donation — Manyang Disability Foundation";

  const session = await stripeRequest<{ id: string; url: string }>("/checkout/sessions", {
    method: "POST",
    body: {
      mode: recurring ? "subscription" : "payment",
      success_url: `${input.origin}/donation-complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${input.origin}/donate?checkout=cancelled`,
      submit_type: recurring ? undefined : "donate",
      customer_email: input.donorEmail || undefined,
      allow_promotion_codes: undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: input.currency.toLowerCase(),
            unit_amount: input.amountCents,
            product_data: {
              name: productName,
              description: input.designation
                ? `Designation: ${input.designation}`
                : "Mobility aids, rehabilitation and inclusive education",
            },
            ...(recurring ? { recurring: { interval: "month" } } : {}),
          },
        },
      ],
      metadata: {
        donation: "true",
        designation: input.designation || "",
        donor_name: input.isAnonymous ? "" : input.donorName || "",
        is_anonymous: input.isAnonymous ? "true" : "false",
        message: (input.message || "").slice(0, 400),
      },
      ...(recurring
        ? {
            subscription_data: {
              metadata: {
                donation: "true",
                designation: input.designation || "",
                donor_name: input.isAnonymous ? "" : input.donorName || "",
                is_anonymous: input.isAnonymous ? "true" : "false",
              },
            },
          }
        : {}),
    },
  });

  return { id: session.id, url: session.url };
}

export async function retrieveCheckoutSession(sessionId: string) {
  return stripeRequest<any>(`/checkout/sessions/${encodeURIComponent(sessionId)}`);
}

/**
 * Verifies a Stripe webhook signature (scheme v1) against the raw request body.
 * Returns false on any malformed header, bad digest, or stale timestamp.
 */
export function verifyStripeSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
  toleranceSeconds = 300,
): boolean {
  if (!signatureHeader) return false;

  let timestamp = "";
  const signatures: string[] = [];
  for (const part of signatureHeader.split(",")) {
    const [key, value] = part.trim().split("=");
    if (key === "t") timestamp = value ?? "";
    else if (key === "v1" && value) signatures.push(value);
  }
  if (!timestamp || signatures.length === 0) return false;

  const age = Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp));
  if (!Number.isFinite(age) || age > toleranceSeconds) return false;

  const expected = createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex");
  const expectedBuf = Buffer.from(expected, "utf8");

  return signatures.some((candidate) => {
    const candidateBuf = Buffer.from(candidate, "utf8");
    if (candidateBuf.length !== expectedBuf.length) return false;
    return timingSafeEqual(candidateBuf, expectedBuf);
  });
}

export { stripeRequest };
