import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Shield,
  Menu,
  X,
  ChevronDown,
  CheckCircle2,
  TrendingUp,
  Lock,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { MARKET_TICKERS } from '../data/mockData';
import { Screen } from '../types';
import { BrandLogo } from './BrandLogo';

export const Header: React.FC = () => {
  const { currentScreen, setCurrentScreen, setIsCommandSearchOpen, userProfile, showToast } = useApp();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Keyboard shortcut listener for Command/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsCommandSearchOpen]);

  const navItems: { id: Screen; label: string }[] = [
    { id: 'discover', label: 'Discover' },
    { id: 'explore', label: 'Explore Funds & ETFs' },
    { id: 'portfolio', label: 'Portfolio Dashboard' },
    { id: 'auth', label: 'Client Login / Register' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0c1522]/95 backdrop-blur-md transition-colors">
      {/* 1. TOP MARKET TICKER STRIP */}
      <div className="bg-[#f2f5f8] dark:bg-[#080e18] border-b border-slate-200/80 dark:border-slate-800/80 py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Live Market Indices */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-0.5">
            <span className="flex items-center gap-1.5 font-bold tracking-wider text-[11px] text-[#006c4a] dark:text-emerald-400 uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#006c4a] dark:bg-emerald-400"></span>
              </span>
              Markets Live
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            {MARKET_TICKERS.map((ticker) => (
              <div key={ticker.id} className="flex items-center gap-1.5 whitespace-nowrap text-slate-700 dark:text-slate-300">
                <span className="font-medium text-slate-900 dark:text-slate-200">{ticker.name}</span>
                <span className="tabular-nums font-semibold">{ticker.value}</span>
                <span
                  className={`tabular-nums text-[11px] font-medium flex items-center ${
                    ticker.isPositive ? 'text-[#006c4a] dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {ticker.change}
                </span>
                <span className="text-slate-300 dark:text-slate-700 ml-1">·</span>
              </div>
            ))}
          </div>

          {/* Institutional Trust Badges */}
          <div className="hidden lg:flex items-center gap-4 text-slate-600 dark:text-slate-400 text-[11px] font-medium">
            <span className="inline-flex items-center gap-1 text-[#006c4a] dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800/40">
              <TrendingUp className="w-3 h-3" />
              DIRECT PLANS • 0% COMMISSION
            </span>
            <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <Lock className="w-3 h-3 text-slate-500" />
              256-Bit Bank-Grade Encryption
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Wordmark & Crest */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => {
              setCurrentScreen('discover');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1 transition-transform hover:scale-[1.01]"
            aria-label="Cautilya Capital Homepage"
          >
            <BrandLogo showText size="md" />
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1.5" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.id)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Action Bar: Search, Dark Mode, Notifications, Profile */}
        <div className="flex items-center gap-2.5">
          {/* Search Trigger Bar */}
          <button
            onClick={() => setIsCommandSearchOpen(true)}
            className="hidden sm:flex items-center gap-2.5 pl-3 pr-2 py-1.5 text-xs bg-slate-100/90 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/80 rounded-lg transition-colors w-48 md:w-64 lg:w-72"
            aria-label="Search funds and ETFs"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate text-left flex-1 text-[11.5px]">Search funds, AMC, ETFs...</span>
            <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded border border-slate-200 dark:border-slate-700">
              ⌘K
            </kbd>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500"></span>
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#0f172a] rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Fiduciary Alerts</span>
                  <span className="text-[11px] text-[#006c4a] dark:text-emerald-400 font-semibold cursor-pointer" onClick={() => setIsNotificationsOpen(false)}>Mark read</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                    <p className="font-semibold text-emerald-900 dark:text-emerald-200">SIP Auto-Debit Executed</p>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">₹1,00,000 processed for Parag Parikh Flexi Cap Direct at NAV ₹84.62.</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Quarterly Rebalancing Due</p>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">Next-Gen Tech basket rebalanced by SEBI research desk with +1.8% target alpha.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700/80 transition-colors cursor-pointer"
              aria-label="User account menu"
            >
              <div className="w-7 h-7 rounded-full bg-slate-900 dark:bg-emerald-600 text-white flex items-center justify-center font-bold text-xs ring-1 ring-emerald-500/50 uppercase">
                {userProfile.name
                  .split(' ')
                  .map((n) => n[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join('') || 'U'}
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-xs font-bold text-slate-950 dark:text-white leading-tight">
                  {userProfile.name}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  {userProfile.tier}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#0f172a] rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 z-50 text-xs">
                <div className="pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                  <div className="font-bold text-slate-900 dark:text-white text-sm">{userProfile.name}</div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px] truncate">{userProfile.email}</div>
                  <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3 h-3" /> KYC & Aadhaar Verified
                  </div>
                </div>
                <div className="space-y-1 text-slate-700 dark:text-slate-300">
                  <button
                    onClick={() => {
                      setCurrentScreen('auth');
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between font-medium text-[#006c4a] dark:text-emerald-400"
                  >
                    <span>Switch User / Register Profile</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentScreen('portfolio');
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
                  >
                    <span>Portfolio Overview</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button
                    onClick={() => {
                      showToast('NPCI Auto-Debit limit verified up to ₹5,00,000/day');
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
                  >
                    <span>Bank Mandates</span>
                    <span className="text-[10px] text-slate-400">HDFC • Active</span>
                  </button>
                  <button
                    onClick={() => {
                      showToast('Tax statement for FY 2025-26 generated with 0 capital gains liability');
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
                  >
                    <span>Tax Capital Gains Ledger</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 3. REGULATORY FIDUCIARY PROTOCOL BANNER */}
      <div className="bg-[#f8fafc] dark:bg-[#0a121e] border-t border-slate-200/60 dark:border-slate-800/60 px-4 py-1.5 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-slate-800 dark:text-slate-300 uppercase tracking-wider text-[10px]">
              FIDUCIARY WEALTH PROTOCOL
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-[#006c4a] dark:text-emerald-400 font-medium">Direct Plans Only (0% Commissions)</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[10px] text-slate-500 dark:text-slate-400">
            <span>AMFI ARN-248190</span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span>SEBI REGISTERED INZ00018293</span>
          </div>
        </div>
      </div>

      {/* 4. MOBILE ACCESSIBLE DRAWER */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1522] px-4 py-4 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                setIsCommandSearchOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg"
            >
              <Search className="w-4 h-4" />
              <span>Search mutual funds, baskets, AMCs...</span>
            </button>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentScreen(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-between ${
                  currentScreen === item.id
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#006c4a] dark:text-emerald-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>{item.label}</span>
                {currentScreen === item.id && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Theme Mode</span>
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
              {isDarkMode ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
