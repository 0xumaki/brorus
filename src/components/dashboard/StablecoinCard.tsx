import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/language";

interface StablecoinCardProps {
  name: string;
  symbol: string;
  balance: number;
  dollarValue: number;
  percentChange: number;
  iconUrl: string;
}

const StablecoinCard: React.FC<StablecoinCardProps> = ({
  name,
  symbol,
  balance,
  dollarValue,
  percentChange,
  iconUrl,
}) => {
  const navigate = useNavigate();
  const isPositive = percentChange >= 0;
  const { t, formatNumber, formatCurrency } = useLanguage();

  // Function to get fallback icon URL if the main one fails
  const getFallbackIconUrl = (symbol: string) => {
    if (symbol === "USDT") {
      return "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/usdt.svg";
    } else if (symbol === "USDC") {
      return "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/usdc.svg";
    }
    return iconUrl;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate('/transfer')}
      className="glass-card p-4 relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 active:scale-[0.98]"
    >
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 rounded-full mr-3 overflow-hidden shadow-lg border border-white/20 flex items-center justify-center bg-white/10 backdrop-blur-sm">
          <img 
            src={iconUrl} 
            alt={symbol} 
            className={`${symbol === "USDT" || symbol === "USDC" ? "w-6 h-6" : "w-full h-full object-cover"}`}
            onError={(e) => {
              // If the image fails to load, try the fallback URL
              const target = e.target as HTMLImageElement;
              if (target.src !== getFallbackIconUrl(symbol)) {
                target.src = getFallbackIconUrl(symbol);
              }
            }}
          />
        </div>
        <div className="text-left">
          <h3 className="font-medium text-white">{name}</h3>
          <p className="text-xs text-gray-300">{symbol}</p>
        </div>
        <div className="ml-auto">
          <div
            className={`flex items-center text-xs px-2 py-1 rounded-full ${
              isPositive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight size={12} className="mr-1" />
            ) : (
              <ArrowDownRight size={12} className="mr-1" />
            )}
            {formatNumber(Math.abs(percentChange), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
          </div>
        </div>
      </div>
      
      <div className="mt-2 text-left">
        <p className="text-2xl font-semibold text-white">{formatNumber(balance)} {symbol}</p>
      </div>
      
      <div 
        className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-10"
        style={{
          background: `radial-gradient(circle, ${isPositive ? 'rgba(74, 222, 128, 0.6)' : 'rgba(248, 113, 113, 0.6)'} 0%, transparent 70%)`,
        }}
      />
    </motion.div>
  );
};

export default StablecoinCard;
