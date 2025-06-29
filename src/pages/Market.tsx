
import React, { useState } from "react";
import WalletLayout from "@/components/layout/WalletLayout";
import { LineChart, BarChart3, TrendingUp, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Market = () => {
  const { t } = useLanguage();
  const [selectedCoin, setSelectedCoin] = useState("USDT");

  const marketDataMap = {
    USDT: [
      { name: "Jan", value: 1.00 },
      { name: "Feb", value: 0.99 },
      { name: "Mar", value: 1.01 },
      { name: "Apr", value: 1.00 },
      { name: "May", value: 0.99 },
      { name: "Jun", value: 0.98 },
      { name: "Jul", value: 1.00 },
      { name: "Aug", value: 1.01 },
      { name: "Sep", value: 1.00 },
      { name: "Oct", value: 1.00 },
      { name: "Nov", value: 0.99 },
      { name: "Dec", value: 1.00 },
    ],
    USDC: [
      { name: "Jan", value: 1.00 },
      { name: "Feb", value: 1.00 },
      { name: "Mar", value: 1.00 },
      { name: "Apr", value: 1.01 },
      { name: "May", value: 1.00 },
      { name: "Jun", value: 0.99 },
      { name: "Jul", value: 1.00 },
      { name: "Aug", value: 1.00 },
      { name: "Sep", value: 1.01 },
      { name: "Oct", value: 1.00 },
      { name: "Nov", value: 1.00 },
      { name: "Dec", value: 1.00 },
    ]
  };

  const stablecoinsData = [
    {
      name: "USDT",
      icon: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/usdt.svg",
      price: 1.00,
      change: -0.02,
      marketCap: "95.2B",
      supply: "95.2B",
    },
    {
      name: "USDC",
      icon: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/usdc.svg",
      price: 1.00,
      change: 0.01,
      marketCap: "25.4B",
      supply: "25.4B",
    }
  ];

  const currentChartData = marketDataMap[selectedCoin as keyof typeof marketDataMap] || marketDataMap.USDC;

  return (
    <WalletLayout>
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => history.back()}
          className="mr-2"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-bold">{t("market.title")}</h1>
      </div>

      <Tabs defaultValue="overview" className="w-full mb-6">
        <TabsList className="w-full bg-white/5 mb-4">
          <TabsTrigger value="overview" className="flex-1">{t("market.overview")}</TabsTrigger>
          <TabsTrigger value="charts" className="flex-1">{t("market.charts")}</TabsTrigger>
          <TabsTrigger value="news" className="flex-1">{t("market.news")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="glass-card p-4">
            <h3 className="font-medium mb-3 flex items-center">
              <LineChart size={16} className="mr-2" />
              {selectedCoin} {t("market.priceHistory")}
            </h3>
            
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={currentChartData}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#9b87f5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#8E9196', fontSize: 10 }}
                    tickLine={{ stroke: '#8E9196' }}
                    axisLine={{ stroke: '#8E9196', strokeOpacity: 0.2 }}
                  />
                  <YAxis 
                    domain={[0.985, 1.015]} 
                    tick={{ fill: '#8E9196', fontSize: 10 }}
                    tickLine={{ stroke: '#8E9196' }}
                    axisLine={{ stroke: '#8E9196', strokeOpacity: 0.2 }}
                    tickFormatter={(value) => `$${value.toFixed(3)}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(26, 31, 44, 0.9)', 
                      border: 'none',
                      borderRadius: '0.5rem',
                      color: 'white'
                    }}
                    formatter={(value: number) => [`$${value.toFixed(4)}`, 'Price']}
                  />
                  <Area 
                    type="monotone"
                    dataKey="value"
                    stroke="#9b87f5"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">{t("market.stablecoins")}</h3>
            
            <div className="glass-card divide-y divide-white/10">
              {stablecoinsData.map((coin, index) => (
                <div 
                  key={index} 
                  className={`flex items-center p-4 transition-all duration-200 hover:bg-white/10 cursor-pointer hover:scale-[1.01] ${selectedCoin === coin.name ? 'bg-white/10' : ''}`}
                  onClick={() => setSelectedCoin(coin.name)}
                >
                  <div className="w-8 h-8 rounded-full glass flex items-center justify-center mr-3">
                    <img src={coin.icon} alt={coin.name} className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-white">{coin.name}</h4>
                      <p className="font-medium text-white">${coin.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-gray-400">{t("market.marketCap")}: ${coin.marketCap}</p>
                      <p className={`text-xs ${coin.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {coin.change >= 0 ? '+' : ''}{coin.change.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="charts">
          <div className="glass-card p-6 text-center">
            <BarChart3 size={40} className="mx-auto mb-3 text-gray-400" />
            <h3 className="font-medium mb-2">{t("market.advancedCharts")}</h3>
            <p className="text-sm text-gray-400">{t("market.chartsComingSoon")}</p>
          </div>
        </TabsContent>
        
        <TabsContent value="news">
          <div className="glass-card p-6 text-center">
            <TrendingUp size={40} className="mx-auto mb-3 text-gray-400" />
            <h3 className="font-medium mb-2">{t("market.marketNews")}</h3>
            <p className="text-sm text-gray-400">{t("market.newsComingSoon")}</p>
          </div>
        </TabsContent>
      </Tabs>
    </WalletLayout>
  );
};

export default Market;
