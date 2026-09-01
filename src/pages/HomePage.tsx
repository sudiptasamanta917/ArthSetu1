import React from 'react';
import { HeroBannerArthSetu } from '../components/home/HeroBannerArthSetu';
import { ArthSetuExploreSection } from '../components/home/ArthSetuExploreSection';
import { CheckCibilScoreCard } from '../components/home/CheckCibilScoreCard';
import { EarnSectionCards } from '../components/home/EarnSectionCards';
import { UserProfile, LoanApplication } from '../types';

interface HomePageProps {
  user: UserProfile | null;
  loans: LoanApplication[];
  onNavigateToPersonalLoan: () => void;
  onNavigateToBusinessLoan: () => void;
  onNavigateToCibil: () => void;
  onNavigateToKyc: () => void;
  onNavigateToFd: () => void;
  onNavigateToInvestments: () => void;
  onNavigateToApplications: () => void;
  onOpenReferAndEarn: () => void;
  onOpenAcoinsZone: () => void;
  onOpenApiConfig: () => void;
  onSelectEmiValues: (amount: number, tenure: number) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  user,
  loans,
  onNavigateToPersonalLoan,
  onNavigateToBusinessLoan,
  onNavigateToCibil,
  onNavigateToKyc,
  onNavigateToFd,
  onNavigateToInvestments,
  onNavigateToApplications,
  onOpenReferAndEarn,
  onOpenAcoinsZone,
  onOpenApiConfig,
  onSelectEmiValues,
}) => {
  return (
    <div className="space-y-6 sm:space-y-7 animate-in fade-in duration-300 max-w-2xl mx-auto pb-4">
      {/* 1. Main Hero Carousel Banner matching Screenshot 1 */}
      <HeroBannerArthSetu
        onApplyPersonalLoan={onNavigateToPersonalLoan}
        onApplyBusinessLoan={onNavigateToBusinessLoan}
        onApplyFd={onNavigateToFd}
      />

      {/* 2. Core LOANS & INVEST Grid matching Screenshot 1 */}
      <ArthSetuExploreSection
        onOpenPersonalLoan={onNavigateToPersonalLoan}
        onOpenBusinessLoan={onNavigateToBusinessLoan}
        onOpenFixedDeposit={onNavigateToFd}
        onOpenInvestments={onNavigateToInvestments}
      />

      {/* 3. CHECK CIBIL SCORE Section matching Screenshot 2 */}
      <CheckCibilScoreCard
        score={user?.creditScore || 750}
        onOpenCibil={onNavigateToCibil}
      />

      {/* 4. EARN Section (Refer & Earn + Acoins Zone) matching Screenshot 2 */}
      <EarnSectionCards
        onOpenReferAndEarn={onOpenReferAndEarn}
        onOpenAcoinsZone={onOpenAcoinsZone}
      />
    </div>
  );
};

