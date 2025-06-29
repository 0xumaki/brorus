import React, { useState } from "react";
import { QrCode, Copy, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language";

const ReceiveAddress: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  
  // Sample wallet address
  const walletAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
  
  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    toast({
      title: t("receive.copied"),
      description: t("receive.clipboard"),
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/")}
          className="mr-2"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-bold">{t("receive.title")}</h1>
      </div>
      
      <div className="glass-card p-6 flex flex-col items-center">
        <div className="glass p-2 mb-6 rounded-2xl">
          <div className="bg-white p-3 rounded-xl">
            <img 
              src="/custom_qr.png" 
              alt="Wallet QR Code" 
              width={180} 
              height={180} 
              className="rounded-xl object-cover" 
            />
          </div>
        </div>
        
        <h3 className="font-medium text-center mb-2">{t("receive.address")}</h3>
        
        <div className="w-full glass p-4 rounded-xl flex items-center justify-between mb-4">
          <span className="text-sm text-gray-300 truncate mr-2">
            {walletAddress}
          </span>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={handleCopy}
            className="h-8 w-8"
          >
            {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
          </Button>
        </div>
        
        <div className="text-center text-sm text-gray-400 max-w-xs">
          <p>{t("receive.share")}</p>
        </div>
        
        <Separator className="my-6 bg-white/10" />
        
        <div className="space-y-2 w-full">
          <h3 className="font-medium text-center mb-1">{t("receive.supported")}</h3>
          <div className="grid grid-cols-2 gap-3">
            {["USDC", "USDT"].map((coin) => (
              <div key={coin} className="glass p-2 rounded-xl flex items-center justify-center">
                <span className="text-sm">{coin}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiveAddress;
