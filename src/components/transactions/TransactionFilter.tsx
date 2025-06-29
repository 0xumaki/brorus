
import React from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface TransactionFilterProps {
  activeFilters: {
    type: string;
    dateRange: string;
    coin: string;
  };
  setActiveFilters: React.Dispatch<React.SetStateAction<{
    type: string;
    dateRange: string;
    coin: string;
  }>>;
  onClose: () => void;
}

const TransactionFilter: React.FC<TransactionFilterProps> = ({ 
  activeFilters, 
  setActiveFilters, 
  onClose 
}) => {
  return (
    <div className="glass-card p-4 mb-4 animate-fade-in">
      <h3 className="font-medium mb-3">Filter Transactions</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm text-gray-400 mb-2">Transaction Type</h4>
          <RadioGroup 
            value={activeFilters.type} 
            onValueChange={(value) => setActiveFilters({...activeFilters, type: value})}
            className="flex flex-wrap gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">All</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="send" id="send" />
              <Label htmlFor="send">Sent</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="receive" id="receive" />
              <Label htmlFor="receive">Received</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pending" id="pending" />
              <Label htmlFor="pending">Pending</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div>
          <h4 className="text-sm text-gray-400 mb-2">Date Range</h4>
          <RadioGroup 
            value={activeFilters.dateRange} 
            onValueChange={(value) => setActiveFilters({...activeFilters, dateRange: value})}
            className="flex flex-wrap gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="date-all" />
              <Label htmlFor="date-all">All Time</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="today" id="today" />
              <Label htmlFor="today">Today</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="week" id="week" />
              <Label htmlFor="week">This Week</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="month" id="month" />
              <Label htmlFor="month">This Month</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div>
          <h4 className="text-sm text-gray-400 mb-2">Coin</h4>
          <RadioGroup 
            value={activeFilters.coin} 
            onValueChange={(value) => setActiveFilters({...activeFilters, coin: value})}
            className="flex flex-wrap gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="coin-all" />
              <Label htmlFor="coin-all">All Coins</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="USDT" id="USDT" />
              <Label htmlFor="USDT">USDT</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="USDC" id="USDC" />
              <Label htmlFor="USDC">USDC</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      
      <div className="flex justify-between mt-4">
        <Button 
          variant="ghost" 
          onClick={() => {
            setActiveFilters({
              type: "all",
              dateRange: "all",
              coin: "all"
            });
          }}
        >
          Reset
        </Button>
        <Button onClick={onClose}>Apply</Button>
      </div>
    </div>
  );
};

export default TransactionFilter;
