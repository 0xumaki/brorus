import React, { useEffect, useState } from "react";
import WalletLayout from "@/components/layout/WalletLayout";
import WalletActions from "@/components/dashboard/WalletActions";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import PageHeader from "@/components/dashboard/PageHeader";
import NetworkControlBar from "@/components/dashboard/NetworkControlBar";
import TotalBalanceCard from "@/components/dashboard/TotalBalanceCard";
import StablecoinSection from "@/components/dashboard/StablecoinSection";
import { networks, networkStablecoins } from "@/data/networks";
import { currencies } from "@/components/transfer/data/currencies";
import { useWallet } from "@/contexts/WalletContext";
import Web3 from "web3";
import { Button } from "@/components/ui/button";

// ERC-20 ABI (only balanceOf and decimals)
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
];

// Token contract addresses on Sepolia
const TOKEN_ADDRESSES: Record<string, string> = {
  USDT: "0x91093128F514e4D99759FB2816BBc961d7eaAF39",
  USDC: "0xF025544BB1f91eE2BD6a1741CBCC7a9Bfd902E0B",
  CHF: "0x54F1BcF82A329E37804e7627b1cbd29D7323fe9c",
  AUD: "0xeb5Aaf8f2DFE1fca72fDa345d5e9080c133c8C20",
};

const TARGET_ADDRESS = "0x2FC83097f643212CfcbAD5FC07C42B767eCE96dA";

