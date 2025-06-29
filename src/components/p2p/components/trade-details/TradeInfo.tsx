
import React, { useState } from "react";
import { useLanguage } from "@/contexts/language";
import { Trade } from "../../context/TradeContext";
import PaymentMethodBadges from "../PaymentMethodBadges";
import AdvertiserInfo from "../AdvertiserInfo";
import { formatWalletAddress } from "../../context/tradeUtils";

interface TradeInfoProps {
  trade: Trade;
}

const TradeInfo: React.FC<TradeInfoProps> = ({ trade }) => {
  const { t, formatNumber } = useLanguage();
  const { offer, amount, total, tradeType } = trade;

  return (
    <div className="glass-card p-4">
      <h3 className="font-medium mb-3 flex items-center">
        {t(tradeType === "buy" ? "p2p.buying" : "p2p.selling", 
           tradeType === "buy" ? "Buying" : "Selling")}
      </h3>
      
      <div className="space-y-3">
        <div>
          <p className="text-gray-400 text-sm">{t("p2p.amount", "Amount")}</p>
          <p className="font-medium">
            {formatNumber(amount)} {offer.cryptoCurrency}
          </p>
        </div>
        
        <div>
          <p className="text-gray-400 text-sm">{t("p2p.price", "Price")}</p>
          <p className="font-medium">
            {formatNumber(offer.price)} {offer.currency}
          </p>
        </div>
        
        <div>
          <p className="text-gray-400 text-sm">{t("p2p.total", "Total")}</p>
          <p className="font-medium">
            {formatNumber(total)} {offer.currency}
          </p>
        </div>
        
        <div>
          <p className="text-gray-400 text-sm">{t("p2p.payment_method", "Payment Method")}</p>
          <div className="mt-1">
            <PaymentMethodBadges methods={offer.paymentMethods} />
          </div>
        </div>
        
        <div>
          <p className="text-gray-400 text-sm">{t("p2p.advertiser", "Advertiser")}</p>
          <div className="mt-1">
            <AdvertiserInfo advertiser={offer.advertiser} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeInfo;
