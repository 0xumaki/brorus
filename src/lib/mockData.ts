
export interface Transaction {
  id: number;
  type: "send" | "receive" | "pending";
  amount: number;
  symbol: string;
  address: string;
  timestamp: string;
  date: Date; // For filtering by date
  hash?: string;
  blockNumber?: string;
  fee?: string;
}

export const mockTransactions: Transaction[] = [
  {
    id: 1,
    type: "receive",
    amount: 250,
    symbol: "USDC",
    address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    timestamp: "10:23 AM",
    date: new Date(2023, 11, 5), // December 5, 2023
    hash: "0x7a6b17a0917c11b9bf578bc369dd9a6ba5b7d32fc54a6e0a6b",
    blockNumber: "15028123",
    fee: "0.0005 ETH ($0.85)"
  },
  {
    id: 2,
    type: "send",
    amount: 125.5,
    symbol: "USDT",
    address: "0x39d16CdaE3Cc2b8648b9D9af01458F5C1d569bEC",
    timestamp: "Yesterday",
    date: new Date(2023, 11, 4), // December 4, 2023
    hash: "0x5c8d93a097e4b5bf2e39b31a899c4d86c7d556a8be9c4583",
    blockNumber: "15028001",
    fee: "0.0004 ETH ($0.68)"
  },
  {
    id: 3,
    type: "pending",
    amount: 75,
    symbol: "USDT",
    address: "0x8C3a5a8da6CB86C985195eBB24123Cf5c0cF3F57",
    timestamp: "Pending",
    date: new Date(2023, 11, 5), // December 5, 2023
    hash: "0x1d9b24f8e94dc7a379d76a93fb3c1f7d18f7ebca03e97d39",
    fee: "0.0003 ETH ($0.51)"
  },
  {
    id: 4,
    type: "receive",
    amount: 500,
    symbol: "USDT",
    address: "0x4a29b28F67ADB8B8951a72Bfb546Ab458D3283Ef",
    timestamp: "Dec 3",
    date: new Date(2023, 11, 3), // December 3, 2023
    hash: "0x9f3e8a517be4bd45e0b936c5e403edcd452fed13a869c8d8",
    blockNumber: "15027500",
    fee: "0.0006 ETH ($1.02)"
  },
  {
    id: 5,
    type: "send",
    amount: 200,
    symbol: "USDC",
    address: "0xf67EaCB33a634eFFaB35726a89d8c37DBa784454",
    timestamp: "Dec 2",
    date: new Date(2023, 11, 2), // December 2, 2023
    hash: "0x3c6a94548c2f21833e0da03f7f386adc75f65e7f26b1d729",
    blockNumber: "15027321",
    fee: "0.0004 ETH ($0.68)"
  },
  {
    id: 6,
    type: "receive",
    amount: 100,
    symbol: "USDC",
    address: "0x2D5a2d5B2C9aD4aE2B0c89722B12F4971a8d7b41",
    timestamp: "Dec 1",
    date: new Date(2023, 11, 1), // December 1, 2023
    hash: "0xb8e3d82c68a53a55f9b626ef78ae992c7a38f5d4d5c54321",
    blockNumber: "15026943",
    fee: "0.0003 ETH ($0.51)"
  },
  {
    id: 7,
    type: "send",
    amount: 50.25,
    symbol: "USDT",
    address: "0x9c8b2F25C792E9C87ee52b8c91D2D5c0142e334c",
    timestamp: "Nov 30",
    date: new Date(2023, 10, 30), // November 30, 2023
    hash: "0x4f8a6e57fc34e9d2f1c5c274b57d4aec7e87d2abcd4e9f6a",
    blockNumber: "15026421",
    fee: "0.0005 ETH ($0.85)"
  },
  {
    id: 8,
    type: "receive",
    amount: 175.75,
    symbol: "USDC",
    address: "0x6D3A6B16Da8FDc43F9d2a8c9a84D2c1D4F37cD3F",
    timestamp: "Nov 28",
    date: new Date(2023, 10, 28), // November 28, 2023
    hash: "0xc7d6a98f3e2d4c5b7a1e8f9d0a2c3b4d5e6f7a8b9c0d1e2f",
    blockNumber: "15025832",
    fee: "0.0004 ETH ($0.68)"
  }
];
