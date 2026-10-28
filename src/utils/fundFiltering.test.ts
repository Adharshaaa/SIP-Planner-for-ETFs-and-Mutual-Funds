import { describe, it, expect } from 'vitest';
import { ALL_FUNDS, USER_HOLDINGS } from '../data/mockData';
import {
  calculatePortfolioSummary,
  filterFundsByCategory,
  searchFunds,
  sortFunds,
} from './fundFiltering';

describe('Fund Screener & Portfolio Analysis Suite', () => {
  it('filters funds accurately by tab categories', () => {
    const all = filterFundsByCategory(ALL_FUNDS, 'All');
    expect(all.length).toBe(ALL_FUNDS.length);

    const equity = filterFundsByCategory(ALL_FUNDS, 'Equity Funds');
    expect(equity.length).toBeGreaterThan(0);
    expect(equity.every(f => ['Flexi Cap Equity', 'Large & Mid Cap', 'ELSS Tax Saver', 'Small Cap'].includes(f.category))).toBe(true);

    const etfs = filterFundsByCategory(ALL_FUNDS, 'Index ETFs');
    expect(etfs.length).toBeGreaterThanOrEqual(1);
    expect(etfs.some(e => e.code === 'N50')).toBe(true);

    const debt = filterFundsByCategory(ALL_FUNDS, 'Debt & Liquid');
    expect(debt.length).toBeGreaterThanOrEqual(1);
    expect(debt.some(d => d.code === 'HDFC')).toBe(true);
  });

  it('searches funds with case-insensitive multi-field lookup', () => {
    const paragSearch = searchFunds(ALL_FUNDS, 'Parag Parikh');
    expect(paragSearch.length).toBe(1);
    expect(paragSearch[0].id).toBe('ppfas-flexi-cap');

    const niftySearch = searchFunds(ALL_FUNDS, 'NIFTY');
    expect(niftySearch.length).toBeGreaterThanOrEqual(1);

    const tickerSearch = searchFunds(ALL_FUNDS, 'ICIC');
    expect(tickerSearch.length).toBeGreaterThanOrEqual(1);

    const emptySearch = searchFunds(ALL_FUNDS, '');
    expect(emptySearch.length).toBe(ALL_FUNDS.length);
  });

  it('sorts funds dynamically by financial metrics, rank, and score', () => {
    const sortedByRank = sortFunds(ALL_FUNDS, 'rank', 'asc');
    expect(sortedByRank[0].rank).toBe(1);
    expect(sortedByRank[1].rank).toBe(2);

    const sortedByScore = sortFunds(ALL_FUNDS, 'score', 'desc');
    expect(sortedByScore[0].score).toBeGreaterThanOrEqual(sortedByScore[1].score ?? 0);

    const sortedByAumDesc = sortFunds(ALL_FUNDS, 'aum', 'desc');
    expect(sortedByAumDesc[0].aum).toBeGreaterThanOrEqual(sortedByAumDesc[1].aum);

    const sortedBy1YReturn = sortFunds(ALL_FUNDS, 'return1Y', 'desc');
    expect(sortedBy1YReturn[0].return1Y).toBeGreaterThanOrEqual(sortedBy1YReturn[1].return1Y);

    const sortedByTerAsc = sortFunds(ALL_FUNDS, 'ter', 'asc');
    expect(sortedByTerAsc[0].ter).toBeLessThanOrEqual(sortedByTerAsc[1].ter);
  });

  it('calculates portfolio metrics, weighted XIRR, and asset allocation percentages', () => {
    const summary = calculatePortfolioSummary(USER_HOLDINGS);

    expect(summary.totalInvested).toBe(13700000);
    expect(summary.totalCurrentValue).toBe(18432950);
    expect(summary.totalProfit).toBe(4732950);
    expect(summary.totalProfitPercent).toBeGreaterThan(30);
    expect(summary.annualizedXirr).toBeGreaterThan(15);

    // Sum of allocation percentages should be approximately 100%
    const totalPercentage = summary.allocationByAsset.reduce((sum, item) => sum + item.percentage, 0);
    expect(totalPercentage).toBeGreaterThan(99);
    expect(totalPercentage).toBeLessThan(101);
  });
});
