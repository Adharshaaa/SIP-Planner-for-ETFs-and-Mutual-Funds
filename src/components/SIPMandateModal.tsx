import React, { useState } from 'react';
import { X, CheckCircle2, Shield, Lock, Building, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/calculations';

export const SIPMandateModal: React.FC = () => {
  const { isMandateModalOpen, closeMandateModal, mandateModalData, userProfile, showToast } = useApp();
  const [selectedBank, setSelectedBank] = useState('HDFC Bank - Wealth Acc (..4892)');
  const [sipDate, setSipDate] = useState('5th of every month');
  const [isStepUpEnabled, setIsStepUpEnabled] = useState(true);
  const [stepUpPercent, setStepUpPercent] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txnRef, setTxnRef] = useState('');

  if (!isMandateModalOpen || !mandateModalData) return null;

  const handleAuthorize = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      const randomRef = 'NPCI-MF-' + Math.floor(10000000 + Math.random() * 90000000);
      setTxnRef(randomRef);
      showToast(`SIP Mandate of ${formatINR(mandateModalData.monthlyAmount)} authorized successfully!`);
    }, 1200);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setIsProcessing(false);
    closeMandateModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#0c1626] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-label="SIP Mandate Execution"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-[#f8fafc] dark:bg-[#080f1a]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-[#006c4a] dark:text-emerald-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-slate-950 dark:text-white">
                {isSuccess ? 'Mandate Approved' : 'Execute NPCI Auto-Debit SIP'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Direct Plan 0% Commission • Tier-1 Custody
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isSuccess ? (
          <div className="p-6 space-y-5">
            {/* Investment Summary Pill */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Scheme / Target Strategy</div>
              <div className="font-serif font-bold text-base text-slate-900 dark:text-white mt-0.5">
                {mandateModalData.fundName || 'Cautilya Sovereign Wealth Basket'}
              </div>
              <div className="flex items-baseline justify-between mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-700/80">
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Monthly Investment</span>
                <span className="tabular-nums font-bold text-lg text-[#006c4a] dark:text-emerald-400 font-serif">
                  {formatINR(mandateModalData.monthlyAmount)}
                  <span className="text-xs font-normal text-slate-500 font-sans ml-1">/ month</span>
                </span>
              </div>
            </div>

            {/* Bank Auto-Debit Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <span>Select Verified Bank Account</span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">NPCI e-Mandate Active</span>
              </label>
              <div className="space-y-1.5">
                {[
                  { name: 'HDFC Bank - Wealth Acc (..4892)', ifsc: 'HDFC0000060', primary: true },
                  { name: 'ICICI Bank - Privilege Acc (..9124)', ifsc: 'ICIC0000104', primary: false },
                ].map((bank) => (
                  <label
                    key={bank.name}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                      selectedBank === bank.name
                        ? 'border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20 text-slate-900 dark:text-white'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="bank"
                        checked={selectedBank === bank.name}
                        onChange={() => setSelectedBank(bank.name)}
                        className="accent-emerald-600"
                      />
                      <Building className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold">{bank.name}</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">{bank.ifsc}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Debit Date */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 block mb-1.5">
                  SIP Auto-Debit Date
                </label>
                <div className="relative">
                  <select
                    value={sipDate}
                    onChange={(e) => setSipDate(e.target.value)}
                    className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:border-emerald-500"
                  >
                    <option value="1st of every month">1st of every month</option>
                    <option value="5th of every month">5th of every month</option>
                    <option value="10th of every month">10th of every month</option>
                    <option value="15th of every month">15th of every month</option>
                    <option value="25th of every month">25th of every month</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 block mb-1.5">
                  Fiduciary Custody
                </label>
                <div className="text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 font-medium">
                  NSDL / CDSL Demat
                </div>
              </div>
            </div>

            {/* Algorithmic Step-Up Feature */}
            <div className="p-3.5 rounded-xl border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#006c4a] dark:text-emerald-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Algorithmic Step-Up (+{stepUpPercent}% / Year)
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isStepUpEnabled}
                  onChange={(e) => setIsStepUpEnabled(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Increases monthly SIP by {stepUpPercent}% annually with your salary increments. Models show this can increase terminal wealth by up to 2.1x.
              </p>
            </div>

            {/* Action CTA */}
            <button
              onClick={handleAuthorize}
              disabled={isProcessing}
              className="w-full py-3.5 px-4 bg-[#006c4a] hover:bg-[#00573b] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Confirming with NPCI Gateway...</span>
                </>
              ) : (
                <>
                  <span>Authorize Mandate of {formatINR(mandateModalData.monthlyAmount)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[10.5px] text-slate-400">
              <Lock className="w-3 h-3" />
              <span>Instant Bank Approval via NetBanking / UPI 2.0 • Cancel or Pause anytime</span>
            </div>
          </div>
        ) : (
          /* Success Screen */
          <div className="p-8 text-center space-y-5 animate-in fade-in duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-[#006c4a] dark:text-emerald-400 mx-auto flex items-center justify-center ring-8 ring-emerald-50 dark:ring-emerald-950/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
                SIP Mandate Activated
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Your monthly mandate for {formatINR(mandateModalData.monthlyAmount)} is registered under UMRN protocol.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Scheme:</span>
                <span className="font-semibold text-slate-900 dark:text-white text-right truncate max-w-[200px]">
                  {mandateModalData.fundName || 'Cautilya Curated Strategy'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Monthly Contribution:</span>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                  {formatINR(mandateModalData.monthlyAmount)} / mo
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Debit Schedule:</span>
                <span className="text-slate-800 dark:text-slate-200">{sipDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bank Source:</span>
                <span className="text-slate-800 dark:text-slate-200">{selectedBank.split('(')[0]}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-500">NPCI Ref ID:</span>
                <span className="font-mono font-bold text-[#006c4a] dark:text-emerald-400">{txnRef}</span>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Done & Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
