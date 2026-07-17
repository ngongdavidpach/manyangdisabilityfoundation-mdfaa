import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Prefs = {
  receipts: boolean;
  events: boolean;
  coordinators: boolean;
  fundraisers: boolean;
  account: boolean;
  unsubscribed_all: boolean;
};

const CATEGORIES: { key: keyof Omit<Prefs, "unsubscribed_all">; title: string; desc: string }[] = [
  {
    key: "receipts",
    title: "Donation receipts",
    desc: "Tax-deductible receipts and donation confirmations.",
  },
  {
    key: "events",
    title: "Event confirmations & reminders",
    desc: "RSVPs, reminders and updates for events you signed up to.",
  },
  {
    key: "coordinators",
    title: "Coordinator program updates",
    desc: "Confirmations and status updates for coordinator applications.",
  },
  {
    key: "fundraisers",
    title: "Fundraiser program updates",
    desc: "Confirmations and status updates for fundraiser applications.",
  },
  {
    key: "account",
    title: "Account notices",
    desc: "Non-security account emails such as deletion confirmations.",
  },
];

export function EmailPreferencesPanel({ mode }: { mode: "auth" | "token" }) {
  const [prefs, setPrefs] = useState<Prefs | null>(null);
  const [email, setEmail] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        let url = "/email/preferences";
        const headers: Record<string, string> = { "content-type": "application/json" };
        if (mode === "token") {
          const t = new URL(window.location.href).searchParams.get("token") || "";
          if (!t) {
            setError("Missing token");
            setLoading(false);
            return;
          }
          setToken(t);
          url += `?token=${encodeURIComponent(t)}`;
        } else {
          const { data } = await supabase.auth.getSession();
          const jwt = data.session?.access_token;
          if (!jwt) {
            setError("Please sign in to manage email preferences.");
            setLoading(false);
            return;
          }
          headers.Authorization = `Bearer ${jwt}`;
        }
        const res = await fetch(url, { headers });
        const body = await res.json();
        if (!res.ok) {
          setError(body?.error || "Unable to load preferences");
        } else if (!cancelled) {
          setEmail(body.email);
          setPrefs({ ...body.preferences, unsubscribed_all: !!body.preferences.unsubscribed_all });
        }
      } catch {
        setError("Unable to load preferences");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mode]);

  const save = async (next: Prefs) => {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const headers: Record<string, string> = { "content-type": "application/json" };
      const body: any = { ...next };
      if (mode === "token") body.token = token;
      else {
        const { data } = await supabase.auth.getSession();
        const jwt = data.session?.access_token;
        if (!jwt) throw new Error("Signed out");
        headers.Authorization = `Bearer ${jwt}`;
      }
      const res = await fetch("/email/preferences", {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data?.error || "Save failed");
      setPrefs(next);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: any) {
      setError(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-slate-500">Loading…</p>;
  }
  if (error && !prefs) {
    return <p className="text-sm text-rose-600">{error}</p>;
  }
  if (!prefs) return null;

  const toggle = (key: keyof Prefs) => {
    const next = { ...prefs, [key]: !prefs[key] };
    // If enabling any category, ensure global unsubscribe is off
    if (key !== "unsubscribed_all" && next[key]) next.unsubscribed_all = false;
    save(next);
  };

  const disabledByGlobal = prefs.unsubscribed_all;

  return (
    <div className="space-y-4">
      {email && (
        <p className="text-xs text-slate-500">
          Managing preferences for <span className="font-medium text-slate-700">{email}</span>
        </p>
      )}

      <div className="rounded-xl border border-slate-200 divide-y divide-slate-100">
        {CATEGORIES.map((cat) => (
          <label
            key={cat.key}
            className={`flex items-start justify-between gap-4 p-4 ${
              disabledByGlobal ? "opacity-60" : ""
            }`}
          >
            <span>
              <span className="block text-sm font-semibold text-slate-900">{cat.title}</span>
              <span className="block text-xs text-slate-600 mt-0.5">{cat.desc}</span>
            </span>
            <input
              type="checkbox"
              checked={!!prefs[cat.key] && !disabledByGlobal}
              disabled={disabledByGlobal || saving}
              onChange={() => toggle(cat.key)}
              className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
            />
          </label>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
        <div className="flex items-start justify-between gap-4">
          <span>
            <span className="block text-sm font-semibold text-slate-900">
              Unsubscribe from all non-essential emails
            </span>
            <span className="block text-xs text-slate-600 mt-0.5">
              Turn off everything above. Account-security emails still send while your
              account exists.
            </span>
          </span>
          <input
            type="checkbox"
            checked={prefs.unsubscribed_all}
            disabled={saving}
            onChange={() => toggle("unsubscribed_all")}
            className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 text-sm">
        {saving && <span className="text-slate-500">Saving…</span>}
        {saved && <span className="text-emerald-600">Saved ✓</span>}
        {error && <span className="text-rose-600">{error}</span>}
      </div>
    </div>
  );
}
