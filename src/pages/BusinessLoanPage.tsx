import React, { useState } from 'react';
import { 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Receipt, 
  Store, 
  Layers, 
  HelpCircle,
  Calculator,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { UserProfile, LoanApplication } from '../types';
import { loanApi } from '../api';

interface BusinessLoanPageProps {
  user: UserProfile | null;
  onLoanApplied: (loan: LoanApplication) => void;
  onNavigateToKyc: () => void;
}

export const BusinessLoanPage: React.FC<BusinessLoanPageProps> = ({
  user,
  onLoanApplied,
  onNavigateToKyc,
}) => {
  const [loanAmount, setLoanAmount] = useState<number>(750000);
  const [tenureMonths, setTenureMonths] = useState<number>(36);
  const [businessType, setBusinessType] = useState<string>('Retail Store / Supermarket');
  const [annualTurnover, setAnnualTurnover] = useState<number>(4500000);
  const [gstRegistered, setGstRegistered] = useState<boolean>(true);
  const [gstin, setGstin] = useState<string>('29AAAAA0000A1Z5');
  const [vintageYears, setVintageYears] = useState<number>(3);
  const [step, setStep] = useState<'calculator' | 'apply' | 'success'>('calculator');
  const [loading, setLoading] = useState<boolean>(false);
  const [appliedLoan, setAppliedLoan] = useState<LoanApplication | null>(null);

  // Math
  const interestRate = 13.5;
  const monthlyRate = interestRate / 12 / 100;
  const emi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  );
  const totalPayable = emi * tenureMonths;
  const totalInterest = totalPayable - loanAmount;

  const handleApplyBusinessLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loanApi.applyLoan({
        loanType: 'business',
        amount: loanAmount,
        tenureMonths,
        purpose: `Working Capital for ${businessType}`,
        panNumber: user?.panNumber || 'ABCDE1234F',
        businessName: businessType,
        gstin,
        annualTurnover,
      });
      setAppliedLoan(res.data);
      onLoanApplied(res.data);
      setStep('success');
    } catch (err) {
      console.error('Business loan error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="rounded-2xl bg-teal-900 text-white p-6 sm:p-8 border border-teal-800 shadow-sm relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-800/80 border border-teal-700 text-teal-200 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5 text-teal-300" />
            <span>Collateral-Free MSME & Business Loans</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Grow Your Enterprise with Loans up to ₹30,00,000
          </h1>
          <p className="text-sm text-teal-200 leading-relaxed">
            Quick working capital and expansion finance for retailers, wholesalers, manufacturers, and service providers. No security or property collateral needed.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-teal-100">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero Collateral / Property Mortgage</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Sanctions based on GST & Banking Flow</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Tax Deductible Interest</span>
            </div>
          </div>
        </div>
      </div>

      {step === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Business Loan Customizer */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Calculate Business Working Capital</h2>
                <p className="text-xs text-slate-500">Fast digital processing with flexible monthly EMIs</p>
              </div>
              <div className="p-2 rounded-xl bg-teal-50 text-teal-800">
                <Store className="w-5 h-5" />
              </div>
            </div>

            {/* Slider: Loan Amount */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">Required Capital Amount</label>
                <div className="text-lg font-black text-teal-900 bg-teal-50 px-3.5 py-1 rounded-xl border border-teal-200">
                  ₹{loanAmount.toLocaleString('en-IN')}
                </div>
              </div>
              <input
                type="range"
                min={50000}
                max={3000000}
                step={25000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-800"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>₹50,000</span>
                <span>₹15,00,000</span>
                <span>₹30,00,000</span>
              </div>
            </div>

            {/* Slider: Tenure */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">Business Loan Tenure</label>
                <span className="text-xs font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                  {tenureMonths} Months ({ (tenureMonths / 12).toFixed(1) } Yrs)
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[12, 24, 36, 48, 60].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setTenureMonths(m)}
                    className={`py-2.5 text-xs font-bold rounded-xl border transition cursor-pointer ${
                      tenureMonths === m
                        ? 'bg-teal-800 text-white border-teal-800 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {m}M
                  </button>
                ))}
              </div>
            </div>

            {/* Business Sector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Business Category</label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-800"
                >
                  <option value="Retail Store / Supermarket">Retail Store / Supermarket</option>
                  <option value="Wholesale & Distribution">Wholesale & Distribution</option>
                  <option value="Manufacturing / Workshop">Manufacturing / Workshop</option>
                  <option value="E-Commerce Seller">E-Commerce & Online Seller</option>
                  <option value="Healthcare & Pharmacy">Healthcare / Pharmacy Clinic</option>
                  <option value="Restaurant & Hospitality">Restaurant & Food Service</option>
                  <option value="Professional Services">IT & Professional Services</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Business Vintage (Years in Operation)</label>
                <select
                  value={vintageYears}
                  onChange={(e) => setVintageYears(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-800"
                >
                  <option value={1}>1 - 2 Years</option>
                  <option value={3}>3 - 5 Years (Higher Eligibility)</option>
                  <option value={6}>6+ Years (Instant Top Tier)</option>
                </select>
              </div>
            </div>

            {/* GST Status */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-900 block">GST Registered Business</span>
                  <span className="text-[11px] text-slate-500">GST verified businesses get up to 40% higher sanction amounts</span>
                </div>
                <input
                  type="checkbox"
                  checked={gstRegistered}
                  onChange={(e) => setGstRegistered(e.target.checked)}
                  className="w-4 h-4 rounded accent-teal-800 cursor-pointer"
                />
              </div>

              {gstRegistered && (
                <div className="pt-2 border-t border-slate-200">
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Business GSTIN</label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    placeholder="22AAAAA0000A1Z5"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono uppercase text-slate-900 focus:outline-none focus:border-teal-800"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Loan Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div className="text-center pb-4 border-b border-slate-100 space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Estimated Business EMI
                </span>
                <div className="text-3xl sm:text-4xl font-black text-teal-900">
                  ₹{emi.toLocaleString('en-IN')}
                </div>
                <span className="text-xs text-teal-800 font-medium bg-teal-50 px-2.5 py-0.5 rounded-full inline-block">
                  @ {interestRate}% p.a. Special MSME Rate
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Sanction Request:</span>
                  <span className="font-bold text-slate-900">₹{loanAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Interest:</span>
                  <span className="font-bold text-slate-900">₹{totalInterest.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tenure Duration:</span>
                  <span className="font-semibold text-slate-900">{tenureMonths} Months</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-3 text-sm">
                  <span className="font-bold text-slate-900">Total Repayable:</span>
                  <span className="font-extrabold text-teal-900">₹{totalPayable.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep('apply')}
                className="w-full py-3.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Apply for Business Loan</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <h3 className="font-bold text-slate-900">Required Documents for MSME Loan:</h3>
              <ul className="space-y-1 text-slate-600 list-disc list-inside text-[11px]">
                <li>Business Registration / Shop & Establishment Certificate / Udyam</li>
                <li>Last 6 months current account bank statement</li>
                <li>GST Returns (GSTR-3B) for the past 12 months</li>
                <li>PAN and Aadhaar of Proprietor / Partners / Directors</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Application Form View */}
      {step === 'apply' && (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Business Loan Verification Form</h2>
              <p className="text-xs text-slate-500">
                Applying for Business Loan of <strong className="text-teal-800">₹{loanAmount.toLocaleString('en-IN')}</strong> for {tenureMonths} Months
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStep('calculator')}
              className="text-xs text-teal-800 font-semibold hover:underline cursor-pointer"
            >
              ← Edit Amount & Tenure
            </button>
          </div>

          <form onSubmit={handleApplyBusinessLoan} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Registered Enterprise Name</label>
                <input
                  type="text"
                  required
                  defaultValue="Apex Enterprises Pvt Ltd"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Authorized Signatory Name</label>
                <input
                  type="text"
                  required
                  defaultValue={user?.fullName || 'Rahul Sharma'}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Annual Business Turnover (₹)</label>
                <input
                  type="number"
                  required
                  value={annualTurnover}
                  onChange={(e) => setAnnualTurnover(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Current Business Bank Name</label>
                <input
                  type="text"
                  required
                  defaultValue="ICICI Bank (Current Account)"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-800"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('calculator')}
                className="py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Evaluating Business Financials...' : `Submit Business Loan Application`}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 3: Success Confirmation View */}
      {step === 'success' && appliedLoan && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center space-y-6 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-teal-50 border-2 border-teal-200 text-teal-800 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">Business Loan Sanction Approved! 🚀</h2>
            <p className="text-xs text-slate-500">
              Sanction Ref: <strong className="text-teal-800 font-mono">{appliedLoan.id}</strong>
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Sanctioned Amount:</span>
              <span className="font-black text-slate-900 text-sm">₹{appliedLoan.amount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Financing Partner:</span>
              <span className="font-bold text-teal-800">{appliedLoan.lenderName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Monthly EMI:</span>
              <span className="font-bold text-slate-900">₹{appliedLoan.emi.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tenure:</span>
              <span className="font-semibold text-slate-900">{appliedLoan.tenureMonths} Months</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={() => setStep('calculator')}
              className="w-full sm:flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
            >
              Back to Calculator
            </button>
            <button
              type="button"
              onClick={onNavigateToKyc}
              className="w-full sm:flex-1 py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-xs transition cursor-pointer"
            >
              Verify Digital KYC
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
