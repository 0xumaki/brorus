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
import { useNotifications } from "@/contexts/NotificationContext";
import { addTransactionNotification, addSecurityAlert } from "@/lib/notificationUtils";
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

// Reliable royalty-free images for NFT cards (Pexels/Unsplash only, relevant to NFT name)
const nftImages = {
  Beef: "https://cdn.pixabay.com/photo/2018/02/08/15/02/meat-3139641_960_720.jpg", // Beef steak
  Rice: "https://cdn.pixabay.com/photo/2017/08/25/05/32/in-rice-field-2679156_1280.jpg", // Rice grains
  Maize: "https://cdn.pixabay.com/photo/2015/10/12/16/44/corn-984635_960_720.jpg", // Corn field
  Beans: "https://cdn.pixabay.com/photo/2021/08/24/18/01/white-beans-6571314_1280.jpg", // Beans in bowl
  Wheat: "https://cdn.pixabay.com/photo/2014/07/02/06/47/wheat-381848_1280.jpg", // Wheat field
  Thorium: "https://cdn.i-scmp.com/sites/default/files/d8/images/canvas/2025/04/17/26b425f9-6509-4395-8e4c-b6a94a2aebfc_ad69c42c.jpg", // Abstract/metallic/mineral
  "Commercial Real Estate": "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&w=400", // Office building
  "Residential Real Estate": "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&w=400" // House
};

const Index = () => {
  const { t } = useLanguage();
  const { account, isConnected, connectWallet } = useWallet();
  const { addNotification } = useNotifications();
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

  // For Sepolia, use real/demo balances. For other networks, use unique mock balances.
  const networkMockBalances: Record<string, Record<string, number>> = {
    mumbai: {
      USDT: 250.75,
      USDC: 120.5,
      CHF: 80.2,
      AUD: 60.1,
    },
    fuji: {
      USDT: 900.12,
      USDC: 450.33,
      CHF: 300.44,
      AUD: 150.55,
    },
  };

  const getCombinedBalance = (symbol: string) => {
    if (selectedNetwork === "sepolia") {
      const realBalance = tokenBalances[symbol] !== undefined ? tokenBalances[symbol] : 0;
      const demoBalance = demoBalances[symbol] !== undefined ? demoBalances[symbol] : 0;
      if (demoBalance > 0) {
        return demoBalance;
      }
      return realBalance;
    } else if (networkMockBalances[selectedNetwork] && networkMockBalances[selectedNetwork][symbol] !== undefined) {
      return networkMockBalances[selectedNetwork][symbol];
    } else {
      return 0;
    }
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
          {/* NFT Cards for ManyMarkup Commodities and Real Estate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Commodities */}
            {[
              {
                name: "Beef",
                image: nftImages.Beef,
                valueUSD: 1200,
                owner: "Alice",
                country: "Argentina",
                originalValue: 1000,
                ownedValue: 0.5,
                type: "commodity"
              },
              {
                name: "Rice",
                image: nftImages.Rice,
                valueUSD: 800,
                owner: "Bob",
                country: "Vietnam",
                originalValue: 700,
                ownedValue: 0.8,
                type: "commodity"
              },
              {
                name: "Maize",
                image: nftImages.Maize,
                valueUSD: 950,
                owner: "Carol",
                country: "USA",
                originalValue: 900,
                ownedValue: 0.6,
                type: "commodity"
              },
              {
                name: "Beans",
                image: nftImages.Beans,
                valueUSD: 600,
                owner: "David",
                country: "Brazil",
                originalValue: 500,
                ownedValue: 0.7,
                type: "commodity"
              },
              {
                name: "Wheat",
                image: nftImages.Wheat,
                valueUSD: 1100,
                owner: "Eve",
                country: "Ukraine",
                originalValue: 1000,
                ownedValue: 0.4,
                type: "commodity"
              },
              {
                name: "Thorium",
                image: nftImages.Thorium,
                valueUSD: 5000,
                owner: "Frank",
                country: "India",
                originalValue: 4500,
                ownedValue: 0.2,
                type: "commodity"
              },
              // Real Estate
              {
                name: "Commercial Real Estate",
                image: nftImages["Commercial Real Estate"],
                valueUSD: 25000,
                owner: "Grace",
                country: "Singapore",
                originalValue: 20000,
                ownedValue: 0.1,
                type: "realestate"
              },
              {
                name: "Residential Real Estate",
                image: nftImages["Residential Real Estate"],
                valueUSD: 18000,
                owner: "Heidi",
                country: "ManyMarkup",
                originalValue: 15000,
                ownedValue: 0.25,
                type: "realestate"
              }
            ].map((nft, idx) => (
              <div
                key={nft.name}
                className={`glass-card p-0 overflow-hidden shadow-xl border-2 ${nft.type === 'commodity' ? 'border-yellow-400/30 hover:border-yellow-400/60' : 'border-blue-400/30 hover:border-blue-400/60'} transition-all duration-300 group relative nft-card-animate`}
                style={{ minHeight: 380, display: 'flex', flexDirection: 'column', justifyContent: 'stretch' }}
              >
                <div className="relative h-40 w-full overflow-hidden">
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                  <div className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-bold shadow ${nft.type === 'commodity' ? 'bg-yellow-400/90 text-yellow-900' : 'bg-blue-400/90 text-blue-900'}`}>{nft.type === 'commodity' ? 'Commodity' : 'Real Estate'}</div>
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold bg-wallet-emerald/90 text-white shadow">ManyMarkup</div>
                </div>
                <div className="flex-1 flex flex-col justify-between p-5 gap-2">
                  <div>
                    <h4 className="text-xl font-bold text-wallet-emerald mb-1 text-left">{nft.name}</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-gray-400 text-xs">Owner:</span>
                      <span className="font-medium text-sm text-wallet-emerald">{nft.owner}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-gray-400 text-xs">Country:</span>
                      <span className="font-medium text-sm text-wallet-emerald">{nft.country}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs">Original Value</span>
                      <span className="font-semibold text-sm text-wallet-emerald">${nft.originalValue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs">NFT Value</span>
                      <span className="font-semibold text-sm text-wallet-emerald">${(nft.valueUSD * nft.ownedValue).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs">% Owned</span>
                      <span className="font-semibold text-sm text-wallet-emerald">{(nft.ownedValue * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-gray-400 text-xs">Current Value</span>
                      <span className="text-lg font-bold text-wallet-emerald">${nft.valueUSD.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="px-5 pb-5 pt-2 flex justify-end">
                  <button
                    className="w-full btn-primary py-2 rounded-xl font-semibold text-base shadow-md hover:shadow-xl hover:scale-105 focus:scale-105 transition-all duration-200 nft-trade-btn-animate"
                    style={{ background: 'linear-gradient(90deg, var(--tw-gradient-stops))', backgroundImage: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)', color: 'white' }}
                  >
                    Trade
                  </button>
                </div>
              </div>
            ))}
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

// NFT card animation styles
// Add this at the end of the file (or in a global CSS if preferred)
import "./nftCardAnimations.css";
