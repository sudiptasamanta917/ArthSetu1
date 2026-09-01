import React, { useState } from 'react';
import { 
  X, 
  Code, 
  Server, 
  Check, 
  Copy, 
  Layers, 
  ArrowRight, 
  Database, 
  ExternalLink,
  Shield,
  Zap
} from 'lucide-react';
import { API_CONFIG } from '../../api/client';

interface ApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiConfigModal: React.FC<ApiConfigModalProps> = ({ isOpen, onClose }) => {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const [baseUrlInput, setBaseUrlInput] = useState(API_CONFIG.baseUrl);
  const [isMockMode, setIsMockMode] = useState(API_CONFIG.useMockData);

  if (!isOpen) return null;

  const ENDPOINTS = [
    { method: 'POST', path: '/api/auth/send-otp', desc: 'Send mobile OTP for login/register', module: 'src/api/authApi.ts' },
    { method: 'POST', path: '/api/auth/register', desc: 'Register user with PAN & employment', module: 'src/api/authApi.ts' },
    { method: 'GET', path: '/api/loans/offers', desc: 'Fetch pre-approved personal & business limits', module: 'src/api/loanApi.ts' },
    { method: 'POST', path: '/api/loans/apply', desc: 'Instant loan application & sanction', module: 'src/api/loanApi.ts' },
    { method: 'GET', path: '/api/cibil/report', desc: 'Get TransUnion CIBIL score & 5 factors', module: 'src/api/cibilApi.ts' },
    { method: 'POST', path: '/api/cibil/refresh', desc: 'Live bureau refresh for updated score', module: 'src/api/cibilApi.ts' },
    { method: 'POST', path: '/api/kyc/verify-pan', desc: 'Realtime NSDL PAN card authentication', module: 'src/api/kycApi.ts' },
    { method: 'POST', path: '/api/kyc/aadhaar-otp', desc: 'DigiLocker UIDAI Aadhaar verification', module: 'src/api/kycApi.ts' },
    { method: 'POST', path: '/api/kyc/penny-drop', desc: '₹1 Bank verification for direct disbursals', module: 'src/api/kycApi.ts' },
    { method: 'GET', path: '/api/fd/schemes', desc: 'Fetch high-yield bank & NBFC FD rates', module: 'src/api/fdApi.ts' },
    { method: 'POST', path: '/api/fd/book', desc: 'Instant paperless FD deposit booking', module: 'src/api/fdApi.ts' },
    { method: 'GET', path: '/api/investments/funds', desc: 'Direct Mutual Funds & 24K pure Gold rates', module: 'src/api/investmentApi.ts' },
  ];

  const handleCopy = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedEndpoint(path);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const handleSaveConfig = () => {
    API_CONFIG.baseUrl = baseUrlInput;
    API_CONFIG.useMockData = isMockMode;
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-teal-900 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-800 border border-teal-700 flex items-center justify-center">
              <Code className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">Separated API Architecture</h2>
                <span className="text-[10px] bg-teal-800 text-teal-100 px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-teal-700">
                  Ready for Backend
                </span>
              </div>
              <p className="text-xs text-teal-200">
                All UI features are completely decoupled into modular service files in <code className="text-teal-100 font-semibold">/src/api/</code>
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

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs">
          {/* Quick Explanation */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-xs">
              <Layers className="w-4 h-4 text-teal-800" />
              <span>How to Connect Your Real Backend Server Later</span>
            </h3>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              The entire application is designed with clean separation of concerns. All API calls (Auth, Personal Loans, Business Loans, CIBIL Bureau, DigiLocker KYC, Fixed Deposits, and Mutual Funds) are contained inside dedicated service files in <strong>/src/api/</strong>. When you build your backend server (Express, Django, Spring Boot, etc.), simply update the base URL below or change <code className="text-teal-800 font-semibold">useMockData: false</code> in <strong>/src/api/client.ts</strong>.
            </p>
          </div>

          {/* Configuration Controls */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">Backend Gateway Configuration</h4>
            
            <div className="space-y-1">
              <label className="text-slate-700 font-semibold block text-[11px]">API Base URL</label>
              <input
                type="text"
                value={baseUrlInput}
                onChange={(e) => setBaseUrlInput(e.target.value)}
                placeholder="https://api.yourdomain.com/v1"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono text-xs focus:outline-none focus:border-teal-800"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="space-y-0.5">
                <span className="font-semibold text-slate-900 block">Use Simulated Mock Responses</span>
                <span className="text-[10px] text-slate-500">Provides realistic delay, localStorage persistence, and test data</span>
              </div>
              <input
                type="checkbox"
                checked={isMockMode}
                onChange={(e) => setIsMockMode(e.target.checked)}
                className="w-4 h-4 accent-teal-800 cursor-pointer"
              />
            </div>
          </div>

          {/* Separated Endpoints Directory */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">Modular API Endpoints</h4>
            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {ENDPOINTS.map((ep, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 hover:border-slate-300 transition"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                      ep.method === 'POST' ? 'bg-teal-50 text-teal-800 border-teal-200' : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}>
                      {ep.method}
                    </span>
                    <span className="font-mono text-slate-900 truncate font-semibold">{ep.path}</span>
                    <span className="text-slate-500 hidden md:inline">• {ep.desc}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">{ep.module}</span>
                    <button
                      onClick={() => handleCopy(ep.path)}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                      title="Copy endpoint"
                    >
                      {copiedEndpoint === ep.path ? <Check className="w-3.5 h-3.5 text-teal-800" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleSaveConfig}
            className="w-full py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-xs transition cursor-pointer"
          >
            Save Configuration & Close
          </button>
        </div>
      </div>
    </div>
  );
};
