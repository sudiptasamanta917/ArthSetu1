import React from 'react';
import { ArrowRight } from 'lucide-react';

interface EarnSectionCardsProps {
  onOpenReferAndEarn: () => void;
  onOpenAcoinsZone: () => void;
}

export const EarnSectionCards: React.FC<EarnSectionCardsProps> = ({
  onOpenReferAndEarn,
  onOpenAcoinsZone,
}) => {
  return (
    <div className="space-y-3">
      {/* Section Header */}
      <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#004856] pl-1">
        EARN
      </h3>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
        {/* CARD 1: Refer & Earn */}
        <div
          onClick={onOpenReferAndEarn}
          className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-100 shadow-xs hover:border-[#004856]/40 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group min-h-[140px] sm:min-h-[152px]"
        >
          <div className="flex items-start justify-between gap-1.5">
            <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#004856] transition-colors leading-tight">
              Refer<br />& Earn
            </h4>

            {/* 3D Deep Teal & Gold Gift Box Graphic matching Screenshot 2 */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm">
                <defs>
                  <linearGradient id="boxFront" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0B4F5B" />
                    <stop offset="100%" stopColor="#042C33" />
                  </linearGradient>
                  <linearGradient id="boxSide" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#073B44" />
                    <stop offset="100%" stopColor="#021E23" />
                  </linearGradient>
                  <linearGradient id="goldRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FDE047" />
                    <stop offset="40%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#B45309" />
                  </linearGradient>
                  <linearGradient id="goldRibbonLight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FEF08A" />
                    <stop offset="100%" stopColor="#F59E0B" />
                  </linearGradient>
                </defs>

                {/* Box Body 3D */}
                <path d="M 12 28 L 32 38 L 32 58 L 12 48 Z" fill="url(#boxFront)" />
                <path d="M 32 38 L 52 28 L 52 48 L 32 58 Z" fill="url(#boxSide)" />
                <path d="M 10 24 L 32 35 L 32 29 L 10 18 Z" fill="#0E5E6C" />
                <path d="M 32 35 L 54 24 L 54 18 L 32 29 Z" fill="#084550" />
                <path d="M 32 12 L 54 18 L 32 29 L 10 18 Z" fill="#137485" />

                {/* Gold Vertical Ribbon */}
                <path d="M 20 32 L 24 34 L 24 54 L 20 52 Z" fill="url(#goldRibbon)" />
                <path d="M 40 34 L 44 32 L 44 52 L 40 54 Z" fill="url(#goldRibbon)" />
                <path d="M 20 15 L 24 16 L 36 27 L 32 28 Z" fill="url(#goldRibbonLight)" />
                <path d="M 44 15 L 40 16 L 28 27 L 32 28 Z" fill="url(#goldRibbonLight)" />

                {/* Gold Ribbon Bow */}
                <circle cx="32" cy="18" r="4" fill="url(#goldRibbonLight)" />
                <ellipse cx="25" cy="14" rx="6" ry="3.5" transform="rotate(-25 25 14)" fill="url(#goldRibbon)" />
                <ellipse cx="25" cy="14" rx="3.5" ry="1.5" transform="rotate(-25 25 14)" fill="#78350F" />
                <ellipse cx="39" cy="14" rx="6" ry="3.5" transform="rotate(25 39 14)" fill="url(#goldRibbon)" />
                <ellipse cx="39" cy="14" rx="3.5" ry="1.5" transform="rotate(25 39 14)" fill="#78350F" />
              </svg>
            </div>
          </div>

          {/* Bottom Subtitle & Earnings matching Screenshot 2 */}
          <div className="pt-2">
            <p className="text-[10px] sm:text-xs text-slate-500">
              Share the app & earn
            </p>
            <div className="flex items-center justify-between mt-0.5">
              <p className="text-[11px] sm:text-xs text-slate-500">
                <span className="font-bold text-slate-900">₹80,000+</span> / month
              </p>
              <div className="w-5 h-5 flex items-center justify-center text-[#00829B] group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: Acoins Zone */}
        <div
          onClick={onOpenAcoinsZone}
          className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-100 shadow-xs hover:border-[#004856]/40 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group min-h-[140px] sm:min-h-[152px]"
        >
          <div className="flex items-start justify-between gap-1.5">
            <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#004856] transition-colors leading-tight">
              Acoins<br />Zone
            </h4>

            {/* 3D Gold Coin on Metallic Base Graphic matching Screenshot 2 */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm">
                <defs>
                  <linearGradient id="goldCoinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFBEB" />
                    <stop offset="25%" stopColor="#FBBF24" />
                    <stop offset="70%" stopColor="#D97706" />
                    <stop offset="100%" stopColor="#92400E" />
                  </linearGradient>
                  <linearGradient id="basePlateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D97706" />
                    <stop offset="50%" stopColor="#92400E" />
                    <stop offset="100%" stopColor="#451A03" />
                  </linearGradient>
                  <radialGradient id="coinShine" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#78350F" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Tiered Metallic Base Plates */}
                <ellipse cx="32" cy="52" rx="20" ry="6" fill="#451A03" />
                <ellipse cx="32" cy="50" rx="19" ry="5.5" fill="url(#basePlateGrad)" />
                <ellipse cx="32" cy="48" rx="17" ry="5" fill="#F59E0B" />
                <ellipse cx="32" cy="46" rx="15" ry="4" fill="#B45309" />

                {/* Vertical 3D Medallion / Coin */}
                <ellipse cx="32" cy="28" rx="17" ry="18" fill="url(#goldCoinGrad)" />
                <ellipse cx="32" cy="28" rx="15" ry="16" fill="#78350F" />
                <ellipse cx="32" cy="28" rx="14" ry="15" fill="url(#goldCoinGrad)" />
                <ellipse cx="32" cy="28" rx="14" ry="15" fill="url(#coinShine)" />

                {/* Hexagonal Inner Crest with 'A' Logo */}
                <polygon
                  points="32,18 40,23 40,33 32,38 24,33 24,23"
                  fill="#92400E"
                  stroke="#FDE68A"
                  strokeWidth="1"
                />
                
                {/* 'A' Glyph in Coin Center */}
                <text
                  x="32"
                  y="32"
                  textAnchor="middle"
                  fill="#FFFBEB"
                  fontSize="12"
                  fontWeight="900"
                  fontFamily="sans-serif"
                >
                  A
                </text>
              </svg>
            </div>
          </div>

          {/* Bottom Subtitle & Earnings matching Screenshot 2 */}
          <div className="pt-2">
            <p className="text-[10px] sm:text-xs text-slate-500">
              Earn and redeem
            </p>
            <div className="flex items-center justify-between mt-0.5">
              <p className="text-[11px] sm:text-xs text-slate-500">
                as <span className="font-bold text-slate-900">gold</span>
              </p>
              <div className="w-5 h-5 flex items-center justify-center text-[#00829B] group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
