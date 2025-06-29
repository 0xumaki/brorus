
import React, { useState } from "react";
import WalletLayout from "@/components/layout/WalletLayout";
import { ArrowLeft, ArrowDown, Settings, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Swap = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [fromAmount, setFromAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USDC");
  const [toCurrency, setToCurrency] = useState("USDT");
  
  const stablecoins = [
    {
      name: "USDC",
      icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=024",
    },
    {
      name: "USDT",
      icon: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=024",
    }
  ];
  
  const handleSwap = () => {
    if (!fromAmount) {
      toast({
        title: "Invalid Amount",
        description: "Please enter an amount to swap",
        variant: "destructive",
      });
      return;
    }
    
    const formattedAmount = parseFloat(fromAmount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    toast({
      title: "Swap Initiated",
      description: `Swapping ${formattedAmount} ${fromCurrency} to ${toCurrency}`,
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
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/")}
            className="mr-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold">Swap Stablecoins</h1>
        </div>
        <Button variant="ghost" size="icon">
          <Settings size={18} />
        </Button>
      </div>
      
      <div className="glass-card p-5 mt-6">
        <div className="space-y-6">
          {/* From Currency */}
          <div>
            <label className="text-sm text-gray-300 mb-2 block">From</label>
            <div className="flex space-x-3">
              <div className="flex-1">
                <Input
                  type="number"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  placeholder="0.00"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className="w-32 bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-crystal-dark border-white/10">
                  {stablecoins.map((coin) => (
                    <SelectItem key={coin.name} value={coin.name} className="hover:bg-white/5">
                      <div className="flex items-center">
                        <img src={coin.icon} alt={coin.name} className="w-4 h-4 mr-2" />
                        {coin.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Swap Direction Button */}
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFlip}
              className="h-8 w-8 rounded-full glass"
            >
              <ArrowDown size={16} />
            </Button>
          </div>
          
          {/* To Currency */}
          <div>
            <label className="text-sm text-gray-300 mb-2 block">To</label>
            <div className="flex space-x-3">
              <div className="flex-1">
                <Input
                  type="number"
                  value={fromAmount} // In a real app, would calculate based on exchange rate
                  disabled
                  placeholder="0.00"
                  className="bg-white/5 border-white/10 text-white opacity-70"
                />
              </div>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className="w-32 bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-crystal-dark border-white/10">
                  {stablecoins.map((coin) => (
                    <SelectItem key={coin.name} value={coin.name} className="hover:bg-white/5">
                      <div className="flex items-center">
                        <img src={coin.icon} alt={coin.name} className="w-4 h-4 mr-2" />
                        {coin.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Swap Details */}
          <div className="glass p-3 rounded-xl">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Exchange Rate</span>
              <span>1 {fromCurrency} ≈ 1 {toCurrency}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-400">Network Fee</span>
              <span>$0.25</span>
            </div>
          </div>
          
          {/* Warning */}
          <div className="flex items-start text-xs text-gray-400">
            <Info size={12} className="mr-1 mt-0.5 flex-shrink-0" />
            <span>
              Swapping between stablecoins may involve small conversion fees and slippage.
            </span>
          </div>
          
          <Button
            onClick={handleSwap}
            className="w-full bg-crystal-primary hover:bg-crystal-primary/80"
          >
            Swap Stablecoins
          </Button>
        </div>
      </div>
    </WalletLayout>
  );
};

export default Swap;
