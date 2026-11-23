import { FIELD_REPORTS, FIELD_REPORTS_SUMMARY } from "@/ported/data/fieldReports";

/** Builds the field reports PDF in the browser. `accountability` adds registration and committee. */
export async function buildFieldReportsPdf(accountability = false): Promise<Blob> {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const doc = await PDFDocument.create();
  let page = doc.addPage([595, 842]);
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
  const draw = (t: string, f: typeof font, size: number) => {
    if (y < 60) { page = doc.addPage([595, 842]); y = 790; }
    page.drawText(t, { x: 50, y, size, font: f, color: rgb(0.1, 0.1, 0.15) });
    y -= size + 5;
  };
  const line = (text: string, f = font, size = 11) => {
    let cur = "";
    for (const w of text.split(" ")) {
      const next = cur ? `${cur} ${w}` : w;
      if (f.widthOfTextAtSize(next, size) > 495) { draw(cur, f, size); cur = w; } else cur = next;
    }
    if (cur) draw(cur, f, size);
  };
  line(accountability ? "Manyang Disability Foundation — Accountability Report 2026" : "Manyang Disability Foundation — Field Reports 2026", bold, 16);
  line("Incorporated association A0116724S (Victoria, Australia — Consumer Affairs Victoria)");
  if (accountability) {
    y -= 8; line("Committee", bold, 13);
    line("Manyang Malet Manyang — CEO"); line("Manyang Maler Manyang — Director");
    line("Not currently endorsed as a Deductible Gift Recipient; donations are not tax-deductible.");
    y -= 4; line("500 people helped up to November 2026.");
  }
  y -= 8; line("Field reports", bold, 13); line(FIELD_REPORTS_SUMMARY); y -= 10;
  for (const r of FIELD_REPORTS) {
    line(r.title, bold, 12);
    line(`Program: ${r.program}`); line(`Place: ${r.place}`); line(`Date: ${r.date}`);
    line(r.summary); y -= 10;
  }
  const bytes = await doc.save();
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
}

export function downloadBlob(b: Blob, filename: string) {
  const url = window.URL.createObjectURL(b);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => window.URL.revokeObjectURL(url), 30000);
}
