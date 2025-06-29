import React, { useState } from "react";
import TransactionItem from "@/components/dashboard/TransactionItem";
import TransactionDetails from "./TransactionDetails";

interface TransactionListProps {
  searchQuery: string;
  filters: {
    type: string;
    dateRange: string;
    coin: string;
  };
  transactions: any[];
}

const TransactionList: React.FC<TransactionListProps> = ({ searchQuery, filters, transactions }) => {
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);

  // Filter transactions based on search query and filters
  const filteredTransactions = transactions.filter(transaction => {
    // Search filter
    if (searchQuery && !transaction.address.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !`${transaction.amount}`.includes(searchQuery)) {
      return false;
    }
    
    // Type filter
    if (filters.type !== "all" && transaction.type !== filters.type) {
      return false;
    }
    
    // Coin filter
    if (filters.coin !== "all" && transaction.symbol !== filters.coin) {
      return false;
    }
    
    // Date range filter would go here in a real app with actual dates
    
    return true;
  });

  return (
    <div>
      {selectedTransaction !== null ? (
        <TransactionDetails 
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      ) : (
        <div className="glass-card divide-y divide-white/10">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <div key={transaction.hash || transaction.id} onClick={() => setSelectedTransaction(transaction)}>
                <TransactionItem
                  type={transaction.type}
                  amount={transaction.amount}
                  symbol={transaction.symbol}
                  address={transaction.address}
                  timestamp={transaction.timestamp}
                />
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-400">
              <p>No transactions found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionList;
