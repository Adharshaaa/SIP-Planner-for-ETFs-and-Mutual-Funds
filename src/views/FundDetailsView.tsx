import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, ShieldCheck, Award, Info, Lock, ArrowRight, CheckCircle2, Building, Percent } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/calculations';
import { FundSpecificCalculator } from '../components/FundSpecificCalculator';

export const FundDetailsView: React.FC = () => {
  const { selectedFund, setCurrentScreen, openMandateModal } = useApp();
  const [investMode, setInvestMode] = useState<'sip' | 'lumpsum'>('sip');
  const [amount, setAmount] = useState<number>(selectedFund.minSip || 1000);
  const [isStepUp, setIsStepUp] = useState<boolean>(true);

  const presets = investMode === 'sip' ? [1000, 5000, 10000, 25000, 50000] : [5000, 25000, 50000, 100000, 500000];

  return (
    <div className="space-y-8 pb-16">
      {/* Back Button */}
      <button
        onClick={() => setCurrentScreen('explore')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Schemes</span>
      </button>

      {/* Main Grid: Left 8 cols details, Right 4 cols investment slip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (lg: 8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header Title & Badges */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {selectedFund.rank && (
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  Overall Rank #{selectedFund.rank}
                </span>
              )}
              {selectedFund.score && (
                <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 text-[#006c4a] dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                  Quantitative Score: {selectedFund.score}/100
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-[#006c4a] dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                100% Direct Plan (0% Commission)
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {selectedFund.category}
              </span>
              {selectedFund.crisilRating && (
                <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60 flex items-center gap-1">
                  ★ CRISIL {selectedFund.crisilRating}-Star
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-950 dark:text-white">
              {selectedFund.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span>Managed by <strong>{selectedFund.amc}</strong></span>
              <span>·</span>
              <span>Benchmark: <strong>{selectedFund.benchmark || 'NIFTY 500 TRI'}</strong></span>
              <span>·</span>
              <span>NAV: <strong>₹{selectedFund.nav || '84.62'}</strong> ({selectedFund.navDate || '26 Sep 2026'})</span>
            </div>
          </div>

          {/* Key Metrics Matrix (6-metric grid) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-white dark:bg-[#0e1726] p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <div>
              <div className="text-[11px] text-slate-400 font-semibold uppercase">3-Year CAGR</div>
              <div className="font-serif text-2xl font-bold text-[#006c4a] dark:text-emerald-400 tabular-nums mt-1">
                +{selectedFund.return3Y}%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Annualized rolling return</div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400 font-semibold uppercase">Direct Plan TER</div>
              <div className="font-serif text-2xl font-bold text-slate-900 dark:text-white tabular-nums mt-1">
                {selectedFund.ter}%
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                Saves {( (selectedFund.regularTer || 1.34) - selectedFund.ter ).toFixed(2)}% vs Regular
              </div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400 font-semibold uppercase">Scheme AUM</div>
              <div className="font-serif text-2xl font-bold text-slate-900 dark:text-white tabular-nums mt-1">
                {formatINR(selectedFund.aum * 10000000, true)}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Assets under stewardship</div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400 font-semibold uppercase">5-Year CAGR</div>
              <div className="font-serif text-2xl font-bold text-slate-900 dark:text-white tabular-nums mt-1">
                +{selectedFund.return5Y}%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Long-term compounder</div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400 font-semibold uppercase">Rolling Sharpe Ratio</div>
              <div className="font-serif text-2xl font-bold text-slate-900 dark:text-white tabular-nums mt-1">
                {selectedFund.sharpeRatio || '1.48'}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Risk-adjusted return quality</div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400 font-semibold uppercase">Rolling Alpha</div>
              <div className="font-serif text-2xl font-bold text-[#006c4a] dark:text-emerald-400 tabular-nums mt-1">
                +{selectedFund.alpha || '5.4'}%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Outperformance over index</div>
            </div>
          </div>

          {/* Advanced Risk & Volatility Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60 font-mono text-xs">
            <div>
              <div className="text-[10px] uppercase text-slate-400 font-sans font-semibold">Sortino Ratio</div>
              <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {selectedFund.sortinoRatio ?? '2.10'}
              </div>
              <div className="text-[9.5px] text-slate-400 font-sans">Downside risk protection</div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-slate-400 font-sans font-semibold">Beta Volatility</div>
              <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {selectedFund.beta ?? '0.85'}
              </div>
              <div className="text-[9.5px] text-slate-400 font-sans">Relative to benchmark</div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-slate-400 font-sans font-semibold">Std. Deviation</div>
              <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {selectedFund.standardDeviation ? `${selectedFund.standardDeviation}%` : '13.5%'}
              </div>
              <div className="text-[9.5px] text-slate-400 font-sans">Annualized volatility</div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-slate-400 font-sans font-semibold">Max Drawdown</div>
              <div className="text-base font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                {selectedFund.maxDrawdown ? `${selectedFund.maxDrawdown}%` : '-12.5%'}
              </div>
              <div className="text-[9.5px] text-slate-400 font-sans">Trough from peak</div>
            </div>
          </div>

          {/* Historical NAV Performance Trajectory Curve */}
          <div className="bg-white dark:bg-[#0e1726] p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-950 dark:text-white">
                  Historical NAV Trajectory
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Performance comparison: Cautilya Direct Plan vs Regular Plan with intermediary fee drag.
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded">
                +184.6% Since Inception
              </span>
            </div>

            {/* SVG Visual Chart */}
            <div className="h-48 w-full pt-4">
              <svg viewBox="0 0 500 160" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="navGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#006c4a" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#006c4a" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid guidelines */}
                <line x1="0" y1="40" x2="500" y2="40" stroke="currentColor" strokeDasharray="3 3" className="text-slate-200 dark:text-slate-800" />
                <line x1="0" y1="80" x2="500" y2="80" stroke="currentColor" strokeDasharray="3 3" className="text-slate-200 dark:text-slate-800" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="currentColor" strokeDasharray="3 3" className="text-slate-200 dark:text-slate-800" />

                {/* Shaded Area under Direct Line */}
                <path
                  d="M 0,140 Q 80,125 160,110 T 320,55 T 500,20 L 500,150 L 0,150 Z"
                  fill="url(#navGrad)"
                />

                {/* Regular Plan Line (lower line with commission drag) */}
                <path
                  d="M 0,140 Q 80,132 160,122 T 320,80 T 500,50"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Direct Plan Line (emerald) */}
                <path
                  d="M 0,140 Q 80,125 160,110 T 320,55 T 500,20"
                  fill="none"
                  stroke="#006c4a"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* End Point dot */}
                <circle cx="500" cy="20" r="5" fill="#006c4a" />
              </svg>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 font-medium text-slate-900 dark:text-white">
                  <span className="w-3 h-1 bg-[#006c4a] rounded"></span> Cautilya Direct Growth
                </span>
                <span className="flex items-center gap-1.5 font-medium text-slate-500">
                  <span className="w-3 h-1 bg-slate-400 rounded"></span> Traditional Regular Plan
                </span>
              </div>
              <span className="font-mono text-[11px]">Trailing 5Y Data</span>
            </div>
          </div>

          {/* Dedicated Fund-Specific SIP & Compounding Calculator */}
          <FundSpecificCalculator fund={selectedFund} />

          {/* Top 5 Portfolio Holdings */}
          {selectedFund.topHoldings && (
            <div className="bg-white dark:bg-[#0e1726] p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-lg text-slate-950 dark:text-white">
                Top Portfolio Holdings
              </h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {selectedFund.topHoldings.map((h, i) => (
                  <div key={i} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{h.company}</div>
                      <div className="text-[11px] text-slate-400">{h.sector}</div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                        {h.weight}%
                      </span>
                      <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
                        <div
                          style={{ width: `${(h.weight / 12) * 100}%` }}
                          className="h-full bg-emerald-600 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sector Allocation & Fund Manager Profile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sector allocation */}
            {selectedFund.sectorAllocation && (
              <div className="bg-white dark:bg-[#0e1726] p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
                <h4 className="font-serif font-bold text-base text-slate-950 dark:text-white">
                  Sector Allocation
                </h4>
                <div className="space-y-2 text-xs">
                  {selectedFund.sectorAllocation.map((sec, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-slate-700 dark:text-slate-300">
                        <span>{sec.sector}</span>
                        <span className="font-mono font-semibold">{sec.weight}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${sec.weight}%` }}
                          className="h-full bg-[#006c4a] dark:bg-emerald-500 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fund Manager & Exit Load */}
            <div className="bg-white dark:bg-[#0e1726] p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
              <div>
                <h4 className="font-serif font-bold text-base text-slate-950 dark:text-white">
                  Fund Manager
                </h4>
                {selectedFund.fundManager && (
                  <div className="mt-2 text-xs space-y-1">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {selectedFund.fundManager.name}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400">
                      {selectedFund.fundManager.experience}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {selectedFund.fundManager.qualification}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="text-xs font-semibold text-slate-900 dark:text-white mb-1">
                  Statutory Exit Load & Tax
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {selectedFund.exitLoad || 'Nil exit load after statutory holding period.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Direct Investment Slip (lg: 4 cols) */}
        <div className="lg:col-span-4 sticky top-28 space-y-4">
          <div className="bg-white dark:bg-[#0e1726] p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-md space-y-5">
            {/* Header */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Direct Investment Desk
              </div>
              <h3 className="font-serif font-bold text-xl text-slate-950 dark:text-white mt-0.5">
                Place Direct Order
              </h3>
            </div>

            {/* Mode: SIP vs Lumpsum */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <button
                onClick={() => {
                  setInvestMode('sip');
                  setAmount(1000);
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  investMode === 'sip'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Monthly SIP
              </button>
              <button
                onClick={() => {
                  setInvestMode('lumpsum');
                  setAmount(5000);
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  investMode === 'lumpsum'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                One-Time Lumpsum
              </button>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {investMode === 'sip' ? 'Monthly Commitment' : 'Investment Amount'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Math.max(100, Number(e.target.value)))}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 tabular-nums"
                />
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {presets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset)}
                    className={`px-2.5 py-1 text-[11px] rounded-lg border font-medium transition-colors ${
                      amount === preset
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-[#006c4a] dark:text-emerald-400 font-bold'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {formatINR(preset, true)}
                  </button>
                ))}
              </div>
            </div>

            {/* Step-Up Option for SIP */}
            {investMode === 'sip' && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Annual Step-Up (+10%)</div>
                  <div className="text-[10px] text-slate-500">Increases corpus by up to 2.1x</div>
                </div>
                <input
                  type="checkbox"
                  checked={isStepUp}
                  onChange={(e) => setIsStepUp(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 cursor-pointer"
                />
              </div>
            )}

            {/* Action CTA Button */}
            <button
              onClick={() =>
                openMandateModal({
                  fundName: selectedFund.name,
                  monthlyAmount: amount,
                })
              }
              className="w-full py-3.5 bg-[#006c4a] hover:bg-[#00573b] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Authorize {formatINR(amount)} {investMode === 'sip' ? 'SIP' : 'Investment'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Fiduciary Notice */}
            <div className="text-center text-[10.5px] text-slate-400 flex items-center justify-center gap-1.5">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>AMFI ARN-248190 • 0% Broker Commission</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
