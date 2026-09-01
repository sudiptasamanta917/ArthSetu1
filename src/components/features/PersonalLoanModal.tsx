import React, { useState, useMemo } from 'react';
import { 
  X, 
  Banknote, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Percent, 
  Calendar, 
  Building2, 
  FileText,
  Clock,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { loanApi } from '../../api/loanApi';
import { UserProfile, LoanApplication } from '../../types';

interface PersonalLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  initialAmount?: number;
  initialTenure?: number;
  onLoanApplied: (loan: LoanApplication) => void;
}

export const PersonalLoanModal: React.FC<PersonalLoanModalProps> = ({
  isOpen,
  onClose,
  user,
  initialAmount = 250000,
  initialTenure = 24,
  onLoanApplied,
}) => {
  const [amount, setAmount] = useState<number>(initialAmount);
  const [tenure, setTenure] = useState<number>(initialTenure);
  const [purpose, setPurpose] = useState<string>('Home Renovation & Appliances');
  const [bankAccount, setBankAccount] = useState<string>(user?.bankDetails?.accountNumber || '••••••••4892');
  const [loading, setLoading] = useState(false);
  const [sanctionedLoan, setSanctionedLoan] = useState<LoanApplication | null>(null);

  const emiCalc = useMemo(() => {
    return loanApi.calculateEmi(amount, tenure, 14.0);
  }, [amount, tenure]);

  if (!isOpen) return null;

  const PURPOSES = [
    'Home Renovation & Appliances',
    'Medical & Health Emergency',
    'Wedding & Family Occasion',
    'Education & Skill Courses',
    'Debt & Credit Card Consolidation',
    'Travel & Holiday',
    'Two-Wheeler / Used Car Purchase',
  ];

  const handleApply = async () => {
    setLoading(true);
    try {
      const res = await loanApi.applyLoan({
        loanType: 'personal',
        amount,
        tenureMonths: tenure,
        purpose,
        panNumber: user?.panNumber || 'ABCDE1234F',
        monthlyIncome: user?.monthlyIncome || 65000,
        bankAccountNumber: bankAccount,
      });

      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
      });

      setSanctionedLoan(res.data);
      onLoanApplied(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="bg-teal-900 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-800 border border-teal-700 flex items-center justify-center">
              <Banknote className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">Instant Personal Loan Application</h2>
                <span className="text-[10px] bg-teal-800 text-teal-100 px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-teal-700">
                  2-Min Disbursal
                </span>
              </div>
              <p className="text-xs text-teal-200">
                100% Paperless • Zero Collateral • Direct to Bank
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {!sanctionedLoan ? (
            <>
              {/* Amount Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Select Loan Amount</label>
                  <span className="text-lg font-black text-teal-900 bg-teal-50 px-3 py-1 rounded-lg border border-teal-200">
                    ₹{amount.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={1000000}
                  step={5000}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-800"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>₹10,000</span>
                  <span>₹5,00,000</span>
                  <span>₹10,00,000 (Max Limit)</span>
                </div>
              </div>

              {/* Tenure Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Repayment Tenure</label>
                  <span className="text-xs font-bold text-slate-900">{tenure} Months</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                  {[3, 6, 12, 18, 24, 36, 48].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTenure(t)}
                      className={`py-2 text-xs font-bold rounded-lg border transition cursor-pointer ${
                        tenure === t
                          ? 'bg-teal-800 text-white border-teal-800 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t}M
                    </button>
                  ))}
                </div>
              </div>

              {/* Purpose Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 block">Purpose of Loan</label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-teal-800"
                >
                  {PURPOSES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Summary Card */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Monthly EMI</span>
                    <strong className="text-base text-teal-800 font-extrabold">₹{emiCalc.monthlyEmi.toLocaleString('en-IN')}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Interest Rate</span>
                    <strong className="text-sm text-slate-900 font-bold">14.0% p.a. (1.16% p.m.)</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Total Interest</span>
                    <strong className="text-sm text-slate-700 font-bold">₹{emiCalc.totalInterest.toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                  <span>Disbursal Bank:</span>
                  <span className="font-semibold text-slate-900">HDFC Bank ({bankAccount})</span>
                </div>
              </div>

              {/* Disbursal CTA */}
              <button
                onClick={handleApply}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs sm:text-sm shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-teal-200" />
                <span>{loading ? 'Sanctioning Loan in Real-Time...' : `Get Instant Disbursal of ₹${amount.toLocaleString('en-IN')}`}</span>
              </button>
            </>
          ) : (
            /* Sanction Letter View */
            <div className="space-y-5 text-center py-2 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-teal-50 border-2 border-teal-200 text-teal-800 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900">Loan Sanctioned & Disbursed! 🎉</h3>
                <p className="text-xs text-slate-500">
                  Reference No: <strong className="text-teal-800 font-mono">{sanctionedLoan.applicationNumber}</strong>
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 text-xs">
                  <span className="text-slate-500">Disbursed Amount</span>
                  <span className="text-base font-extrabold text-slate-900">₹{sanctionedLoan.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Monthly EMI</span>
                  <span className="font-bold text-teal-800">₹{sanctionedLoan.monthlyEmi.toLocaleString('en-IN')} / mo</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">First EMI Due Date</span>
                  <span className="font-semibold text-slate-900">{sanctionedLoan.nextEmiDate}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Lending Partner</span>
                  <span className="font-semibold text-slate-900">{sanctionedLoan.partnerBank}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs border border-slate-800 transition cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
