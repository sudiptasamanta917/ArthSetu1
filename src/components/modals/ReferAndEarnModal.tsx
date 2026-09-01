import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  Gift, 
  Users, 
  Award, 
  TrendingUp, 
  ArrowRight, 
  Sparkles,
  IndianRupee,
  ShieldCheck
} from 'lucide-react';
import { UserProfile } from '../../types';

interface ReferAndEarnModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onApplyForLoan?: () => void;
}

export const ReferAndEarnModal: React.FC<ReferAndEarnModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [copied, setCopied] = useState(false);
  const referralCode = user ? `ARTH${user.phone.slice(-4)}` : 'ARTH8942';
  const referralLink = `https://arthsetu.in/r/${referralCode}`;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Hey! Get instant personal & business loans up to ₹75 Lakhs with zero paperwork on ArthSetu. Use my referral code ${referralCode} to get ₹500 instant cashback on disbursal: ${referralLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with Deep Teal gradient */}
        <div className="bg-gradient-to-r from-[#004856] to-[#003844] text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center text-amber-300">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-200">
                ArthSetu Referral Club
              </span>
              <h3 className="text-xl font-black text-white">Refer & Earn ₹80,000+</h3>
            </div>
          </div>
          <p className="text-xs text-cyan-100/90 mt-2">
            Earn ₹1,000 for every friend who gets a loan disbursed on ArthSetu. No earning limit!
          </p>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Referral Code Box */}
          <div className="p-4 rounded-2xl bg-[#E8F7F9] border border-[#C2EBF0] space-y-3">
            <span className="text-xs font-bold text-[#004856] block">Your Unique Referral Code</span>
            <div className="flex items-center justify-between bg-white rounded-xl p-2.5 border border-[#B0E2EA]">
              <span className="text-lg font-black tracking-widest text-[#003844] pl-2 font-mono">
                {referralCode}
              </span>
              <button
                onClick={handleCopy}
                className="px-3.5 py-1.5 rounded-lg bg-[#004856] hover:bg-[#003844] text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleWhatsAppShare}
              className="py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </button>
            <button
              onClick={handleCopy}
              className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer border border-slate-200"
            >
              <Copy className="w-4 h-4 text-slate-600" />
              <span>Share Link</span>
            </button>
          </div>

          {/* How It Works 3-Step Flow */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              How You Earn ₹80,000+ Monthly
            </h4>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#004856] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Invite Friends & Family</p>
                  <p className="text-[11px] text-slate-500">Share your referral link on WhatsApp, Telegram, or SMS.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#004856] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Friend Applies for Loan / FD</p>
                  <p className="text-[11px] text-slate-500">They complete paperless KYC & get approved in 2 mins.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#004856] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Instant Cash in Your Bank</p>
                  <p className="text-[11px] text-slate-500">You receive ₹1,000 direct bank transfer per disbursal + bonus coins.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Referral Stats Card */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-200/80 flex items-center justify-center text-amber-900">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-950">Total Earnings</p>
                <p className="text-lg font-black text-amber-900">₹0 <span className="text-xs font-normal text-amber-700">(0 Friends)</span></p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#004856] bg-white px-3 py-1.5 rounded-lg border border-amber-200 shadow-2xs">
              Top Tier: 5% Extra
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Direct UPI Disbursal
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
