import React, { useState } from "react";
import { useLanguage } from "@/contexts/language";
import { useTrade, Trade, TradeStatus } from "./context/TradeContext";
import TradeDetails from "./TradeDetails";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { formatTimeDifference } from "./utils/dateUtils";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

const TradeHistory: React.FC = () => {
  const {
    t,
    formatNumber
  } = useLanguage();
  const {
    trades,
    setActiveTrade
  } = useTrade();
  const [selectedTradeId, setSelectedTradeId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "completed" | "disputed">("all");
  const isMobile = useIsMobile();
  
  const filteredTrades = trades.filter(trade => {
    // Remove MMK offers
    if (trade.offer.currency === "MMK") return false;
    if (filter === "active") {
      return trade.status === "pending" || trade.status === "paid";
    } else if (filter === "completed") {
      return trade.status === "completed";
    } else if (filter === "disputed") {
      return trade.status === "disputed";
    } else {
      return true; // "all"
    }
  });
  
  const sortedTrades = [...filteredTrades].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const openTradeDetails = (trade: Trade) => {
    setActiveTrade(trade);
    setSelectedTradeId(trade.id);
  };
  
  const closeTradeDetails = () => {
    setSelectedTradeId(null);
  };
  
  const renderStatusIndicator = (status: TradeStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case "paid":
        return <Clock className="h-4 w-4 text-blue-400" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case "disputed":
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case "cancelled":
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };
  
  return <div>
      <Tabs defaultValue="all" onValueChange={value => setFilter(value as any)}>
        {isMobile ? <ScrollArea className="w-full pb-4 mb-4 border-b border-white/10" orientation="horizontal">
            <TabsList className="bg-transparent w-max flex gap-3 px-2 py-2">
              <TabsTrigger value="all" className="min-w-[80px] text-xs md:text-sm rounded-md data-[state=active]:bg-crystal-primary/20 data-[state=active]:text-crystal-primary">
                {t("p2p.all_trades", "All Trades")}
              </TabsTrigger>
              <TabsTrigger value="active" className="min-w-[80px] text-xs md:text-sm rounded-md data-[state=active]:bg-crystal-primary/20 data-[state=active]:text-crystal-primary">
                {t("p2p.active_trades", "Active")}
              </TabsTrigger>
              <TabsTrigger value="completed" className="min-w-[80px] text-xs md:text-sm rounded-md data-[state=active]:bg-crystal-primary/20 data-[state=active]:text-crystal-primary">
                {t("p2p.completed_trades", "Completed")}
              </TabsTrigger>
              <TabsTrigger value="disputed" className="min-w-[80px] text-xs md:text-sm rounded-md data-[state=active]:bg-crystal-primary/20 data-[state=active]:text-crystal-primary">
                {t("p2p.disputed_trades", "Disputed")}
              </TabsTrigger>
            </TabsList>
          </ScrollArea> : <TabsList className="w-full mb-4 bg-white/5 p-1 md:p-1 rounded-md border border-white/10 flex space-x-2">
            <TabsTrigger value="all" className="flex-1 min-w-[70px] text-xs md:text-sm rounded-md data-[state=active]:bg-crystal-primary/20 data-[state=active]:text-crystal-primary">
              {t("p2p.all_trades", "All Trades")}
            </TabsTrigger>
            <TabsTrigger value="active" className="flex-1 min-w-[70px] text-xs md:text-sm rounded-md data-[state=active]:bg-crystal-primary/20 data-[state=active]:text-crystal-primary">
              {t("p2p.active_trades", "Active")}
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex-1 min-w-[70px] text-xs md:text-sm rounded-md data-[state=active]:bg-crystal-primary/20 data-[state=active]:text-crystal-primary">
              {t("p2p.completed_trades", "Completed")}
            </TabsTrigger>
            <TabsTrigger value="disputed" className="flex-1 min-w-[70px] text-xs md:text-sm rounded-md data-[state=active]:bg-crystal-primary/20 data-[state=active]:text-crystal-primary">
              {t("p2p.disputed_trades", "Disputed")}
            </TabsTrigger>
          </TabsList>}
        
        <TabsContent value="all" className="mt-0">
          {renderTradeList()}
        </TabsContent>
        <TabsContent value="active" className="mt-0">
          {renderTradeList()}
        </TabsContent>
        <TabsContent value="completed" className="mt-0">
          {renderTradeList()}
        </TabsContent>
        <TabsContent value="disputed" className="mt-0">
          {renderTradeList()}
        </TabsContent>
      </Tabs>
      
      <TradeDetails isOpen={!!selectedTradeId} onClose={closeTradeDetails} />
    </div>;
  function renderTradeList() {
    if (sortedTrades.length === 0) {
      return <div className="glass-card p-6 text-center">
          <p className="text-gray-400">
            {filter === "all" ? t("p2p.no_trades", "You haven't made any trades yet") : filter === "active" ? t("p2p.no_active_trades", "You don't have any active trades") : filter === "completed" ? t("p2p.no_completed_trades", "You don't have any completed trades") : t("p2p.no_disputed_trades", "You don't have any disputed trades")}
          </p>
        </div>;
    }
    return <div className="space-y-2">
        {sortedTrades.map(trade => <div key={trade.id} className={`glass-card ${isMobile ? 'p-3 rounded-xl' : 'p-4 rounded-2xl'} cursor-pointer hover:bg-white/5 active:bg-white/10 transition-colors`} onClick={() => openTradeDetails(trade)}>
            <div className={`flex items-center ${isMobile ? 'flex-col space-y-2' : 'justify-between'}`}>
              <div className={`flex items-center gap-3 ${isMobile ? 'w-full justify-between' : ''}`}>
                {renderStatusIndicator(trade.status)}
                <div className="flex-1">
                  <p className={`font-medium text-left ${isMobile ? 'text-sm' : ''}`}>
                    {trade.tradeType === "buy" ? t("p2p.buy", "Buy") : t("p2p.sell", "Sell")}{" "}
                    {formatNumber(trade.amount)} {trade.offer.cryptoCurrency}
                  </p>
                  <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-400 text-left`}>
                    {formatNumber(trade.total)} {trade.offer.currency} ({formatNumber(trade.offer.price)} {trade.offer.currency})
                  </p>
                </div>
              </div>
              
              <div className={`${isMobile ? 'w-full border-t border-white/5 pt-2 mt-1 flex justify-between items-center' : 'text-right'}`}>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-400 text-left`}>
                  {formatTimeDifference(new Date(trade.createdAt))}
                </p>
                <p className="text-xs">
                  #{trade.id.slice(0, 8)}
                </p>
              </div>
            </div>
          </div>)}
      </div>;
  }
};
export default TradeHistory;
