
import React, { createContext, useContext, useState, useEffect } from "react";
import { Trade, TradeContextType } from "./types";
import { createTradeActions } from "./tradeActions";
import { mockOffers, Offer, PaymentMethod } from "../data/offerTypes";
import { useToast } from "@/hooks/use-toast";

// Re-export types for easier imports elsewhere
export * from "./types";

const TradeContext = createContext<TradeContextType | undefined>(undefined);

// Mock current user ID - in a real app, this would come from authentication
const CURRENT_USER_ID = "user-1"; // Assuming this is the ID of the current user

export const TradeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [activeTrade, setActiveTrade] = useState<Trade | null>(null);
  const [userOffers, setUserOffers] = useState<Offer[]>([]);
  const { toast } = useToast();
  
  // Load trades from localStorage on component mount
  useEffect(() => {
    const savedTrades = localStorage.getItem("p2pTrades");
    if (savedTrades) {
      setTrades(JSON.parse(savedTrades));
    }
    
    // Initialize user offers - get all offers where the advertiser's userId matches CURRENT_USER_ID
    const userOwnedOffers = mockOffers.filter(offer => 
      offer.advertiser.userId === CURRENT_USER_ID
    );
    setUserOffers(userOwnedOffers);
  }, []);

  // Save trades to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("p2pTrades", JSON.stringify(trades));
  }, [trades]);

  // Create all trade actions
  const tradeActions = createTradeActions({
    trades,
    setTrades,
    activeTrade,
    setActiveTrade
  });

  const addTrade = (trade: Trade) => {
    setTrades(prevTrades => [...prevTrades, trade]);
    setActiveTrade(trade);
  };
  
  // Delete an offer 
  const deleteOffer = (offerId: string) => {
    // In a real app, you would call an API to delete the offer
    // Here we're just updating the local state
    setUserOffers(prevOffers => prevOffers.filter(offer => offer.id !== offerId));
    
    toast({
      title: "Offer deleted",
      description: "Your offer has been successfully removed",
    });
  };

  // Create a new offer
  interface CreateOfferData {
    type: string;
    price: number;
    currency: string;
    cryptoCurrency: string;
    available: number;
    min: number;
    max: number;
    paymentMethods: PaymentMethod[];
  }

  const createOffer = (offerData: CreateOfferData) => {
    // Generate a unique ID - in a real app this would be handled by the backend
    const newOfferId = `user-offer-${Date.now()}`;

    // Create new offer object
    const newOffer: Offer = {
      id: newOfferId,
      advertiser: {
        name: "cryptoTrader123", // Using the current user's name
        walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        userId: CURRENT_USER_ID,
        completedTrades: 245,
        completionRate: 99.2,
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=crypto123"
      },
      type: offerData.type as "buy" | "sell",
      price: offerData.price,
      currency: offerData.currency,
      cryptoCurrency: offerData.cryptoCurrency,
      available: offerData.available,
      min: offerData.min,
      max: offerData.max,
      paymentMethods: offerData.paymentMethods,
      createdAt: new Date().toISOString()
    };

    // Update user offers state
    setUserOffers(prevOffers => [...prevOffers, newOffer]);

    toast({
      title: "Offer created",
      description: "Your new listing has been successfully created",
    });

    return newOffer;
  };

  return (
    <TradeContext.Provider value={{
      trades,
      activeTrade,
      setActiveTrade,
      addTrade,
      userOffers,
      deleteOffer,
      createOffer,
      ...tradeActions
    }}>
      {children}
    </TradeContext.Provider>
  );
};

export const useTrade = () => {
  const context = useContext(TradeContext);
  if (context === undefined) {
    throw new Error("useTrade must be used within a TradeProvider");
  }
  return context;
};
