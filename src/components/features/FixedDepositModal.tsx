import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Landmark, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Percent, 
  Calendar, 
  ArrowRight, 
  Award, 
  Lock,
  Coins
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { fdApi } from '../../api/fdApi';
import { FixedDepositScheme, BookedFixedDeposit, UserProfile } from '../../types';

interface FixedDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onFdBooked: (fd: BookedFixedDeposit) => void;
}

export const FixedDepositModal: React.FC<FixedDepositModalProps> = ({
  isOpen,
  onClose,
  user,
  onFdBooked,
}) => {
  const [schemes, setSchemes] = useState<FixedDepositScheme[]>([]);
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('fd_shriram_finance');
  const [depositAmount, setDepositAmount] = useState<number>(100000);
  const [tenureMonths, setTenureMonths] = useState<number>(36);
  const [isSeniorCitizen, setIsSeniorCitizen] = useState(false);
  const [payoutOption, setPayoutOption] = useState<'On Maturity' | 'Monthly' | 'Quarterly'>('On Maturity');
  const [loading, setLoading] = useState(false);
  const [bookedFd, setBookedFd] = useState<BookedFixedDeposit | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadSchemes();
    }
  }, [isOpen]);

  const loadSchemes = async () => {
    try {
      const res = await fdApi.getSchemes();
      setSchemes(res.data);
      if (res.data.length > 0 && !selectedSchemeId) {
        setSelectedSchemeId(res.data[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const selectedScheme = schemes.find((s) => s.id === selectedSchemeId) || schemes[0];

  const currentRate = selectedScheme
    ? isSeniorCitizen
      ? selectedScheme.seniorCitizenRate
      : selectedScheme.regularRate
    : 8.65;

  const maturityCalc = useMemo(() => {
    return fdApi.calculateMaturity(depositAmount, tenureMonths, currentRate, payoutOption);
  }, [depositAmount, tenureMonths, currentRate, payoutOption]);

  if (!isOpen) return null;

  const handleBookFd = async () => {
    if (!selectedScheme) return;
    setLoading(true);
    try {
      const res = await fdApi.bookFixedDeposit({
        schemeId: selectedScheme.id,
        depositAmount,
        tenureMonths,
        isSeniorCitizen,
        payoutOption,
      });

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });

      setBookedFd(res.data);
      onFdBooked(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="bg-teal-900 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-800 border border-teal-700 flex items-center justify-center">
              <Landmark className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">High-Yield Fixed Deposits</h2>
                <span className="text-[10px] bg-teal-800 text-teal-100 px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-teal-700">
                  Up to 9.35% p.a.
                </span>
              </div>
              <p className="text-xs text-teal-200">
                Guaranteed returns • DICGC & CRISIL AAA Insured • Zero Penalty Withdrawals
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

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {!bookedFd ? (
            <>
              {/* Scheme Picker Cards */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Select Provider & Best Rate
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {schemes.map((scheme) => {
                    const isSelected = scheme.id === selectedSchemeId;
                    const rate = isSeniorCitizen ? scheme.seniorCitizenRate : scheme.regularRate;
                    return (
                      <div
                        key={scheme.id}
                        onClick={() => setSelectedSchemeId(scheme.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-teal-50/50 border-teal-800 shadow-xs ring-1 ring-teal-800/20'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 truncate">{scheme.providerName}</span>
                            <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                              {rate}%
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500">{scheme.creditRating}</p>
                        </div>
                        <span className="text-[9px] text-teal-800 mt-2 block font-medium">
                          {scheme.safetyScore}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Calculator Controls */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
                <div className="lg:col-span-7 space-y-4">
                  {/* Deposit Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700">Deposit Amount</label>
                      <span className="text-base font-extrabold text-teal-900 bg-teal-50 px-3 py-1 rounded-lg border border-teal-200">
                        ₹{depositAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={5000}
                      max={1500000}
                      step={5000}
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-800"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>₹5,000</span>
                      <span>₹5,00,000</span>
                      <span>₹15,00,000</span>
                    </div>
                  </div>

                  {/* Tenure */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700">Deposit Tenure</label>
                      <span className="text-xs font-bold text-slate-900">{tenureMonths} Months ({ (tenureMonths/12).toFixed(1) } Yrs)</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1.5">
                      {[12, 24, 36, 48, 60].map((t) => (
                        <button
                          key={t}
                          onClick={() => setTenureMonths(t)}
                          className={`py-2 text-xs font-bold rounded-lg border transition cursor-pointer ${
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

                  {/* Senior Citizen & Payout Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-xs font-semibold text-slate-900 block">Senior Citizen (+0.50%)</label>
                        <span className="text-[10px] text-slate-500">Age 60 years or above</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isSeniorCitizen}
                        onChange={(e) => setIsSeniorCitizen(e.target.checked)}
                        className="w-4 h-4 rounded accent-teal-800 cursor-pointer"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <label className="text-xs font-semibold text-slate-900 block">Interest Payout</label>
                      <select
                        value={payoutOption}
                        onChange={(e) => setPayoutOption(e.target.value as any)}
                        className="w-full bg-white border border-slate-200 rounded-lg text-xs text-slate-900 p-1.5 focus:outline-none focus:border-teal-800"
                      >
                        <option value="On Maturity">On Maturity (Max Growth)</option>
                        <option value="Monthly">Monthly Payout</option>
                        <option value="Quarterly">Quarterly Payout</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Right Result Card */}
                <div className="lg:col-span-5 rounded-2xl bg-slate-50 border border-slate-200 p-5 space-y-4 text-center">
                  <div className="space-y-1 pb-3 border-b border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      {payoutOption === 'On Maturity' ? 'Total Maturity Value' : 'Monthly Interest Payout'}
                    </span>
                    <div className="text-3xl font-black text-teal-900">
                      ₹{payoutOption === 'On Maturity' ? maturityCalc.maturityAmount.toLocaleString('en-IN') : maturityCalc.periodicPayout.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[11px] text-teal-800 font-semibold">
                      Total Interest Earned: +₹{maturityCalc.totalInterest.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-left">
                    <div className="flex justify-between text-slate-600">
                      <span>Interest Rate:</span>
                      <span className="font-bold text-slate-900">{currentRate}% p.a.</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Annual Yield:</span>
                      <span className="font-semibold text-slate-900">{maturityCalc.effectiveAnnualYield}%</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Safety:</span>
                      <span className="font-semibold text-teal-800">{selectedScheme?.safetyScore}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleBookFd}
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-teal-200" />
                    <span>{loading ? 'Booking Deposit...' : `Book FD for ₹${depositAmount.toLocaleString('en-IN')}`}</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-5 text-center py-3 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-teal-50 border-2 border-teal-200 text-teal-800 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900">Fixed Deposit Booked Successfully! 📜</h3>
                <p className="text-xs text-slate-500">
                  Certificate No: <strong className="text-teal-800 font-mono">{bookedFd.fdNumber}</strong>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Provider</span>
                  <span className="font-bold text-slate-900">{bookedFd.providerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Principal Deposit</span>
                  <span className="font-bold text-slate-900">₹{bookedFd.depositAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Locked Interest Rate</span>
                  <span className="font-bold text-teal-800">{bookedFd.interestRate}% p.a.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Maturity Date</span>
                  <span className="font-semibold text-slate-900">{bookedFd.maturityDate}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2">
                  <span className="text-slate-500">Maturity Amount</span>
                  <span className="text-sm font-extrabold text-teal-800">₹{bookedFd.maturityAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs border border-slate-800 transition cursor-pointer"
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
