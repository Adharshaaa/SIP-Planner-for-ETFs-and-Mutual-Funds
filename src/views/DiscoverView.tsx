import React, { useState, useId } from 'react';
import {
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  Percent,
  Layers,
  ArrowRight,
  Lock,
  Sparkles,
  CheckCircle,
  Briefcase,
  ChevronRight,
  Building,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CURATED_BASKETS, ALL_FUNDS } from '../data/mockData';
import { calculateSIP, calculateLumpsum, formatINR } from '../utils/calculations';
import { filterFundsByCategory, CategoryFilterTab } from '../utils/fundFiltering';

export const DiscoverView: React.FC = () => {
  const { setCurrentScreen, openMandateModal, setIsCasImportModalOpen, navigateToFund, showToast, allFunds } = useApp();

  // Unique IDs for accessibility
  const monthlyAmountId = useId();
  const durationId = useId();
  const cagrId = useId();

  // Wealth Projection Simulator State
  const [simulatorMode, setSimulatorMode] = useState<'sip' | 'lumpsum'>('sip');
  const [investmentAmount, setInvestmentAmount] = useState<number>(250000); // Default ₹2,50,000 / mo
  const [durationYears, setDurationYears] = useState<number>(10); // Default 10 Years
  const [expectedCagr, setExpectedCagr] = useState<number>(13.5); // Default 13.5%

  // Fund table category filter
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<CategoryFilterTab>('Equity Funds');

  // Compute live compounding calculations
  const projection =
    simulatorMode === 'sip'
      ? calculateSIP(investmentAmount, durationYears, expectedCagr)
      : calculateLumpsum(investmentAmount, durationYears, expectedCagr);

  const filteredFunds = filterFundsByCategory(allFunds, selectedCategoryTab);

  // Calculate percentages for the stacked visual progress bar
  const totalVal = projection.totalValue || 1;
  const investedRatio = Math.min(100, Math.max(0, (projection.investedAmount / totalVal) * 100));
  const gainRatio = Math.max(0, 100 - investedRatio);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION (CSS Grid 12-col layout) */}
      <section className="pt-6 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column (lg: 7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] xl:text-[50px] font-bold text-slate-950 dark:text-white leading-[1.15] tracking-tight">
              Disciplined Wealth Creation for the Discerning Investor
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-normal">
              Direct Mutual Funds & ETFs engineered with zero distributor commissions, institutional risk analytics, and algorithmic Step-Up SIPs for multi-generational wealth preservation.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setCurrentScreen('explore');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 bg-[#006c4a] hover:bg-[#00573b] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer group"
                aria-label="Start an SIP Today - browse mutual funds and ETFs"
              >
                <span>Start an SIP Today</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <button
                onClick={() => {
                  const basketsSection = document.getElementById('curated-baskets');
                  basketsSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 text-slate-900 dark:text-slate-100 font-semibold text-xs sm:text-sm rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Curated Baskets</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Paperless KYC trust badge */}
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 pt-1">
              <CheckCircle className="w-4 h-4 text-[#006c4a] dark:text-emerald-400 shrink-0" />
              <span className="font-medium">100% Paperless KYC in under 3 minutes with Aadhaar + PAN</span>
            </div>
          </div>

          {/* Right Column: Compound Terminal Engine Card (lg: 5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-[#0e1726] rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm relative overflow-hidden space-y-5">
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">₹</span>
                    <span className="uppercase tracking-wider text-[11px]">COMPOUND TERMINAL ENGINE</span>
                  </div>
                  <div className="font-serif font-bold text-lg text-slate-950 dark:text-white mt-1">
                    Direct Advantage +1.52% YoY
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                  Alpha Active
                </span>
              </div>

              {/* 10-Yr Corpus Projected */}
              <div className="space-y-3 pt-1">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">10-Yr Corpus Projected</span>
                  <span className="text-[#006c4a] dark:text-emerald-400 font-bold text-xs">Extra ₹14.8 Lakhs Saved</span>
                </div>

                {/* Comparison Horizontal Bars */}
                <div className="space-y-2">
                  {/* Cautilya Direct Bar */}
                  <div className="space-y-1">
                    <div className="h-8 bg-slate-950 dark:bg-emerald-900/60 rounded-md px-3 flex items-center justify-between text-white text-xs font-semibold">
                      <span>Cautilya Direct: ₹70.15 Lakhs</span>
                      <span className="text-emerald-400 text-[11px]">0% Fee</span>
                    </div>
                  </div>

                  {/* Regular Plan Bar */}
                  <div className="space-y-1">
                    <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-md px-3 flex items-center justify-between text-slate-600 dark:text-slate-300 text-xs font-medium w-[80%]">
                      <span>Regular Plan: ₹55.35 Lakhs</span>
                      <span className="text-rose-500 text-[10px]">-1.52% Drag</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom 2 Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Distribution Fee</div>
                  <div className="font-serif text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                    ₹0 Forever
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Client Retention</div>
                  <div className="font-serif text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                    99.4% HNI
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST METRIC BAND (4 Columns CSS Grid) */}
      <section className="py-6 border-y border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Capital Supervised
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white mt-1 tabular-nums">
              ₹4,200+ Cr
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#006c4a] dark:text-emerald-400 font-semibold mt-0.5">
              <TrendingUp className="w-3 h-3" /> Across 85,000+ Investors
            </div>
          </div>

          <div>
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Commission Model
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#006c4a] dark:text-emerald-400 mt-1 tabular-nums">
              0.00% Zero
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Direct mutual funds only
            </div>
          </div>

          <div>
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Regulatory Oversight
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white mt-1">
              SEBI & AMFI
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Tier-1 bank-grade custody
            </div>
          </div>

          <div>
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Platform Trust Index
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white mt-1 tabular-nums">
              4.92 / 5.0
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#006c4a] dark:text-emerald-400 font-semibold mt-0.5">
              <CheckCircle className="w-3 h-3" /> Verified User Reviews
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE WEALTH PROJECTION SIMULATOR */}
      <section id="wealth-simulator" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Institutional Modeling Tools
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white mt-1">
              Interactive Wealth Projection Simulator
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Model the exponential compounding curve of disciplined systematic commitments.
            </p>
          </div>

          {/* Mode Switcher: Monthly SIP vs One-Time Lumpsum */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700/80 self-start sm:self-auto">
            <button
              onClick={() => {
                setSimulatorMode('sip');
                if (investmentAmount > 1000000) setInvestmentAmount(250000);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                simulatorMode === 'sip'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Monthly SIP
            </button>
            <button
              onClick={() => {
                setSimulatorMode('lumpsum');
                if (investmentAmount < 100000) setInvestmentAmount(1000000);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                simulatorMode === 'lumpsum'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              One-Time Lumpsum
            </button>
          </div>
        </div>

        {/* Simulator Grid (Controls on Left, Output on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Controls Panel (lg: 7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#0e1726] rounded-2xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-7">
            {/* Slider 1: Investment Amount */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor={monthlyAmountId} className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                  {simulatorMode === 'sip' ? 'Monthly Investment Amount' : 'Lumpsum Investment Amount'}
                </label>
                <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-serif font-bold text-base text-slate-900 dark:text-white tabular-nums">
                  {formatINR(investmentAmount)}
                </div>
              </div>

              <input
                id={monthlyAmountId}
                type="range"
                min={simulatorMode === 'sip' ? 1000 : 25000}
                max={simulatorMode === 'sip' ? 1000000 : 20000000}
                step={simulatorMode === 'sip' ? 1000 : 25000}
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#006c4a] dark:accent-emerald-500"
              />

              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>{simulatorMode === 'sip' ? '₹1,000 / mo' : '₹25,000'}</span>
                <span>{simulatorMode === 'sip' ? '₹1,00,000 / mo' : '₹50,00,000'}</span>
                <span>{simulatorMode === 'sip' ? '₹2,50,000 / mo' : '₹2,00,00,000'}</span>
              </div>
            </div>

            {/* Slider 2: Duration */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor={durationId} className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                  Investment Duration
                </label>
                <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-serif font-bold text-base text-slate-900 dark:text-white tabular-nums">
                  {durationYears} <span className="text-xs font-normal text-slate-500 font-sans">Years</span>
                </div>
              </div>

              <input
                id={durationId}
                type="range"
                min={1}
                max={30}
                step={1}
                value={durationYears}
                onChange={(e) => setDurationYears(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#006c4a] dark:accent-emerald-500"
              />

              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>1 Year</span>
                <span>15 Years</span>
                <span>30 Years</span>
              </div>
            </div>

            {/* Slider 3: Expected CAGR */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor={cagrId} className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                  Expected Annual Rate of Return (CAGR)
                </label>
                <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-serif font-bold text-base text-[#006c4a] dark:text-emerald-400 tabular-nums">
                  {expectedCagr.toFixed(1)}%
                </div>
              </div>

              <input
                id={cagrId}
                type="range"
                min={6.0}
                max={25.0}
                step={0.5}
                value={expectedCagr}
                onChange={(e) => setExpectedCagr(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#006c4a] dark:accent-emerald-500"
              />

              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>8.0% (Conservative)</span>
                <span>13.5% (Equity Balanced)</span>
                <span>24.0% (Aggressive)</span>
              </div>
            </div>

            {/* Footnote */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
              Note: Projections assume monthly compounding. Mutual funds are subject to market risks. Past returns are not indicative of future returns.
            </div>
          </div>

          {/* Result Output Card (lg: 5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-[#0e1726] rounded-2xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  ESTIMATED WEALTH OUTCOME
                </span>
                <span className="text-[11px] font-bold text-[#006c4a] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800/60">
                  {durationYears}-Yr Compounded
                </span>
              </div>

              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Projected Maturity Value</div>
                <div className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold text-slate-950 dark:text-white mt-1 tabular-nums tracking-tight">
                  {formatINR(projection.totalValue)}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#006c4a] dark:text-emerald-400 font-semibold mt-1">
                  <span>▲</span>
                  <span>+{projection.netGainPercent}% Total Net Gains over Invested Capital</span>
                </div>
              </div>

              {/* Visual Stacked Progress Bar */}
              <div className="space-y-2 pt-2">
                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${investedRatio}%` }}
                    className="h-full bg-slate-900 dark:bg-slate-300 transition-all duration-300"
                    title={`Invested: ${formatINR(projection.investedAmount)}`}
                  />
                  <div
                    style={{ width: `${gainRatio}%` }}
                    className="h-full bg-[#006c4a] dark:bg-emerald-500 transition-all duration-300"
                    title={`Gain: ${formatINR(projection.estimatedReturns)}`}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-900 dark:bg-slate-300"></span>
                    <span>Invested: <strong className="text-slate-900 dark:text-white tabular-nums">{formatINR(projection.investedAmount)}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#006c4a] dark:bg-emerald-500"></span>
                    <span>Gain: <strong className="text-slate-900 dark:text-white tabular-nums">{formatINR(projection.estimatedReturns)}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Execute Mandate CTA */}
            <div className="space-y-2 pt-4">
              <button
                onClick={() =>
                  openMandateModal({
                    fundName: `Disciplined Systematic ${simulatorMode.toUpperCase()}`,
                    monthlyAmount: investmentAmount,
                  })
                }
                className="w-full py-4 px-6 bg-[#006c4a] hover:bg-[#00573b] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Execute {formatINR(investmentAmount)} {simulatorMode === 'sip' ? 'SIP' : 'Lumpsum'} Mandate</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <div className="text-center text-[10.5px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>NPCI Auto-Debit E-Mandate • Pause or Cancel Anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CAUTILYA CURATED BASKETS */}
      <section id="curated-baskets" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Thematic Strategies
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white mt-1">
              Cautilya Curated Baskets
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Expert-balanced multi-fund baskets structured around distinct risk tolerances and time horizons.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Rebalanced Quarterly by SEBI Research Analysts
          </span>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {CURATED_BASKETS.map((basket) => (
            <div
              key={basket.id}
              className="bg-white dark:bg-[#0e1726] rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="space-y-3">
                {/* Badges */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {basket.tag}
                  </span>
                  {basket.badge && (
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800/60">
                      {basket.badge}
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-serif font-bold text-base text-slate-950 dark:text-white">
                    {basket.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {basket.description}
                  </p>
                </div>

                {/* CAGR & Trend Sparkline */}
                <div className="pt-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] text-slate-400">{basket.cagrPeriod}</span>
                    <span className="font-serif font-bold text-lg text-[#006c4a] dark:text-emerald-400 tabular-nums">
                      +{basket.cagr}%
                    </span>
                  </div>

                  {/* SVG Sparkline Curve */}
                  <div className="h-10 w-full pt-1">
                    <svg viewBox="0 0 120 30" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id={`grad-${basket.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#006c4a" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#006c4a" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0,26 Q 30,22 60,16 T 120,4"
                        fill="none"
                        stroke="#006c4a"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Risk & Min SIP */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span>Risk: <strong className="text-slate-800 dark:text-slate-200">{basket.risk}</strong></span>
                  <span>Min SIP: <strong className="text-slate-800 dark:text-slate-200 font-mono">₹{basket.minSip}/mo</strong></span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() =>
                  openMandateModal({
                    fundName: basket.title,
                    monthlyAmount: basket.minSip,
                    isBasket: true,
                  })
                }
                className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Quick Invest</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TOP RANKED FUNDS & ETFS OF THE MONTH */}
      <section className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Quantitative Screening
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white mt-1">
              Top Ranked Funds & ETFs of the Month
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Filtered by Sharpe Ratio, Rolling 3Y Alpha, and lowest Expense Ratio in class.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
            {(['Equity Funds', 'Index ETFs', 'Hybrid Allocation', 'Debt & Liquid'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedCategoryTab(tab)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  selectedCategoryTab === tab
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Table */}
        <div className="bg-white dark:bg-[#0e1726] rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-[#f8fafc] dark:bg-[#09111c] text-[10.5px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-4 sm:px-6">Scheme & AMC Name</th>
                  <th className="py-3.5 px-3">Category</th>
                  <th className="py-3.5 px-3">AUM (₹ Cr)</th>
                  <th className="py-3.5 px-3">1Y Return</th>
                  <th className="py-3.5 px-3">3Y CAGR</th>
                  <th className="py-3.5 px-3">5Y CAGR</th>
                  <th className="py-3.5 px-3">Fiduciary Risk</th>
                  <th className="py-3.5 px-4 text-right">Invest</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredFunds.map((fund) => (
                  <tr
                    key={fund.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => navigateToFund(fund.id)}
                  >
                    {/* Scheme Name & Code */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        {fund.rank && (
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                            fund.rank <= 3
                              ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-700'
                              : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                          }`}>
                            #{fund.rank}
                          </span>
                        )}
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300 shrink-0">
                          {fund.code}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white group-hover:text-[#006c4a] dark:group-hover:text-emerald-400 transition-colors">
                            {fund.name}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {fund.amc} • TER {fund.ter}%
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-3 text-slate-600 dark:text-slate-300 font-medium">
                      {fund.category}
                    </td>

                    {/* AUM */}
                    <td className="py-4 px-3 tabular-nums font-semibold text-slate-800 dark:text-slate-200">
                      ₹{fund.aum.toLocaleString('en-IN')} Cr
                    </td>

                    {/* 1Y Return */}
                    <td className="py-4 px-3 tabular-nums font-semibold text-[#006c4a] dark:text-emerald-400">
                      +{fund.return1Y}%
                    </td>

                    {/* 3Y CAGR */}
                    <td className="py-4 px-3 tabular-nums font-semibold text-[#006c4a] dark:text-emerald-400">
                      +{fund.return3Y}%
                    </td>

                    {/* 5Y CAGR */}
                    <td className="py-4 px-3 tabular-nums font-semibold text-[#006c4a] dark:text-emerald-400">
                      +{fund.return5Y}%
                    </td>

                    {/* Risk Badge */}
                    <td className="py-4 px-3">
                      <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {fund.riskRating}
                      </span>
                    </td>

                    {/* Invest Button */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openMandateModal({
                            fundName: fund.name,
                            monthlyAmount: fund.minSip,
                          });
                        }}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                          fund.actionLabel.includes('Deploy')
                            ? 'bg-slate-950 text-white hover:bg-slate-800'
                            : 'bg-[#006c4a] hover:bg-[#00573b] dark:bg-emerald-600 text-white'
                        }`}
                      >
                        {fund.actionLabel}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 6. THE CAUTILYA STANDARD VS. TRADITIONAL BANKS */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Fiduciary Advantage
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
            The Cautilya Standard vs. Traditional Banks
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Why sophisticated capital allocates through Cautilya Direct over legacy banking networks.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-[#0e1726] rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#006c4a] dark:text-emerald-400 flex items-center justify-center">
                <Percent className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-slate-950 dark:text-white">
                Direct Plan Alpha (+1.5% Extra)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Traditional bank brokers pocket up to 1.5% of your total corpus every year as trail commission. Cautilya offers 100% Direct Mutual Funds with zero trail fees.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-[#006c4a] dark:text-emerald-400">
              Extra ₹32.4 Lakhs on 20Y SIP
            </div>
          </div>

          <div className="bg-white dark:bg-[#0e1726] rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#006c4a] dark:text-emerald-400 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-slate-950 dark:text-white">
                Automated Tax-Loss Harvesting
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Systematic rebalancing algorithms that automatically offset short-term and long-term capital gains across asset classes to legally minimize annual tax liability.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Quarterly Ledger Optimization
            </div>
          </div>

          <div className="bg-white dark:bg-[#0e1726] rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#006c4a] dark:text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-slate-950 dark:text-white">
                Algorithmic Step-Up SIPs
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Automatically increase your monthly SIP contribution by 10% or 15% each year aligned with your annual salary increments to double your terminal corpus.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Up to 2.1x Larger Corpus
            </div>
          </div>

          <div className="bg-white dark:bg-[#0e1726] rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#006c4a] dark:text-emerald-400 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-slate-950 dark:text-white">
                Dedicated Wealth Desk
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                No robo-chatbots or sales targets. Access Chartered Financial Analysts (CFA) and SEBI-registered advisors committed to transparent fiduciary guidance.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Fiduciary Conflict-Free Advisory
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAST-TRACK ONBOARDING CALLOUT BANNER (Dark card with emerald CTA) */}
      <section>
        <div className="bg-[#050b14] dark:bg-[#03070d] text-white rounded-3xl p-8 sm:p-12 border border-slate-800 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content (lg: 8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                FAST-TRACK ONBOARDING
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                Build Your Generational Corpus with Cautilya Capital
              </h2>
              <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                Seamlessly import your external CAS portfolio from CAMS / KFintech and activate 0% commission direct plans within minutes.
              </p>

              {/* Checks */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Free Portfolio Overlap Audit
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Zero Account Maintenance Charges
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Instant Bank Mandate Setup
                </span>
              </div>
            </div>

            {/* Right Buttons (lg: 4 cols) */}
            <div className="lg:col-span-4 space-y-3">
              <button
                onClick={() =>
                  openMandateModal({
                    fundName: 'Cautilya Wealth Account',
                    monthlyAmount: 250000,
                  })
                }
                className="w-full py-4 px-6 bg-[#006c4a] hover:bg-[#00573b] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg transition-colors text-center cursor-pointer"
              >
                Open Free Investment Account
              </button>

              <button
                onClick={() => setIsCasImportModalOpen(true)}
                className="w-full py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-xs sm:text-sm rounded-xl border border-slate-700 transition-colors text-center cursor-pointer"
              >
                Import External CAS Statement
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
