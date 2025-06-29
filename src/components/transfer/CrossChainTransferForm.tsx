import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language";
import CurrencySelector from "./CurrencySelector";
import AmountInput from "./AmountInput";
import { currencies } from "./data/currencies";
import Web3 from "web3";
import RecipientInput from "./RecipientInput";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from "@/components/ui/select";
import { getTokenAddress, NETWORK_CONFIGS } from "@/lib/networkUtils";
import { ArrowLeft } from "lucide-react";

// Sepolia token addresses
const TOKEN_ADDRESSES: Record<string, string> = {
  USDT: "0x91093128F514e4D99759FB2816BBc961d7eaAF39",
  USDC: "0xF025544BB1f91eE2BD6a1741CBCC7a9Bfd902E0B",
  CHF: "0x54F1BcF82A329E37804e7627b1cbd29D7323fe9c",
  AUD: "0xeb5Aaf8f2DFE1fca72fDa345d5e9080c133c8C20",
};

// CCIP Token Sender contract addresses
const CCIP_SENDER_ADDRESSES = {
  sepolia: "0xBc3a84d7073973366153ecB7A0aDb66A615Db999",
  mumbai: "0xYourDeployedContractAddress",
};

// LINK token addresses
const LINK_TOKEN_ADDRESSES = {
  sepolia: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
  mumbai: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
};

// Supported destination chains
const DESTINATION_CHAINS = [
  { id: "sepolia", name: "Sepolia Testnet", chainSelector: "16015286601757825753" },
  { id: "mumbai", name: "Polygon Mumbai", chainSelector: "12532609583862916517" },
];

// Helper functions
const getTokenBalance = async (web3: Web3, tokenAddress: string, account: string): Promise<string> => {
  try {
    const tokenContract = new web3.eth.Contract([
      { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "type": "function" }
    ], tokenAddress);
    const balance = await tokenContract.methods.balanceOf(account).call() as string;
    return balance;
  } catch (error) {
    console.error("Error getting token balance:", error);
    return "0";
  }
};

const getLINKBalance = async (web3: Web3, networkId: string, account: string): Promise<string> => {
  try {
    const linkAddress = LINK_TOKEN_ADDRESSES[networkId as keyof typeof LINK_TOKEN_ADDRESSES];
    return await getTokenBalance(web3, linkAddress, account);
  } catch (error) {
    console.error("Error getting LINK balance:", error);
    return "0";
  }
};

const formatAmount = (amount: string, decimals: number): string => {
  return (Number(amount) / Math.pow(10, decimals)).toString();
};

const toWei = (amount: string, decimals: number): string => {
  return (Number(amount) * Math.pow(10, decimals)).toLocaleString('fullwide', { useGrouping: false });
};

// Placeholder functions for CCIP operations (to be implemented later)
const calculateCCIPFee = async (web3: Web3, sourceChain: string, destinationChainSelector: string, tokenAddress: string, amount: string, feeToken: string): Promise<string> => {
  // Placeholder - return a default fee
  return "1000000000000000000"; // 1 ETH in wei
};

const approveCCIPSender = async (web3: Web3, tokenAddress: string, amount: string, sourceChain: string, account: string): Promise<void> => {
  // Placeholder - approve tokens for CCIP sender
  console.log("Approving tokens for CCIP sender...");
};

const executeCrossChainTransfer = async (web3: Web3, sourceChain: string, destinationChainSelector: string, receiver: string, tokenAddress: string, amount: string, feeToken: string, account: string): Promise<string> => {
  // Placeholder - execute cross-chain transfer
  console.log("Executing cross-chain transfer...");
  return "0xplaceholder_tx_hash";
};

