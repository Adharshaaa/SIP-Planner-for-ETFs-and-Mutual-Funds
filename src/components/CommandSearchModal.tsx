import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ALL_FUNDS, CURATED_BASKETS } from '../data/mockData';
import { formatINR } from '../utils/calculations';

export const CommandSearchModal: React.FC = () => {
  const { isCommandSearchOpen, setIsCommandSearchOpen, navigateToFund, setCurrentScreen, openMandateModal } = useApp();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isCommandSearchOpen]);

  if (!isCommandSearchOpen) return null;

  const filteredFunds = query.trim()
    ? ALL_FUNDS.filter(
        (f) =>
          f.name.toLowerCase().includes(query.toLowerCase()) ||
          f.code.toLowerCase().includes(query.toLowerCase()) ||
          f.category.toLowerCase().includes(query.toLowerCase()) ||
          f.amc.toLowerCase().includes(query.toLowerCase())
      )
    : ALL_FUNDS.slice(0, 4);

  const filteredBaskets = query.trim()
    ? CURATED_BASKETS.filter(
        (b) =>
          b.title.toLowerCase().includes(query.toLowerCase()) ||
          b.tag.toLowerCase().includes(query.toLowerCase())
      )
    : CURATED_BASKETS.slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#0c1626] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-label="Command search dialog"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search mutual funds, ETFs, curated baskets, or tools..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsCommandSearchOpen(false)}
            className="px-2 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 rounded border border-slate-200 dark:border-slate-700"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-4 space-y-6">
          {/* Quick Navigation Shortcuts */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 mb-2">
              Quick Shortcuts
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setCurrentScreen('discover');
                  setIsCommandSearchOpen(false);
                  const sim = document.getElementById('wealth-simulator');
                  sim?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-left transition-colors"
              >
                <TrendingUp className="w-4 h-4 text-[#006c4a] dark:text-emerald-400" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">SIP Calculator</span>
              </button>
              <button
                onClick={() => {
                  setCurrentScreen('explore');
                  setIsCommandSearchOpen(false);
                }}
                className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-left transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Fund Screener</span>
              </button>
              <button
                onClick={() => {
                  setCurrentScreen('portfolio');
                  setIsCommandSearchOpen(false);
                }}
                className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-left transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Client Portfolio</span>
              </button>
            </div>
          </div>

          {/* Curated Baskets */}
          {filteredBaskets.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 mb-2">
                Thematic Baskets
              </div>
              <div className="space-y-1.5">
                {filteredBaskets.map((basket) => (
                  <div
                    key={basket.id}
                    onClick={() => {
                      setIsCommandSearchOpen(false);
                      openMandateModal({
                        fundName: basket.title,
                        monthlyAmount: basket.minSip,
                        isBasket: true,
                      });
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900 dark:text-white">{basket.title}</span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">{basket.cagrPeriod}: +{basket.cagr}%</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-md">{basket.description}</p>
                    </div>
                    <span className="text-xs text-[#006c4a] dark:text-emerald-400 font-semibold flex items-center gap-1">
                      Invest <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mutual Funds & ETFs */}
          {filteredFunds.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 mb-2">
                Direct Mutual Funds & ETFs
              </div>
              <div className="space-y-1.5">
                {filteredFunds.map((fund) => (
                  <div
                    key={fund.id}
                    onClick={() => {
                      setIsCommandSearchOpen(false);
                      navigateToFund(fund.id);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300">
                        {fund.code}
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-slate-900 dark:text-white">{fund.name}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          {fund.amc} • TER {fund.ter}% • AUM {formatINR(fund.aum * 10000000, true)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="tabular-nums font-bold text-xs text-[#006c4a] dark:text-emerald-400">
                        +{fund.return3Y}% (3Y)
                      </div>
                      <div className="text-[10px] text-slate-400">Min SIP ₹{fund.minSip}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Search 2,400+ SEBI registered Direct mutual fund schemes</span>
          <span className="font-mono">Press ↵ to select</span>
        </div>
      </div>
    </div>
  );
};
