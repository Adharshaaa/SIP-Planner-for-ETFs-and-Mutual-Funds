import React, { useState } from 'react';
import { X, UploadCloud, FileText, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/calculations';

export const CASImportModal: React.FC = () => {
  const { isCasImportModalOpen, setIsCasImportModalOpen, showToast, setCurrentScreen } = useApp();
  const [step, setStep] = useState<'upload' | 'analyzing' | 'result'>('upload');
  const [selectedProvider, setSelectedProvider] = useState<'CAMS' | 'KFintech'>('CAMS');

  if (!isCasImportModalOpen) return null;

  const handleStartAnalysis = () => {
    setStep('analyzing');
    setTimeout(() => {
      setStep('result');
      showToast('CAS Statement successfully audited. 4 Regular funds detected!');
    }, 1200);
  };

  const handleClose = () => {
    setStep('upload');
    setIsCasImportModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-white dark:bg-[#0c1626] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-label="CAS Statement Portfolio Import & Overlap Audit"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-[#f8fafc] dark:bg-[#080f1a]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-[#006c4a] dark:text-emerald-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-slate-950 dark:text-white">
                CAS Statement Overlap & Fee Audit
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                100% Confidential • CAMS & KFintech Official Importer
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body based on step */}
        {step === 'upload' && (
          <div className="p-6 space-y-5">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Consolidated Account Statements (CAS) aggregate all your mutual fund folios across all AMCs. Upload your statement to uncover hidden trail commissions charged by legacy bank brokers and identify duplicate stock holdings.
            </p>

            {/* Provider Switcher */}
            <div className="flex items-center gap-2">
              {(['CAMS', 'KFintech'] as const).map((prov) => (
                <button
                  key={prov}
                  onClick={() => setSelectedProvider(prov)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                    selectedProvider === prov
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-[#006c4a] dark:text-emerald-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {prov} Statement
                </button>
              ))}
            </div>

            {/* Drag & Drop Simulation Area */}
            <div
              onClick={handleStartAnalysis}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/20 group"
            >
              <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-emerald-600 mx-auto transition-colors" />
              <div className="mt-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                Click to load sample CAS statement (or drop PDF)
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Password protected PDFs (PAN number) supported
              </p>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>We do not store your PAN or credentials. Data parsed client-side in RAM.</span>
            </div>
          </div>
        )}

        {step === 'analyzing' && (
          <div className="p-12 text-center space-y-4">
            <div className="w-12 h-12 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div>
              <h4 className="font-serif font-bold text-sm text-slate-900 dark:text-white">
                Auditing Portfolio Folios...
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Comparing expense ratios (TER) against Direct Plans and computing 20-year drag.
              </p>
            </div>
          </div>
        )}

        {step === 'result' && (
          <div className="p-6 space-y-5 animate-in fade-in duration-200">
            {/* Warning Callout: Commission Bleed Detected */}
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  Commission Drag Detected in External Folios
                </div>
                <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                  Your uploaded external portfolio holds 4 Regular Plans paying ~1.35% trail commission to bank intermediaries annually.
                </p>
              </div>
            </div>

            {/* Savings & Overlap Metric Grid */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">
                  Projected 20Y Savings
                </div>
                <div className="font-serif text-lg font-bold text-[#006c4a] dark:text-emerald-400 tabular-nums mt-0.5">
                  ₹ 32,40,000
                </div>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-300 font-medium">
                  By switching to 0% Direct Plans
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">
                  Stock Overlap Found
                </div>
                <div className="font-serif text-lg font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
                  64.2% Duplicate
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  Across 3 Large Cap schemes
                </div>
              </div>
            </div>

            {/* Schemes Audit List */}
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {[
                { name: 'HDFC Top 100 - Regular', brokerCut: '1.24% / yr', save: '₹ 8,420/yr' },
                { name: 'SBI Bluechip Fund - Regular', brokerCut: '1.45% / yr', save: '₹ 11,200/yr' },
                { name: 'Axis Focused 25 - Regular', brokerCut: '1.30% / yr', save: '₹ 9,150/yr' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 text-xs bg-slate-50/50 dark:bg-slate-900/30"
                >
                  <div>
                    <span className="font-medium text-slate-900 dark:text-slate-200">{item.name}</span>
                    <div className="text-[10px] text-rose-600 dark:text-rose-400">Broker trail: {item.brokerCut}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-[#006c4a] dark:text-emerald-400">Save {item.save}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Convert CTA */}
            <button
              onClick={() => {
                handleClose();
                setCurrentScreen('portfolio');
                showToast('1-Click Direct Plan Switch initialized for 3 folios!');
              }}
              className="w-full py-3 px-4 bg-[#006c4a] hover:bg-[#00573b] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Switch All to 0% Direct Plans</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
