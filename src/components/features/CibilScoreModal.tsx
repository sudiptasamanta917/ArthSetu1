import React, { useState, useEffect } from 'react';
import { 
  X, 
  Award, 
  RefreshCw, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ChevronRight, 
  Download, 
  HelpCircle, 
  Zap,
  Info,
  Calendar,
  Layers
} from 'lucide-react';
import { cibilApi } from '../../api/cibilApi';
import { CibilReport, CibilFactor } from '../../types';

interface CibilScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPersonalLoan: () => void;
}

export const CibilScoreModal: React.FC<CibilScoreModalProps> = ({
  isOpen,
  onClose,
  onApplyPersonalLoan,
}) => {
  const [report, setReport] = useState<CibilReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFactor, setSelectedFactor] = useState<CibilFactor | null>(null);
  const [simulatorScenario, setSimulatorScenario] = useState<'pay_card_balance' | 'miss_emi' | 'new_credit_card' | 'close_loan'>('pay_card_balance');
  const [simulatedResult, setSimulatedResult] = useState<any>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadReport();
    }
  }, [isOpen]);

  const loadReport = async () => {
    setLoading(true);
    try {
      const res = await cibilApi.getReport();
      setReport(res.data);
      if (res.data.factors.length > 0) {
        setSelectedFactor(res.data.factors[0]);
      }
      setSimulatedResult(cibilApi.simulateScoreImpact('pay_card_balance'));
    } catch (e) {
      console.error(e);
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
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSimulateChange = (scenario: 'pay_card_balance' | 'miss_emi' | 'new_credit_card' | 'close_loan') => {
    setSimulatorScenario(scenario);
    setSimulatedResult(cibilApi.simulateScoreImpact(scenario));
  };

  const handleDownloadReport = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  if (!isOpen) return null;

  // Visual Score Gauge calculation (300 to 900 scale)
  const score = report?.score || 785;
  const scorePercent = Math.min(100, Math.max(0, ((score - 300) / 600) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-teal-900 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-800 border border-teal-700 flex items-center justify-center">
              <Award className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">TransUnion CIBIL Credit Score</h2>
                <span className="text-[10px] bg-teal-800 text-teal-100 px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-teal-700">
                  Official Bureau
                </span>
              </div>
              <p className="text-xs text-teal-200">
                Last checked: {report?.lastUpdated || 'Today'} • Zero Impact on Score
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition flex items-center gap-1 text-xs cursor-pointer"
              title="Refresh CIBIL Score"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Main Score Meter Card */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 sm:p-6 text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-800" />
              <span>High Loan Approval Probability (98%)</span>
            </div>

            {/* Score Number and Status */}
            <div>
              <div className="text-5xl sm:text-6xl font-black text-teal-900 tracking-tight">
                {score}
              </div>
              <p className="text-sm font-bold text-slate-800 mt-1">
                Rating: <span className="text-teal-800 font-extrabold">{report?.status || 'Excellent'}</span> (300 - 900)
              </p>
              <p className="text-xs text-slate-500">Next free automated refresh: {report?.nextRefreshDate}</p>
            </div>

            {/* Color Speedometer Bar */}
            <div className="max-w-md mx-auto space-y-2">
              <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden flex relative">
                <div className="w-[20%] bg-rose-500" title="Poor (300-549)" />
                <div className="w-[20%] bg-amber-500" title="Fair (550-649)" />
                <div className="w-[25%] bg-yellow-400" title="Good (650-749)" />
                <div className="w-[35%] bg-teal-600" title="Excellent (750-900)" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>300 (Poor)</span>
                <span>600 (Fair)</span>
                <span>750 (Good)</span>
                <span className="text-teal-800 font-bold">900 (Excellent)</span>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-200">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Payment Record</span>
                <p className="text-xs font-bold text-teal-800">{report?.onTimePaymentRate}% On-Time</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Credit Usage</span>
                <p className="text-xs font-bold text-teal-800">{report?.creditUtilizationRate}% (Safe &lt;30%)</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Active Accounts</span>
                <p className="text-xs font-bold text-slate-900">{report?.activeAccounts} of {report?.totalAccounts}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Credit Age</span>
                <p className="text-xs font-bold text-slate-900">{report?.creditAgeYears} Years</p>
              </div>
            </div>
          </div>

          {/* 5 Key Credit Factors Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>5 Core CIBIL Score Factors</span>
                <span className="text-xs font-normal text-slate-500">(Click to view impact details)</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {report?.factors.map((factor) => (
                <div
                  key={factor.id}
                  onClick={() => setSelectedFactor(factor)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    selectedFactor?.id === factor.id
                      ? 'bg-teal-50/50 border-teal-800 shadow-xs ring-1 ring-teal-800/20'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{factor.name}</span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                          factor.impact === 'High' 
                            ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {factor.impact} Impact
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-teal-800">{factor.currentValue}</p>
                    </div>

                    <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {factor.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-2 line-clamp-2">{factor.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Score Simulator Tool */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-teal-800" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">CIBIL Score Simulator</h4>
              </div>
              <span className="text-[10px] text-slate-500">See future score predictions</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'pay_card_balance', label: 'Pay Full Credit Dues' },
                { id: 'miss_emi', label: 'Miss an EMI Payment' },
                { id: 'new_credit_card', label: 'Apply New Credit Card' },
                { id: 'close_loan', label: 'Close Active Loan' },
              ].map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => handleSimulateChange(sc.id as any)}
                  className={`p-2 rounded-lg text-xs font-medium border text-center transition cursor-pointer ${
                    simulatorScenario === sc.id
                      ? 'bg-teal-800 text-white border-teal-800 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {sc.label}
                </button>
              ))}
            </div>

            {simulatedResult && (
              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs flex items-center justify-between gap-3 animate-in fade-in">
                <div className="space-y-0.5">
                  <p className="text-xs text-slate-700">{simulatedResult.message}</p>
                  <p className="text-[11px] text-slate-500">Projected new score: <strong className="text-slate-900">{simulatedResult.projectedScore}</strong></p>
                </div>
                <div className={`px-3 py-1 rounded-lg text-xs font-extrabold shrink-0 ${
                  simulatedResult.scoreChange >= 0 ? 'bg-teal-50 text-teal-800 border border-teal-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {simulatedResult.scoreChange >= 0 ? `+${simulatedResult.scoreChange} Pts` : `${simulatedResult.scoreChange} Pts`}
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              onClick={handleDownloadReport}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <Download className="w-4 h-4 text-teal-800" />
              <span>{downloadSuccess ? 'Report Downloaded (PDF) ✓' : 'Download Full Credit Report'}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onApplyPersonalLoan();
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Apply Loan with this 785 Score</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
