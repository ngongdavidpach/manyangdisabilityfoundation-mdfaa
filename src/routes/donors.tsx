import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { listPublicDonors } from "@/lib/publicContent.functions";
import { buildListPdf } from "@/lib/listPdf";
import { downloadBlob } from "@/lib/fieldReportsPdf";

const title = "Our Donors — Manyang Disability Foundation";
const description = "Donors who pledged to support people with disabilities through Manyang Disability Foundation, listed with their permission.";
const money = (c: number, cur: string) => `$${(c / 100).toLocaleString("en-AU", { minimumFractionDigits: 2 })} ${cur}`;
const day = (d: string) => new Date(d).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });

export const Route = createFileRoute("/donors")({
  loader: () => listPublicDonors(),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://manyangdisabilityfoundation.org/donors" }],
  }),
  component: DonorsPage,
});

function DonorsPage() {
  const donors = Route.useLoaderData();
  const [busy, setBusy] = useState(false);
  const total = donors.reduce((s, d) => s + d.amount_cents, 0);
  const pdf = async () => {
    setBusy(true);
    try {
      const blob = await buildListPdf("Donors", `Total pledged: ${money(total, "AUD")}`, donors.map((d) => [d.display_name, `${money(d.amount_cents, d.currency)} — ${day(d.pledged_at)}`]));
      downloadBlob(blob, "mdf-donors.pdf");
    } finally { setBusy(false); }
  };
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Our Donors</h1>
      <p className="text-muted-foreground mb-6">Thank you to everyone who pledged. Donors are listed only with their permission.</p>
      {donors.length === 0 ? (
        <p className="py-10 text-center text-muted-foreground">Donor recognition coming soon.</p>
      ) : (
        <>
          <p className="font-semibold mb-4">Total pledged: {money(total, "AUD")}</p>
          <ul className="divide-y border rounded-lg">
            {donors.map((d, i) => (
              <li key={i} className="flex flex-wrap justify-between gap-2 p-3">
                <span className="font-medium">{d.display_name}</span>
                <span>{money(d.amount_cents, d.currency)} · {day(d.pledged_at)}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      <button onClick={pdf} disabled={busy} className="mt-6 rounded bg-primary text-primary-foreground px-4 py-2 font-semibold">
        {busy ? "Preparing…" : "Download PDF"}
      </button>
    </main>
  );
}
