import React, { useState, useEffect } from "react";
import WalletLayout from "@/components/layout/WalletLayout";
import { LineChart, BarChart3, TrendingUp, ArrowLeft, PieChart, Activity, Globe, CheckCircle, Clock, Shield, Zap, Settings, Rocket, Handshake, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ComposedChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import { currencies } from "@/components/transfer/data/currencies";

const Market = () => {
  const { t } = useLanguage();
  const [selectedCoin, setSelectedCoin] = useState("USDT");
  const [chartType, setChartType] = useState("area");
  const [timeframe, setTimeframe] = useState("1M");
  const [marketDataMap, setMarketDataMap] = useState<any>({});
  const [currentPrices, setCurrentPrices] = useState<any>({});
  const [isLive, setIsLive] = useState(true);

  // Generate data based on timeframe
  const generateTimeframeData = (symbol: string, basePrice: number, timeframe: string) => {
    let dataPoints: any[] = [];
    let labels: string[] = [];

    switch (timeframe) {
      case "1D":
        // 24 hours in 1-hour intervals
        labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
        dataPoints = labels.map((hour, index) => {
          const volatility = symbol.includes("DT") || symbol.includes("DC") ? 0.001 : 0.005;
          const trend = Math.sin(index * 0.3) * 0.002;
          const random = (Math.random() - 0.5) * volatility;
          const price = basePrice * (1 + trend + random);
          
          return {
            name: hour,
            price: price,
            volume: Math.random() * 100000 + 50000,
            marketCap: price * (Math.random() * 100000000 + 50000000),
            change: ((price - basePrice) / basePrice) * 100,
            high: price * (1 + Math.random() * 0.01),
            low: price * (1 - Math.random() * 0.01),
            open: price * (1 + (Math.random() - 0.5) * 0.005),
            close: price,
          };
        });
        break;

      case "1W":
        // 7 days
        labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        dataPoints = labels.map((day, index) => {
          const volatility = symbol.includes("DT") || symbol.includes("DC") ? 0.003 : 0.01;
          const trend = Math.sin(index * 0.8) * 0.005;
          const random = (Math.random() - 0.5) * volatility;
          const price = basePrice * (1 + trend + random);
          
          return {
            name: day,
            price: price,
            volume: Math.random() * 500000 + 200000,
            marketCap: price * (Math.random() * 500000000 + 200000000),
            change: ((price - basePrice) / basePrice) * 100,
            high: price * (1 + Math.random() * 0.015),
            low: price * (1 - Math.random() * 0.015),
            open: price * (1 + (Math.random() - 0.5) * 0.008),
            close: price,
          };
        });
        break;

      case "1M":
        // 30 days
        labels = Array.from({ length: 30 }, (_, i) => `${i + 1}`);
        dataPoints = labels.map((day, index) => {
          const volatility = symbol.includes("DT") || symbol.includes("DC") ? 0.005 : 0.02;
          const trend = Math.sin(index * 0.2) * 0.01;
          const random = (Math.random() - 0.5) * volatility;
          const price = basePrice * (1 + trend + random);
          
          return {
            name: day,
            price: price,
            volume: Math.random() * 1000000 + 500000,
            marketCap: price * (Math.random() * 1000000000 + 500000000),
            change: ((price - basePrice) / basePrice) * 100,
            high: price * (1 + Math.random() * 0.02),
            low: price * (1 - Math.random() * 0.02),
            open: price * (1 + (Math.random() - 0.5) * 0.01),
            close: price,
          };
        });
        break;

      case "3M":
        // 12 weeks
        labels = Array.from({ length: 12 }, (_, i) => `W${i + 1}`);
        dataPoints = labels.map((week, index) => {
          const volatility = symbol.includes("DT") || symbol.includes("DC") ? 0.008 : 0.03;
          const trend = Math.sin(index * 0.5) * 0.015;
          const random = (Math.random() - 0.5) * volatility;
          const price = basePrice * (1 + trend + random);
          
          return {
            name: week,
            price: price,
            volume: Math.random() * 2000000 + 1000000,
            marketCap: price * (Math.random() * 2000000000 + 1000000000),
            change: ((price - basePrice) / basePrice) * 100,
            high: price * (1 + Math.random() * 0.025),
            low: price * (1 - Math.random() * 0.025),
            open: price * (1 + (Math.random() - 0.5) * 0.015),
            close: price,
          };
        });
        break;

      case "1Y":
        // 12 months
        labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        dataPoints = labels.map((month, index) => {
          const volatility = symbol.includes("DT") || symbol.includes("DC") ? 0.01 : 0.04;
          const trend = Math.sin(index * 0.5) * 0.02;
          const random = (Math.random() - 0.5) * volatility;
          const price = basePrice * (1 + trend + random);
          
          return {
            name: month,
            price: price,
            volume: Math.random() * 5000000 + 2000000,
            marketCap: price * (Math.random() * 5000000000 + 2000000000),
            change: ((price - basePrice) / basePrice) * 100,
            high: price * (1 + Math.random() * 0.03),
            low: price * (1 - Math.random() * 0.03),
            open: price * (1 + (Math.random() - 0.5) * 0.02),
            close: price,
          };
        });
        break;

      default:
        return [];
    }

    return dataPoints;
  };

  // Initialize market data
  useEffect(() => {
    const initialData: any = {};
    currencies.forEach(currency => {
      const symbol = currency.symbol;
      const basePrice = symbol === "USDT" || symbol === "USDC" ? 1.00 :
                       symbol === "CHF" ? 1.12 :
                       symbol === "AUD" ? 0.68 :
                       symbol === "EUR" ? 1.08 :
                       symbol === "CAD" ? 0.74 :
                       symbol === "SGD" ? 0.74 :
                       symbol === "HKD" ? 0.13 :
                       symbol === "INR" ? 0.012 :
                       symbol === "NZD" ? 0.62 :
                       symbol === "MRP" ? 0.022 :
                       symbol === "DEM" ? 0.55 :
                       symbol === "MX" ? 0.059 :
                       symbol === "ZAR" ? 0.055 :
                       symbol === "THB" ? 0.028 : 1.00;
      
      initialData[symbol] = generateTimeframeData(symbol, basePrice, timeframe);
    });
    setMarketDataMap(initialData);
    
    // Set initial current prices
    const initialPrices: any = {};
    currencies.forEach(currency => {
      const data = initialData[currency.symbol];
      if (data && data.length > 0) {
        const lastIndex = data.length - 1;
        initialPrices[currency.symbol] = {
          price: data[lastIndex]?.price || 1.00,
          change: data[lastIndex]?.change || 0,
          volume: data[lastIndex]?.volume || 0,
        };
      }
    });
    setCurrentPrices(initialPrices);
  }, [timeframe]);

  // Update prices every 2 seconds
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setMarketDataMap(prevData => {
        const newData = { ...prevData };
        const newPrices: any = { ...currentPrices };

        currencies.forEach(currency => {
          const symbol = currency.symbol;
          const basePrice = symbol === "USDT" || symbol === "USDC" ? 1.00 :
                           symbol === "CHF" ? 1.12 :
                           symbol === "AUD" ? 0.68 :
                           symbol === "EUR" ? 1.08 :
                           symbol === "CAD" ? 0.74 :
                           symbol === "SGD" ? 0.74 :
                           symbol === "HKD" ? 0.13 :
                           symbol === "INR" ? 0.012 :
                           symbol === "NZD" ? 0.62 :
                           symbol === "MRP" ? 0.022 :
                           symbol === "DEM" ? 0.55 :
                           symbol === "MX" ? 0.059 :
                           symbol === "ZAR" ? 0.055 :
                           symbol === "THB" ? 0.028 : 1.00;

          if (newData[symbol] && newData[symbol].length > 0) {
            // Update the last data point
            const lastIndex = newData[symbol].length - 1;
            const volatility = symbol.includes("DT") || symbol.includes("DC") ? 0.002 : 0.01;
            const priceChange = (Math.random() - 0.5) * volatility;
            const newPrice = newData[symbol][lastIndex].price * (1 + priceChange);
            
            newData[symbol][lastIndex] = {
              ...newData[symbol][lastIndex],
              price: newPrice,
              change: ((newPrice - basePrice) / basePrice) * 100,
              volume: Math.random() * 1000000 + 500000,
              high: Math.max(newData[symbol][lastIndex].high, newPrice),
              low: Math.min(newData[symbol][lastIndex].low, newPrice),
              close: newPrice,
            };

            // Update current prices
            newPrices[symbol] = {
              price: newPrice,
              change: ((newPrice - basePrice) / basePrice) * 100,
              volume: newData[symbol][lastIndex].volume,
            };
          }
        });

        setCurrentPrices(newPrices);
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isLive, currentPrices, timeframe]);

  const currentChartData = marketDataMap[selectedCoin] || [];

  const renderChart = () => {
    if (!currentChartData.length) return null;

    switch (chartType) {
      case "area":
        return (
          <AreaChart data={currentChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#9b87f5" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
            <XAxis dataKey="name" tick={{ fill: '#8E9196', fontSize: 12 }} />
            <YAxis 
              tick={{ fill: '#8E9196', fontSize: 12 }}
              domain={['dataMin - 0.001', 'dataMax + 0.001']}
              tickFormatter={(value) => `$${value.toFixed(4)}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(26, 31, 44, 0.95)', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: 'white'
              }}
              formatter={(value: number) => [`$${value.toFixed(4)}`, 'Price']}
            />
            <Area type="monotone" dataKey="price" stroke="#9b87f5" fill="url(#colorPrice)" strokeWidth={2} />
          </AreaChart>
        );
      
      case "line":
        return (
          <RechartsLineChart data={currentChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
            <XAxis dataKey="name" tick={{ fill: '#8E9196', fontSize: 12 }} />
            <YAxis 
              tick={{ fill: '#8E9196', fontSize: 12 }}
              domain={['dataMin - 0.001', 'dataMax + 0.001']}
              tickFormatter={(value) => `$${value.toFixed(4)}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(26, 31, 44, 0.95)', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: 'white'
              }}
              formatter={(value: number) => [`$${value.toFixed(4)}`, 'Price']}
            />
            <Line type="monotone" dataKey="price" stroke="#9b87f5" strokeWidth={3} dot={{ fill: '#9b87f5', strokeWidth: 2, r: 4 }} />
          </RechartsLineChart>
        );
      
      case "candlestick":
        // Calculate price range for scaling
        const maxPrice = Math.max(...currentChartData.map((d: any) => d.high));
        const minPrice = Math.min(...currentChartData.map((d: any) => d.low));
        const priceRange = maxPrice - minPrice;
        
        return (
          <div style={{ width: '100%', height: '100%' }}>
            <svg width="100%" height="100%" viewBox={`0 0 ${currentChartData.length * 40} 300`}>
              <defs>
                <linearGradient id="greenCandle" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="redCandle" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              
              {/* Grid lines */}
              {Array.from({ length: 6 }, (_, i) => (
                <line
                  key={`grid-${i}`}
                  x1="0"
                  y1={i * 50}
                  x2={currentChartData.length * 40}
                  y2={i * 50}
                  stroke="#374151"
                  strokeWidth="1"
                  opacity={0.2}
                />
              ))}
              
              {/* Candlesticks */}
              {currentChartData.map((entry: any, index: number) => {
                const x = index * 40 + 20;
                const isGreen = entry.close >= entry.open;
                const open = entry.open;
                const close = entry.close;
                const high = entry.high;
                const low = entry.low;
                
                // Calculate Y positions (invert Y axis for price chart)
                const yHigh = 50 + ((maxPrice - high) / priceRange) * 200;
                const yLow = 50 + ((maxPrice - low) / priceRange) * 200;
                const yOpen = 50 + ((maxPrice - open) / priceRange) * 200;
                const yClose = 50 + ((maxPrice - close) / priceRange) * 200;
                
                const bodyHeight = Math.abs(yClose - yOpen);
                const bodyY = Math.min(yOpen, yClose);
                
                return (
                  <g key={index}>
                    {/* Wick (high to low line) */}
                    <line
                      x1={x}
                      y1={yHigh}
                      x2={x}
                      y2={yLow}
                      stroke="#8E9196"
                      strokeWidth="2"
                    />
                    
                    {/* Body */}
                    <rect
                      x={x - 8}
                      y={bodyY}
                      width="16"
                      height={Math.max(bodyHeight, 2)}
                      fill={isGreen ? "url(#greenCandle)" : "url(#redCandle)"}
                      stroke={isGreen ? "#16a34a" : "#dc2626"}
                      strokeWidth="1"
                    />
                  </g>
                );
              })}
              
              {/* Price labels */}
              {Array.from({ length: 6 }, (_, i) => {
                const price = maxPrice - (i * priceRange / 5);
                return (
                  <text
                    key={`label-${i}`}
                    x="5"
                    y={50 + i * 40}
                    fill="#8E9196"
                    fontSize="10"
                    textAnchor="start"
                  >
                    ${price.toFixed(4)}
                  </text>
                );
              })}
            </svg>
          </div>
        );
      
      case "volume":
        return (
          <BarChart data={currentChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
            <XAxis dataKey="name" tick={{ fill: '#8E9196', fontSize: 12 }} />
            <YAxis tick={{ fill: '#8E9196', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(26, 31, 44, 0.95)', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: 'white'
              }}
              formatter={(value: number) => [`$${(value / 1000000).toFixed(1)}M`, 'Volume']}
            />
            <Bar dataKey="volume" fill="#9b87f5" opacity={0.8} />
          </BarChart>
        );
      
      default:
        return null;
    }
  };

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
                    domain={['dataMin - 0.001', 'dataMax + 0.001']}
                    tick={{ fill: '#8E9196', fontSize: 10 }}
                    tickLine={{ stroke: '#8E9196' }}
                    axisLine={{ stroke: '#8E9196', strokeOpacity: 0.2 }}
                    tickFormatter={(value) => `$${value.toFixed(4)}`}
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
                    dataKey="price"
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
              {currencies.map((coin, index) => (
                <div 
                  key={index} 
                  className={`flex items-center p-4 transition-all duration-200 hover:bg-white/10 cursor-pointer hover:scale-[1.01] ${selectedCoin === coin.symbol ? 'bg-white/10' : ''}`}
                  onClick={() => setSelectedCoin(coin.symbol)}
                >
                  <div className="w-8 h-8 rounded-full glass flex items-center justify-center mr-3">
                    <img src={coin.iconUrl} alt={coin.symbol} className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-white">{coin.symbol}</h4>
                      <p className="font-medium text-white">
                        ${(currentPrices[coin.symbol]?.price || 1.00).toFixed(4)}
                      </p>
                    </div>
                    
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-gray-400">{coin.name}</p>
                      <p className={`text-xs ${(currentPrices[coin.symbol]?.change || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {(currentPrices[coin.symbol]?.change || 0) >= 0 ? '+' : ''}{(currentPrices[coin.symbol]?.change || 0).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="charts" className="space-y-6">
          {/* Chart Controls */}
          <div className="glass-card p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <Select value={selectedCoin} onValueChange={setSelectedCoin}>
                  <SelectTrigger className="w-32 bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/10">
                    {currencies.map(currency => (
                      <SelectItem key={currency.symbol} value={currency.symbol}>
                        {currency.symbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={chartType} onValueChange={setChartType}>
                  <SelectTrigger className="w-32 bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/10">
                    <SelectItem value="area">Area Chart</SelectItem>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="candlestick">Candlestick</SelectItem>
                    <SelectItem value="volume">Volume</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="w-24 bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/10">
                    <SelectItem value="1D">1D</SelectItem>
                    <SelectItem value="1W">1W</SelectItem>
                    <SelectItem value="1M">1M</SelectItem>
                    <SelectItem value="3M">3M</SelectItem>
                    <SelectItem value="1Y">1Y</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Activity className={`h-4 w-4 ${isLive ? 'text-green-400 animate-pulse' : 'text-gray-400'}`} />
                <span className={isLive ? 'text-green-400' : 'text-gray-400'}>
                  {isLive ? 'Live Data' : 'Paused'}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLive(!isLive)}
                  className="ml-2"
                >
                  {isLive ? 'Pause' : 'Resume'}
                </Button>
              </div>
            </div>
          </div>

          {/* Main Chart */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-lg">{selectedCoin} Price Chart ({timeframe})</h3>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-400">Current Price:</span>
                <span className="font-medium text-white">
                  ${(currentPrices[selectedCoin]?.price || 1.00).toFixed(4)}
                </span>
                <span className={`${(currentPrices[selectedCoin]?.change || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {(currentPrices[selectedCoin]?.change || 0) >= 0 ? '+' : ''}{(currentPrices[selectedCoin]?.change || 0).toFixed(2)}%
                </span>
              </div>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Market Statistics */}
          <div className="glass-card p-6">
            <h3 className="font-medium mb-4">Market Statistics ({timeframe})</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currencies.slice(0, 8).map((currency, index) => {
                const currentData = currentPrices[currency.symbol];
                return (
                  <div key={index} className="text-center p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <img src={currency.iconUrl} alt={currency.symbol} className="w-6 h-6 mr-2" />
                      <span className="font-medium">{currency.symbol}</span>
                    </div>
                    <p className="text-lg font-bold">${(currentData?.price || 1.00).toFixed(4)}</p>
                    <p className={`text-sm ${(currentData?.change || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {(currentData?.change || 0) >= 0 ? '+' : ''}{(currentData?.change || 0).toFixed(2)}%
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Vol: ${((currentData?.volume || 0) / 1000000).toFixed(1)}M
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="news" className="space-y-8">
          {/* Enhanced News Header */}
          <div className="glass-card p-8 bg-gradient-to-r from-wallet-emerald/10 to-wallet-emerald/5 border border-wallet-emerald/30">
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-r from-wallet-emerald to-wallet-emerald/80 rounded-2xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
                <div className="text-left">
                  <h2 className="text-3xl font-bold text-wallet-emerald tracking-tight text-left">Financial News</h2>
                  <p className="text-lg text-gray-300 font-medium text-left">Latest insights on stablecoins, CBDCs & global markets</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-wallet-emerald/10 px-4 py-3 rounded-xl border border-wallet-emerald/20 w-max">
                <div className="w-3 h-3 bg-wallet-emerald rounded-full animate-pulse"></div>
                <span className="text-wallet-emerald font-semibold text-sm">LIVE UPDATES</span>
                <Activity className="h-5 w-5 text-wallet-emerald animate-pulse" />
              </div>
            </div>
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-wallet-emerald/10 rounded-xl border border-wallet-emerald/20">
                <div className="text-2xl font-bold text-wallet-emerald mb-1">24/7</div>
                <div className="text-sm text-gray-300 font-medium">News Coverage</div>
              </div>
              <div className="text-center p-4 bg-wallet-emerald/10 rounded-xl border border-wallet-emerald/20">
                <div className="text-2xl font-bold text-wallet-emerald mb-1">150+</div>
                <div className="text-sm text-gray-300 font-medium">Sources</div>
              </div>
              <div className="text-center p-4 bg-wallet-emerald/10 rounded-xl border border-wallet-emerald/20">
                <div className="text-2xl font-bold text-wallet-emerald mb-1">3</div>
                <div className="text-sm text-gray-300 font-medium">Categories</div>
              </div>
              <div className="text-center p-4 bg-wallet-emerald/10 rounded-xl border border-wallet-emerald/20">
                <div className="text-2xl font-bold text-wallet-emerald mb-1">5min</div>
                <div className="text-sm text-gray-300 font-medium">Update Cycle</div>
              </div>
            </div>
          </div>

          {/* Real 2025 News Cards - Single Column */}
          <div className="space-y-4">
            {/* 1. Stablecoins Go Mainstream */}
            <article
              className="group relative overflow-hidden bg-gradient-to-r from-white/10 to-white/5 rounded-2xl border border-white/20 hover:border-green-400/40 transition-all duration-300 cursor-pointer hover:scale-[1.01] hover:shadow-xl hover:shadow-green-500/10"
              onClick={() => window.open('https://www.cnbc.com/2025/06/28/stablecoin-visa-mastercard-circle-jpmorgan.html', '_blank')}
            >
              <div className="relative p-6 flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-green-400 bg-green-400/15 rounded-full border border-green-400/30">Stablecoins</span>
                  <span className="text-xs text-gray-400 font-medium">June 28, 2025</span>
                </div>
                <h4 className="text-lg font-bold text-white leading-tight group-hover:text-green-400 transition-colors">
                  Stablecoins Go Mainstream: Why Banks and Credit Card Firms Are Issuing Their Own Crypto Tokens
                </h4>
                <span className="text-xs text-gray-400">Source: CNBC</span>
              </div>
            </article>

            {/* 2. ECB Announces Plan to Launch CBDC */}
            <article
              className="group relative overflow-hidden bg-gradient-to-r from-white/10 to-white/5 rounded-2xl border border-white/20 hover:border-blue-400/40 transition-all duration-300 cursor-pointer hover:scale-[1.01] hover:shadow-xl hover:shadow-blue-500/10"
              onClick={() => window.open('https://blockchain.news/flashnews/european-central-bank-announces-plan-to-launch-cbdc-by-october-2025', '_blank')}
            >
              <div className="relative p-6 flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-blue-400 bg-blue-400/15 rounded-full border border-blue-400/30">CBDC</span>
                  <span className="text-xs text-gray-400 font-medium">March 8, 2025</span>
                </div>
                <h4 className="text-lg font-bold text-white leading-tight group-hover:text-blue-400 transition-colors">
                  European Central Bank Announces Plan to Launch CBDC by October 2025
                </h4>
                <span className="text-xs text-gray-400">Source: Blockchain.News</span>
              </div>
            </article>

            {/* 3. New Stablecoin from Transactix */}
            <article
              className="group relative overflow-hidden bg-gradient-to-r from-white/10 to-white/5 rounded-2xl border border-white/20 hover:border-cyan-400/40 transition-all duration-300 cursor-pointer hover:scale-[1.01] hover:shadow-xl hover:shadow-cyan-500/10"
              onClick={() => window.open('https://www.globenewswire.com/news-release/2025/05/14/3081283/0/en/New-Stablecoin-from-Transactix-Reshaping-Canadian-Cryptocurrency-Landscape.html', '_blank')}
            >
              <div className="relative p-6 flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-cyan-400 bg-cyan-400/15 rounded-full border border-cyan-400/30">Stablecoins</span>
                  <span className="text-xs text-gray-400 font-medium">May 14, 2025</span>
                </div>
                <h4 className="text-lg font-bold text-white leading-tight group-hover:text-cyan-400 transition-colors">
                  New Stablecoin from Transactix Reshaping Canadian Cryptocurrency Landscape
                </h4>
                <span className="text-xs text-gray-400">Source: GlobeNewswire</span>
              </div>
            </article>

            {/* 4. Markets Shrug Off Israel-Iran Conflict */}
            <article
              className="group relative overflow-hidden bg-gradient-to-r from-white/10 to-white/5 rounded-2xl border border-white/20 hover:border-red-400/40 transition-all duration-300 cursor-pointer hover:scale-[1.01] hover:shadow-xl hover:shadow-red-500/10"
              onClick={() => window.open('https://www.cnbc.com/2025/06/16/markets-could-be-underpricing-risks-of-israel-iran-conflict.html', '_blank')}
            >
              <div className="relative p-6 flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-red-400 bg-red-400/15 rounded-full border border-red-400/30">Global Markets</span>
                  <span className="text-xs text-gray-400 font-medium">June 16, 2025</span>
                </div>
                <h4 className="text-lg font-bold text-white leading-tight group-hover:text-red-400 transition-colors">
                  Markets Are Shrugging Off the Israel-Iran Conflict. Some Strategists Warn of Complacency
                </h4>
                <span className="text-xs text-gray-400">Source: CNBC</span>
              </div>
            </article>

            {/* 5. Fed Chair Powell Says AI Is Coming for Your Job */}
            <article
              className="group relative overflow-hidden bg-gradient-to-r from-white/10 to-white/5 rounded-2xl border border-white/20 hover:border-purple-400/40 transition-all duration-300 cursor-pointer hover:scale-[1.01] hover:shadow-xl hover:shadow-purple-500/10"
              onClick={() => window.open('https://ground.news/article/fed-chair-sees-ai-creating-significant-changes-to-us-workforce', '_blank')}
            >
              <div className="relative p-6 flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-purple-400 bg-purple-400/15 rounded-full border border-purple-400/30">AI & Finance</span>
                  <span className="text-xs text-gray-400 font-medium">June 29, 2025</span>
                </div>
                <h4 className="text-lg font-bold text-white leading-tight group-hover:text-purple-400 transition-colors">
                  Fed Chair Powell Says AI Is Coming for Your Job
                </h4>
                <span className="text-xs text-gray-400">Source: Ground News / The Register</span>
              </div>
            </article>

            {/* 6. Fannie Mae, Freddie Mac Could Consider Crypto in Mortgage Reviews */}
            <article
              className="group relative overflow-hidden bg-gradient-to-r from-white/10 to-white/5 rounded-2xl border border-white/20 hover:border-orange-400/40 transition-all duration-300 cursor-pointer hover:scale-[1.01] hover:shadow-xl hover:shadow-orange-500/10"
              onClick={() => window.open('https://finance-commerce.com/2025/06/fannie-freddie-crypto-mortgage-policy-change/', '_blank')}
            >
              <div className="relative p-6 flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-orange-400 bg-orange-400/15 rounded-full border border-orange-400/30">Crypto Regulation</span>
                  <span className="text-xs text-gray-400 font-medium">June 26, 2025</span>
                </div>
                <h4 className="text-lg font-bold text-white leading-tight group-hover:text-orange-400 transition-colors">
                  Fannie Mae, Freddie Mac Could Consider Crypto in Mortgage Reviews
                </h4>
                <span className="text-xs text-gray-400">Source: Finance & Commerce (AP)</span>
              </div>
            </article>

            {/* 7. Digital Finance Academy Empowering the Future of Finance in 2025 */}
            <article
              className="group relative overflow-hidden bg-gradient-to-r from-white/10 to-white/5 rounded-2xl border border-white/20 hover:border-blue-400/40 transition-all duration-300 cursor-pointer hover:scale-[1.01] hover:shadow-xl hover:shadow-blue-500/10"
              onClick={() => window.open('https://markets.financialcontent.com/stocks/article/binary-2025-2-28-digital-finance-academy-empowering-the-future-of-finance-in-2025', '_blank')}
            >
              <div className="relative p-6 flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-blue-400 bg-blue-400/15 rounded-full border border-blue-400/30">Fintech</span>
                  <span className="text-xs text-gray-400 font-medium">Feb 28, 2025</span>
                </div>
                <h4 className="text-lg font-bold text-white leading-tight group-hover:text-blue-400 transition-colors">
                  Digital Finance Academy Empowering the Future of Finance in 2025
                </h4>
                <span className="text-xs text-gray-400">Source: FinancialContent</span>
              </div>
            </article>
          </div>

          {/* Enhanced Featured Analysis */}
          <div className="glass-card p-8 bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Featured Analysis</h3>
                <p className="text-gray-300 font-medium">In-depth reports and market insights</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-8 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-3xl border border-purple-500/40 hover:border-purple-500/60 transition-all duration-300 cursor-pointer group hover:scale-[1.02]">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">The Future of Digital Payments</h4>
                    <p className="text-gray-300 font-medium">Comprehensive analysis of stablecoin and CBDC adoption trends</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                  As digital payments continue to evolve, the intersection of stablecoins and CBDCs is creating new opportunities for financial innovation. Our analysis explores the key trends shaping the future of money and their implications for global commerce.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-purple-400 font-bold bg-purple-400/15 px-3 py-1.5 rounded-full border border-purple-400/30">📊 Market Analysis</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-300 font-medium">15 min read</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-300 font-medium">Premium</span>
                </div>
              </div>

              <div className="p-8 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-3xl border border-green-500/40 hover:border-green-500/60 transition-all duration-300 cursor-pointer group hover:scale-[1.02]">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">Regulatory Landscape 2024</h4>
                    <p className="text-gray-300 font-medium">Global regulatory developments in digital assets</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                  Regulatory frameworks around the world are rapidly evolving to accommodate digital assets. This report examines key regulatory developments and their impact on market participants, providing actionable insights for compliance and strategy.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-green-400 font-bold bg-green-400/15 px-3 py-1.5 rounded-full border border-green-400/30">📋 Regulation</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-300 font-medium">12 min read</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-300 font-medium">Premium</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Market Sentiment */}
          <div className="glass-card p-8 bg-gradient-to-r from-gray-600/10 to-gray-800/10 border border-gray-500/20">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center shadow-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Market Sentiment</h3>
                <p className="text-gray-300 font-medium">Real-time sentiment analysis across asset classes</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-2xl border border-green-500/30 hover:border-green-500/50 transition-all duration-300 cursor-pointer group hover:scale-105">
                <div className="text-3xl font-bold text-green-400 mb-2 group-hover:scale-110 transition-transform">Bullish</div>
                <div className="text-lg text-gray-300 font-semibold mb-2">Stablecoins</div>
                <div className="text-sm text-green-400 font-bold bg-green-400/15 px-3 py-1 rounded-full border border-green-400/30">+2.3%</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-2xl border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 cursor-pointer group hover:scale-105">
                <div className="text-3xl font-bold text-blue-400 mb-2 group-hover:scale-110 transition-transform">Neutral</div>
                <div className="text-lg text-gray-300 font-semibold mb-2">CBDCs</div>
                <div className="text-sm text-blue-400 font-bold bg-blue-400/15 px-3 py-1 rounded-full border border-blue-400/30">+0.8%</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-2xl border border-yellow-500/30 hover:border-yellow-500/50 transition-all duration-300 cursor-pointer group hover:scale-105">
                <div className="text-3xl font-bold text-yellow-400 mb-2 group-hover:scale-110 transition-transform">Mixed</div>
                <div className="text-lg text-gray-300 font-semibold mb-2">Global Markets</div>
                <div className="text-sm text-yellow-400 font-bold bg-yellow-400/15 px-3 py-1 rounded-full border border-yellow-400/30">-0.5%</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group hover:scale-105">
                <div className="text-3xl font-bold text-purple-400 mb-2 group-hover:scale-110 transition-transform">Positive</div>
                <div className="text-lg text-gray-300 font-semibold mb-2">Crypto</div>
                <div className="text-sm text-purple-400 font-bold bg-purple-400/15 px-3 py-1 rounded-full border border-purple-400/30">+1.2%</div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </WalletLayout>
  );
};

export default Market;
