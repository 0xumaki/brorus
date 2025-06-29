import React from "react";
import { useLanguage } from "@/contexts/language";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import WalletAddressForm from "./WalletAddressForm";
import { WalletAddress } from "./types";

interface WalletAddressDialogProps {
  onAddAddress: (address: WalletAddress) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const WalletAddressDialog: React.FC<WalletAddressDialogProps> = ({ onAddAddress, isOpen, setIsOpen }) => {
  const { t } = useLanguage();
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start text-sm hover:bg-white/10 mt-1 gap-2"
        >
          <Plus size={14} />
          {t("wallet.add_address", "Add New Address")}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/90 border-white/20 backdrop-blur-md text-white">
        <DialogHeader>
          <DialogTitle>{t("wallet.add_new_address", "Add New Wallet Address")}</DialogTitle>
        </DialogHeader>
        <WalletAddressForm onAddAddress={onAddAddress} onClose={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default WalletAddressDialog;
