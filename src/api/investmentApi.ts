import { InvestmentFund, InvestmentHolding } from '../types';
import { 
  ApiResponse, 
  createApiResponse, 
  getLocalItem, 
  setLocalItem, 
  STORAGE_KEYS, 
  mockDelay 
} from './client';

const TOP_FUNDS: InvestmentFund[] = [
  {
    id: 'fund_parag_parikh_flexi',
    name: 'Parag Parikh Flexi Cap Fund',
    category: 'Equity',
    subCategory: 'Flexi Cap Direct-Growth',
    rating: 5,
    return1Y: 28.4,
    return3Y: 21.8,
    return5Y: 24.2,
    minSipAmount: 500,
    minLumpsum: 1000,
    riskLevel: 'Very High',
    fundManager: 'Rajeev Thakkar',
    nav: 84.92,
    aumCr: 72450,
    badge: 'Popular • 5★ Value Research',
  },
  {
    id: 'fund_quant_small_cap',
    name: 'Quant Small Cap Fund Direct',
    category: 'Equity',
    subCategory: 'Small Cap High Alpha',
    rating: 5,
    return1Y: 38.6,
    return3Y: 29.4,
    return5Y: 34.8,
    minSipAmount: 1000,
    minLumpsum: 5000,
    riskLevel: 'Very High',
    fundManager: 'Sandeep Tandon',
    nav: 242.10,
    aumCr: 21300,
    badge: 'Top Performer',
  },
  {
    id: 'fund_mirae_asset_large_cap',
    name: 'Mirae Asset Large Cap Fund',
    category: 'Equity',
    subCategory: 'Large Cap Bluechip',
    rating: 4,
    return1Y: 22.1,
    return3Y: 16.5,
    return5Y: 18.2,
    minSipAmount: 500,
    minLumpsum: 1000,
    riskLevel: 'High',
    fundManager: 'Gaurav Misra',
    nav: 118.45,
    aumCr: 39800,
    badge: 'Consistent Performer',
  },
  {
    id: 'fund_digital_gold_24k',
    name: 'Money View 24K 99.9% Pure Digital Gold',
    category: 'Digital Gold',
    subCategory: 'Insured by Sequel Vaults • MMTC-PAMP',
    rating: 5,
    return1Y: 18.2,
    return3Y: 15.4,
    return5Y: 14.1,
    minSipAmount: 100,
    minLumpsum: 10,
    riskLevel: 'Low',
    fundManager: 'Augmont Gold Tech',
    nav: 7420.50, // Per gram
    aumCr: 4500,
    badge: 'Zero Storage Fee • 24K Pure',
  },
  {
    id: 'fund_hdfc_balanced_advantage',
    name: 'HDFC Balanced Advantage Fund',
    category: 'Hybrid',
    subCategory: 'Dynamic Asset Allocation',
    rating: 5,
    return1Y: 24.5,
    return3Y: 19.8,
    return5Y: 20.3,
    minSipAmount: 500,
    minLumpsum: 1000,
    riskLevel: 'Moderate',
    fundManager: 'Gopal Agrawal',
    nav: 462.80,
    aumCr: 84000,
    badge: 'Low Volatility',
  },
];

const INITIAL_PORTFOLIO: InvestmentHolding[] = [
  {
    id: 'hold_1',
    fundId: 'fund_parag_parikh_flexi',
    fundName: 'Parag Parikh Flexi Cap Fund',
    category: 'Equity',
    investedAmount: 45000,
    currentValue: 56240,
    units: 662.27,
    sipAmount: 5000,
    sipFrequency: 'Monthly',
    nextSipDate: '2026-09-10',
    returnsAbsolute: 11240,
    returnsPercentage: 24.97,
  },
  {
    id: 'hold_2',
    fundId: 'fund_digital_gold_24k',
    fundName: 'Money View 24K Digital Gold (1.82g)',
    category: 'Digital Gold',
    investedAmount: 12000,
    currentValue: 13505,
    units: 1.82,
    returnsAbsolute: 1505,
    returnsPercentage: 12.54,
  },
];

export const investmentApi = {
  /**
   * Get list of top mutual funds & digital gold
   */
  async getFunds(): Promise<ApiResponse<InvestmentFund[]>> {
    await mockDelay(250);
    return createApiResponse(TOP_FUNDS, 'Investment funds list fetched');
  },

  /**
   * Calculate SIP Compound Growth
   * Formula: M = P * ({[1 + i]^n - 1} / i) * (1 + i)
   */
  calculateSip(monthlyAmount: number, tenureYears: number, expectedReturnRate: number = 15) {
    const i = expectedReturnRate / (12 * 100);
    const n = tenureYears * 12;
    const totalInvested = monthlyAmount * n;
    const futureValue = Math.round(monthlyAmount * ((Math.pow(1 + i, n) - 1) / i) * (1 + i));
    const estimatedReturns = futureValue - totalInvested;

    return {
      monthlyAmount,
      tenureYears,
      totalInvested,
      estimatedReturns,
      futureValue,
      wealthGainRatio: Number((futureValue / totalInvested).toFixed(2)),
    };
  },

  /**
   * Get user's active investment portfolio
   */
  async getPortfolio(): Promise<ApiResponse<{ holdings: InvestmentHolding[]; totalInvested: number; totalCurrent: number; totalGain: number; totalGainPct: number }>> {
    await mockDelay(300);
    const holdings = getLocalItem<InvestmentHolding[]>(STORAGE_KEYS.INVESTMENT_PORTFOLIO, INITIAL_PORTFOLIO);
    
    const totalInvested = holdings.reduce((sum, h) => sum + h.investedAmount, 0);
    const totalCurrent = holdings.reduce((sum, h) => sum + h.currentValue, 0);
    const totalGain = totalCurrent - totalInvested;
    const totalGainPct = totalInvested > 0 ? Number(((totalGain / totalInvested) * 100).toFixed(2)) : 0;

    return createApiResponse({
      holdings,
      totalInvested,
      totalCurrent,
      totalGain,
      totalGainPct,
    }, 'Portfolio fetched');
  },

  /**
   * Start a new SIP or Lumpsum
   */
  async startInvestment(fundId: string, amount: number, isSip: boolean = true): Promise<ApiResponse<InvestmentHolding>> {
    await mockDelay(750);
    const fund = TOP_FUNDS.find((f) => f.id === fundId) || TOP_FUNDS[0];

    const newHolding: InvestmentHolding = {
      id: 'hold_' + Math.random().toString(36).substring(2, 8),
      fundId: fund.id,
      fundName: fund.name,
      category: fund.category,
      investedAmount: amount,
      currentValue: amount,
      units: Number((amount / fund.nav).toFixed(3)),
      sipAmount: isSip ? amount : undefined,
      sipFrequency: isSip ? 'Monthly' : undefined,
      nextSipDate: isSip ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
      returnsAbsolute: 0,
      returnsPercentage: 0,
    };

    const current = getLocalItem<InvestmentHolding[]>(STORAGE_KEYS.INVESTMENT_PORTFOLIO, INITIAL_PORTFOLIO);
    const updated = [newHolding, ...current];
    setLocalItem(STORAGE_KEYS.INVESTMENT_PORTFOLIO, updated);

    return createApiResponse(newHolding, `${isSip ? 'Monthly SIP of ₹' + amount.toLocaleString('en-IN') : 'Lumpsum investment of ₹' + amount.toLocaleString('en-IN')} initiated in ${fund.name}`);
  },
};
