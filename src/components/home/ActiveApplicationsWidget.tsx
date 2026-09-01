import React from 'react';
import { 
  FileCheck, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  ShieldAlert, 
  CreditCard, 
  Calendar, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { LoanApplication, UserProfile } from '../../types';

interface ActiveApplicationsWidgetProps {
  user: UserProfile | null;
  loans: LoanApplication[];
  onOpenKyc: () => void;
  onOpenLoanDetails: (loan: LoanApplication) => void;
  onOpenPersonalLoan: () => void;
}

export const ActiveApplicationsWidget: React.FC<ActiveApplicationsWidgetProps> = ({
  user,
  loans,
  onOpenKyc,
  onOpenLoanDetails,
  onOpenPersonalLoan,
}) => {
  const activeLoans = loans.filter((l) => l.status === 'active' || l.status === 'approved');
  const isKycIncomplete = user && user.kycStatus !== 'verified';

  if (!user && activeLoans.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* KYC Alert Banner if Incomplete */}
      {isKycIncomplete && (
        <div className="rounded-2xl bg-amber-50/80 border border-amber-200/90 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Complete Digital KYC to Activate Loan Limit</h3>
                <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-semibold border border-amber-300">
                  Step 2 of 4
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Verify your DigiLocker Aadhaar & Bank details to unlock instant 2-minute loan disbursals up to ₹10,00,000.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenKyc}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#004856] hover:bg-[#003844] text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>Complete KYC Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Active Loans Card */}
      {activeLoans.length > 0 && (
        <div className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E8F7F9] border border-cyan-100 flex items-center justify-center text-[#004856]">
                <FileCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Active Loan & EMI Tracker</h3>
                <p className="text-xs text-slate-500">Disbursed by {activeLoans[0].partnerBank}</p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E8F7F9] text-[#004856] border border-cyan-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#004856] animate-pulse" />
              Active
            </span>
          </div>

          {activeLoans.map((loan) => (
            <div
              key={loan.id}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-slate-300 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">{loan.applicationNumber}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-white text-slate-700 font-medium border border-slate-200">
                    {loan.purpose}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-slate-900">₹{loan.amount.toLocaleString('en-IN')}</span>
                  <span className="text-xs text-slate-500">for {loan.tenureMonths} Months @ {loan.interestRate}% p.a.</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Next EMI</span>
                  <span className="text-sm font-bold text-slate-900">₹{loan.monthlyEmi.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-slate-500 block flex items-center gap-1 mt-0.5 font-medium">
                    <Calendar className="w-3 h-3 text-[#004856]" />
                    Due {loan.nextEmiDate ? new Date(loan.nextEmiDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '5th of next month'}
                  </span>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    onClick={() => onOpenLoanDetails(loan)}
                    className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span>View Schedule</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