const CrossChainTransferForm: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { account } = useWallet();
  const [destinationChain, setDestinationChain] = useState("mumbai");
  const [selectedCurrency, setSelectedCurrency] = useState("USDT");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feeAmount, setFeeAmount] = useState<string>("0");
  const [feeLoading, setFeeLoading] = useState(false);
  const [tokenBalance, setTokenBalance] = useState<string>("0");
  const [linkBalance, setLinkBalance] = useState<string>("0");
  const [ethBalance, setEthBalance] = useState<string>("0");
  const [feeToken, setFeeToken] = useState<string>("0x0000000000000000000000000000000000000000"); // Native token by default

  const selectedCurrencyData = currencies.find(currency => currency.symbol === selectedCurrency);
  const destinationChainSelector = DESTINATION_CHAINS.find(c => c.id === destinationChain)?.chainSelector;

  // Fetch balances and calculate fees when parameters change
  useEffect(() => {
    const fetchData = async () => {
      if (!account || !window.ethereum) return;

      const web3 = new Web3(window.ethereum);
      const tokenAddress = TOKEN_ADDRESSES[selectedCurrency];

      try {
        // Fetch token balance
        if (tokenAddress) {
          const balance = await getTokenBalance(web3, tokenAddress, account);
          setTokenBalance(balance);
        }

        // Fetch LINK balance
        const linkBalance = await getLINKBalance(web3, "sepolia", account);
        setLinkBalance(linkBalance);

        // Fetch ETH balance
        const ethBalance = await web3.eth.getBalance(account);
        setEthBalance(ethBalance.toString());

        // Calculate fee if we have all required parameters
        if (amount && destinationChainSelector && tokenAddress && recipient) {
          await calculateFee(web3, tokenAddress);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [account, selectedCurrency, amount, destinationChain, recipient]);

  const calculateFee = async (web3: Web3, tokenAddress: string) => {
    if (!destinationChainSelector || !amount || !recipient) return;

    setFeeLoading(true);
    try {
      const tokenContract = new web3.eth.Contract([
        { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "type": "function" }
      ], tokenAddress);
      
      const decimals = await tokenContract.methods.decimals().call() as string;
      const amountInWei = toWei(amount, Number(decimals));
      
      const fee = await calculateCCIPFee(
        web3,
        "sepolia",
        destinationChainSelector,
        tokenAddress,
        amountInWei,
        feeToken
      );
      
      setFeeAmount(fee);
    } catch (error) {
      console.error("Error calculating fee:", error);
      setFeeAmount("0");
    } finally {
      setFeeLoading(false);
    }
  };

  const handleCrossChainTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTxHash(null);

    if (!recipient || !amount) {
      setError("Recipient and amount are required");
      setLoading(false);
      return;
    }

    if (!window.ethereum || !account) {
      setError("MetaMask is not available or not connected");
      setLoading(false);
      return;
    }

    const tokenAddress = TOKEN_ADDRESSES[selectedCurrency];
    if (!tokenAddress) {
      setError("Token contract address not set for " + selectedCurrency);
      setLoading(false);
      return;
    }

    if (!destinationChainSelector) {
      setError("Invalid destination chain");
      setLoading(false);
      return;
    }

    try {
      const web3 = new Web3(window.ethereum);
      
      // Get token decimals
      const tokenContract = new web3.eth.Contract([
        { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "type": "function" }
      ], tokenAddress);
      
      const decimals = await tokenContract.methods.decimals().call() as string;
      const amountInWei = toWei(amount, Number(decimals));

      // Approve tokens for CCIP sender
      await approveCCIPSender(web3, tokenAddress, amountInWei, "sepolia", account);

      // Execute cross-chain transfer
      const txHash = await executeCrossChainTransfer(
        web3,
        "sepolia",
        destinationChainSelector,
        recipient,
        tokenAddress,
        amountInWei,
        feeToken,
        account
      );

      setTxHash(txHash);
      toast({
        title: "Cross-chain transfer initiated!",
        description: `Transaction hash: ${txHash}`,
      });

    } catch (err: any) {
      setError(err.message || "Transaction failed");
      toast({
        title: "Transfer failed",
        description: err.message || "Transaction failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatFee = (fee: string) => {
    if (fee === "0") return "0";
    return formatAmount(fee, 18); // LINK has 18 decimals
  };

  const formatBalance = (balance: string, decimals: number = 18) => {
    if (balance === "0") return "0";
    return formatAmount(balance, decimals);
  };

  return (
    <div className="glass-card p-5">
      <form onSubmit={handleCrossChainTransfer}>
        <div className="space-y-4">
          <div className="text-left">
            <label className="text-sm text-gray-300 mb-1 block">
              {t("transfer.destinationChain", "Destination Chain")}
            </label>
            <Select value={destinationChain} onValueChange={setDestinationChain}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-sm border-white/10">
                {DESTINATION_CHAINS.map(chain => (
                  <SelectItem key={chain.id} value={chain.id}>{chain.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-left">
            <label className="text-sm text-gray-300 mb-1 block">
              Fee Token
            </label>
            <Select value={feeToken} onValueChange={setFeeToken}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-sm border-white/10">
                <SelectItem value="0x0000000000000000000000000000000000000000">
                  ETH (Native)
                </SelectItem>
                <SelectItem value={LINK_TOKEN_ADDRESSES.sepolia}>
                  LINK
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="text-xs text-gray-400 mt-1">
              {feeToken === "0x0000000000000000000000000000000000000000" ? (
                <>ETH Balance: {formatBalance(ethBalance)} ETH</>
              ) : (
                <>LINK Balance: {formatBalance(linkBalance)} LINK</>
              )}
            </div>
          </div>

          <CurrencySelector
            currencies={currencies}
            selectedCurrency={selectedCurrency}
            onCurrencyChange={setSelectedCurrency}
            selectedCurrencyBalance={Number(formatBalance(tokenBalance, 18))}
            balanceLoading={false}
          />

          <RecipientInput
            address={recipient}
            setAddress={setRecipient}
            isCbdc={false}
          />

          <AmountInput
            amount={amount}
            setAmount={setAmount}
            selectedCurrency={selectedCurrency}
            selectedCurrencyData={selectedCurrencyData}
            selectedCurrencyBalance={Number(formatBalance(tokenBalance, 18))}
            balanceLoading={false}
          />

          {/* Fee Display */}
          {feeLoading ? (
            <div className="text-sm text-wallet-gray-400">Calculating fee...</div>
          ) : feeAmount !== "0" ? (
            <div className="text-sm text-wallet-gray-400">
              Estimated Fee: {formatFee(feeAmount)} {feeToken === "0x0000000000000000000000000000000000000000" ? "ETH" : "LINK"}
            </div>
          ) : null}

          <Button 
            type="submit" 
            className="w-full btn-primary font-semibold tracking-wide" 
            disabled={loading}
          >
            {loading ? "Processing..." : "Send Cross-Chain"}
          </Button>

          {txHash && (
            <div className="text-wallet-emerald text-xs mt-2">
              Transaction sent! Hash: {txHash}
            </div>
          )}
          
          {error && (
            <div className="text-red-500 text-xs mt-2">
              {error}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default CrossChainTransferForm; 