import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Coins, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  Star, 
  Calculator, 
  ArrowRight, 
  ShieldCheck, 
  PieChart, 
  Zap,
  Flame,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { investmentApi } from '../../api/investmentApi';
import { InvestmentFund, InvestmentHolding, UserProfile } from '../../types';

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onInvestmentAdded: (holding: InvestmentHolding) => void;
}

export const InvestmentModal: React.FC<InvestmentModalProps> = ({
  isOpen,
  onClose,
  user,
  onInvestmentAdded,
}) => {
  const [activeTab, setActiveTab] = useState<'funds' | 'gold' | 'calculator' | 'portfolio'>('funds');
  const [funds, setFunds] = useState<InvestmentFund[]>([]);
  const [selectedFund, setSelectedFund] = useState<InvestmentFund | null>(null);
  const [sipAmount, setSipAmount] = useState<number>(2000);
  const [sipTenure, setSipTenure] = useState<number>(5); // 5 years
  const [sipReturnRate, setSipReturnRate] = useState<number>(15);
  const [goldGrams, setGoldGrams] = useState<number>(1);
  const [goldAmount, setGoldAmount] = useState<number>(7420);
  const [loading, setLoading] = useState(false);
  const [portfolio, setPortfolio] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      const [fundsRes, portfolioRes] = await Promise.all([
        investmentApi.getFunds(),
        investmentApi.getPortfolio(),
      ]);
      setFunds(fundsRes.data);
      if (fundsRes.data.length > 0) setSelectedFund(fundsRes.data[0]);
      setPortfolio(portfolioRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  const sipCalc = useMemo(() => {
    return investmentApi.calculateSip(sipAmount, sipTenure, sipReturnRate);
  }, [sipAmount, sipTenure, sipReturnRate]);

  if (!isOpen) return null;

  const handleStartSip = async (fund: InvestmentFund) => {
    setLoading(true);
    try {
      const res = await investmentApi.startInvestment(fund.id, sipAmount, true);
      confetti({ particleCount: 80, spread: 70 });
      onInvestmentAdded(res.data);
      await loadData();
      setActiveTab('portfolio');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyGold = async () => {
    setLoading(true);
    try {
      const res = await investmentApi.startInvestment('fund_digital_gold_24k', goldAmount, false);
      confetti({ particleCount: 90, spread: 80 });
      onInvestmentAdded(res.data);
      await loadData();
      setActiveTab('portfolio');
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
              <Coins className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">Investments & 24K Pure Digital Gold</h2>
                <span className="text-[10px] bg-teal-800 text-teal-100 px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-teal-700">
                  0% Commission
                </span>
              </div>
              <p className="text-xs text-teal-200">
                Direct Mutual Funds • 24K 99.9% Pure Gold • Automated Monthly SIP from ₹100
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

        {/* Tab Navigation */}
        <div className="flex bg-slate-50 border-b border-slate-200 p-1.5 gap-1 text-xs">
          {[
            { id: 'funds', label: 'Top Mutual Funds' },
            { id: 'gold', label: '24K Digital Gold' },
            { id: 'calculator', label: 'SIP Calculator' },
            { id: 'portfolio', label: `My Portfolio (${portfolio?.holdings?.length || 0})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-2 rounded-xl font-bold transition-all text-center cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* TAB 1: Top Funds */}
          {activeTab === 'funds' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  5-Star Ranked Direct Equity & Hybrid Funds
                </h3>
                <span className="text-xs text-teal-800 font-semibold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  Instant Online SIP
                </span>
              </div>

              <div className="space-y-3">
                {funds.filter(f => f.category !== 'Digital Gold').map((fund) => (
                  <div
                    key={fund.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-teal-800/40 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{fund.name}</h4>
                          {fund.badge && (
                            <span className="text-[10px] font-semibold bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.2 rounded">
                              {fund.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{fund.subCategory} • Manager: {fund.fundManager}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 block">3Y Annualized Return</span>
                          <span className="text-sm font-black text-teal-800">+{fund.return3Y}% p.a.</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 text-xs text-slate-600">
                      <div className="flex items-center gap-4">
                        <span>Min SIP: <strong className="text-slate-900">₹{fund.minSipAmount}</strong></span>
                        <span>1Y: <strong className="text-teal-800">+{fund.return1Y}%</strong></span>
                        <span>5Y: <strong className="text-teal-800">+{fund.return5Y}%</strong></span>
                      </div>

                      <button
                        onClick={() => handleStartSip(fund)}
                        disabled={loading}
                        className="px-4 py-1.5 rounded-lg bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-2xs transition flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-teal-200" />
                        <span>Start ₹{sipAmount} SIP</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: 24K Digital Gold */}
          {activeTab === 'gold' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-500" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Money View 24K 99.9% Pure Digital Gold</h3>
                      <p className="text-xs text-slate-500">Stored in IDBI Trustee & MMTC-PAMP Insured Vaults</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">Live Spot Buy Price</span>
                    <span className="text-base font-black text-amber-600">₹7,420.50 / gm</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Buy in Rupees</label>
                    <input
                      type="number"
                      value={goldAmount}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setGoldAmount(val);
                        setGoldGrams(Number((val / 7420.5).toFixed(4)));
                      }}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Weight in Grams</label>
                    <input
                      type="number"
                      step={0.1}
                      value={goldGrams}
                      onChange={(e) => {
                        const grams = Number(e.target.value);
                        setGoldGrams(grams);
                        setGoldAmount(Math.round(grams * 7420.5));
                      }}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-800"
                    />
                  </div>
                </div>

                <button
                  onClick={handleBuyGold}
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Coins className="w-4 h-4 text-teal-200" />
                  <span>{loading ? 'Purchasing 24K Gold...' : `Buy ${goldGrams}g Digital Gold for ₹${goldAmount.toLocaleString('en-IN')}`}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: SIP Calculator */}
          {activeTab === 'calculator' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Monthly SIP Amount</span>
                    <span className="text-teal-800 font-bold">₹{sipAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min={500}
                    max={50000}
                    step={500}
                    value={sipAmount}
                    onChange={(e) => setSipAmount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-800"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Investment Period (Years)</span>
                    <span className="text-slate-900 font-bold">{sipTenure} Years</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={25}
                    step={1}
                    value={sipTenure}
                    onChange={(e) => setSipTenure(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-800"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Expected Annual Return Rate</span>
                    <span className="text-teal-800 font-bold">{sipReturnRate}% p.a.</span>
                  </div>
                  <input
                    type="range"
                    min={8}
                    max={25}
                    step={1}
                    value={sipReturnRate}
                    onChange={(e) => setSipReturnRate(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-800"
                  />
                </div>
              </div>

              <div className="md:col-span-5 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Projected Future Wealth</span>
                <div className="text-3xl font-black text-teal-900">
                  ₹{sipCalc.futureValue.toLocaleString('en-IN')}
                </div>
                <div className="text-xs space-y-1 pt-2 border-t border-slate-200 text-left">
                  <div className="flex justify-between text-slate-600">
                    <span>Total Invested:</span>
                    <span className="text-slate-900 font-semibold">₹{sipCalc.totalInvested.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Estimated Gains:</span>
                    <span className="text-teal-800 font-semibold">+₹{sipCalc.estimatedReturns.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Portfolio */}
          {activeTab === 'portfolio' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Portfolio Value</span>
                  <div className="text-2xl font-black text-slate-900">
                    ₹{portfolio?.totalCurrent?.toLocaleString('en-IN') || '0'}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Returns</span>
                  <div className="text-base font-bold text-teal-800">
                    +₹{portfolio?.totalGain?.toLocaleString('en-IN')} ({portfolio?.totalGainPct}%)
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {portfolio?.holdings?.map((h: InvestmentHolding) => (
                  <div
                    key={h.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{h.fundName}</p>
                      <p className="text-[11px] text-slate-500">Invested: ₹{h.investedAmount.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-teal-800">₹{h.currentValue.toLocaleString('en-IN')}</p>
                      <span className="text-[10px] text-teal-800 font-semibold">+{h.returnsPercentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
