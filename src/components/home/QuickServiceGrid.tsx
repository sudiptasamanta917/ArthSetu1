import React from 'react';
import { 
  Banknote, 
  Briefcase, 
  Award, 
  ShieldCheck, 
  Landmark, 
  Coins, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Percent, 
  Zap, 
  Clock, 
  Lock
} from 'lucide-react';
import { UserProfile } from '../../types';

interface QuickServiceGridProps {
  user: UserProfile | null;
  onOpenPersonalLoan: () => void;
  onOpenBusinessLoan: () => void;
  onOpenCibil: () => void;
  onOpenKyc: () => void;
  onOpenFixedDeposit: () => void;
  onOpenInvestments: () => void;
}

export const QuickServiceGrid: React.FC<QuickServiceGridProps> = ({
  user,
  onOpenPersonalLoan,
  onOpenBusinessLoan,
  onOpenCibil,
  onOpenKyc,
  onOpenFixedDeposit,
  onOpenInvestments,
}) => {
  const isKycVerified = user?.kycStatus === 'verified';

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Core Financial Services</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              Money View Suite
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Instant paperless credit, guaranteed savings, and smart investment tools
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Personal Loan Card */}
        <div 
          onClick={onOpenPersonalLoan}
          className="group relative rounded-2xl bg-white p-5 border border-slate-200/90 hover:border-teal-500/70 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-800 group-hover:scale-105 transition-transform">
                <Banknote className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200/80 flex items-center gap-1">
                <Zap className="w-3 h-3 text-teal-700" />
                Pre-Approved
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-800 transition-colors flex items-center gap-1.5">
                <span>Personal Loan</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-teal-700" />
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Instant credit up to ₹10 Lakhs directly to your bank account with low interest rates from 1.33% p.m.
              </p>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-2 border-t border-slate-100">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Max Amount</span>
                <p className="text-xs font-bold text-slate-900">Up to ₹10,00,000</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Tenure</span>
                <p className="text-xs font-bold text-slate-900">3 to 60 Months</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 flex items-center justify-between text-xs text-teal-800 font-semibold border-t border-slate-100">
            <span>Check Eligibility in 2 Mins</span>
            <span className="text-[11px] bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/80 text-teal-800 font-bold">Apply Now</span>
          </div>
        </div>

        {/* 2. Business Loan Card */}
        <div 
          onClick={onOpenBusinessLoan}
          className="group relative rounded-2xl bg-white p-5 border border-slate-200/90 hover:border-teal-500/70 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-800 group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Collateral-Free
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-800 transition-colors flex items-center gap-1.5">
                <span>Business Loan</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-teal-700" />
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Scale your enterprise with unsecured working capital up to ₹50 Lakhs. Quick sanction with GST returns.
              </p>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-2 border-t border-slate-100">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Sanction Limit</span>
                <p className="text-xs font-bold text-slate-900">Up to ₹50 Lakhs</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Repayment</span>
                <p className="text-xs font-bold text-slate-900">Flexible Terms</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 flex items-center justify-between text-xs text-teal-800 font-semibold border-t border-slate-100">
            <span>Fast Business Financing</span>
            <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 text-slate-800 font-bold">Explore Loan</span>
          </div>
        </div>

        {/* 3. CIBIL Score Check Card */}
        <div 
          onClick={onOpenCibil}
          className="group relative rounded-2xl bg-white p-5 border border-slate-200/90 hover:border-teal-500/70 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 group-hover:scale-105 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Free Monthly Refresh
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-800 transition-colors flex items-center gap-1.5">
                <span>CIBIL Credit Score</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-emerald-700" />
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Check your TransUnion CIBIL score with zero impact. Full factor analysis & simulator to maximize loan approvals.
              </p>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-2 border-t border-slate-100">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Your Score</span>
                <p className="text-xs font-bold text-emerald-700">{user ? `${user.creditScore} (Excellent)` : '785 (Free Check)'}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Bureau</span>
                <p className="text-xs font-bold text-slate-900">TransUnion</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 flex items-center justify-between text-xs text-emerald-700 font-semibold border-t border-slate-100">
            <span>View Full Bureau Report</span>
            <span className="text-[11px] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-emerald-800 font-bold">Check Free</span>
          </div>
        </div>

        {/* 4. Digital KYC Verification Card */}
        <div 
          onClick={onOpenKyc}
          className="group relative rounded-2xl bg-white p-5 border border-slate-200/90 hover:border-teal-500/70 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-800 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                isKycVerified 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
              }`}>
                {isKycVerified ? 'Verified Active' : 'Step 2 Pending'}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-800 transition-colors flex items-center gap-1.5">
                <span>Digital KYC for New Users</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-teal-700" />
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Paperless 1-minute DigiLocker Aadhaar & PAN verification. Unlock instant disbursal and maximum credit limits.
              </p>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-2 border-t border-slate-100">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Mode</span>
                <p className="text-xs font-bold text-slate-900">DigiLocker & OTP</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Status</span>
                <p className={`text-xs font-bold ${isKycVerified ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {isKycVerified ? '100% Verified' : 'Action Required'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 flex items-center justify-between text-xs text-teal-800 font-semibold border-t border-slate-100">
            <span>{isKycVerified ? 'View KYC Documents' : 'Complete in 1 Minute'}</span>
            <span className="text-[11px] bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/80 text-teal-800 font-bold">
              {isKycVerified ? 'Manage' : 'Verify Now'}
            </span>
          </div>
        </div>

        {/* 5. Fixed Deposit Option Card */}
        <div 
          onClick={onOpenFixedDeposit}
          className="group relative rounded-2xl bg-white p-5 border border-slate-200/90 hover:border-teal-500/70 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 group-hover:scale-105 transition-transform">
                <Landmark className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                Up to 9.15% p.a.
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-800 transition-colors flex items-center gap-1.5">
                <span>Fixed Deposit (FD)</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-amber-700" />
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Book high-interest FDs from Shriram Finance, Bajaj Finance, & Unity SFB. Guaranteed returns with DICGC insurance.
              </p>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-2 border-t border-slate-100">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Senior Rate</span>
                <p className="text-xs font-bold text-amber-700">9.15% p.a.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Min Deposit</span>
                <p className="text-xs font-bold text-slate-900">₹1,000 Only</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 flex items-center justify-between text-xs text-amber-800 font-semibold border-t border-slate-100">
            <span>Calculate FD Returns</span>
            <span className="text-[11px] bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-amber-900 font-bold">Book FD</span>
          </div>
        </div>

        {/* 6. Investments (Mutual Funds & Gold) Card */}
        <div 
          onClick={onOpenInvestments}
          className="group relative rounded-2xl bg-white p-5 border border-slate-200/90 hover:border-teal-500/70 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-800 group-hover:scale-105 transition-transform">
                <Coins className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200/80">
                0% Commission
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-800 transition-colors flex items-center gap-1.5">
                <span>Investments & 24K Gold</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-teal-700" />
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Invest in top 5-star mutual funds & 99.9% pure 24K digital gold. Start monthly SIP with just ₹100.
              </p>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-2 border-t border-slate-100">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Min SIP</span>
                <p className="text-xs font-bold text-slate-900">₹100 / Month</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Asset Classes</span>
                <p className="text-xs font-bold text-teal-800">Equity • Gold • Debt</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 flex items-center justify-between text-xs text-teal-800 font-semibold border-t border-slate-100">
            <span>Explore High Alpha Funds</span>
            <span className="text-[11px] bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/80 text-teal-800 font-bold">Invest Now</span>
          </div>
        </div>
      </div>
    </section>
  );
};
