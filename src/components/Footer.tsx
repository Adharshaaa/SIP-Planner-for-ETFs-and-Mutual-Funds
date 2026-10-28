import React from 'react';
import { ShieldCheck, Award, Lock, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  const { setCurrentScreen, setIsCasImportModalOpen, showToast } = useApp();

  return (
    <footer className="w-full bg-[#f8fafc] dark:bg-[#070d16] border-t border-slate-200 dark:border-slate-800/80 pt-16 pb-12 text-slate-600 dark:text-slate-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-200 dark:border-slate-800">
          {/* Brand & Mission (md: 5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <BrandLogo showText size="md" />

            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 max-w-md">
              Institutional-grade mutual fund and ETF investment architecture. Designed for disciplined wealth preservation, analytical clarity, and friction-free compounding.
            </p>

            {/* Regulatory Accreditation Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60">
                <ShieldCheck className="w-3.5 h-3.5 text-[#006c4a] dark:text-emerald-400" />
                AMFI ARN-248190
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60">
                <Award className="w-3.5 h-3.5 text-[#006c4a] dark:text-emerald-400" />
                SEBI REG. INZ00018293
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60">
                <Lock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                ISO 27001 CERTIFIED
              </span>
            </div>
          </div>

          {/* Links Column 1: Investment Vehicles (md: 2-3 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-950 dark:text-slate-200">
              Investment Vehicles
            </h4>
            <ul className="space-y-2 text-xs">
              {['Large Cap Equity Funds', 'Dynamic Asset Allocation', 'Target Maturity Debt Index', 'Sovereign Gold & Commodity ETFs', 'Global Thematic Indices'].map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => {
                      setCurrentScreen('explore');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-slate-950 dark:hover:text-white transition-colors text-left"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2: Tools & Analytics (md: 2-3 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-950 dark:text-slate-200">
              Tools & Analytics
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setCurrentScreen('discover');
                    const sim = document.getElementById('wealth-simulator');
                    sim?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-slate-950 dark:hover:text-white transition-colors text-left"
                >
                  SIP Compound Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentScreen('portfolio');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-slate-950 dark:hover:text-white transition-colors text-left"
                >
                  Tax Harvesting Matrix
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsCasImportModalOpen(true)}
                  className="hover:text-slate-950 dark:hover:text-white transition-colors text-left"
                >
                  Fund Overlap Visualizer
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentScreen('explore');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-slate-950 dark:hover:text-white transition-colors text-left"
                >
                  Multi-Asset Rebalancer
                </button>
              </li>
              <li>
                <button
                  onClick={() => showToast('SEBI Fiduciary Riskometer calibrated for conservative capital allocation')}
                  className="hover:text-slate-950 dark:hover:text-white transition-colors text-left"
                >
                  Fiduciary Riskometer
                </button>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Governance & Trust (md: 3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-950 dark:text-slate-200">
              Governance & Trust
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => showToast('Statutory Disclosures: AMFI Registered Distributor ARN-248190')} className="hover:text-slate-950 dark:hover:text-white transition-colors text-left">
                  Statutory Disclosures
                </button>
              </li>
              <li>
                <button onClick={() => showToast('Investor Grievance Redressal Officer: complaints@cautilyacapital.in')} className="hover:text-slate-950 dark:hover:text-white transition-colors text-left">
                  Investor Charter & Redressal
                </button>
              </li>
              <li>
                <button onClick={() => showToast('Commission Policy: 100% Direct Mutual Funds. We earn 0 transaction or trail commission from fund houses.')} className="hover:text-slate-950 dark:hover:text-white transition-colors text-left">
                  Commission Transparency
                </button>
              </li>
              <li>
                <button onClick={() => showToast('Custody & Depository links: CDSL & NSDL tier-1 bank custody')} className="hover:text-slate-950 dark:hover:text-white transition-colors text-left">
                  Custody & Depository Links
                </button>
              </li>
              <li>
                <button onClick={() => showToast('Privacy Policy: End-to-end 256-bit encryption compliant with ISO 27001')} className="hover:text-slate-950 dark:hover:text-white transition-colors text-left">
                  Privacy Policy & Security
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory & Legal Disclaimers */}
        <div className="pt-8 space-y-4 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          <p>
            <strong className="text-slate-800 dark:text-slate-300 font-semibold">Statutory Regulatory Notice:</strong> Mutual fund investments are subject to market risks, read all scheme related documents carefully. Past performance is not an indicator of future returns. Cautilya Capital Wealth & Asset Management Pvt. Ltd. is an AMFI-registered Mutual Fund Distributor (ARN-248190) and does not provide guaranteed returns or individualized investment recommendations.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 font-mono text-[10.5px]">
            <span>© 2025 Cautilya Capital Management Pvt. Ltd. All rights reserved.</span>
            <div className="flex flex-wrap items-center gap-2 text-slate-400">
              <span>SEBI Reg No: INZ00018293</span>
              <span>•</span>
              <span>AMFI ARN-248190</span>
              <span>•</span>
              <span>CIN: U67120MH2022PTC384910</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
