import React, { useState } from 'react';
import { 
  Banknote, 
  ShieldCheck, 
  Clock, 
  Percent, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Building2, 
  HelpCircle, 
  TrendingUp, 
  FileCheck,
  AlertCircle,
  Calculator
} from 'lucide-react';
import { UserProfile, LoanApplication } from '../types';
import { loanApi } from '../api';

interface PersonalLoanPageProps {
  user: UserProfile | null;
  onLoanApplied: (loan: LoanApplication) => void;
  onNavigateToKyc: () => void;
  onNavigateToCibil: () => void;
}

const PARTNER_RATES = [
  { lender: 'Money View Special', rate: '10.50%', fee: '1.5%', approval: '2 mins', rating: '4.9/5', badge: 'Fastest Disbursal' },
  { lender: 'Fullerton India Credit', rate: '11.99%', fee: '2.0%', approval: '4 hours', rating: '4.7/5', badge: 'High Amount' },
  { lender: 'Aditya Birla Finance', rate: '11.49%', fee: '1.75%', approval: '2 hours', rating: '4.8/5', badge: 'Low Interest' },
  { lender: 'DMI Finance', rate: '12.25%', fee: '2.0%', approval: '1 hour', rating: '4.6/5', badge: 'Flexible Tenure' },
  { lender: 'Northern Arc Capital', rate: '12.50%', fee: '2.25%', approval: '3 hours', rating: '4.5/5', badge: 'Instant Sanction' },
];

