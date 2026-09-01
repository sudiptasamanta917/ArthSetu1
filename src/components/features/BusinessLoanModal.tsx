import React, { useState, useMemo } from 'react';
import { 
  X, 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  Building2, 
  Receipt, 
  FileSpreadsheet, 
  Clock, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { loanApi } from '../../api/loanApi';
import { UserProfile, LoanApplication } from '../../types';

interface BusinessLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onLoanApplied: (loan: LoanApplication) => void;
}

export const BusinessLoanModal: React.FC<BusinessLoanModalProps> = ({
  isOpen,
  onClose,
  user,
  onLoanApplied,
}) => {
  const [amount, setAmount] = useState<number>(500000);
  const [tenure, setTenure] = useState<number>(36);
  const [businessName, setBusinessName] = useState('Roy Tech Solutions LLP');
  const [gstin, setGstin] = useState('29ABCDE1234F1Z5');
  const [annualTurnover, setAnnualTurnover] = useState('4500000');
  const [businessVintage, setBusinessVintage] = useState('3-5 Years');
  const [loading, setLoading] = useState(false);
  const [sanctionedLoan, setSanctionedLoan] = useState<LoanApplication | null>(null);

  const emiCalc = useMemo(() => {
    return loanApi.calculateEmi(amount, tenure, 14.75);
  }, [amount, tenure]);

  if (!isOpen) return null;

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loanApi.applyLoan({
        loanType: 'business',
        amount,
        tenureMonths: tenure,
        purpose: 'Business Expansion & Working Capital',
        panNumber: user?.panNumber || 'ABCDE1234F',
        annualTurnover: Number(annualTurnover),
        businessName,
        gstin,
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
        {/* Header */}
        <div className="bg-teal-900 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-800 border border-teal-700 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">Unsecured Business Loan up to ₹50L</h2>
                <span className="text-[10px] bg-teal-800 text-teal-100 px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-teal-700">
                  Collateral Free
                </span>
              </div>
              <p className="text-xs text-teal-200">
                Working capital • Equipment finance • GST-linked approvals
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

        {/* Form Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {!sanctionedLoan ? (
            <form onSubmit={handleApply} className="space-y-5">
              {/* Amount Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Required Business Capital</label>
                  <span className="text-lg font-black text-teal-900 bg-teal-50 px-3 py-1 rounded-lg border border-teal-200">
                    ₹{amount.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min={100000}
                  max={5000000}
                  step={50000}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-800"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>₹1 Lakh</span>
                  <span>₹25 Lakhs</span>
                  <span>₹50 Lakhs (Max)</span>
                </div>
              </div>

              {/* Tenure */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Loan Tenure</label>
                  <span className="text-xs font-bold text-slate-900">{tenure} Months</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                  {[12, 24, 36, 48, 60, 84].map((t) => (
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

              {/* Business Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Registered Business Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Company Name"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-teal-800"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">GSTIN Number (Optional)</label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    placeholder="29ABCDE1234F1Z5"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-teal-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Annual Turnover (INR)</label>
                  <input
                    type="number"
                    value={annualTurnover}
                    onChange={(e) => setAnnualTurnover(e.target.value)}
                    placeholder="4500000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-teal-800"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Business Vintage</label>
                  <select
                    value={businessVintage}
                    onChange={(e) => setBusinessVintage(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-teal-800"
                  >
                    <option>1 - 2 Years</option>
                    <option>3 - 5 Years</option>
                    <option>5+ Years</option>
                  </select>
                </div>
              </div>

              {/* Repayment Breakdown */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Estimated Monthly EMI</span>
                  <span className="text-xl font-black text-teal-800">₹{emiCalc.monthlyEmi.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase block">Interest Rate</span>
                  <span className="text-xs font-bold text-slate-900">14.75% p.a. (Tax Deductible)</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs sm:text-sm shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-teal-200" />
                <span>{loading ? 'Evaluating Business Eligibility...' : `Sanction Business Loan of ₹${amount.toLocaleString('en-IN')}`}</span>
              </button>
            </form>
          ) : (
            <div className="space-y-5 text-center py-2 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-teal-50 border-2 border-teal-200 text-teal-800 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900">Business Loan Approved! 🏢</h3>
                <p className="text-xs text-slate-500">
                  Application No: <strong className="text-teal-800 font-mono">{sanctionedLoan.applicationNumber}</strong>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Sanctioned Amount</span>
                  <span className="text-base font-bold text-slate-900">₹{sanctionedLoan.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Enterprise</span>
                  <span className="font-semibold text-slate-900">{businessName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Lending Partner</span>
                  <span className="font-semibold text-slate-900">{sanctionedLoan.partnerBank}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs border border-slate-800 transition cursor-pointer"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
