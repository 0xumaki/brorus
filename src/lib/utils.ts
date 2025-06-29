import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Transaction } from "./mockData"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Calculates the balance history based on transactions
export function calculateBalanceHistory(transactions: Transaction[]) {
  // Sort transactions by date (oldest first)
  const sortedTransactions = [...transactions].sort((a, b) => 
    a.date.getTime() - b.date.getTime()
  );
  
  // Use the same total balance as in the Index page (sum of all stablecoin balances)
  const stablecoins = [
    {
      id: 1,
      name: "Tether",
      symbol: "USDT",
      balance: 532.42,
      dollarValue: 532.42,
      percentChange: -0.02,
    },
    {
      id: 2,
      name: "USD Coin",
      symbol: "USDC",
      balance: 1250.75,
      dollarValue: 1250.75,
      percentChange: 0.01,
    },
    {
      id: 3,
      name: "Dai",
      symbol: "DAI",
      balance: 375.50,
      dollarValue: 375.50,
      percentChange: 0.03,
    },
  ];
  
  // Calculate total balance - same logic as in Index.tsx
  const totalBalance = stablecoins.reduce((acc, coin) => acc + coin.dollarValue, 0);
  
  // Initialize the balance history with the starting point
  const balanceHistory = [{
    date: new Date(sortedTransactions[0]?.date.getTime() - 86400000 || Date.now()), // Day before first transaction
    balance: totalBalance
  }];
  
  let currentBalance = totalBalance;
  
  // Calculate running balance for each transaction
  sortedTransactions.forEach(transaction => {
    if (transaction.type === "receive") {
      currentBalance += transaction.amount;
    } else if (transaction.type === "send") {
      currentBalance -= transaction.amount;
    }
    // Pending transactions don't affect balance yet
    
    balanceHistory.push({
      date: new Date(transaction.date),
      balance: currentBalance
    });
  });
  
  return balanceHistory;
}

// Fetch real ERC-20 Transfer events for a wallet address
export async function fetchErc20Transfers({
  web3,
  tokenAddress,
  walletAddress,
  fromBlock = 0,
  toBlock = 'latest',
}) {
  const ERC20_TRANSFER_ABI = [{
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  }];
  const contract = new web3.eth.Contract(ERC20_TRANSFER_ABI, tokenAddress);
  // Fetch both sent and received events
  const [sent, received] = await Promise.all([
    contract.getPastEvents('Transfer', {
      filter: { from: walletAddress },
      fromBlock,
      toBlock,
    }),
    contract.getPastEvents('Transfer', {
      filter: { to: walletAddress },
      fromBlock,
      toBlock,
    }),
  ]);
  return { sent, received };
}
