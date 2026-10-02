import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireStaffOrAdmin } from "@/integrations/supabase/admin-middleware";

export const ABN = "75 986 228 179";

export type PledgeReceipt = {
  reference: string;
  receiptNumber: number | null;
  received: boolean;
  receivedAt: string | null;
  pledgedAt: string;
  donorName: string;
  donorEmail: string;
  donorCountry: string;
  amount: string;
  channel: string;
  message: string;
  org: { name: string; abn: string; address: string; email: string; phone: string };
};

const CHANNELS: Record<string, string> = { bank_transfer: "Bank transfer", payid: "PayID", paypal: "PayPal", momo: "Mobile money" };

async function loadReceipt(reference: string): Promise<PledgeReceipt> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: p } = await supabaseAdmin.from("donation_intents").select("*").eq("reference", reference).maybeSingle();
  if (!p) throw new Error("Pledge not found");
  const { data: d } = await supabaseAdmin
    .from("donations").select("receipt_number, received_at")
    .eq("designation", `Pledge ${reference}`).order("created_at").limit(1).maybeSingle();
  const { data: footer } = await supabaseAdmin.from("page_settings").select("content").eq("page_key", "footer").maybeSingle();
  const f = (footer?.content ?? {}) as Record<string, any>;
  const received = p.status === "received";
  return {
    reference: p.reference,
    receiptNumber: received ? (d?.receipt_number ?? null) : null,
    received,
    receivedAt: received ? (d?.received_at ?? p.updated_at) : null,
    pledgedAt: p.created_at,
    donorName: p.is_anonymous ? "Anonymous" : p.donor_name || "—",
    donorEmail: p.is_anonymous ? "—" : p.donor_email || "—",
    donorCountry: p.donor_country || "—",
    amount: `${p.currency} ${(p.amount_cents / 100).toLocaleString("en-AU", { minimumFractionDigits: 2 })}`,
    channel: CHANNELS[p.channel] ?? p.channel,
    message: p.message || "",
    org: {
      name: "Manyang Disability Foundation",
      abn: ABN,
      address: f.address || "Sydney, NSW, Australia",
      email: f.email || "info@manyangfoundation.org",
      phone: f.phone || "+61 400 000 000",
    },
  };
}

const Ref = z.object({ reference: z.string().min(1).max(64) });

export const getPledgeReceipt = createServerFn({ method: "POST" })
  .middleware([requireStaffOrAdmin])
  .inputValidator((d) => Ref.parse(d))
  .handler(async ({ data }) => loadReceipt(data.reference));

const date = (s: string | null) => (s ? new Date(s).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" }) : "—");

export const downloadPledgeReceiptPdf = createServerFn({ method: "POST" })
  .middleware([requireStaffOrAdmin])
  .inputValidator((d) => Ref.parse(d))
  .handler(async ({ data }) => {
    const r = await loadReceipt(data.reference);
    const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
    const pdf = await PDFDocument.create();
    const page = pdf.addPage([595, 842]);
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
    const ascii = (s: string) => s.replace(/[–—]/g, "-").replace(/[^\x20-\x7E]/g, "");
    const draw = (t: string, x: number, y: number, size = 10, f = font, color = rgb(0.15, 0.15, 0.15)) =>
      page.drawText(ascii(t), { x, y, size, font: f, color });
    const blue = rgb(0.12, 0.25, 0.69);

    let logoW = 0;
    try {
      const origin = new URL(getRequest().url).origin;
      const res = await fetch(`${origin}/images/logo.png`);
      if (res.ok) {
        const img = await pdf.embedPng(new Uint8Array(await res.arrayBuffer()));
        const s = 60 / img.height;
        logoW = img.width * s;
        page.drawImage(img, { x: 50, y: 752, width: logoW, height: 60 });
      }
    } catch { /* logo optional */ }
    const tx = 50 + (logoW ? logoW + 14 : 0);
    draw(r.org.name, tx, 795, 16, bold, blue);
    draw(`ABN ${r.org.abn}`, tx, 778, 9);
    draw(r.org.address, tx, 765, 9);
    draw(`${r.org.email}  |  ${r.org.phone}`, tx, 752, 9);
    page.drawLine({ start: { x: 50, y: 735 }, end: { x: 545, y: 735 }, thickness: 1, color: blue });

    draw(r.received ? "OFFICIAL DONATION RECEIPT" : "PLEDGE ACKNOWLEDGEMENT", 50, 705, 15, bold);
    const stamp = r.received ? "RECEIVED" : "PLEDGED - PAYMENT PENDING";
    const stampColor = r.received ? rgb(0.1, 0.5, 0.25) : rgb(0.75, 0.45, 0.05);
    const sw = bold.widthOfTextAtSize(stamp, 10) + 16;
    page.drawRectangle({ x: 545 - sw, y: 700, width: sw, height: 20, borderColor: stampColor, borderWidth: 1.5 });
    draw(stamp, 553 - sw, 706, 10, bold, stampColor);

    let y = 665;
    const row = (l: string, v: string) => { draw(l, 50, y, 10, bold); draw(v, 200, y, 10); y -= 22; };
    if (r.received) row("Receipt number", r.receiptNumber ? `#${r.receiptNumber}` : "—");
    row("Issue date", date(new Date().toISOString()));
    row("Pledge reference", r.reference);
    row("Donor", r.donorName);
    row("Email", r.donorEmail);
    row("Country", r.donorCountry);
    row("Amount", r.amount);
    row("Payment method", r.channel);
    row("Pledge date", date(r.pledgedAt));
    if (r.received) row("Payment received", date(r.receivedAt));
    if (r.message) row("Message", r.message.slice(0, 70));

    y -= 15;
    draw("Thank you for your generous support of people living with disability.", 50, y, 11, bold, rgb(0.1, 0.45, 0.25));
    draw(r.received
      ? "This receipt confirms the foundation has received the donation above. Please keep it for your records."
      : "This acknowledges a pledge only. It is not a receipt of payment.", 50, y - 18, 9);

    const bytes = await pdf.save();
    let bin = "";
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return { filename: `receipt-${r.reference}.pdf`, base64: btoa(bin) };
  });
