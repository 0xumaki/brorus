
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import WalletAddressItem from "./WalletAddressItem";
import WalletAddressDialog from "./WalletAddressDialog";
import CopyAddressButton from "./CopyAddressButton";
import { WalletAddress } from "./types";

interface WalletAddressSelectorProps {
  addresses: WalletAddress[];
  onSelectAddress: (address: string) => void;
  selectedAddress: string;
  onAddAddress?: (newAddress: WalletAddress) => void;
}

const WalletAddressSelector: React.FC<WalletAddressSelectorProps> = ({
  addresses,
  onSelectAddress,
  selectedAddress,
  onAddAddress,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const formatWalletAddress = (address: string) => {
    if (!address || address.length < 11) return address;
    return `${address.substring(0, 6)}....${address.substring(address.length - 4)}`;
  };

  const selectedWallet = addresses.find(a => a.address === selectedAddress) || {
    label: "Unnamed Wallet",
    address: selectedAddress
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        <div className="flex items-center w-full bg-white/5 backdrop-blur-lg rounded-lg shadow-md border border-white/10 overflow-hidden">
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger className="flex items-center justify-between py-2.5 px-4 w-full outline-none transition-colors hover:bg-white/5">
              <div className="flex flex-col overflow-hidden text-left w-full">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-crystal-primary animate-pulse" />
                  <span className="text-sm text-gray-300 font-medium overflow-hidden overflow-ellipsis text-left">
                    {selectedWallet.label || "Unnamed Wallet"}
                  </span>
                </div>
                <span className="text-xs text-gray-500 pl-5 overflow-hidden overflow-ellipsis text-left">
                  {formatWalletAddress(selectedAddress)}
                </span>
              </div>
              <ChevronDown size={16} className="text-gray-400 ml-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-black/90 border-white/20 backdrop-blur-xl text-white min-w-[240px] w-full">
              {addresses.map((walletAddress) => (
                <WalletAddressItem 
                  key={walletAddress.address}
                  walletAddress={walletAddress}
                  onSelectAddress={onSelectAddress}
                  formatWalletAddress={formatWalletAddress}
                />
              ))}
              
              {onAddAddress && (
                <WalletAddressDialog 
                  onAddAddress={onAddAddress}
                  isOpen={dialogOpen}
                  setIsOpen={setDialogOpen}
                />
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <CopyAddressButton address={selectedAddress} />
        </div>
      </div>
    </div>
  );
};

export default WalletAddressSelector;
