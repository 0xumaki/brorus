import React, { useState, useEffect } from "react";
import { Bell, CreditCard, ArrowUpDown, Loader2, CheckCircle, AlertCircle, ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  amount: string;
  currency: string;
  action: 'buy' | 'sell';
}

interface PageHeaderProps {
  currentBalances?: Record<string, number>;
}

const PageHeader: React.FC<PageHeaderProps> = ({ currentBalances = {} }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { account, connectWallet, isConnected } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<'visa' | 'mastercard' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    amount: '',
    currency: 'USDT',
    action: 'buy'
  });
  const [mockBalance, setMockBalance] = useState('0');

  const currencies = [
    { symbol: 'USDT', name: 'Tether USD', icon: '💵' },
    { symbol: 'USDC', name: 'USD Coin', icon: '🪙' },
    { symbol: 'CHF', name: 'Swiss Franc', icon: '🇨🇭' },
    { symbol: 'AUD', name: 'Australian Dollar', icon: '🇦🇺' }
  ];

  const handleCardSelection = (card: 'visa' | 'mastercard') => {
    setSelectedCard(card);
    setTransactionStatus('idle');
  };

  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const validateForm = (): boolean => {
    if (!formData.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      toast({
        title: "Invalid Card Number",
        description: "Please enter a valid 16-digit card number",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      toast({
        title: "Invalid Expiry Date",
        description: "Please enter expiry date in MM/YY format",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.cvv.match(/^\d{3,4}$/)) {
      toast({
        title: "Invalid CVV",
        description: "Please enter a valid 3 or 4 digit CVV",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.cardholderName.trim()) {
      toast({
        title: "Missing Cardholder Name",
        description: "Please enter the cardholder name",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const processPayment = async () => {
    // Validate form data
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 16) {
      toast({
        title: "Invalid Card Number",
        description: "Please enter a valid 16-digit card number.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.cardholderName.trim()) {
      toast({
        title: "Missing Cardholder Name",
        description: "Please enter the cardholder name.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      toast({
        title: "Invalid Expiry Date",
        description: "Please enter expiry date in MM/YY format.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.cvv || formData.cvv.length < 3) {
      toast({
        title: "Invalid CVV",
        description: "Please enter a valid 3-4 digit CVV.",
        variant: "destructive",
      });
      return;
    }

    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setTransactionStatus('processing');

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate payment success (90% success rate for testing)
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        const amount = parseFloat(formData.amount);
        const action = formData.action;
        const currency = formData.currency;

        // Update wallet balance based on action
        if (action === 'buy') {
          // Buy stablecoins with fiat - add to wallet
          const currentBalance = parseFloat(localStorage.getItem(`wallet_balance_${currency}`) || '0');
          const newBalance = currentBalance + amount;
          localStorage.setItem(`wallet_balance_${currency}`, newBalance.toString());
          
          // Store transaction history
          const transaction = {
            id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'buy',
            currency: currency,
            amount: amount,
            status: 'completed',
            timestamp: new Date().toISOString(),
            cardType: selectedCard,
            cardLast4: formData.cardNumber.slice(-4),
            fee: (amount * 0.025).toFixed(2), // 2.5% fee
            totalPaid: (amount * 1.025).toFixed(2)
          };
          
          const transactions = JSON.parse(localStorage.getItem('wallet_transactions') || '[]');
          transactions.unshift(transaction);
          localStorage.setItem('wallet_transactions', JSON.stringify(transactions));

          setTransactionStatus('success');
          toast({
            title: "Purchase Successful!",
            description: `Successfully bought ${amount} ${currency} for $${transaction.totalPaid}`,
            variant: "default",
          });
        } else {
          // Sell stablecoins for fiat - remove from wallet
          const currentBalance = parseFloat(localStorage.getItem(`wallet_balance_${currency}`) || '0');
          
          if (currentBalance < amount) {
            throw new Error(`Insufficient ${currency} balance. Available: ${currentBalance} ${currency}`);
          }
          
          const newBalance = currentBalance - amount;
          localStorage.setItem(`wallet_balance_${currency}`, newBalance.toString());
          
          // Store transaction history
          const transaction = {
            id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'sell',
            currency: currency,
            amount: amount,
            status: 'completed',
            timestamp: new Date().toISOString(),
            cardType: selectedCard,
            cardLast4: formData.cardNumber.slice(-4),
            fee: (amount * 0.015).toFixed(2), // 1.5% fee
            totalReceived: (amount * 0.985).toFixed(2)
          };
          
          const transactions = JSON.parse(localStorage.getItem('wallet_transactions') || '[]');
          transactions.unshift(transaction);
          localStorage.setItem('wallet_transactions', JSON.stringify(transactions));

          setTransactionStatus('success');
          toast({
            title: "Sale Successful!",
            description: `Successfully sold ${amount} ${currency} for $${transaction.totalReceived}`,
            variant: "default",
          });
        }

        // Reset form after successful transaction
        setTimeout(() => {
          setSelectedCard(null);
          setTransactionStatus('idle');
          setFormData({
            cardNumber: '',
            expiryDate: '',
            cvv: '',
            cardholderName: '',
            amount: '',
            currency: 'USDT',
            action: 'buy'
          });
          setIsProcessing(false);
        }, 3000);

      } else {
        // Simulate payment failure
        setTransactionStatus('error');
        toast({
          title: "Payment Failed",
          description: "Your payment was declined. Please check your card details and try again.",
          variant: "destructive",
        });
        setIsProcessing(false);
      }

    } catch (error) {
      setTransactionStatus('error');
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const handleMockBuySell = (action: 'buy' | 'sell') => {
    const amount = parseFloat(formData.amount) || 0;
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0.",
        variant: "destructive",
      });
      return;
    }

    // Get the real balance from Sepolia testnet as the starting point
    const realBalance = currentBalances[formData.currency] || 0;
    const demoBalance = parseFloat(mockBalance) || 0;
    
    // Use the higher value: either real balance or demo balance (if demo transactions exist)
    const currentBalance = Math.max(realBalance, demoBalance);
    let newBalance: number;
    
    if (action === 'buy') {
      // Add the bought amount to existing balance
      newBalance = currentBalance + amount;
    } else {
      // For selling, check if user has enough balance
      if (currentBalance < amount) {
        toast({
          title: "Insufficient Balance",
          description: `You only have ${currentBalance.toLocaleString()} ${formData.currency} available. Cannot sell ${amount.toLocaleString()} ${formData.currency}.`,
          variant: "destructive",
        });
        return;
      }
      // Subtract the sold amount from existing balance
      newBalance = currentBalance - amount;
    }
    
    // Update demo balance state
    setMockBalance(newBalance.toString());
    
    // Store transaction history for demo
    const transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: action,
      currency: formData.currency,
      amount: amount,
      status: 'completed',
      timestamp: new Date().toISOString(),
      cardType: selectedCard,
      cardLast4: formData.cardNumber.slice(-4) || '****',
      fee: (amount * (action === 'buy' ? 0.025 : 0.015)).toFixed(2),
      total: action === 'buy' ? (amount * 1.025).toFixed(2) : (amount * 0.985).toFixed(2),
      previousBalance: currentBalance,
      newBalance: newBalance
    };
    
    // Trigger wallet refresh event so other components can update
    window.dispatchEvent(new CustomEvent('walletBalanceUpdated', {
      detail: { currency: formData.currency, newBalance: newBalance }
    }));
    
    setTransactionStatus('success');
    setFormData(f => ({ ...f, amount: '' }));
    
    toast({
      title: `${action === 'buy' ? 'Purchase' : 'Sale'} Successful!`,
      description: `Successfully ${action === 'buy' ? 'bought' : 'sold'} ${amount.toLocaleString()} ${formData.currency}. Balance: ${currentBalance.toLocaleString()} → ${newBalance.toLocaleString()}`,
      variant: "default",
    });
  };

  useEffect(() => {
    // Initialize with real balance from Sepolia testnet
    const realBalance = currentBalances[formData.currency] || 0;
    setMockBalance(realBalance.toString());
  }, [formData.currency, transactionStatus, currentBalances]);

  const renderPaymentForm = () => {
    if (transactionStatus === 'processing') {
      return (
        <div className="text-center py-12">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-wallet-emerald to-wallet-neo rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Loader2 className="h-10 w-10 animate-spin text-white" />
            </div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-wallet-emerald/20 border-t-wallet-emerald rounded-full animate-spin mx-auto"></div>
          </div>
          <h3 className="text-xl font-bold text-wallet-gray-800 mb-3">Processing Your {formData.action === 'buy' ? 'Purchase' : 'Sale'}</h3>
          <p className="text-sm text-wallet-gray-600 max-w-sm mx-auto">
            Please wait while we securely process your {formData.action === 'buy' ? 'purchase' : 'sale'} of {formData.amount} {formData.currency}
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-wallet-gray-400">
            <div className="w-2 h-2 bg-wallet-emerald rounded-full animate-pulse"></div>
            <span>Verifying payment details...</span>
          </div>
        </div>
      );
    }

    if (transactionStatus === 'success') {
      const amount = parseFloat(formData.amount);
      const isBuy = formData.action === 'buy';
      const fee = isBuy ? (amount * 0.025) : (amount * 0.015);
      const total = isBuy ? (amount + fee) : (amount - fee);
      const currentBalance = parseFloat(mockBalance);
      
      return (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-lg font-bold text-wallet-gray-800 mb-3">Transaction Successful!</h3>
          <Button onClick={() => {
            setTransactionStatus('idle');
            setSelectedCard(null);
            setFormData({
              cardNumber: '',
              expiryDate: '',
              cvv: '',
              cardholderName: '',
              amount: '',
              currency: 'USDT',
              action: 'buy'
            });
          }} className="bg-wallet-emerald mt-2">New Transaction</Button>
        </div>
      );
    }

    if (transactionStatus === 'error') {
      return (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <AlertCircle className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-lg font-bold text-wallet-gray-800 mb-3">Transaction Failed</h3>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-800 font-medium">
              Unable to process your {formData.action === 'buy' ? 'purchase' : 'sale'}
            </p>
            <p className="text-xs text-red-600 mt-1">
              Please check your card details and try again
            </p>
          </div>
          <Button 
            onClick={() => setTransactionStatus('idle')} 
            className="bg-wallet-emerald hover:bg-wallet-dark font-semibold px-6"
          >
            Try Again
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-gradient-to-br from-wallet-emerald to-wallet-neo rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
            <CreditCard size={20} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-wallet-gray-800">
            {selectedCard === 'visa' ? 'Visa' : 'Mastercard'} Payment
          </h3>
          <p className="text-xs text-wallet-gray-600">
            Complete your {formData.action === 'buy' ? 'purchase' : 'sale'} securely
          </p>
        </div>

        {/* Transaction Summary */}
        <div className="bg-gradient-to-r from-wallet-emerald/5 to-wallet-neo/5 border border-wallet-emerald/20 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-wallet-gray-700">Transaction Type</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              formData.action === 'buy' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-orange-100 text-orange-700'
            }`}>
              {formData.action === 'buy' ? 'Buy' : 'Sell'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-wallet-gray-700">Currency</span>
            <span className="text-xs font-semibold text-wallet-gray-800">{formData.currency}</span>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-3">
          {/* Action Selection */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-wallet-gray-700">Transaction Type</Label>
            <Select value={formData.action} onValueChange={(value: 'buy' | 'sell') => setFormData(f => ({ ...f, action: value }))}>
              <SelectTrigger className="border-wallet-emerald/20 focus:border-wallet-emerald h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buy">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">📈</span>
                    <span>Buy Stablecoins</span>
                  </div>
                </SelectItem>
                <SelectItem value="sell">
                  <div className="flex items-center gap-2">
                    <span className="text-orange-600">📉</span>
                    <span>Sell Stablecoins</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Currency Selection */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-wallet-gray-700">Stablecoin</Label>
            <Select value={formData.currency} onValueChange={(value) => setFormData(f => ({ ...f, currency: value }))}>
              <SelectTrigger className="border-wallet-emerald/20 focus:border-wallet-emerald h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map(currency => (
                  <SelectItem key={currency.symbol} value={currency.symbol}>
                    <div className="flex items-center gap-2">
                      <span className="text-base">{currency.icon}</span>
                      <div>
                        <span className="font-medium text-sm">{currency.name}</span>
                        <span className="text-xs text-wallet-gray-500 ml-1">({currency.symbol})</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-wallet-gray-700">Amount</Label>
            <div className="relative">
              <Input
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData(f => ({ ...f, amount: e.target.value }))}
                className="font-mono border-wallet-emerald/20 focus:border-wallet-emerald pr-12 h-9"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-medium text-wallet-gray-500">
                {formData.currency}
              </span>
            </div>
          </div>

          {/* Card Details Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-br from-wallet-emerald to-wallet-neo rounded-full flex items-center justify-center">
                <CreditCard size={10} className="text-white" />
              </div>
              <h4 className="font-semibold text-sm text-wallet-gray-800">Card Information</h4>
            </div>

            {/* Card Number */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-wallet-gray-700">Card Number</Label>
              <Input
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={(e) => setFormData(f => ({ ...f, cardNumber: formatCardNumber(e.target.value) }))}
                maxLength={19}
                className="font-mono border-wallet-emerald/20 focus:border-wallet-emerald h-9"
              />
            </div>

            {/* Cardholder Name */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-wallet-gray-700">Cardholder Name</Label>
              <Input
                placeholder="John Doe"
                value={formData.cardholderName}
                onChange={(e) => setFormData(f => ({ ...f, cardholderName: e.target.value }))}
                className="border-wallet-emerald/20 focus:border-wallet-emerald h-9"
              />
            </div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-wallet-gray-700">Expiry Date</Label>
                <Input
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData(f => ({ ...f, expiryDate: e.target.value }))}
                  maxLength={5}
                  className="font-mono border-wallet-emerald/20 focus:border-wallet-emerald h-9"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-wallet-gray-700">CVV</Label>
                <Input
                  placeholder="123"
                  value={formData.cvv}
                  onChange={(e) => setFormData(f => ({ ...f, cvv: e.target.value.replace(/\D/g, '') }))}
                  maxLength={4}
                  className="font-mono border-wallet-emerald/20 focus:border-wallet-emerald h-9"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            {formData.action === 'buy' ? (
              <Button className="w-full bg-wallet-emerald" onClick={() => handleMockBuySell('buy')}>Buy</Button>
            ) : (
              <Button className="w-full bg-wallet-dark" onClick={() => handleMockBuySell('sell')}>Sell</Button>
            )}
          </div>
          <div className="text-xs text-wallet-gray-500 text-center mt-2">Current Balance: {mockBalance} {formData.currency}</div>
        </div>

        {/* Process Button */}
        <Button 
          onClick={processPayment}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-wallet-emerald to-wallet-neo hover:from-wallet-dark hover:to-wallet-emerald text-white font-semibold py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard size={14} className="mr-2" />
              {formData.action === 'buy' ? 'Buy' : 'Sell'} {formData.currency}
            </>
          )}
        </Button>

        {/* Security Notice */}
        <div className="text-center space-y-2 pt-3 border-t border-wallet-gray-200">
          <div className="flex items-center justify-center gap-2 text-xs text-wallet-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>256-bit SSL encryption</span>
          </div>
          <p className="text-xs text-wallet-gray-400 font-medium">
            🔒 Secure payment processing by {selectedCard === 'visa' ? 'Visa' : 'Mastercard'}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="text-left">
        <h1
          className="text-4xl md:text-5xl font-extrabold tracking-widest bg-gradient-to-r from-emerald-400 via-emerald-600 to-neo-400 bg-clip-text text-transparent drop-shadow-lg animate-fade-in"
          style={{ letterSpacing: '0.15em', lineHeight: 1.1, position: 'relative' }}
        >
          {t("app.name")}
          <span className="block h-1 w-16 mt-2 mx-auto bg-gradient-to-r from-emerald-400 to-neo-400 rounded-full animate-pulse" style={{ opacity: 0.8 }}></span>
        </h1>
        <p className="text-wallet-gray-400 text-base font-medium mt-2 animate-fade-in-slow">
          {t("app.tagline")}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {/* On-Ramp/Off-Ramp Button with Circulating Border Effect */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="circulating-border text-wallet-emerald font-medium"
            >
              <div className="button-content flex items-center">
                <ArrowUpDown size={16} className="mr-2" />
                <span>On-Ramp</span>
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm border-wallet-emerald/20 max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-wallet-emerald font-bold tracking-tight">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown size={20} />
                    On-Ramp / Off-Ramp
                  </div>
                </DialogTitle>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-wallet-gray-500 hover:text-wallet-emerald hover:bg-wallet-emerald/10"
                >
                  <X size={16} />
                </Button>
              </div>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto pr-2 flex flex-col items-center justify-center">
              {!selectedCard ? (
                <div className="space-y-4">
                  {/* Header Section */}
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-wallet-emerald to-wallet-neo rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <CreditCard size={20} className="text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-wallet-gray-800">Choose Your Payment Method</h3>
                    <p className="text-xs text-wallet-gray-600 max-w-sm mx-auto">
                      Select your preferred card network to buy or sell stablecoins securely
                    </p>
                  </div>
                  
                  {/* Card Options */}
                  <div className="space-y-3">
                    {/* Visa Card Option */}
                    <div 
                      className="group relative p-4 border-2 border-transparent hover:border-blue-500/30 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100/50 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:shadow-xl"
                      onClick={() => handleCardSelection('visa')}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-blue-800/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-sm">VISA</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-base text-wallet-gray-800">Visa</h3>
                            <p className="text-xs text-wallet-gray-500">Global payment network</p>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Secure</span>
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Fast</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard size={16} className="text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                          <div className="w-2 h-2 bg-blue-600 rounded-full group-hover:animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Mastercard Option */}
                    <div 
                      className="group relative p-4 border-2 border-transparent hover:border-orange-500/30 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-100/50 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:shadow-xl"
                      onClick={() => handleCardSelection('mastercard')}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 to-orange-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-8 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-xs">MASTERCARD</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-base text-wallet-gray-800">Mastercard</h3>
                            <p className="text-xs text-wallet-gray-500">Worldwide acceptance</p>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Secure</span>
                              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">Reliable</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard size={16} className="text-orange-600 group-hover:scale-110 transition-transform duration-300" />
                          <div className="w-2 h-2 bg-orange-600 rounded-full group-hover:animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer Info */}
                  <div className="text-center space-y-2 pt-3 border-t border-wallet-gray-200">
                    <div className="flex items-center justify-center gap-2 text-xs text-wallet-gray-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>256-bit SSL encryption</span>
                    </div>
                    <p className="text-xs text-wallet-gray-400 font-medium">
                      Supported by major card networks worldwide
                    </p>
                  </div>
                </div>
              ) : transactionStatus === 'success' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-wallet-gray-800 mb-3">Transaction Successful!</h3>
                  <Button onClick={() => {
                    setTransactionStatus('idle');
                    setSelectedCard(null);
                    setFormData({
                      cardNumber: '',
                      expiryDate: '',
                      cvv: '',
                      cardholderName: '',
                      amount: '',
                      currency: 'USDT',
                      action: 'buy'
                    });
                  }} className="bg-wallet-emerald mt-2">New Transaction</Button>
                </div>
              ) : (
                <div className="w-full max-w-xs mx-auto space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-wallet-emerald to-wallet-neo rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
                      <CreditCard size={20} className="text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-wallet-gray-800">
                      {selectedCard === 'visa' ? 'Visa' : 'Mastercard'} Payment
                    </h3>
                    <p className="text-xs text-wallet-gray-600">Complete your transaction securely</p>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold text-wallet-gray-700">Transaction Type</Label>
                      <Select value={formData.action} onValueChange={(value: 'buy' | 'sell') => setFormData(f => ({ ...f, action: value }))}>
                        <SelectTrigger className="border-wallet-emerald/20 focus:border-wallet-emerald h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="buy">
                            <div className="flex items-center gap-2">
                              <span className="text-green-600">📈</span>
                              <span>Buy Stablecoins</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="sell">
                            <div className="flex items-center gap-2">
                              <span className="text-orange-600">📉</span>
                              <span>Sell Stablecoins</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold text-wallet-gray-700">Stablecoin</Label>
                      <Select value={formData.currency} onValueChange={(value) => setFormData(f => ({ ...f, currency: value }))}>
                        <SelectTrigger className="border-wallet-emerald/20 focus:border-wallet-emerald h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map(currency => (
                            <SelectItem key={currency.symbol} value={currency.symbol}>
                              <div className="flex items-center gap-2">
                                <span className="text-base">{currency.icon}</span>
                                <div>
                                  <span className="font-medium text-sm">{currency.name}</span>
                                  <span className="text-xs text-wallet-gray-500 ml-1">({currency.symbol})</span>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold text-wallet-gray-700">Amount</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={e => setFormData(f => ({ ...f, amount: e.target.value }))}
                        className="font-mono border-wallet-emerald/20 focus:border-wallet-emerald pr-12 h-9"
                      />
                    </div>
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-gradient-to-br from-wallet-emerald to-wallet-neo rounded-full flex items-center justify-center">
                          <CreditCard size={10} className="text-white" />
                        </div>
                        <h4 className="font-semibold text-sm text-wallet-gray-800">Card Information</h4>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-semibold text-wallet-gray-700">Card Number</Label>
                        <Input
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={(e) => setFormData(f => ({ ...f, cardNumber: formatCardNumber(e.target.value) }))}
                          maxLength={19}
                          className="font-mono border-wallet-emerald/20 focus:border-wallet-emerald h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-semibold text-wallet-gray-700">Cardholder Name</Label>
                        <Input
                          placeholder="John Doe"
                          value={formData.cardholderName}
                          onChange={(e) => setFormData(f => ({ ...f, cardholderName: e.target.value }))}
                          className="border-wallet-emerald/20 focus:border-wallet-emerald h-9"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold text-wallet-gray-700">Expiry Date</Label>
                          <Input
                            placeholder="MM/YY"
                            value={formData.expiryDate}
                            onChange={(e) => setFormData(f => ({ ...f, expiryDate: e.target.value }))}
                            maxLength={5}
                            className="font-mono border-wallet-emerald/20 focus:border-wallet-emerald h-9"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold text-wallet-gray-700">CVV</Label>
                          <Input
                            placeholder="123"
                            value={formData.cvv}
                            onChange={(e) => setFormData(f => ({ ...f, cvv: e.target.value.replace(/\D/g, '') }))}
                            maxLength={4}
                            className="font-mono border-wallet-emerald/20 focus:border-wallet-emerald h-9"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      {formData.action === 'buy' ? (
                        <Button className="w-full bg-wallet-emerald" onClick={() => handleMockBuySell('buy')}>Buy</Button>
                      ) : (
                        <Button className="w-full bg-wallet-dark" onClick={() => handleMockBuySell('sell')}>Sell</Button>
                      )}
                    </div>
                    <div className="text-xs text-wallet-gray-500 text-center mt-2">Current Balance: {mockBalance} {formData.currency}</div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Notification Bell */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-wallet-emerald rounded-full"></span>
        </Button>
      </div>
    </div>
  );
};

export default PageHeader;
