import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Calendar,
  AlertCircle,
  ArrowUpRight,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Download,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/calculations';
import { calculatePortfolioSummary } from '../utils/fundFiltering';

export const PortfolioDashboardView: React.FC = () => {
  const { holdings, userProfile, openMandateModal, setIsCasImportModalOpen, showToast, navigateToFund } = useApp();
  const [activeSipPausedMap, setActiveSipPausedMap] = useState<Record<string, boolean>>({});

  const summary = calculatePortfolioSummary(holdings);

  const togglePauseSip = (id: string, name: string) => {
    const isCurrentlyPaused = !!activeSipPausedMap[id];
    setActiveSipPausedMap({
      ...activeSipPausedMap,
      [id]: !isCurrentlyPaused,
    });
    showToast(`SIP for ${name} ${isCurrentlyPaused ? 'Resumed' : 'Paused successfully'}.`);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Private Wealth Custody • Client Code: VS-9840
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-950 dark:text-white mt-1">
            {userProfile.name}'s Portfolio
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Institutional asset allocation with 100% Direct Plans and active tax-harvesting optimization.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCasImportModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors flex items-center gap-1.5"
          >
            <span>Audit External CAS</span>
          </button>
          <button
            onClick={() => showToast('Quarterly Portfolio Valuation & Capital Gains report downloaded')}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Tax Report</span>
          </button>
        </div>
      </div>

      {/* Main Wealth Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-[#0e1726] p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-1">
          <div className="text-[11px] text-slate-400 font-semibold uppercase">Current Valuation</div>
          <div className="font-serif text-3xl font-bold text-slate-950 dark:text-white tabular-nums tracking-tight">
            {formatINR(summary.totalCurrentValue)}
          </div>
          <div className="flex items-center gap-1 text-xs text-[#006c4a] dark:text-emerald-400 font-semibold pt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>All-Time XIRR: +{summary.annualizedXirr}%</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0e1726] p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-1">
          <div className="text-[11px] text-slate-400 font-semibold uppercase">Total Invested Capital</div>
          <div className="font-serif text-3xl font-bold text-slate-950 dark:text-white tabular-nums tracking-tight">
            {formatINR(summary.totalInvested)}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 pt-1">
            Disciplined systematic inflows
          </div>
        </div>

        <div className="bg-white dark:bg-[#0e1726] p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-1">
          <div className="text-[11px] text-slate-400 font-semibold uppercase">Net Unrealized Gains</div>
          <div className="font-serif text-3xl font-bold text-[#006c4a] dark:text-emerald-400 tabular-nums tracking-tight">
            +{formatINR(summary.totalProfit)}
          </div>
          <div className="text-xs text-[#006c4a] dark:text-emerald-400 font-semibold pt-1">
            ▲ +{summary.totalProfitPercent}% Net Absolute Gain
          </div>
        </div>

        <div className="bg-white dark:bg-[#0e1726] p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-1">
          <div className="text-[11px] text-slate-400 font-semibold uppercase">Annual Direct Fee Savings</div>
          <div className="font-serif text-3xl font-bold text-slate-950 dark:text-white tabular-nums tracking-tight">
            ₹ 2,74,500
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-1">
            0% trail fee paid to intermediaries
          </div>
        </div>
      </div>

      {/* 2-Column: Asset Allocation Breakdown & Tax Loss Harvesting Opportunity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Asset Allocation (lg: 7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0e1726] p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-slate-950 dark:text-white">
              Target Asset Allocation
            </h3>
            <span className="text-xs text-[#006c4a] dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
              Optimal Rebalance
            </span>
          </div>

          {/* Allocation progress bar */}
          <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
            {summary.allocationByAsset.map((alloc, idx) => {
              const colors = ['bg-[#006c4a]', 'bg-blue-600', 'bg-amber-500', 'bg-purple-600', 'bg-slate-400'];
              return (
                <div
                  key={idx}
                  style={{ width: `${alloc.percentage}%` }}
                  className={`h-full ${colors[idx % colors.length]}`}
                  title={`${alloc.category}: ${alloc.percentage}%`}
                />
              );
            })}
          </div>

          {/* Legend Items */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {summary.allocationByAsset.map((alloc, idx) => {
              const dots = ['bg-[#006c4a]', 'bg-blue-600', 'bg-amber-500', 'bg-purple-600', 'bg-slate-400'];
              return (
                <div key={idx} className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className={`w-2.5 h-2.5 rounded-full ${dots[idx % dots.length]}`}></span>
                    <span className="truncate">{alloc.category}</span>
                  </div>
                  <div className="font-serif font-bold text-sm text-slate-900 dark:text-white mt-1 tabular-nums">
                    {alloc.percentage}%
                  </div>
                  <div className="text-[10.5px] text-slate-400">
                    {formatINR(alloc.value, true)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tax Loss Harvesting Assistant (lg: 5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 to-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h3 className="font-serif font-bold text-lg">
              Tax-Loss Harvesting Engine
            </h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Cautilya's ledger optimizer scans your active holding lots for short-term tax-saving opportunities under Section 112A.
          </p>

          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Identified Realizable Tax Offset:</span>
              <span className="font-bold text-emerald-400 tabular-nums">₹ 42,800</span>
            </div>
            <div className="text-[11px] text-slate-400 leading-tight">
              Switch 420 units of Index ETF to offset realized short-term capital gains without changing net equity exposure.
            </div>
          </div>

          <button
            onClick={() => showToast('Tax-loss rebalancing executed! Capital gains tax liability minimized.')}
            className="w-full py-2.5 bg-[#006c4a] hover:bg-[#00573b] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Execute 1-Click Tax Optimization
          </button>
        </div>
      </div>

      {/* Active SIP Mandates Table */}
      <div className="bg-white dark:bg-[#0e1726] rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs space-y-3 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-serif font-bold text-lg text-slate-950 dark:text-white">
              Active SIP Mandates
            </h3>
            <p className="text-xs text-slate-500">
              Registered with NPCI Auto-Debit e-mandate on verified bank folios.
            </p>
          </div>
          <button
            onClick={() =>
              openMandateModal({
                fundName: 'New Wealth Mandate',
                monthlyAmount: 25000,
              })
            }
            className="px-3 py-1.5 text-xs font-semibold bg-[#006c4a] hover:bg-[#00573b] text-white rounded-lg transition-colors self-start sm:self-auto"
          >
            + Create New SIP Mandate
          </button>
        </div>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                <th className="pb-3 px-3">Fund Scheme</th>
                <th className="pb-3 px-3">Monthly Amount</th>
                <th className="pb-3 px-3">Debit Schedule</th>
                <th className="pb-3 px-3">Custody Bank</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {holdings
                .filter((h) => h.sipAmount)
                .map((item) => {
                  const isPaused = !!activeSipPausedMap[item.id];
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-slate-900 dark:text-white">{item.fundName}</div>
                        <div className="text-[11px] text-slate-400">{item.category}</div>
                      </td>
                      <td className="py-3.5 px-3 font-serif font-bold text-slate-900 dark:text-white tabular-nums">
                        {formatINR(item.sipAmount!)}
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">
                        {item.sipDate}th of month
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">
                        HDFC Bank (..4892)
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`text-[10.5px] font-bold px-2 py-0.5 rounded ${
                            isPaused
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                          }`}
                        >
                          {isPaused ? 'Paused' : 'Active'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right space-x-2">
                        <button
                          onClick={() => togglePauseSip(item.id, item.fundName)}
                          className="px-2.5 py-1 text-[11px] font-semibold border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          {isPaused ? 'Resume' : 'Pause'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complete Holdings Breakdown */}
      <div className="bg-white dark:bg-[#0e1726] rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs space-y-3 p-5 sm:p-6">
        <div>
          <h3 className="font-serif font-bold text-lg text-slate-950 dark:text-white">
            Current Holdings Ledger
          </h3>
          <p className="text-xs text-slate-500">
            All units held in demat format with CDSL tier-1 custody.
          </p>
        </div>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                <th className="pb-3 px-3">Scheme</th>
                <th className="pb-3 px-3">Units</th>
                <th className="pb-3 px-3">Invested Value</th>
                <th className="pb-3 px-3">Current Value</th>
                <th className="pb-3 px-3">Returns (%)</th>
                <th className="pb-3 px-3">XIRR</th>
                <th className="pb-3 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {holdings.map((h) => (
                <tr key={h.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-slate-900 dark:text-white">{h.fundName}</div>
                    <div className="text-[11px] text-[#006c4a] dark:text-emerald-400 font-semibold">100% Direct Plan</div>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-600 dark:text-slate-300">
                    {h.units.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 tabular-nums font-medium text-slate-800 dark:text-slate-200">
                    {formatINR(h.invested)}
                  </td>
                  <td className="py-3.5 px-3 tabular-nums font-bold text-slate-900 dark:text-white">
                    {formatINR(h.currentValue)}
                  </td>
                  <td className="py-3.5 px-3 tabular-nums font-bold text-[#006c4a] dark:text-emerald-400">
                    +{h.returnsPercent}%
                  </td>
                  <td className="py-3.5 px-3 tabular-nums font-bold text-[#006c4a] dark:text-emerald-400">
                    +{h.xirr}%
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => navigateToFund(h.fundId)}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-800 dark:text-slate-200"
                    >
                      View Fund
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
