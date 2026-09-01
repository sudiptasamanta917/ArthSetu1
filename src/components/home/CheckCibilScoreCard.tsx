import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CheckCibilScoreCardProps {
  onOpenCibil: () => void;
  score?: number;
}

export const CheckCibilScoreCard: React.FC<CheckCibilScoreCardProps> = ({
  onOpenCibil,
  score = 750,
}) => {
  return (
    <div className="space-y-3">
      {/* Section Header */}
      <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#004856] pl-1">
        CHECK CIBIL SCORE
      </h3>

      {/* Main CIBIL Score Card */}
      <div
        onClick={onOpenCibil}
        className="p-4 sm:p-5 rounded-2xl bg-[#EBF7F9] border border-[#CDE9EF] shadow-xs hover:border-[#004856]/40 hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4 group"
      >
        <div className="flex items-center gap-4 sm:gap-6">
          {/* CIBIL Speedometer Gauge Graphic matching Screenshot */}
          <div className="relative w-20 h-20 sm:w-22 sm:h-22 shrink-0 flex items-center justify-center">
            {/* SVG Speedometer Gauge */}
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0284C7" />
                  <stop offset="50%" stopColor="#0EA5E9" />
                  <stop offset="85%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>

              {/* Background Arc Track */}
              <path
                d="M 16 76 A 42 42 0 1 1 84 76"
                fill="none"
                stroke="#D1ECF2"
                strokeWidth="8"
                strokeLinecap="round"
              />

              {/* Active Colored Arc */}
              <path
                d="M 16 76 A 42 42 0 1 1 84 76"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="8"
                strokeDasharray="215"
                strokeDashoffset="35"
                strokeLinecap="round"
              />

              {/* Gauge Needle Pointer */}
              <g transform="rotate(42 50 50)">
                <line
                  x1="50"
                  y1="50"
                  x2="50"
                  y2="18"
                  stroke="#003844"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
                <circle cx="50" cy="50" r="5" fill="#003844" />
                <circle cx="50" cy="50" r="2" fill="#FFFFFF" />
              </g>
            </svg>

            {/* Score Number in Gauge Center */}
            <div className="absolute bottom-1.5 left-0 right-0 text-center">
              <span className="text-sm sm:text-base font-black text-[#003844] tracking-tight">
                {score}
              </span>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-1">
            <h4 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#004856] transition-colors leading-tight">
              Check CIBIL Score
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Know your credit score in seconds
            </p>
          </div>
        </div>

        {/* Right Arrow */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#004856] group-hover:translate-x-1.5 transition-transform shrink-0">
          <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>
    </div>
  );
};
