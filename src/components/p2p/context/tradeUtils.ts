
import { Trade, TradeMessage, TradeStatus } from "./types";
import { Copy, Check } from "lucide-react";

// Mock user data (in a real app, this would come from authentication)
export const currentUserId = "user-123";

/**
 * Format wallet address to show first 6 and last 4 characters with 4 dots in between
 */
export const formatWalletAddress = (address: string) => {
  if (!address || address.length < 11) return address;
  return `${address.substring(0, 6)}....${address.substring(address.length - 4)}`;
};

/**
 * Copy text to clipboard and return a promise
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy: ", err);
    return false;
  }
};

/**
 * Creates a system message for trade status updates
 */
export const createSystemMessage = (content: string): TradeMessage => ({
  id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
  senderId: "system",
  content,
  timestamp: new Date().toISOString(),
  isSystem: true
});

/**
 * Updates a trade's status in the trades array
 */
export const updateTradeInArray = (
  trades: Trade[], 
  tradeId: string, 
  updates: Partial<Trade>
): Trade[] => {
  return trades.map(trade => 
    trade.id === tradeId ? { ...trade, ...updates } : trade
  );
};

/**
 * Generates a unique trade ID
 */
export const generateTradeId = (): string => {
  return `trade-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Generates a unique message ID
 */
export const generateMessageId = (): string => {
  return `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};
