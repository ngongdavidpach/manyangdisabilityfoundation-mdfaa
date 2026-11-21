import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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

async function buildPdf(): Promise<Blob> {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  let y = 790;
  try {
    const bytes = await (await fetch("/images/logo.png")).arrayBuffer();
    const img = await doc.embedPng(bytes);
    const s = 60 / img.height;
    page.drawImage(img, { x: 50, y: y - 50, width: img.width * s, height: 60 });
    y -= 80;
  } catch { /* logo optional */ }
  const line = (text: string, f = font, size = 11) => {
    const words = text.split(" ");
    let cur = "";
    for (const w of words) {
      const next = cur ? `${cur} ${w}` : w;
      if (f.widthOfTextAtSize(next, size) > 495) { page.drawText(cur, { x: 50, y, size, font: f, color: rgb(0.1, 0.1, 0.15) }); y -= size + 5; cur = w; }
      else cur = next;
    }
    if (cur) { page.drawText(cur, { x: 50, y, size, font: f, color: rgb(0.1, 0.1, 0.15) }); y -= size + 5; }
  };
  line("Manyang Disability Foundation — Field Reports 2026", bold, 16);
  line("Incorporated association A0116724S (Victoria, Australia)");
  y -= 8; line(FIELD_REPORTS_SUMMARY); y -= 10;
  for (const r of FIELD_REPORTS) {
    line(r.title, bold, 13);
    line(`Program: ${r.program}`); line(`Place: ${r.place}`); line(`Date: ${r.date}`);
    line(r.summary); y -= 10;
  }
  const bytes = await doc.save();
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
}

function FieldReportsPage() {
  const [pdf, setPdf] = useState<Blob | null>(null);
  const [busy, setBusy] = useState(false);
  const download = (b: Blob) => {
    const url = window.URL.createObjectURL(b);
    const a = document.createElement("a");
    a.href = url; a.download = "mdf-field-reports-2026.pdf";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => window.URL.revokeObjectURL(url), 30000);
  };
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-16">
      <header className="space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Field Reports 2026</h1>
        <p className="text-muted-foreground">{FIELD_REPORTS_SUMMARY}</p>
        {pdf ? (
          <button type="button" onClick={() => download(pdf)} className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Download PDF</button>
        ) : (
          <button type="button" disabled={busy} onClick={async () => { setBusy(true); setPdf(await buildPdf()); setBusy(false); }}
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
