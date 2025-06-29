import React from "react";
import { QrCode, Wallet as WalletIcon, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language";

interface RecipientInputProps {
  address: string;
  setAddress: (address: string) => void;
  isCbdc: boolean;
}

const RecipientInput: React.FC<RecipientInputProps> = ({ 
  address, 
  setAddress, 
  isCbdc 
}) => {
  const { toast } = useToast();
  const { t } = useLanguage();

  return (
    <div className="text-left">
      <label className="text-sm text-gray-300 mb-1 block">
        {t("transfer.recipientAddress")}
      </label>
      <div className="relative">
        <Input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder={"0x..."}
          type={"text"}
          className="bg-white/5 border-white/10 text-white pl-10 pr-10"
        />
        <WalletIcon 
          size={16} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
        />
        <button 
          type="button" 
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
          onClick={() => toast({
            title: t("transfer.qrScanner"),
            description: t("transfer.qrScannerDesc"),
          })}
        >
          <QrCode size={16} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default RecipientInput;
