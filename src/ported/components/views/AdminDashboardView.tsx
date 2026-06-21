import React, { useEffect, useState } from "react";
import {
  LogOut,
  LayoutDashboard,
  Image as ImageIcon,
  FileText,
  Calendar,
  Users,
  Settings as SettingsIcon,
  Newspaper,
  Sparkles,
  HeartHandshake,
  Wallet,
  BarChart3,
  Workflow,
} from "lucide-react";
import { useNavigate, Link } from "@tanstack/react-router";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { GalleryManager } from "../admin/GalleryManager";
import { PageSettingsEditor } from "../admin/PageSettingsEditor";
import { NewsManager } from "../admin/NewsManager";
import { EventsManager } from "../admin/EventsManager";
import { StaffManager } from "../admin/StaffManager";
import { FoundationInsightManager } from "../admin/FoundationInsightManager";
import { NavigationPagesEditor } from "../admin/NavigationPagesEditor";
import { ContactsManager } from "../admin/ContactsManager";
import { PipelineView } from "../admin/PipelineView";
import { DonationsManager } from "../admin/DonationsManager";
import { ExpensesManager } from "../admin/ExpensesManager";
import { FinanceReports } from "../admin/FinanceReports";
import { FoundationInfoEditor } from "../admin/FoundationInfoEditor";

type Tab =
  | "overview"
  | "pages"
  | "foundation"
  | "insight"
  | "gallery"
  | "news"
  | "events"
  | "staff"
  | "settings"
  | "contacts"
  | "pipeline"
  | "donations"
  | "expenses"
  | "reports";

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const onLogout = logout;

  const [tab, setTab] = useState<Tab>("overview");
  const [counts, setCounts] = useState({ media: 0, news: 0, events: 0, staff: 0 });

  useEffect(() => {
    Promise.all([
      supabase.from("media_assets").select("id", { count: "exact", head: true }),
      supabase.from("news_articles").select("id", { count: "exact", head: true }),
      supabase.from("events").select("id", { count: "exact", head: true }),
      supabase.from("staff_members").select("id", { count: "exact", head: true }),
    ]).then(([m, n, e, s]) =>
      setCounts({
        media: m.count || 0,
        news: n.count || 0,
        events: e.count || 0,
        staff: s.count || 0,
      }),
    );
  }, [tab]);

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "contacts", label: "Contacts", icon: Users },
    { id: "pipeline", label: "Pipeline", icon: Workflow },
    { id: "donations", label: "Donations", icon: HeartHandshake },
    { id: "expenses", label: "Expenses", icon: Wallet },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "insight", label: "Foundation Insight", icon: Sparkles },
    { id: "foundation", label: "Foundation Info", icon: SettingsIcon },
    { id: "pages", label: "Page Content", icon: FileText },
    { id: "gallery", label: "Media Library", icon: ImageIcon },
    { id: "news", label: "News", icon: Newspaper },
    { id: "events", label: "Events", icon: Calendar },
    { id: "staff", label: "Staff", icon: Users },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <button onClick={() => navigate({ to: "/" })} className="flex items-center gap-2">
            <img src="/images/logo.png" alt="" className="w-8 h-8" />
            <span className="font-bold text-slate-900">MDF Admin</span>
          </button>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-slate-600 hidden sm:block">
              {user?.fullName || user?.email}
            </span>
            <button
              onClick={onLogout}
              className="text-sm text-slate-600 hover:text-rose-600 flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6">
        <nav className="space-y-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full text-left text-sm font-medium px-3 py-2 rounded-md flex items-center gap-2 transition-colors ${
                tab === t.id ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </nav>

        <main>
          {tab === "overview" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">
                Welcome back, {user?.fullName?.split(" ")[0] || "Admin"}
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: "Media", n: counts.media, tab: "gallery" as Tab },
                  { label: "News", n: counts.news, tab: "news" as Tab },
                  { label: "Events", n: counts.events, tab: "events" as Tab },
                  { label: "Staff", n: counts.staff, tab: "staff" as Tab },
                ].map((c) => (
                  <button
                    key={c.label}
                    onClick={() => setTab(c.tab)}
                    className="bg-white border rounded-lg p-4 text-left hover:border-blue-400 transition-colors"
                  >
                    <p className="text-3xl font-bold text-slate-900">{c.n}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">
                      {c.label}
                    </p>
                  </button>
                ))}
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                Tip: The first signed-up user is automatically made admin. To grant admin to others,
                edit the user_roles table from the backend dashboard.
              </div>
            </div>
          )}
          {tab === "contacts" && <ContactsManager />}
          {tab === "pipeline" && <PipelineView />}
          {tab === "donations" && <DonationsManager />}
          {tab === "expenses" && <ExpensesManager />}
          {tab === "reports" && <FinanceReports />}
          {tab === "pages" && <PageSettingsEditor />}
          {tab === "foundation" && <FoundationInfoEditor />}
          {tab === "insight" && <FoundationInsightManager />}
          {tab === "gallery" && <GalleryManager />}
          {tab === "news" && <NewsManager />}
          {tab === "events" && <EventsManager />}
          {tab === "staff" && <StaffManager />}
          {tab === "settings" && (
            <div className="space-y-4">
              <NavigationPagesEditor />
              <div className="bg-white rounded-lg border p-5 space-y-3">
                <h3 className="text-lg font-bold">Other settings</h3>
                <p className="text-sm text-slate-600">
                  Site-wide settings are managed under{" "}
                  <button onClick={() => setTab("pages")} className="text-blue-600 underline">
                    Page Content → Site / Security
                  </button>
                  , including site name and tagline.
                </p>
                <p className="text-sm text-slate-600">
                  Social media URLs and contact info live under{" "}
                  <button onClick={() => setTab("pages")} className="text-blue-600 underline">
                    Page Content → Footer &amp; Contact
                  </button>
                  .
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
