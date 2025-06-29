import React, { useState, useEffect } from "react";
import { ArrowLeft, Check, ExternalLink, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Transaction } from "@/lib/mockData";
import { useLanguage } from "@/contexts/language";

interface TransactionDetailsProps {
  transaction: Transaction & {
    hash?: string;
    blockNumber?: number | string;
    gasUsed?: string;
    gasPrice?: string;
  };
  onClose: () => void;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ transaction, onClose }) => {
  const { toast } = useToast();
  const { formatNumber } = useLanguage();
  const [ethPrice, setEthPrice] = useState<number>(2000); // Default fallback price
  
  // Fetch current ETH price
  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const data = await response.json();
        if (data.ethereum && data.ethereum.usd) {
          setEthPrice(data.ethereum.usd);
        }
      } catch (error) {
        console.error('Error fetching ETH price:', error);
        // Keep default price if API fails
      }
    };

    fetchEthPrice();
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const getStatusColor = () => {
    switch (transaction.type) {
      case "receive":
        return "bg-green-500/20 text-green-400";
      case "send":
        return "bg-blue-500/20 text-blue-400";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStatusText = () => {
    switch (transaction.type) {
      case "receive":
        return "Received";
      case "send":
        return "Sent";
      case "pending":
        return "Pending";
      default:
        return "Unknown";
    }
  };

  // Calculate actual network fee from gas data
  const calculateNetworkFee = () => {
    if (transaction.gasUsed && transaction.gasPrice) {
      const gasUsed = BigInt(transaction.gasUsed);
      const gasPrice = BigInt(transaction.gasPrice);
      const feeInWei = gasUsed * gasPrice;
      const feeInEth = Number(feeInWei) / Math.pow(10, 18);
      
      // Use real ETH price from API
      const feeInUSD = feeInEth * ethPrice;
      
      return `${feeInEth.toFixed(6)} ETH ($${feeInUSD.toFixed(2)})`;
    }
    
    // Fallback to transaction.fee if available
    if (transaction.fee) {
      return transaction.fee;
    }
    
    return "N/A";
  };

  // Get Etherscan URL for the transaction
  const getEtherscanUrl = () => {
    if (transaction.hash) {
      return `https://sepolia.etherscan.io/tx/${transaction.hash}`;
    }
    return null;
  };

  // Get Etherscan block URL
  const getBlockUrl = () => {
    if (transaction.blockNumber) {
      return `https://sepolia.etherscan.io/block/${transaction.blockNumber}`;
    }
    return null;
  };

  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="mr-2"
        >
          <ArrowLeft size={20} />
        </Button>
        <h2 className="text-lg font-bold">Transaction Details</h2>
      </div>
      
      <div className="flex items-center justify-center mb-6">
        <div className={`w-16 h-16 rounded-full ${getStatusColor()} flex items-center justify-center mb-2`}>
          {transaction.type === "receive" ? (
            <ArrowLeft size={28} />
          ) : transaction.type === "send" ? (
            <ArrowLeft size={28} className="transform rotate-180" />
          ) : (
            <Check size={28} />
          )}
        </div>
      </div>
      
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold">
          {transaction.type === "send" ? "-" : "+"}{formatNumber(transaction.amount)} {transaction.symbol}
        </h3>
        <p className={`text-sm ${getStatusColor()}`}>{getStatusText()}</p>
        <p className="text-sm text-gray-400 mt-1">{transaction.timestamp}</p>
      </div>
      
      <div className="space-y-4">
        <DetailItem 
          label="Transaction Hash" 
          value={transaction.hash || "N/A"}
          copyable={!!transaction.hash}
          link={getEtherscanUrl()}
          onCopy={() => copyToClipboard(transaction.hash || "", "Transaction hash")}
        />
        
        <DetailItem 
          label={transaction.type === "send" ? "Recipient Address" : "Sender Address"} 
          value={transaction.address}
          copyable
          onCopy={() => copyToClipboard(transaction.address, "Address")}
        />
        
        <DetailItem 
          label="Block" 
          value={transaction.blockNumber ? transaction.blockNumber.toString() : "N/A"}
          link={getBlockUrl()}
        />
        
        <DetailItem 
          label="Network Fee" 
          value={calculateNetworkFee()}
        />
        
        {transaction.gasUsed && transaction.gasPrice && (
          <>
            <DetailItem 
              label="Gas Used" 
              value={`${Number(transaction.gasUsed).toLocaleString()} units`}
            />
            <DetailItem 
              label="Gas Price" 
              value={`${(Number(transaction.gasPrice) / Math.pow(10, 9)).toFixed(2)} Gwei`}
            />
          </>
        )}
        
        <DetailItem 
          label="Status" 
          value={getStatusText()}
          statusColor={getStatusColor()}
        />
      </div>
    </div>
  );
};

interface DetailItemProps {
  label: string;
  value: string;
  copyable?: boolean;
  link?: string;
  statusColor?: string;
  onCopy?: () => void;
}

const DetailItem: React.FC<DetailItemProps> = ({ 
  label, 
  value, 
  copyable, 
  link, 
  statusColor,
  onCopy 
}) => {
  return (
    <div className="border-b border-white/10 pb-3">
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <div className="flex items-center justify-between">
        <p className={`text-sm font-medium break-all ${statusColor || "text-white"}`}>
          {value.length > 30 ? `${value.substring(0, 16)}...${value.substring(value.length - 10)}` : value}
        </p>
        <div className="flex">
          {copyable && (
            <Button variant="ghost" size="icon" onClick={onCopy} className="text-gray-400 hover:text-white">
              <Copy size={14} />
            </Button>
          )}
          {link && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-white"
              onClick={() => window.open(link, "_blank")}
            >
              <ExternalLink size={14} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
