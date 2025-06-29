
import { Trade, TradeMessage, TradeStatus, UserFeedback } from "./types";
import { createSystemMessage, updateTradeInArray } from "./tradeUtils";

export interface TradeActionsProps {
  trades: Trade[];
  setTrades: React.Dispatch<React.SetStateAction<Trade[]>>;
  activeTrade: Trade | null;
  setActiveTrade: React.Dispatch<React.SetStateAction<Trade | null>>;
}

export const createTradeActions = ({
  trades,
  setTrades,
  activeTrade,
  setActiveTrade
}: TradeActionsProps) => {
  const updateTradeStatus = (tradeId: string, status: TradeStatus) => {
    const updatedTrades = updateTradeInArray(trades, tradeId, { status });
    setTrades(updatedTrades);
    
    if (activeTrade && activeTrade.id === tradeId) {
      setActiveTrade({ ...activeTrade, status });
    }
  };

  const addTradeMessage = (tradeId: string, message: TradeMessage) => {
    const updatedTrades = trades.map(trade => 
      trade.id === tradeId ? 
      { ...trade, messages: [...trade.messages, message] } : 
      trade
    );
    
    setTrades(updatedTrades);
    
    if (activeTrade && activeTrade.id === tradeId) {
      setActiveTrade({
        ...activeTrade,
        messages: [...activeTrade.messages, message]
      });
    }
  };

  const markTradePaid = (tradeId: string) => {
    updateTradeStatus(tradeId, "paid");
    
    // Add system message
    const systemMessage = createSystemMessage(
      "Payment has been marked as sent. Please confirm receipt and release the crypto."
    );
    
    addTradeMessage(tradeId, systemMessage);
  };

  const cancelTrade = (tradeId: string) => {
    updateTradeStatus(tradeId, "cancelled");
    
    // Add system message
    const systemMessage = createSystemMessage(
      "Trade has been cancelled."
    );
    
    addTradeMessage(tradeId, systemMessage);
  };

  const completeTrade = (tradeId: string) => {
    updateTradeStatus(tradeId, "completed");
    
    // Add system message
    const systemMessage = createSystemMessage(
      "Trade has been completed successfully. Funds have been released."
    );
    
    addTradeMessage(tradeId, systemMessage);
  };

  const disputeTrade = (tradeId: string, reason: string) => {
    const updatedTrades = updateTradeInArray(
      trades, 
      tradeId, 
      { status: "disputed", disputeReason: reason }
    );
    
    setTrades(updatedTrades);
    
    if (activeTrade && activeTrade.id === tradeId) {
      setActiveTrade({ 
        ...activeTrade, 
        status: "disputed", 
        disputeReason: reason 
      });
    }
    
    // Add system message
    const systemMessage = createSystemMessage(
      `A dispute has been opened: "${reason}". Our team will review the case.`
    );
    
    addTradeMessage(tradeId, systemMessage);
  };

  const leaveFeedback = (tradeId: string, feedback: UserFeedback) => {
    const updatedTrades = updateTradeInArray(
      trades, 
      tradeId, 
      { partnerFeedback: feedback }
    );
    
    setTrades(updatedTrades);
    
    if (activeTrade && activeTrade.id === tradeId) {
      setActiveTrade({ ...activeTrade, partnerFeedback: feedback });
    }
  };

  return {
    updateTradeStatus,
    addTradeMessage,
    markTradePaid,
    cancelTrade,
    completeTrade,
    disputeTrade,
    leaveFeedback
  };
};
