export type Screen = 'discover' | 'explore' | 'fund-details' | 'portfolio' | 'auth';

export interface MarketTicker {
  id: string;
  name: string;
  value: string;
  change: string;
  isPositive: boolean;
}

export interface Fund {
  id: string;
  code: string;
  name: string;
  amc: string;
  rank?: number; // Overall rank based on historical analytics
  categoryRank?: number; // Category specific rank
  score?: number; // Institutional quantitative score (out of 100)
  assetType?: 'Mutual Fund' | 'ETF';
  ter: number; // Total Expense Ratio
  regularTer?: number;
  category: string;
  aum: number; // in Crores
  return1Y: number;
  return3Y: number;
  return5Y: number;
  riskRating: 'Very Low' | 'Low' | 'Moderate' | 'High' | 'Very High' | 'Market Risk';
  minSip: number;
  minLumpsum: number;
  actionLabel: string;
  crisilRating?: number;
  benchmark?: string;
  nav?: number;
  navDate?: string;
  alpha?: number;
  sharpeRatio?: number;
  sortinoRatio?: number;
  beta?: number;
  standardDeviation?: number;
  maxDrawdown?: number;
  topHoldings?: { company: string; sector: string; weight: number }[];
  sectorAllocation?: { sector: string; weight: number }[];
  fundManager?: { name: string; experience: string; qualification: string };
  exitLoad?: string;
}

export interface CuratedBasket {
  id: string;
  tag: string;
  badge?: string;
  badgeColor?: string;
  title: string;
  description: string;
  cagrPeriod: string;
  cagr: number;
  risk: string;
  minSip: number;
  composition: { name: string; allocation: number }[];
  trendData: number[]; // Points for SVG sparkline
}

export interface SIPCalculationResult {
  investedAmount: number;
  estimatedReturns: number;
  totalValue: number;
  netGainPercent: number;
  regularPlanValue: number;
  alphaDifference: number; // Extra money saved by Direct Plan
}

export interface PortfolioHolding {
  id: string;
  fundId: string;
  fundName: string;
  category: string;
  invested: number;
  currentValue: number;
  units: number;
  sipAmount?: number;
  sipDate?: number; // Day of month
  returnsPercent: number;
  xirr: number;
  isDirect: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  tier: string;
  panVerified: boolean;
  aadhaarVerified: boolean;
  riskProfile: 'Aggressive' | 'Moderate' | 'Conservative';
  mandateBank: string;
  mandateLimit: number;
}
