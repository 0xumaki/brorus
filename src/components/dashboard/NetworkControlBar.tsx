
import React from "react";
import NetworkSelector from "@/components/dashboard/NetworkSelector";
import WalletAddressSelector from "@/components/wallet/WalletAddressSelector";

interface Network {
  id: string;
  name: string;
  iconColor: string;
}

// Update the WalletAddress interface to match the one in WalletAddressSelector.tsx
interface WalletAddress {
  address: string;
  label: string; // Make label required to match WalletAddressSelector.tsx
}

interface NetworkControlBarProps {
  selectedNetwork: string;
  onNetworkChange: (network: string) => void;
  networks: Network[];
  walletAddresses: WalletAddress[];
  selectedAddress: string;
  onSelectAddress: (address: string) => void;
  onAddAddress?: (newAddress: WalletAddress) => void;
}

const NetworkControlBar: React.FC<NetworkControlBarProps> = ({
  selectedNetwork,
  onNetworkChange,
  networks,
  walletAddresses,
  selectedAddress,
  onSelectAddress,
  onAddAddress,
}) => {
  return (
    <div className="glass-card p-3 mb-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <NetworkSelector
          selectedNetwork={selectedNetwork}
          onNetworkChange={onNetworkChange}
          networks={networks}
        />
        
        <div className="w-full sm:w-auto">
          <WalletAddressSelector 
            addresses={walletAddresses}
            selectedAddress={selectedAddress}
            onSelectAddress={onSelectAddress}
            onAddAddress={onAddAddress}
          />
        </div>
      </div>
    </div>
  );
};

export default NetworkControlBar;
