import React, { createContext, useContext, useState, useEffect } from 'react';
import { ALL_FUNDS, USER_HOLDINGS, USER_PROFILE } from '../data/mockData';
import { Fund, PortfolioHolding, Screen, UserProfile } from '../types';

interface MandateModalPayload {
  fundName?: string;
  monthlyAmount: number;
  isBasket?: boolean;
}

interface AppContextType {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  selectedFund: Fund;
  setSelectedFund: (fund: Fund) => void;
  isCommandSearchOpen: boolean;
  setIsCommandSearchOpen: (open: boolean) => void;
  isMandateModalOpen: boolean;
  mandateModalData: MandateModalPayload | null;
  openMandateModal: (data: MandateModalPayload) => void;
  closeMandateModal: () => void;
  isCasImportModalOpen: boolean;
  setIsCasImportModalOpen: (open: boolean) => void;
  allFunds: Fund[];
  importFundsFromZip?: (newFunds: Fund[]) => void;
  holdings: PortfolioHolding[];
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  navigateToFund: (fundId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('discover');
  const [allFunds, setAllFunds] = useState<Fund[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cautilya-all-funds');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return ALL_FUNDS;
        }
      }
    }
    return ALL_FUNDS;
  });

  const [selectedFund, setSelectedFund] = useState<Fund>(allFunds[0] || ALL_FUNDS[0]);
  const [isCommandSearchOpen, setIsCommandSearchOpen] = useState(false);
  const [isMandateModalOpen, setIsMandateModalOpen] = useState(false);
  const [mandateModalData, setMandateModalData] = useState<MandateModalPayload | null>(null);
  const [isCasImportModalOpen, setIsCasImportModalOpen] = useState(false);
  const [holdings, setHoldings] = useState<PortfolioHolding[]>(USER_HOLDINGS);

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cautilya-user-profile');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return USER_PROFILE;
        }
      }
    }
    return USER_PROFILE;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const updateUserProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const merged = { ...prev, ...updated };
      if (typeof window !== 'undefined') {
        localStorage.setItem('cautilya-user-profile', JSON.stringify(merged));
      }
      return merged;
    });
  };

  const importFundsFromZip = (newFunds: Fund[]) => {
    setAllFunds((prev) => {
      // Merge by ID or Code avoiding duplicate entries
      const existingCodes = new Set(prev.map((f) => f.code.toLowerCase()));
      const filteredNew = newFunds.filter((f) => !existingCodes.has(f.code.toLowerCase()));
      const combined = [...filteredNew, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('cautilya-all-funds', JSON.stringify(combined));
      }
      return combined;
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const openMandateModal = (data: MandateModalPayload) => {
    setMandateModalData(data);
    setIsMandateModalOpen(true);
  };

  const closeMandateModal = () => {
    setIsMandateModalOpen(false);
    setMandateModalData(null);
  };

  const navigateToFund = (fundId: string) => {
    const fund = allFunds.find((f) => f.id === fundId) || ALL_FUNDS.find((f) => f.id === fundId) || allFunds[0];
    setSelectedFund(fund);
    setCurrentScreen('fund-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        selectedFund,
        setSelectedFund,
        isCommandSearchOpen,
        setIsCommandSearchOpen,
        isMandateModalOpen,
        mandateModalData,
        openMandateModal,
        closeMandateModal,
        isCasImportModalOpen,
        setIsCasImportModalOpen,
        allFunds,
        importFundsFromZip,
        holdings,
        userProfile,
        updateUserProfile,
        toastMessage,
        showToast,
        navigateToFund,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
