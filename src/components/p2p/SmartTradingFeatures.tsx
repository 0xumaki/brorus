import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  Zap, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3,
  Settings,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";
import { useLanguage } from "@/contexts/language";

interface TradingSignal {
  id: string;
  type: 'buy' | 'sell' | 'hold';
  confidence: number;
  price: string;
  reason: string;
  timestamp: Date;
  crypto: string;
  fiat: string;
}

interface MarketAnalysis {
  trend: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  priceChange: number;
  volume: string;
  support: string;
  resistance: string;
  recommendation: string;
}

const SmartTradingFeatures: React.FC = () => {
  const { t } = useLanguage();
  const [autoTrading, setAutoTrading] = useState(false);
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [maxTradeAmount, setMaxTradeAmount] = useState(1000);
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [marketAnalysis, setMarketAnalysis] = useState<MarketAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [marketTrend, setMarketTrend] = useState<'bullish' | 'bearish'>('bullish');
  const [confidence, setConfidence] = useState(85);

  // Simulate market analysis
  const analyzeMarket = async () => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const analysis: MarketAnalysis = {
      trend: Math.random() > 0.5 ? 'bullish' : 'bearish',
      confidence: Math.floor(Math.random() * 30) + 70,
      priceChange: (Math.random() - 0.5) * 10,
      volume: '$2.5M',
      support: '$0.985',
      resistance: '$1.015',
      recommendation: Math.random() > 0.5 ? 'Consider buying on dips' : 'Wait for better entry point'
    };
    
    setMarketAnalysis(analysis);
    setIsAnalyzing(false);
  };

  // Generate trading signals
  const generateSignals = () => {
    const newSignals: TradingSignal[] = [
      {
        id: '1',
        type: 'buy',
        confidence: 85,
        price: '$0.998',
        reason: 'Strong support level reached, RSI oversold',
        timestamp: new Date(),
        crypto: 'USDT',
        fiat: 'MMK'
      },
      {
        id: '2',
        type: 'sell',
        confidence: 72,
        price: '$1.002',
        reason: 'Resistance level approaching, take profits',
        timestamp: new Date(Date.now() - 300000),
        crypto: 'USDT',
        fiat: 'MMK'
      },
      {
        id: '3',
        type: 'hold',
        confidence: 68,
        price: '$1.000',
        reason: 'Market consolidation, wait for breakout',
        timestamp: new Date(Date.now() - 600000),
        crypto: 'USDT',
        fiat: 'MMK'
      }
    ];
    setSignals(newSignals);
  };

  useEffect(() => {
    generateSignals();
    analyzeMarket();
    // Simulate market data updates
    const interval = setInterval(() => {
      setConfidence(Math.floor(Math.random() * 20) + 75);
      setMarketTrend(Math.random() > 0.5 ? 'bullish' : 'bearish');
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'bearish': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <BarChart3 className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSignalColor = (type: string) => {
    switch (type) {
      case 'buy': return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'sell': return 'bg-red-500/20 text-red-600 border-red-500/30';
      default: return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Auto Trading Control */}
      <Card className="p-6 border-white/10 bg-black/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">ElizaOS Auto Trading</h3>
              <p className="text-sm text-gray-400">AI-powered autonomous trading</p>
            </div>
          </div>
          <Switch
            checked={autoTrading}
            onCheckedChange={setAutoTrading}
            className="data-[state=checked]:bg-purple-600"
          />
        </div>
        
        {autoTrading && (
          <div className="space-y-4 p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Risk Level</label>
                <select 
                  value={riskLevel}
                  onChange={(e) => setRiskLevel(e.target.value as 'low' | 'medium' | 'high')}
                  className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white"
                >
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Max Trade Amount</label>
                <input
                  type="number"
                  value={maxTradeAmount}
                  onChange={(e) => setMaxTradeAmount(Number(e.target.value))}
                  className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white"
                  placeholder="1000"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Advanced
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-green-400">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-500" />
                <span className="text-blue-400">Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-500" />
                <span className="text-purple-400">Optimized</span>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Market Analysis */}
      <Card className="p-6 border-white/10 bg-black/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Market Analysis</h3>
              <p className="text-sm text-gray-400">Real-time market insights</p>
            </div>
          </div>
          <Button 
            onClick={analyzeMarket}
            disabled={isAnalyzing}
            variant="outline"
            size="sm"
            className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
          >
            {isAnalyzing ? (
              <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <BarChart3 className="h-4 w-4 mr-2" />
            )}
            {isAnalyzing ? 'Analyzing...' : 'Refresh'}
          </Button>
        </div>

        {marketAnalysis && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Market Trend</span>
                <div className="flex items-center gap-2">
                  {getTrendIcon(marketAnalysis.trend)}
                  <span className={`font-semibold ${
                    marketAnalysis.trend === 'bullish' ? 'text-green-400' : 
                    marketAnalysis.trend === 'bearish' ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {marketAnalysis.trend.charAt(0).toUpperCase() + marketAnalysis.trend.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Confidence</span>
                <div className="flex items-center gap-2">
                  <Progress value={marketAnalysis.confidence} className="w-20" />
                  <span className="text-white font-semibold">{marketAnalysis.confidence}%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">24h Change</span>
                <span className={`font-semibold ${
                  marketAnalysis.priceChange > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {marketAnalysis.priceChange > 0 ? '+' : ''}{marketAnalysis.priceChange.toFixed(2)}%
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Volume</span>
                <span className="text-white font-semibold">{marketAnalysis.volume}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Support</span>
                <span className="text-green-400 font-semibold">{marketAnalysis.support}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Resistance</span>
                <span className="text-red-400 font-semibold">{marketAnalysis.resistance}</span>
              </div>
              
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-sm text-gray-300">{marketAnalysis.recommendation}</p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Trading Signals */}
      <Card className="p-6 border-white/10 bg-black/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Trading Signals</h3>
              <p className="text-sm text-gray-400">AI-generated trading opportunities</p>
            </div>
          </div>
          <Badge variant="outline" className="border-green-500/50 text-green-400">
            {signals.length} Active
          </Badge>
        </div>

        <div className="space-y-3">
          {signals.map((signal) => (
            <div key={signal.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Badge className={getSignalColor(signal.type)}>
                    {signal.type.toUpperCase()}
                  </Badge>
                  <span className="text-white font-semibold">{signal.price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">{signal.confidence}%</span>
                  <Progress value={signal.confidence} className="w-16" />
                </div>
              </div>
              
              <p className="text-sm text-gray-300 mb-2">{signal.reason}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{signal.crypto}/{signal.fiat}</span>
                <span>{signal.timestamp.toLocaleTimeString()}</span>
              </div>
              
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20">
                  Execute
                </Button>
                <Button size="sm" variant="outline" className="border-gray-500/50 text-gray-400 hover:bg-gray-500/20">
                  Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SmartTradingFeatures; 