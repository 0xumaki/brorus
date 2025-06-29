import React, { useState, useEffect } from "react";
import WalletLayout from "@/components/layout/WalletLayout";
import { ArrowLeft, ArrowDown, Settings, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { currencies } from "@/components/transfer/data/currencies";

const Swap = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [fromAmount, setFromAmount] = useState("");
  const defaultFrom = currencies.find(c => c.symbol === "USDC")?.symbol || currencies[0].symbol;
  const defaultTo = currencies.find(c => c.symbol === "USDT")?.symbol || currencies[1].symbol;
  const [fromCurrency, setFromCurrency] = useState(defaultFrom);
  const [toCurrency, setToCurrency] = useState(defaultTo);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [isFetchingRate, setIsFetchingRate] = useState(false);
  
  // Fetch real exchange rate when currencies change
  useEffect(() => {
    if (fromCurrency && toCurrency && fromCurrency !== toCurrency) {
      setIsFetchingRate(true);
      fetch(`https://api.exchangerate.host/latest?base=${fromCurrency}&symbols=${toCurrency}`)
        .then(res => res.json())
        .then(data => {
          const rate = data.rates?.[toCurrency] || 1;
          setExchangeRate(rate);
        })
        .catch(() => setExchangeRate(1))
        .finally(() => setIsFetchingRate(false));
    } else {
      setExchangeRate(1);
    }
  }, [fromCurrency, toCurrency]);

  const handleSwap = () => {
    if (!fromAmount) {
      toast({
        title: "Invalid Amount",
        description: "Please enter an amount to swap",
        variant: "destructive",
      });
      return;
    }
    const amount = parseFloat(fromAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to swap",
        variant: "destructive",
      });
      return;
    }
    if (fromCurrency === toCurrency) {
      toast({
        title: "Invalid Swap",
        description: "Please select different currencies to swap",
        variant: "destructive",
      });
      return;
    }
    // Get balances from localStorage
    const fromKey = `wallet_balance_${fromCurrency}`;
    const toKey = `wallet_balance_${toCurrency}`;
    const fromBalance = parseFloat(localStorage.getItem(fromKey) || "0");
    const toBalance = parseFloat(localStorage.getItem(toKey) || "0");
    const toAmount = amount * exchangeRate;
    if (fromBalance < amount) {
      toast({
        title: "Insufficient Balance",
        description: `You only have ${fromBalance.toLocaleString()} ${fromCurrency}`,
        variant: "destructive",
      });
      return;
    }
    // Update balances
    const newFromBalance = fromBalance - amount;
    const newToBalance = toBalance + toAmount;
    localStorage.setItem(fromKey, newFromBalance.toString());
    localStorage.setItem(toKey, newToBalance.toString());
    // Trigger walletBalanceUpdated event for both currencies
    window.dispatchEvent(new CustomEvent('walletBalanceUpdated', { detail: { currency: fromCurrency, newBalance: newFromBalance } }));
    window.dispatchEvent(new CustomEvent('walletBalanceUpdated', { detail: { currency: toCurrency, newBalance: newToBalance } }));
    // Show success toast
    toast({
      title: "Swap Successful!",
      description: `Swapped ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${fromCurrency} to ${toAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${toCurrency}`,
      variant: "default",
    });
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };
  
  const handleFlip = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  return (
    <WalletLayout>
      <div className="flex items-center gap-3 mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/")}
          className="mr-2 bg-wallet-emerald/10 hover:bg-wallet-emerald/20 border border-wallet-emerald/20"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-extrabold text-wallet-emerald tracking-tight drop-shadow-sm">Swap Stablecoins</h1>
      </div>

      <div className="relative flex justify-center">
        <div className="glass-card p-8 w-full max-w-md rounded-3xl shadow-2xl border-2 border-wallet-emerald/30 bg-gradient-to-br from-wallet-emerald/10 to-wallet-black/40 backdrop-blur-xl swap-main-card relative">
          <div className="absolute -inset-1 rounded-3xl pointer-events-none swap-glow-border"></div>
          {/* Settings icon inside card */}
          <Button variant="ghost" size="icon" className="absolute top-4 right-4 bg-wallet-emerald/10 hover:bg-wallet-emerald/20 border border-wallet-emerald/20 z-10">
            <Settings size={18} />
          </Button>
          <div className="space-y-8">
            {/* From Currency */}
            <div>
              <label className="text-sm text-wallet-emerald font-semibold mb-2 block">From</label>
              <div className="flex space-x-3 items-center">
                <div className="flex-1">
                  <Input
                    type="number"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    placeholder="0.00"
                    className="bg-wallet-black/20 border border-wallet-emerald/20 text-white text-lg font-bold rounded-xl focus:ring-2 focus:ring-wallet-emerald/40"
                  />
                </div>
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="w-44 bg-wallet-black/20 border border-wallet-emerald/20 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-wallet-black border-wallet-emerald/20 max-h-72 overflow-y-auto rounded-xl">
                    {currencies.map((coin) => (
                      <SelectItem key={coin.symbol} value={coin.symbol} className="hover:bg-wallet-emerald/10 rounded-lg">
                        <div className="flex items-center">
                          <img src={coin.iconUrl} alt={coin.name} className="w-5 h-5 mr-2 rounded-full" />
                          <span className="font-semibold text-white">{coin.symbol}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Swap Direction Button */}
            <div className="flex justify-center my-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFlip}
                className="h-12 w-12 rounded-full bg-wallet-emerald/20 border-2 border-wallet-emerald/40 shadow-lg hover:bg-wallet-emerald/40 hover:scale-110 transition-all duration-200 flex items-center justify-center swap-arrow-btn"
                aria-label="Swap direction"
              >
                <ArrowDown size={28} className="text-wallet-emerald drop-shadow" />
              </Button>
            </div>

            {/* To Currency */}
            <div>
              <label className="text-sm text-wallet-emerald font-semibold mb-2 block">To</label>
              <div className="flex space-x-3 items-center">
                <div className="flex-1">
                  <Input
                    type="number"
                    value={fromAmount ? (parseFloat(fromAmount) * exchangeRate).toFixed(2) : ""}
                    disabled
                    placeholder="0.00"
                    className="bg-wallet-black/10 border border-wallet-emerald/10 text-white text-lg font-bold rounded-xl opacity-80"
                  />
                </div>
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger className="w-44 bg-wallet-black/20 border border-wallet-emerald/20 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-wallet-black border-wallet-emerald/20 max-h-72 overflow-y-auto rounded-xl">
                    {currencies.map((coin) => (
                      <SelectItem key={coin.symbol} value={coin.symbol} className="hover:bg-wallet-emerald/10 rounded-lg">
                        <div className="flex items-center">
                          <img src={coin.iconUrl} alt={coin.name} className="w-5 h-5 mr-2 rounded-full" />
                          <span className="font-semibold text-white">{coin.symbol}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Swap Details */}
            <div className="mt-6">
              <div className="rounded-xl bg-wallet-emerald/10 border border-wallet-emerald/20 p-4 flex flex-col gap-2 shadow-inner">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Exchange Rate</span>
                  <span className="font-semibold text-wallet-emerald">
                    {isFetchingRate ? "Loading..." : `1 ${fromCurrency} ≈ ${exchangeRate.toFixed(4)} ${toCurrency}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Network Fee</span>
                  <span className="font-semibold text-wallet-emerald">$0.25</span>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="flex items-start text-xs text-yellow-400 mt-4 bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-2">
              <Info size={14} className="mr-2 mt-0.5 flex-shrink-0 text-yellow-400" />
              <span>
                Swapping between stablecoins or CBDCs may involve small conversion fees and slippage. This is a demo swap for hackathon purposes only.
              </span>
            </div>

            <Button
              onClick={handleSwap}
              className="w-full mt-6 py-3 text-lg font-bold rounded-xl bg-gradient-to-r from-wallet-emerald to-wallet-emerald/80 hover:from-wallet-emerald/80 hover:to-wallet-emerald/60 shadow-xl border-none swap-btn-animate"
            >
              <span className="drop-shadow">Swap Now</span>
            </Button>
          </div>
        </div>
      </div>
      <style>{`
        .swap-main-card {
          box-shadow: 0 8px 40px 0 rgba(16,185,129,0.10), 0 1.5px 8px 0 rgba(52,211,153,0.10);
          position: relative;
        }
        .swap-glow-border {
          background: radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.18) 0%, rgba(52,211,153,0.10) 100%);
          filter: blur(8px);
          z-index: 0;
        }
        .swap-arrow-btn {
          box-shadow: 0 2px 12px 0 rgba(16,185,129,0.10);
        }
        .swap-btn-animate {
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .swap-btn-animate:hover, .swap-btn-animate:focus {
          box-shadow: 0 4px 24px 0 rgba(16,185,129,0.25);
          transform: scale(1.03);
        }
      `}</style>
    </WalletLayout>
  );
};

export default Swap;
