import { FixedDepositScheme, BookedFixedDeposit } from '../types';
import { 
  ApiResponse, 
  createApiResponse, 
  getLocalItem, 
  setLocalItem, 
  STORAGE_KEYS, 
  mockDelay 
} from './client';

const FD_SCHEMES: FixedDepositScheme[] = [
  {
    id: 'fd_shriram_finance',
    providerName: 'Shriram Finance Ltd',
    providerType: 'nbfc',
    logoText: 'SF',
    logoBg: 'bg-amber-600',
    regularRate: 8.65,
    seniorCitizenRate: 9.15,
    minDeposit: 5000,
    maxTenureMonths: 60,
    creditRating: 'CRISIL AAA / Stable',
    safetyScore: 'Highest Safety',
    features: [
      'Additional 0.50% p.a. for Senior Citizens',
      'Additional 0.10% p.a. for Women Depositors',
      'Flexible Interest Payout (Monthly / Quarterly / Maturity)',
      'Premature withdrawal after 3 months',
    ],
    compounding: 'Quarterly',
  },
  {
    id: 'fd_bajaj_finance',
    providerName: 'Bajaj Finance Ltd',
    providerType: 'nbfc',
    logoText: 'BF',
    logoBg: 'bg-blue-600',
    regularRate: 8.40,
    seniorCitizenRate: 8.85,
    minDeposit: 15000,
    maxTenureMonths: 60,
    creditRating: 'CRISIL AAA & ICRA AAA',
    safetyScore: 'Zero Default Record',
    features: [
      'Digital loan against FD up to 75% instantly',
      'Multi-deposit suite in single transaction',
      'Fast online booking with Aadhaar e-sign',
    ],
    compounding: 'Quarterly',
  },
  {
    id: 'fd_unity_sfb',
    providerName: 'Unity Small Finance Bank',
    providerType: 'small_finance_bank',
    logoText: 'UB',
    logoBg: 'bg-emerald-600',
    regularRate: 8.85,
    seniorCitizenRate: 9.35,
    minDeposit: 1000,
    maxTenureMonths: 48,
    creditRating: 'RBI Regulated Bank',
    safetyScore: 'DICGC Insured up to ₹5 Lakhs',
    features: [
      'DICGC (RBI subsidiary) insured up to ₹5 Lakhs per depositor',
      'High interest on 1001 days special bucket',
      'Zero penalty on premature withdrawal after 6 months',
    ],
    compounding: 'Quarterly',
  },
  {
    id: 'fd_suryoday_sfb',
    providerName: 'Suryoday Small Finance Bank',
    providerType: 'small_finance_bank',
    logoText: 'SS',
    logoBg: 'bg-purple-600',
    regularRate: 8.50,
    seniorCitizenRate: 9.00,
    minDeposit: 1000,
    maxTenureMonths: 60,
    creditRating: 'RBI Regulated Bank',
    safetyScore: 'DICGC Insured up to ₹5 Lakhs',
    features: [
      'Guaranteed fixed returns backed by RBI guidelines',
      'Doorstep assistance for senior citizens',
      'Auto-renewal options available',
    ],
    compounding: 'Quarterly',
  },
];

const INITIAL_BOOKED_FDS: BookedFixedDeposit[] = [
  {
    id: 'fd_bk_44910',
    schemeId: 'fd_shriram_finance',
    providerName: 'Shriram Finance Ltd',
    depositAmount: 100000,
    interestRate: 8.65,
    tenureMonths: 24,
    maturityAmount: 118432,
    interestEarned: 18432,
    payoutOption: 'On Maturity',
    bookingDate: '2025-10-15T09:00:00.000Z',
    maturityDate: '2027-10-15',
    fdNumber: 'FD-SHR-992140',
    status: 'Active',
  },
];

