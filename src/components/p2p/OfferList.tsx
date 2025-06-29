import React from "react";
import { Offer, TradeType } from "./data/offerTypes";
import OfferItem from "./OfferItem";
import { useLanguage } from "@/contexts/language";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Info } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis
} from "@/components/ui/pagination";

interface OfferListProps {
  offers: Offer[];
  tradeType: TradeType;
}

const OFFERS_PER_PAGE = 10;

const OfferList: React.FC<OfferListProps> = ({ offers, tradeType }) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [page, setPage] = React.useState(1);
  const totalPages = Math.ceil(offers.length / OFFERS_PER_PAGE);
  const paginatedOffers = offers.slice((page - 1) * OFFERS_PER_PAGE, page * OFFERS_PER_PAGE);

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
        {paginatedOffers.map(offer => (
          <OfferItem key={offer.id} offer={offer} tradeType={tradeType} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center w-full">
          <div className="glass-card px-4 py-3 mt-6 rounded-xl shadow-lg border border-white/10 bg-white/5 backdrop-blur-md flex items-center w-full max-w-xl mx-auto">
            <Pagination className="m-0 w-full flex justify-center">
              <PaginationContent className="flex-wrap w-full justify-center items-center">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={e => { e.preventDefault(); setPage(p => Math.max(1, p - 1)); }}
                    aria-disabled={page === 1}
                    className={`transition-all ${page === 1 ? 'pointer-events-none opacity-50' : ''}`}
                  />
                </PaginationItem>
                {/* Show up to 2 pages before and after current, with ellipsis if needed */}
                {page > 3 && (
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={e => { e.preventDefault(); setPage(1); }}
                      className="rounded-lg mx-1 px-3 py-2 font-semibold bg-white/10 text-white/80 hover:bg-white/20 border border-white/10 backdrop-blur-sm"
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                )}
                {page > 4 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                {Array.from({ length: totalPages }).map((_, idx) => {
                  if (
                    idx + 1 === 1 ||
                    idx + 1 === totalPages ||
                    (idx + 1 >= page - 2 && idx + 1 <= page + 2)
                  ) {
                    return (
                      <PaginationItem key={idx}>
                        <PaginationLink
                          href="#"
                          isActive={page === idx + 1}
                          onClick={e => { e.preventDefault(); setPage(idx + 1); }}
                          className={`rounded-lg mx-1 px-3 py-2 font-semibold transition-all ${page === idx + 1 ? 'bg-crystal-primary text-white shadow-md border border-crystal-primary' : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/10'} backdrop-blur-sm`}
                        >
                          {idx + 1}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  return null;
                })}
                {page < totalPages - 3 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                {page < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={e => { e.preventDefault(); setPage(totalPages); }}
                      className="rounded-lg mx-1 px-3 py-2 font-semibold bg-white/10 text-white/80 hover:bg-white/20 border border-white/10 backdrop-blur-sm"
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={e => { e.preventDefault(); setPage(p => Math.min(totalPages, p + 1)); }}
                    aria-disabled={page === totalPages}
                    className={`transition-all ${page === totalPages ? 'pointer-events-none opacity-50' : ''}`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferList;
