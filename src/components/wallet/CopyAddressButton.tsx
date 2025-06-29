
import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language";
import { copyToClipboard } from "@/components/p2p/context/tradeUtils";

interface CopyAddressButtonProps {
  address: string;
}

const CopyAddressButton: React.FC<CopyAddressButtonProps> = ({ address }) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const success = await copyToClipboard(address);
    
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
    <button
      onClick={handleCopy}
      className="flex items-center justify-center h-full w-auto px-3 transition-colors border-l border-white/10"
      aria-label="Copy address"
      style={{ height: '100%' }}
    >
      {copied ? 
        <Check size={16} className="text-green-400 h-full" /> : 
        <Copy size={16} className="text-gray-300 h-full" />
      }
    </button>
  );
};

export default CopyAddressButton;
