
import React from "react";
import { ArrowUp, ArrowDown, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/language";

interface TransactionItemProps {
  type: "send" | "receive" | "pending";
  amount: number;
  symbol: string;
  address: string;
  timestamp: string;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  type,
  amount,
  symbol,
  address,
  timestamp,
}) => {
  const { t, formatNumber } = useLanguage();

  const getIcon = () => {
    switch (type) {
      case "send":
        return <ArrowUp size={16} className="text-red-400" />;
      case "receive":
        return <ArrowDown size={16} className="text-green-400" />;
      case "pending":
        return <Clock size={16} className="text-yellow-400" />;
      default:
        return null;
    }
  };

  const getLabel = () => {
    switch (type) {
      case "send":
        return t("tx.sent");
      case "receive":
        return t("tx.received");
      case "pending":
        return t("tx.pending");
      default:
        return "";
    }
  };

  const shortAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <div className="flex items-center p-3 hover:bg-white/5 rounded-xl transition-colors">
      <div className="w-10 h-10 rounded-full glass flex items-center justify-center mr-3">
        {getIcon()}
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between">
          <h4 className="font-medium text-white">{getLabel()}</h4>
          <p className={`font-medium ${
            type === "send" 
              ? "text-red-400" 
              : type === "receive" 
                ? "text-green-400" 
                : "text-white"
          }`}>
            {type === "send" ? "-" : "+"}{formatNumber(amount)} {symbol}
          </p>
        </div>
        
        <div className="flex justify-between mt-1">
          <p className="text-xs text-gray-400">{shortAddress(address)}</p>
          <p className="text-xs text-gray-400">{timestamp}</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
