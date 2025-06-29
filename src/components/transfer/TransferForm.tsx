import React, { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft, CreditCard, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language";
import CurrencySelector from "./CurrencySelector";
import RecipientInput from "./RecipientInput";
import AmountInput from "./AmountInput";
import { currencies } from "./data/currencies";
import CrossChainTransferForm from "./CrossChainTransferForm";
import Web3 from "web3";
import { useWallet } from "@/contexts/WalletContext";

// Ensure we're using consistent types
interface WalletAddress {
  address: string;
  label: string; // Required to match WalletAddressSelector
}

// Placeholder: Map currency symbol to ERC-20 contract address on Sepolia
const TOKEN_ADDRESSES: Record<string, string> = {
  USDT: "0x91093128F514e4D99759FB2816BBc961d7eaAF39",
  USDC: "0xF025544BB1f91eE2BD6a1741CBCC7a9Bfd902E0B",
  CHF: "0x54F1BcF82A329E37804e7627b1cbd29D7323fe9c",
  AUD: "0xeb5Aaf8f2DFE1fca72fDa345d5e9080c133c8C20",
  // Add more as needed
};

const ERC20_ABI = [
  // Balance function ABI
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function"
  },
  // Transfer function ABI
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function"
  },
  // Decimals function ABI
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function"
  }
];

const TransferForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [mode, setMode] = useState<'same' | 'cross'>('same');
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("USDT");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { account } = useWallet();
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);

  const selectedCurrencyData = currencies.find(currency => currency.symbol === selectedCurrency);
  const isCbdc = selectedCurrencyData?.type === "cbdc";

  useEffect(() => {
    const fetchBalance = async () => {
      setBalanceLoading(true);
      if (!window.ethereum || !account || !selectedCurrencyData) {
        console.log("Missing requirements:", { 
          hasEthereum: !!window.ethereum, 
          account, 
          selectedCurrencyData: !!selectedCurrencyData 
        });
        setTokenBalance(null);
        setBalanceLoading(false);
        return;
      }
      
      const web3 = new Web3(window.ethereum);
      
      try {
        // Check if we're on Sepolia network
        const chainId = await web3.eth.getChainId();
        console.log("Current chain ID:", chainId);
        
        if (Number(chainId) !== 11155111) { // Sepolia chain ID
          console.log("Not on Sepolia network. Current chain ID:", chainId);
          setTokenBalance(null);
          setBalanceLoading(false);
          return;
        }
        
        // Fetch token balance if it's an ERC-20 token
        if (["USDT", "USDC", "CHF", "AUD"].includes(selectedCurrency)) {
          const tokenAddress = TOKEN_ADDRESSES[selectedCurrency];
          console.log("Fetching balance for:", selectedCurrency, "at address:", tokenAddress);
          
          if (tokenAddress) {
            const contract = new web3.eth.Contract(ERC20_ABI as any, tokenAddress);
            
            // Fetch balance and decimals
            const [rawBalance, decimals] = await Promise.all([
              contract.methods.balanceOf(account).call(),
              contract.methods.decimals().call(),
            ]);
            
            console.log("Raw balance:", rawBalance, "Decimals:", decimals);
            
            const balance = Number(rawBalance) / 10 ** Number(decimals);
            console.log("Calculated balance:", balance);
            
            setTokenBalance(balance);
          } else {
            console.log("No token address found for:", selectedCurrency);
            setTokenBalance(null);
          }
        } else {
          console.log("Currency not in supported list:", selectedCurrency);
          setTokenBalance(null);
        }
      } catch (error) {
        console.error("Error fetching balance for", selectedCurrency, ":", error);
        setTokenBalance(null);
      } finally {
        setBalanceLoading(false);
      }
    };
    
    fetchBalance();
  }, [account, selectedCurrency]);

  // Compute the correct balance to display for the selected currency
  let displayBalance: number | null = null;
  if (["USDT", "USDC", "CHF", "AUD"].includes(selectedCurrency)) {
    displayBalance = tokenBalance;
  } else {
    displayBalance = selectedCurrencyData?.balance ?? null;
  }

  // Helper to shorten Ethereum address
  const formatAddress = (addr: string) => {
    if (!addr) return "";
    return addr.length > 10 ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr;
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setTxHash(null);
    if (!address || !amount) {
      toast({
        title: t("transfer.invalid"),
        description: t("transfer.enterBoth"),
        variant: "destructive",
      });
      return;
    }
    if (!window.ethereum) {
      setError("MetaMask is not available");
      return;
    }
    
    const tokenAddress = TOKEN_ADDRESSES[selectedCurrency];
    if (!tokenAddress) {
      setError("Token contract address not set for " + selectedCurrency);
      return;
    }
    
    setLoading(true);
    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();
      const from = accounts[0];
      
      const contract = new web3.eth.Contract(ERC20_ABI as any, tokenAddress);
      const decimals = await contract.methods.decimals().call();
      let value;
      if (Number(decimals) === 18) {
        value = web3.utils.toWei(amount, 'ether');
      } else {
        value = (Number(amount) * 10 ** Number(decimals)).toLocaleString('fullwide', {useGrouping:false});
      }
      const tx = await contract.methods.transfer(address, value).send({ from });
      
      setTxHash(tx.transactionHash);
      toast({
        title: t("transfer.success"),
        description: `${amount} ${selectedCurrency} sent!`,
      });
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-xl font-bold text-left tracking-tight">
          <CreditCard size={20} className="inline mr-2" />
          {t("transfer.titleGeneric")}
        </h1>
      </div>
      <div className="flex gap-2 mb-4">
        <Button variant={mode === 'same' ? 'default' : 'outline'} onClick={() => setMode('same')}>
          {t('transfer.sameChain', 'Same Chain')}
        </Button>
        <Button variant={mode === 'cross' ? 'default' : 'outline'} onClick={() => setMode('cross')}>
          {t('transfer.crossChain', 'Cross Chain')}
        </Button>
      </div>
      {mode === 'same' ? (
        <div className="glass-card p-5">
          <form onSubmit={handleTransfer}>
            <div className="space-y-4">
              <CurrencySelector 
                currencies={currencies}
                selectedCurrency={selectedCurrency}
                onCurrencyChange={setSelectedCurrency}
                selectedCurrencyBalance={displayBalance}
                balanceLoading={balanceLoading}
              />
              <RecipientInput
                address={address}
                setAddress={setAddress}
                isCbdc={isCbdc}
              />
              <AmountInput
                amount={amount}
                setAmount={setAmount}
                selectedCurrency={selectedCurrency}
                selectedCurrencyData={selectedCurrencyData}
                selectedCurrencyBalance={displayBalance}
                balanceLoading={balanceLoading}
              />
              <div className="flex items-center text-xs text-wallet-gray-400 mt-2 text-left">
                <Info size={12} className="mr-1" />
                <span>{t("transfer.networkFee")}</span>
              </div>
              <Button 
                type="submit" 
                className="w-full btn-primary font-semibold tracking-wide"
                disabled={loading}
              >
                {loading 
                  ? t("transfer.sending", { amount, symbol: selectedCurrency, address: formatAddress(address) })
                  : t("transfer.send")}
                <ArrowRight size={16} className="ml-2" />
              </Button>
              {txHash && <div className="text-wallet-emerald text-xs mt-2">{t("transfer.txSent", "Transaction sent!")} {txHash}</div>}
              {error && <div className="text-red-500 text-xs mt-2">{error}</div>}
            </div>
          </form>
        </div>
      ) : (
        <CrossChainTransferForm />
      )}
    </div>
  );
};

export default TransferForm;
