import React, { useState } from 'react';
import { Shield, Lock, Mail, User, ArrowRight, CheckCircle2, Building, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from '../components/BrandLogo';

export const AuthView: React.FC = () => {
  const { userProfile, updateUserProfile, setCurrentScreen, showToast } = useApp();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [password, setPassword] = useState('••••••••••••');
  const [panNumber, setPanNumber] = useState('ABCDE1234F');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter your full legal name');
      return;
    }
    if (!email.trim()) {
      showToast('Please enter your email address');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      updateUserProfile({
        name: name.trim(),
        email: email.trim(),
        panVerified: true,
        aadhaarVerified: true,
      });
      showToast(`Welcome, ${name.trim()}! Logged in to Private Wealth Desk.`);
      setCurrentScreen('discover');
    }, 600);
  };

  return (
    <div className="py-8 sm:py-12 max-w-xl mx-auto space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-3">
        <BrandLogo size="lg" className="justify-center mx-auto" />
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 text-[#006c4a] dark:text-emerald-400 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5" />
          <span>Fiduciary 256-Bit Encrypted Client Portal</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-950 dark:text-white">
          {isRegisterMode ? 'Open Wealth Account' : 'Client Access Portal'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          {isRegisterMode
            ? 'Begin your 0% commission direct mutual fund and ETF journey.'
            : 'Access your institutional holdings, active SIP mandates, and tax ledger.'}
        </p>
      </div>

      {/* Auth Card */}
      <div className="bg-white dark:bg-[#0e1726] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Toggle Mode Pills */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setIsRegisterMode(false)}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
              !isRegisterMode
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Client Login
          </button>
          <button
            type="button"
            onClick={() => setIsRegisterMode(true)}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
              isRegisterMode
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Create New Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
              Full Legal Name (as per PAN Card)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vikram Singhania"
                className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>
            <p className="text-[10.5px] text-slate-400">This exact name will be updated live across your portfolio profile and header badge.</p>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
              Registered Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>
          </div>

          {/* PAN Card (if register) */}
          {isRegisterMode && (
            <div className="space-y-1.5 animate-in fade-in duration-150">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                Permanent Account Number (PAN)
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  maxLength={10}
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                  className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono uppercase focus:outline-none focus:border-emerald-500 font-semibold"
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Password
              </label>
              {!isRegisterMode && (
                <button
                  type="button"
                  onClick={() => showToast('Password reset link sent to your registered email.')}
                  className="text-[11px] text-[#006c4a] dark:text-emerald-400 hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 bg-[#006c4a] hover:bg-[#00573b] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 pt-3"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Authenticating with Central Fiduciary Vault...</span>
              </>
            ) : (
              <>
                <span>{isRegisterMode ? 'Complete KYC & Create Account' : 'Sign In to Wealth Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Regulatory footer info */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            AMFI ARN-248190
          </span>
          <span>SEBI Registered INZ00018293</span>
        </div>
      </div>
    </div>
  );
};
