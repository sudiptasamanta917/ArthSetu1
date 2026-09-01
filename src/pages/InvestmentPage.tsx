import React, { useState, useEffect } from 'react';
import { 
  Coins, 
  Flame, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight, 
  Zap, 
  Clock, 
  Calculator,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { UserProfile, InvestmentFund, InvestmentHolding } from '../types';
import { investmentApi } from '../api';

interface PortfolioData {
  holdings: InvestmentHolding[];
  totalInvested: number;
  totalCurrent: number;
  totalGain: number;
  totalGainPct: number;
}

interface InvestmentPageProps {
  user: UserProfile | null;
}

export const InvestmentPage: React.FC<InvestmentPageProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'funds' | 'gold' | 'sip_calc' | 'portfolio'>('funds');
  const [funds, setFunds] = useState<InvestmentFund[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(false);

  // SIP Calculator State
  const [sipAmount, setSipAmount] = useState<number>(5000);
  const [sipTenure, setSipTenure] = useState<number>(10);
  const [sipReturnRate, setSipReturnRate] = useState<number>(15);

  // Digital Gold State
  const [goldAmount, setGoldAmount] = useState<number>(5000);
  const [goldGrams, setGoldGrams] = useState<number>(0.6738);
  const [goldBought, setGoldBought] = useState(false);

  useEffect(() => {
    fetchInvestmentData();
  }, []);

  const fetchInvestmentData = async () => {
    try {
      const [fundsRes, portRes] = await Promise.all([
        investmentApi.getFunds(),
        investmentApi.getPortfolio(),
      ]);
      setFunds(fundsRes.data);
      setPortfolio(portRes.data);
    } catch (e) {
      console.error('Failed to get investment data:', e);
    }
  };

  // SIP Future Value Formula
  const i = sipReturnRate / 100 / 12;
  const nMonths = sipTenure * 12;
  const futureValue = Math.round(
    sipAmount * ((Math.pow(1 + i, nMonths) - 1) / i) * (1 + i)
  );
  const totalInvested = sipAmount * nMonths;
  const estimatedReturns = futureValue - totalInvested;

  const handleStartSip = async (fundId: string) => {
    setLoading(true);
    try {
      await investmentApi.startInvestment(fundId, sipAmount, true);
      await fetchInvestmentData();
      setActiveTab('portfolio');
    } catch (e) {
      console.error('SIP failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyGold = async () => {
    setLoading(true);
    try {
      await investmentApi.startInvestment('fund_digital_gold_24k', goldAmount, false);
      setGoldBought(true);
      await fetchInvestmentData();
    } catch (e) {
      console.error('Gold buy failed:', e);
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
            <Coins className="w-3.5 h-3.5 text-teal-300" />
            <span>0% Commission Direct Mutual Funds & 24K Pure Gold</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Smart Investments & Wealth Creation
          </h1>
          <p className="text-sm text-teal-200 leading-relaxed">
            Invest in top-performing direct mutual funds, start daily or monthly SIP from ₹100, and accumulate 24K 99.9% pure insured digital gold with instant liquidity.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-teal-100">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero Brokerage & Zero AMC</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Direct Plans = Higher Returns</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Stored in MMTC-PAMP Insured Vaults</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white rounded-xl border border-slate-200 p-1 gap-1 text-xs max-w-xl shadow-2xs">
        {[
          { id: 'funds', label: 'Top Mutual Funds' },
          { id: 'gold', label: '24K Digital Gold' },
          { id: 'sip_calc', label: 'SIP Calculator' },
          { id: 'portfolio', label: 'My Portfolio' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2 px-2.5 rounded-lg font-bold transition text-center cursor-pointer ${
              activeTab === tab.id
                ? 'bg-teal-800 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Mutual Funds */}
      {activeTab === 'funds' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              5-Star Ranked Direct Equity & Hybrid Funds
            </h2>
            <span className="text-xs text-teal-800 font-semibold flex items-center gap-1 bg-teal-50 px-2.5 py-1 rounded-lg">
              <Zap className="w-3.5 h-3.5" />
              Instant Online Paperless SIP
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {funds
              .filter((f) => f.category !== 'Digital Gold')
              .map((fund) => (
                <div
                  key={fund.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-teal-800/40 shadow-sm transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{fund.name}</h3>
                        {fund.badge && (
                          <span className="text-[10px] font-semibold bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded">
                            {fund.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {fund.subCategory} • Fund Manager: {fund.fundManager}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-semibold">3Y Annualized</span>
                        <span className="text-base font-black text-teal-800">+{fund.return3Y}% p.a.</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-4">
                      <span>Min SIP: <strong className="text-slate-900">₹{fund.minSipAmount}</strong></span>
                      <span>1Y Return: <strong className="text-teal-800">+{fund.return1Y}%</strong></span>
                      <span>5Y Return: <strong className="text-teal-800">+{fund.return5Y}%</strong></span>
                    </div>

                    <button
                      onClick={() => handleStartSip(fund.id)}
                      disabled={loading}
                      className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-teal-200" />
                      <span>Start Monthly SIP</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 2: Digital Gold */}
      {activeTab === 'gold' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">24K 99.9% Pure Digital Gold</h2>
                  <p className="text-xs text-slate-500">Stored in IDBI Trustee & MMTC-PAMP Insured Vaults</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Live Spot Price</span>
                <span className="text-base font-black text-amber-600">₹7,420.50 / gm</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Buy in Rupees (₹)</label>
                <input
                  type="number"
                  value={goldAmount}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setGoldAmount(val);
                    setGoldGrams(Number((val / 7420.5).toFixed(4)));
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Weight in Grams (g)</label>
                <input
                  type="number"
                  step={0.1}
                  value={goldGrams}
                  onChange={(e) => {
                    const grams = Number(e.target.value);
                    setGoldGrams(grams);
                    setGoldAmount(Math.round(grams * 7420.5));
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-800"
                />
              </div>
            </div>

            <div className="flex gap-2">
              {[500, 1000, 5000, 10000, 25000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setGoldAmount(amt);
                    setGoldGrams(Number((amt / 7420.5).toFixed(4)));
                  }}
                  className="py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition cursor-pointer"
                >
                  +₹{amt.toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            <button
              onClick={handleBuyGold}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Coins className="w-4 h-4 text-teal-200" />
              <span>{loading ? 'Purchasing 24K Gold...' : `Buy ${goldGrams}g Digital Gold for ₹${goldAmount.toLocaleString('en-IN')}`}</span>
            </button>

            {goldBought && (
              <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>24K Gold successfully purchased and credited to your secure locker!</span>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">Why Invest in Digital Gold with Money View?</h3>
            <ul className="space-y-2 text-slate-600 list-disc list-inside leading-relaxed">
              <li><strong>24K 99.9% Purity</strong> certified by government-licensed assayers.</li>
              <li><strong>Insured Custody:</strong> Stored in physical institutional vaults with 100% insurance backing by IDBI Trusteeship.</li>
              <li><strong>Instant 24x7 Liquidity:</strong> Sell back to your bank account anytime at live market rates.</li>
              <li><strong>Physical Delivery:</strong> Request delivery of physical minted gold coins directly to your doorstep.</li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 3: SIP Calculator */}
      {activeTab === 'sip_calc' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">SIP Wealth Compounding Calculator</h2>
                <p className="text-xs text-slate-500">Calculate the power of compounding on monthly mutual fund investments</p>
              </div>
              <div className="p-2 rounded-xl bg-teal-50 text-teal-800">
                <Calculator className="w-5 h-5" />
              </div>
            </div>

            {/* Slider 1: SIP Amount */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Monthly SIP Investment Amount</span>
                <span className="text-teal-800 font-bold">₹{sipAmount.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min={500}
                max={100000}
                step={500}
                value={sipAmount}
                onChange={(e) => setSipAmount(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-800"
              />
            </div>

            {/* Slider 2: Tenure */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Investment Horizon (Years)</span>
                <span className="text-slate-900 font-bold">{sipTenure} Years</span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={sipTenure}
                onChange={(e) => setSipTenure(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-800"
              />
            </div>

            {/* Slider 3: Expected Return Rate */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Expected Annual Return Rate (% p.a.)</span>
                <span className="text-teal-800 font-bold">{sipReturnRate}% p.a.</span>
              </div>
              <input
                type="range"
                min={6}
                max={25}
                step={1}
                value={sipReturnRate}
                onChange={(e) => setSipReturnRate(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-800"
              />
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-center space-y-5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Projected Maturity Wealth
            </span>
            <div className="text-4xl sm:text-5xl font-black text-teal-900">
              ₹{futureValue.toLocaleString('en-IN')}
            </div>

            <div className="text-xs space-y-2 pt-3 border-t border-slate-100 text-left">
              <div className="flex justify-between text-slate-600">
                <span>Total Invested Amount:</span>
                <span className="text-slate-900 font-bold">₹{totalInvested.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Compounded Gains:</span>
                <span className="text-teal-800 font-bold">+₹{estimatedReturns.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('funds')}
              className="w-full py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-xs transition cursor-pointer"
            >
              Start SIP with Top Funds
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: Portfolio */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Portfolio Value</span>
              <div className="text-2xl font-black text-slate-900">
                ₹{portfolio?.totalCurrent?.toLocaleString('en-IN') || '0'}
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Invested</span>
              <div className="text-2xl font-black text-slate-900">
                ₹{portfolio?.totalInvested?.toLocaleString('en-IN') || '0'}
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Profit / Returns</span>
              <div className="text-2xl font-black text-teal-800">
                +₹{portfolio?.totalGain?.toLocaleString('en-IN')} ({portfolio?.totalGainPct}%)
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Active Holdings</h3>
            <div className="space-y-2">
              {portfolio?.holdings?.map((h: InvestmentHolding) => (
                <div
                  key={h.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs hover:bg-slate-100/70 transition"
                >
                  <div>
                    <p className="font-bold text-slate-900">{h.fundName}</p>
                    <p className="text-[11px] text-slate-500">Invested: ₹{h.investedAmount.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-teal-800">₹{h.currentValue.toLocaleString('en-IN')}</p>
                    <span className="text-[10px] text-teal-800 font-semibold">+{h.returnsPercentage}% Total Return</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
