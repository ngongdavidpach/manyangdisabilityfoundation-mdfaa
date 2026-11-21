import { createFileRoute, Link } from "@tanstack/react-router";
import { FIELD_REPORTS, FIELD_REPORTS_SUMMARY } from "@/ported/data/fieldReports";

const URL = "https://manyangdisabilityfoundation.lovable.app/accountability";
const title = "Accountability — Manyang Disability Foundation";
const description = "Registration number A0116724S, committee members and dated field reports for Manyang Disability Foundation.";

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
  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-16">
      <header className="space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Accountability</h1>
        <p className="text-muted-foreground">Who we are, how we are registered, and what we have done.</p>
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
      <section className="space-y-3 rounded-xl border border-border bg-card p-6">
        <h2 className="text-xl font-bold text-foreground">Latest field report (2026)</h2>
        <p className="text-card-foreground">{FIELD_REPORTS_SUMMARY}</p>
        <ul className="list-disc pl-5 text-card-foreground">
          {FIELD_REPORTS.map((r) => <li key={r.title}>{r.title} — {r.place}, {r.date}</li>)}
        </ul>
        <Link to="/field-reports" className="font-semibold text-primary underline">Read the full field reports</Link>
      </section>
    </div>
  );
}
