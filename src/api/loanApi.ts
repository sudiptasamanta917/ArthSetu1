import { LoanApplication, LoanOffer } from '../types';
import { 
  ApiResponse, 
  createApiResponse, 
  getLocalItem, 
  setLocalItem, 
  STORAGE_KEYS, 
  mockDelay 
} from './client';

export interface ApplyLoanPayload {
  loanType: 'personal' | 'business';
  amount: number;
  tenureMonths: number;
  purpose: string;
  panNumber: string;
  monthlyIncome?: number;
  annualTurnover?: number;
  businessName?: string;
  gstin?: string;
  bankAccountNumber?: string;
  ifscCode?: string;
}

const INITIAL_LOANS: LoanApplication[] = [
  {
    id: 'loan_app_99182',
    loanType: 'personal',
    amount: 150000,
    tenureMonths: 18,
    monthlyEmi: 9482,
    totalInterest: 20676,
    totalPayable: 170676,
    interestRate: 14.5,
    purpose: 'Home Renovation & Appliances',
    status: 'disbursed',
    appliedDate: '2025-11-10T10:30:00.000Z',
    disbursalDate: '2025-11-10T11:15:00.000Z',
    partnerBank: 'DMI Finance Pvt Ltd',
    applicationNumber: 'MV-PL-2025-8819',
    nextEmiDate: '2026-09-05',
    nextEmiAmount: 9482,
  },
];

export const loanApi = {
  /**
   * Calculate EMI with standard formula:
   * E = P * r * (1 + r)^n / ((1 + r)^n - 1)
   */
  calculateEmi(principal: number, tenureMonths: number, annualInterestRate: number = 13.5) {
    const monthlyRate = annualInterestRate / (12 * 100);
    const emi = Math.round(
      (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
        (Math.pow(1 + monthlyRate, tenureMonths) - 1)
    );
    const totalPayable = emi * tenureMonths;
    const totalInterest = totalPayable - principal;
    const monthlyInterestRate = Number((annualInterestRate / 12).toFixed(2));

    return {
      monthlyEmi: emi,
      totalInterest,
      totalPayable,
      monthlyInterestRate,
      annualInterestRate,
    };
  },

  /**
   * Get pre-approved loan offers for user
   */
  async getPreApprovedOffers(): Promise<ApiResponse<{ personalLoan: LoanOffer; businessLoan: LoanOffer }>> {
    await mockDelay(250);
    return createApiResponse({
      personalLoan: {
        id: 'offer_pl_max',
        type: 'personal',
        minAmount: 10000,
        maxAmount: 1000000, // 10 Lakhs
        minTenure: 3,
        maxTenure: 60,
        interestRatePerMonth: 1.33,
        interestRatePerAnnum: 14.0,
        processingFeePercent: 2.0,
        features: [
          '100% Paperless & Instant approval in 2 mins',
          'Direct disbursal into your bank account',
          'Flexible tenure from 3 to 60 months',
          'No collateral or guarantor required',
          'Zero prepayment penalty after 6 EMIs',
        ],
      },
      businessLoan: {
        id: 'offer_bl_max',
        type: 'business',
        minAmount: 100000,
        maxAmount: 5000000, // 50 Lakhs
        minTenure: 6,
        maxTenure: 84,
        interestRatePerMonth: 1.25,
        interestRatePerAnnum: 15.0,
        processingFeePercent: 1.75,
        features: [
          'Unsecured working capital & business expansion loan',
          'Fast sanction based on GST returns and bank statement',
          'Custom daily / weekly / monthly repayment flexibilities',
          'Collateral-free up to ₹50 Lakhs',
          'Tax benefit on interest repayment',
        ],
      },
    }, 'Fetched offers');
  },

  /**
   * Fetch active and past user loan applications
   */
  async getUserLoans(): Promise<ApiResponse<LoanApplication[]>> {
    await mockDelay(300);
    const loans = getLocalItem<LoanApplication[]>(STORAGE_KEYS.LOAN_APPLICATIONS, INITIAL_LOANS);
    return createApiResponse(loans, 'User loan applications fetched');
  },

  /**
   * Apply for a new personal or business loan
   */
  async applyLoan(payload: ApplyLoanPayload): Promise<ApiResponse<LoanApplication>> {
    await mockDelay(800);

    const annualRate = payload.loanType === 'business' ? 14.75 : 13.5;
    const emiCalc = this.calculateEmi(payload.amount, payload.tenureMonths, annualRate);

    const partnerBanks = [
      'DMI Finance Pvt Ltd',
      'Northern Arc Capital Ltd',
      'IDFC FIRST Bank',
      'Aditya Birla Finance Ltd',
      'Fullerton India Credit Co Ltd',
    ];
    const partner = partnerBanks[Math.floor(Math.random() * partnerBanks.length)];

    const newApplication: LoanApplication = {
      id: 'loan_app_' + Math.floor(100000 + Math.random() * 900000),
      loanType: payload.loanType,
      amount: payload.amount,
      tenureMonths: payload.tenureMonths,
      monthlyEmi: emiCalc.monthlyEmi,
      totalInterest: emiCalc.totalInterest,
      totalPayable: emiCalc.totalPayable,
      interestRate: annualRate,
      purpose: payload.purpose || (payload.loanType === 'business' ? 'Working Capital' : 'Personal Expenses'),
      status: 'approved', // Instant sanction in demo flow
      appliedDate: new Date().toISOString(),
      disbursalDate: new Date().toISOString(),
      partnerBank: partner,
      applicationNumber: `MV-${payload.loanType === 'business' ? 'BL' : 'PL'}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      nextEmiDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      nextEmiAmount: emiCalc.monthlyEmi,
    };

    const currentLoans = getLocalItem<LoanApplication[]>(STORAGE_KEYS.LOAN_APPLICATIONS, INITIAL_LOANS);
    const updatedLoans = [newApplication, ...currentLoans];
    setLocalItem(STORAGE_KEYS.LOAN_APPLICATIONS, updatedLoans);

    return createApiResponse(newApplication, 'Congratulations! Your loan has been approved & sanctioned instantly.');
  },
};
