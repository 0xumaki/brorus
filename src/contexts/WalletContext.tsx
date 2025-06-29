import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Web3 from 'web3';

interface WalletContextProps {
  account: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnected: boolean;
  web3: Web3 | null;
  error: string | null;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isConnected = !!account;

  // On mount, check localStorage for persisted account
  useEffect(() => {
    const savedAccount = localStorage.getItem('wallet_account');
    if (savedAccount) {
      setAccount(savedAccount);
      setWeb3(new Web3(window.ethereum));
    }
  }, []);

  // Detect account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || null);
        if (accounts[0]) {
          localStorage.setItem('wallet_account', accounts[0]);
        } else {
          localStorage.removeItem('wallet_account');
        }
      });
      window.ethereum.on('disconnect', () => {
        setAccount(null);
        setWeb3(null);
        localStorage.removeItem('wallet_account');
      });
    }
    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('disconnect', () => {});
      }
    };
  }, []);

  const connectWallet = async () => {
    setError(null);
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setWeb3(new Web3(window.ethereum));
        localStorage.setItem('wallet_account', accounts[0]);
      } catch (err: any) {
        setError(err.message || 'User rejected connection');
      }
    } else {
      setError('No Ethereum provider found. Install MetaMask.');
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setWeb3(null);
    setError(null);
    localStorage.removeItem('wallet_account');
  };

  return (
    <WalletContext.Provider value={{ account, connectWallet, disconnectWallet, isConnected, web3, error }}>
      {children}
    </WalletContext.Provider>
  );
};

// Add window.ethereum type for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
} 