import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { enforceRateLimit } from "@/lib/rateLimit.server";

const str = (max: number) => z.string().trim().max(max);
const optStr = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .nullable()
    .transform((v) => (v ? v : null));

// ---------- aid_requests ----------
const aidRequestSchema = z.object({
  fullName: str(120).min(1),
  age: z
    .union([z.string(), z.number()])
    .transform((v) => (v === "" || v == null ? null : Number(v)))
    .pipe(z.number().int().min(0).max(130).nullable()),
  gender: optStr(40),
  country: optStr(80),
  city: optStr(120),
  phone: optStr(40),
  email: z
    .string()
    .trim()
    .max(255)
    .email()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  isCaregiver: optStr(20),
  caregiverName: optStr(120),
  disabilityCategory: optStr(60),
  requestedAid: optStr(60),
  hasExistingDevice: optStr(10),
  deviceCondition: optStr(500),
  urgencyLevel: optStr(20),
  story: str(4000).min(30),
});

export const submitAidRequest = createServerFn({ method: "POST" })
  .inputValidator((data: z.input<typeof aidRequestSchema>) => aidRequestSchema.parse(data))
  .handler(async ({ data }) => {
    await enforceRateLimit({ bucket: "aid-request", max: 5, windowSeconds: 3600 });
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const year = new Date().getFullYear();
    const rand = Math.floor(100000 + Math.random() * 900000);
    const tracking_code = `MDF-AID-${year}-${rand}`;
    const { error } = await supabaseAdmin.from("aid_requests").insert({
      tracking_code,
      full_name: data.fullName,
      age: data.age,
      gender: data.gender,
      country: data.country,
      city: data.city,
      phone: data.phone,
      email: data.email ?? null,
      is_caregiver: data.isCaregiver,
      caregiver_name: data.caregiverName,
      disability_category: data.disabilityCategory,
      requested_aid: data.requestedAid,
      has_existing_device: data.hasExistingDevice,
      device_condition: data.deviceCondition,
      urgency_level: data.urgencyLevel,
      story: data.story,
    });
    if (error) {
      console.error("[submitAidRequest]", error);
      throw new Error("Unable to submit your request. Please try again later.");
    }
    return { tracking_code };
  });

// ---------- event_rsvps ----------
const rsvpSchema = z.object({
  eventExternalId: optStr(80),
  eventTitle: str(200).min(1),
  fullName: str(120).min(1),
  email: z.string().trim().max(255).email(),
  phone: optStr(40),
});

export const submitEventRsvp = createServerFn({ method: "POST" })
  .inputValidator((data: z.input<typeof rsvpSchema>) => rsvpSchema.parse(data))
  .handler(async ({ data }) => {
    await enforceRateLimit({ bucket: "event-rsvp", max: 10, windowSeconds: 3600 });
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("event_rsvps").insert({
      event_external_id: data.eventExternalId,
      event_title: data.eventTitle,
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
    });
    if (error) {
      console.error("[submitEventRsvp]", error);
      throw new Error("Unable to record your RSVP. Please try again later.");
    }
    return { ok: true };
  });

// ---------- volunteer_applications ----------
const volunteerSchema = z.object({
  fullName: str(120).min(1),
  email: z.string().trim().max(255).email(),
  phone: optStr(40),
  country: optStr(80),
  city: optStr(120),
  skills: z.array(z.string().trim().max(40)).max(20).default([]),
  availability: optStr(40),
  message: optStr(1000),
});

export const submitVolunteerApplication = createServerFn({ method: "POST" })
  .inputValidator((data: z.input<typeof volunteerSchema>) => volunteerSchema.parse(data))
  .handler(async ({ data }) => {
    await enforceRateLimit({ bucket: "volunteer-app", max: 5, windowSeconds: 3600 });
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("volunteer_applications").insert({
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      country: data.country,
      city: data.city,
      skills: data.skills,
      availability: data.availability,
      message: data.message,
    });
    if (error) {
      console.error("[submitVolunteerApplication]", error);
      throw new Error("Unable to submit your application. Please try again later.");
    }
    return { ok: true };
  });

// ---------- partner_inquiries ----------
const partnerSchema = z.object({
  orgName: str(200).min(1),
  contactPerson: str(120).min(1),
  email: z.string().trim().max(255).email(),
  phone: optStr(40),
  orgType: optStr(40),
  partnershipType: optStr(40),
  message: optStr(2000),
});

export const submitPartnerInquiry = createServerFn({ method: "POST" })
  .inputValidator((data: z.input<typeof partnerSchema>) => partnerSchema.parse(data))
  .handler(async ({ data }) => {
    await enforceRateLimit({ bucket: "partner-inq", max: 5, windowSeconds: 3600 });
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("partner_inquiries").insert({
      org_name: data.orgName,
      contact_person: data.contactPerson,
      email: data.email,
      phone: data.phone,
      org_type: data.orgType,
      partnership_type: data.partnershipType,
      message: data.message,
    });
    if (error) {
      console.error("[submitPartnerInquiry]", error);
      throw new Error("Unable to submit your inquiry. Please try again later.");
    }
    return { ok: true };
  });

// ---------- donation_intents ----------
const donationIntentSchema = z.object({
  donorName: optStr(120),
  donorEmail: z
    .string()
    .trim()
    .max(255)
    .email()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  donorPhone: optStr(40),
  donorCountry: optStr(80),
  isAnonymous: z.boolean().default(false),
  amount: z.number().positive().max(1_000_000),
  currency: z
    .string()
    .trim()
    .regex(/^[A-Z]{3}$/)
    .default("USD"),
  frequency: z.enum(["one-time", "monthly"]).default("one-time"),
  channel: z.enum(["bank", "momo", "paypal"]),
  message: optStr(1000),
});

export const submitDonationIntent = createServerFn({ method: "POST" })
  .inputValidator((data: z.input<typeof donationIntentSchema>) => donationIntentSchema.parse(data))
  .handler(async ({ data }) => {
    await enforceRateLimit({ bucket: "donation-intent", max: 10, windowSeconds: 3600 });
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const year = new Date().getFullYear();
    const rand = Math.floor(1000000 + Math.random() * 9000000);
    const reference = `MDF-PLEDGE-${year}-${rand}`;
    const { error } = await supabaseAdmin.from("donation_intents").insert({
      reference,
      donor_name: data.isAnonymous ? null : data.donorName,
      donor_email: data.donorEmail ?? null,
      donor_phone: data.donorPhone,
      donor_country: data.donorCountry,
      is_anonymous: data.isAnonymous,
      amount_cents: Math.round(data.amount * 100),
      currency: data.currency,
      frequency: data.frequency,
      channel: data.channel,
      message: data.message,
    });
    if (error) {
      console.error("[submitDonationIntent]", error);
      throw new Error("Unable to record your pledge. Please try again later.");
    }
    return { reference };
  });
