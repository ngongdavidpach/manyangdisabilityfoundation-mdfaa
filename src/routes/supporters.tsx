import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { getPublicSupporters } from "@/lib/publicContent.functions";
import { buildListPdf } from "@/lib/listPdf";
import { downloadBlob } from "@/lib/fieldReportsPdf";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const title = "Our Supporters — Manyang Disability Foundation";
const description = "The people who help Manyang Disability Foundation support people with disabilities, and how each one helped.";

export const Route = createFileRoute("/supporters")({
  loader: () => getPublicSupporters(),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://manyangdisabilityfoundation.org/supporters" }],
  }),
  component: SupportersPage,
});

function SupportersPage() {
  const s = Route.useLoaderData();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const pdf = async () => {
    setBusy(true);
    setError("");
    try {
      downloadBlob(await buildListPdf("Supporters", s.intro, s.items.map((i) => [i.name, i.contribution])), "mdf-supporters.pdf");
    } catch {
      setError("The PDF could not be downloaded. Please try again.");
    } finally { setBusy(false); }
  };
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">{s.heading}</h1>
      {s.intro && <p className="text-muted-foreground mb-6">{s.intro}</p>}
      {s.items.length === 0 ? (
        <p className="py-10 text-center text-muted-foreground">Supporters coming soon.</p>
      ) : (
        <ul className="grid sm:grid-cols-2 gap-4">
          {s.items.map((i, k) => (
            <li key={k} className="border rounded-lg p-4">
              <p className="font-semibold">{i.name}</p>
              {i.contribution && <p className="text-sm text-muted-foreground">{i.contribution}</p>}
            </li>
          ))}
        </ul>
      )}
      {error && <p role="alert" className="mt-4 text-destructive">{error}</p>}
      <Button onClick={pdf} disabled={busy} className="mt-6">
        <Download aria-hidden="true" />
        {busy ? "Preparing…" : "Download PDF"}
      </Button>
    </main>
  );
}
