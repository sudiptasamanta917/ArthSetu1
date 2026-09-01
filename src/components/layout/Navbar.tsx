import React from 'react';
import { Menu, ShieldCheck } from 'lucide-react';
import { UserProfile, AppPage } from '../../types';
import { ArthSetuLogo } from '../common/ArthSetuLogo';

interface NavbarProps {
  user: UserProfile | null;
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  onOpenAuth: () => void;
  onOpenKyc: () => void;
  onOpenCibil: () => void;
  onOpenProfile: () => void;
  onOpenApiConfig: () => void;
  onOpenNotifications: () => void;
  onToggleSidebar: () => void;
  onOpenAcoinsZone?: () => void;
  unreadNotificationsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onNavigate,
  onToggleSidebar,
  onOpenAcoinsZone,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full shadow-md">
      {/* Top Deep Teal Header matching Screenshot 1 & 2 */}
      <div className="bg-[#004856] text-white">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          {/* Left Brand: ArthSetu Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 text-left cursor-pointer group"
              aria-label="ArthSetu Home"
            >
              <ArthSetuLogo theme="deepTeal" size="md" />
            </button>
          </div>

          {/* Right Action Icons: Coin Badge + Hamburger Menu matching Screenshot 1 & 2 */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Gold Coin Points Badge matching Screenshot 1 & 2 ([ ⬡ 0 ]) */}
            <button 
              onClick={() => {
                if (onOpenAcoinsZone) {
                  onOpenAcoinsZone();
                } else {
                  onNavigate('investments');
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#003844] border border-[#0B5766] text-white text-xs font-bold shadow-xs hover:border-amber-400/60 cursor-pointer transition group"
              title="ArthSetu Acoins Zone"
            >
              {/* Hexagon Coin Emblem */}
              <div className="w-4 h-4 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-full h-full text-amber-400 drop-shadow-2xs">
                  <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" fill="#F59E0B" stroke="#FDE68A" strokeWidth="1.5" />
                  <text x="12" y="16" textAnchor="middle" fill="#78350F" fontSize="10" fontWeight="900" fontFamily="sans-serif">A</text>
                </svg>
              </div>
              <span className="text-white text-xs font-bold group-hover:text-amber-300 transition-colors">0</span>
            </button>

            {/* Hamburger Menu (3 lines icon) matching Screenshot 1 & 2 */}
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-xl bg-[#003844] hover:bg-[#002f3a] text-white border border-[#0B5766] transition cursor-pointer flex items-center justify-center"
              aria-label="Open sidebar menu"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
