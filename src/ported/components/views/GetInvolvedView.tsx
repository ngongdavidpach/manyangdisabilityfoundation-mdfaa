import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Users,
  Wrench,
  HeartPulse,
  GraduationCap,
  Globe
} from 'lucide-react';
import { FOUNDATION_INFO } from '../../data/foundationData';

export const GetInvolvedView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'volunteer' | 'partner'>('volunteer');
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Volunteer State
  const [vForm, setVForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: 'Cameroon',
    city: '',
    skills: [] as string[],
    availability: 'part-time',
    message: ''
  });

  // Partner State
  const [pForm, setPForm] = useState({
    orgName: '',
    contactPerson: '',
    email: '',
    phone: '',
    orgType: 'corporate',
    partnershipType: 'raw-materials',
    message: ''
  });

  const availableSkills = [
    { id: 'repair', label: 'Biomedical & Equipment Repair', icon: Wrench },
    { id: 'medical', label: 'Medical Care & Rehab Therapy', icon: HeartPulse },
    { id: 'education', label: 'Special Needs Inclusive Teaching', icon: GraduationCap },
    { id: 'logistics', label: 'Field Logistics & Distribution', icon: Users },
    { id: 'digital', label: 'Digital Awareness & Media', icon: Globe },
    { id: 'fundraising', label: 'Grant Writing & Fundraising', icon: Sparkles },
  ];

  const handleVSkillToggle = (skillId: string) => {
    setVForm(prev => {
      const exists = prev.skills.includes(skillId);
      return {
        ...prev,
        skills: exists ? prev.skills.filter(s => s !== skillId) : [...prev.skills, skillId]
      };
    });
  };

  const handleVSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vForm.fullName && vForm.email) {
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pForm.orgName && pForm.email) {
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const resetForms = () => {
    setSubmitted(false);
    setVForm({
      fullName: '', email: '', phone: '', country: 'Cameroon', city: '', skills: [], availability: 'part-time', message: ''
    });
    setPForm({
      orgName: '', contactPerson: '', email: '', phone: '', orgType: 'corporate', partnershipType: 'raw-materials', message: ''
    });
  };

  return (
    <div className="space-y-12 py-10 animate-fade-in max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider inline-block">
          Global Solidarity Network
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Join the Foundation's Mission
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Whether you are an individual wanting to volunteer your expert craft or an institution seeking to build sustainable inclusion, we invite you to actively collaborate with us.
        </p>
      </div>

      {submitted ? (
        <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm p-8 sm:p-12 text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Thank You for Your Generous Offer!</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your registration parameters have been directly forwarded to the MDF engagement team.
            </p>
          </div>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Our volunteer network managers typically assess profiles and schedule onboarding sessions within 3-5 business days.
          </p>
          <div className="pt-4">
            <button
              onClick={resetForms}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-lg text-xs transition-colors"
            >
              Submit Another Inquiry
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          
          {/* Tab switches */}
          <div className="grid grid-cols-2 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('volunteer')}
              className={`py-4 px-6 font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                activeTab === 'volunteer' 
                  ? 'bg-blue-50/50 text-blue-700 border-b-2 border-blue-600' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Individual Volunteer</span>
            </button>
            <button
              onClick={() => setActiveTab('partner')}
              className={`py-4 px-6 font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                activeTab === 'partner' 
                  ? 'bg-blue-50/50 text-blue-700 border-b-2 border-blue-600' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Corporate & NGO Partner</span>
            </button>
          </div>

          {/* Volunteer Form Content */}
          {activeTab === 'volunteer' && (
            <form onSubmit={handleVSubmit} className="p-6 sm:p-10 space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Volunteer Application</h3>
                <p className="text-xs text-slate-500">Provide your contact info and select the areas where your expertise can assist.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={vForm.fullName}
                    onChange={(e) => setVForm({...vForm, fullName: e.target.value})}
                    placeholder="Enter your full legal name"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={vForm.email}
                    onChange={(e) => setVForm({...vForm, email: e.target.value})}
                    placeholder="name@example.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={vForm.phone}
                    onChange={(e) => setVForm({...vForm, phone: e.target.value})}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={vForm.country}
                    onChange={(e) => setVForm({...vForm, country: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City / District</label>
                  <input
                    type="text"
                    value={vForm.city}
                    onChange={(e) => setVForm({...vForm, city: e.target.value})}
                    placeholder="Your primary city"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Select Your Skills & Contribution Areas (Multiple Choice)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {availableSkills.map(skill => {
                    const Icon = skill.icon;
                    const isSelected = vForm.skills.includes(skill.id);
                    return (
                      <button
                        type="button"
                        key={skill.id}
                        onClick={() => handleVSkillToggle(skill.id)}
                        className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                          isSelected 
                            ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold ring-1 ring-blue-600' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs leading-tight">{skill.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Availability</label>
                  <select
                    value={vForm.availability}
                    onChange={(e) => setVForm({...vForm, availability: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="part-time">A few hours per week</option>
                    <option value="events">On-call for major distribution days</option>
                    <option value="remote">Remote digital advising only</option>
                    <option value="full-time">Full-time sabbatical / field mission</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Additional Information</label>
                  <input
                    type="text"
                    value={vForm.message}
                    onChange={(e) => setVForm({...vForm, message: e.target.value})}
                    placeholder="Briefly mention relevant experience"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 text-right">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg text-xs transition-colors inline-flex items-center gap-1.5 shadow-xs"
                >
                  <span>Submit Volunteer Offer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Partner Form Content */}
          {activeTab === 'partner' && (
            <form onSubmit={handlePSubmit} className="p-6 sm:p-10 space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Institutional & Corporate Partnership</h3>
                <p className="text-xs text-slate-500">Initiate a formal alliance to deliver mobility and healthcare resources at scale.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Organization / Company Name *</label>
                  <input
                    type="text"
                    required
                    value={pForm.orgName}
                    onChange={(e) => setPForm({...pForm, orgName: e.target.value})}
                    placeholder="Legal name of entity"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={pForm.contactPerson}
                    onChange={(e) => setPForm({...pForm, contactPerson: e.target.value})}
                    placeholder="Full name & title"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Official Email *</label>
                  <input
                    type="email"
                    required
                    value={pForm.email}
                    onChange={(e) => setPForm({...pForm, email: e.target.value})}
                    placeholder="contact@company.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={pForm.phone}
                    onChange={(e) => setPForm({...pForm, phone: e.target.value})}
                    placeholder="Direct office line"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Entity Type</label>
                  <select
                    value={pForm.orgType}
                    onChange={(e) => setPForm({...pForm, orgType: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="corporate">Private Corporation / Enterprise</option>
                    <option value="hospital">Hospital / Healthcare Provider</option>
                    <option value="university">Academic Institution / University</option>
                    <option value="foundation">Philanthropic Foundation</option>
                    <option value="ngo">International Non-Governmental Organization</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Proposed Partnership Scope</label>
                  <select
                    value={pForm.partnershipType}
                    onChange={(e) => setPForm({...pForm, partnershipType: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="raw-materials">Donation of Raw Materials & Wheelchair Parts</option>
                    <option value="funding">Direct Programmatic Capacity Funding</option>
                    <option value="medical-staff">Deployment of Specialized Medical Personnel</option>
                    <option value="advocacy-media">Media Awareness & Co-Branded Advocacy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Partnership Message / Proposal Summary</label>
                <textarea
                  rows={3}
                  value={pForm.message}
                  onChange={(e) => setPForm({...pForm, message: e.target.value})}
                  placeholder="Outline the core goals of our collaboration..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 text-right">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg text-xs transition-colors inline-flex items-center gap-1.5 shadow-xs"
                >
                  <span>Submit Partnership Proposal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

        </div>
      )}

      {/* Auxiliary Contact */}
      <div className="text-center bg-slate-100 p-6 rounded-xl border border-slate-200 space-y-1">
        <p className="text-xs font-bold text-slate-900">Direct Institutional Relations</p>
        <p className="text-xs text-slate-600">
          For bilateral funding frameworks or urgent corporate giving, directly reach our Board Chair at <strong className="text-blue-600">{FOUNDATION_INFO.email}</strong>
        </p>
      </div>

    </div>
  );
};
