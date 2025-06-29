import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Filter } from "lucide-react";
import { paymentMethods } from "./data/offerTypes";
import { useIsMobile } from "@/hooks/use-mobile";

interface P2PFiltersProps {
  selectedCrypto: string;
  setSelectedCrypto: (crypto: string) => void;
  selectedFiat: string;
  setSelectedFiat: (fiat: string) => void;
  selectedPaymentMethods: number[];
  setSelectedPaymentMethods: (methods: number[]) => void;
}

const P2PFilters: React.FC<P2PFiltersProps> = ({
  selectedCrypto,
  setSelectedCrypto,
  selectedFiat,
  setSelectedFiat,
  selectedPaymentMethods,
  setSelectedPaymentMethods
}) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  const cryptoOptions = ["All", "USDT", "USDC", "CHF", "AUD", "EUR", "CAD", "SGD", "HKD", "INR", "NZD", "MRP", "DEM", "MX", "ZAR", "THB"];
  const fiatOptions = ["All", "CHF", "AUD", "EUR", "CAD", "SGD", "HKD", "INR", "NZD", "MRP", "DEM", "MX", "ZAR", "THB"];

  const togglePaymentMethod = (id: number) => {
    if (selectedPaymentMethods.includes(id)) {
      setSelectedPaymentMethods(selectedPaymentMethods.filter(m => m !== id));
    } else {
      setSelectedPaymentMethods([...selectedPaymentMethods, id]);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
      <div className="flex flex-1 gap-2">
        {/* Crypto Currency Selector */}
        <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
          <SelectTrigger className="flex-1 min-w-[110px] h-10 sm:h-auto bg-white/5 border-white/10">
            <SelectValue placeholder={t("p2p.select_crypto", "Crypto")} />
          </SelectTrigger>
          <SelectContent className="bg-black/90 border-white/10">
            {cryptoOptions.map(crypto => (
              <SelectItem key={crypto} value={crypto}>
                {crypto}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Fiat Currency Selector */}
        <Select value={selectedFiat} onValueChange={setSelectedFiat}>
          <SelectTrigger className="flex-1 min-w-[110px] h-10 sm:h-auto bg-white/5 border-white/10">
            <SelectValue placeholder={t("p2p.select_fiat", "Fiat")} />
          </SelectTrigger>
          <SelectContent className="bg-black/90 border-white/10">
            {fiatOptions.map(fiat => (
              <SelectItem key={fiat} value={fiat}>
                {fiat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Payment Methods Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="bg-white/5 border-white/10 hover:bg-white/10 h-10 sm:h-auto"
            size={isMobile ? "sm" : "default"}
          >
            <Filter className="h-4 w-4 mr-2" />
            {isMobile ? t("p2p.filters", "Filters") : t("p2p.payment_methods", "Payment Methods")}
            {selectedPaymentMethods.length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-crystal-primary/20 text-crystal-primary rounded-full">
                {selectedPaymentMethods.length}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-64 bg-black/90 border-white/10"
          align="end"
        >
          <div className="space-y-4">
            <h4 className="font-medium">{t("p2p.select_payment", "Select Payment Methods")}</h4>
            <div className="space-y-2">
              {paymentMethods.map(method => (
                <div key={method.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`method-${method.id}`}
                    checked={selectedPaymentMethods.includes(method.id)}
                    onCheckedChange={() => togglePaymentMethod(method.id)}
                  />
                  <Label 
                    htmlFor={`method-${method.id}`}
                    className="text-sm flex items-center cursor-pointer"
                  >
                    <span className="mr-2">{method.icon}</span>
                    {method.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default P2PFilters;
