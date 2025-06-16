// src/contexts/WalletAuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WalletAuthState {
  seedPhrase: string[];
  privateKey: string;
  address: string;
  showNewWalletModal: boolean;
  showImportWalletModal: boolean;
  showSeedPhrase: boolean;
  error: string | null;
  success: string | null;
  showNewPasswordModal: boolean;
  words: string[];
}

interface WalletAuthContextType extends WalletAuthState {
  setSeedPhrase: (phrase: string[]) => void;
  setPrivateKey: (key: string) => void;
  setAddress: (address: string) => void;
  setShowNewWalletModal: (show: boolean) => void;
  setShowImportWalletModal: (show: boolean) => void;
  setShowSeedPhrase: (show: boolean) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
  setShowNewPasswordModal: (show: boolean) => void;
  setWords: (words: string[]) => void;
}

const WalletAuthContext = createContext<WalletAuthContextType | undefined>(undefined);

export const useWalletAuth = (): WalletAuthContextType => {
  const context = useContext(WalletAuthContext);
  if (!context) {
    throw new Error('useWalletAuth must be used within a WalletAuthProvider');
  }
  return context;
};

export const WalletAuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<WalletAuthState>({
    seedPhrase: [],
    privateKey: '',
    address: '0x0000000000000000000000000000000000000000',
    showNewWalletModal: false,
    showImportWalletModal: false,
    showSeedPhrase: true,
    error: null,
    success: null,
    showNewPasswordModal: false,
    words: Array(12).fill(''),
  });

  const updateState = (newState: Partial<WalletAuthState>) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  const contextValue: WalletAuthContextType = {
    ...state,
    setSeedPhrase: (seedPhrase) => updateState({ seedPhrase }),
    setPrivateKey: (privateKey) => updateState({ privateKey }),
    setAddress: (address) => updateState({ address }),
    setShowNewWalletModal: (showNewWalletModal) => updateState({ showNewWalletModal }),
    setShowImportWalletModal: (showImportWalletModal) => updateState({ showImportWalletModal }),
    setShowSeedPhrase: (showSeedPhrase) => updateState({ showSeedPhrase }),
    setError: (error) => updateState({ error }),
    setSuccess: (success) => updateState({ success }),
    setShowNewPasswordModal: (showNewPasswordModal) => updateState({ showNewPasswordModal }),
    setWords: (words) => updateState({ words }),
  };

  return (
    <WalletAuthContext.Provider value={contextValue}>
      {children}
    </WalletAuthContext.Provider>
  );
};