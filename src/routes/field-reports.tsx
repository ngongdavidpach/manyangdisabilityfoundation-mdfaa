import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { buildFieldReportsPdf, downloadBlob } from "@/lib/fieldReportsPdf";
import { FIELD_REPORTS, FIELD_REPORTS_SUMMARY } from "@/ported/data/fieldReports";

const URL = "https://manyangdisabilityfoundation.lovable.app/field-reports";
const title = "Field Reports 2026 — Manyang Disability Foundation";
const description = "Our 2026 field work: wheelchairs for children in Kakuma and surgery for children from Juba and Kakuma — more than 100 children helped.";

export const Route = createFileRoute("/field-reports")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: FieldReportsPage,
});

function FieldReportsPage() {
  const [pdf, setPdf] = useState<Blob | null>(null);
  const [busy, setBusy] = useState(false);
  const download = (b: Blob) => downloadBlob(b, "mdf-field-reports-2026.pdf");
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-16">
      <header className="space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Field Reports 2026</h1>
        <p className="text-muted-foreground">{FIELD_REPORTS_SUMMARY}</p>
        {pdf ? (
          <button type="button" onClick={() => download(pdf)} className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Download PDF</button>
        ) : (
          <button type="button" disabled={busy} onClick={async () => { setBusy(true); setPdf(await buildFieldReportsPdf()); setBusy(false); }}
            className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-60">
            {busy ? "Preparing PDF…" : "Prepare PDF download"}
          </button>
        )}
      </header>
      {FIELD_REPORTS.map((r) => (
        <article key={r.title} className="space-y-2 rounded-xl border border-border bg-card p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">{r.program}</p>
          <h2 className="text-xl font-bold text-card-foreground">{r.title}</h2>
          <p className="text-sm text-muted-foreground">{r.place} · {r.date}</p>
          <p className="text-card-foreground">{r.summary}</p>
        </article>
      ))}
    </div>
  );
}
