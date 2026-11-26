import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { listPublicDonors } from "@/lib/publicContent.functions";
import { buildListPdf } from "@/lib/listPdf";
import { downloadBlob } from "@/lib/fieldReportsPdf";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const title = "Our Donors — Manyang Disability Foundation";
const description = "Staff-approved donor pledges supporting people with disabilities through Manyang Disability Foundation.";
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
  const totals = new Map<string, number>();
  for (const donor of donors) totals.set(donor.currency, (totals.get(donor.currency) ?? 0) + donor.amount_cents);
  const totalPledged = Array.from(totals, ([currency, amount]) => money(amount, currency)).join(" · ") || money(0, "AUD");
  const [error, setError] = useState("");
  const pdf = async () => {
    setBusy(true);
    setError("");
    try {
      const blob = await buildListPdf("Donors", `Staff-approved pledges. Total pledged: ${totalPledged}. Pledges are not confirmation of payment received.`, donors.map((d) => [d.display_name, `${money(d.amount_cents, d.currency)} — ${day(d.pledged_at)}`]));
      downloadBlob(blob, "mdf-donors.pdf");
    } catch {
      setError("The PDF could not be downloaded. Please try again.");
    } finally { setBusy(false); }
  };
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Our Donors</h1>
      <p className="text-muted-foreground mb-6">Thank you to everyone who pledged. Only staff-approved pledges are listed. Pledged amounts are not confirmation of payment received.</p>
      {donors.length === 0 ? (
        <p className="py-10 text-center text-muted-foreground">Donor recognition coming soon.</p>
      ) : (
        <>
          <p className="font-semibold mb-4">Total pledged: {totalPledged}</p>
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
      {error && <p role="alert" className="mt-4 text-destructive">{error}</p>}
      <Button onClick={pdf} disabled={busy} className="mt-6">
        <Download aria-hidden="true" />
        {busy ? "Preparing…" : "Download PDF"}
      </Button>
    </main>
  );
}
