import { CibilReport, CibilFactor } from '../types';
import { 
  ApiResponse, 
  createApiResponse, 
  getLocalItem, 
  setLocalItem, 
  STORAGE_KEYS, 
  mockDelay 
} from './client';

const INITIAL_FACTORS: CibilFactor[] = [
  {
    id: 'factor_payment_history',
    name: 'On-Time Payment History',
    currentValue: '100% On-Time',
    status: 'Excellent',
    impact: 'High',
    description: 'You have paid 100% of your EMI & credit card bills on or before due date in the last 36 months.',
    recommendation: 'Keep autopay active to never miss an EMI deadline.',
  },
  {
    id: 'factor_credit_utilization',
    name: 'Credit Card Utilization',
    currentValue: '18% Utilized',
    status: 'Excellent',
    impact: 'High',
    description: 'Your total credit limit is ₹3,50,000 and current balance is ₹63,000 (well below the recommended 30%).',
    recommendation: 'Maintain credit usage below 30% of total limit for peak score growth.',
  },
  {
    id: 'factor_credit_age',
    name: 'Credit History Age',
    currentValue: '4.8 Years Avg',
    status: 'Good',
    impact: 'Medium',
    description: 'Oldest active credit line is 6.2 years old, showing financial consistency to lenders.',
    recommendation: 'Keep your oldest credit card active even if used infrequently.',
  },
  {
    id: 'factor_credit_mix',
    name: 'Credit Mix (Secured/Unsecured)',
    currentValue: 'Balanced (3 accounts)',
    status: 'Good',
    impact: 'Low',
    description: 'Healthy blend of 1 personal loan, 1 auto loan, and 2 credit cards.',
    recommendation: 'Balanced mix improves lender confidence during underwriting.',
  },
  {
    id: 'factor_hard_inquiries',
    name: 'Recent Credit Inquiries',
    currentValue: '1 Inquiry in 6 mo',
    status: 'Excellent',
    impact: 'Low',
    description: 'Only 1 hard inquiry detected in past 6 months. Checking on Money View is a Soft Inquiry and does NOT affect your score.',
    recommendation: 'Avoid applying to multiple lenders simultaneously to prevent hard inquiry spikes.',
  },
];

const INITIAL_REPORT: CibilReport = {
  score: 785,
  status: 'Excellent',
  scoreRange: '750 - 900 (High Approval Rate)',
  lastUpdated: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
  nextRefreshDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
  totalAccounts: 4,
  activeAccounts: 3,
  creditCardsCount: 2,
  creditUtilizationRate: 18,
  onTimePaymentRate: 100,
  creditAgeYears: 4.8,
  recentInquiriesCount: 1,
  scoreHistory: [
    { month: 'Mar 25', score: 742 },
    { month: 'May 25', score: 755 },
    { month: 'Jul 25', score: 768 },
    { month: 'Sep 25', score: 774 },
    { month: 'Nov 25', score: 780 },
    { month: 'Jan 26', score: 785 },
  ],
  factors: INITIAL_FACTORS,
};

export const cibilApi = {
  /**
   * Fetch current user's comprehensive CIBIL report
   */
  async getReport(): Promise<ApiResponse<CibilReport>> {
    await mockDelay(350);
    const report = getLocalItem<CibilReport>(STORAGE_KEYS.CIBIL_REPORT, INITIAL_REPORT);
    return createApiResponse(report, 'CIBIL Credit Score report retrieved');
  },

  /**
   * Request fresh score refresh
   */
  async refreshScore(): Promise<ApiResponse<CibilReport>> {
    await mockDelay(700);
    const current = getLocalItem<CibilReport>(STORAGE_KEYS.CIBIL_REPORT, INITIAL_REPORT);
    const delta = Math.floor(Math.random() * 5) + 1; // +1 to +5 bump
    const newScore = Math.min(840, current.score + delta);

    const updated: CibilReport = {
      ...current,
      score: newScore,
      lastUpdated: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      scoreHistory: [
        ...current.scoreHistory.slice(1),
        { month: 'Current', score: newScore },
      ],
    };

    setLocalItem(STORAGE_KEYS.CIBIL_REPORT, updated);
    return createApiResponse(updated, `CIBIL Score successfully refreshed! Your score increased by +${delta} points.`);
  },

  /**
   * Simulate score impact for what-if scenarios
   */
  simulateScoreImpact(scenario: 'pay_card_balance' | 'miss_emi' | 'new_credit_card' | 'close_loan', amount?: number) {
    switch (scenario) {
      case 'pay_card_balance':
        return {
          scoreChange: +22,
          projectedScore: 807,
          message: 'Paying off credit balance reduces utilization below 10%, boosting score by ~22 pts.',
        };
      case 'miss_emi':
        return {
          scoreChange: -45,
          projectedScore: 740,
          message: 'A single 30+ day missed payment can drop your score by 40-60 points for over 12 months.',
        };
      case 'new_credit_card':
        return {
          scoreChange: -4,
          projectedScore: 781,
          message: 'A small temporary 3-5 point dip from hard inquiry, recovering quickly with on-time usage.',
        };
      case 'close_loan':
        return {
          scoreChange: +12,
          projectedScore: 797,
          message: 'Closing an active loan successfully reflects excellent debt servicing capability.',
        };
    }
  },
};
