import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  Zap, 
  Truck, 
  TrendingUp, 
  DollarSign, 
  Lock, 
  HeartHandshake, 
  Calendar,
  Gift,
  ArrowRight,
  Info
} from 'lucide-react';
import { MEMBERSHIP_PLANS } from '../data/mockData';
import { UserMembership, MembershipPlan } from '../types';
import { formatINR } from '../utils/rentalCalculations';

interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  userMembership: UserMembership | null;
  onActivatePlan: (plan: MembershipPlan) => void;
  onCancelMembership?: () => void;
}

export const MembershipModal: React.FC<MembershipModalProps> = ({
  isOpen,
  onClose,
  userMembership,
  onActivatePlan,
  onCancelMembership,
}) => {
  const [activeTab, setActiveTab] = useState<'customer' | 'admin_profitability'>('customer');
  const [selectedBilling, setSelectedBilling] = useState<'monthly' | 'annual'>('monthly');
  const [successNotice, setSuccessNotice] = useState(false);

  if (!isOpen) return null;

  const handleSelectPlan = (plan: MembershipPlan) => {
    onActivatePlan(plan);
    setSuccessNotice(true);
    setTimeout(() => {
      setSuccessNotice(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex justify-center p-3 sm:p-6">
      <div 
        className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#53101E] via-[#3B0913] to-[#2B050D] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-[#C69947]/30 border border-[#DFC07A]/50 text-[#DFC07A]">
              <Crown className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-[#DFC07A]">
              StylePass Fashion Royalty Club
            </span>
          </div>

          <h2 className="font-cinzel text-xl sm:text-3xl font-bold">
            Zero Security Deposits. Free Same-Day Delivery.
          </h2>
          <p className="text-xs sm:text-sm text-stone-200 mt-1 max-w-xl">
            Designed to make luxury ethnic wear, tuxedos, and costumes accessible with complete peace of mind and maximum customer savings.
          </p>

          {/* Tab Selector: Customer vs Admin Logic */}
          <div className="flex items-center gap-2 mt-5 bg-white/10 p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab('customer')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'customer'
                  ? 'bg-white text-[#53101E] shadow-sm'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              👑 Customer Plans & Perks
            </button>
            <button
              onClick={() => setActiveTab('admin_profitability')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'admin_profitability'
                  ? 'bg-[#DFC07A] text-[#53101E] shadow-sm'
                  : 'text-[#DFC07A] hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Admin Profitability Engine</span>
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {successNotice && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs font-bold flex items-center justify-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>StylePass Membership successfully updated! Benefits apply instantly to your cart and rentals.</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Active Membership Banner (if user already subscribed) */}
          {userMembership?.isActive && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#53101E] text-[#DFC07A] flex items-center justify-center font-bold">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-[#53101E]">
                      Your {userMembership.planName} is Active
                    </h4>
                    <span className="text-[10px] font-bold uppercase bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                      Active Member
                    </span>
                  </div>
                  <p className="text-xs text-stone-600">
                    Total Estimated Savings to Date: <strong className="text-emerald-700">{formatINR(userMembership.totalSavedAmount || 2450)}</strong> (Deposits waived, free backup sizes & express deliveries)
                  </p>
                </div>
              </div>

              {onCancelMembership && (
                <button
                  onClick={onCancelMembership}
                  className="text-xs text-stone-500 hover:text-red-700 underline font-medium cursor-pointer"
                >
                  Manage / Cancel Plan
                </button>
              )}
            </div>
          )}

          {/* TAB 1: CUSTOMER PLANS */}
          {activeTab === 'customer' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-stone-900 font-cinzel">
                    Choose Your StylePass Tier
                  </h3>
                  <p className="text-xs text-stone-500">
                    Cancel or change your subscription anytime with 1 click.
                  </p>
                </div>

                {/* Billing toggle */}
                <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-full text-xs font-semibold">
                  <button
                    onClick={() => setSelectedBilling('monthly')}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                      selectedBilling === 'monthly' ? 'bg-[#53101E] text-white' : 'text-stone-600'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setSelectedBilling('annual')}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
                      selectedBilling === 'annual' ? 'bg-[#53101E] text-white' : 'text-stone-600'
                    }`}
                  >
                    <span>Annual</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full">Save 25%</span>
                  </button>
                </div>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {MEMBERSHIP_PLANS.map((plan) => {
                  const isCurrent = userMembership?.planId === plan.id;
                  const price = selectedBilling === 'annual' 
                    ? Math.round(plan.price * 9) // 25% discount on annual
                    : plan.price;
                  const period = selectedBilling === 'annual' ? '/ year' : '/ month';

                  return (
                    <div
                      key={plan.id}
                      className={`rounded-2xl border p-5 flex flex-col justify-between transition-all relative ${
                        plan.popular
                          ? 'border-[#53101E] shadow-xl bg-gradient-to-b from-[#53101E]/5 to-white ring-2 ring-[#53101E]/20'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      {/* Popular ribbon */}
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#53101E] text-[#DFC07A] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                          Most Popular · Zero Deposit
                        </div>
                      )}

                      <div className="space-y-4">
                        <div>
                          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                            {plan.badge}
                          </span>
                          <h4 className="text-lg font-bold text-stone-900 mt-0.5">{plan.name}</h4>
                          <p className="text-xs text-stone-500 line-clamp-2 mt-1">{plan.tagline}</p>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-1 pt-2 border-t border-stone-100">
                          <span className="text-2xl font-black text-[#53101E]">{formatINR(price)}</span>
                          <span className="text-xs text-stone-500 font-medium">{period}</span>
                        </div>

                        {/* Key highlight badges */}
                        <div className="space-y-1.5">
                          {plan.securityDepositWaiver && (
                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg">
                              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>100% Zero Security Deposit</span>
                            </div>
                          )}

                          {plan.freeSameDayDelivery && (
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-800 bg-stone-50 px-2 py-1 rounded-lg">
                              <Truck className="w-3.5 h-3.5 text-[#53101E] shrink-0" />
                              <span>Free Unlimited Same-Day Deliveries</span>
                            </div>
                          )}

                          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900 bg-amber-50 px-2 py-1 rounded-lg">
                            <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>2-Hour Emergency Delivery: {plan.express2HrFee === 0 ? 'FREE 1x/mo' : `₹${plan.express2HrFee} only`}</span>
                          </div>
                        </div>

                        {/* Detailed feature list */}
                        <div className="space-y-2 pt-2 border-t border-stone-100">
                          <span className="text-[11px] font-bold uppercase text-stone-400">Included Benefits</span>
                          <ul className="space-y-1.5 text-xs text-stone-700">
                            {plan.customerBenefits.map((b, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Subscribe CTA */}
                      <div className="pt-5 mt-4 border-t border-stone-100">
                        <button
                          onClick={() => handleSelectPlan(plan)}
                          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5 ${
                            isCurrent
                              ? 'bg-emerald-600 text-white'
                              : plan.popular
                                ? 'bg-[#53101E] text-white hover:bg-[#3B0913]'
                                : 'bg-stone-900 text-white hover:bg-stone-800'
                          }`}
                        >
                          {isCurrent ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Current Plan</span>
                            </>
                          ) : (
                            <>
                              <span>Activate {plan.name}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: ADMIN & BUSINESS PROFITABILITY ENGINE */}
          {activeTab === 'admin_profitability' && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <span>Why StylePass Membership is Profitable & Logical for Platform Economics</span>
                </div>
                <p className="text-xs text-amber-900/90 leading-relaxed">
                  In clothing rental platforms, the #1 barrier to customer checkout is the upfront security deposit (₹1,500 - ₹3,000 lock-in). By monetizing trust through subscriptions and combining verified KYC + card pre-authorization, Style-Rent expands customer lifetime value while maintaining zero delinquent default.
                </p>
              </div>

              {/* 4 Pillars of Admin Profitability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-stone-200 bg-white space-y-2 shadow-2xs">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-stone-900">
                    1. High-Margin Recurring Subscription Cash Flow (MRR)
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Clothing rentals are naturally seasonal (wedding & festival spikes). Membership brings consistent, upfront cash flow of <strong>₹499/mo per subscriber</strong> that protects operating margins in off-season months.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-stone-200 bg-white space-y-2 shadow-2xs">
                  <div className="w-9 h-9 rounded-xl bg-[#53101E]/10 text-[#53101E] flex items-center justify-center font-bold">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-stone-900">
                    2. 3.8x Frequency & Lifetime Value (LTV)
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Non-members rent once or twice a year. Because members pay ZERO security deposit, their rental friction drops by 80%. Members average <strong>4.2 rentals per season</strong> for corporate galas, dates, shoots, and college functions.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-stone-200 bg-white space-y-2 shadow-2xs">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-stone-900">
                    3. Risk Controlled via Aadhaar KYC & Card Hold
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Deposit waiver is strictly gated behind verified Government ID (Aadhaar/PAN) and active payment card. Across luxury sharing economies, verified subscriber delinquency is less than <strong>0.04%</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-stone-200 bg-white space-y-2 shadow-2xs">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-stone-900">
                    4. Profitable Emergency Logistics Unit Economics
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    2-Hour Emergency Delivery costs ~₹80 to ₹100 via hyperlocal courier partners (Dunzo/Porter/Shadowfax). Charging non-members <strong>₹299</strong> yields a 66% gross margin, while members paying <strong>₹149</strong> still generate positive unit margins.
                  </p>
                </div>
              </div>

              {/* Unit Economics Comparison Table */}
              <div className="rounded-2xl border border-stone-200 overflow-hidden bg-white">
                <div className="p-4 bg-[#FAF7F2] border-b border-stone-200">
                  <h4 className="font-bold text-sm text-stone-900 font-cinzel">
                    Annual Financial Comparison: Member vs Non-Member
                  </h4>
                </div>
                <div className="p-4 overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-stone-200 text-stone-500 font-semibold">
                        <th className="pb-2">Metric</th>
                        <th className="pb-2">Standard Non-Member</th>
                        <th className="pb-2 text-[#53101E] font-bold">StylePass Gold Member</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-800">
                      <tr>
                        <td className="py-2.5 font-medium">Annual Rental Bookings</td>
                        <td className="py-2.5">1.2 orders / yr</td>
                        <td className="py-2.5 font-bold text-emerald-800">4.5 orders / yr (+275%)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-medium">Annual Gross Revenue / Customer</td>
                        <td className="py-2.5">₹1,800</td>
                        <td className="py-2.5 font-bold text-[#53101E]">₹7,850 + ₹5,988 Subscription = ₹13,838</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-medium">Customer Acquisition Cost (CAC) Amortization</td>
                        <td className="py-2.5">High (single order CAC ~₹450)</td>
                        <td className="py-2.5 font-bold text-emerald-800">Low (CAC recovered in month 1)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-medium">Damage & Dispute Rate</td>
                        <td className="py-2.5">4.2%</td>
                        <td className="py-2.5 font-bold text-emerald-800">&lt; 0.6% (Members treat clothes like their own)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            Have questions? Call Member Concierge: <strong className="text-stone-800">022-STYLE-PASS</strong>
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 text-xs font-bold rounded-full bg-[#53101E] text-white hover:bg-[#3B0913] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
