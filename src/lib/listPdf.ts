/** Builds a simple branded list PDF in the browser. */
export async function buildListPdf(title: string, intro: string, rows: string[][]): Promise<Blob> {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const doc = await PDFDocument.create();
  let page = doc.addPage([595, 842]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  let y = 790;
  try {
    const img = await doc.embedPng(await (await fetch("/images/logo.png")).arrayBuffer());
    const s = 60 / img.height;
    page.drawImage(img, { x: 50, y: y - 50, width: img.width * s, height: 60 });
    y -= 80;
  } catch { /* logo optional */ }
  const clean = (t: string) => t.replace(/[^\x20-\x7E\u00A0-\u00FF—–]/g, "");
  const line = (text: string, f = font, size = 11) => {
    let cur = "";
    const flush = (t: string) => {
      if (y < 60) { page = doc.addPage([595, 842]); y = 790; }
      page.drawText(t, { x: 50, y, size, font: f, color: rgb(0.1, 0.1, 0.15) });
      y -= size + 5;
    };
    for (const w of clean(text).split(" ")) {
      const next = cur ? `${cur} ${w}` : w;
      if (f.widthOfTextAtSize(next, size) > 495) { flush(cur); cur = w; } else cur = next;
    }
    if (cur) flush(cur);
  };
  line(`Manyang Disability Foundation — ${title}`, bold, 16);
  line("Incorporated association A0116724S (Victoria, Australia)");
  line(`Generated ${new Date().toLocaleDateString("en-AU")}`);
  y -= 6;
  if (intro) { line(intro); y -= 6; }
  if (rows.length === 0) line("No entries yet.");
  for (const r of rows) { line(r[0] ?? "", bold, 12); for (const c of r.slice(1)) if (c) line(c); y -= 6; }
  return new Blob([(await doc.save()) as BlobPart], { type: "application/pdf" });
}
