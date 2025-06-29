export interface Network {
  id: string;
  name: string;
  iconColor: string;
}

export interface Coin {
  id: number;
  name: string;
  symbol: string;
  balance: number;
  dollarValue: number;
  percentChange: number;
  iconUrl: string;
}

// Only Sepolia testnet
export const networks: Network[] = [
  { id: "sepolia", name: "Sepolia Testnet", iconColor: "#CFB53B" },
  { id: "mumbai", name: "Poly Mumbai", iconColor: "#8247E5" },
  { id: "fuji", name: "Avalanche Fuji", iconColor: "#E84142" },
];

export const networkStablecoins: Record<string, Coin[]> = {
  sepolia: [
    {
      id: 1,
      name: "Sepolia Test USDC",
      symbol: "USDC",
      balance: 1000,
      dollarValue: 1000,
      percentChange: 0.0,
      iconUrl: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/usdc.svg",
    }
  ],
  mumbai: [
    {
      id: 1,
      name: "Mumbai Test USDC",
      symbol: "USDC",
      balance: 0,
      dollarValue: 0,
      percentChange: 0.0,
      iconUrl: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/usdc.svg",
    }
  ],
  fuji: [
    {
      id: 1,
      name: "Fuji Test USDC",
      symbol: "USDC",
      balance: 0,
      dollarValue: 0,
      percentChange: 0.0,
      iconUrl: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/usdc.svg",
    }
  ],
};

export const cbdcCoins: Coin[] = [
  {
    id: 2,
    name: "Thai Baht",
    symbol: "THB",
    balance: 15000,
    dollarValue: 421.68,
    percentChange: 0.03,
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Flag_of_Thailand.svg",
  },
  {
    id: 3,
    name: "Chinese Yuan",
    symbol: "CNY",
    balance: 3500,
    dollarValue: 483.52,
    percentChange: 0.02,
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Flag_of_the_People%27s_Republic_of_China.svg",
  }
];
