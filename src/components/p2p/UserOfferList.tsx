import React from "react";
import { useTrade } from "./context/TradeContext";
import EmptyOfferState from "./components/user-offers/EmptyOfferState";
import OfferCard from "./components/user-offers/OfferCard";
import CreateOfferDialog from "./components/user-offers/CreateOfferDialog";
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

const OFFERS_PER_PAGE = 10;

const UserOfferList: React.FC = () => {
  const { userOffers, deleteOffer } = useTrade();
  const isMobile = useIsMobile();
  const [page, setPage] = React.useState(1);
  const totalPages = Math.ceil(userOffers.length / OFFERS_PER_PAGE);
  const paginatedOffers = userOffers.slice((page - 1) * OFFERS_PER_PAGE, page * OFFERS_PER_PAGE);

  if (userOffers.length === 0) {
    return <EmptyOfferState />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">My Listings</h2>
        <CreateOfferDialog />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paginatedOffers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} onDelete={deleteOffer} />
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

export default UserOfferList;
