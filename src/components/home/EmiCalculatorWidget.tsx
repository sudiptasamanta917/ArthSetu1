import React, { useState, useMemo } from 'react';
import { Calculator, ArrowRight, Sparkles, CheckCircle2, Shield } from 'lucide-react';
import { loanApi } from '../../api/loanApi';

interface EmiCalculatorWidgetProps {
  onApplyWithValues: (amount: number, tenure: number) => void;
}

export const EmiCalculatorWidget: React.FC<EmiCalculatorWidgetProps> = ({ onApplyWithValues }) => {
  const [loanAmount, setLoanAmount] = useState<number>(250000);
  const [tenureMonths, setTenureMonths] = useState<number>(24);
  const [interestRate, setInterestRate] = useState<number>(14.0);

  const emiDetails = useMemo(() => {
    return loanApi.calculateEmi(loanAmount, tenureMonths, interestRate);
  }, [loanAmount, tenureMonths, interestRate]);

  const principalPercent = Math.round((loanAmount / emiDetails.totalPayable) * 100);
  const interestPercent = 100 - principalPercent;

  const TENURE_OPTIONS = [6, 12, 18, 24, 36, 48, 60];

  return (
    <section className="rounded-2xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E8F7F9] border border-cyan-100 flex items-center justify-center text-[#004856]">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Interactive Loan EMI Calculator</h3>
            <p className="text-xs text-slate-500">Calculate customized monthly repayments instantly</p>
          </div>
        </div>
        <span className="text-xs text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 self-start sm:self-auto">
          Interest from <strong className="text-[#004856]">1.33% p.m.</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Form Sliders */}
        <div className="lg:col-span-7 space-y-5">
          {/* Amount Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Loan Amount</label>
              <span className="text-base font-extrabold text-[#004856] bg-[#E8F7F9] px-3 py-1 rounded-lg border border-[#C2EBF0]">
                ₹{loanAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min={25000}
              max={1000000}
              step={5000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#004856]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>₹25,000</span>
              <span>₹5,00,000</span>
              <span>₹10,00,000</span>
            </div>
          </div>

          {/* Tenure Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Tenure (Months)</label>
              <span className="text-sm font-bold text-slate-900">
                {tenureMonths} Months ({ (tenureMonths / 12).toFixed(1) } Years)
              </span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {TENURE_OPTIONS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTenureMonths(t)}
                  className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    tenureMonths === t
                      ? 'bg-[#004856] text-white border-[#004856] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t}M
                </button>
              ))}
            </div>
          </div>

          {/* Quick Features */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#004856]" />
              Zero Prepayment Fee
            </span>
            <span className="flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#004856]" />
              Direct Bank Disbursal
            </span>
          </div>
        </div>

        {/* Right Calculated Result Box */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-50 border border-slate-200/90 p-5 space-y-4">
          <div className="text-center space-y-1 pb-3 border-b border-slate-200">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Monthly EMI</span>
            <div className="text-3xl font-black text-slate-900">
              ₹{emiDetails.monthlyEmi.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">per month for {tenureMonths} months</span>
          </div>

          {/* Progress Split */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-700 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#004856]" />
                Principal: ₹{loanAmount.toLocaleString('en-IN')}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                Interest: ₹{emiDetails.totalInterest.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
              <div style={{ width: `${principalPercent}%` }} className="bg-[#004856] h-full" />
              <div style={{ width: `${interestPercent}%` }} className="bg-slate-400 h-full" />
            </div>
          </div>

          <div className="flex justify-between text-xs text-slate-600 pt-1">
            <span>Total Payable:</span>
            <strong className="text-slate-900 font-bold">₹{emiDetails.totalPayable.toLocaleString('en-IN')}</strong>
          </div>

          <button
            onClick={() => onApplyWithValues(loanAmount, tenureMonths)}
            className="w-full py-3 rounded-xl bg-[#004856] hover:bg-[#003844] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Apply for ₹{loanAmount.toLocaleString('en-IN')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
