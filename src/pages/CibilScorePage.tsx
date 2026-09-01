import React, { useState, useEffect } from 'react';
import { 
  Award, 
  TrendingUp, 
  ShieldCheck, 
  CreditCard, 
  Clock, 
  HelpCircle, 
  Download, 
  RefreshCw, 
  Sparkles, 
  AlertTriangle,
  CheckCircle2,
  Zap,
  Layers
} from 'lucide-react';
import { UserProfile, CibilReport } from '../types';
import { cibilApi } from '../api';

interface CibilScorePageProps {
  user: UserProfile | null;
  onNavigateToPersonalLoan?: () => void;
  onNavigateToFd?: () => void;
}

export const CibilScorePage: React.FC<CibilScorePageProps> = ({
  user,
  onNavigateToPersonalLoan,
  onNavigateToFd,
}) => {
  const [report, setReport] = useState<CibilReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'factors' | 'simulator'>('overview');

  // Simulator State
  const [simPayDebt, setSimPayDebt] = useState(true);
  const [simNewCard, setSimNewCard] = useState(false);
  const [simMissEmi, setSimMissEmi] = useState(false);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await cibilApi.getReport();
      setReport(res.data);
    } catch (e) {
      console.error('Failed to get credit report:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await cibilApi.refreshScore();
      setReport(res.data);
    } catch (e) {
      console.error('Failed to refresh score:', e);
    } finally {
      setRefreshing(false);
    }
  };

  const currentScore = report?.score || user?.creditScore || 785;

  // Simulator dynamic score calculation
  const simulatedScore = Math.min(
    900,
    Math.max(
      300,
      currentScore +
        (simPayDebt ? 28 : 0) -
        (simNewCard ? 12 : 0) -
        (simMissEmi ? 65 : 0)
    )
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="rounded-2xl bg-teal-900 text-white p-6 sm:p-8 border border-teal-800 shadow-sm relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-800/80 border border-teal-700 text-teal-200 text-xs font-semibold">
            <Award className="w-3.5 h-3.5 text-teal-300" />
            <span>Official RBI Licensed Credit Bureau Partner</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Free CIBIL & Experian Credit Bureau Report
          </h1>
          <p className="text-sm text-teal-200 leading-relaxed">
            Monitor your credit health with zero impact on your score. Get detailed insights on payment history, credit utilization, and custom recommendations to reach 800+.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-teal-100">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Free & No Credit Hit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Monthly Refresh & WhatsApp Alerts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Exclusive Pre-Approved Loan Rates</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white rounded-xl border border-slate-200 p-1 gap-1 text-xs max-w-md shadow-2xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 px-3 rounded-lg font-bold transition cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-teal-800 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Credit Score Overview
        </button>
        <button
          onClick={() => setActiveTab('factors')}
          className={`flex-1 py-2 px-3 rounded-lg font-bold transition cursor-pointer ${
            activeTab === 'factors'
              ? 'bg-teal-800 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          5 Score Factors
        </button>
        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex-1 py-2 px-3 rounded-lg font-bold transition cursor-pointer ${
            activeTab === 'simulator'
              ? 'bg-teal-800 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Score Simulator
        </button>
      </div>

      {/* TAB 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Gauge & Score Status */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 text-center">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Live Bureau Score (CIBIL / CRIF)
              </span>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-1 text-xs text-teal-800 font-semibold hover:underline cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                <span>{refreshing ? 'Fetching...' : 'Refresh Bureau'}</span>
              </button>
            </div>

            {/* Visual Circular Gauge Representation */}
            <div className="relative w-52 h-52 mx-auto flex flex-col items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-100"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * ((currentScore - 300) / 600))}
                  strokeLinecap="round"
                  className="text-teal-800 transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-0.5">
                <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                  {currentScore}
                </span>
                <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                  Excellent Credit
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Out of 900</span>
              </div>
            </div>

            {/* Score Range Scale */}
            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-1 text-[10px] text-center font-bold">
                <div className="p-1.5 rounded bg-rose-50 text-rose-700 border border-rose-100">300-599<br/><span className="text-[9px] font-normal">Poor</span></div>
                <div className="p-1.5 rounded bg-amber-50 text-amber-700 border border-amber-100">600-699<br/><span className="text-[9px] font-normal">Fair</span></div>
                <div className="p-1.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">700-749<br/><span className="text-[9px] font-normal">Good</span></div>
                <div className="p-1.5 rounded bg-teal-50 text-teal-900 border border-teal-200 ring-1 ring-teal-800/30">750-900<br/><span className="text-[9px] font-semibold">Excellent</span></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-800" />
                <span className="text-xs font-bold text-slate-900">Pre-Approved Loan Benefits:</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                With a score of {currentScore}, you qualify for <strong>instant loan approval up to ₹10 Lakhs</strong> at our lowest interest tier (10.50% p.a.) with zero guarantor requirement.
              </p>
              <button
                onClick={onNavigateToPersonalLoan}
                className="w-full py-2.5 rounded-lg bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs transition cursor-pointer"
              >
                Claim Pre-Approved Personal Loan
              </button>
            </div>
          </div>

          {/* Right Column: Quick Pillar Breakdown */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Credit Health Breakdown</h3>
              
              <div className="space-y-3 text-xs">
                {/* 1. Payment History */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 font-bold">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">On-Time Payment Track</p>
                      <p className="text-[11px] text-slate-500">100% on-time EMI and card payments (36/36)</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">100% (High Impact)</span>
                </div>

                {/* 2. Credit Card Limit Utilization */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-teal-100 text-teal-800 font-bold">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Credit Card Utilization</p>
                      <p className="text-[11px] text-slate-500">₹36,000 used of ₹2,00,000 limit</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-teal-800 bg-teal-50 px-2 py-1 rounded">18% (Optimal)</span>
                </div>

                {/* 3. Credit Age */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-200 text-slate-800 font-bold">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Average Credit Age</p>
                      <p className="text-[11px] text-slate-500">Oldest active account is 4.8 years old</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-slate-900 bg-slate-100 px-2 py-1 rounded">4.2 Yrs</span>
                </div>

                {/* 4. Total Inquiries */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 font-bold">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Recent Hard Inquiries</p>
                      <p className="text-[11px] text-slate-500">0 inquiries in past 3 months</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">0 (Low Risk)</span>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="p-5 rounded-2xl bg-teal-900 text-white space-y-3">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-200" />
                <span>How to Maintain an 800+ CIBIL Score</span>
              </h4>
              <ul className="text-xs text-teal-100 space-y-1.5 list-disc list-inside leading-relaxed">
                <li>Keep total monthly credit card balance under 30% of your total credit limit.</li>
                <li>Set up auto-debit for loan EMIs to avoid accidental delays.</li>
                <li>Avoid applying for multiple credit cards or personal loans within a 30-day window.</li>
                <li>Maintain a healthy mix of secured (auto/home) and unsecured (personal) loans.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Factors */}
      {activeTab === 'factors' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">The 5 Core Pillars of Your Credit Bureau Score</h3>
            <p className="text-xs text-slate-500">How RBI recognized credit rating agencies (CIBIL, Experian, Equifax, CRIF Highmark) calculate your score</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">1. Repayment History (35% Weight)</h4>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Highest Impact</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Consistent on-time repayments of EMIs and card bills form the foundation of your credit profile. Even a single 30-day delay can drop your score by 40-70 points.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">2. Credit Utilization Ratio (30% Weight)</h4>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">High Impact</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                The percentage of your revolving credit limit you actually use. Keeping card utilization below 30% indicates low credit hunger and financial stability.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">3. Credit History Age (15% Weight)</h4>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">Medium Impact</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Older accounts demonstrate a long, verified history of responsible credit handling. Do not close your oldest credit cards to maintain average credit age.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">4. Credit Mix & Diversity (10% Weight)</h4>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">Low Impact</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                A healthy blend of secured loans (home loan, auto loan) and unsecured credit (credit card, personal loan) proves you can handle diverse debt instruments.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Simulator */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Interactive Credit Score Simulator</h3>
              <p className="text-xs text-slate-500">Test different financial actions to see how they will impact your CIBIL score before executing them.</p>
            </div>

            <div className="space-y-4">
              {/* Option 1 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-900 block">Pay off ₹40,000 in credit card dues</span>
                  <span className="text-[11px] text-slate-500">Reduces utilization ratio from 18% to 2%</span>
                </div>
                <input
                  type="checkbox"
                  checked={simPayDebt}
                  onChange={(e) => setSimPayDebt(e.target.checked)}
                  className="w-5 h-5 rounded accent-teal-800 cursor-pointer"
                />
              </div>

              {/* Option 2 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-900 block">Apply for 2 new credit cards simultaneously</span>
                  <span className="text-[11px] text-slate-500">Triggers 2 hard bureau inquiries</span>
                </div>
                <input
                  type="checkbox"
                  checked={simNewCard}
                  onChange={(e) => setSimNewCard(e.target.checked)}
                  className="w-5 h-5 rounded accent-teal-800 cursor-pointer"
                />
              </div>

              {/* Option 3 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-900 block">Miss 1 EMI payment by 30+ days</span>
                  <span className="text-[11px] text-slate-500">Severely impacts payment history pillar</span>
                </div>
                <input
                  type="checkbox"
                  checked={simMissEmi}
                  onChange={(e) => setSimMissEmi(e.target.checked)}
                  className="w-5 h-5 rounded accent-teal-800 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Simulator Result */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 text-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Projected CIBIL Score
            </span>
            <div className="text-5xl font-black text-teal-900">
              {simulatedScore}
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                simulatedScore >= currentScore 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {simulatedScore >= currentScore ? `+${simulatedScore - currentScore} Points Projected` : `${simulatedScore - currentScore} Points Projected`}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed text-left pt-3 border-t border-slate-100">
              {simulatedScore >= 800
                ? '🌟 Outstanding score! You will unlock the lowest possible interest rates, zero processing fees, and instant loan pre-approvals.'
                : 'Maintaining your regular repayments on time is the single most reliable way to achieve an 800+ credit score.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
