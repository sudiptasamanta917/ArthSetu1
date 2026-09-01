import React, { useState } from 'react';
import { 
  User, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  Wallet, 
  History, 
  Shield, 
  FileText, 
  Gift, 
  Settings, 
  HelpCircle, 
  X,
  Sparkles,
  PhoneCall,
  MessageSquare,
  Building2,
  ExternalLink,
  Award,
  Coins
} from 'lucide-react';
import { UserProfile, AppPage } from '../../types';
import { ArthSetuLogo } from '../common/ArthSetuLogo';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onNavigate: (page: AppPage) => void;
  onOpenProfile: () => void;
  onOpenKyc: () => void;
  onOpenCibil: () => void;
  onOpenApiConfig: () => void;
  onOpenReferAndEarn?: () => void;
  onOpenAcoinsZone?: () => void;
  onOpenAuth?: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  user,
  onNavigate,
  onOpenProfile,
  onOpenKyc,
  onOpenCibil,
  onOpenApiConfig,
  onOpenReferAndEarn,
  onOpenAcoinsZone,
  onOpenAuth,
}) => {
  // Accordion open states
  const [personalLoanOpen, setPersonalLoanOpen] = useState(true);
  const [rewardsOpen, setRewardsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  // Simple modal states for inner actions
  const [showInsuranceInfo, setShowInsuranceInfo] = useState(false);
  const [showPartnersInfo, setShowPartnersInfo] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);

  if (!isOpen) return null;

  const userName = user?.fullName || 'Sudipta Samanta';
  const userPhone = user?.phone || '+918373041030';
  const userEmail = user?.email || 'sudiptasamanta917@gmail.com';

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="relative w-full max-w-sm sm:max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-250 overflow-y-auto">
        {/* Top Profile Header (Deep Teal as in screenshot) */}
        <div className="bg-[#004856] text-white p-5 sm:p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>

          {/* User Profile Card */}
          <div 
            onClick={() => {
              onClose();
              onOpenProfile();
            }}
            className="flex items-center justify-between gap-3 pt-2 cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              {/* Circular light cyan avatar */}
              <div className="w-16 h-16 rounded-full bg-[#D4EFF2] text-[#004856] flex items-center justify-center font-bold text-2xl shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                <User className="w-8 h-8 text-[#004856]" />
              </div>

              <div className="space-y-0.5">
                <h3 className="font-bold text-base sm:text-lg text-white leading-tight">
                  {userName}
                </h3>
                <p className="text-xs text-cyan-100 font-medium tracking-wide">
                  {userPhone}
                </p>
                <p className="text-xs text-cyan-200/90 truncate max-w-[190px] sm:max-w-[220px]">
                  {userEmail}
                </p>
              </div>
            </div>

            <ChevronRight className="w-6 h-6 text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
          </div>
        </div>

        {/* Navigation Accordion List */}
        <div className="flex-1 divide-y divide-slate-100 bg-white">
          {/* 1. Personal Loan Section (Accordion open) */}
          <div className="p-3">
            <button
              onClick={() => setPersonalLoanOpen(!personalLoanOpen)}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition cursor-pointer text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#E8F7F9] text-[#004856] flex items-center justify-center shrink-0">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="font-bold text-slate-900 text-sm group-hover:text-[#004856] transition-colors">
                  Personal Loan
                </span>
              </div>
              {personalLoanOpen ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {/* Sub-items */}
            {personalLoanOpen && (
              <div className="pl-14 pr-2 py-1 space-y-1 animate-in fade-in duration-150">
                <button
                  onClick={() => {
                    onClose();
                    onNavigate('applications');
                  }}
                  className="w-full text-left py-2.5 px-3 text-xs font-semibold text-slate-700 hover:text-[#004856] hover:bg-[#E8F7F9]/50 rounded-lg flex items-center gap-3 transition cursor-pointer"
                >
                  <History className="w-4 h-4 text-[#004856]" />
                  <span>Loan History</span>
                </button>

                <button
                  onClick={() => setShowInsuranceInfo(true)}
                  className="w-full text-left py-2.5 px-3 text-xs font-semibold text-slate-700 hover:text-[#004856] hover:bg-[#E8F7F9]/50 rounded-lg flex items-center gap-3 transition cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-[#004856]" />
                  <span>Insurance</span>
                </button>

                <button
                  onClick={() => setShowPartnersInfo(true)}
                  className="w-full text-left py-2.5 px-3 text-xs font-semibold text-slate-700 hover:text-[#004856] hover:bg-[#E8F7F9]/50 rounded-lg flex items-center gap-3 transition cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#004856]" />
                  <span>Lending Partners</span>
                </button>
              </div>
            )}
          </div>

          {/* 2. Rewards Section (Accordion with New Badge) */}
          <div className="p-3">
            <button
              onClick={() => setRewardsOpen(!rewardsOpen)}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition cursor-pointer text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#E8F7F9] text-[#004856] flex items-center justify-center shrink-0">
                  <Gift className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm group-hover:text-[#004856] transition-colors">
                    Rewards
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-amber-950 uppercase tracking-wider shadow-2xs">
                    New
                  </span>
                </div>
              </div>
              {rewardsOpen ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {rewardsOpen && (
              <div className="pl-14 pr-2 py-1 space-y-1 animate-in fade-in duration-150">
                <div className="p-3 bg-[#E8F7F9] rounded-xl border border-[#BDE8EE] space-y-1.5 my-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#004856]">Acoins Balance</span>
                    <span className="text-sm font-extrabold text-[#004856]">⬡ 0 Coins</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Earn 100 coins on every EMI on-time payment. Redeem as 24K Pure Gold or Cash!
                  </p>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    if (onOpenReferAndEarn) onOpenReferAndEarn();
                  }}
                  className="w-full text-left py-2.5 px-3 text-xs font-semibold text-slate-700 hover:text-[#004856] hover:bg-[#E8F7F9]/50 rounded-lg flex items-center justify-between transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Gift className="w-4 h-4 text-[#004856]" />
                    <span>Refer & Earn (₹80k+/mo)</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#004856] bg-cyan-100 px-1.5 py-0.5 rounded">₹1,000</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    if (onOpenAcoinsZone) onOpenAcoinsZone();
                  }}
                  className="w-full text-left py-2.5 px-3 text-xs font-semibold text-slate-700 hover:text-[#004856] hover:bg-[#E8F7F9]/50 rounded-lg flex items-center justify-between transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Coins className="w-4 h-4 text-amber-600" />
                    <span>Acoins Zone & Gold</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-200 px-1.5 py-0.5 rounded">Claim +50</span>
                </button>
              </div>
            )}
          </div>

          {/* 3. Settings & Authentication */}
          <div className="p-3">
            <button
              onClick={() => {
                onClose();
                onOpenProfile();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition cursor-pointer text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#E8F7F9] text-[#004856] flex items-center justify-center shrink-0">
                  <Settings className="w-5 h-5" />
                </div>
                <span className="font-bold text-slate-900 text-sm group-hover:text-[#004856] transition-colors">
                  Settings & Profile
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {onOpenAuth && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="mt-1 w-full flex items-center justify-between py-2 px-3.5 rounded-lg bg-[#F0F8FA] hover:bg-[#E2F2F5] transition cursor-pointer text-left group text-xs font-bold text-[#004856]"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#004856]" />
                  <span>Login / Loan Data Consent Flow</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#004856] group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>

          {/* 4. Help & Support (Accordion) */}
          <div className="p-3">
            <button
              onClick={() => setHelpOpen(!helpOpen)}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition cursor-pointer text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#E8F7F9] text-[#004856] flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <span className="font-bold text-slate-900 text-sm group-hover:text-[#004856] transition-colors">
                  Help & Support
                </span>
              </div>
              {helpOpen ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {helpOpen && (
              <div className="pl-14 pr-2 py-1 space-y-1 animate-in fade-in duration-150">
                <button
                  onClick={() => setShowFaqModal(true)}
                  className="w-full text-left py-2.5 px-3 text-xs font-semibold text-slate-700 hover:text-[#004856] hover:bg-[#E8F7F9]/50 rounded-lg flex items-center gap-3 transition cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-[#004856]" />
                  <span>Frequently Asked Questions</span>
                </button>

                <div className="p-2.5 bg-slate-50 rounded-lg text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <PhoneCall className="w-3.5 h-3.5 text-[#004856]" />
                    <span>Support: 1800-200-8800</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Mon - Sat, 9:00 AM to 7:00 PM</p>
                </div>
              </div>
            )}
          </div>

          {/* 5. About ArthSetu (Accordion) */}
          <div className="p-3">
            <button
              onClick={() => setAboutOpen(!aboutOpen)}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition cursor-pointer text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#E8F7F9] text-[#004856] flex items-center justify-center shrink-0">
                  <ArthSetuLogo iconOnly size="sm" theme="light" />
                </div>
                <span className="font-bold text-slate-900 text-sm group-hover:text-[#004856] transition-colors">
                  About ArthSetu
                </span>
              </div>
              {aboutOpen ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {aboutOpen && (
              <div className="pl-14 pr-2 py-2 space-y-2 text-xs text-slate-600 animate-in fade-in duration-150">
                <p className="leading-relaxed">
                  <strong>ArthSetu</strong> is India's premier digital financial bridge connecting millions to instant credit, high-yield fixed deposits, and wealth creation tools.
                </p>
                <div className="flex flex-col gap-1 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <span>• 100% RBI Compliant Lending Platform</span>
                  <span>• 256-Bit Bank Grade SSL Encryption</span>
                  <span>• Version 2.4.0 (Build 2026.09)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Drawer Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
          <p className="font-bold text-slate-800">ArthSetu Digital Finance</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Empowering Bharat with Smart Credit & Wealth</p>
        </div>
      </div>

      {/* Insurance Info Sub-Modal */}
      {showInsuranceInfo && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#004856]" />
                <h3 className="font-bold text-slate-900 text-base">Loan Protection Insurance</h3>
              </div>
              <button 
                onClick={() => setShowInsuranceInfo(false)}
                className="p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              ArthSetu partners with IRDAI-registered insurers (HDFC Life, ICICI Lombard) to safeguard your family from debt liabilities in case of critical illness or accidental disability.
            </p>
            <div className="p-3 bg-[#E8F7F9] rounded-xl text-xs text-[#004856] font-medium space-y-1">
              <p>✔ 100% Loan Outstanding Coverage</p>
              <p>✔ Cashless claim settlement within 48 hours</p>
              <p>✔ Premiums starting as low as ₹29/month bundled in EMI</p>
            </div>
            <button
              onClick={() => setShowInsuranceInfo(false)}
              className="w-full py-2.5 rounded-xl bg-[#004856] hover:bg-[#003844] text-white text-xs font-bold transition cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* Lending Partners Info Sub-Modal */}
      {showPartnersInfo && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#004856]" />
                <h3 className="font-bold text-slate-900 text-base">RBI Regulated Lending Partners</h3>
              </div>
              <button 
                onClick={() => setShowPartnersInfo(false)}
                className="p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              All loan products facilitated on ArthSetu are sanctioned directly by leading RBI-regulated Banks & NBFCs:
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="font-bold text-slate-800">DMI Finance Pvt Ltd</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded">RBI NBFC-ND-SI</span>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="font-bold text-slate-800">Aditya Birla Finance Ltd</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded">AAA Rated</span>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="font-bold text-slate-800">IDFC FIRST Bank</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded">Scheduled Bank</span>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="font-bold text-slate-800">Shriram Finance Ltd</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded">CRISIL AA+</span>
              </div>
            </div>
            <button
              onClick={() => setShowPartnersInfo(false)}
              className="w-full py-2.5 rounded-xl bg-[#004856] hover:bg-[#003844] text-white text-xs font-bold transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* FAQ Sub-Modal */}
      {showFaqModal && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">Frequently Asked Questions</h3>
              <button 
                onClick={() => setShowFaqModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="font-bold text-slate-900">How quickly are loans disbursed?</p>
                <p className="text-slate-600 mt-1">Once e-KYC and NACH auto-debit are verified, funds are disbursed directly into your bank account within 2 to 30 minutes.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="font-bold text-slate-900">Does checking my CIBIL score reduce it?</p>
                <p className="text-slate-600 mt-1">No. Checking your credit score on ArthSetu is a soft inquiry and causes zero impact on your CIBIL credit score.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="font-bold text-slate-900">Are Fixed Deposits insured?</p>
                <p className="text-slate-600 mt-1">Yes, all scheduled bank FDs are insured up to ₹5 Lakhs by the RBI subsidiary DICGC.</p>
              </div>
            </div>
            <button
              onClick={() => setShowFaqModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#004856] hover:bg-[#003844] text-white text-xs font-bold transition cursor-pointer"
            >
              Back to App
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
