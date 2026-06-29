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
  ShieldCheck,
  Search,
  Bell,
  User as UserIcon,
  Eye,
  Edit3,
  EyeOff,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
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
import { StaffAccountsManager } from "../admin/StaffAccountsManager";
import { CoordinatorsManager } from "../admin/CoordinatorsManager";
import { FundraisersManager } from "../admin/FundraisersManager";

type Tab =
  | "overview"
  | "pages"
  | "foundation"
  | "insight"
  | "gallery"
  | "news"
  | "events"
  | "staff"
  | "staff-accounts"
  | "coordinators"
  | "fundraisers"
  | "settings"
  | "contacts"
  | "pipeline"
  | "donations"
  | "expenses"
  | "reports";

type RecentArticle = {
  id: string;
  title: string;
  slug: string | null;
  status: string | null;
  published_at: string | null;
};

const PAGE_SIZE = 7;

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [tab, setTab] = useState<Tab>("overview");
  const [counts, setCounts] = useState({ media: 0, news: 0, events: 0, staff: 0 });
  const [recent, setRecent] = useState<RecentArticle[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [focusArticleId, setFocusArticleId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(query.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

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
  }, [reloadKey]);

  useEffect(() => {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    let q = supabase
      .from("news_articles")
      .select("id,title,slug,status,published_at", { count: "exact" })
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .range(from, to);
    if (debounced) q = q.ilike("title", `%${debounced}%`);
    q.then(({ data, count }) => {
      setRecent((data as RecentArticle[]) || []);
      setTotal(count || 0);
    });
  }, [debounced, page, reloadKey]);

  const togglePublish = async (a: RecentArticle) => {
    setBusyId(a.id);
    const isPub = a.status === "published";
    const payload: { status: string; published_at?: string } = {
      status: isPub ? "draft" : "published",
    };
    if (!isPub && !a.published_at) payload.published_at = new Date().toISOString();
    const { error } = await supabase.from("news_articles").update(payload).eq("id", a.id);
    setBusyId(null);
    if (error) {
      alert(error.message);
      return;
    }
    setReloadKey((k) => k + 1);
  };

  const openEdit = (a: RecentArticle) => {
    setFocusArticleId(a.id);
    setTab("news");
  };

  useEffect(() => {
    if (tab !== "news") setFocusArticleId(null);
  }, [tab]);


  const sections: { label: string; items: { id: Tab; label: string; icon: any }[] }[] = [
    { label: "Overview", items: [{ id: "overview", label: "Dashboard", icon: LayoutDashboard }] },
    {
      label: "People",
      items: [
        { id: "contacts", label: "Contacts", icon: Users },
        { id: "pipeline", label: "Pipeline", icon: Workflow },
        { id: "coordinators", label: "Coordinators (EA)", icon: ShieldCheck },
        { id: "fundraisers", label: "Fundraisers (AU)", icon: HeartHandshake },
        { id: "staff", label: "Staff", icon: Users },
        { id: "staff-accounts", label: "Staff Accounts", icon: ShieldCheck },
      ],
    },
    {
      label: "Finance",
      items: [
        { id: "donations", label: "Donations", icon: HeartHandshake },
        { id: "expenses", label: "Expenses", icon: Wallet },
        { id: "reports", label: "Reports", icon: BarChart3 },
      ],
    },
    {
      label: "Content",
      items: [
        { id: "pages", label: "Page Content", icon: FileText },
        { id: "gallery", label: "Media Library", icon: ImageIcon },
        { id: "news", label: "News", icon: Newspaper },
        { id: "events", label: "Events", icon: Calendar },
        { id: "insight", label: "Foundation Insight", icon: Sparkles },
      ],
    },
    {
      label: "System",
      items: [
        { id: "foundation", label: "Foundation Info", icon: SettingsIcon },
        { id: "settings", label: "Settings", icon: SettingsIcon },
      ],
    },
  ];

  const stats = [
    { label: "Media Assets", value: counts.media, icon: ImageIcon, tab: "gallery" as Tab },
    { label: "News Articles", value: counts.news, icon: Newspaper, tab: "news" as Tab },
    { label: "Events", value: counts.events, icon: Calendar, tab: "events" as Tab },
    { label: "Staff", value: counts.staff, icon: Users, tab: "staff" as Tab },
  ];

  const initial = (user?.fullName || user?.email || "A").charAt(0).toUpperCase();

  const renderTab = () => {
    switch (tab) {
      case "contacts":
        return <ContactsManager />;
      case "pipeline":
        return <PipelineView />;
      case "donations":
        return <DonationsManager />;
      case "expenses":
        return <ExpensesManager />;
      case "reports":
        return <FinanceReports />;
      case "pages":
        return <PageSettingsEditor />;
      case "foundation":
        return <FoundationInfoEditor />;
      case "insight":
        return <FoundationInsightManager />;
      case "gallery":
        return <GalleryManager />;
      case "news":
        return <NewsManager focusArticleId={focusArticleId} />;
      case "events":
        return <EventsManager />;
      case "staff":
        return <StaffManager />;
      case "staff-accounts":
        return <StaffAccountsManager />;
      case "coordinators":
        return <CoordinatorsManager />;
      case "fundraisers":
        return <FundraisersManager />;
      case "settings":
        return (
          <div className="space-y-4">
            <NavigationPagesEditor />
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
              <h3 className="text-lg font-bold text-gray-800">Other settings</h3>
              <p className="text-sm text-gray-600">
                Site-wide settings are managed under{" "}
                <button onClick={() => setTab("pages")} className="text-violet-700 underline">
                  Page Content → Site / Security
                </button>
                .
              </p>
              <p className="text-sm text-gray-600">
                Social media URLs and contact info live under{" "}
                <button onClick={() => setTab("pages")} className="text-violet-700 underline">
                  Page Content → Footer &amp; Contact
                </button>
                .
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col font-sans">
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-56 bg-white border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col">
          <button
            onClick={() => navigate({ to: "/" })}
            className="flex items-center gap-2 px-5 py-5"
          >
            <img src="/images/logo.png" alt="MDF" className="w-8 h-8" />
            <span className="text-lg font-bold">
              <span className="text-violet-700">MDF</span>
              <span className="text-gray-800"> Admin</span>
            </span>
          </button>
          <nav className="flex-1 px-3 pb-3 space-y-4 overflow-x-auto">
            {sections.map((section) => (
              <div key={section.label} className="space-y-1">
                <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  {section.label}
                </p>
                {section.items.map(({ id, label, icon: Icon }) => {
                  const isActive = tab === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setTab(id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-violet-100 text-violet-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-[18px] h-[18px]" />
                      {label}
                    </button>
                  );
                })}
              </div>
            ))}
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            >
              <LogOut className="w-[18px] h-[18px]" /> Sign out
            </button>
          </nav>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col bg-indigo-50 min-w-0">
          {/* Top bar */}
          <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:px-8 py-4 bg-white border-b border-gray-100">
            <div className="min-w-0 flex justify-center">
              <div className="flex w-full max-w-md">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={tab === "overview" ? "Search news articles" : "Search"}
                  className="flex-1 min-w-0 rounded-l-full border border-gray-200 px-4 py-2 text-sm outline-none bg-gray-50"
                />
                <button className="rounded-r-full bg-violet-700 px-4 flex items-center justify-center shrink-0">
                  <Search className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-5 shrink-0">
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-violet-700 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full">
                Admin
              </span>
              <Bell className="w-5 h-5 text-gray-600" />
              <div className="w-9 h-9 rounded-full bg-violet-200 flex items-center justify-center text-violet-700 font-bold text-sm">
                {initial || <UserIcon className="w-5 h-5" />}
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 px-4 sm:px-8 py-6 space-y-6">
            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
              {stats.map(({ label, value, icon: Icon, tab: t }) => (
                <button
                  key={label}
                  onClick={() => setTab(t)}
                  className="bg-violet-700 hover:bg-violet-800 rounded-2xl p-5 flex items-center justify-between shadow-sm text-left transition-colors"
                >
                  <div className="min-w-0">
                    <div className="text-white text-2xl font-bold">{value}</div>
                    <div className="text-violet-200 text-xs mt-1 truncate">{label}</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-violet-600/60 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </button>
              ))}
            </div>

            {/* Active panel */}
            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
              {tab === "overview" ? (
                <>
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 gap-3">
                    <h2 className="text-violet-700 font-semibold text-lg truncate">
                      Recent Articles
                    </h2>
                    <button
                      onClick={() => setTab("news")}
                      className="bg-violet-700 hover:bg-violet-800 text-white text-sm font-medium px-4 py-1.5 rounded-md shrink-0"
                    >
                      View All
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-700">
                          <th className="font-semibold pb-2">Article</th>
                          <th className="font-semibold pb-2">Published</th>
                          <th className="font-semibold pb-2">Status</th>
                          <th className="font-semibold pb-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recent.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-6 text-center text-gray-500">
                              {debounced ? `No articles match "${debounced}".` : "No articles yet."}
                            </td>
                          </tr>
                        ) : (
                          recent.map((a) => {
                            const isPub = a.status === "published";
                            return (
                              <tr key={a.id} className="border-t border-gray-50">
                                <td className="py-2.5 text-gray-800 truncate max-w-[260px]">
                                  {a.title}
                                </td>
                                <td className="py-2.5 text-gray-600">
                                  {a.published_at
                                    ? new Date(a.published_at).toLocaleDateString()
                                    : "—"}
                                </td>
                                <td className="py-2.5">
                                  <span
                                    className={`text-white text-xs font-medium px-3 py-1 rounded-full ${
                                      isPub ? "bg-green-500" : "bg-gray-400"
                                    }`}
                                  >
                                    {isPub ? "Published" : "Draft"}
                                  </span>
                                </td>
                                <td className="py-2.5">
                                  <div className="flex items-center justify-end gap-1">
                                    <a
                                      href={a.slug ? `/news/${a.slug}` : undefined}
                                      target="_blank"
                                      rel="noreferrer"
                                      aria-disabled={!a.slug}
                                      title="View"
                                      className={`p-1.5 rounded hover:bg-gray-100 text-gray-600 ${
                                        a.slug ? "" : "pointer-events-none opacity-40"
                                      }`}
                                    >
                                      <Eye className="w-4 h-4" />
                                    </a>
                                    <button
                                      onClick={() => openEdit(a)}
                                      title="Edit"
                                      className="p-1.5 rounded hover:bg-gray-100 text-gray-600"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => togglePublish(a)}
                                      disabled={busyId === a.id}
                                      title={isPub ? "Unpublish" : "Publish"}
                                      className={`p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 ${
                                        isPub ? "text-amber-600" : "text-green-600"
                                      }`}
                                    >
                                      {isPub ? (
                                        <EyeOff className="w-4 h-4" />
                                      ) : (
                                        <Eye className="w-4 h-4" />
                                      )}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                  {total > 0 && (
                    <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100 text-xs text-gray-600">
                      <span>
                        Showing {(page - 1) * PAGE_SIZE + 1}–
                        {Math.min(page * PAGE_SIZE, total)} of {total}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page === 1}
                          className="p-1 rounded border border-gray-200 disabled:opacity-40"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span>
                          Page {page} / {Math.max(1, Math.ceil(total / PAGE_SIZE))}
                        </span>
                        <button
                          onClick={() => setPage((p) => p + 1)}
                          disabled={page * PAGE_SIZE >= total}
                          className="p-1 rounded border border-gray-200 disabled:opacity-40"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                renderTab()
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black px-6 py-3 flex justify-center">
        <div className="bg-violet-700 w-full max-w-5xl rounded-md py-2 flex justify-center">
          <span className="text-white font-bold tracking-wide">ADMIN PANEL</span>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
