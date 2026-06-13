import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  ArrowRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginViewProps {
  onSwitchToRegister: () => void;
  onLoginSuccess: (returnTo?: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSwitchToRegister, onLoginSuccess }) => {
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: '',
    rememberMe: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsProcessing(true);
    (async () => {
      const result = await login(form.email, form.password);
      if (result.success) {
        onLoginSuccess();
      } else {
        setError(result.error || 'Authentication failed.');
      }
      setIsProcessing(false);
    })();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        
        {/* Left: Brand panel */}
        <div className="hidden lg:block space-y-6">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="MDF Logo"
              className="w-16 h-16 object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">Manyang Disability Foundation</h1>
              <p className="text-xs text-blue-600 font-medium">Secure Member Portal</p>
            </div>
          </div>

          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Welcome back. <br />
            <span className="text-blue-600">Let's continue your impact.</span>
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed max-w-md">
            Access your beneficiary applications, donor history, volunteer schedules, and personalized foundation insights from your secure dashboard.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>256-bit encrypted session management</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Role-based access for all foundation tiers</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>GDPR-compliant personal data handling</span>
            </div>
          </div>
        </div>

        {/* Right: Login form */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <img src="/images/logo.png" alt="MDF Logo" className="w-12 h-12 object-contain" />
            <h1 className="text-lg font-bold text-slate-900">Sign in to MDF Portal</h1>
          </div>

          <h3 className="text-2xl font-bold text-slate-900">Sign in to your account</h3>
          <p className="text-xs text-slate-500 mt-1">
            Use your registered email and password to continue.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  placeholder="you@example.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2.5 pl-10 pr-3 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm({...form, password: e.target.value})}
                  placeholder="Enter your password"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2.5 pl-10 pr-10 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.rememberMe}
                  onChange={(e) => setForm({...form, rememberMe: e.target.checked})}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Remember me for 30 days</span>
              </label>
              <button type="button" className="text-xs text-blue-600 hover:underline font-medium">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-3 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                New to MDF?{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Create a free account
                </button>
              </p>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
};
