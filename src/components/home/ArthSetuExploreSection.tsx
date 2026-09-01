import React from 'react';
import { 
  ArrowRight, 
  User, 
  Briefcase, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface ArthSetuExploreSectionProps {
  onOpenPersonalLoan: () => void;
  onOpenBusinessLoan: () => void;
  onOpenFixedDeposit: () => void;
  onOpenInvestments: () => void;
}

export const ArthSetuExploreSection: React.FC<ArthSetuExploreSectionProps> = ({
  onOpenPersonalLoan,
  onOpenBusinessLoan,
  onOpenFixedDeposit,
  onOpenInvestments,
}) => {
  return (
    <div className="space-y-6">
      {/* Centered Decorative Divider: ────── ◆ EXPLORE MORE ◆ ────── */}
      <div className="flex items-center justify-center gap-3 py-2 text-[#004856]">
        <div className="h-px bg-slate-300 flex-1 max-w-[120px] sm:max-w-[200px]" />
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold tracking-widest uppercase text-slate-700">
          <span className="text-[#004856] text-xs">◆</span>
          <span>EXPLORE MORE</span>
          <span className="text-[#004856] text-xs">◆</span>
        </div>
        <div className="h-px bg-slate-300 flex-1 max-w-[120px] sm:max-w-[200px]" />
      </div>

      {/* SECTION 1: LOANS */}
      <div className="space-y-2.5">
        <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#004856] pl-1">
          LOANS
        </h3>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
          {/* Card 1: Personal Loan */}
          <div
            onClick={onOpenPersonalLoan}
            className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-100 shadow-xs hover:border-[#004856]/40 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group min-h-[135px] sm:min-h-[148px]"
          >
            <div className="flex items-start justify-between gap-1.5">
              <div className="space-y-0.5">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#004856] transition-colors leading-tight">
                  Personal<br />Loan
                </h4>
                <div className="text-[10px] sm:text-xs text-slate-500 pt-0.5 leading-tight">
                  <p>Get up to</p>
                  <p className="font-bold text-slate-900">₹20L <span className="font-normal text-slate-500">in 30 mins</span></p>
                </div>
              </div>

              {/* Circular Peach/Coral User Icon Badge */}
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#FEE4D7] flex items-center justify-center text-[#E06D53] shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                <User className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
            </div>

            {/* Bottom Right Arrow */}
            <div className="flex justify-end pt-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[#00829B] group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
            </div>
          </div>

          {/* Card 2: Business Loan */}
          <div
            onClick={onOpenBusinessLoan}
            className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-100 shadow-xs hover:border-[#004856]/40 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group min-h-[135px] sm:min-h-[148px]"
          >
            <div className="flex items-start justify-between gap-1.5">
              <div className="space-y-0.5">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#004856] transition-colors leading-tight">
                  Business<br />Loan
                </h4>
                <div className="text-[10px] sm:text-xs text-slate-500 pt-0.5 leading-tight">
                  <p>Up to <span className="font-bold text-slate-900">₹75L</span>. No ITR</p>
                </div>
              </div>

              {/* Circular Peach/Coral Briefcase Icon Badge */}
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#FEE4D7] flex items-center justify-center text-[#E06D53] shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                <Briefcase className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
            </div>

            {/* Bottom Right Arrow */}
            <div className="flex justify-end pt-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[#00829B] group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
            </div>
          </div>

          {/* Card 3: Fixed Deposit */}
          <div
            onClick={onOpenFixedDeposit}
            className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-100 shadow-xs hover:border-[#004856]/40 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group min-h-[135px] sm:min-h-[148px]"
          >
            <div className="flex items-start justify-between gap-1.5">
              <div className="space-y-0.5">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#004856] transition-colors leading-tight">
                  Fixed<br />Deposit
                </h4>
                <div className="text-[10px] sm:text-xs text-slate-500 pt-0.5 leading-tight">
                  <p>Starting <span className="font-bold text-slate-900">7.75%*</span> p.a.</p>
                </div>
              </div>

              {/* 3D Safe Vault with Coins Graphic Badge matching Screenshot */}
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#FFF1D6] flex items-center justify-center text-amber-700 shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6 sm:w-7 sm:h-7">
                  <rect x="4" y="6" width="24" height="20" rx="3" fill="#D97706" />
                  <rect x="6" y="8" width="20" height="16" rx="2" fill="#F59E0B" />
                  <circle cx="16" cy="16" r="4" fill="#B45309" />
                  <circle cx="16" cy="16" r="2" fill="#FDE68A" />
                  <circle cx="23" cy="24" r="3" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
                  <circle cx="26" cy="23" r="2.5" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />
                </svg>
              </div>
            </div>

            {/* Bottom Right Arrow */}
            <div className="flex justify-end pt-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[#00829B] group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
            </div>
          </div>

          {/* Card 4: Investment */}
          <div
            onClick={onOpenInvestments}
            className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-100 shadow-xs hover:border-[#004856]/40 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group min-h-[135px] sm:min-h-[148px]"
          >
            <div className="flex items-start justify-between gap-1.5">
              <div className="space-y-0.5">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#004856] transition-colors leading-tight">
                  Investment
                </h4>
                <div className="text-[10px] sm:text-xs text-slate-500 pt-0.5 leading-tight">
                  <p>Grow Wealth</p>
                  <p className="font-bold text-slate-900">Smartly</p>
                </div>
              </div>

              {/* 3D Growth Chart & Coins Graphic Badge */}
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#FFEADA] flex items-center justify-center text-amber-800 shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6 sm:w-7 sm:h-7">
                  <rect x="5" y="18" width="4" height="8" rx="1" fill="#F97316" />
                  <rect x="11" y="14" width="4" height="12" rx="1" fill="#EA580C" />
                  <rect x="17" y="9" width="4" height="17" rx="1" fill="#C2410C" />
                  <path d="M6 14L13 8L19 12L27 4" stroke="#004856" strokeWidth="2.2" strokeLinecap="round" />
                  <circle cx="27" cy="4" r="2.5" fill="#004856" />
                  <circle cx="23" cy="22" r="3.5" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
                </svg>
              </div>
            </div>

            {/* Bottom Right Arrow */}
            <div className="flex justify-end pt-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[#00829B] group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: INVEST */}
      <div className="space-y-2.5 pt-1">
        <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#004856] pl-1">
          INVEST
        </h3>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
          {/* Card 1: 20 Lakh* Coins! (Gold Offer) */}
          <div
            onClick={onOpenInvestments}
            className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-100 shadow-xs hover:border-[#004856]/40 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group min-h-[135px] sm:min-h-[148px]"
          >
            <div className="flex items-start justify-between gap-1.5">
              <div className="space-y-0.5">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#004856] transition-colors leading-tight">
                  20 Lakh*<br />Coins!
                </h4>
                <p className="text-[10px] sm:text-xs text-slate-500 pt-0.5 leading-tight">
                  Digital Gold Offer
                </p>
              </div>

              {/* 3D GOLD SALE Badge Graphic matching Screenshot 1 */}
              <div className="px-2 py-1 rounded-lg bg-[#851E3E] text-white flex flex-col items-center justify-center shadow-xs shrink-0 border border-amber-300/40">
                <span className="text-[9px] sm:text-[10px] font-black text-amber-300 tracking-wider leading-none">GOLD</span>
                <span className="text-[7px] sm:text-[8px] font-extrabold text-white bg-amber-600 px-1 rounded uppercase tracking-tighter mt-0.5 leading-tight">SALE</span>
              </div>
            </div>

            {/* Bottom Action Link: Tap to Check Now → */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold text-[#00829B] group-hover:underline flex items-center gap-1 leading-none">
                Tap to Check Now
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>

          {/* Card 2: Up to 8.30% returns (Fixed Deposit) */}
          <div
            onClick={onOpenFixedDeposit}
            className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-100 shadow-xs hover:border-[#004856]/40 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group min-h-[135px] sm:min-h-[148px]"
          >
            <div className="flex items-start justify-between gap-1.5">
              <div className="space-y-0.5">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#004856] transition-colors leading-tight">
                  Up to 8.30%<br />returns
                </h4>
                <div className="text-[10px] sm:text-xs text-slate-500 pt-0.5 leading-tight">
                  <p>Fixed Deposit insured</p>
                  <p className="font-bold text-slate-800">up to ₹5L</p>
                </div>
              </div>

              {/* 3D Gift Box with Gold Coins Graphic */}
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center shrink-0 shadow-2xs border border-amber-200/80">
                <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6 sm:w-7 sm:h-7">
                  <rect x="6" y="12" width="18" height="14" rx="2" fill="#E11D48" />
                  <rect x="5" y="9" width="20" height="4" rx="1" fill="#BE123C" />
                  <rect x="13" y="9" width="4" height="17" fill="#FDE047" />
                  <path d="M11 9C11 6.5 13.5 5 15 7C16.5 5 19 6.5 19 9" stroke="#FDE047" strokeWidth="1.8" />
                  <circle cx="23" cy="24" r="3" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />
                  <circle cx="26" cy="21" r="2.5" fill="#FBBF24" stroke="#B45309" strokeWidth="0.8" />
                </svg>
              </div>
            </div>

            {/* Bottom Right Arrow */}
            <div className="flex justify-end pt-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[#00829B] group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
