import React, { useState, useEffect } from 'react';
import { 
  Landmark, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight, 
  Percent, 
  Clock, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { UserProfile, FixedDepositScheme, BookedFixedDeposit } from '../types';
import { fdApi } from '../api';

interface FixedDepositPageProps {
  user: UserProfile | null;
  onNavigateToInvestments?: () => void;
}

export const FixedDepositPage: React.FC<FixedDepositPageProps> = ({ user, onNavigateToInvestments }) => {
  const [schemes, setSchemes] = useState<FixedDepositScheme[]>([]);
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('fd_shriram_finance');
  const [depositAmount, setDepositAmount] = useState<number>(100000);
  const [tenureMonths, setTenureMonths] = useState<number>(36);
  const [isSeniorCitizen, setIsSeniorCitizen] = useState<boolean>(false);
  const [payoutOption, setPayoutOption] = useState<'On Maturity' | 'Monthly' | 'Quarterly'>('On Maturity');
  const [bookedFds, setBookedFds] = useState<BookedFixedDeposit[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<BookedFixedDeposit | null>(null);

  useEffect(() => {
    fetchSchemes();
    fetchUserFds();
  }, []);

  const fetchSchemes = async () => {
    try {
      const res = await fdApi.getSchemes();
      setSchemes(res.data);
      if (res.data.length > 0) setSelectedSchemeId(res.data[0].id);
    } catch (e) {
      console.error('Failed to get FD schemes:', e);
    }
  };

  const fetchUserFds = async () => {
    try {
      const res = await fdApi.getUserFds();
      setBookedFds(res.data);
    } catch (e) {
      console.error('Failed to get user FDs:', e);
    }
  };

  const selectedScheme = schemes.find((s) => s.id === selectedSchemeId) || schemes[0];
  const currentRate = selectedScheme
    ? isSeniorCitizen
      ? selectedScheme.seniorCitizenRate
      : selectedScheme.regularRate
    : 8.65;

  // Maturity Calculations
  const r = currentRate / 100;
  const t = tenureMonths / 12;
  const n = 4; // Compounded quarterly standard in India
  const maturityAmount = Math.round(depositAmount * Math.pow(1 + r / n, n * t));
  const totalInterest = maturityAmount - depositAmount;
  const monthlyPayout = Math.round((depositAmount * r) / 12);
  const effectiveAnnualYield = ((Math.pow(1 + r / n, n) - 1) * 100).toFixed(2);

  const handleBookFd = async () => {
    setLoading(true);
    try {
      const res = await fdApi.bookFixedDeposit({
        schemeId: selectedSchemeId,
        depositAmount,
        tenureMonths,
        isSeniorCitizen,
        payoutOption,
      });
      setBookingSuccess(res.data);
      setBookedFds((prev) => [res.data, ...prev]);
    } catch (e) {
      console.error('FD booking failed:', e);
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
            <Landmark className="w-3.5 h-3.5 text-teal-300" />
            <span>DICGC & CRISIL AAA Insured High-Yield Deposits</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            High Return Fixed Deposits up to 9.50% p.a.
          </h1>
          <p className="text-sm text-teal-200 leading-relaxed">
            Beat inflation with guaranteed returns from top RBI-regulated banks and CRISIL AAA rated NBFCs. 100% online booking with no bank visit required.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-teal-100">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>₹5 Lakh RBI/DICGC Insurance per Bank</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero Penalty Premature Withdrawal Option</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>+0.50% Senior Citizen Extra Benefit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Provider Scheme Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Select FD Provider & Compare Rates</h2>
          <span className="text-xs text-teal-800 font-semibold bg-teal-50 px-2.5 py-1 rounded-lg">
            CRISIL AAA Rated Safety
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {schemes.map((scheme) => {
            const isSelected = selectedSchemeId === scheme.id;
            const rate = isSeniorCitizen ? scheme.seniorCitizenRate : scheme.regularRate;
            return (
              <button
                key={scheme.id}
                type="button"
                onClick={() => setSelectedSchemeId(scheme.id)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-teal-50/50 border-teal-800 shadow-xs ring-2 ring-teal-800/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 truncate">{scheme.providerName}</span>
                    <span className="text-xs font-extrabold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
                      {rate}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{scheme.creditRating}</p>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span className="text-teal-800 font-semibold">{scheme.safetyScore}</span>
                  <span className="text-slate-400">Min ₹{scheme.minDeposit.toLocaleString('en-IN')}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Calculator & Booking Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Customizer */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Customize Your Fixed Deposit</h3>
              <p className="text-xs text-slate-500">Selected Provider: <strong className="text-teal-800">{selectedScheme?.providerName}</strong></p>
            </div>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-800">
              <Percent className="w-5 h-5" />
            </div>
          </div>

          {/* Amount Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Deposit Principal Amount</label>
              <div className="text-lg font-black text-teal-900 bg-teal-50 px-3.5 py-1 rounded-xl border border-teal-200">
                ₹{depositAmount.toLocaleString('en-IN')}
              </div>
            </div>
            <input
              type="range"
              min={5000}
              max={1500000}
              step={5000}
              value={depositAmount}
              onChange={(e) => setDepositAmount(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-800"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>₹5,000</span>
              <span>₹7,50,000</span>
              <span>₹15,00,000</span>
            </div>
          </div>

          {/* Tenure */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Deposit Tenure</label>
              <span className="text-xs font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                {tenureMonths} Months ({ (tenureMonths / 12).toFixed(1) } Yrs)
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[12, 24, 36, 48, 60].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTenureMonths(t)}
                  className={`py-2.5 text-xs font-bold rounded-xl border transition cursor-pointer ${
                    tenureMonths === t
                      ? 'bg-teal-800 text-white border-teal-800 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t}M
                </button>
              ))}
            </div>
          </div>

          {/* Senior Citizen & Payout Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-xs font-semibold text-slate-900 block">Senior Citizen Rate (+0.50%)</label>
                <span className="text-[11px] text-slate-500">Age 60 years or older</span>
              </div>
              <input
                type="checkbox"
                checked={isSeniorCitizen}
                onChange={(e) => setIsSeniorCitizen(e.target.checked)}
                className="w-4 h-4 rounded accent-teal-800 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <label className="text-xs font-semibold text-slate-900 block">Interest Payout Frequency</label>
              <select
                value={payoutOption}
                onChange={(e) => setPayoutOption(e.target.value as any)}
                className="w-full bg-white border border-slate-200 rounded-lg text-xs text-slate-900 p-1.5 focus:outline-none focus:border-teal-800"
              >
                <option value="On Maturity">On Maturity (Compounded Growth)</option>
                <option value="Monthly">Monthly Regular Income</option>
                <option value="Quarterly">Quarterly Payout</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right: Maturity Results & Booking */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 text-center">
            <div className="space-y-1 pb-4 border-b border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {payoutOption === 'On Maturity' ? 'Total Maturity Return' : 'Monthly Interest Credit'}
              </span>
              <div className="text-3xl sm:text-4xl font-black text-teal-900">
                ₹{payoutOption === 'On Maturity' ? maturityAmount.toLocaleString('en-IN') : monthlyPayout.toLocaleString('en-IN')}
              </div>
              <span className="text-xs text-teal-800 font-semibold">
                Total Interest Earned: +₹{totalInterest.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="space-y-2 text-xs text-left">
              <div className="flex justify-between text-slate-600">
                <span>Guaranteed Interest Rate:</span>
                <span className="font-bold text-slate-900">{currentRate}% p.a.</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Effective Annual Yield:</span>
                <span className="font-semibold text-slate-900">{effectiveAnnualYield}%</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Insurance Protection:</span>
                <span className="font-semibold text-teal-800">{selectedScheme?.safetyScore}</span>
              </div>
            </div>

            <button
              onClick={handleBookFd}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-teal-200" />
              <span>{loading ? 'Booking Deposit...' : `Book Fixed Deposit for ₹${depositAmount.toLocaleString('en-IN')}`}</span>
            </button>
          </div>

          {bookingSuccess && (
            <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200 text-left space-y-2 animate-in zoom-in-95 text-xs">
              <div className="flex items-center gap-2 text-teal-800 font-bold">
                <CheckCircle2 className="w-5 h-5" />
                <span>FD Successfully Booked!</span>
              </div>
              <p className="text-slate-600">
                Certificate No: <strong className="font-mono text-teal-900">{bookingSuccess.fdNumber}</strong>
              </p>
              <p className="text-slate-600">
                Maturity Date: <strong>{bookingSuccess.maturityDate}</strong> | Maturity Amount: <strong>₹{bookingSuccess.maturityAmount.toLocaleString('en-IN')}</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