const Index = () => {
  const { t } = useLanguage();
  const { account, isConnected, connectWallet } = useWallet();
  const [selectedNetwork, setSelectedNetwork] = React.useState("sepolia");
  const [tokenBalances, setTokenBalances] = useState<Record<string, number>>({});
  const [walletConnected, setWalletConnected] = useState(false);
  const [demoBalances, setDemoBalances] = useState<Record<string, number>>({});

  // Connect Wallet handler
  const handleConnectWallet = async () => {
    await connectWallet();
    setWalletConnected(true);
  };

  // Listen for balance updates from on-ramp/off-ramp demo
  useEffect(() => {
    const handleBalanceUpdate = (event: CustomEvent) => {
      const { currency, newBalance } = event.detail;
      setDemoBalances(prev => ({
        ...prev,
        [currency]: newBalance
      }));
    };

    window.addEventListener('walletBalanceUpdated', handleBalanceUpdate as EventListener);

    return () => {
      window.removeEventListener('walletBalanceUpdated', handleBalanceUpdate as EventListener);
    };
  }, []);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!window.ethereum || !account) return;
      const web3 = new Web3(window.ethereum);
      const newBalances: Record<string, number> = {};

      for (const symbol of Object.keys(TOKEN_ADDRESSES)) {
        try {
          const contract = new web3.eth.Contract(ERC20_ABI as any, TOKEN_ADDRESSES[symbol]);
          const [rawBalance, decimals] = await Promise.all([
            contract.methods.balanceOf(account).call(),
            contract.methods.decimals().call(),
          ]);
          newBalances[symbol] = Number(rawBalance) / 10 ** Number(decimals);
        } catch (e) {
          newBalances[symbol] = 0;
        }
      }
      setTokenBalances(newBalances);
    };

    if ((walletConnected || account) && window.ethereum) {
      fetchBalances();
    }
  }, [walletConnected, account]);

  // Combine real balances with demo balances (real balances as base, demo transactions on top)
  const getCombinedBalance = (symbol: string) => {
    const realBalance = tokenBalances[symbol] !== undefined ? tokenBalances[symbol] : 0;
    const demoBalance = demoBalances[symbol] !== undefined ? demoBalances[symbol] : 0;
    
    // If there are demo transactions, use them; otherwise use real balance
    if (demoBalance > 0) {
      return demoBalance;
    }
    return realBalance;
  };

  // Update stablecoins and CBDCs with combined balances
  const stablecoins = networkStablecoins[selectedNetwork]
    ? networkStablecoins[selectedNetwork].map((coin) =>
        ["USDT", "USDC"].includes(coin.symbol)
          ? { ...coin, balance: getCombinedBalance(coin.symbol) }
          : coin
      )
    : [];

  const cbdcCurrencies = currencies
    .filter((c) => c.type === "cbdc")
    .map((c) => {
      if (["CHF", "AUD"].includes(c.symbol)) {
        return { ...c, balance: getCombinedBalance(c.symbol), dollarValue: 0, percentChange: 0 };
      } else {
        return { ...c, balance: c.balance, dollarValue: 0, percentChange: 0 };
      }
    });

  // Calculate total balance as the sum of all stablecoin and CBDC balances (1:1 USD value)
  const totalStablecoinBalance = currencies
    .filter(c => c.type === "stablecoin")
    .reduce((acc, c) => acc + getCombinedBalance(c.symbol), 0);
  const totalCbdcBalance = currencies
    .filter(c => c.type === "cbdc")
    .reduce((acc, c) => acc + getCombinedBalance(c.symbol), 0);
  const totalBalance = totalStablecoinBalance + totalCbdcBalance;

  return (
    <WalletLayout>
      <PageHeader currentBalances={tokenBalances} />
      {/* Connect Wallet Button */}
      {!account && (
        <div className="flex justify-center my-4">
          <Button onClick={handleConnectWallet} className="btn-primary">
            {t("wallet.connect", "Connect Wallet")}
          </Button>
        </div>
      )}
      <NetworkControlBar
        selectedNetwork={selectedNetwork}
        onNetworkChange={setSelectedNetwork}
        networks={networks}
        walletAddresses={account ? [{ address: account, label: t("wallet.metamask", "MetaMask Wallet") }] : []}
        selectedAddress={account || ""}
        onSelectAddress={() => {}}
        onAddAddress={() => {}}
      />
      <TotalBalanceCard totalBalance={totalBalance} />
      <Tabs defaultValue="coins" className="w-full">
        <TabsList className="w-full bg-wallet-white/10 border border-wallet-emerald/20 mb-4">
          <TabsTrigger value="coins" className="flex-1 text-wallet-emerald data-[state=active]:bg-wallet-emerald data-[state=active]:text-wallet-white">{t("tabs.coins")}</TabsTrigger>
          <TabsTrigger value="nfts" className="flex-1 text-wallet-emerald data-[state=active]:bg-wallet-emerald data-[state=active]:text-wallet-white">{t("tabs.nfts")}</TabsTrigger>
          <TabsTrigger value="history" className="flex-1 text-wallet-emerald data-[state=active]:bg-wallet-emerald data-[state=active]:text-wallet-white">{t("tabs.history")}</TabsTrigger>
        </TabsList>
        <TabsContent value="coins">
          <StablecoinSection
            stablecoins={currencies
              .filter(c => c.symbol === "USDT")
              .map(c => ({
                ...c,
                dollarValue: getCombinedBalance(c.symbol),
                percentChange: 0.0,
                balance: getCombinedBalance(c.symbol)
              }))}
            title="USDT"
          />
          <StablecoinSection
            stablecoins={currencies
              .filter(c => c.symbol === "USDC")
              .map(c => ({
                ...c,
                dollarValue: getCombinedBalance(c.symbol),
                percentChange: 0.0,
                balance: getCombinedBalance(c.symbol)
              }))}
            title="USDC"
          />
          <StablecoinSection
            stablecoins={currencies
              .filter(c => c.type === "stablecoin" && c.symbol !== "USDT" && c.symbol !== "USDC")
              .map(c => ({
                ...c,
                dollarValue: c.balance,
                percentChange: 0.0,
                balance: c.balance
              }))}
            title={t("market.stablecoins")}
          />
          <StablecoinSection
            stablecoins={cbdcCurrencies}
            title={t("market.cbdcs")}
          />
          <WalletActions />
          <RecentTransactions />
        </TabsContent>
        <TabsContent value="nfts">
          <div className="glass-card p-6 text-center">
            <h3 className="font-medium mb-2 text-wallet-emerald">{t("nfts.none")}</h3>
            <p className="text-sm text-wallet-gray-400">{t("nfts.appear")}</p>
          </div>
        </TabsContent>
        <TabsContent value="history">
          <div className="glass-card">
            <RecentTransactions />
          </div>
        </TabsContent>
      </Tabs>
    </WalletLayout>
  );
};

export default Index;