export const PersonalLoanPage: React.FC<PersonalLoanPageProps> = ({
  user,
  onLoanApplied,
  onNavigateToKyc,
  onNavigateToCibil,
}) => {
  const [loanAmount, setLoanAmount] = useState<number>(250000);
  const [tenureMonths, setTenureMonths] = useState<number>(24);
  const [interestRate] = useState<number>(11.5);
  const [purpose, setPurpose] = useState<string>('Personal Emergency');
  const [step, setStep] = useState<'calculator' | 'apply' | 'success'>('calculator');
  const [loading, setLoading] = useState(false);
  const [appliedLoan, setAppliedLoan] = useState<LoanApplication | null>(null);

  // Form State
  const [monthlyIncome, setMonthlyIncome] = useState<number>(user?.monthlyIncome || 45000);
  const [employmentType, setEmploymentType] = useState<string>(user?.employmentType || 'salaried');
  const [panNumber, setPanNumber] = useState<string>(user?.panNumber || '');
  const [companyName, setCompanyName] = useState<string>('Tata Consultancy Services');
  const [bankName, setBankName] = useState<string>(user?.bankDetails?.bankName || 'HDFC Bank');
  const [accountNumber, setAccountNumber] = useState<string>(user?.bankDetails?.accountNumber || '987654321012');

  // EMI Math
  const monthlyRate = interestRate / 12 / 100;
  const emi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  );
  const totalPayable = emi * tenureMonths;
  const totalInterest = totalPayable - loanAmount;
  const processingFee = Math.round(loanAmount * 0.02);

  const handleApplyLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loanApi.applyLoan({
        loanType: 'personal',
        amount: loanAmount,
        tenureMonths,
        purpose,
        panNumber: panNumber || user?.panNumber || 'ABCDE1234F',
        monthlyIncome,
        bankAccountNumber: accountNumber,
      });
      setAppliedLoan(res.data);
      onLoanApplied(res.data);
      setStep('success');
    } catch (err) {
      console.error('Loan application error:', err);
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
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            <span>Instant Approval in 2 Minutes • 100% Paperless</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Instant Personal Loans up to ₹10,00,000
          </h1>
          <p className="text-sm text-teal-200 leading-relaxed">
            Get funds transferred directly to your bank account with lowest interest rates starting from 10.50% p.a., flexible repayment tenures from 3 to 60 months, and zero physical paperwork.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-teal-100">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero Prepayment Penalty</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Direct Bank Disbursal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>RBI Regulated Lenders</span>
            </div>
          </div>
        </div>
      </div>

      {step === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Loan Customizer */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Customize Your Personal Loan</h2>
                <p className="text-xs text-slate-500">Adjust the amount and tenure to calculate your exact monthly EMI</p>
              </div>
              <div className="p-2 rounded-xl bg-teal-50 text-teal-800">
                <Calculator className="w-5 h-5" />
              </div>
            </div>

            {/* Slider 1: Loan Amount */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">Required Loan Amount</label>
                <div className="text-lg font-black text-teal-900 bg-teal-50 px-3.5 py-1 rounded-xl border border-teal-200">
                  ₹{loanAmount.toLocaleString('en-IN')}
                </div>
              </div>
              <input
                type="range"
                min={10000}
                max={1000000}
                step={5000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-800"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>₹10,000</span>
                <span>₹5,00,000</span>
                <span>₹10,00,000</span>
              </div>
            </div>

            {/* Slider 2: Tenure Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">Repayment Period (Tenure)</label>
                <span className="text-xs font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                  {tenureMonths} Months ({ (tenureMonths / 12).toFixed(1) } Years)
                </span>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {[6, 12, 18, 24, 36, 48, 60].slice(0, 6).map((m) => (
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

            {/* Purpose of Loan */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Purpose of Loan</label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-800"
              >
                <option value="Personal Emergency">Personal Emergency / Medical</option>
                <option value="Home Renovation">Home Renovation / Upgrade</option>
                <option value="Debt Consolidation">Debt Consolidation / Credit Card Clearence</option>
                <option value="Wedding Expenses">Wedding / Family Function</option>
                <option value="Education">Higher Education / Upskilling</option>
                <option value="Travel">Vacation / Travel</option>
                <option value="Vehicle Purchase">Two-Wheeler / Pre-owned Car</option>
              </select>
            </div>

            {/* KYC & Credit Score Readiness Warning */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-800 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block">Credit & KYC Status</span>
                  <span className="text-slate-500 text-[11px]">
                    {user?.kycStatus === 'verified' 
                      ? '✓ DigiLocker KYC Verified (Ready for 2-min transfer)' 
                      : 'KYC Verification is pending. You can complete it in 60 seconds.'}
                  </span>
                </div>
              </div>
              {user?.kycStatus !== 'verified' && (
                <button
                  type="button"
                  onClick={onNavigateToKyc}
                  className="px-3 py-1.5 rounded-lg bg-teal-800 text-white font-semibold text-xs hover:bg-teal-900 shrink-0 cursor-pointer"
                >
                  Verify KYC Now
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Loan Summary & Quick Apply Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div className="text-center pb-4 border-b border-slate-100 space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Calculated Monthly EMI
                </span>
                <div className="text-3xl sm:text-4xl font-black text-teal-900">
                  ₹{emi.toLocaleString('en-IN')}
                </div>
                <span className="text-xs text-teal-800 font-medium bg-teal-50 px-2.5 py-0.5 rounded-full inline-block">
                  @ {interestRate}% p.a. starting rate
                </span>
              </div>

              {/* Financial Breakdown Table */}
              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Principal Loan Amount:</span>
                  <span className="font-bold text-slate-900">₹{loanAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Interest Payable:</span>
                  <span className="font-bold text-slate-900">₹{totalInterest.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Est. Processing Fee (2% + GST):</span>
                  <span className="font-semibold text-slate-900">₹{processingFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Repayment Tenure:</span>
                  <span className="font-semibold text-slate-900">{tenureMonths} Months</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-3 text-sm">
                  <span className="font-bold text-slate-900">Total Amount Payable:</span>
                  <span className="font-extrabold text-teal-900">₹{totalPayable.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => setStep('apply')}
                className="w-full py-3.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Instant Loan Application</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-slate-400 text-center">
                🔒 Safe & encrypted. Your credit score will not be impacted by checking eligibility.
              </p>
            </div>

            {/* Quick Benefits Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <h3 className="font-bold text-slate-900">Eligibility Criteria:</h3>
              <ul className="space-y-1 text-slate-600 list-disc list-inside text-[11px]">
                <li>Age: 21 to 57 years</li>
                <li>Monthly Income: ₹15,000 or above (credited directly into bank)</li>
                <li>Valid PAN Card and Aadhaar linked to Mobile No.</li>
                <li>Minimum CIBIL Score: 650+ for instant sanction</li>
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
              <h2 className="text-lg font-bold text-slate-900">Complete Instant Application</h2>
              <p className="text-xs text-slate-500">
                Applying for Personal Loan of <strong className="text-teal-800">₹{loanAmount.toLocaleString('en-IN')}</strong> for {tenureMonths} Months
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

          <form onSubmit={handleApplyLoan} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Full Legal Name (as per PAN)</label>
                <input
                  type="text"
                  required
                  defaultValue={user?.fullName || 'Rahul Sharma'}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Mobile Phone Number</label>
                <input
                  type="tel"
                  required
                  defaultValue={user?.phone || '9876543210'}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">PAN Card Number</label>
                <input
                  type="text"
                  required
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono uppercase focus:outline-none focus:border-teal-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Employment Type</label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-800"
                >
                  <option value="salaried">Salaried Employee</option>
                  <option value="self_employed_professional">Self Employed Professional</option>
                  <option value="self_employed_business">Business Owner</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Employer / Company Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Infosys, TCS, Private Ltd."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Net Monthly Salary / In-hand (₹)</label>
                <input
                  type="number"
                  required
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Disbursal Bank Name</label>
                <input
                  type="text"
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. HDFC Bank, ICICI Bank, SBI"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Bank Account Number</label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Account Number for fund transfer"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:border-teal-800"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px] space-y-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" required defaultChecked className="rounded accent-teal-800 cursor-pointer" />
                <span>I authorize Money View and partner lending NBFCs to pull my CIBIL bureau report & initiate paperless e-mandate.</span>
              </label>
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
                {loading ? 'Submitting & Verifying Credit Bureau...' : `Submit Application for ₹${loanAmount.toLocaleString('en-IN')}`}
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
            <h2 className="text-xl font-bold text-slate-900">Personal Loan Application Sanctioned! 🎉</h2>
            <p className="text-xs text-slate-500">
              Application ID: <strong className="text-teal-800 font-mono">{appliedLoan.id}</strong>
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Sanctioned Amount:</span>
              <span className="font-black text-slate-900 text-sm">₹{appliedLoan.amount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Assigned Lender:</span>
              <span className="font-bold text-teal-800">{appliedLoan.lenderName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Monthly EMI:</span>
              <span className="font-bold text-slate-900">₹{appliedLoan.emi.toLocaleString('en-IN')} / month</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Repayment Period:</span>
              <span className="font-semibold text-slate-900">{appliedLoan.tenureMonths} Months</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2">
              <span className="text-slate-500">Current Status:</span>
              <span className="font-bold text-teal-800 uppercase bg-teal-50 px-2 py-0.5 rounded">
                {appliedLoan.status}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={() => setStep('calculator')}
              className="w-full sm:flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
            >
              Calculate Another Loan
            </button>
            <button
              type="button"
              onClick={onNavigateToKyc}
              className="w-full sm:flex-1 py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-xs transition cursor-pointer"
            >
              Check KYC Verification Status
            </button>
          </div>
        </div>
      )}

      {/* Comparison Table of Partner Lending Rates */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Compare Partner NBFC & Bank Rates</h3>
            <p className="text-xs text-slate-500">Transparent comparison with RBI registered leading lenders</p>
          </div>
          <span className="text-xs text-teal-800 font-semibold bg-teal-50 px-2.5 py-1 rounded-lg">
            Lowest APR Guaranteed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                <th className="py-2.5">Lender Name</th>
                <th className="py-2.5">Interest Rate</th>
                <th className="py-2.5">Processing Fee</th>
                <th className="py-2.5">Disbursal Time</th>
                <th className="py-2.5">Customer Rating</th>
                <th className="py-2.5">Highlights</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {PARTNER_RATES.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="py-3 font-bold text-slate-900">{item.lender}</td>
                  <td className="py-3 font-semibold text-teal-800">{item.rate}</td>
                  <td className="py-3 text-slate-600">{item.fee}</td>
                  <td className="py-3 text-slate-600">{item.approval}</td>
                  <td className="py-3 font-semibold text-amber-600">★ {item.rating}</td>
                  <td className="py-3">
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                      {item.badge}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
