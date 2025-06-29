import React from "react";
import TransactionItem from "./TransactionItem";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useWallet } from "@/contexts/WalletContext";
import Web3 from "web3";
import { fetchErc20Transfers } from "@/lib/utils";

const TOKEN_ADDRESSES: Record<string, string> = {
  USDT: "0x91093128F514e4D99759FB2816BBc961d7eaAF39",
  USDC: "0xF025544BB1f91eE2BD6a1741CBCC7a9Bfd902E0B",
  CHF: "0x54F1BcF82A329E37804e7627b1cbd29D7323fe9c",
  AUD: "0xeb5Aaf8f2DFE1fca72fDa345d5e9080c133c8C20",
};

const RecentTransactions: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { account, web3 } = useWallet();
  const [transactions, setTransactions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchTransactions = async () => {
      if (!account || !web3) return;
      setLoading(true);
      let allTxs: any[] = [];
      for (const symbol of Object.keys(TOKEN_ADDRESSES)) {
        try {
          const { sent, received } = await fetchErc20Transfers({
            web3,
            tokenAddress: TOKEN_ADDRESSES[symbol],
            walletAddress: account,
            fromBlock: 0,
            toBlock: 'latest',
          });
          sent.forEach(event => {
            allTxs.push({
              id: event.id,
              type: "send",
              amount: Number(web3.utils.fromWei(event.returnValues.value)),
              symbol,
              address: event.returnValues.to,
              blockNumber: event.blockNumber,
              hash: event.transactionHash,
              // timestamp will be filled in after fetching blocks
            });
          });
          received.forEach(event => {
            allTxs.push({
              id: event.id,
              type: "receive",
              amount: Number(web3.utils.fromWei(event.returnValues.value)),
              symbol,
              address: event.returnValues.from,
              blockNumber: event.blockNumber,
              hash: event.transactionHash,
              // timestamp will be filled in after fetching blocks
            });
          });
        } catch (e) {
          // Ignore errors for tokens with no events
        }
      }
      allTxs.sort((a, b) => b.blockNumber - a.blockNumber);
      // Fetch block timestamps for the 3 most recent transactions
      const txsWithTimestamps = await Promise.all(
        allTxs.slice(0, 3).map(async (tx) => {
          try {
            const block = await web3.eth.getBlock(tx.blockNumber);
            return {
              ...tx,
              timestamp: block && block.timestamp ? new Date(Number(block.timestamp) * 1000).toLocaleString() : "",
            };
          } catch {
            return { ...tx, timestamp: "" };
          }
        })
      );
      setTransactions(txsWithTimestamps);
      setLoading(false);
    };
    fetchTransactions();
  }, [account, web3]);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-white pl-2">{t("tx.recent")}</h2>
        <button 
          className="text-sm text-crystal-primary hover:underline pr-2"
          onClick={() => navigate('/transactions')}
        >
          {t("tx.seeAll")}
        </button>
      </div>
      <div className="glass-card divide-y divide-white/10">
        {loading ? (
          <div className="p-6 text-center text-gray-400">Loading transactions...</div>
        ) : transactions.length > 0 ? (
          transactions.map((transaction) => (
            <TransactionItem
              key={transaction.hash || transaction.id}
              type={transaction.type}
              amount={transaction.amount}
              symbol={transaction.symbol}
              address={transaction.address}
              timestamp={transaction.timestamp}
            />
          ))
        ) : (
          <div className="p-6 text-center text-gray-400">No recent transactions found</div>
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
