import React, { useState } from 'react';
import { 
  X, 
  Coins, 
  Sparkles, 
  Gift, 
  CheckCircle2, 
  ArrowRight, 
  Flame, 
  Award, 
  TrendingUp, 
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { UserProfile } from '../../types';

interface AcoinsZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onNavigateToInvestments: () => void;
}

export const AcoinsZoneModal: React.FC<AcoinsZoneModalProps> = ({
  isOpen,
  onClose,
  user,
  onNavigateToInvestments,
}) => {
  const [coins, setCoins] = useState<number>(150);
  const [claimedDaily, setClaimedDaily] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleClaimDaily = () => {
    if (!claimedDaily) {
      setCoins((prev) => prev + 50);
      setClaimedDaily(true);
    }
  };

  const REDEEM_OPTIONS = [
    {
      id: 'gold',
      title: '24K 99.9% Pure Digital Gold',
      cost: '500 Acoins = ₹50 Gold',
      desc: 'Instant addition to your insured digital gold locker',
      tag: 'Most Popular',
      action: () => {
        onClose();
        onNavigateToInvestments();
      },
    },
    {
      id: 'cashback',
      title: 'Direct Bank Cashback',
      cost: '1,000 Acoins = ₹100 Cash',
      desc: 'Instant UPI credit to your verified bank account',
      tag: 'Instant UPI',
      action: () => {
        alert('Redemption request initiated! ₹100 will be credited via UPI within 2 hours.');
      },
    },
    {
      id: 'processing_fee',
      title: '50% Off Loan Processing Fee',
      cost: '250 Acoins = Flat 50% Off',
      desc: 'Save up to ₹2,500 on your next Personal or Business loan',
      tag: 'Save ₹2,500',
      action: () => {
        alert('Coupon code ACOIN50 unlocked for your next loan application!');
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Golden Header */}
        <div className="bg-gradient-to-br from-[#851E3E] via-[#004856] to-[#003844] text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                ArthSetu Loyalty Club
              </span>
              <h3 className="text-2xl font-black text-white">Acoins Zone</h3>
            </div>

            {/* Live Coin Badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/30 border border-amber-400/30 backdrop-blur-md">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 text-amber-950 font-black text-xs flex items-center justify-center shadow-xs">
                A
              </div>
              <span className="text-lg font-black text-amber-300">{coins}</span>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Daily Streak & Check-in Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center font-bold">
                <Flame className="w-6 h-6 text-amber-600 animate-bounce" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-950">Daily Check-in Bonus</p>
                <p className="text-[11px] text-amber-700">Claim 50 free Acoins every day!</p>
              </div>
            </div>

            <button
              onClick={handleClaimDaily}
              disabled={claimedDaily}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                claimedDaily
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
              }`}
            >
              {claimedDaily ? 'Claimed (+50)' : 'Claim +50'}
            </button>
          </div>

          {/* Redeem Acoins Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Redeem for Real Value</span>
              <span className="text-[#004856] text-[11px]">100 Acoins = ₹10</span>
            </h4>

            <div className="space-y-3">
              {REDEEM_OPTIONS.map((opt) => (
                <div
                  key={opt.id}
                  onClick={opt.action}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#004856]/40 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h5 className="text-sm font-bold text-slate-900 group-hover:text-[#004856] transition-colors">
                          {opt.title}
                        </h5>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          {opt.tag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{opt.desc}</p>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-[#E8F7F9] text-[#004856] flex items-center justify-center group-hover:translate-x-1 transition-transform shrink-0">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-extrabold text-[#004856]">{opt.cost}</span>
                    <span className="text-slate-400 group-hover:text-[#004856] font-semibold transition">
                      Tap to Redeem →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ways to Earn More */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Ways to Earn More Acoins
            </h4>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">Complete KYC</span>
                <span className="text-[11px] text-emerald-600 font-bold">+200 Acoins</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">On-Time Loan EMI</span>
                <span className="text-[11px] text-emerald-600 font-bold">+500 Acoins</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            100% Guaranteed Gold & Cashback
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
