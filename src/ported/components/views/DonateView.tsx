import React, { useState } from 'react';
import { 
  Heart, 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Globe, 
  Building,
  Sparkles,
  FileText
} from 'lucide-react';
import { FOUNDATION_INFO } from '../../data/foundationData';

export const DonateView: React.FC = () => {
  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [amount, setAmount] = useState<number>(150);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [gateway, setGateway] = useState<'card' | 'momo' | 'paypal' | 'bank'>('card');
  
  // Donor details
  const [donor, setDonor] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: 'United States',
    isAnonymous: false,
    message: '',
    // Card specifics
    cardNumber: '',
    expiry: '',
    cvv: '',
    // MoMo specifics
    momoOperator: 'mtn',
    momoNumber: ''
  });

  const [processing, setProcessing] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  const donationTiers = [
    { amount: 25, label: 'Mobility Repair Kit', desc: 'Provides heavy-duty replacement wheels, toolkits, and local mechanic direct cash stipends.' },
    { amount: 50, label: 'Rehab Sessions', desc: 'Fully funds customized post-surgical physical therapy and orthopedic assessments.' },
    { amount: 150, label: 'Custom Wheelchair', desc: 'Procures and fits a brand new, all-terrain manual wheelchair adapted for rough terrains.' },
    { amount: 500, label: 'Livelihood Grant', desc: 'Sponsors a complete vocational startup asset kit and micro-loan for an adult with a disability.' },
  ];

  const handleAmountSelect = (tierAmount: number) => {
    setAmount(tierAmount);
    setCustomAmount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomAmount(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed > 0) {
      setAmount(parsed);
    } else {
      setAmount(0);
    }
  };

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount < 1) return;

    setProcessing(true);

    // Simulate secure payment processing
    setTimeout(() => {
      setProcessing(false);
      setCompleted(true);
      
      // Build beautiful dynamic receipt
      const randomRef = Math.floor(1000000 + Math.random() * 9000000);
      setReceiptData({
        refNumber: `MDF-TAX-${new Date().getFullYear()}-${randomRef}`,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        amount: amount,
        frequency: frequency,
        name: donor.isAnonymous ? 'Anonymous Philanthropist' : (donor.fullName || 'Valued Supporter'),
        email: donor.email || 'Not provided',
        gateway: gateway.toUpperCase(),
        allocatedPillar: amount <= 30 ? 'Mobility Repair & Biomedical Upkeep' : amount <= 100 ? 'Healthcare Access & Therapy' : 'Custom Mobility Aids & Inclusive Grants'
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1800);
  };

  const resetDonation = () => {
    setCompleted(false);
    setReceiptData(null);
    setAmount(150);
    setCustomAmount('');
  };

  return (
    <div className="space-y-12 py-10 animate-fade-in max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider inline-block">
          Secure Giving Portal
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Invest in Mobility and Dignity
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Your gift directly bypasses multi-layered bureaucracy. We instantly translate your donation into practical mobility aids, physical rehabilitation, and educational grants.
        </p>
      </div>

      {completed && receiptData ? (
        /* Official Tax Receipt */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden max-w-2xl mx-auto animate-fade-in">
          
          {/* Header Bar */}
          <div className="bg-blue-900 text-white p-6 sm:p-8 text-center relative">
            <div className="absolute top-4 right-4 bg-amber-400 text-slate-950 text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
              Official Tax Receipt
            </div>
            
            <div className="w-12 h-12 rounded-full bg-white text-blue-900 flex items-center justify-center mx-auto mb-3 shadow-xs">
              <Heart className="w-6 h-6 fill-blue-900" />
            </div>

            <h2 className="text-2xl font-bold">Thank You for Your Impact!</h2>
            <p className="text-blue-200 text-xs mt-1">
              {FOUNDATION_INFO.name} • Registered Non-Profit 501(c)(3) Equivalent
            </p>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center pb-6 border-b border-slate-200">
              <span className="text-xs text-slate-400 uppercase tracking-widest block font-medium">
                Total Contribution
              </span>
              <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 block mt-1">
                ${receiptData.amount}.00 <span className="text-xs font-normal text-slate-500 uppercase">{receiptData.frequency}</span>
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full mt-2">
                <CheckCircle2 className="w-3.5 h-3.5" /> Fully Paid & Allocated
              </span>
            </div>

            {/* Itemized parameters */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Receipt Reference ID:</span>
                <span className="font-mono font-bold text-slate-900">{receiptData.refNumber}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Date Received:</span>
                <span className="font-medium text-slate-900">{receiptData.date}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Donor Name:</span>
                <span className="font-medium text-slate-900">{receiptData.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Primary Allocation Pillar:</span>
                <span className="font-bold text-blue-700">{receiptData.allocatedPillar}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Payment Gateway:</span>
                <span className="font-medium text-slate-900">{receiptData.gateway} Secure Integration</span>
              </div>
            </div>

            {/* IRS / Legal footprint */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
              <p className="font-bold text-slate-700 mb-1">Tax Deductibility Statement</p>
              No goods or services were provided in exchange for this contribution other than intangible religious or charitable benefits. Please retain this receipt for your tax records.
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>Print Official Receipt</span>
              </button>
              <button
                onClick={resetDonation}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-xs transition-colors"
              >
                Make Another Gift
              </button>
            </div>

          </div>

        </div>
      ) : (
        /* Interactive Donation Form */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Tiers & Frequency */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Frequency selection */}
            <div className="bg-white p-2 rounded-xl border border-slate-200 flex gap-2">
              <button
                type="button"
                onClick={() => setFrequency('one-time')}
                className={`flex-1 py-3 rounded-lg font-bold text-xs transition-all ${
                  frequency === 'one-time' 
                    ? 'bg-blue-900 text-white shadow-xs' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                One-Time Gift
              </button>
              <button
                type="button"
                onClick={() => setFrequency('monthly')}
                className={`flex-1 py-3 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                  frequency === 'monthly' 
                    ? 'bg-blue-900 text-white shadow-xs' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Monthly Sustainer</span>
              </button>
            </div>

            {frequency === 'monthly' && (
              <div className="bg-blue-50 text-blue-900 text-xs p-3 rounded-lg border border-blue-100 flex items-center gap-2 animate-fade-in">
                <Heart className="w-4 h-4 fill-blue-600 text-blue-600 shrink-0" />
                <span>Monthly sustainers provide highly predictable aid, enabling us to schedule long-term repair clinics.</span>
              </div>
            )}

            {/* Tier Buttons */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Your Impact Level
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {donationTiers.map((tier) => {
                  const isSelected = amount === tier.amount && !customAmount;
                  return (
                    <button
                      type="button"
                      key={tier.amount}
                      onClick={() => handleAmountSelect(tier.amount)}
                      className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected 
                          ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-600' 
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className={`text-xl font-extrabold ${isSelected ? 'text-blue-700' : 'text-slate-900'}`}>
                            ${tier.amount}
                          </span>
                          {isSelected && (
                            <span className="bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                              Selected
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-bold text-slate-800 block mb-1">
                          {tier.label}
                        </span>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {tier.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Amount Input */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Or Enter Custom Contribution Amount ($ USD)
              </label>
              <div className="relative max-w-xs">
                <span className="absolute left-3 top-2.5 text-sm font-bold text-slate-400">$</span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={handleCustomChange}
                  placeholder="Other Amount"
                  min="1"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2 pl-7 pr-3 text-sm text-slate-900 font-bold focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            {/* Payment Gateway Selectors */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Secure Payment Method
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'card', label: 'Credit Card', icon: CreditCard },
                  { id: 'momo', label: 'Mobile Money', icon: Smartphone },
                  { id: 'paypal', label: 'PayPal', icon: Globe },
                  { id: 'bank', label: 'Bank Wire', icon: Building },
                ].map(gw => {
                  const Icon = gw.icon;
                  const isActive = gateway === gw.id;
                  return (
                    <button
                      type="button"
                      key={gw.id}
                      onClick={() => setGateway(gw.id as any)}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                        isActive 
                          ? 'border-amber-500 bg-amber-50/40 text-slate-950 font-bold ring-1 ring-amber-500' 
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
                      <span className="text-xs">{gw.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Form Sub-View */}
            <form onSubmit={handleDonateSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6">
              
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Donor Information</h3>
                <p className="text-xs text-slate-500">Provide details for your tax receipt generation.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required={!donor.isAnonymous}
                    disabled={donor.isAnonymous}
                    value={donor.fullName}
                    onChange={(e) => setDonor({...donor, fullName: e.target.value})}
                    placeholder={donor.isAnonymous ? "Anonymous Donor" : "Your legal name"}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={donor.email}
                    onChange={(e) => setDonor({...donor, email: e.target.value})}
                    placeholder="For itemized receipt delivery"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={donor.country}
                    onChange={(e) => setDonor({...donor, country: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Optional Encircling Message</label>
                  <input
                    type="text"
                    value={donor.message}
                    onChange={(e) => setDonor({...donor, message: e.target.value})}
                    placeholder="e.g. In honor of..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={donor.isAnonymous}
                    onChange={(e) => setDonor({...donor, isAnonymous: e.target.checked})}
                    className="text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span>Keep my donation completely anonymous on public impact rosters.</span>
                </label>
              </div>

              {/* Dynamic Gateway Interface */}
              <div className="pt-4 border-t border-slate-100">
                
                {gateway === 'card' && (
                  <div className="space-y-4 animate-fade-in">
                    <span className="text-xs font-bold text-slate-900 block">Credit / Debit Card Simulator</span>
                    
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Card Number</label>
                      <input
                        type="text"
                        required
                        value={donor.cardNumber}
                        onChange={(e) => setDonor({...donor, cardNumber: e.target.value})}
                        placeholder="•••• •••• •••• ••••"
                        maxLength={19}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-mono text-slate-900 focus:outline-hidden focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          required
                          value={donor.expiry}
                          onChange={(e) => setDonor({...donor, expiry: e.target.value})}
                          placeholder="MM / YY"
                          maxLength={5}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">CVV Code</label>
                        <input
                          type="password"
                          required
                          value={donor.cvv}
                          onChange={(e) => setDonor({...donor, cvv: e.target.value})}
                          placeholder="•••"
                          maxLength={4}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {gateway === 'momo' && (
                  <div className="space-y-4 animate-fade-in">
                    <span className="text-xs font-bold text-slate-900 block">African Mobile Money Integration</span>
                    <p className="text-[11px] text-slate-500">
                      Perfectly optimized for our regional networks. We initiate an immediate secure USSD PIN Push to your device.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Select Operator</label>
                        <select
                          value={donor.momoOperator}
                          onChange={(e) => setDonor({...donor, momoOperator: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                        >
                          <option value="mtn">MTN Mobile Money (MoMo)</option>
                          <option value="orange">Orange Money</option>
                          <option value="mpesa">Safaricom M-Pesa</option>
                          <option value="airtel">Airtel Money</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Mobile Account Number</label>
                        <input
                          type="tel"
                          required
                          value={donor.momoNumber}
                          onChange={(e) => setDonor({...donor, momoNumber: e.target.value})}
                          placeholder="e.g. 670 000 000"
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {gateway === 'paypal' && (
                  <div className="space-y-2 animate-fade-in text-center py-4 bg-slate-50 rounded-xl border border-slate-200">
                    <Globe className="w-8 h-8 text-blue-600 mx-auto" />
                    <span className="text-xs font-bold text-slate-900 block">PayPal Secure Redirect</span>
                    <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                      Upon clicking donate, our simulation authorizes your PayPal wallet seamlessly.
                    </p>
                  </div>
                )}

                {gateway === 'bank' && (
                  <div className="space-y-2 animate-fade-in text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block">Direct Wire Routing Details</span>
                    <p className="text-slate-600">
                      <strong>Bank:</strong> Inclusion Global Trust Bank<br />
                      <strong>Account Name:</strong> Manyang Disability Foundation<br />
                      <strong>SWIFT/BIC:</strong> MDFTGX22<br />
                      <strong>Routing / IBAN:</strong> US44 MDFT 0000 1234 5678
                    </p>
                    <p className="text-[10px] text-slate-400 pt-1">
                      Please use your full name as the transfer wire memo for fast reconciliation.
                    </p>
                  </div>
                )}

              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={processing || amount < 1}
                  className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold py-3.5 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <span>Processing Secure Authorization...</span>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 fill-slate-950 text-slate-950" />
                      <span>Authorize ${amount}.00 {frequency === 'monthly' ? 'Monthly' : 'Donation'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Secure Footing */}
              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 256-Bit SSL Encrypted
                </span>
                <span>•</span>
                <span>No Credit Card Stored</span>
              </div>

            </form>

          </div>

          {/* Right Column: Allocation & Summary */}
          <div className="space-y-6">
            
            {/* Realtime Impact Summary Card */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xs space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block">
                Instant Gift Calculation
              </span>

              <div>
                <span className="text-xs text-slate-400 block">Your Current Donation:</span>
                <span className="text-3xl font-extrabold text-white block">
                  ${amount}.00 <span className="text-xs font-normal text-slate-400">{frequency === 'monthly' ? '/ month' : ''}</span>
                </span>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-blue-400 block">What this gift can enable:</span>
                
                {amount < 30 ? (
                  <p className="text-slate-300 leading-relaxed">
                    Direct procurement of a complete heavy-duty wheel and repair tool set to overhaul a damaged custom wheelchair.
                  </p>
                ) : amount < 100 ? (
                  <p className="text-slate-300 leading-relaxed">
                    Sponsorship of 2-3 essential orthopedic assessments and neuro-rehabilitation physical therapy sessions.
                  </p>
                ) : amount < 300 ? (
                  <p className="text-slate-300 leading-relaxed">
                    Full localized assembly, individual custom seating adaptation, and home provision of a rugged all-terrain manual wheelchair.
                  </p>
                ) : (
                  <p className="text-slate-300 leading-relaxed">
                    Launching a complete self-reliance livelihood micro-enterprise with a startup asset toolkit for a disabled adult.
                  </p>
                )}
              </div>

              <div className="bg-slate-800 p-3 rounded-lg text-[11px] text-slate-300 space-y-1">
                <span className="font-bold text-white block">Stewardship Guarantee</span>
                <p>Over 90% of all direct donations go straight to equipment provision and field healthcare capacity.</p>
              </div>
            </div>

            {/* Donation FAQs */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Frequently Asked
              </h4>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">Is this gift tax-deductible?</span>
                  <p className="text-slate-500 mt-0.5">Yes, we operate under registered non-profit frameworks providing itemized legal IRS compliant receipts.</p>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800 block">Can I cancel my monthly giving?</span>
                  <p className="text-slate-500 mt-0.5">Absolutely. You can modify or pause your recurring sustainer pledge at any time via your donor dashboard or by emailing us.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
