export interface Currency {
  id: number;
  name: string;
  symbol: string;
  balance: number;
  iconUrl: string;
  type: "stablecoin" | "cbdc";
}

export const currencies: Currency[] = [
  {
    id: 1,
    name: "Tether",
    symbol: "USDT",
    balance: 532.42,
    iconUrl: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/usdt.svg",
    type: "stablecoin"
  },
  {
    id: 2,
    name: "USD Coin",
    symbol: "USDC",
    balance: 1250.75,
    iconUrl: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/usdc.svg",
    type: "stablecoin"
  },
  {
    id: 3,
    name: "Swiss Franc",
    symbol: "CHF",
    balance: 0,
    iconUrl: "https://flagcdn.com/ch.svg",
    type: "cbdc"
  },
  {
    id: 4,
    name: "Australian Dollar",
    symbol: "AUD",
    balance: 0,
    iconUrl: "https://flagcdn.com/au.svg",
    type: "cbdc"
  },
  {
    id: 5,
    name: "Euro",
    symbol: "EUR",
    balance: 1000,
    iconUrl: "https://flagcdn.com/eu.svg",
    type: "cbdc"
  },
  {
    id: 6,
    name: "Canadian Dollar",
    symbol: "CAD",
    balance: 500,
    iconUrl: "https://flagcdn.com/ca.svg",
    type: "cbdc"
  },
  {
    id: 7,
    name: "Singaporean Dollar",
    symbol: "SGD",
    balance: 800,
    iconUrl: "https://flagcdn.com/sg.svg",
    type: "cbdc"
  },
  {
    id: 8,
    name: "Hong Kong Dollar",
    symbol: "HKD",
    balance: 1200,
    iconUrl: "https://flagcdn.com/hk.svg",
    type: "cbdc"
  },
  {
    id: 9,
    name: "Indian Rupee",
    symbol: "INR",
    balance: 25000,
    iconUrl: "https://flagcdn.com/in.svg",
    type: "cbdc"
  },
  {
    id: 10,
    name: "New Zealand Dollar",
    symbol: "NZD",
    balance: 300,
    iconUrl: "https://flagcdn.com/nz.svg",
    type: "cbdc"
  },
  {
    id: 11,
    name: "Mauritius Rupee",
    symbol: "MRP",
    balance: 1500,
    iconUrl: "https://flagcdn.com/mu.svg",
    type: "cbdc"
  },
  {
    id: 12,
    name: "Deutsches Mark",
    symbol: "DEM",
    balance: 200,
    iconUrl: "https://flagcdn.com/de.svg",
    type: "cbdc"
  },
  {
    id: 13,
    name: "Mexican Peso",
    symbol: "MX",
    balance: 900,
    iconUrl: "https://flagcdn.com/mx.svg",
    type: "cbdc"
  },
  {
    id: 14,
    name: "South African Rand",
    symbol: "ZAR",
    balance: 700,
    iconUrl: "https://flagcdn.com/za.svg",
    type: "cbdc"
  },
  {
    id: 15,
    name: "Thai Baht",
    symbol: "THB",
    balance: 1100,
    iconUrl: "https://flagcdn.com/th.svg",
    type: "cbdc"
  }
];
