
import { Offer, TradeType, PaymentMethod } from "../data/offerTypes";

export type TradeStatus = "pending" | "paid" | "completed" | "disputed" | "cancelled";

export interface Trade {
  id: string;
  offer: Offer;
  amount: number;
  total: number;
  tradeType: TradeType;
  status: TradeStatus;
  createdAt: string;
  messages: TradeMessage[];
  disputeReason?: string;
  partnerFeedback?: UserFeedback;
}

export interface TradeMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isSystem?: boolean;
}

export interface UserFeedback {
  rating: number; // 1-5
  comment?: string;
  createdAt: string;
}

export interface CreateOfferData {
  type: string;
  price: number;
  currency: string;
  cryptoCurrency: string;
  available: number;
  min: number;
  max: number;
  paymentMethods: PaymentMethod[];
}

export interface TradeContextType {
  trades: Trade[];
  activeTrade: Trade | null;
  setActiveTrade: (trade: Trade | null) => void;
  addTrade: (trade: Trade) => void;
  updateTradeStatus: (tradeId: string, status: TradeStatus) => void;
  addTradeMessage: (tradeId: string, message: TradeMessage) => void;
  markTradePaid: (tradeId: string) => void;
  cancelTrade: (tradeId: string) => void;
  completeTrade: (tradeId: string) => void;
  disputeTrade: (tradeId: string, reason: string) => void;
  leaveFeedback: (tradeId: string, feedback: UserFeedback) => void;
  deleteOffer: (offerId: string) => void;
  createOffer: (data: CreateOfferData) => Offer;
  userOffers: Offer[]; // List of offers owned by the current user
}