export const fdApi = {
  /**
   * Get all FD schemes
   */
  async getSchemes(): Promise<ApiResponse<FixedDepositScheme[]>> {
    await mockDelay(250);
    return createApiResponse(FD_SCHEMES, 'Fixed deposit schemes fetched');
  },

  /**
   * Calculate FD returns
   * Formula for quarterly compounding: A = P * (1 + r / (4 * 100))^(4 * t)
   */
  calculateMaturity(
    principal: number,
    tenureMonths: number,
    ratePercent: number,
    payoutOption: 'On Maturity' | 'Monthly' | 'Quarterly' = 'On Maturity'
  ) {
    const years = tenureMonths / 12;
    let maturityAmount = 0;
    let totalInterest = 0;
    let periodicPayout = 0;

    if (payoutOption === 'On Maturity') {
      // Quarterly compounding
      const quarters = years * 4;
      const quarterlyRate = ratePercent / 400;
      maturityAmount = Math.round(principal * Math.pow(1 + quarterlyRate, quarters));
      totalInterest = maturityAmount - principal;
    } else if (payoutOption === 'Monthly') {
      // Simple monthly interest payout
      periodicPayout = Math.round((principal * (ratePercent / 100)) / 12);
      totalInterest = periodicPayout * tenureMonths;
      maturityAmount = principal; // Principal returned on maturity
    } else {
      // Quarterly payout
      periodicPayout = Math.round((principal * (ratePercent / 100)) / 4);
      totalInterest = periodicPayout * (tenureMonths / 3);
      maturityAmount = principal;
    }

    return {
      principal,
      tenureMonths,
      ratePercent,
      payoutOption,
      maturityAmount,
      totalInterest,
      periodicPayout,
      effectiveAnnualYield: Number((((totalInterest / principal) / years) * 100).toFixed(2)),
    };
  },

  /**
   * Get user's booked FDs
   */
  async getUserFds(): Promise<ApiResponse<BookedFixedDeposit[]>> {
    await mockDelay(300);
    const fds = getLocalItem<BookedFixedDeposit[]>(STORAGE_KEYS.BOOKED_FDS, INITIAL_BOOKED_FDS);
    return createApiResponse(fds, 'User fixed deposits retrieved');
  },

  /**
   * Book a new Fixed Deposit
   */
  async bookFixedDeposit(payload: {
    schemeId: string;
    depositAmount: number;
    tenureMonths: number;
    isSeniorCitizen: boolean;
    payoutOption: 'On Maturity' | 'Monthly' | 'Quarterly';
  }): Promise<ApiResponse<BookedFixedDeposit>> {
    await mockDelay(850);
    const scheme = FD_SCHEMES.find((s) => s.id === payload.schemeId) || FD_SCHEMES[0];
    const rate = payload.isSeniorCitizen ? scheme.seniorCitizenRate : scheme.regularRate;
    const calc = this.calculateMaturity(payload.depositAmount, payload.tenureMonths, rate, payload.payoutOption);

    const maturityDateObj = new Date();
    maturityDateObj.setMonth(maturityDateObj.getMonth() + payload.tenureMonths);

    const newFd: BookedFixedDeposit = {
      id: 'fd_bk_' + Math.floor(10000 + Math.random() * 90000),
      schemeId: scheme.id,
      providerName: scheme.providerName,
      depositAmount: payload.depositAmount,
      interestRate: rate,
      tenureMonths: payload.tenureMonths,
      maturityAmount: calc.maturityAmount,
      interestEarned: calc.totalInterest,
      payoutOption: payload.payoutOption,
      bookingDate: new Date().toISOString(),
      maturityDate: maturityDateObj.toISOString().split('T')[0],
      fdNumber: `FD-${scheme.logoText}-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Active',
    };

    const currentFds = getLocalItem<BookedFixedDeposit[]>(STORAGE_KEYS.BOOKED_FDS, INITIAL_BOOKED_FDS);
    const updated = [newFd, ...currentFds];
    setLocalItem(STORAGE_KEYS.BOOKED_FDS, updated);

    return createApiResponse(newFd, `Fixed Deposit of ₹${payload.depositAmount.toLocaleString('en-IN')} booked successfully with ${scheme.providerName} at ${rate}% p.a.!`);
  },
};
