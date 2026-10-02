import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { useAuth } from "../ported/contexts/AuthContext";
import { StaffLoginView } from "../ported/components/views/StaffLoginView";
import { getPledgeReceipt, downloadPledgeReceiptPdf } from "../lib/pledgeReceipts.functions";

export const Route = createFileRoute("/receipts/$reference")({
  head: () => ({
    meta: [
      { title: "Donation Receipt — Manyang Disability Foundation" },
      { name: "description", content: "Staff view of an official donation receipt." },
      { property: "og:title", content: "Donation Receipt — Manyang Disability Foundation" },
      { property: "og:description", content: "Staff view of an official donation receipt." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ReceiptPage,
});

const date = (s: string | null) => (s ? new Date(s).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" }) : "—");

function ReceiptPage() {
  const { reference } = Route.useParams();
  const { isAuthenticated, isLoading } = useAuth();
  const get = useServerFn(getPledgeReceipt);
  const dl = useServerFn(downloadPledgeReceiptPdf);
  const [busy, setBusy] = useState(false);
  const q = useQuery({ queryKey: ["receipt", reference], queryFn: () => get({ data: { reference } }), enabled: isAuthenticated, retry: false });

  if (isLoading) return <p className="p-10 text-center text-sm">Loading…</p>;
  if (!isAuthenticated) return <StaffLoginView />;
  if (q.isLoading) return <p className="p-10 text-center text-sm">Loading receipt…</p>;
  if (q.isError || !q.data) return <p className="p-10 text-center text-sm text-red-700">This receipt couldn't be opened. You need staff access and a valid pledge reference.</p>;
  const r = q.data;

  const download = async () => {
    setBusy(true);
    try {
      const { filename, base64 } = await dl({ data: { reference } });
      const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
      const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
      URL.revokeObjectURL(url);
    } catch { alert("Couldn't create the PDF. Please try again."); }
    finally { setBusy(false); }
  };

  const rows: [string, string][] = [
    ...(r.received ? [["Receipt number", r.receiptNumber ? `#${r.receiptNumber}` : "—"] as [string, string]] : []),
    ["Issue date", date(new Date().toISOString())],
    ["Pledge reference", r.reference],
    ["Donor", r.donorName], ["Email", r.donorEmail], ["Country", r.donorCountry],
    ["Amount", r.amount], ["Payment method", r.channel], ["Pledge date", date(r.pledgedAt)],
    ...(r.received ? [["Payment received", date(r.receivedAt)] as [string, string]] : []),
    ...(r.message ? [["Message", r.message] as [string, string]] : []),
  ];

  return (
    <div className="bg-slate-100 min-h-screen py-8 print:bg-white print:py-0">
      <div className="max-w-2xl mx-auto mb-4 flex gap-2 justify-end px-4 print:hidden">
        <Link to="/admin" className="mr-auto text-sm text-blue-700 underline self-center">← Back to admin</Link>
        <button onClick={() => window.print()} className="border border-slate-300 bg-white text-sm px-4 py-2 rounded-md">Print</button>
        <button onClick={download} disabled={busy} className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md disabled:opacity-60">{busy ? "Preparing…" : "Download PDF"}</button>
      </div>
      <article className="max-w-2xl mx-auto bg-white shadow-sm print:shadow-none p-10 text-slate-800">
        <header className="flex items-center gap-4 border-b-2 border-blue-700 pb-4">
          <img src="/images/logo.png" alt="Manyang Disability Foundation logo" className="h-16 w-auto" />
          <div className="text-xs leading-5">
            <h1 className="text-lg font-bold text-blue-800">{r.org.name}</h1>
            <p>ABN {r.org.abn}</p><p>{r.org.address}</p><p>{r.org.email} | {r.org.phone}</p>
          </div>
        </header>
        <div className="flex items-center justify-between mt-6">
          <h2 className="text-xl font-bold">{r.received ? "Official Donation Receipt" : "Pledge Acknowledgement"}</h2>
          <span className={`border-2 px-3 py-1 text-xs font-bold ${r.received ? "border-emerald-700 text-emerald-700" : "border-amber-600 text-amber-700"}`}>
            {r.received ? "RECEIVED" : "PLEDGED – PAYMENT PENDING"}
          </span>
        </div>
        <dl className="mt-6 divide-y divide-slate-100 text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[160px_1fr] py-2"><dt className="font-semibold">{k}</dt><dd className="break-words">{v}</dd></div>
          ))}
        </dl>
        <p className="mt-8 font-semibold text-emerald-800">Thank you for your generous support of people living with disability.</p>
        <p className="text-xs text-slate-600 mt-1">
          {r.received ? "This receipt confirms the foundation has received the donation above. Please keep it for your records." : "This acknowledges a pledge only. It is not a receipt of payment."}
        </p>
      </article>
    </div>
  );
}
