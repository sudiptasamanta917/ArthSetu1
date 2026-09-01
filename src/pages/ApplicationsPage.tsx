import React, { useState } from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Download, 
  AlertCircle, 
  Building2, 
  Calendar, 
  Banknote,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { UserProfile, LoanApplication } from '../types';

interface ApplicationsPageProps {
  user: UserProfile | null;
  loans: LoanApplication[];
  onNavigateToPersonalLoan: () => void;
  onNavigateToBusinessLoan: () => void;
  onNavigateToKyc: () => void;
}

export const ApplicationsPage: React.FC<ApplicationsPageProps> = ({
  user,
  loans,
  onNavigateToPersonalLoan,
  onNavigateToBusinessLoan,
  onNavigateToKyc,
}) => {
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(loans[0]?.id || null);

  const selectedLoan = loans.find((l) => l.id === selectedLoanId) || loans[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="rounded-2xl bg-teal-900 text-white p-6 sm:p-8 border border-teal-800 shadow-sm relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-800/80 border border-teal-700 text-teal-200 text-xs font-semibold">
            <FileText className="w-3.5 h-3.5 text-teal-300" />
            <span>Real-Time Loan Lifecycle & Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            My Loan Applications & Disbursals
          </h1>
          <p className="text-sm text-teal-200 leading-relaxed">
            Track stage-by-stage status of your personal and business loan applications, download official sanction letters, view repayment schedules, and manage monthly EMIs.
          </p>
        </div>
      </div>

      {loans.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Banknote className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900">No Active Loan Applications</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't submitted any loan requests yet. Check your eligibility and apply in under 2 minutes.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onNavigateToPersonalLoan}
              className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-xs transition cursor-pointer"
            >
              Apply for Personal Loan
            </button>
            <button
              onClick={onNavigateToBusinessLoan}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              Apply for Business Loan
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Applications List */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Submitted Applications ({loans.length})
            </h2>
            {loans.map((loan) => {
              const isSelected = (selectedLoan?.id === loan.id);
              return (
                <button
                  key={loan.id}
                  onClick={() => setSelectedLoanId(loan.id)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-teal-50/70 border-teal-800 shadow-xs ring-2 ring-teal-800/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 capitalize">
                      {loan.loanType} Loan
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                      {loan.status}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-black text-slate-900">
                      ₹{loan.amount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">{loan.id}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span>Lender: <strong className="text-slate-700">{loan.lenderName}</strong></span>
                    <span>EMI: <strong className="text-teal-800">₹{loan.emi.toLocaleString('en-IN')}/m</strong></span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Loan Details & Progress Tracker */}
          {selectedLoan && (
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Application #{selectedLoan.id}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sanctioned by <strong className="text-teal-800">{selectedLoan.lenderName}</strong> on {selectedLoan.appliedDate}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-teal-900">
                    ₹{selectedLoan.amount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {selectedLoan.tenureMonths} Months @ {selectedLoan.interestRate}% p.a.
                  </span>
                </div>
              </div>

              {/* Step Tracking Line */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Live Application Tracker
                </h4>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
                  {[
                    { stage: 'Application Form Submitted', time: 'Completed', done: true },
                    { stage: 'DigiLocker e-KYC & Bureau Check', time: 'Verified 100%', done: true },
                    { stage: 'Credit Underwriting & Sanction', time: 'Approved', done: true },
                    { 
                      stage: selectedLoan.status === 'disbursed' ? 'Direct Bank Disbursal' : 'Disbursal in Progress', 
                      time: selectedLoan.status === 'disbursed' ? 'Credited to Bank Account' : 'Ready within 2 minutes', 
                      done: selectedLoan.status === 'disbursed' 
                    },
                  ].map((step, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        step.done ? 'bg-teal-800 text-white' : 'bg-amber-100 text-amber-800 animate-pulse'
                      }`}>
                        {step.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                      </div>
                      <div className="flex-1 flex items-center justify-between">
                        <span className="font-semibold text-slate-900">{step.stage}</span>
                        <span className="text-[11px] text-slate-500 font-medium">{step.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Repayment Schedule Info */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Monthly EMI Amount</span>
                  <span className="font-bold text-slate-900 text-sm">₹{selectedLoan.emi.toLocaleString('en-IN')}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Next Due Date</span>
                  <span className="font-bold text-teal-800 text-sm">5th Next Month</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => alert(`Sanction Letter PDF for ${selectedLoan.id} generated and downloaded.`)}
                  className="w-full sm:flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Sanction Letter</span>
                </button>
                <button
                  type="button"
                  onClick={onNavigateToPersonalLoan}
                  className="w-full sm:flex-1 py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Apply for Another Loan</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
