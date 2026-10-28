import { describe, it, expect } from 'vitest';
import { ALL_FUNDS } from '../data/mockData';
import { calculateSIP, calculateLumpsum } from '../utils/calculations';

describe('Fund Specific SIP & Compounding Calculator Suite', () => {
  it('calibrates returns based on specific fund historical CAGR and expense ratios', () => {
    const fund = ALL_FUNDS[0]; // Parag Parikh Flexi Cap Direct: 3Y CAGR 21.2%, TER 0.61%, Regular 1.34%
    const regularTer = fund.regularTer || 1.34;
    const directAlphaAdvantage = Number((regularTer - fund.ter).toFixed(2)); // 0.73%

    const monthlySip = 10000;
    const years = 10;

    const result = calculateSIP(monthlySip, years, fund.return3Y, directAlphaAdvantage);

    // Capital invested: 10,000 * 120 = 12,00,000
    expect(result.investedAmount).toBe(1200000);

    // Compounded outcome at 21.2% CAGR should exceed ₹35 Lakhs
    expect(result.totalValue).toBeGreaterThan(3500000);

    // Alpha difference saved by direct plan
    expect(result.alphaDifference).toBeGreaterThan(100000);
  });

  it('accurately calculates ETF SIP using ETF low expense ratio benchmark', () => {
    const etf = ALL_FUNDS[1]; // Nippon Nifty 50 BeES: 3Y CAGR 16.1%, TER 0.04%
    const result = calculateSIP(5000, 5, etf.return3Y, 0.5);

    expect(result.investedAmount).toBe(300000);
    expect(result.totalValue).toBeGreaterThan(400000);
  });
});
