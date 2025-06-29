
import React from "react";
import { Offer, TradeType } from "./data/offerTypes";
import OfferItem from "./OfferItem";
import { useLanguage } from "@/contexts/language";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Info } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface OfferListProps {
  offers: Offer[];
  tradeType: TradeType;
}

const OfferList: React.FC<OfferListProps> = ({ offers, tradeType }) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  // Explicitly define translations to ensure they're correct
  const advertiserText = t("p2p.advertiser") || "Advertiser";
  const priceText = t("p2p.price") || "Price";
  const limitText = t("p2p.limit") || "Limit";
  const availableText = t("p2p.available") || "Available";
  const paymentText = t("p2p.payment") || "Payment";
  const actionText = t("p2p.action") || "Action";
  const priceTooltipText = t("p2p.price_tooltip") || "The price per unit of cryptocurrency in the selected fiat currency";
  const noOffersText = t("p2p.no_offers") || "No offers available with the selected filters.";
  const tryDifferentText = t("p2p.try_different") || "Try different filter settings or check back later.";

  if (offers.length === 0) {
    return (
      <div className="glass-card p-4 sm:p-8 text-center">
        <p className="text-gray-400 mb-2">
          {noOffersText}
        </p>
        <p className="text-sm text-gray-500">
          {tryDifferentText}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header - Only show on desktop */}
      {!isMobile && (
        <div className="grid grid-cols-7 gap-4 px-4 py-2 text-sm text-gray-400 font-medium">
          <div className="col-span-2 text-left">{advertiserText}</div>
          <div className="flex items-center gap-1 text-left">
            {priceText}
            <HoverCard>
              <HoverCardTrigger asChild>
                <Info className="h-3.5 w-3.5 text-gray-500 cursor-help" />
              </HoverCardTrigger>
              <HoverCardContent className="w-60 p-3 text-sm bg-black/90 border-white/10">
                {priceTooltipText}
              </HoverCardContent>
            </HoverCard>
          </div>
          <div className="text-left">{limitText}</div>
          <div className="text-left">{availableText}</div>
          <div className="text-left">{paymentText}</div>
          <div className="text-left">{actionText}</div>
        </div>
      )}

      {/* Offer Items */}
      <div className="space-y-2">
        {offers.map(offer => (
          <OfferItem key={offer.id} offer={offer} tradeType={tradeType} />
        ))}
      </div>
    </div>
  );
};

export default OfferList;
