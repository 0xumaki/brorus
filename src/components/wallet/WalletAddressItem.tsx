
import React from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { WalletAddress } from "./types";

interface WalletAddressItemProps {
  walletAddress: WalletAddress;
  onSelectAddress: (address: string) => void;
  formatWalletAddress: (address: string) => string;
}

const WalletAddressItem: React.FC<WalletAddressItemProps> = ({ walletAddress, onSelectAddress, formatWalletAddress }) => {
  return (
    <DropdownMenuItem 
      key={walletAddress.address} 
      className="flex flex-col items-start gap-1 cursor-pointer hover:bg-white/10 w-full text-left"
      onClick={() => onSelectAddress(walletAddress.address)}
    >
      <div className="flex items-center gap-2 w-full text-left">
        <span className="w-2 h-2 rounded-full bg-crystal-primary" />
        <span className="text-sm font-medium text-left">
          {walletAddress.label || "Unnamed Wallet"}
        </span>
      </div>
      <span className="text-xs text-gray-400 text-left pl-4 break-all">
        {formatWalletAddress(walletAddress.address)}
      </span>
    </DropdownMenuItem>
  );
};

export default WalletAddressItem;
