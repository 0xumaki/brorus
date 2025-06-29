
import React from "react";
import { useLanguage } from "@/contexts/language";
import { Button } from "@/components/ui/button";
import { Star, AlertTriangle } from "lucide-react";
import { Trade, TradeStatus } from "../../context/TradeContext";

interface TradeActionsProps {
  trade: Trade;
  onMarkPaid: (tradeId: string) => void;
  onCompleteTrade: (tradeId: string) => void;
  onShowFeedbackDialog: () => void;
  onShowDisputeDialog: () => void;
  onCancelTrade: (tradeId: string) => void;
}

const TradeActions: React.FC<TradeActionsProps> = ({
  trade,
  onMarkPaid,
  onCompleteTrade,
  onShowFeedbackDialog,
  onShowDisputeDialog,
  onCancelTrade
}) => {
  const { t } = useLanguage();
  const { id, tradeType, status, partnerFeedback } = trade;

  // Buy action button
  const getBuyActionButton = () => {
    switch (status) {
      case "pending":
        return (
          <Button 
            onClick={() => onMarkPaid(id)} 
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {t("p2p.mark_paid", "I've Sent Payment")}
          </Button>
        );
      case "paid":
        return <div className="text-center text-sm text-yellow-400">{t("p2p.waiting_release", "Waiting for seller to release crypto")}</div>;
      case "completed":
        return !partnerFeedback ? (
          <Button 
            onClick={onShowFeedbackDialog} 
            className="w-full"
            variant="outline"
          >
            <Star className="mr-2 h-4 w-4" />
            {t("p2p.leave_feedback", "Leave Feedback")}
          </Button>
        ) : (
          <div className="text-center text-sm text-green-400">{t("p2p.feedback_left", "Feedback submitted")}</div>
        );
      default:
        return null;
    }
  };

  // Sell action button
  const getSellActionButton = () => {
    switch (status) {
      case "pending":
        return <div className="text-center text-sm text-yellow-400">{t("p2p.waiting_payment", "Waiting for buyer to send payment")}</div>;
      case "paid":
        return (
          <Button 
            onClick={() => onCompleteTrade(id)} 
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {t("p2p.release_crypto", "Release Crypto")}
          </Button>
        );
      case "completed":
        return !partnerFeedback ? (
          <Button 
            onClick={onShowFeedbackDialog} 
            className="w-full"
            variant="outline"
          >
            <Star className="mr-2 h-4 w-4" />
            {t("p2p.leave_feedback", "Leave Feedback")}
          </Button>
        ) : (
          <div className="text-center text-sm text-green-400">{t("p2p.feedback_left", "Feedback submitted")}</div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-4 space-y-2">
      {tradeType === "buy" ? getBuyActionButton() : getSellActionButton()}
      
      {/* Dispute button - only show for active trades */}
      {(status === "pending" || status === "paid") && (
        <Button 
          variant="outline"
          className="w-full text-red-400 border-red-400/30 hover:bg-red-400/10"
          onClick={onShowDisputeDialog}
        >
          <AlertTriangle className="mr-2 h-4 w-4" />
          {t("p2p.open_dispute", "Open Dispute")}
        </Button>
      )}
      
      {/* Cancel button - only for pending trades */}
      {status === "pending" && (
        <Button 
          variant="outline"
          className="w-full border-white/10"
          onClick={() => onCancelTrade(id)}
        >
          {t("p2p.cancel_trade", "Cancel Trade")}
        </Button>
      )}
    </div>
  );
};

export default TradeActions;
