import React, { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/language";
import Web3 from "web3";

interface TotalBalanceCardProps {
  totalBalance: number;
}

// Chainlink ETH/USD price feed address on Sepolia (see https://docs.chain.link/data-feeds/price-feeds/addresses)
const ETH_USD_FEED = "0x694AA1769357215DE4FAC081bf1f309aDC325306";
const AGGREGATOR_V3_ABI = [
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "latestRoundData",
    "outputs": [
      { "internalType": "uint80", "name": "roundId", "type": "uint80" },
      { "internalType": "int256", "name": "answer", "type": "int256" },
      { "internalType": "uint256", "name": "startedAt", "type": "uint256" },
      { "internalType": "uint256", "name": "updatedAt", "type": "uint256" },
      { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const TotalBalanceCard: React.FC<TotalBalanceCardProps> = ({ totalBalance }) => {
  const { t, formatCurrency } = useLanguage();
  const [ethUsd, setEthUsd] = useState<string | null>(null);

  useEffect(() => {
    // Fetch ETH/USD price from Chainlink on Sepolia
    const fetchEthUsd = async () => {
      if (!window.ethereum) return;
      const web3 = new Web3(window.ethereum);
      const aggregator = new web3.eth.Contract(AGGREGATOR_V3_ABI as any, ETH_USD_FEED);
      try {
        const decimals = await aggregator.methods.decimals().call();
        // latestRoundData returns an array: [roundId, answer, startedAt, updatedAt, answeredInRound]
        const roundData = await aggregator.methods.latestRoundData().call();
        const answer = roundData[1];
        const price = Number(answer) / 10 ** Number(decimals);
        setEthUsd(price.toFixed(2));
      } catch (e) {
        setEthUsd(null);
      }
    };
    fetchEthUsd();
  }, []);

  return (
    <div className="glass-card p-5 mb-6 text-left">
      {/* Chainlink ETH/USD Price Feed (Sepolia) */}
      <div className="mb-2">
        <span className="text-xs text-wallet-gray-400 font-medium">ETH/USD (Chainlink): </span>
        {ethUsd ? (
          <span className="text-sm font-semibold text-wallet-emerald font-mono">${ethUsd}</span>
        ) : (
          <span className="text-xs text-wallet-gray-400">Loading...</span>
        )}
      </div>
      {/* To use USDT/USD or USDC/USD, replace the feed address above when available on Sepolia. */}
      <p className="text-sm text-wallet-gray-400 mb-1 font-medium">{t("total.balance")}</p>
      <h2 className="text-3xl font-bold text-wallet-emerald tracking-tight">{formatCurrency(totalBalance, 'USD')}</h2>
    </div>
  );
};

export default TotalBalanceCard;
