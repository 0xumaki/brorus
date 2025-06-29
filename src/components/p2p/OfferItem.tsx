
import React, { useState } from "react";
import { Offer, TradeType } from "./data/offerTypes";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language";
import AdvertiserInfo from "./components/AdvertiserInfo";
import PaymentMethodBadges from "./components/PaymentMethodBadges";
import TradeDialog from "./components/TradeDialog";
import { useIsMobile } from "@/hooks/use-mobile";

interface OfferItemProps {
  offer: Offer;
  tradeType: TradeType;
}

const OfferItem: React.FC<OfferItemProps> = ({ offer, tradeType }) => {
  const { t, formatNumber } = useLanguage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  // Button styling based on trade type
  const actionType = tradeType === "buy" ? "buy" : "sell";
  const buttonColor = tradeType === "buy" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700";

  if (isMobile) {
    // Mobile layout
    return (
      <>
        <div className="glass-card p-4">
          <div className="space-y-4">
            {/* Advertiser */}
            <AdvertiserInfo advertiser={offer.advertiser} />
            
            {/* Price */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-gray-400 text-left">{t("p2p.price", "Price")}</div>
              <div className="font-medium text-right">
                {formatNumber(offer.price)} {offer.currency}
              </div>
            </div>

            {/* Limits */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-gray-400 text-left">{t("p2p.limit", "Limit")}</div>
              <div className="text-right">
                {formatNumber(offer.min)}-{formatNumber(offer.max)} {offer.cryptoCurrency}
              </div>
            </div>

            {/* Available */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-gray-400 text-left">{t("p2p.available", "Available")}</div>
              <div className="text-right">
                {formatNumber(offer.available)} {offer.cryptoCurrency}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex flex-wrap gap-1 justify-end">
              <PaymentMethodBadges methods={offer.paymentMethods} />
            </div>

            {/* Action Button */}
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className={`w-full mt-2 ${buttonColor}`}
              size="sm"
            >
              {t(`p2p.${actionType}`, actionType === "buy" ? "Buy" : "Sell")}
            </Button>
          </div>
        </div>

        {/* Trade Dialog without wrapping in TradeProvider since it's already in parent */}
        {isDialogOpen && (
          <TradeDialog 
            offer={offer} 
            tradeType={tradeType} 
            isOpen={isDialogOpen} 
            setIsOpen={setIsDialogOpen} 
          />
        )}
      </>
    );
  }

  // Desktop layout
  return (
    <>
      <div className="glass-card p-4">
        <div className="grid grid-cols-7 gap-4 items-center">
          {/* Advertiser */}
          <div className="col-span-2">
            <AdvertiserInfo advertiser={offer.advertiser} />
          </div>

          {/* Price */}
          <div className="font-medium text-left">
            {formatNumber(offer.price)} {offer.currency}
          </div>

          {/* Limits */}
          <div className="text-sm text-left">
            {formatNumber(offer.min)} - {formatNumber(offer.max)} {offer.cryptoCurrency}
          </div>

          {/* Available */}
          <div className="text-sm text-left">
            {formatNumber(offer.available)} {offer.cryptoCurrency}
          </div>

          {/* Payment Methods */}
          <div className="text-left">
            <PaymentMethodBadges methods={offer.paymentMethods} />
          </div>

          {/* Action Button */}
          <div>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className={`w-full ${buttonColor}`}
              size="sm"
            >
              {t(`p2p.${actionType}`, actionType === "buy" ? "Buy" : "Sell")}
            </Button>
          </div>
        </div>
      </div>

      {/* Trade Dialog without wrapping in TradeProvider since it's already in parent */}
      {isDialogOpen && (
        <TradeDialog 
          offer={offer} 
          tradeType={tradeType} 
          isOpen={isDialogOpen} 
          setIsOpen={setIsDialogOpen} 
        />
      )}
    </>
  );
};

export default OfferItem;
