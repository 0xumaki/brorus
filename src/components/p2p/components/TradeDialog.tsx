
import React, { useState } from "react";
import { Offer, TradeType } from "../data/offerTypes";
import { useLanguage } from "@/contexts/language";
import { useToast } from "@/hooks/use-toast";
import { useTrade } from "../context/TradeContext";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import DialogStep1 from "./trade-dialog/DialogStep1";
import DialogStep2 from "./trade-dialog/DialogStep2";
import TradeDetails from "../TradeDetails";
import { TradeStatus } from "../context/types";

interface TradeDialogProps {
  offer: Offer;
  tradeType: TradeType;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const TradeDialog: React.FC<TradeDialogProps> = ({ 
  offer, 
  tradeType, 
  isOpen, 
  setIsOpen 
}) => {
  const { t, formatNumberEnglish } = useLanguage();
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const { addTrade, setActiveTrade } = useTrade();
  const [showTradeDetails, setShowTradeDetails] = useState(false);
  const [createdTradeId, setCreatedTradeId] = useState<string | null>(null);

  const resetDialog = () => {
    setAmount("");
    setStep(1);
    setCreatedTradeId(null);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Only reset if we're not showing trade details
    if (!showTradeDetails) {
      resetDialog();
    }
  };

  const handleNext = () => {
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = () => {
    // Create a new trade
    const amountNumber = parseFloat(amount);
    const total = amountNumber * offer.price;
    
    const newTradeId = `trade-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    const newTrade = {
      id: newTradeId,
      offer,
      amount: amountNumber,
      total,
      tradeType,
      status: "pending" as TradeStatus,
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          senderId: "system",
          content: t(
            "p2p.trade_initiated", 
            "Trade initiated: {action} {amount} {currency}"
          ).replace("{action}", tradeType === "buy" ? "Buying" : "Selling")
           .replace("{amount}", formatNumberEnglish(amountNumber))
           .replace("{currency}", offer.cryptoCurrency),
          timestamp: new Date().toISOString(),
          isSystem: true
        }
      ]
    };
    
    // Add the trade and store its ID
    addTrade(newTrade);
    setCreatedTradeId(newTradeId);
    
    // Show confirmation toast
    const actionType = tradeType === "buy" ? "buy" : "sell";
    toast({
      title: t("p2p.order_placed", "Order placed successfully"),
      description: t(
        "p2p.order_details", 
        `${actionType === "buy" ? "Buying" : "Selling"} ${amount} ${offer.cryptoCurrency} at ${formatNumberEnglish(offer.price)} ${offer.currency}`
      ),
    });
    
    // Close the dialog and immediately show trade details with chat
    setIsOpen(false);
    setShowTradeDetails(true);
  };

  // Close the trade details and reset
  const handleCloseTradeDetails = () => {
    setShowTradeDetails(false);
    resetDialog();
  };

  const amountNumber = parseFloat(amount) || 0;
  const isValidAmount = amountNumber >= offer.min && amountNumber <= Math.min(offer.max, offer.available);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-white max-w-md">
          {step === 1 ? (
            <DialogStep1 
              offer={offer}
              tradeType={tradeType}
              amount={amount}
              setAmount={setAmount}
              onClose={handleClose}
              onNext={handleNext}
              isValidAmount={isValidAmount}
            />
          ) : (
            <DialogStep2 
              offer={offer}
              tradeType={tradeType}
              amount={amount}
              onBack={handleBack}
              onSubmit={handleSubmit}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Trade Details dialog with chat - shown immediately after order placement */}
      {showTradeDetails && createdTradeId && (
        <TradeDetails 
          isOpen={showTradeDetails} 
          onClose={handleCloseTradeDetails}
          tradeId={createdTradeId}
        />
      )}
    </>
  );
};

export default TradeDialog;
