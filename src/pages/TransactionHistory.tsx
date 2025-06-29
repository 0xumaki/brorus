import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WalletLayout from "@/components/layout/WalletLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter, Search } from "lucide-react";
import TransactionList from "@/components/transactions/TransactionList";
import TransactionFilter from "@/components/transactions/TransactionFilter";
import BalanceChart from "@/components/transactions/BalanceChart";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useWallet } from "@/contexts/WalletContext";

// Sepolia token addresses (same as in Index.tsx)
const TOKEN_ADDRESSES: Record<string, string> = {
  USDT: "0x91093128F514e4D99759FB2816BBc961d7eaAF39",
  USDC: "0xF025544BB1f91eE2BD6a1741CBCC7a9Bfd902E0B",
  CHF: "0x54F1BcF82A329E37804e7627b1cbd29D7323fe9c",
  AUD: "0xeb5Aaf8f2DFE1fca72fDa345d5e9080c133c8C20",
};

// Sepolia Etherscan API configuration
const SEPOLIA_ETHERSCAN_API_KEY = "KCST7PTKRS6VFJ5QP5QCW18XGS1Y36KHN8";
const SEPOLIA_ETHERSCAN_URL = 'https://api-sepolia.etherscan.io/api';

// Fetch transactions from Sepolia Etherscan API
async function fetchSepoliaTransactions(walletAddress: string) {
  const allTransactions: any[] = [];
  
  try {
    // Fetch ERC-20 token transfers
    for (const [symbol, tokenAddress] of Object.entries(TOKEN_ADDRESSES)) {
      const response = await fetch(
        `${SEPOLIA_ETHERSCAN_URL}?module=account&action=tokentx&contractaddress=${tokenAddress}&address=${walletAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${SEPOLIA_ETHERSCAN_API_KEY}`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.status === '1' && data.result) {
          data.result.forEach((tx: any) => {
            const isReceive = tx.to.toLowerCase() === walletAddress.toLowerCase();
            const isSend = tx.from.toLowerCase() === walletAddress.toLowerCase();
            
            if (isReceive || isSend) {
              allTransactions.push({
                id: tx.hash + '_' + tx.logIndex,
                type: isReceive ? "receive" : "send",
                amount: Number(tx.value) / Math.pow(10, Number(tx.tokenDecimal)),
                symbol,
                address: isReceive ? tx.from : tx.to,
                timestamp: new Date(Number(tx.timeStamp) * 1000),
                hash: tx.hash,
                blockNumber: Number(tx.blockNumber),
                confirmations: Number(tx.confirmations),
                gasUsed: tx.gasUsed,
                gasPrice: tx.gasPrice,
              });
            }
          });
        }
      }
    }
    
    // Also fetch native ETH transactions
    const ethResponse = await fetch(
      `${SEPOLIA_ETHERSCAN_URL}?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${SEPOLIA_ETHERSCAN_API_KEY}`
    );
    
    if (ethResponse.ok) {
      const ethData = await ethResponse.json();
      
      if (ethData.status === '1' && ethData.result) {
        ethData.result.forEach((tx: any) => {
          const isReceive = tx.to.toLowerCase() === walletAddress.toLowerCase();
          const isSend = tx.from.toLowerCase() === walletAddress.toLowerCase();
          
          if (isReceive || isSend) {
            allTransactions.push({
              id: tx.hash + '_eth',
              type: isReceive ? "receive" : "send",
              amount: Number(tx.value) / Math.pow(10, 18), // ETH has 18 decimals
              symbol: "ETH",
              address: isReceive ? tx.from : tx.to,
              timestamp: new Date(Number(tx.timeStamp) * 1000),
              hash: tx.hash,
              blockNumber: Number(tx.blockNumber),
              confirmations: Number(tx.confirmations),
              gasUsed: tx.gasUsed,
              gasPrice: tx.gasPrice,
            });
          }
        });
      }
    }
    
    // Sort by timestamp descending (most recent first)
    allTransactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    return allTransactions;
  } catch (error) {
    console.error('Error fetching Sepolia transactions:', error);
    return [];
  }
}

const TransactionHistory = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { account } = useWallet();
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    type: "all",
    dateRange: "all",
    coin: "all"
  });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!account) return;
      
      setLoading(true);
      console.log('Fetching transactions for wallet:', account);
      
      try {
        const txs = await fetchSepoliaTransactions(account);
        console.log('Fetched transactions:', txs);
        setTransactions(txs);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [account]);

  return (
    <WalletLayout>
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/")}
          className="mr-2"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-bold">{t("tx.history")}</h1>
      </div>

      {/* Balance Chart */}
      <BalanceChart transactions={transactions} />

      <div className="mb-4 flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder={t("tx.search")}
            className="pl-9 bg-white/5 border-white/10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          className="border-white/10 bg-white/5"
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <Filter size={16} className="mr-2" />
          {t("tx.filter")}
        </Button>
      </div>

      {filterOpen && (
        <TransactionFilter 
          activeFilters={activeFilters} 
          setActiveFilters={setActiveFilters} 
          onClose={() => setFilterOpen(false)}
        />
      )}

      {loading ? (
        <div className="p-6 text-center text-gray-400">Loading transactions...</div>
      ) : transactions.length === 0 ? (
        <div className="p-6 text-center text-gray-400">
          No transactions found for this wallet address on Sepolia testnet
        </div>
      ) : (
        <TransactionList searchQuery={searchQuery} filters={activeFilters} transactions={transactions} />
      )}
    </WalletLayout>
  );
};

export default TransactionHistory;
