import React from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CommandSearchModal } from './components/CommandSearchModal';
import { SIPMandateModal } from './components/SIPMandateModal';
import { CASImportModal } from './components/CASImportModal';
import { DiscoverView } from './views/DiscoverView';
import { ExploreFundsView } from './views/ExploreFundsView';
import { FundDetailsView } from './views/FundDetailsView';
import { PortfolioDashboardView } from './views/PortfolioDashboardView';
import { AuthView } from './views/AuthView';
import { AppProvider, useApp } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { CheckCircle2 } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentScreen, toastMessage } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9fb] dark:bg-[#070e17] text-[#191c1e] dark:text-[#eff1f3] transition-colors duration-250">
      {/* Header */}
      <Header />

      {/* Main Responsive Body Container (1440px standard max-w-7xl) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {currentScreen === 'discover' && <DiscoverView />}
        {currentScreen === 'explore' && <ExploreFundsView />}
        {currentScreen === 'fund-details' && <FundDetailsView />}
        {currentScreen === 'portfolio' && <PortfolioDashboardView />}
        {currentScreen === 'auth' && <AuthView />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Global Modals */}
      <CommandSearchModal />
      <SIPMandateModal />
      <CASImportModal />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white dark:bg-emerald-600 rounded-xl shadow-xl border border-slate-700 dark:border-emerald-500 animate-in fade-in slide-in-from-bottom-4 duration-200 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-white shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </ThemeProvider>
  );
}
