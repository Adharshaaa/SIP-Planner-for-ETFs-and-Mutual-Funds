import React, { useState, useId } from 'react';
import { ArrowRight, Lock, Sparkles, TrendingUp, Percent, ChevronRight } from 'lucide-react';
import { Fund } from '../types';
import { calculateSIP, calculateLumpsum, formatINR } from '../utils/calculations';
import { useApp } from '../context/AppContext';

interface FundSpecificCalculatorProps {
  fund: Fund;
}

export const FundSpecificCalculator: React.FC<FundSpecificCalculatorProps> = ({ fund }) => {
  const { openMandateModal } = useApp();
  const [calcMode, setCalcMode] = useState<'sip' | 'lumpsum'>('sip');
  const [monthlyAmount, setMonthlyAmount] = useState<number>(fund.minSip || 1000);
  const [durationYears, setDurationYears] = useState<number>(10);
  
  // Use the fund's actual historical 3Y or 5Y CAGR as the benchmark rate
  const benchmarkRate = fund.return3Y || fund.return5Y || 15.0;
  const [customReturnRate, setCustomReturnRate] = useState<number>(benchmarkRate);

  const amountId = useId();
  const durationId = useId();
  const rateId = useId();

  // Difference in expense ratio between Regular plan and Direct plan for this specific scheme
  const regularTer = fund.regularTer || (fund.ter + 1.25);
  const alphaDifferential = Math.max(0.1, Number((regularTer - fund.ter).toFixed(2)));

  const result =
    calcMode === 'sip'
      ? calculateSIP(monthlyAmount, durationYears, customReturnRate, alphaDifferential)
      : calculateLumpsum(monthlyAmount, durationYears, customReturnRate, alphaDifferential);

  const totalVal = result.totalValue || 1;
  const investedRatio = Math.min(100, Math.max(0, (result.investedAmount / totalVal) * 100));
  const gainRatio = Math.max(0, 100 - investedRatio);

  return (
    <div className="bg-white dark:bg-[#0e1726] p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <span className="text-[#006c4a] dark:text-emerald-400 font-bold">●</span>
            <span className="uppercase tracking-wider text-[10.5px]">SCHEME-SPECIFIC COMPOUNDING CALCULATOR</span>
          </div>
          <h3 className="font-serif font-bold text-xl text-slate-950 dark:text-white mt-0.5">
            Model Returns for {fund.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pre-calibrated with this fund's 3Y CAGR ({fund.return3Y}%) and direct TER advantage ({fund.ter}% vs {regularTer}%).
          </p>
        </div>

        {/* SIP vs Lumpsum Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setCalcMode('sip')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              calcMode === 'sip'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Monthly SIP
          </button>
          <button
            onClick={() => setCalcMode('lumpsum')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              calcMode === 'lumpsum'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            One-Time
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Controls (lg: 7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Slider 1: Amount */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor={amountId} className="font-semibold text-slate-800 dark:text-slate-200">
                {calcMode === 'sip' ? 'Monthly SIP Commitment' : 'Lumpsum Amount'}
              </label>
              <div className="font-serif font-bold text-base text-slate-900 dark:text-white tabular-nums px-2.5 py-1 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                {formatINR(monthlyAmount)}
              </div>
            </div>
            <input
              id={amountId}
              type="range"
              min={fund.minSip || 500}
              max={calcMode === 'sip' ? 500000 : 5000000}
              step={calcMode === 'sip' ? 500 : 10000}
              value={monthlyAmount}
              onChange={(e) => setMonthlyAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#006c4a] dark:accent-emerald-500"
            />
            <div className="flex justify-between text-[10.5px] text-slate-400 font-mono">
              <span>Min ₹{fund.minSip || 500}</span>
              <span>₹50,000</span>
              <span>₹{calcMode === 'sip' ? '5,00,000' : '50,00,000'}</span>
            </div>
          </div>

          {/* Slider 2: Duration */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor={durationId} className="font-semibold text-slate-800 dark:text-slate-200">
                Holding Horizon
              </label>
              <div className="font-serif font-bold text-base text-slate-900 dark:text-white tabular-nums px-2.5 py-1 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                {durationYears} <span className="text-xs font-normal text-slate-500 font-sans">Years</span>
              </div>
            </div>
            <input
              id={durationId}
              type="range"
              min={1}
              max={25}
              step={1}
              value={durationYears}
              onChange={(e) => setDurationYears(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#006c4a] dark:accent-emerald-500"
            />
            <div className="flex justify-between text-[10.5px] text-slate-400 font-mono">
              <span>1 Year</span>
              <span>10 Years</span>
              <span>25 Years</span>
            </div>
          </div>

          {/* Slider 3: Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor={rateId} className="font-semibold text-slate-800 dark:text-slate-200">
                Expected Annualized Return (Historical 3Y: {fund.return3Y}%)
              </label>
              <div className="font-serif font-bold text-base text-[#006c4a] dark:text-emerald-400 tabular-nums px-2.5 py-1 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                {customReturnRate.toFixed(1)}%
              </div>
            </div>
            <input
              id={rateId}
              type="range"
              min={6.0}
              max={35.0}
              step={0.5}
              value={customReturnRate}
              onChange={(e) => setCustomReturnRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#006c4a] dark:accent-emerald-500"
            />
            <div className="flex justify-between text-[10.5px] text-slate-400 font-mono">
              <span>8% (Conservative)</span>
              <span>{fund.return3Y}% (3Y CAGR)</span>
              <span>30% (Bull Cycle)</span>
            </div>
          </div>
        </div>

        {/* Results Card (lg: 5 cols) */}
        <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">
              Projected Maturity in {fund.code}
            </div>
            <div className="font-serif text-3xl font-bold text-slate-900 dark:text-white tabular-nums mt-1">
              {formatINR(result.totalValue)}
            </div>
            <div className="text-xs text-[#006c4a] dark:text-emerald-400 font-semibold mt-0.5">
              ▲ +{result.netGainPercent}% Net Profit ({formatINR(result.estimatedReturns)})
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
              <div style={{ width: `${investedRatio}%` }} className="h-full bg-slate-800 dark:bg-slate-300" />
              <div style={{ width: `${gainRatio}%` }} className="h-full bg-[#006c4a] dark:bg-emerald-500" />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Invested: <strong className="text-slate-800 dark:text-slate-200">{formatINR(result.investedAmount)}</strong></span>
              <span>Gains: <strong className="text-[#006c4a] dark:text-emerald-400">{formatINR(result.estimatedReturns)}</strong></span>
            </div>
          </div>

          {/* Specific Direct Plan Savings Pill */}
          <div className="p-3 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60">
            <div className="flex justify-between text-xs font-semibold text-emerald-900 dark:text-emerald-200">
              <span>Saved vs Regular Plan:</span>
              <span className="tabular-nums font-bold">+{formatINR(result.alphaDifference)}</span>
            </div>
            <p className="text-[10.5px] text-emerald-700 dark:text-emerald-300 mt-0.5">
              Due to {alphaDifferential}% lower expense ratio on {fund.name}.
            </p>
          </div>

          {/* Direct CTA */}
          <button
            onClick={() =>
              openMandateModal({
                fundName: fund.name,
                monthlyAmount,
              })
            }
            className="w-full py-3 bg-[#006c4a] hover:bg-[#00573b] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Start {formatINR(monthlyAmount)}/mo SIP in this Fund</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
