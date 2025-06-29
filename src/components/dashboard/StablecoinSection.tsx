
import React from "react";
import StablecoinCard from "@/components/dashboard/StablecoinCard";
import { useLanguage } from "@/contexts/language";

interface Coin {
  id: number;
  name: string;
  symbol: string;
  balance: number;
  dollarValue: number;
  percentChange: number;
  iconUrl: string;
}

interface StablecoinSectionProps {
  stablecoins: Coin[];
  title: string;
}

const StablecoinSection: React.FC<StablecoinSectionProps> = ({ stablecoins, title }) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-4 mb-8">
      <h2 className="text-xl font-semibold text-white mb-2 text-left">{title}</h2>
      {stablecoins.map((coin) => (
        <StablecoinCard
          key={coin.id}
          name={coin.name}
          symbol={coin.symbol}
          balance={coin.balance}
          dollarValue={coin.dollarValue}
          percentChange={coin.percentChange}
          iconUrl={coin.iconUrl}
        />
      ))}
    </div>
  );
};

export default StablecoinSection;
