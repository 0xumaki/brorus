
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/language";
import { useTrade, Trade, UserFeedback, TradeMessage } from "./context/TradeContext";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
} from "@/components/ui/dialog";
import { formatTimeDifference } from "./utils/dateUtils";
import { useIsMobile } from "@/hooks/use-mobile";

// Import refactored components
import TradeStatus from "./components/trade-details/TradeStatus";
import TradeInfo from "./components/trade-details/TradeInfo";
import TradeActions from "./components/trade-details/TradeActions";
import TradeChat from "./components/trade-details/TradeChat";
import DisputeDialog from "./components/trade-details/DisputeDialog";
import FeedbackDialog from "./components/trade-details/FeedbackDialog";

interface TradeDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  tradeId?: string | null; // Optional trade ID to show specific trade
}

const TradeDetails: React.FC<TradeDetailsProps> = ({ isOpen, onClose, tradeId }) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const { 
    trades,
    activeTrade, 
    setActiveTrade,
    addTradeMessage, 
    markTradePaid, 
    cancelTrade, 
    completeTrade,
    disputeTrade,
    leaveFeedback
  } = useTrade();
  
  const [showDisputeDialog, setShowDisputeDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  
  // Set the active trade if tradeId is provided
  useEffect(() => {
    if (tradeId && isOpen) {
      const trade = trades.find(t => t.id === tradeId);
      if (trade) {
        setActiveTrade(trade);
      }
    }
  }, [tradeId, isOpen, trades, setActiveTrade]);
  
  // Reset dialogs when trade changes or dialog closes
  useEffect(() => {
    setShowDisputeDialog(false);
    setShowFeedbackDialog(false);
  }, [activeTrade, isOpen]);
  
  // Early return with a loading indicator if there's no active trade
  if (!activeTrade && isOpen) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-black/90 border-white/10 max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {t("p2p.trade_details", "Trade Details")}
            </DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center">
            <p>{t("p2p.loading", "Loading trade details...")}</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  if (!activeTrade) return null;
  
  // Handler functions
  const handleSendMessage = (tradeId: string, content: string) => {
    addTradeMessage(tradeId, {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      senderId: "user-123", // In a real app, get from auth context
      content,
      timestamp: new Date().toISOString()
    });
  };
  
  const handleDisputeSubmit = (reason: string) => {
    disputeTrade(activeTrade.id, reason);
    setShowDisputeDialog(false);
  };
  
  const handleFeedbackSubmit = (feedback: UserFeedback) => {
    leaveFeedback(activeTrade.id, feedback);
    setShowFeedbackDialog(false);
  };
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={`bg-black/90 border-white/10 max-w-4xl ${isMobile ? 'max-h-[95vh] h-[95vh] p-3' : 'max-h-[90vh]'} overflow-hidden flex flex-col`}>
          <DialogHeader className={isMobile ? 'mb-2' : ''}>
            <DialogTitle className={`${isMobile ? 'text-lg' : 'text-xl'} flex items-center justify-between`}>
              <div>
                {t("p2p.trade_details", "Trade Details")}
                <span className="ml-2 text-sm font-normal">#{activeTrade.id.slice(0, 8)}</span>
              </div>
              <TradeStatus status={activeTrade.status} />
            </DialogTitle>
            <div className="text-sm text-gray-400">
              {formatTimeDifference(new Date(activeTrade.createdAt))}
            </div>
          </DialogHeader>
          
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-1 md:grid-cols-3 gap-4'} pb-4 flex-grow overflow-hidden`}>
            {/* Left column - Trade details */}
            <div className={`${isMobile ? '' : 'md:col-span-1'} space-y-2 overflow-y-auto`}>
              <TradeInfo trade={activeTrade} />
              
              {/* Action buttons */}
              <TradeActions 
                trade={activeTrade}
                onMarkPaid={markTradePaid}
                onCompleteTrade={completeTrade}
                onShowDisputeDialog={() => setShowDisputeDialog(true)}
                onShowFeedbackDialog={() => setShowFeedbackDialog(false)}
                onCancelTrade={cancelTrade}
              />
            </div>
            
            {/* Right column - Chat - increased height for better usability */}
            <div className={`${isMobile ? '' : 'md:col-span-2'} flex flex-col ${isMobile ? 'h-[55vh]' : 'h-[65vh]'} overflow-hidden`}>
              <TradeChat 
                trade={activeTrade}
                onSendMessage={handleSendMessage}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Dispute Dialog */}
      <DisputeDialog 
        isOpen={showDisputeDialog}
        onClose={() => setShowDisputeDialog(false)}
        onSubmit={handleDisputeSubmit}
      />
      
      {/* Feedback Dialog */}
      <FeedbackDialog 
        isOpen={showFeedbackDialog}
        onClose={() => setShowFeedbackDialog(false)}
        onSubmit={handleFeedbackSubmit}
      />
    </>
  );
};

export default TradeDetails;
