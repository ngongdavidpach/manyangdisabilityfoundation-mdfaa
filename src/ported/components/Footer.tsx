import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Heart, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { FOUNDATION_INFO } from '../data/foundationData';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const handleLink = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Top Banner for Urgent Aid Call */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 py-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-white">Can you help restore mobility today?</h3>
            <p className="text-blue-200 text-sm mt-1 max-w-xl">
              Your contribution procures custom wheelchairs, funds crucial physical rehabilitation, and builds inclusive classroom tools for vulnerable children.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <button 
              onClick={() => handleLink('donate')}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-3 rounded-lg text-sm transition-all shadow-sm flex items-center gap-2"
            >
              <Heart className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>Donate Now</span>
            </button>
            <button 
              onClick={() => handleLink('get-involved')}
              className="bg-white/10 hover:bg-white/20 text-white font-medium px-5 py-3 rounded-lg text-sm transition-all"
            >
              Become a Volunteer
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Column 1: Identity & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="Manyang Disability Foundation Official Logo"
                className="w-12 h-12 object-contain drop-shadow-sm"
              />
              <span className="font-bold text-lg text-white tracking-tight">
                Manyang Disability Foundation
              </span>
            </div>
            
            <p className="text-sm text-slate-400 leading-relaxed">
              {FOUNDATION_INFO.mission}
            </p>

            <div className="pt-2">
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Connect With Us
              </span>
              <div className="flex gap-3">
                {Object.entries(FOUNDATION_INFO.socials).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-slate-800 hover:bg-blue-600 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                    aria-label={`Visit our ${platform} page`}
                  >
                    <span className="text-xs font-medium capitalize">
                      {platform.charAt(0)}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Home Page', id: 'home' },
                { label: 'About MDF', id: 'about' },
                { label: 'Our Core Programs', id: 'programs' },
                { label: 'Impact Gallery', id: 'gallery' },
                { label: 'Request Assistance', id: 'request' },
                { label: 'News & Events', id: 'news' },
                { label: 'Volunteer & Partner', id: 'get-involved' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleLink(link.id)}
                    className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5 group text-left"
                  >
                    <span className="group-hover:translate-x-1 transition-transform text-blue-500">›</span>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Impact Pillars */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Impact Pillars
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>Mobility & Wheelchairs</li>
              <li>Surgical & Physical Rehab</li>
              <li>Inclusive Education</li>
              <li>Livelihood Micro-grants</li>
              <li>Policy Advocacy</li>
              <li>Emergency Aid Repairs</li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Headquarters
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span>{FOUNDATION_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                <span>{FOUNDATION_INFO.phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="truncate">{FOUNDATION_INFO.email}</span>
              </li>
              <li className="pt-2 text-xs text-slate-500 border-t border-slate-800">
                {FOUNDATION_INFO.workingHours}
              </li>
            </ul>
          </div>

        </div>

        {/* Newsletter section */}
        <div className="mt-12 pt-8 border-t border-slate-800 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-1">
            <h5 className="text-sm font-semibold text-white">Subscribe to Impact Updates</h5>
            <p className="text-xs text-slate-400 mt-1">
              Receive inspiring quarterly stories directly from the field.
            </p>
          </div>
          <div className="lg:col-span-2">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md lg:max-w-none lg:justify-end">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="bg-slate-800 text-sm text-white px-4 py-2.5 rounded-lg border border-slate-700 focus:outline-hidden focus:border-blue-500 w-full sm:w-72"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1 shrink-0"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            {subscribed && (
              <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1 lg:justify-end animate-fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" /> Thank you! You've been successfully subscribed.
              </p>
            )}
          </div>
        </div>

      </div>

      {/* Bottom legal footprint */}
      <div className="bg-slate-950 py-6 text-xs text-slate-500 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p 
            onDoubleClick={() => handleLink('admin-signup')}
            className="cursor-default"
            title="Double-click to access administrative root"
          >
            © {new Date().getFullYear()} {FOUNDATION_INFO.name}. All rights reserved. Providing the care your loved ones deserve.
          </p>
          <div className="flex items-center gap-4">
            <button onClick={() => handleLink('about')} className="hover:text-slate-400 transition-colors">Privacy Policy</button>
            <span>•</span>
            <button onClick={() => handleLink('about')} className="hover:text-slate-400 transition-colors">Financial Governance</button>
            <span>•</span>
            <button onClick={() => handleLink('request')} className="hover:text-slate-400 transition-colors">Terms of Assistance</button>
            <span>•</span>
            <button 
              onClick={() => handleLink('admin-signup')} 
              className="w-4 h-4 rounded text-slate-800 hover:text-red-500 transition-colors flex items-center justify-center focus:outline-hidden"
              title="Staff Authorization Gateway"
              aria-label="Staff Portal Access"
            >
              <span className="text-[10px] font-mono">π</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
