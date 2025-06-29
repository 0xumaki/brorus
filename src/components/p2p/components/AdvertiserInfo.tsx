
import React, { useState } from "react";
import { useLanguage } from "@/contexts/language";
import { Advertiser } from "../data/offerTypes";
import { Wallet, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatWalletAddress, copyToClipboard } from "../context/tradeUtils";

interface AdvertiserInfoProps {
  advertiser: Advertiser;
}

const AdvertiserInfo: React.FC<AdvertiserInfoProps> = ({ advertiser }) => {
  const { t, formatNumber } = useLanguage();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const success = await copyToClipboard(advertiser.walletAddress);
    
    if (success) {
      setCopied(true);
      toast({
        title: t("common.copied", "Address Copied"),
        description: t("common.clipboard", "Address copied to clipboard"),
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <img 
        src={advertiser.avatarUrl} 
        alt="Trader Avatar"
        className="w-8 h-8 rounded-full" 
      />
      <div>
        <div className="flex items-center">
          <Wallet className="h-3.5 w-3.5 mr-1 text-crystal-primary" />
          <p className="font-medium text-sm">{formatWalletAddress(advertiser.walletAddress)}</p>
          <button
            onClick={handleCopy}
            className="ml-1.5 p-0.5 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Copy address"
          >
            {copied ? 
              <Check size={12} className="text-green-400" /> : 
              <Copy size={12} className="text-gray-400 hover:text-white" />
            }
          </button>
        </div>
        <p className="text-xs text-gray-400">
          {formatNumber(advertiser.completedTrades)} trades | {formatNumber(advertiser.completionRate)}%
        </p>
      </div>
    </div>
  );
};

export default AdvertiserInfo;
