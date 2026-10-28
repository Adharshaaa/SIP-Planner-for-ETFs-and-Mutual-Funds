import { describe, it, expect } from 'vitest';
import {
  calculateSIP,
  calculateLumpsum,
  calculateStepUpSIP,
  formatINR,
  formatPercentage,
} from './calculations';

describe('Financial Math & Compounding Engine', () => {
  it('correctly calculates 10-year monthly SIP at 13.5% CAGR', () => {
    // ₹2,50,000 / month for 10 years at 13.5%
    const result = calculateSIP(250000, 10, 13.5);

    // Invested capital: 250,000 * 120 = ₹3,00,00,000 (3 Crore)
    expect(result.investedAmount).toBe(30000000);

    // Maturity value should be around ₹6.35 Crore
    expect(result.totalValue).toBeGreaterThan(63000000);
    expect(result.totalValue).toBeLessThan(64000000);

    // Net gain percent should be > 100%
    expect(result.netGainPercent).toBeGreaterThan(100);

    // Direct plan should outperform regular plan
    expect(result.totalValue).toBeGreaterThan(result.regularPlanValue);
    expect(result.alphaDifference).toBeGreaterThan(0);
  });

  it('handles edge case of 0% return', () => {
    const result = calculateSIP(10000, 5, 0);
    expect(result.investedAmount).toBe(600000);
    expect(result.totalValue).toBe(600000);
    expect(result.estimatedReturns).toBe(0);
  });

  it('calculates one-time lumpsum investment accurately', () => {
    // ₹10,00,000 for 5 years at 12%
    const result = calculateLumpsum(1000000, 5, 12);
    expect(result.investedAmount).toBe(1000000);
    // 10L * 1.12^5 = 17,62,341
    expect(result.totalValue).toBeGreaterThan(1760000);
    expect(result.totalValue).toBeLessThan(1770000);
  });

  it('demonstrates step-up SIP wealth multiplier over static SIP', () => {
    const staticSIP = calculateSIP(50000, 10, 12);
    const stepUpSIP = calculateStepUpSIP(50000, 10, 12, 10); // 10% annual increment

    expect(stepUpSIP.totalInvested).toBeGreaterThan(staticSIP.investedAmount);
    expect(stepUpSIP.totalValue).toBeGreaterThan(staticSIP.totalValue);
  });

  describe('Indian Currency & Percentage Formatter', () => {
    it('formats numbers into standard Indian numbering system', () => {
      expect(formatINR(63561790)).toBe('₹ 6,35,61,790');
      expect(formatINR(100000)).toBe('₹ 1,00,000');
      expect(formatINR(500)).toBe('₹ 500');
      expect(formatINR(12345678)).toBe('₹ 1,23,45,678');
    });

    it('formats compact Indian representation with Lakhs and Crores', () => {
      expect(formatINR(7015000, true)).toBe('₹ 70.15 Lakhs');
      expect(formatINR(63561790, true)).toBe('₹ 6.36 Cr');
      expect(formatINR(2500, true)).toBe('₹ 2.5k');
    });

    it('formats percentage with sign', () => {
      expect(formatPercentage(13.5)).toBe('+13.50%');
      expect(formatPercentage(-2.4)).toBe('-2.40%');
      expect(formatPercentage(0)).toBe('0.00%');
    });
  });
});
