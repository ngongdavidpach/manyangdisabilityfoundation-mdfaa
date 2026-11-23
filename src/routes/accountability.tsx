import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { FIELD_REPORTS, FIELD_REPORTS_SUMMARY } from "@/ported/data/fieldReports";
import { buildFieldReportsPdf, downloadBlob } from "@/lib/fieldReportsPdf";

const URL = "https://manyangdisabilityfoundation.lovable.app/accountability";
const title = "Accountability & Field Reports — Manyang Disability Foundation";
const description = "Registration A0116724S, committee members and our dated 2026 field reports from Kakuma and Juba, with a downloadable PDF.";

export const Route = createFileRoute("/accountability")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: AccountabilityPage,
});

function AccountabilityPage() {
  const [pdf, setPdf] = useState<Blob | null>(null);
  const [busy, setBusy] = useState(false);
  const btn = "rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-60";
  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-16">
      <header className="space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Accountability</h1>
        <p className="text-muted-foreground">Who we are, how we are registered, and what we have done.</p>
        {pdf ? (
          <button type="button" className={btn} onClick={() => downloadBlob(pdf, "mdf-accountability-report-2026.pdf")}>Download PDF</button>
        ) : (
          <button type="button" className={btn} disabled={busy} onClick={async () => { setBusy(true); setPdf(await buildFieldReportsPdf(true)); setBusy(false); }}>
            {busy ? "Preparing PDF…" : "Prepare PDF download"}
          </button>
        )}
      </header>
      <section className="space-y-2 rounded-xl border border-border bg-card p-6">
        <h2 className="text-xl font-bold text-foreground">Registration</h2>
        <p className="text-card-foreground">Incorporated association number: <strong>A0116724S</strong> (Victoria, Australia — Consumer Affairs Victoria).</p>
        <p className="text-sm text-muted-foreground">The foundation is not currently endorsed as a Deductible Gift Recipient, so donations are not tax-deductible.</p>
      </section>
      <section className="space-y-3 rounded-xl border border-border bg-card p-6">
        <h2 className="text-xl font-bold text-foreground">Committee</h2>
        <ul className="space-y-1 text-card-foreground">
          <li><strong>Manyang Malet Manyang</strong> — CEO</li>
          <li><strong>Manyang Maler Manyang</strong> — Director</li>
        </ul>
      </section>
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Field reports (2026)</h2>
        <p className="text-card-foreground"><strong>500 people helped up to November 2026.</strong> {FIELD_REPORTS_SUMMARY}</p>
        {FIELD_REPORTS.map((r) => (
          <article key={r.title} className="space-y-2 rounded-xl border border-border bg-card p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">{r.program}</p>
            <h3 className="text-lg font-bold text-card-foreground">{r.title}</h3>
            <p className="text-sm text-muted-foreground">{r.place} · {r.date}</p>
            <p className="text-card-foreground">{r.summary}</p>
          </article>
        ))}
        <Link to="/field-reports" className="font-semibold text-primary underline">Open the Field Reports page</Link>
      </section>
    </div>
  );
}
