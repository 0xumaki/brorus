
import React from "react";
import { useLanguage } from "@/contexts/language";
import { Tag } from "lucide-react";
import CreateOfferDialog from "./CreateOfferDialog";

const EmptyOfferState: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="glass-card p-8 text-center space-y-4">
      <div className="flex justify-center">
        <Tag className="h-12 w-12 text-crystal-primary opacity-50" />
      </div>
      <p className="text-gray-400 text-lg">{t("p2p.no_listings", "No listings found")}</p>
      <p className="text-sm text-gray-500">
        {t("p2p.create_listing_hint", "Create a new listing to start trading")}
      </p>
      <div className="mt-6">
        <CreateOfferDialog 
          trigger={
            <button className="bg-crystal-primary/20 hover:bg-crystal-primary/30 text-crystal-primary py-2 px-4 rounded-md transition-colors">
              {t("p2p.create_new_listing", "Create New Listing")}
            </button>
          }
        />
      </div>
    </div>
  );
};

export default EmptyOfferState;
