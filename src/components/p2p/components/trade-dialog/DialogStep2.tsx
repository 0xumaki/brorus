
import React from "react";
import { Offer, TradeType } from "../../data/offerTypes";
import { useLanguage } from "@/contexts/language";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface DialogStep2Props {
  offer: Offer;
  tradeType: TradeType;
  amount: string;
  onBack: () => void;
  onSubmit: () => void;
}

const DialogStep2: React.FC<DialogStep2Props> = ({ 
  offer, 
  tradeType, 
  amount, 
  onBack, 
  onSubmit 
}) => {
  const { t, formatNumber } = useLanguage();
  
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
          {t("p2p.confirm_order", "Confirm Order")}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="flex items-center justify-center flex-col gap-2 py-4">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
          <p className="text-lg font-medium">
            {actionType === "buy" ? t("p2p.buy", "Buy") : t("p2p.sell", "Sell")} {formatNumber(amountNumber)} {offer.cryptoCurrency}
          </p>
          <p>
            {t("p2p.for_total", "for")} {formatNumber(totalValue)} {offer.currency}
          </p>
        </div>

        <div className="space-y-3 bg-white/5 p-4 rounded-md">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">{t("p2p.price", "Price")}</span>
            <span>{formatNumber(offer.price)} {offer.currency}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">{t("p2p.amount", "Amount")}</span>
            <span>{formatNumber(amountNumber)} {offer.cryptoCurrency}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">{t("p2p.payment_method", "Payment Method")}</span>
            <span>{offer.paymentMethods.map(m => m.name).join(", ")}</span>
          </div>
          <div className="flex justify-between font-medium pt-2 border-t border-white/10">
            <span>{t("p2p.total", "Total")}</span>
            <span>{formatNumber(totalValue)} {offer.currency}</span>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button 
          variant="outline" 
          onClick={onBack}
          className="w-full border-white/10"
        >
          {t("common.back", "Back")}
        </Button>
        <Button 
          onClick={onSubmit}
          className={`w-full ${buttonColor}`}
        >
          {t("p2p.place_order", "Place Order")}
        </Button>
      </DialogFooter>
    </>
  );
};

export default DialogStep2;
