import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Bot, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  Zap, 
  Target, 
  CheckCircle,
  BarChart3,
  Settings,
  Play,
  Pause,
  RotateCcw,
  MessageCircle,
  Brain,
  Rocket
} from "lucide-react";
import { useElizaOS } from "./context/ElizaOSContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";

const ElizaOSDashboard: React.FC = () => {
  const { state, toggleAutoTrading, setRiskLevel, setMaxTradeAmount, analyzeMarket, generateSignals } = useElizaOS();
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [marketData, setMarketData] = useState<any>(null);
  const [signals, setSignals] = useState<any[]>([]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState<any>(null);
  const [executedSignals, setExecutedSignals] = useState<string[]>([]);

  useEffect(() => {
    // Initial load
    handleAnalyzeMarket();
    handleGenerateSignals();
  }, []);

  const handleAnalyzeMarket = async () => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeMarket();
      setMarketData(analysis);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateSignals = async () => {
    try {
      const newSignals = await generateSignals();
      setSignals(newSignals);
    } catch (error) {
      console.error('Error generating signals:', error);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish': return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'bearish': return <TrendingDown className="h-5 w-5 text-red-500" />;
      default: return <BarChart3 className="h-5 w-5 text-gray-500" />;
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
      {/* ElizaOS Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">ElizaOS</h1>
            <p className="text-gray-400">Your AI Trading Assistant</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
          <span className="text-purple-400 font-medium">Powered by Advanced AI</span>
          <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-white/10 bg-black/20 hover:bg-black/30 transition-colors cursor-pointer">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Market Analysis</h3>
              <p className="text-sm text-gray-400">AI-powered insights</p>
            </div>
          </div>
          <Button 
            onClick={handleAnalyzeMarket}
            disabled={isAnalyzing}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            {isAnalyzing ? (
              <>
                <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <BarChart3 className="h-4 w-4 mr-2" />
                Analyze Market
              </>
            )}
          </Button>
        </Card>

        <Card className="p-6 border-white/10 bg-black/20 hover:bg-black/30 transition-colors cursor-pointer">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Trading Signals</h3>
              <p className="text-sm text-gray-400">Smart opportunities</p>
            </div>
          </div>
          <Button 
            onClick={handleGenerateSignals}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <Target className="h-4 w-4 mr-2" />
            Generate Signals
          </Button>
        </Card>

        <Card className="p-6 border-white/10 bg-black/20 hover:bg-black/30 transition-colors cursor-pointer">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">AI Chat</h3>
              <p className="text-sm text-gray-400">Ask anything</p>
            </div>
          </div>
          <Button 
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Start Chat
          </Button>
        </Card>
      </div>

      {/* Auto Trading Control */}
      <Card className="p-6 border-white/10 bg-black/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Auto Trading</h2>
              <p className="text-gray-400">Let ElizaOS trade for you</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-400">Status</div>
              <div className={`font-semibold ${state.autoTrading ? 'text-green-400' : 'text-gray-400'}`}>
                {state.autoTrading ? 'Active' : 'Inactive'}
              </div>
            </div>
            <Button
              onClick={toggleAutoTrading}
              variant={state.autoTrading ? "default" : "outline"}
              className={state.autoTrading 
                ? "bg-green-600 hover:bg-green-700" 
                : "border-gray-600 text-gray-400 hover:bg-gray-600/20"
              }
            >
              {state.autoTrading ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </>
              )}
            </Button>
          </div>
        </div>

        {state.autoTrading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Risk Level</label>
              <select 
                value={state.riskLevel}
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
                value={state.maxTradeAmount}
                onChange={(e) => setMaxTradeAmount(Number(e.target.value))}
                className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white"
                placeholder="1000"
              />
            </div>
          </div>
        )}
      </Card>

      {/* Market Analysis Results */}
      {marketData && (
        <Card className="p-6 border-white/10 bg-black/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Market Analysis</h3>
              <p className="text-sm text-gray-400">Real-time insights</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Market Trend</span>
                <div className="flex items-center gap-2">
                  {getTrendIcon(marketData.trend)}
                  <span className={`font-semibold ${
                    marketData.trend === 'bullish' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {marketData.trend.charAt(0).toUpperCase() + marketData.trend.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Confidence</span>
                <div className="flex items-center gap-2">
                  <Progress value={marketData.confidence} className="w-20" />
                  <span className="text-white font-semibold">{marketData.confidence}%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">24h Change</span>
                <span className={`font-semibold ${
                  marketData.priceChange > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {marketData.priceChange > 0 ? '+' : ''}{marketData.priceChange.toFixed(2)}%
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Volume</span>
                <span className="text-white font-semibold">{marketData.volume}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Support</span>
                <span className="text-green-400 font-semibold">{marketData.support}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Resistance</span>
                <span className="text-red-400 font-semibold">{marketData.resistance}</span>
              </div>
              
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-sm text-gray-300">{marketData.recommendation}</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Trading Signals */}
      {signals.length > 0 && (
        <Card className="p-6 border-white/10 bg-black/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Trading Signals</h3>
              <p className="text-sm text-gray-400">AI-generated opportunities</p>
            </div>
          </div>

          <div className="space-y-4">
            {signals.map((signal) => (
              <div key={signal.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between mb-3">
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
                
                <p className="text-sm text-gray-300 mb-3">{signal.reason}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                  <span>{signal.crypto}/{signal.fiat}</span>
                  <span>{signal.timestamp.toLocaleTimeString()}</span>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className={`border-purple-500/50 text-purple-400 hover:bg-purple-500/20 ${executedSignals.includes(signal.id) ? 'opacity-60 pointer-events-none' : ''}`}
                    onClick={() => {
                      setExecutedSignals(prev => [...prev, signal.id]);
                      toast({
                        title: 'Trade Executed',
                        description: `Successfully executed ${signal.type.toUpperCase()} for ${signal.crypto}/${signal.fiat} at ${signal.price}.`,
                        variant: 'default'
                      });
                    }}
                    disabled={executedSignals.includes(signal.id)}
                  >
                    <Rocket className="h-3 w-3 mr-1" />
                    {executedSignals.includes(signal.id) ? 'Executed' : 'Execute'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-gray-500/50 text-gray-400 hover:bg-gray-500/20"
                    onClick={() => { setSelectedSignal(signal); setDetailsOpen(true); }}
                  >
                    Details
                  </Button>
                </div>
                {executedSignals.includes(signal.id) && (
                  <div className="mt-2 text-green-400 text-xs font-semibold flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Trade executed
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Signal Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Signal Details</DialogTitle>
            <DialogDescription>Full details of the selected trading signal.</DialogDescription>
          </DialogHeader>
          {selectedSignal && (
            <div className="space-y-3 mt-2">
              <div className="flex items-center gap-2">
                <Badge className={getSignalColor(selectedSignal.type)}>{selectedSignal.type.toUpperCase()}</Badge>
                <span className="font-semibold text-lg">{selectedSignal.price}</span>
              </div>
              <div className="text-gray-300">{selectedSignal.reason}</div>
              <div className="flex items-center gap-4 text-sm">
                <span>Confidence: <span className="text-white font-semibold">{selectedSignal.confidence}%</span></span>
                <span>Pair: <span className="text-white font-semibold">{selectedSignal.crypto}/{selectedSignal.fiat}</span></span>
                <span>Time: <span className="text-white font-semibold">{selectedSignal.timestamp.toLocaleTimeString()}</span></span>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="border-white/20 text-white">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ElizaOSDashboard; 