import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  X,
  Minimize2,
  Maximize2,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  TrendingDown
} from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  tradeData?: {
    type: 'buy' | 'sell';
    amount: number;
    price: number;
    total: number;
    status: 'pending' | 'executed' | 'failed';
    trader: string;
    paymentMethod: string;
  };
}

interface ElizaOSTradingProps {
  tradeType: 'buy' | 'sell';
  selectedCrypto: string;
  selectedFiat: string;
}

const ElizaOSTrading: React.FC<ElizaOSTradingProps> = ({
  tradeType,
  selectedCrypto,
  selectedFiat
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: `🚀 Hello! I'm ElizaOS, your AI trading assistant. I can execute ${tradeType} trades for ${selectedCrypto} with ${selectedFiat}. What would you like to do?`,
      timestamp: new Date(),
      suggestions: [
        `Execute ${tradeType} trade`,
        `Find best offers`,
        `Check market prices`,
        `Get trading tips`
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  
  const availableOffers = [
    {
      id: 1,
      trader: "Premium Trader",
      rating: 4.9,
      fee: 0.2,
      price: 0.998,
      minAmount: 50,
      maxAmount: 5000,
      paymentMethods: ["Bank Transfer", "Mobile Money"],
      completionRate: 98
    },
    {
      id: 2,
      trader: "QuickTrade Pro",
      rating: 4.8,
      fee: 0.3,
      price: 0.999,
      minAmount: 25,
      maxAmount: 3000,
      paymentMethods: ["Bank Transfer", "Cash"],
      completionRate: 95
    },
    {
      id: 3,
      trader: "SafeSwap",
      rating: 4.9,
      fee: 0.25,
      price: 1.001,
      minAmount: 100,
      maxAmount: 10000,
      paymentMethods: ["Bank Transfer", "Mobile Money", "Cash"],
      completionRate: 99
    }
  ];

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const generateResponse = async (userMessage: string): Promise<Message> => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    const lowerMessage = userMessage.toLowerCase();
    let response = '';
    let suggestions: string[] = [];
    let tradeData = undefined;

    if (lowerMessage.includes('execute') || lowerMessage.includes('trade') || lowerMessage.includes('buy') || lowerMessage.includes('sell')) {
      // Simulate trade execution
      const bestOffer = availableOffers[0];
      const amount = Math.floor(Math.random() * 500) + 100;
      const total = amount * bestOffer.price;
      
      tradeData = {
        type: tradeType,
        amount: amount,
        price: bestOffer.price,
        total: total,
        status: 'pending',
        trader: bestOffer.trader,
        paymentMethod: bestOffer.paymentMethods[0]
      };

      response = `🚀 **Trade Execution Initiated!**\n\n` +
        `**Trader:** ${bestOffer.trader} (${bestOffer.rating}★)\n` +
        `**Action:** ${tradeType.toUpperCase()} ${selectedCrypto}\n` +
        `**Amount:** ${amount} ${selectedCrypto}\n` +
        `**Price:** $${bestOffer.price.toFixed(3)} per ${selectedCrypto}\n` +
        `**Total:** $${total.toFixed(2)} ${selectedFiat}\n` +
        `**Fee:** ${bestOffer.fee}%\n` +
        `**Payment:** ${bestOffer.paymentMethods[0]}\n\n` +
        `Processing your trade... ⏳`;

      suggestions = ['Confirm Trade', 'Cancel Trade', 'View Trade Details'];
    } else if (lowerMessage.includes('confirm') || lowerMessage.includes('yes')) {
      // Simulate trade confirmation
      const amount = Math.floor(Math.random() * 500) + 100;
      const price = availableOffers[0].price;
      const total = amount * price;
      
      tradeData = {
        type: tradeType,
        amount: amount,
        price: price,
        total: total,
        status: 'executed',
        trader: availableOffers[0].trader,
        paymentMethod: availableOffers[0].paymentMethods[0]
      };

      response = `✅ **Trade Executed Successfully!**\n\n` +
        `**Transaction ID:** TX${Date.now().toString().slice(-8)}\n` +
        `**Trader:** ${availableOffers[0].trader}\n` +
        `**Action:** ${tradeType.toUpperCase()} ${selectedCrypto}\n` +
        `**Amount:** ${amount} ${selectedCrypto}\n` +
        `**Price:** $${price.toFixed(3)}\n` +
        `**Total:** $${total.toFixed(2)} ${selectedFiat}\n` +
        `**Status:** ✅ Completed\n\n` +
        `🎉 Your trade has been completed! Funds will be available in your wallet shortly.`;
      suggestions = ['View Transaction', 'Trade Again', 'Leave Feedback'];
    } else if (lowerMessage.includes('best') || lowerMessage.includes('offer') || lowerMessage.includes('find')) {
      response = `📊 **Best ${tradeType} Offers for ${selectedCrypto}:**\n\n`;
      
      availableOffers.forEach((offer, index) => {
        response += `${index + 1}. **${offer.trader}**\n` +
          `   • Price: $${offer.price.toFixed(3)}\n` +
          `   • Fee: ${offer.fee}%\n` +
          `   • Rating: ${offer.rating}★ (${offer.completionRate}% completion)\n` +
          `   • Payment: ${offer.paymentMethods.join(', ')}\n\n`;
      });
      
      response += `💡 **ElizaOS Recommendation:** ${availableOffers[0].trader} offers the best price and reliability.`;
      suggestions = ['Execute Trade with Premium Trader', 'Show More Details', 'Compare Offers'];
    } else {
      response = `I can help you with:\n\n` +
        `• **Execute trades** - I can find and execute the best deals\n` +
        `• **Market analysis** - Get real-time market insights\n` +
        `• **Safety checks** - Verify traders and offers\n` +
        `• **Trading tips** - Expert advice for better trades\n\n` +
        `Just tell me what you'd like to do!`;
      suggestions = ['Execute a Trade', 'Market Analysis', 'Safety Check', 'Trading Tips'];
    }

    setIsTyping(false);
    
    return {
      id: Date.now().toString(),
      type: 'assistant',
      content: response,
      timestamp: new Date(),
      suggestions,
      tradeData
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    const response = await generateResponse(inputValue);
    setMessages(prev => [...prev, response]);
  };

  const handleSuggestionClick = async (suggestion: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: suggestion,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const response = await generateResponse(suggestion);
    setMessages(prev => [...prev, response]);
  };

  const getTradeStatusIcon = (status: string) => {
    switch (status) {
      case 'executed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'failed': return <X className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
        className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        size="lg"
      >
        <Bot className="h-6 w-6" />
        <span className="ml-2 font-semibold">ElizaOS</span>
        <Sparkles className={`ml-2 h-4 w-4 transition-all duration-300 ${isButtonHovered ? 'animate-spin' : 'animate-pulse'}`} />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[90vw] animate-in slide-in-from-bottom-4 duration-300">
      <Card className="bg-white/95 backdrop-blur-sm border-purple-200/50 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
        <div className="flex items-center justify-between p-4 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center animate-pulse">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-800 text-left">ElizaOS Trading</h3>
              <p className="text-xs text-gray-500 text-left">AI-Powered Trade Execution</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 text-gray-500 hover:text-purple-600 hover:bg-purple-100 transition-all duration-200"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-100 transition-all duration-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            <ScrollArea className="h-80 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                      <div className={`flex items-start gap-2 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-110 ${
                          message.type === 'user' 
                            ? 'bg-blue-600 hover:bg-blue-700' 
                            : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                        }`}>
                          {message.type === 'user' ? (
                            <User className="h-3 w-3 text-white" />
                          ) : (
                            <Bot className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <div className={`rounded-lg p-3 transition-all duration-300 hover:shadow-md ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-50 border border-gray-200'
                        }`}>
                          <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                          
                          {/* Trade Data Display */}
                          {message.tradeData && (
                            <div className="mt-3 p-3 bg-white/80 rounded-lg border border-gray-200">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-gray-600">Trade Details</span>
                                {getTradeStatusIcon(message.tradeData.status)}
                              </div>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Trader:</span>
                                  <span className="font-medium">{message.tradeData.trader}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Amount:</span>
                                  <span className="font-medium">{message.tradeData.amount} {selectedCrypto}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Price:</span>
                                  <span className="font-medium">${message.tradeData.price.toFixed(3)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Total:</span>
                                  <span className="font-medium text-green-600">${message.tradeData.total.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {message.suggestions && (
                            <div className="mt-3 space-y-2">
                              {message.suggestions.map((suggestion, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  className="w-full text-xs h-8 bg-white/80 hover:bg-purple-50 border-purple-300 text-purple-700 hover:text-purple-800 hover:border-purple-400 transition-all duration-200 hover:scale-105 hover:shadow-sm"
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={`text-xs text-gray-400 mt-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center animate-pulse">
                        <Bot className="h-3 w-3 text-white" />
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3 border border-gray-200">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-purple-100 bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask ElizaOS to execute a trade..."
                  className="flex-1 border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200 bg-white/80 hover:bg-white text-black placeholder-gray-500"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default ElizaOSTrading; 