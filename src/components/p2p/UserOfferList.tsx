
import React from "react";
import { useTrade } from "./context/TradeContext";
import EmptyOfferState from "./components/user-offers/EmptyOfferState";
import OfferCard from "./components/user-offers/OfferCard";
import CreateOfferDialog from "./components/user-offers/CreateOfferDialog";
import { useIsMobile } from "@/hooks/use-mobile";

const UserOfferList: React.FC = () => {
  const { userOffers, deleteOffer } = useTrade();
  const isMobile = useIsMobile();

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
        {userOffers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} onDelete={deleteOffer} />
        ))}
      </div>
    </div>
  );
};

export default UserOfferList;
