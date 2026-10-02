import React, { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  listSubmissions,
  countNewSubmissions,
  updateSubmissionStatus,
  markPledgeReceived,
  type SubmissionKind,
} from "@/lib/submissions.functions";

const KINDS: { id: SubmissionKind; label: string; statuses: string[] }[] = [
  { id: "donation_intents", label: "Pledges", statuses: ["pledged", "pending", "received", "cancelled"] },
  { id: "aid_requests", label: "Aid requests", statuses: ["new", "in_review", "approved", "declined", "done"] },
  { id: "volunteer_applications", label: "Volunteers", statuses: ["new", "in_review", "approved", "declined", "done"] },
  { id: "partner_inquiries", label: "Partner inquiries", statuses: ["new", "in_review", "done"] },
  { id: "event_rsvps", label: "Event RSVPs", statuses: ["confirmed", "attended", "cancelled"] },
  { id: "contact_messages", label: "Contact messages", statuses: ["new", "read", "replied", "done"] },
];

const HIDDEN = new Set(["id", "updated_at"]);

function fmt(k: string, v: any) {
  if (v === null || v === undefined || v === "") return "—";
  if (k === "amount_cents" || k.endsWith("_cents")) return `$${(Number(v) / 100).toFixed(2)}`;
  if (k.endsWith("_at")) return new Date(v).toLocaleString();
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "boolean") return v ? "Yes" : "No";
  return String(v);
}

function summary(kind: SubmissionKind, r: Record<string, any>) {
  switch (kind) {
    case "donation_intents":
      return [r.reference, r.is_anonymous ? "Anonymous" : r.donor_name, fmt("amount_cents", r.amount_cents) + " " + r.currency, r.channel];
    case "aid_requests":
      return [r.tracking_code, r.full_name, r.requested_aid, r.urgency_level];
    case "event_rsvps":
      return [r.event_title, r.full_name, r.email, r.phone];
    case "partner_inquiries":
      return [r.org_name, r.contact_person, r.email, r.partnership_type];
    case "contact_messages":
      return [r.subject, r.name, r.email, ""];
    default:
      return [r.full_name, r.email, r.country, r.availability];
  }
}

export const SubmissionsManager: React.FC = () => {
  const [kind, setKind] = useState<SubmissionKind>("donation_intents");
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const list = useServerFn(listSubmissions);
  const countFn = useServerFn(countNewSubmissions);
  const upd = useServerFn(updateSubmissionStatus);
  const received = useServerFn(markPledgeReceived);
  const meta = KINDS.find((k) => k.id === kind)!;

  const load = () => {
    list({ data: { kind, page } })
      .then((r) => {
        setRows(r.rows);
        setTotal(r.total);
      })
      .catch((e) => alert((e as Error).message));
    countFn().then(setCounts).catch(() => {});
  };
  useEffect(load, [kind, page]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) => JSON.stringify(r).toLowerCase().includes(s));
  }, [rows, q]);

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    try {
      await fn();
      load();
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-900">Submissions</h2>
      <div className="flex flex-wrap gap-2">
        {KINDS.map((k) => (
          <button
            key={k.id}
            onClick={() => {
              setKind(k.id);
              setPage(0);
              setOpen(null);
            }}
            className={`px-3 py-1.5 rounded-md text-sm border ${kind === k.id ? "bg-violet-100 text-violet-700 border-violet-200" : "bg-white text-slate-700"}`}
          >
            {k.label}
            {counts[k.id] ? (
              <span className="ml-2 rounded-full bg-violet-600 text-white text-xs px-1.5">{counts[k.id]}</span>
            ) : null}
          </button>
        ))}
      </div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={kind === "donation_intents" ? "Search by reference, name or email" : "Search"}
        aria-label="Search submissions"
        className="w-full md:w-96 border rounded-md px-3 py-2 text-sm"
      />
      <div className="bg-white border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="p-2">Date</th>
              <th className="p-2" colSpan={4}>Details</th>
              <th className="p-2">Status</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="p-4 text-center text-slate-500">Nothing here yet.</td></tr>
            )}
            {filtered.map((r) => (
              <React.Fragment key={r.id}>
                <tr className="border-t">
                  <td className="p-2 whitespace-nowrap">{new Date(r.created_at).toLocaleDateString()}</td>
                  {summary(kind, r).map((c, i) => (
                    <td key={i} className="p-2">{c || "—"}</td>
                  ))}
                  <td className="p-2">
                    <select
                      aria-label="Status"
                      disabled={busy}
                      value={r.status}
                      onChange={(e) => run(() => upd({ data: { kind, id: r.id, status: e.target.value } }))}
                      className="border rounded px-1 py-0.5"
                    >
                      {Array.from(new Set([r.status, ...meta.statuses])).map((s) => (
                        <option key={s} value={s}>{s.replace("_", " ")}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2 whitespace-nowrap space-x-2">
                    <button className="text-violet-700 underline" onClick={() => setOpen(open === r.id ? null : r.id)}>
                      {open === r.id ? "Hide" : "View"}
                    </button>
                    {kind === "donation_intents" && (
                      <a href={`/receipts/${encodeURIComponent(r.reference)}`} target="_blank" rel="noreferrer" className="text-blue-700 underline">
                        Receipt
                      </a>
                    )}
                    {kind === "donation_intents" && r.status !== "received" && (
                      <button
                        disabled={busy}
                        className="bg-emerald-600 text-white rounded px-2 py-0.5"
                        onClick={() => {
                          if (confirm(`Mark pledge ${r.reference} as received? This adds it to Donations.`))
                            run(() => received({ data: { id: r.id } }));
                        }}
                      >
                        Mark received
                      </button>
                    )}
                  </td>
                </tr>
                {open === r.id && (
                  <tr className="bg-slate-50">
                    <td colSpan={7} className="p-3">
                      <dl className="grid md:grid-cols-2 gap-x-6 gap-y-1">
                        {Object.entries(r)
                          .filter(([k]) => !HIDDEN.has(k))
                          .map(([k, v]) => (
                            <div key={k} className="flex gap-2">
                              <dt className="text-slate-500 capitalize min-w-36">{k.replace(/_/g, " ")}</dt>
                              <dd className="text-slate-900 whitespace-pre-wrap break-words">{fmt(k, v)}</dd>
                            </div>
                          ))}
                      </dl>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {total > 50 && (
        <div className="flex items-center gap-2 text-sm">
          <button disabled={page === 0} onClick={() => setPage(page - 1)} className="border rounded px-2 py-1">Previous</button>
          <span>Page {page + 1} of {Math.ceil(total / 50)}</span>
          <button disabled={(page + 1) * 50 >= total} onClick={() => setPage(page + 1)} className="border rounded px-2 py-1">Next</button>
        </div>
      )}
    </div>
  );
};
