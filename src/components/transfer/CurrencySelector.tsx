import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/language";
import { Currency } from "./data/currencies";
import { Loader2 } from "lucide-react";

interface CurrencySelectorProps {
  currencies: Currency[];
  selectedCurrency: string;
  onCurrencyChange: (value: string) => void;
  selectedCurrencyBalance?: number | null;
  balanceLoading?: boolean;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ 
  currencies, 
  selectedCurrency, 
  onCurrencyChange,
  selectedCurrencyBalance,
  balanceLoading
}) => {
  const { t, formatNumberEnglish } = useLanguage();

  const formatBalance = (balance: number | null) => {
    if (balance === null) return "N/A";
    return formatNumberEnglish ? formatNumberEnglish(balance) : balance.toFixed(2);
  };

  return (
    <div className="text-left">
      <label className="text-sm text-gray-300 mb-1 block font-medium">
        {t("transfer.selectCurrency")}
      </label>
      <Select value={selectedCurrency} onValueChange={onCurrencyChange}>
        <SelectTrigger className="bg-white/5 border-white/10 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-background/95 backdrop-blur-sm border-white/10">
          {currencies.length > 0 && (
            <>
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Stablecoins
              </div>
              {currencies
                .filter(currency => currency.type === "stablecoin")
                .map((currency) => (
                  <SelectItem key={currency.id} value={currency.symbol}>
                    <div className="flex items-center">
                      <div className="w-5 h-5 rounded-full overflow-hidden mr-2 bg-white/10 flex items-center justify-center">
                        <img
                          src={currency.iconUrl}
                          alt={currency.name}
                          className="w-4 h-4"
                        />
                      </div>
                      <span className="font-medium">{currency.name}</span>
                    </div>
                  </SelectItem>
                ))}
              
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-400 uppercase mt-2 tracking-wide">
                CBDCs
              </div>
              {currencies
                .filter(currency => currency.type === "cbdc")
                .map((currency) => (
                  <SelectItem key={currency.id} value={currency.symbol}>
                    <div className="flex items-center">
                      <div className="w-5 h-5 rounded-full overflow-hidden mr-2 bg-white/10 flex items-center justify-center">
                        <img
                          src={currency.iconUrl}
                          alt={currency.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-medium">{currency.name}</span>
                    </div>
                  </SelectItem>
                ))}
            </>
          )}
        </SelectContent>
      </Select>
      
      {/* Balance Display */}
      <div className="text-xs text-wallet-gray-400 mt-2 flex items-center font-medium">
        {balanceLoading ? (
          <>
            <Loader2 size={12} className="mr-1 animate-spin" />
            <span>Loading balance...</span>
          </>
        ) : (
          <span>
            Balance: {formatBalance(selectedCurrencyBalance)} {selectedCurrency}
          </span>
        )}
      </div>
      
      {/* Network Warning */}
      {!balanceLoading && selectedCurrencyBalance === null && ["USDT", "USDC", "CHF", "AUD"].includes(selectedCurrency) && (
        <div className="text-xs text-yellow-500 mt-1 font-medium">
          Switch to Sepolia testnet to see real balance
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
