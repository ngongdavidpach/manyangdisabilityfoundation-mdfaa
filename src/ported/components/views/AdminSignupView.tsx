import React, { useState } from 'react';
import { 
  Lock, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Key, 
  UserPlus, 
  Server, 
  Database,
  Building,
  Radio
} from 'lucide-react';
import { FOUNDATION_INFO } from '../../data/foundationData';

export const AdminSignupView: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form parameters
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    department: 'biomedical',
    inviteCode: '',
    accessLevel: 'level-2',
    twoFactorPin: ''
  });

  const [error, setError] = useState('');
  const [registeredAdmin, setRegisteredAdmin] = useState<any>(null);

  // Simulated active invite keys valid for foundation administration
  const VALID_INVITES = ['MDF-ADMIN-2026', 'INCLUSION-SECURE-KEY', 'DAVID-PACH-CORE', 'ADMIN-ROOT-909'];

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Strict validation
    if (!form.fullName.trim() || !form.email.trim() || !form.password) {
      setError('Please populate all primary identification fields.');
      return;
    }

    if (form.password.length < 8) {
      setError('Administrative policy requires a master password of at least 8 characters.');
      return;
    }

    if (!VALID_INVITES.includes(form.inviteCode.trim().toUpperCase())) {
      setError('Invalid Operational Invite Code. This gateway is restricted to authorized foundation trustees.');
      return;
    }

    // Move to 2FA Simulator
    setStep(2);
  };

  const handle2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.twoFactorPin.length < 6) {
      setError('Please enter the 6-digit verification sequence sent to your registered secure key.');
      return;
    }

    // Success!
    setRegisteredAdmin({
      name: form.fullName,
      email: form.email,
      department: form.department.toUpperCase(),
      level: form.accessLevel.toUpperCase(),
      timestamp: new Date().toISOString(),
      nodeId: `NODE-SECURE-${Math.floor(1000 + Math.random() * 9000)}`
    });
    setStep(3);
  };

  const resetAdminFlow = () => {
    setStep(1);
    setRegisteredAdmin(null);
    setForm({
      fullName: '',
      email: '',
      password: '',
      department: 'biomedical',
      inviteCode: '',
      accessLevel: 'level-2',
      twoFactorPin: ''
    });
    setError('');
  };

  return (
    <div className="min-h-[80vh] py-12 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-100 animate-fade-in">
      
      <div className="max-w-md w-full space-y-8">
        
        {/* Gateway Identity */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center mx-auto border border-red-500/30 shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          
          <span className="text-[10px] font-bold tracking-widest text-red-500 uppercase block">
            Restricted System Access
          </span>
          
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Foundation Operations Portal
          </h2>
          
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Authorized backend registration for Manyang Disability Foundation system managers and field controllers.
          </p>
        </div>

        {/* Step 1: Core Form */}
        {step === 1 && (
          <form onSubmit={handleRegisterSubmit} className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-5 shadow-2xl">
            
            {error && (
              <div className="bg-red-950/80 border border-red-800/80 text-red-300 p-3 rounded-lg text-xs flex items-start gap-2 animate-fade-in">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Authorized Full Name
              </label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({...form, fullName: e.target.value})}
                placeholder="Staff Member Name"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-hidden focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Institutional Email Address
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                placeholder="name@manyangdisabilityfoundation.org"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-hidden focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Master Security Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({...form, password: e.target.value})}
                  placeholder="Minimum 8 characters"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 pr-10 text-xs text-white focus:outline-hidden focus:border-red-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Department
                </label>
                <select
                  value={form.department}
                  onChange={(e) => setForm({...form, department: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-hidden focus:border-red-500"
                >
                  <option value="biomedical">Biomedical & Repair</option>
                  <option value="medical">Medical & Rehab</option>
                  <option value="finance">Finance & Auditing</option>
                  <option value="logistics">Field Logistics</option>
                  <option value="communications">Media & Awareness</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Clearance Level
                </label>
                <select
                  value={form.accessLevel}
                  onChange={(e) => setForm({...form, accessLevel: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-hidden focus:border-red-500"
                >
                  <option value="level-1">Level 1 (Field Editor)</option>
                  <option value="level-2">Level 2 (Pillar Lead)</option>
                  <option value="level-3">Level 3 (Root Trustee)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Operational Invite Code *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500">
                  <Key className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={form.inviteCode}
                  onChange={(e) => setForm({...form, inviteCode: e.target.value})}
                  placeholder="e.g. MDF-ADMIN-2026"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-9 pr-3 text-xs font-mono text-amber-400 focus:outline-hidden focus:border-red-500 uppercase"
                />
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">
                Hint: Use <strong className="text-slate-400 select-all">MDF-ADMIN-2026</strong> for testing initialization.
              </span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md"
              >
                <UserPlus className="w-4 h-4" />
                <span>Initialize Secure Staff Profile</span>
              </button>
            </div>

            <div className="border-t border-slate-800 pt-3 text-[10px] text-slate-500 text-center space-y-1">
              <p>Strict Multi-Tenant Node Routing Active</p>
              <p>Attempts are logged under security protocols.</p>
            </div>

          </form>
        )}

        {/* Step 2: 2FA Authentication Simulation */}
        {step === 2 && (
          <form onSubmit={handle2FASubmit} className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-5 shadow-2xl animate-fade-in">
            
            <div className="text-center space-y-1">
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block">Security Checkpoint</span>
              <h3 className="text-lg font-bold text-white">Two-Factor Authorization</h3>
              <p className="text-xs text-slate-400">
                A verification handshake has been initiated with your foundation trustee hardware key.
              </p>
            </div>

            {error && (
              <div className="bg-red-950/80 border border-red-800/80 text-red-300 p-3 rounded-lg text-xs flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 text-center mb-2">
                Enter 6-Digit Verification Token
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={form.twoFactorPin}
                onChange={(e) => setForm({...form, twoFactorPin: e.target.value.replace(/\D/g, '')})}
                placeholder="••••••"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-center text-xl font-mono tracking-widest text-amber-400 focus:outline-hidden focus:border-red-500"
              />
              <span className="text-[10px] text-slate-500 block text-center mt-1">
                Simulated Key: Enter any 6 digits (e.g. <strong className="text-slate-400">123456</strong>)
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-lg text-xs transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1"
              >
                <span>Verify & Bind</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </form>
        )}

        {/* Step 3: Success Dashboard Preview */}
        {step === 3 && registeredAdmin && (
          <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6 shadow-2xl animate-fade-in">
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Staff Profile Commissioned</h3>
              <p className="text-xs text-emerald-400 font-mono">
                {registeredAdmin.nodeId} Bound
              </p>
            </div>

            {/* Admin identity block */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-500">Authorized Operator:</span>
                <span className="font-bold text-white">{registeredAdmin.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-500">Security Ring:</span>
                <span className="font-bold text-amber-400">{registeredAdmin.level}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-500">Assigned Division:</span>
                <span className="font-medium text-slate-300">{registeredAdmin.department}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Encryption Cert:</span>
                <span className="font-mono text-[10px] text-slate-400">RSA-4096 Active</span>
              </div>
            </div>

            {/* Simulated Live System Actions */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Backend Operations Simulator
              </span>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center gap-2">
                  <Server className="w-4 h-4 text-blue-500" />
                  <div className="text-[10px]">
                    <span className="block font-bold text-white">Intake DB</span>
                    <span className="block text-emerald-400">Online</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center gap-2">
                  <Database className="w-4 h-4 text-purple-500" />
                  <div className="text-[10px]">
                    <span className="block font-bold text-white">Donation Ledger</span>
                    <span className="block text-emerald-400">Synced</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center gap-2">
                  <Building className="w-4 h-4 text-amber-500" />
                  <div className="text-[10px]">
                    <span className="block font-bold text-white">Field API</span>
                    <span className="block text-emerald-400">Connected</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-red-500" />
                  <div className="text-[10px]">
                    <span className="block font-bold text-white">Audit Relays</span>
                    <span className="block text-emerald-400">Active</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-950/40 p-3 rounded-lg border border-blue-900/50 text-[11px] text-blue-300">
              Your session permissions are temporarily cached. To modify real administrative routes, execute local deployment credentials.
            </div>

            <div className="pt-2">
              <button
                onClick={resetAdminFlow}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-lg text-xs transition-colors"
              >
                Sign Out / Re-Initialize Key
              </button>
            </div>

          </div>
        )}

        {/* Footer info */}
        <div className="text-center">
          <p className="text-xs text-slate-600">
            {FOUNDATION_INFO.name} • Internal Administration Interface
          </p>
        </div>

      </div>

    </div>
  );
};
