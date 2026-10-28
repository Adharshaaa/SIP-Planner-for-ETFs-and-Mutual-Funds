import { describe, it, expect } from 'vitest';
import { ALL_FUNDS, CURATED_BASKETS, USER_HOLDINGS, USER_PROFILE } from '../data/mockData';
import { calculateSIP, calculateLumpsum, calculateStepUpSIP, formatINR } from '../utils/calculations';
import { filterFundsByCategory, searchFunds, calculatePortfolioSummary } from '../utils/fundFiltering';

describe('Institutional Wealth Platform Integration Test Suite', () => {
  describe('Workflow 1: Wealth Projection Simulator to Mandate Generation', () => {
    it('simulates wealth outcome for ₹2,50,000 monthly SIP and verifies calculations', () => {
      const monthlyAmount = 250000;
      const years = 10;
      const cagr = 13.5;

      const result = calculateSIP(monthlyAmount, years, cagr);

      // Verify invested corpus: 2.5L * 120 = 3,00,00,000 (3 Crore)
      expect(result.investedAmount).toBe(30000000);

      // Verify projected maturity is ₹6.35+ Crore
      expect(result.totalValue).toBeGreaterThan(63000000);

      // Verify net gain percentage
      expect(result.netGainPercent).toBeGreaterThan(110);

      // Verify Direct plan alpha advantage over regular plan (> ₹50 Lakhs over 10 years)
      expect(result.alphaDifference).toBeGreaterThan(5000000);
      expect(result.alphaDifference).toBe(5546141);
    });

    it('verifies Algorithmic Step-Up compounding outpaces static SIP by > 1.5x', () => {
      const initialMonthly = 50000;
      const years = 15;
      const cagr = 14.0;
      const stepUpPercent = 10;

      const staticResult = calculateSIP(initialMonthly, years, cagr);
      const stepUpResult = calculateStepUpSIP(initialMonthly, years, cagr, stepUpPercent);

      expect(stepUpResult.totalValue).toBeGreaterThan(staticResult.totalValue * 1.5);
    });
  });

  describe('Workflow 2: Quantitative Fund Screener & Comparison', () => {
    it('accurately filters across asset classes and finds lowest expense ratios', () => {
      const equityFunds = filterFundsByCategory(ALL_FUNDS, 'Equity Funds');
      expect(equityFunds.length).toBeGreaterThan(0);

      const indexEtfs = filterFundsByCategory(ALL_FUNDS, 'Index ETFs');
      expect(indexEtfs.length).toBeGreaterThanOrEqual(1);
      expect(indexEtfs.some(e => e.ter <= 0.04)).toBe(true); // Lowest TER is 0.04% or less

      const liquidFunds = filterFundsByCategory(ALL_FUNDS, 'Debt & Liquid');
      expect(liquidFunds.length).toBe(1);
      expect(liquidFunds[0].riskRating).toBe('Very Low');
    });

    it('searches by ticker, manager, and benchmark names', () => {
      const ppfas = searchFunds(ALL_FUNDS, 'PPFAS');
      expect(ppfas.length).toBe(1);

      const nifty = searchFunds(ALL_FUNDS, 'NIFTY');
      expect(nifty.length).toBeGreaterThanOrEqual(1);

      const largeMid = searchFunds(ALL_FUNDS, 'Mirae');
      expect(largeMid.length).toBe(2);
    });
  });

  describe('Workflow 3: Curated Baskets Calibration', () => {
    it('validates basket composition sums to 100% for each strategy', () => {
      CURATED_BASKETS.forEach((basket) => {
        const totalAllocation = basket.composition.reduce((sum, item) => sum + item.allocation, 0);
        expect(totalAllocation).toBe(100);
        expect(basket.cagr).toBeGreaterThan(10);
        expect(basket.minSip).toBeGreaterThan(0);
      });
    });
  });

  describe('Workflow 4: Portfolio Summary & Asset Allocation Compliance', () => {
    it('computes accurate client ledger metrics and weighted XIRR', () => {
      const summary = calculatePortfolioSummary(USER_HOLDINGS);

      expect(summary.totalInvested).toBe(13700000);
      expect(summary.totalCurrentValue).toBe(18432950);
      expect(summary.totalProfit).toBe(4732950);
      expect(summary.annualizedXirr).toBe(21.9);

      // Verify allocations match standard asset classes
      const categories = summary.allocationByAsset.map((a) => a.category);
      expect(categories).toContain('Flexi Cap Equity');
      expect(categories).toContain('Index ETF');
      expect(categories).toContain('Large & Mid Cap');
      expect(categories).toContain('Aggressive Hybrid');
      expect(categories).toContain('Overnight & Liquid');
    });
  });

  describe('Workflow 5: User Profile & Mandate Bounds', () => {
    it('validates user KYC and mandate limits', () => {
      expect(USER_PROFILE.panVerified).toBe(true);
      expect(USER_PROFILE.aadhaarVerified).toBe(true);
      expect(USER_PROFILE.mandateLimit).toBeGreaterThanOrEqual(500000);
    });
  });
});
