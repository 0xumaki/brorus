import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ElizaOSState {
  isActive: boolean;
  autoTrading: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  maxTradeAmount: number;
  lastAnalysis: Date | null;
  tradingSignals: any[];
}

interface ElizaOSContextType {
  state: ElizaOSState;
  activateElizaOS: () => void;
  deactivateElizaOS: () => void;
  toggleAutoTrading: () => void;
  setRiskLevel: (level: 'low' | 'medium' | 'high') => void;
  setMaxTradeAmount: (amount: number) => void;
  analyzeMarket: () => Promise<any>;
  generateSignals: () => Promise<any[]>;
}

const ElizaOSContext = createContext<ElizaOSContextType | undefined>(undefined);

export const useElizaOS = () => {
  const context = useContext(ElizaOSContext);
  if (!context) {
    throw new Error('useElizaOS must be used within an ElizaOSProvider');
  }
  return context;
};

interface ElizaOSProviderProps {
  children: ReactNode;
}

export const ElizaOSProvider: React.FC<ElizaOSProviderProps> = ({ children }) => {
  const [state, setState] = useState<ElizaOSState>({
    isActive: false,
    autoTrading: false,
    riskLevel: 'medium',
    maxTradeAmount: 1000,
    lastAnalysis: null,
    tradingSignals: []
  });

  const activateElizaOS = () => {
    setState(prev => ({ ...prev, isActive: true }));
  };

  const deactivateElizaOS = () => {
    setState(prev => ({ ...prev, isActive: false }));
  };

  const toggleAutoTrading = () => {
    setState(prev => ({ ...prev, autoTrading: !prev.autoTrading }));
  };

  const setRiskLevel = (level: 'low' | 'medium' | 'high') => {
    setState(prev => ({ ...prev, riskLevel: level }));
  };

  const setMaxTradeAmount = (amount: number) => {
    setState(prev => ({ ...prev, maxTradeAmount: amount }));
  };

  const analyzeMarket = async () => {
    // Simulate market analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const analysis = {
      trend: Math.random() > 0.5 ? 'bullish' : 'bearish',
      confidence: Math.floor(Math.random() * 30) + 70,
      priceChange: (Math.random() - 0.5) * 10,
      volume: '$2.5M',
      support: '$0.985',
      resistance: '$1.015',
      recommendation: Math.random() > 0.5 ? 'Consider buying on dips' : 'Wait for better entry point'
    };

    setState(prev => ({ ...prev, lastAnalysis: new Date() }));
    return analysis;
  };

  const generateSignals = async () => {
    // Simulate signal generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const signals = [
      {
        id: '1',
        type: 'buy',
        confidence: 85,
        price: '$0.998',
        reason: 'Strong support level reached, RSI oversold',
        timestamp: new Date(),
        crypto: 'USDT',
        fiat: 'MMK'
      },
      {
        id: '2',
        type: 'sell',
        confidence: 72,
        price: '$1.002',
        reason: 'Resistance level approaching, take profits',
        timestamp: new Date(Date.now() - 300000),
        crypto: 'USDT',
        fiat: 'MMK'
      }
    ];

    setState(prev => ({ ...prev, tradingSignals: signals }));
    return signals;
  };

  const value: ElizaOSContextType = {
    state,
    activateElizaOS,
    deactivateElizaOS,
    toggleAutoTrading,
    setRiskLevel,
    setMaxTradeAmount,
    analyzeMarket,
    generateSignals
  };

  return (
    <ElizaOSContext.Provider value={value}>
      {children}
    </ElizaOSContext.Provider>
  );
}; 