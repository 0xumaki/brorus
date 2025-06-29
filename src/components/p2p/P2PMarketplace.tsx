import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OfferList from "./OfferList";
import P2PFilters from "./P2PFilters";
import TradeHistory from "./TradeHistory";
import { useLanguage } from "@/contexts/language";
import { TradeType, mockOffers } from "./data/offerTypes";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { History, ListFilter, Bot, Sparkles } from "lucide-react";
import { TradeProvider } from "./context/TradeContext";
import { ElizaOSProvider } from "./context/ElizaOSContext";
import UserOfferList from "./UserOfferList";
import ElizaOSChatbot from "./ElizaOSChatbot";
import SmartTradingFeatures from "./SmartTradingFeatures";
import NotificationBell from "@/components/ui/notification-bell";

const P2PMarketplace = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [tradeType, setTradeType] = useState<TradeType>("buy");
  const [selectedCrypto, setSelectedCrypto] = useState("USDT");
  const [selectedFiat, setSelectedFiat] = useState("EUR");
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
            <NotificationBell />
          </div>
        </div>
        
        <div className={`px-2 sm:px-4 pt-4 pb-6`}>
          <TradeProvider>
            {view === "market" ? (
              <>
                <Tabs 
                  defaultValue={tradeType} 
                  value={tradeType}
                  onValueChange={(value) => setTradeType(value as TradeType)}
                  className="w-full"
                >
                  <TabsList className="w-full bg-white/5 mb-6 p-1 rounded-md border border-white/10 flex gap-2">
                    <TabsTrigger 
                      value="buy" 
                      className="flex-1 rounded-md font-bold text-base transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500/80 data-[state=active]:to-green-400/80 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border-2 data-[state=active]:border-green-400/60 border border-transparent"
                    >
                      <span className="inline-flex items-center gap-2">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                        {t("p2p.buy_crypto", "Buy Crypto")}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="sell" 
                      className="flex-1 rounded-md font-bold text-base transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500/80 data-[state=active]:to-pink-400/80 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border-2 data-[state=active]:border-red-400/60 border border-transparent"
                    >
                      <span className="inline-flex items-center gap-2">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20V4m8 8H4" /></svg>
                        {t("p2p.sell_crypto", "Sell Crypto")}
                      </span>
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
                    <OfferList offers={mockOffers.filter(offer => offer.type === 'sell' && (selectedCrypto === 'All' || offer.cryptoCurrency === selectedCrypto) && (selectedFiat === 'All' || offer.currency === selectedFiat))} tradeType="buy" />
                  </TabsContent>
                  <TabsContent value="sell" className="mt-4">
                    <OfferList offers={mockOffers.filter(offer => offer.type === 'buy' && (selectedCrypto === 'All' || offer.cryptoCurrency === selectedCrypto) && (selectedFiat === 'All' || offer.currency === selectedFiat))} tradeType="sell" />
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
        <ElizaOSChatbot 
          tradeType={tradeType}
          selectedCrypto={selectedCrypto}
          selectedFiat={selectedFiat}
        />
      </Card>
    </ElizaOSProvider>
  );
};

export default P2PMarketplace;
