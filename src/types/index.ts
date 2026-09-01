export type EmploymentType = 'salaried' | 'self_employed' | 'business_owner' | 'freelancer';

export type KycStatus = 'not_started' | 'in_progress' | 'verified' | 'rejected';

export type AppPage = 
  | 'home' 
  | 'personal_loans' 
  | 'business_loans' 
  | 'cibil' 
  | 'fixed_deposits' 
  | 'investments' 
  | 'kyc' 
  | 'applications';

export interface UserBankDetails {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolder: string;
  isVerified: boolean;
}

export interface UserKycDetails {
  panNumber: string;
  panVerified: boolean;
  aadhaarNumber: string;
  aadhaarVerified: boolean;
  videoKycCompleted: boolean;
  addressProofType?: string;
  verificationDate?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  panNumber: string;
  employmentType: EmploymentType;
  monthlyIncome: number;
  pinCode: string;
  city: string;
  state: string;
  kycStatus: KycStatus;
  kycDetails: UserKycDetails;
  bankDetails?: UserBankDetails;
  creditScore: number;
  isRegistered: boolean;
  createdAt: string;
  avatarUrl?: string;
}

export interface HeroSlideData {
  id: number;
  badge: string;
  badgeColor: string;
  title: string;
  highlightText: string;
  description: string;
  ctaText: string;
  ctaAction: 'personal_loan' | 'cibil_check' | 'fixed_deposit' | 'investments';
  gradientBg: string;
  accentBorder: string;
  metrics: {
    label: string;
    value: string;
    sublabel?: string;
  }[];
  tag: string;
  iconName: string;
}

export interface LoanOffer {
  id: string;
  type: 'personal' | 'business';
  minAmount: number;
  maxAmount: number;
  minTenure: number;
  maxTenure: number;
  interestRatePerMonth: number;
  interestRatePerAnnum: number;
  processingFeePercent: number;
  features: string[];
}

export interface LoanApplication {
  id: string;
  loanType: 'personal' | 'business';
  amount: number;
  tenureMonths: number;
  monthlyEmi: number;
  totalInterest: number;
  totalPayable: number;
  interestRate: number;
  purpose: string;
  status: 'draft' | 'under_review' | 'approved' | 'disbursed' | 'closed';
  appliedDate: string;
  disbursalDate?: string;
  partnerBank: string;
  applicationNumber: string;
  nextEmiDate?: string;
  nextEmiAmount?: number;
}

export interface CibilFactor {
  id: string;
  name: string;
  currentValue: string;
  status: 'Excellent' | 'Good' | 'Average' | 'Poor';
  impact: 'High' | 'Medium' | 'Low';
  description: string;
  recommendation: string;
}

export interface CibilReport {
  score: number;
  status: 'Poor' | 'Fair' | 'Good' | 'Very Good' | 'Excellent';
  scoreRange: string;
  lastUpdated: string;
  nextRefreshDate: string;
  totalAccounts: number;
  activeAccounts: number;
  creditCardsCount: number;
  creditUtilizationRate: number; // e.g. 18%
  onTimePaymentRate: number; // e.g. 100%
  creditAgeYears: number; // e.g. 4.5
  recentInquiriesCount: number;
  scoreHistory: {
    month: string;
    score: number;
  }[];
  factors: CibilFactor[];
}

export interface InvestmentFund {
  id: string;
  name: string;
  category: 'Equity' | 'Debt' | 'Hybrid' | 'Digital Gold' | 'Index';
  subCategory: string;
  rating: number;
  return1Y: number;
  return3Y: number;
  return5Y: number;
  minSipAmount: number;
  minLumpsum: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  fundManager: string;
  nav: number;
  aumCr: number;
  badge?: string;
}

export interface InvestmentHolding {
  id: string;
  fundId: string;
  fundName: string;
  category: string;
  investedAmount: number;
  currentValue: number;
  units: number;
  sipAmount?: number;
  sipFrequency?: 'Monthly' | 'Quarterly';
  nextSipDate?: string;
  returnsAbsolute: number;
  returnsPercentage: number;
}

export interface FixedDepositScheme {
  id: string;
  providerName: string;
  providerType: 'bank' | 'nbfc' | 'small_finance_bank';
  logoText: string;
  logoBg: string;
  regularRate: number; // e.g., 8.60%
  seniorCitizenRate: number; // e.g., 9.10%
  minDeposit: number;
  maxTenureMonths: number;
  creditRating: string; // e.g. 'CRISIL AAA', 'ICRA AA+'
  safetyScore: string; // 'Highest Safety'
  features: string[];
  compounding: 'Monthly' | 'Quarterly' | 'Yearly';
}

export interface BookedFixedDeposit {
  id: string;
  schemeId: string;
  providerName: string;
  depositAmount: number;
  interestRate: number;
  tenureMonths: number;
  maturityAmount: number;
  interestEarned: number;
  payoutOption: 'On Maturity' | 'Monthly' | 'Quarterly';
  bookingDate: string;
  maturityDate: string;
  fdNumber: string;
  status: 'Active' | 'Matured' | 'Premature_Closed';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'loan' | 'cibil' | 'kyc' | 'investment' | 'fd' | 'system';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}
