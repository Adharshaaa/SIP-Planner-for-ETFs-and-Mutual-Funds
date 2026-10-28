import { SIPCalculationResult } from '../types';

/**
 * Calculates compound future value of Systematic Investment Plan (SIP)
 * Formula: FV = P * [ (1 + i)^n - 1 ] / i * (1 + i)
 * where P = monthly investment, i = monthly return rate, n = total months
 * 
 * Also computes regular plan corpus to highlight the Cautilya Direct Alpha Advantage (+1.52% YoY expense ratio difference)
 */
export function calculateSIP(
  monthlyInvestment: number,
  years: number,
  expectedReturnPercent: number,
  directAlphaDifferentialPercent: number = 1.52
): SIPCalculationResult {
  const months = Math.max(1, Math.round(years * 12));
  const monthlyRate = expectedReturnPercent / 100 / 12;

  // Total invested capital
  const investedAmount = monthlyInvestment * months;

  let totalValue = 0;
  if (monthlyRate === 0) {
    totalValue = investedAmount;
  } else {
    // Standard SIP compound terminal formula
    totalValue =
      monthlyInvestment *
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
      (1 + monthlyRate);
  }

  // Regular plan with lower net return due to 1.52% trail commission drag
  const regularNetReturnPercent = Math.max(0.1, expectedReturnPercent - directAlphaDifferentialPercent);
  const regularMonthlyRate = regularNetReturnPercent / 100 / 12;
  const regularPlanValue =
    monthlyInvestment *
    ((Math.pow(1 + regularMonthlyRate, months) - 1) / regularMonthlyRate) *
    (1 + regularMonthlyRate);

  const estimatedReturns = Math.max(0, totalValue - investedAmount);
  const netGainPercent = investedAmount > 0 ? (estimatedReturns / investedAmount) * 100 : 0;
  const alphaDifference = Math.max(0, totalValue - regularPlanValue);

  return {
    investedAmount: Math.round(investedAmount),
    estimatedReturns: Math.round(estimatedReturns),
    totalValue: Math.round(totalValue),
    netGainPercent: Number(netGainPercent.toFixed(1)),
    regularPlanValue: Math.round(regularPlanValue),
    alphaDifference: Math.round(alphaDifference),
  };
}

/**
 * Calculates future value of a one-time Lumpsum investment
 * Formula: FV = P * (1 + r)^t
 */
export function calculateLumpsum(
  investment: number,
  years: number,
  expectedReturnPercent: number,
  directAlphaDifferentialPercent: number = 1.52
): SIPCalculationResult {
  const rate = expectedReturnPercent / 100;
  const regularRate = Math.max(0.001, (expectedReturnPercent - directAlphaDifferentialPercent) / 100);

  const totalValue = investment * Math.pow(1 + rate, years);
  const regularPlanValue = investment * Math.pow(1 + regularRate, years);

  const estimatedReturns = Math.max(0, totalValue - investment);
  const netGainPercent = investment > 0 ? (estimatedReturns / investment) * 100 : 0;
  const alphaDifference = Math.max(0, totalValue - regularPlanValue);

  return {
    investedAmount: Math.round(investment),
    estimatedReturns: Math.round(estimatedReturns),
    totalValue: Math.round(totalValue),
    netGainPercent: Number(netGainPercent.toFixed(1)),
    regularPlanValue: Math.round(regularPlanValue),
    alphaDifference: Math.round(alphaDifference),
  };
}

/**
 * Calculates algorithmic step-up SIP where monthly contribution increments by stepUpPercent each year
 */
export function calculateStepUpSIP(
  initialMonthly: number,
  years: number,
  expectedReturnPercent: number,
  annualStepUpPercent: number = 10
): { totalInvested: number; totalValue: number } {
  let totalInvested = 0;
  let totalValue = 0;
  const monthlyRate = expectedReturnPercent / 100 / 12;

  let currentMonthly = initialMonthly;

  for (let year = 1; year <= years; year++) {
    for (let month = 1; month <= 12; month++) {
      const remainingMonths = (years - year) * 12 + (12 - month + 1);
      totalInvested += currentMonthly;
      totalValue += currentMonthly * Math.pow(1 + monthlyRate, remainingMonths);
    }
    currentMonthly = currentMonthly * (1 + annualStepUpPercent / 100);
  }

  return {
    totalInvested: Math.round(totalInvested),
    totalValue: Math.round(totalValue),
  };
}

/**
 * Formats a numeric currency value into the Indian numbering system:
 * e.g., 63561790 -> ₹ 6,35,61,790
 * Or compact: ₹ 6.35 Cr, ₹ 70.15 Lakhs
 */
export function formatINR(amount: number, compact: boolean = false): string {
  if (isNaN(amount)) return '₹ 0';

  if (compact) {
    if (Math.abs(amount) >= 10000000) {
      return `₹ ${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (Math.abs(amount) >= 100000) {
      return `₹ ${(amount / 100000).toFixed(2)} Lakhs`;
    }
    if (Math.abs(amount) >= 1000) {
      return `₹ ${(amount / 1000).toFixed(1)}k`;
    }
    return `₹ ${Math.round(amount)}`;
  }

  // Exact Indian Currency Formatting: 3 digits at end, 2 digits before that
  const str = Math.round(amount).toString();
  const isNegative = str.startsWith('-');
  const cleanStr = isNegative ? str.slice(1) : str;

  if (cleanStr.length <= 3) {
    return `${isNegative ? '-' : ''}₹ ${cleanStr}`;
  }

  const lastThree = cleanStr.substring(cleanStr.length - 3);
  const otherNumbers = cleanStr.substring(0, cleanStr.length - 3);
  const formattedOther = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');

  return `${isNegative ? '-' : ''}₹ ${formattedOther},${lastThree}`;
}

/**
 * Formats percentage with optional sign
 */
export function formatPercentage(val: number, includeSign: boolean = true): string {
  const sign = includeSign && val > 0 ? '+' : '';
  return `${sign}${val.toFixed(2)}%`;
}
