import { Fund, PortfolioHolding } from '../types';

export type CategoryFilterTab =
  | 'All'
  | 'Top Ranked'
  | 'Mutual Funds'
  | 'ETFs'
  | 'Equity Funds'
  | 'Index ETFs'
  | 'Hybrid Allocation'
  | 'Debt & Liquid';

export function filterFundsByCategory(funds: Fund[], categoryTab: CategoryFilterTab | string): Fund[] {
  if (!categoryTab || categoryTab === 'All') {
    return funds;
  }

  if (categoryTab === 'Top Ranked') {
    return [...funds].sort((a, b) => (a.rank || 999) - (b.rank || 999)).slice(0, 10);
  }

  if (categoryTab === 'Mutual Funds') {
    return funds.filter(f => f.assetType === 'Mutual Fund' || f.category !== 'Index ETF');
  }

  if (categoryTab === 'ETFs') {
    return funds.filter(f => f.assetType === 'ETF' || f.category === 'Index ETF');
  }

  if (categoryTab === 'Equity Funds') {
    return funds.filter(f =>
      ['Flexi Cap Equity', 'Large & Mid Cap', 'ELSS Tax Saver', 'Small Cap'].includes(f.category)
    );
  }

  if (categoryTab === 'Index ETFs') {
    return funds.filter(f => f.category === 'Index ETF' || f.assetType === 'ETF');
  }

  if (categoryTab === 'Hybrid Allocation') {
    return funds.filter(f => f.category === 'Aggressive Hybrid');
  }

  if (categoryTab === 'Debt & Liquid') {
    return funds.filter(f => f.category === 'Overnight & Liquid');
  }

  return funds.filter(f => f.category.toLowerCase().includes(categoryTab.toLowerCase()));
}

export function searchFunds(funds: Fund[], query: string): Fund[] {
  if (!query || query.trim() === '') {
    return funds;
  }

  const clean = query.trim().toLowerCase();
  return funds.filter(f =>
    f.name.toLowerCase().includes(clean) ||
    f.code.toLowerCase().includes(clean) ||
    f.amc.toLowerCase().includes(clean) ||
    f.category.toLowerCase().includes(clean) ||
    (f.assetType && f.assetType.toLowerCase().includes(clean)) ||
    (f.benchmark && f.benchmark.toLowerCase().includes(clean))
  );
}

export function sortFunds(
  funds: Fund[],
  sortBy: 'rank' | 'score' | 'aum' | 'return1Y' | 'return3Y' | 'return5Y' | 'ter' | 'alpha' | 'sharpeRatio',
  direction?: 'asc' | 'desc'
): Fund[] {
  // Determine natural default direction if not explicitly supplied
  const effectiveDirection = direction ?? (sortBy === 'rank' || sortBy === 'ter' ? 'asc' : 'desc');

  return [...funds].sort((a, b) => {
    const valA = (a[sortBy] as number) ?? (sortBy === 'rank' ? 9999 : 0);
    const valB = (b[sortBy] as number) ?? (sortBy === 'rank' ? 9999 : 0);
    return effectiveDirection === 'desc' ? valB - valA : valA - valB;
  });
}

export interface PortfolioSummary {
  totalInvested: number;
  totalCurrentValue: number;
  totalProfit: number;
  totalProfitPercent: number;
  annualizedXirr: number;
  allocationByAsset: { category: string; value: number; percentage: number }[];
}

export function calculatePortfolioSummary(holdings: PortfolioHolding[]): PortfolioSummary {
  if (holdings.length === 0) {
    return {
      totalInvested: 0,
      totalCurrentValue: 0,
      totalProfit: 0,
      totalProfitPercent: 0,
      annualizedXirr: 0,
      allocationByAsset: [],
    };
  }

  const totalInvested = holdings.reduce((sum, h) => sum + h.invested, 0);
  const totalCurrentValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalProfit = totalCurrentValue - totalInvested;
  const totalProfitPercent = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

  // Weighted average XIRR
  const weightedXirrSum = holdings.reduce((sum, h) => sum + h.xirr * h.currentValue, 0);
  const annualizedXirr = totalCurrentValue > 0 ? weightedXirrSum / totalCurrentValue : 0;

  // Asset class breakdown
  const categoryMap = new Map<string, number>();
  for (const h of holdings) {
    const prev = categoryMap.get(h.category) || 0;
    categoryMap.set(h.category, prev + h.currentValue);
  }

  const allocationByAsset = Array.from(categoryMap.entries()).map(([category, value]) => ({
    category,
    value,
    percentage: totalCurrentValue > 0 ? Number(((value / totalCurrentValue) * 100).toFixed(1)) : 0,
  }));

  return {
    totalInvested,
    totalCurrentValue,
    totalProfit,
    totalProfitPercent: Number(totalProfitPercent.toFixed(2)),
    annualizedXirr: Number(annualizedXirr.toFixed(1)),
    allocationByAsset,
  };
}
