import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OfferList from "./OfferList";
import P2PFilters from "./P2PFilters";
import TradeHistory from "./TradeHistory";
import { useLanguage } from "@/contexts/language";
import { TradeType, mockOffers } from "./data/offerTypes";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { Bell, History, ListFilter, Bot, Sparkles } from "lucide-react";
import { TradeProvider } from "./context/TradeContext";
import { ElizaOSProvider } from "./context/ElizaOSContext";
import UserOfferList from "./UserOfferList";
import ElizaOSAssistant from "./ElizaOSAssistant";
import SmartTradingFeatures from "./SmartTradingFeatures";

const P2PMarketplace = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [tradeType, setTradeType] = useState<TradeType>("buy");
  const [selectedCrypto, setSelectedCrypto] = useState("USDT");
  const [selectedFiat, setSelectedFiat] = useState("USD");
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<number[]>([]);
  const [view, setView] = useState<"market" | "history" | "myoffers" | "elizaos">("market");

  // Filter offers based on selections
  const filteredOffers = mockOffers.filter(offer => {
    // For Buy tab, we want to see Sell offers (users selling crypto to us)
    // For Sell tab, we want to see Buy offers (users buying crypto from us)
    const matchesTradeType = tradeType === "buy" ? offer.type === "sell" : offer.type === "buy";
    const matchesCrypto = offer.cryptoCurrency === selectedCrypto;
    const matchesFiat = offer.currency === selectedFiat;
    
    // If no payment methods selected, show all
    // Otherwise, check if the offer has at least one selected payment method
    const matchesPaymentMethod = selectedPaymentMethods.length === 0 || 
      offer.paymentMethods.some(method => selectedPaymentMethods.includes(method.id));
    
    return matchesTradeType && matchesCrypto && matchesFiat && matchesPaymentMethod;
  });

  return (
    <ElizaOSProvider>
      <Card className="border-white/10 bg-black/20 overflow-hidden w-full">
        <div className={`flex flex-col sm:flex-row justify-between items-center bg-white/5 border-b border-white/10 ${isMobile ? 'p-1.5 gap-2' : 'p-2'}`}>
          <Tabs 
            defaultValue="market" 
            value={view}
            onValueChange={(value) => setView(value as "market" | "history" | "myoffers" | "elizaos")}
            className={`flex-grow ${isMobile ? 'w-full' : ''}`}
          >
            <TabsList className={`bg-transparent ${isMobile ? 'w-full grid grid-cols-4 gap-1' : ''}`}>
              <TabsTrigger 
                value="market" 
                className={`rounded-md data-[state=active]:bg-crystal-primary/20 data-[state=active]:text-crystal-primary ${isMobile ? 'py-1.5 text-xs' : ''}`}
              >
                {t("p2p.marketplace", "Marketplace")}
              </TabsTrigger>
              <TabsTrigger 
                value="myoffers" 
                className={`rounded-md data-[state=active]:bg-crystal-primary/20 data-[state=active]:text-crystal-primary ${isMobile ? 'py-1.5 text-xs' : ''}`}
              >
                <ListFilter className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-1`} />
                {isMobile ? t("p2p.my_offers", "My Offers") : t("p2p.my_listings", "My Listings")}
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className={`rounded-md data-[state=active]:bg-crystal-primary/20 data-[state=active]:text-crystal-primary ${isMobile ? 'py-1.5 text-xs' : ''}`}
              >
                <History className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-1`} />
                {isMobile ? t("p2p.history", "History") : t("p2p.trade_history", "Trade History")}
              </TabsTrigger>
              <TabsTrigger 
                value="elizaos" 
                className={`rounded-md data-[state=active]:bg-crystal-primary/20 data-[state=active]:text-crystal-primary ${isMobile ? 'py-1.5 text-xs' : ''}`}
              >
                <Bot className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-1`} />
                {isMobile ? "ElizaOS" : "ElizaOS AI"}
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className={`flex items-center ${isMobile ? 'absolute top-1.5 right-2' : ''}`}>
            <button 
              className={`${isMobile ? 'p-1.5' : 'p-2'} rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors relative`}
              aria-label={t("p2p.notifications", "Notifications")}
            >
              <Bell className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
        
        <div className={`px-2 sm:px-4 pt-4 pb-6`}>
          <TradeProvider>
            {view === "market" ? (
              <>
                <Tabs 
                  defaultValue="buy" 
                  onValueChange={(value) => setTradeType(value as TradeType)}
                  className="w-full"
                >
                  <TabsList className="w-full bg-white/5 mb-6 p-1 rounded-md border border-white/10">
                    <TabsTrigger value="buy" className="flex-1 rounded-md data-[state=active]:bg-crystal-primary/20 data-[state=active]:text-crystal-primary">
                      {t("p2p.buy_crypto", "Buy Crypto")}
                    </TabsTrigger>
                    <TabsTrigger value="sell" className="flex-1 rounded-md data-[state=active]:bg-crystal-primary/20 data-[state=active]:text-crystal-primary">
                      {t("p2p.sell_crypto", "Sell Crypto")}
                    </TabsTrigger>
                  </TabsList>
                  
                  <P2PFilters 
                    selectedCrypto={selectedCrypto} 
                    setSelectedCrypto={setSelectedCrypto}
                    selectedFiat={selectedFiat}
                    setSelectedFiat={setSelectedFiat}
                    selectedPaymentMethods={selectedPaymentMethods}
                    setSelectedPaymentMethods={setSelectedPaymentMethods}
                  />
                  
                  <TabsContent value="buy" className="mt-4">
                    <OfferList offers={filteredOffers} tradeType="buy" />
                  </TabsContent>
                  
                  <TabsContent value="sell" className="mt-4">
                    <OfferList offers={filteredOffers} tradeType="sell" />
                  </TabsContent>
                </Tabs>
              </>
            ) : view === "history" ? (
              <TradeHistory />
            ) : view === "myoffers" ? (
              <UserOfferList />
            ) : (
              <SmartTradingFeatures />
            )}
          </TradeProvider>
        </div>

        {/* ElizaOS Assistant - Always available */}
        <ElizaOSAssistant 
          tradeType={tradeType}
          selectedCrypto={selectedCrypto}
          selectedFiat={selectedFiat}
        />
      </Card>
    </ElizaOSProvider>
  );
};

export default P2PMarketplace;
