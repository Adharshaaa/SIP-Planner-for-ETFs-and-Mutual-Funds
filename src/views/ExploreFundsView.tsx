import React, { useState } from 'react';
import { Search, ArrowUpDown, Check, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Fund } from '../types';
import { formatINR } from '../utils/calculations';
import { searchFunds, sortFunds, filterFundsByCategory } from '../utils/fundFiltering';

export const ExploreFundsView: React.FC = () => {
  const { navigateToFund, openMandateModal, allFunds } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'rank' | 'score' | 'aum' | 'return1Y' | 'return3Y' | 'return5Y' | 'ter' | 'sharpeRatio'>('rank');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [comparedFundIds, setComparedFundIds] = useState<string[]>([]);

  // Filter & Search
  let funds = filterFundsByCategory(allFunds, selectedCategory);
  if (searchQuery.trim()) {
    funds = searchFunds(funds, searchQuery);
  }
  funds = sortFunds(funds, sortBy, sortDirection);

  const toggleCompare = (fundId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (comparedFundIds.includes(fundId)) {
      setComparedFundIds(comparedFundIds.filter((id) => id !== fundId));
    } else {
      if (comparedFundIds.length >= 3) {
        return;
      }
      setComparedFundIds([...comparedFundIds, fundId]);
    }
  };

  const comparedFunds = allFunds.filter((f) => comparedFundIds.includes(f.id));

  const filterTabs = [
    'All',
    'Top Ranked',
    'Mutual Funds',
    'ETFs',
    'Flexi Cap Equity',
    'Index ETF',
    'Large & Mid Cap',
    'Small Cap',
    'Aggressive Hybrid',
    'Overnight & Liquid',
    'ELSS Tax Saver',
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header - AMFI/SEBI removed as requested */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" />
            <span>Institutional Quantitative Rankings</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-950 dark:text-white">
            Explore Funds & ETFs
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Ranked based on verified historical returns, risk-adjusted alpha (Sharpe & Sortino), maximum drawdown resistance, and expense ratio efficiency.
          </p>
        </div>
      </div>

      {/* Screener Controls */}
      <div className="bg-white dark:bg-[#0e1726] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Box (md: 6 cols) */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scheme, ETF ticker, AMC, index, or benchmark..."
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Sort By Dropdown (md: 4 cols) */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 whitespace-nowrap font-medium">Rank & Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setSortBy(val);
                  setSortDirection(val === 'rank' || val === 'ter' ? 'asc' : 'desc');
                }}
                className="w-full py-2 px-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none"
              >
                <option value="rank">Overall Rank (#1 to #14)</option>
                <option value="score">Institutional Score (Highest)</option>
                <option value="return3Y">3Y CAGR (Highest)</option>
                <option value="return5Y">5Y CAGR (Highest)</option>
                <option value="return1Y">1Y Return (Highest)</option>
                <option value="sharpeRatio">Sharpe Ratio (Best Risk-Adjusted)</option>
                <option value="aum">AUM (Largest Corpus)</option>
                <option value="ter">Direct Expense Ratio (Lowest TER)</option>
              </select>
            </div>
          </div>

          {/* Direction toggle (md: 2 cols) */}
          <div className="md:col-span-2 flex justify-end">
            <button
              onClick={() => setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{sortDirection === 'desc' ? 'Desc' : 'Asc'}</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-slate-100 dark:border-slate-800">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedCategory(tab)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === tab
                  ? 'bg-slate-900 dark:bg-emerald-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Compare Tray if funds selected */}
      {comparedFunds.length > 0 && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
              Comparing {comparedFunds.length}/3 Schemes:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {comparedFunds.map((f) => (
                <span
                  key={f.id}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-white dark:bg-slate-900 rounded-lg border border-emerald-300 dark:border-emerald-700 font-medium text-slate-900 dark:text-white"
                >
                  <span className="font-bold text-amber-600 dark:text-amber-400">#{f.rank}</span>
                  {f.code}
                  <button onClick={(e) => toggleCompare(f.id, e)} className="text-slate-400 hover:text-slate-600 ml-1">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => setComparedFundIds([])}
            className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
          >
            Clear Comparison
          </button>
        </div>
      )}

      {/* Fund Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {funds.map((fund) => {
          const isComparing = comparedFundIds.includes(fund.id);
          const isTopTier = fund.rank && fund.rank <= 3;
          return (
            <div
              key={fund.id}
              onClick={() => navigateToFund(fund.id)}
              className="bg-white dark:bg-[#0e1726] rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-600 dark:hover:border-emerald-500 transition-all cursor-pointer group relative overflow-hidden"
            >
              {/* Top Accent Line for Top 3 Ranked */}
              {isTopTier && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-emerald-500 to-amber-500" />
              )}

              <div className="space-y-3">
                {/* Header: Rank, Code, Category & Compare */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* Rank Badge */}
                    {fund.rank && (
                      <span className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold border ${
                        fund.rank === 1
                          ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-700'
                          : fund.rank <= 3
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700'
                          : 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                      }`}>
                        #{fund.rank}
                      </span>
                    )}

                    <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold text-xs shrink-0">
                      {fund.code}
                    </span>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {fund.assetType || (fund.category === 'Index ETF' ? 'ETF' : 'Mutual Fund')}
                        </span>
                        {fund.score && (
                          <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            Score {fund.score}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {fund.category}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => toggleCompare(fund.id, e)}
                    className={`text-[11px] px-2 py-1 rounded border font-medium flex items-center gap-1 transition-colors shrink-0 ${
                      isComparing
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-700 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Check className={`w-3 h-3 ${isComparing ? 'opacity-100' : 'opacity-0'}`} />
                    <span>Compare</span>
                  </button>
                </div>

                {/* Scheme title */}
                <div>
                  <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white group-hover:text-[#006c4a] dark:group-hover:text-emerald-400 transition-colors">
                    {fund.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {fund.amc} • Benchmark: {fund.benchmark}
                  </p>
                </div>

                {/* Historical Return Matrix */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 text-center">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">3Y CAGR</div>
                    <div className="font-serif text-sm font-bold text-[#006c4a] dark:text-emerald-400 tabular-nums mt-0.5">
                      +{fund.return3Y}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">5Y CAGR</div>
                    <div className="font-serif text-sm font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
                      +{fund.return5Y}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">1Y Return</div>
                    <div className="font-serif text-sm font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
                      +{fund.return1Y}%
                    </div>
                  </div>
                </div>

                {/* Risk & Analytics Metrics Bar */}
                <div className="grid grid-cols-3 gap-1.5 text-[10.5px] px-1 py-1 text-slate-600 dark:text-slate-400 font-mono">
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase text-slate-400">Sharpe Ratio</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{fund.sharpeRatio ?? 'N/A'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase text-slate-400">Sortino</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{fund.sortinoRatio ?? 'N/A'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase text-slate-400">Max DD</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">{fund.maxDrawdown ? `${fund.maxDrawdown}%` : 'N/A'}</span>
                  </div>
                </div>

                {/* Expense & Fiduciary Details */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                  <span>TER: <strong className="text-slate-900 dark:text-white font-mono">{fund.ter}%</strong></span>
                  <span>AUM: <strong className="text-slate-700 dark:text-slate-300 font-mono">{formatINR(fund.aum * 10000000, true).replace('₹ ', '₹')}</strong></span>
                  <span>Min SIP: <strong className="text-slate-700 dark:text-slate-300 font-mono">₹{fund.minSip}</strong></span>
                </div>
              </div>

              {/* Action row */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openMandateModal({
                      fundName: fund.name,
                      monthlyAmount: fund.minSip,
                    });
                  }}
                  className="flex-1 py-2 px-3 bg-[#006c4a] hover:bg-[#00573b] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition-colors text-center cursor-pointer shadow-xs"
                >
                  {fund.actionLabel}
                </button>
                <button
                  onClick={() => navigateToFund(fund.id)}
                  className="py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Tear Sheet
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
