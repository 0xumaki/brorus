
import React from "react";
import { useLanguage } from "@/contexts/language";
import { Trash2, AlertCircle, Tag, Wallet, CircleDollarSign, Sparkles, Star, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Offer } from "../../data/offerTypes";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useIsMobile } from "@/hooks/use-mobile";

interface OfferCardProps {
  offer: Offer;
  onDelete: (id: string) => void;
}

const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  onDelete
}) => {
  const {
    t,
    formatNumber
  } = useLanguage();
  const isMobile = useIsMobile();
  const typeColor = offer.type === 'buy' ? 'from-emerald-500/30 to-teal-600/20 border-emerald-500/30 shadow-emerald-500/10 shadow-lg' : 'from-rose-500/30 to-red-600/20 border-rose-500/30 shadow-rose-500/10 shadow-lg';
  const badgeColor = offer.type === 'buy' ? 'bg-emerald-500/30 text-emerald-400 dark:text-emerald-300' : 'bg-rose-500/30 text-rose-400 dark:text-rose-300';
  const shimmerClass = "relative overflow-hidden after:absolute after:inset-0 after:translate-x-[-100%] after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent hover:after:animate-shimmer";
  
  return (
    <div className={`glass-card p-4 sm:p-6 bg-gradient-to-br ${typeColor} border hover:scale-[1.01] sm:hover:scale-[1.03] hover:shadow-2xl hover:border-white/30 transition-all duration-300 ${shimmerClass} group w-full`}>
      <div className="space-y-3 sm:space-y-5 relative">
        <div className="flex justify-between items-start mb-1">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <div className={`flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full ${badgeColor} group-hover:bg-opacity-70`}>
              <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="font-medium text-xs sm:text-sm capitalize">
                {offer.type === 'buy' ? t("p2p.buy") : t("p2p.sell")}
              </span>
            </div>
            <Badge variant="outline" className="bg-black/40 text-xs border-none group-hover:bg-black/50">
              {offer.cryptoCurrency}
            </Badge>
            <div className="flex items-center text-xs text-gray-400 ml-0.5 sm:ml-2">
              <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1 inline" /> 
              <span className="text-[10px] sm:text-xs">24h</span>
            </div>
          </div>
          
          <DeleteOfferButton offerId={offer.id} onDelete={onDelete} />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="flex items-center bg-black/30 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full group-hover:bg-black/50 transition-colors">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 mr-1 sm:mr-1.5 group-hover:animate-pulse" />
              <span className="text-[10px] sm:text-xs font-medium text-gray-200">
                {offer.type === 'buy' ? t("p2p.buy_instantly") : t("p2p.sell_instantly")}
              </span>
            </div>
          </div>
          <OfferRating />
        </div>
        
        <div className="mt-3 sm:mt-6 group-hover:transform group-hover:translate-y-[-2px] transition-transform">
          <OfferPriceCard offer={offer} />
        </div>
          
        <div className="mt-3 pt-2 sm:mt-6 sm:pt-2 border-t border-white/10 group-hover:border-white/20 transition-colors">
          <OfferPaymentMethods offer={offer} />
        </div>

        <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-16 h-16 sm:w-24 sm:h-24 bg-crystal-primary/10 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity pointer-events-none"></div>
      </div>
    </div>
  );
};

const DeleteOfferButton: React.FC<{
  offerId: string;
  onDelete: (id: string) => void;
}> = ({
  offerId,
  onDelete
}) => {
  const {
    t
  } = useLanguage();
  return <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10 scale-90 sm:scale-100">
          <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-black/90 border-white/10 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            {t("p2p.delete_confirmation")}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            {t("p2p.delete_warning")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent border-white/10 hover:bg-white/5 text-white">
            {t("p2p.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={() => onDelete(offerId)}>
            {t("p2p.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>;
};

const OfferRating: React.FC = () => {
  return <div className="flex items-center scale-90 sm:scale-100">
      <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 mr-0.5 sm:mr-1" />
      <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 mr-0.5 sm:mr-1" />
      <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 mr-0.5 sm:mr-1" />
      <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 mr-0.5 sm:mr-1" />
      <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500" />
    </div>;
};

const OfferPriceCard: React.FC<{
  offer: Offer;
}> = ({
  offer
}) => {
  const {
    t,
    formatNumber
  } = useLanguage();
  const isMobile = useIsMobile();
  
  return <div className="mt-1 p-3 sm:p-4 rounded-xl bg-black/30 border border-white/5">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="p-1 sm:p-1.5 rounded-full bg-crystal-primary/20">
            <CircleDollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-crystal-primary" />
          </div>
          <span className="text-gray-400 text-xs sm:text-sm">{t("p2p.price")}</span>
        </div>
        <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
          {formatNumber(offer.price)} <span className="text-gray-400 text-sm sm:text-base">{offer.currency}</span>
        </span>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="w-full sm:flex-1">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
            <div className="p-1 sm:p-1.5 rounded-full bg-crystal-primary/20">
              <Wallet className="w-3 h-3 sm:w-4 sm:h-4 text-crystal-primary" />
            </div>
            <span className="text-gray-400 text-xs sm:text-sm">{t("p2p.available")}</span>
          </div>
          <div className="pl-6 sm:pl-8 px-0 text-left">
            <span className="font-medium text-base sm:text-lg">
              {formatNumber(offer.available)} 
              <span className="text-[10px] sm:text-xs text-gray-400 ml-1">{offer.cryptoCurrency}</span>
            </span>
          </div>
        </div>

        <div className="w-full sm:flex-1">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
            <div className="p-1 sm:p-1.5 rounded-full bg-crystal-primary/20">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-crystal-primary" />
            </div>
            <span className="text-gray-400 text-xs sm:text-sm">{t("p2p.limit")}</span>
          </div>
          <div className="pl-6 sm:pl-8 text-left">
            <span className="font-medium text-base sm:text-lg">
              {formatNumber(offer.min)}-{formatNumber(offer.max)} 
              <span className="text-[10px] sm:text-xs text-gray-400 ml-1">{offer.cryptoCurrency}</span>
            </span>
          </div>
        </div>
      </div>
    </div>;
};

const OfferPaymentMethods: React.FC<{
  offer: Offer;
}> = ({
  offer
}) => {
  const {
    t
  } = useLanguage();
  return <div>
      <div className="flex items-center gap-2 mb-1 sm:mb-2">
        <span className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wider font-medium">{t("p2p.payment_methods")}</span>
      </div>
      <div className="flex flex-wrap gap-1 sm:gap-1.5">
        {offer.paymentMethods.map(method => <span key={method.id} className="text-[10px] sm:text-xs bg-white/10 hover:bg-white/15 transition-colors px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-white/10 flex items-center gap-1 sm:gap-1.5">
            <span className="text-crystal-primary">{method.icon}</span> 
            <span>{method.name}</span>
          </span>)}
      </div>
    </div>;
};

export default OfferCard;
