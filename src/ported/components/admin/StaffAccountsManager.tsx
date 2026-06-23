import React, { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ShieldCheck, ShieldOff, UserPlus, Loader2, Mail } from "lucide-react";
import {
  listStaffAccounts,
  setUserAdmin,
  inviteStaffAccount,
  type StaffAccount,
} from "@/lib/staffAccounts.functions";
import { useAuth } from "../../contexts/AuthContext";

export const StaffAccountsManager: React.FC = () => {
  const { user } = useAuth();
  const list = useServerFn(listStaffAccounts);
  const toggle = useServerFn(setUserAdmin);
  const invite = useServerFn(inviteStaffAccount);

  const [rows, setRows] = useState<StaffAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [showInvite, setShowInvite] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [makeAdmin, setMakeAdmin] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      setRows(await list());
    } catch (e: any) {
      setErr(e?.message || "Failed to load accounts");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const handleToggle = async (row: StaffAccount, makeAdminNext: boolean) => {
    if (!makeAdminNext && row.id === user?.id) {
      if (!confirm("Remove your own admin access? You may lose access to this dashboard.")) return;
    }
    setBusyId(row.id);
    setErr(null);
    try {
      await toggle({ data: { userId: row.id, isAdmin: makeAdminNext } });
      await load();
    } catch (e: any) {
      setErr(e?.message || "Action failed");
    } finally {
      setBusyId(null);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    setErr(null);
    setNotice(null);
    try {
      await invite({ data: { email, fullName, makeAdmin } });
      setNotice(`Invitation sent to ${email}`);
      setEmail("");
      setFullName("");
      setMakeAdmin(false);
      setShowInvite(false);
      await load();
    } catch (e: any) {
      setErr(e?.message || "Invitation failed");
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Staff Accounts</h3>
          <p className="text-xs text-slate-500">
            Manage who can sign in to the admin and who holds the admin role.
          </p>
        </div>
        <button
          onClick={() => setShowInvite((v) => !v)}
          className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> Invite staff
        </button>
      </div>

      {err && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 text-sm px-3 py-2 rounded">
          {err}
        </div>
      )}
      {notice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-3 py-2 rounded">
          {notice}
        </div>
      )}

      {showInvite && (
        <form
          onSubmit={handleInvite}
          className="bg-white rounded-lg border p-4 grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <div>
            <label className="text-xs font-semibold">Full name</label>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 border rounded text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded text-sm"
            />
          </div>
          <label className="flex items-center gap-2 text-sm md:col-span-2">
            <input
              type="checkbox"
              checked={makeAdmin}
              onChange={(e) => setMakeAdmin(e.target.checked)}
            />
            Grant admin role on signup
          </label>
          <div className="md:col-span-2 flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowInvite(false)}
              className="text-sm px-3 py-1.5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={inviting}
              className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-md flex items-center gap-2 disabled:opacity-60"
            >
              {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
              Send invite
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg border overflow-hidden">
        {loading ? (
          <div className="p-8 flex items-center justify-center text-slate-500 text-sm">
            <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading accounts…
          </div>
        ) : rows.length === 0 ? (
          <p className="p-6 text-center text-sm text-slate-500 italic">No accounts yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Last sign-in</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const isAdmin = r.roles.includes("admin");
                const isSelf = r.id === user?.id;
                return (
                  <tr key={r.id} className="border-t">
                    <td className="px-4 py-2">
                      {r.fullName || <span className="text-slate-400">—</span>}
                      {isSelf && (
                        <span className="ml-2 text-[10px] text-slate-500">(you)</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-slate-600">{r.email}</td>
                    <td className="px-4 py-2">
                      {isAdmin ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                          <ShieldCheck className="w-3 h-3" /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[11px] font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                          Member
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-slate-500 text-xs">
                      {r.lastSignInAt
                        ? new Date(r.lastSignInAt).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <button
                        disabled={busyId === r.id}
                        onClick={() => handleToggle(r, !isAdmin)}
                        className={`text-xs px-3 py-1.5 rounded-md inline-flex items-center gap-1 disabled:opacity-60 ${
                          isAdmin
                            ? "border border-rose-200 text-rose-700 hover:bg-rose-50"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {busyId === r.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : isAdmin ? (
                          <ShieldOff className="w-3 h-3" />
                        ) : (
                          <ShieldCheck className="w-3 h-3" />
                        )}
                        {isAdmin ? "Remove admin" : "Make admin"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StaffAccountsManager;
