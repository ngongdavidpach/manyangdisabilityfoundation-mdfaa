import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard,
  Users, 
  FileText, 
  Heart, 
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Download,
  Eye,
  ShieldCheck,
  LogOut,
  DollarSign,
  Activity,
  Globe,
  Bell
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getAllApplications, 
  getAllDonations, 
  getUsersDB,
  getRoleLabel, 
  getRoleColor
} from '../../utils/auth';
import type { User, UserRole } from '../../types/auth';

interface AdminDashboardProps {
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

type AdminTab = 'overview' | 'applications' | 'donations' | 'users';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onNavigate }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [applications, setApplications] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [users, setUsers] = useState<Array<{ user: User; role: string }>>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setApplications(getAllApplications());
    setDonations(getAllDonations());
    
    // Build users list
    const db = getUsersDB();
    const userList = Object.values(db).map(entry => ({
      user: entry.user,
      role: entry.user.role
    }));
    setUsers(userList);
  }, []);

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-red-900">Unauthorized Access</h2>
          <p className="text-sm text-red-700 mt-1">Administrator privileges are required to access this panel.</p>
        </div>
      </div>
    );
  }

  const totalRevenue = donations.reduce((s, d) => s + d.amount, 0);
  const pendingApps = applications.filter(a => a.status === 'pending').length;
  const activeUsers = users.filter(u => u.user.lastLoginAt && Date.now() - new Date(u.user.lastLoginAt).getTime() < 7 * 24 * 60 * 60 * 1000).length;

  const updateAppStatus = (appId: string, newStatus: string) => {
    const db = JSON.parse(localStorage.getItem('mdf_applications_db') || '[]');
    const idx = db.findIndex((a: any) => a.id === appId);
    if (idx !== -1) {
      db[idx].status = newStatus;
      db[idx].updatedAt = new Date().toISOString();
      localStorage.setItem('mdf_applications_db', JSON.stringify(db));
      setApplications(getAllApplications());
    }
  };

  const filterList = <T,>(list: T[], key: string): T[] => {
    if (!searchTerm) return list;
    return list.filter(item => {
      const val = key.split('.').reduce<any>((o, k) => (o as any)?.[k], item);
      return String(val || '').toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  const statusIcon = (status: string): React.ReactNode => {
    switch (status) {
      case 'pending': return <Clock className="w-3.5 h-3.5 text-amber-500" />;
      case 'in-review': return <Eye className="w-3.5 h-3.5 text-blue-500" />;
      case 'approved':
      case 'completed': return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
      case 'rejected': return <XCircle className="w-3.5 h-3.5 text-red-500" />;
      default: return null;
    }
  };

  const statusColor = (status: string): string => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'in-review': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'approved':
      case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleLogout = () => {
    onLogout();
    onNavigate('home');
  };

  const tabs: Array<{ id: AdminTab; label: string; icon: typeof LayoutDashboard; count?: number }> = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'applications', label: 'Applications', icon: FileText, count: pendingApps },
    { id: 'donations', label: 'Donations', icon: Heart },
    { id: 'users', label: 'User Base', icon: Users, count: users.length }
  ];

  return (
    <div className="bg-slate-100 min-h-screen animate-fade-in">
      
      {/* Top admin bar */}
      <div className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/images/logo.png" alt="MDF" className="w-9 h-9 object-contain" />
              <div>
                <span className="block text-sm font-bold leading-none">MDF Admin Console</span>
                <span className="text-[10px] text-slate-400">Internal Operations Portal</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg hover:bg-slate-800 transition-colors" title="Notifications">
                <Bell className="w-4 h-4" />
                {pendingApps > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold flex items-center justify-center">
                    {pendingApps}
                  </span>
                )}
              </button>
              <div className="hidden sm:flex items-center gap-2 text-xs">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  {user.fullName.charAt(0)}
                </div>
                <span className="font-semibold">{user.fullName}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getRoleColor('admin')}`}>
                  {getRoleLabel('admin')}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-slate-800 hover:bg-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" /> Exit
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-lg font-bold text-xs flex items-center gap-2 transition-all shrink-0 ${
                  activeTab === tab.id 
                    ? 'bg-white text-slate-900 shadow-xs' 
                    : 'bg-white/50 text-slate-600 hover:bg-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    activeTab === tab.id ? 'bg-red-500 text-white' : 'bg-red-100 text-red-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">+12% vs last month</span>
                </div>
                <span className="text-2xl font-extrabold text-slate-900">${totalRevenue.toLocaleString()}</span>
                <span className="block text-xs text-slate-500 mt-1">Total Revenue Collected</span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded">Needs attention</span>
                </div>
                <span className="text-2xl font-extrabold text-slate-900">{applications.length}</span>
                <span className="block text-xs text-slate-500 mt-1">Total Applications ({pendingApps} pending)</span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span className="text-[10px] text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded">Active now</span>
                </div>
                <span className="text-2xl font-extrabold text-slate-900">{activeUsers}</span>
                <span className="block text-xs text-slate-500 mt-1">Active users (7d) / {users.length} total</span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-5 h-5 text-amber-600" />
                  <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">Conversion</span>
                </div>
                <span className="text-2xl font-extrabold text-slate-900">
                  {users.length > 0 ? Math.round((donations.length / users.length) * 100) : 0}%
                </span>
                <span className="block text-xs text-slate-500 mt-1">Donor conversion rate</span>
              </div>
            </div>

            {/* Role distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 lg:col-span-2">
                <h3 className="font-bold text-sm text-slate-900 mb-4">Recent Applications</h3>
                {applications.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-8">No applications submitted yet.</p>
                ) : (
                  <div className="space-y-2">
                    {applications.slice(0, 5).map(app => (
                      <div key={app.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                        {statusIcon(app.status)}
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-semibold text-slate-900 block truncate">{app.title}</span>
                          <span className="text-[10px] text-slate-500 block truncate">{app.summary}</span>
                        </div>
                        <span className={`px-2 py-1 rounded text-[10px] font-bold border ${statusColor(app.status)} shrink-0`}>
                          {app.status.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <h3 className="font-bold text-sm text-slate-900 mb-4">User Role Distribution</h3>
                <div className="space-y-3">
                  {(['member', 'donor', 'volunteer', 'beneficiary', 'admin'] as UserRole[]).map(role => {
                    const count = users.filter(u => u.user.role === role).length;
                    const pct = users.length > 0 ? (count / users.length) * 100 : 0;
                    return (
                      <div key={role}>
                        <div className="flex justify-between items-center mb-1">
                          <span className={`text-xs font-bold ${getRoleColor(role)} px-2 py-0.5 rounded-full`}>
                            {getRoleLabel(role)}
                          </span>
                          <span className="text-xs font-semibold text-slate-900">{count}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* APPLICATIONS TAB */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search applications by title, reference, or summary..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2 pl-10 pr-3 text-xs focus:outline-hidden focus:border-blue-500"
                />
              </div>
              <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5" /> Filter
              </button>
            </div>

            {filterList(applications, 'title').length === 0 ? (
              <div className="text-center py-16">
                <p className="text-sm text-slate-500">No applications found.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filterList(applications, 'title').map(app => (
                  <div key={app.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-slate-900 truncate">{app.title}</h4>
                          <p className="text-xs text-slate-500 line-clamp-1">{app.summary}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px] text-slate-400">
                            <span className="font-mono">{app.referenceCode}</span>
                            <span>•</span>
                            <span>{new Date(app.submittedAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>User: {app.userId.slice(0, 8)}...</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={app.status}
                          onChange={(e) => updateAppStatus(app.id, e.target.value)}
                          className="text-[10px] font-bold border rounded-lg px-2 py-1.5 bg-white focus:outline-hidden focus:border-blue-500"
                        >
                          <option value="pending">PENDING</option>
                          <option value="in-review">IN REVIEW</option>
                          <option value="approved">APPROVED</option>
                          <option value="completed">COMPLETED</option>
                          <option value="rejected">REJECTED</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* DONATIONS TAB */}
        {activeTab === 'donations' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Donation Ledger ({donations.length} records)</h3>
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>
            </div>

            {donations.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-sm text-slate-500">No donations recorded yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold">
                    <tr>
                      <th className="text-left p-3">Ref</th>
                      <th className="text-left p-3">Donor ID</th>
                      <th className="text-left p-3">Amount</th>
                      <th className="text-left p-3">Frequency</th>
                      <th className="text-left p-3">Pillar</th>
                      <th className="text-left p-3">Date</th>
                      <th className="text-left p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filterList(donations, 'referenceCode').map(d => (
                      <tr key={d.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono text-[10px]">{d.referenceCode}</td>
                        <td className="p-3 text-slate-500">{d.userId.slice(0, 8)}...</td>
                        <td className="p-3 font-bold text-emerald-700">${d.amount}</td>
                        <td className="p-3 capitalize">{d.frequency}</td>
                        <td className="p-3">{d.pillar}</td>
                        <td className="p-3 text-slate-500">{new Date(d.date).toLocaleDateString()}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusColor(d.status)}`}>
                            {d.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search users by name, email, or role..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2 pl-10 pr-3 text-xs focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {filterList(users, 'user.email').length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-sm text-slate-500">No users found.</p>
                </div>
              ) : (
                filterList(users, 'user.email').map(({ user: u }) => (
                  <div key={u.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 text-white flex items-center justify-center font-bold shrink-0">
                      {u.fullName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900 truncate">{u.fullName}</span>
                        {u.isEmailVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />}
                      </div>
                      <span className="text-xs text-slate-500 truncate block">{u.email}</span>
                      <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400">
                        {u.country && (
                          <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{u.country}</span>
                        )}
                        {u.lastLoginAt && (
                          <span>Last login: {new Date(u.lastLoginAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${getRoleColor(u.role)}`}>
                        {getRoleLabel(u.role)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
