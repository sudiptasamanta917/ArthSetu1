import React from 'react';

interface ArthSetuLogoProps {
  className?: string;
  iconOnly?: boolean;
  theme?: 'light' | 'dark' | 'deepTeal';
  size?: 'sm' | 'md' | 'lg';
}

export const ArthSetuLogo: React.FC<ArthSetuLogoProps> = ({
  className = '',
  iconOnly = false,
  theme = 'deepTeal',
  size = 'md',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const isLight = theme === 'light';
  const isDeepTeal = theme === 'deepTeal';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Stylized Arch / Bridge 'A' Circle Badge matching screenshot */}
      <div
        className={`${iconSizes[size]} rounded-full flex items-center justify-center relative shrink-0 shadow-xs transition-transform ${
          isDeepTeal
            ? 'bg-transparent border-2 border-white text-white'
            : isLight
            ? 'bg-[#004856] text-white border border-[#003844]'
            : 'bg-[#004856] text-white'
        }`}
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5/6 h-5/6 p-0.5"
        >
          {/* Outer circle ring */}
          <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" />
          {/* Bridge / Apex Arch A shape */}
          <path
            d="M8 27L18 8L28 27"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Bridge Cross curve / Setu deck */}
          <path
            d="M12 21C14.5 19.5 21.5 19.5 24 21"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          {/* Center pillar / Setu support line */}
          <path
            d="M18 19V27"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeOpacity="0.8"
          />
        </svg>
      </div>

      {!iconOnly && (
        <div className="flex flex-col">
          <span
            className={`font-bold tracking-tight ${textSizes[size]} ${
              isDeepTeal ? 'text-white' : isLight ? 'text-[#004856]' : 'text-slate-900'
            }`}
          >
            ArthSetu
          </span>
        </div>
      )}
    </div>
  );
};
