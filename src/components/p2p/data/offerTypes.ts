import { currencies } from "@/components/transfer/data/currencies";

export type PaymentMethod = {
  id: number;
  name: string;
  icon: string;
};

export type TradeType = "buy" | "sell";

export type Advertiser = {
  name: string;
  walletAddress: string;
  userId: string;
  completedTrades: number;
  completionRate: number;
  avatarUrl: string;
};

export type Offer = {
  id: string;
  advertiser: Advertiser;
  type: TradeType;
  price: number;
  currency: string;
  cryptoCurrency: string;
  available: number;
  min: number;
  max: number;
  paymentMethods: PaymentMethod[];
  createdAt: string;
};

export const paymentMethods: PaymentMethod[] = [
  {
    id: 1,
    name: "Bank Transfer",
    icon: "🏦"
  },
  {
    id: 2,
    name: "Cash",
    icon: "💵"
  },
  {
    id: 3,
    name: "Moonpay",
    icon: "🌊"
  },
  {
    id: 4,
    name: "MPU",
    icon: "💳"
  },
  {
    id: 5,
    name: "HSBC",
    icon: "📱"
  },
  {
    id: 6,
    name: "JP. Morgan",
    icon: "📲"
  }
];

// Generate at least 3 offers for every possible pair of wallet currencies (cryptoCurrency, currency)
function generateMockOffers() {
  const paymentMethodsArr = paymentMethods;
  const advertisers = [
    {
      name: "cryptoTrader123",
      walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      userId: "user-1",
      completedTrades: 245,
      completionRate: 99.2,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=crypto123"
    },
    {
      name: "myanmarCrypto",
      walletAddress: "0x39d16CdaE3Cc2b8648b9D9af01458F5C1d569bEC",
      userId: "user-2",
      completedTrades: 189,
      completionRate: 98.5,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=myanmar"
    },
    {
      name: "satoshiFan",
      walletAddress: "0x8C3a5a8da6CB86C985195eBB24123Cf5c0cF3F57",
      userId: "user-3",
      completedTrades: 532,
      completionRate: 100,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=satoshi"
    },
    {
      name: "yangonTrader",
      walletAddress: "0x2D5a2d5B2C9aD4aE2B0c89722B12F4971a8d7b41",
      userId: "user-4",
      completedTrades: 87,
      completionRate: 97.8,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=yangon"
    },
    {
      name: "thaiCryptoWhale",
      walletAddress: "0x9c8b2F25C792E9C87ee52b8c91D2D5c0142e334c",
      userId: "user-5",
      completedTrades: 412,
      completionRate: 99.5,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=thai"
    },
    {
      name: "bangkokBuyer",
      walletAddress: "0x6D3A6B16Da8FDc43F9d2a8c9a84D2c1D4F37cD3F",
      userId: "user-6",
      completedTrades: 156,
      completionRate: 98.7,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=bangkok"
    },
    {
      name: "sgCryptoDealer",
      walletAddress: "0x4f8a6e57fc34e9d2f1c5c274b57d4aec7e87d2ab",
      userId: "user-7",
      completedTrades: 327,
      completionRate: 99.8,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=singapore"
    }
  ];
  const offers = [];
  let id = 1000;
  for (const crypto of currencies) {
    for (const fiat of currencies) {
      if (crypto.symbol === fiat.symbol) continue;
      for (let i = 0; i < 3; i++) {
        // SELL offer (user is selling crypto for fiat)
        offers.push({
          id: `s-${id}-${i}`,
          advertiser: advertisers[(i + id) % advertisers.length],
          type: "sell",
          price: +(Math.random() * 2 + 0.5).toFixed(4),
          currency: fiat.symbol,
          cryptoCurrency: crypto.symbol,
          available: Math.floor(Math.random() * 10000 + 100),
          min: Math.floor(Math.random() * 50 + 10),
          max: Math.floor(Math.random() * 500 + 100),
          paymentMethods: [paymentMethodsArr[i % paymentMethodsArr.length], paymentMethodsArr[(i+1) % paymentMethodsArr.length]],
          createdAt: new Date(Date.now() - Math.random() * 1e10).toISOString()
        });
        // BUY offer (user is buying crypto for fiat)
        offers.push({
          id: `b-${id}-${i}`,
          advertiser: advertisers[(i + id + 1) % advertisers.length],
          type: "buy",
          price: +(Math.random() * 2 + 0.5).toFixed(4),
          currency: fiat.symbol,
          cryptoCurrency: crypto.symbol,
          available: Math.floor(Math.random() * 10000 + 100),
          min: Math.floor(Math.random() * 50 + 10),
          max: Math.floor(Math.random() * 500 + 100),
          paymentMethods: [paymentMethodsArr[(i+2) % paymentMethodsArr.length], paymentMethodsArr[(i+3) % paymentMethodsArr.length]],
          createdAt: new Date(Date.now() - Math.random() * 1e10).toISOString()
        });
      }
      id++;
    }
  }
  return offers;
}

export const mockOffers: Offer[] = generateMockOffers();
