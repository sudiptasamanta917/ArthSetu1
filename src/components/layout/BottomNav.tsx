import React from 'react';
import { Home, Banknote, Coins, Award, ShieldCheck, FileText } from 'lucide-react';
import { AppPage } from '../../types';

interface BottomNavProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onNavigate }) => {
  const NAV_ITEMS = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'personal_loans', label: 'Loans', icon: Banknote },
    { id: 'cibil', label: 'CIBIL', icon: Award },
    { id: 'investments', label: 'Invest & FD', icon: Coins },
    { id: 'kyc', label: 'KYC', icon: ShieldCheck },
    { id: 'applications', label: 'Tracker', icon: FileText },
  ] as const;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id || (item.id === 'personal_loans' && currentPage === 'business_loans') || (item.id === 'investments' && currentPage === 'fixed_deposits');
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as AppPage)}
            className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
              isActive
                ? 'text-[#004856] font-bold scale-105'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">{item.label}</span>
            {isActive && <span className="w-1.5 h-1 rounded-full bg-[#004856] mt-0.5" />}
          </button>
        );
      })}
    </div>
  );
};

