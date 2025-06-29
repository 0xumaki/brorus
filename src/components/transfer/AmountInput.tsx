import React from "react";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/language";
import { Currency } from "./data/currencies";
import { Loader2 } from "lucide-react";

interface AmountInputProps {
  amount: string;
  setAmount: (amount: string) => void;
  selectedCurrency: string;
  selectedCurrencyData: Currency | undefined;
  selectedCurrencyBalance?: number | null;
  balanceLoading?: boolean;
}

const AmountInput: React.FC<AmountInputProps> = ({ 
  amount, 
  setAmount, 
  selectedCurrency, 
  selectedCurrencyData, 
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
        {t("transfer.amount", { symbol: selectedCurrency })}
      </label>
      <Input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        type="number"
        placeholder="0.00"
        className="bg-white/5 border-white/10 text-white font-mono"
      />
      
      {/* Balance Display */}
      <div className="text-xs text-wallet-gray-400 mt-2 flex items-center font-medium">
        {balanceLoading ? (
          <>
            <Loader2 size={12} className="mr-1 animate-spin" />
            <span>Loading balance...</span>
          </>
        ) : (
          <span>
            Available: {formatBalance(selectedCurrencyBalance)} {selectedCurrency}
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

export default AmountInput;
