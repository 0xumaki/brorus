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

export const mockOffers: Offer[] = [
  {
    id: "1",
    advertiser: {
      name: "cryptoTrader123",
      walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      userId: "user-1",
      completedTrades: 245,
      completionRate: 99.2,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=crypto123"
    },
    type: "sell",
    price: 1.00,
    currency: "USD",
    cryptoCurrency: "USDT",
    available: 500,
    min: 30,
    max: 500,
    paymentMethods: [paymentMethods[0], paymentMethods[4]],
    createdAt: "2025-03-30T09:30:00Z"
  },
  {
    id: "2",
    advertiser: {
      name: "myanmarCrypto",
      walletAddress: "0x39d16CdaE3Cc2b8648b9D9af01458F5C1d569bEC",
      userId: "user-2",
      completedTrades: 189,
      completionRate: 98.5,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=myanmar"
    },
    type: "sell",
    price: 0.998,
    currency: "USD",
    cryptoCurrency: "USDT",
    available: 1000,
    min: 50,
    max: 1000,
    paymentMethods: [paymentMethods[0], paymentMethods[4], paymentMethods[5]],
    createdAt: "2025-04-01T14:25:00Z"
  },
  {
    id: "3",
    advertiser: {
      name: "satoshiFan",
      walletAddress: "0x8C3a5a8da6CB86C985195eBB24123Cf5c0cF3F57",
      userId: "user-3",
      completedTrades: 532,
      completionRate: 100,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=satoshi"
    },
    type: "buy",
    price: 1.002,
    currency: "USD",
    cryptoCurrency: "USDT",
    available: 2000,
    min: 100,
    max: 2000,
    paymentMethods: [paymentMethods[0], paymentMethods[1]],
    createdAt: "2025-04-02T11:45:00Z"
  },
  {
    id: "4",
    advertiser: {
      name: "yangonTrader",
      walletAddress: "0x2D5a2d5B2C9aD4aE2B0c89722B12F4971a8d7b41",
      userId: "user-4",
      completedTrades: 87,
      completionRate: 97.8,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=yangon"
    },
    type: "buy",
    price: 1.005,
    currency: "USD",
    cryptoCurrency: "USDT",
    available: 800,
    min: 50,
    max: 800,
    paymentMethods: [paymentMethods[4], paymentMethods[5]],
    createdAt: "2025-04-03T08:15:00Z"
  },
  {
    id: "5",
    advertiser: {
      name: "thaiCryptoWhale",
      walletAddress: "0x9c8b2F25C792E9C87ee52b8c91D2D5c0142e334c",
      userId: "user-5",
      completedTrades: 412,
      completionRate: 99.5,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=thai"
    },
    type: "sell",
    price: 35.5,
    currency: "THB",
    cryptoCurrency: "USDT",
    available: 5000,
    min: 100,
    max: 5000,
    paymentMethods: [paymentMethods[0], paymentMethods[2]],
    createdAt: "2025-04-02T16:20:00Z"
  },
  {
    id: "6",
    advertiser: {
      name: "bangkokBuyer",
      walletAddress: "0x6D3A6B16Da8FDc43F9d2a8c9a84D2c1D4F37cD3F",
      userId: "user-6",
      completedTrades: 156,
      completionRate: 98.7,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=bangkok"
    },
    type: "buy",
    price: 35.7,
    currency: "THB",
    cryptoCurrency: "USDT",
    available: 1500,
    min: 50,
    max: 1500,
    paymentMethods: [paymentMethods[0], paymentMethods[2]],
    createdAt: "2025-04-03T10:05:00Z"
  },
  {
    id: "7",
    advertiser: {
      name: "sgCryptoDealer",
      walletAddress: "0x4f8a6e57fc34e9d2f1c5c274b57d4aec7e87d2ab",
      userId: "user-7",
      completedTrades: 327,
      completionRate: 99.8,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=singapore"
    },
    type: "sell",
    price: 1.32,
    currency: "SGD",
    cryptoCurrency: "USDC",
    available: 3000,
    min: 100,
    max: 3000,
    paymentMethods: [paymentMethods[0], paymentMethods[1]],
    createdAt: "2025-04-01T12:30:00Z"
  },
  {
    id: "8",
    advertiser: {
      name: "singaporeBuyer",
      walletAddress: "0x7e9f8c2d1a3b4e5f6a7b8c9d0e1f2a3b4c5d6e7f",
      userId: "user-8",
      completedTrades: 298,
      completionRate: 99.1,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=singapore2"
    },
    type: "buy",
    price: 1.34,
    currency: "SGD",
    cryptoCurrency: "USDC",
    available: 2500,
    min: 50,
    max: 2500,
    paymentMethods: [paymentMethods[0], paymentMethods[1]],
    createdAt: "2025-04-02T15:45:00Z"
  },
  {
    id: "9",
    advertiser: {
      name: "btcMaster",
      walletAddress: "0xc7d6a98f3e2d4c5b7a1e8f9d0a2c3b4d5e6f7a8b",
      userId: "user-9",
      completedTrades: 781,
      completionRate: 99.9,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=btcmaster"
    },
    type: "sell",
    price: 2098,
    currency: "MMK",
    cryptoCurrency: "USDT",
    available: 2500,
    min: 100,
    max: 2500,
    paymentMethods: [paymentMethods[0], paymentMethods[1], paymentMethods[4]],
    createdAt: "2025-04-05T14:20:00Z"
  },
  {
    id: "10",
    advertiser: {
      name: "cryptoInvestor",
      walletAddress: "0x5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c",
      userId: "user-10",
      completedTrades: 235,
      completionRate: 98.8,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=investor"
    },
    type: "buy",
    price: 1.35,
    currency: "SGD",
    cryptoCurrency: "USDC",
    available: 5000,
    min: 100,
    max: 5000,
    paymentMethods: [paymentMethods[0], paymentMethods[3]],
    createdAt: "2025-04-06T09:15:00Z"
  },
  {
    id: "11",
    advertiser: {
      name: "cryptoTrader123",
      walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      userId: "user-1",
      completedTrades: 245,
      completionRate: 99.2,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=crypto123"
    },
    type: "buy",
    price: 2090,
    currency: "MMK",
    cryptoCurrency: "USDT",
    available: 1000,
    min: 50,
    max: 1000,
    paymentMethods: [paymentMethods[0], paymentMethods[4]],
    createdAt: "2025-04-04T14:30:00Z"
  },
  {
    id: "12",
    advertiser: {
      name: "cryptoTrader123",
      walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      userId: "user-1",
      completedTrades: 245,
      completionRate: 99.2,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=crypto123"
    },
    type: "sell",
    price: 35.2,
    currency: "THB",
    cryptoCurrency: "USDT",
    available: 500,
    min: 100,
    max: 500,
    paymentMethods: [paymentMethods[0], paymentMethods[2]],
    createdAt: "2025-04-05T09:45:00Z"
  },
  {
    id: "13",
    advertiser: {
      name: "cryptoTrader123",
      walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      userId: "user-1",
      completedTrades: 245,
      completionRate: 99.2,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=crypto123"
    },
    type: "buy",
    price: 1.30,
    currency: "SGD",
    cryptoCurrency: "USDC",
    available: 2000,
    min: 200,
    max: 2000,
    paymentMethods: [paymentMethods[0], paymentMethods[3]],
    createdAt: "2025-04-05T16:20:00Z"
  },
  {
    id: "14",
    advertiser: {
      name: "cryptoTrader123",
      walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      userId: "user-1",
      completedTrades: 245,
      completionRate: 99.2,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=crypto123"
    },
    type: "sell",
    price: 2105,
    currency: "MMK",
    cryptoCurrency: "USDT",
    available: 1500,
    min: 100,
    max: 1500,
    paymentMethods: [paymentMethods[4], paymentMethods[5]],
    createdAt: "2025-04-06T10:15:00Z"
  }
];
