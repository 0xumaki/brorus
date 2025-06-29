import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  MessageCircle, 
  X, 
  TrendingUp, 
  TrendingDown, 
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3,
  Zap,
  Target,
  Shield
} from "lucide-react";
import { useLanguage } from "@/contexts/language";
import { useElizaOS } from "./context/ElizaOSContext";
import { TradeType } from "./data/offerTypes";

interface ElizaOSAssistantProps {
  tradeType: TradeType;
  selectedCrypto: string;
  selectedFiat: string;
}

interface TradingInsight {
  id: string;
  type: 'tip' | 'warning' | 'opportunity';
  message: string;
  confidence: number;
  icon: React.ReactNode;
  timestamp: Date;
}

const ElizaOSAssistant: React.FC<ElizaOSAssistantProps> = ({
  tradeType,
  selectedCrypto,
  selectedFiat
}) => {
  const { t } = useLanguage();
  const { state, analyzeMarket, generateSignals } = useElizaOS();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [insights, setInsights] = useState<TradingInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentPrice, setCurrentPrice] = useState('$1.000');
  const [priceChange, setPriceChange] = useState(0.15);

  // Generate trading insights based on current context
  const generateInsights = () => {
    const newInsights: TradingInsight[] = [
      {
        id: '1',
        type: 'opportunity',
        message: `Good ${tradeType} opportunity for ${selectedCrypto}/${selectedFiat}. Current spread is favorable.`,
        confidence: 85,
        icon: <TrendingUp className="h-4 w-4 text-green-500" />,
        timestamp: new Date()
      },
      {
        id: '2',
        type: 'tip',
        message: 'Consider setting up limit orders for better price execution.',
        confidence: 78,
        icon: <Target className="h-4 w-4 text-blue-500" />,
        timestamp: new Date(Date.now() - 300000)
      },
      {
        id: '3',
        type: 'warning',
        message: 'High volatility detected. Use smaller trade sizes for safety.',
        confidence: 92,
        icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
        timestamp: new Date(Date.now() - 600000)
      }
    ];
    setInsights(newInsights);
  };

  // Simulate price updates
  useEffect(() => {
    const updatePrice = () => {
      const change = (Math.random() - 0.5) * 0.02;
      const newPrice = 1 + change;
      setCurrentPrice(`$${newPrice.toFixed(3)}`);
      setPriceChange(change * 100);
    };

    updatePrice();
    const interval = setInterval(updatePrice, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    generateInsights();
  }, [tradeType, selectedCrypto, selectedFiat]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    await analyzeMarket();
    await generateSignals();
    setIsAnalyzing(false);
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'border-green-500/30 bg-green-500/10';
      case 'warning': return 'border-yellow-500/30 bg-yellow-500/10';
      case 'tip': return 'border-blue-500/30 bg-blue-500/10';
      default: return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full w-12 h-12 p-0 shadow-lg"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className={`border-white/10 bg-black/20 backdrop-blur-sm transition-all duration-300 ${
        isExpanded ? 'h-96' : 'h-auto'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">ElizaOS Assistant</h3>
              <p className="text-xs text-gray-400">AI Trading Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
            >
              {isExpanded ? <X className="h-3 w-3" /> : <MessageCircle className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 space-y-3">
          {/* Current Market Status */}
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Current Price</span>
              <Badge variant="outline" className="text-xs">
                {selectedCrypto}/{selectedFiat}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-white">{currentPrice}</span>
              <div className={`flex items-center gap-1 text-xs ${
                priceChange >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {priceChange >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {Math.abs(priceChange).toFixed(2)}%
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              {isAnalyzing ? (
                <Clock className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <BarChart3 className="h-3 w-3 mr-1" />
              )}
              {isAnalyzing ? 'Analyzing...' : 'Analyze Market'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
            >
              <Sparkles className="h-3 w-3" />
            </Button>
          </div>

          {/* Trading Insights */}
          {isExpanded && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-medium text-white">Trading Insights</span>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {insights.map((insight) => (
                  <div
                    key={insight.id}
                    className={`p-2 rounded-lg border ${getInsightColor(insight.type)}`}
                  >
                    <div className="flex items-start gap-2">
                      {insight.icon}
                      <div className="flex-1">
                        <p className="text-xs text-white">{insight.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400">
                            {insight.timestamp.toLocaleTimeString()}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {insight.confidence}% confidence
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ElizaOS Status */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${
                state.isActive ? 'bg-green-500' : 'bg-gray-500'
              }`} />
              <span className="text-gray-400">
                {state.isActive ? 'ElizaOS Active' : 'ElizaOS Inactive'}
              </span>
            </div>
            {state.autoTrading && (
              <Badge variant="outline" className="text-xs border-green-500/50 text-green-400">
                <Zap className="h-3 w-3 mr-1" />
                Auto Trading
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ElizaOSAssistant; 