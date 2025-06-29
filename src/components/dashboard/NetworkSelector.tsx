
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Network {
  id: string;
  name: string;
  iconColor: string;
}

interface NetworkSelectorProps {
  selectedNetwork: string;
  onNetworkChange: (network: string) => void;
  networks: Network[];
}

const NetworkSelector: React.FC<NetworkSelectorProps> = ({
  selectedNetwork,
  onNetworkChange,
  networks,
}) => {
  return (
    <Select value={selectedNetwork} onValueChange={onNetworkChange}>
      <SelectTrigger className="w-full sm:w-auto border-none bg-white/10 text-white">
        <SelectValue>
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: networks.find((n) => n.id === selectedNetwork)?.iconColor
              }}
            />
            {networks.find((n) => n.id === selectedNetwork)?.name}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-white/90 dark:bg-black/90 backdrop-blur-md border-white/20 z-50">
        {networks.map((network) => (
          <SelectItem
            key={network.id}
            value={network.id}
            className="focus:bg-white/20 dark:focus:bg-black/20"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: network.iconColor }}
              />
              {network.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default NetworkSelector;
