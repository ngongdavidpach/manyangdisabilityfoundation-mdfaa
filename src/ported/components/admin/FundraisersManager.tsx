import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Row = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  state: string;
  city: string | null;
  postcode: string | null;
  event_type: string | null;
  event_date: string | null;
  expected_participants: number | null;
  fundraising_goal_cents: number | null;
  prior_experience: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

export const FundraisersManager: React.FC = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    supabase
      .from("fundraiser_registrations")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setRows((data as Row[]) || []);
        setLoading(false);
      });
  };
  useEffect(load, []);

  const setStatus = async (id: string, status: string) => {
    await supabase.from("fundraiser_registrations").update({ status }).eq("id", id);
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this registration?")) return;
    await supabase.from("fundraiser_registrations").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-900">Fundraiser Registrations</h2>
      {loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-slate-500">No registrations yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-700 border-b border-slate-200">
                <th className="py-2">Submitted</th>
                <th>Name</th>
                <th>Location</th>
                <th>Event</th>
                <th>Goal (AUD)</th>
                <th>Contact</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 align-top">
                  <td className="py-2 whitespace-nowrap text-slate-600">
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                  <td>{r.full_name}</td>
                  <td>
                    {r.state}
                    {r.city ? `, ${r.city}` : ""}
                    {r.postcode ? ` ${r.postcode}` : ""}
                  </td>
                  <td>
                    {r.event_type || "—"}
                    <div className="text-xs text-slate-500">{r.event_date || ""}</div>
                  </td>
                  <td>
                    {r.fundraising_goal_cents
                      ? `$${(r.fundraising_goal_cents / 100).toLocaleString()}`
                      : "—"}
                  </td>
                  <td>
                    <div>{r.email}</div>
                    <div className="text-xs text-slate-500">{r.phone}</div>
                  </td>
                  <td>
                    <select
                      value={r.status}
                      onChange={(e) => setStatus(r.id, e.target.value)}
                      className="text-xs border border-slate-300 rounded px-2 py-1"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="active">Active</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => remove(r.id)}
                      className="text-rose-600 text-xs hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
