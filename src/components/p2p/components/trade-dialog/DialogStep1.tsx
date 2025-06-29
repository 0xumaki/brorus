
import React, { useState } from "react";
import { Offer, TradeType } from "../../data/offerTypes";
import { useLanguage } from "@/contexts/language";
import { Wallet, Copy, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { formatWalletAddress, copyToClipboard } from "../../context/tradeUtils";

interface DialogStep1Props {
  offer: Offer;
  tradeType: TradeType;
  amount: string;
  setAmount: (amount: string) => void;
  onClose: () => void;
  onNext: () => void;
  isValidAmount: boolean;
}

const DialogStep1: React.FC<DialogStep1Props> = ({ 
  offer, 
  tradeType, 
  amount, 
  setAmount, 
  onClose, 
  onNext,
  isValidAmount
}) => {
  const { t, formatNumber } = useLanguage();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const success = await copyToClipboard(offer.advertiser.walletAddress);
    
    if (success) {
      setCopied(true);
      toast({
        title: t("common.copied", "Address Copied"),
        description: t("common.clipboard", "Address copied to clipboard"),
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const actionType = tradeType === "buy" ? "buy" : "sell";
  const buttonColor = tradeType === "buy" 
    ? "bg-green-600 hover:bg-green-700" 
    : "bg-red-600 hover:bg-red-700";
    
  const amountNumber = parseFloat(amount) || 0;
  const totalValue = amountNumber * offer.price;

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {t(`p2p.${actionType}_crypto`, 
            actionType === "buy" 
              ? "Buy Cryptocurrency" 
              : "Sell Cryptocurrency"
          )}
        </DialogTitle>
        <DialogDescription className="text-gray-400 flex items-center">
          <Wallet className="h-3.5 w-3.5 mr-1" />
          {formatWalletAddress(offer.advertiser.walletAddress)}
          <button
            onClick={handleCopy}
            className="ml-1.5 p-0.5 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Copy address"
          >
            {copied ? 
              <Check size={12} className="text-green-400" /> : 
              <Copy size={12} className="text-gray-400 hover:text-white" />
            }
          </button>
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <label className="text-sm text-gray-400">
            {t("p2p.amount", "Amount")} ({offer.cryptoCurrency})
          </label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`${offer.min} - ${offer.max}`}
            className="bg-white/5 border-white/10"
          />
          <div className="flex justify-between text-xs">
            <span>
              {t("p2p.min", "Min")}: {formatNumber(offer.min)} {offer.cryptoCurrency}
            </span>
            <span>
              {t("p2p.max", "Max")}: {formatNumber(Math.min(offer.max, offer.available))} {offer.cryptoCurrency}
            </span>
          </div>
        </div>

        {amount && (
          <div className="p-3 bg-white/5 rounded-md">
            <p className="text-sm text-gray-400">
              {t("p2p.you_will", "You will")} {
                actionType === "buy" ? t("p2p.pay", "pay") : t("p2p.receive", "receive")
              }
            </p>
            <p className="text-lg font-medium">
              {formatNumber(totalValue)} {offer.currency}
            </p>
            <p className="text-xs text-gray-400">
              {t("p2p.price", "Price")}: {formatNumber(offer.price)} {offer.currency}
            </p>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button 
          variant="outline" 
          onClick={onClose}
          className="w-full border-white/10"
        >
          {t("common.cancel", "Cancel")}
        </Button>
        <Button 
          onClick={onNext}
          disabled={!isValidAmount}
          className={`w-full ${buttonColor}`}
        >
          {t("common.next", "Next")}
        </Button>
      </DialogFooter>
    </>
  );
};

export default DialogStep1;
