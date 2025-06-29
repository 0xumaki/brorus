import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  FileText, 
  Calculator, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Calendar,
  Filter,
  BarChart3,
  PieChart,
  DownloadCloud,
  Eye,
  Settings,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '@/contexts/language';
import { 
  calculateCapitalGains, 
  generateCSVReport, 
  generateYearlyTaxReport,
  TaxSummary,
  calculateWashSales
} from '@/lib/taxUtils';

interface Transaction {
  id: string;
  date: Date;
  type: 'buy' | 'sell' | 'transfer_in' | 'transfer_out' | 'swap' | 'stake' | 'unstake' | 'reward';
  asset: string;
  amount: number;
  price: number;
  value: number;
  fee: number;
  category: string;
  description: string;
  txHash: string;
  network: string;
}

const TaxReporting: React.FC = () => {
  const { t } = useLanguage();
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedAsset, setSelectedAsset] = useState('all');
  const [reportFormat, setReportFormat] = useState<'csv' | 'pdf' | 'json'>('csv');
  const [costBasisMethod, setCostBasisMethod] = useState<'FIFO' | 'LIFO' | 'SPECIFIC_ID'>('FIFO');
  const [washSales, setWashSales] = useState<any[]>([]);
  const [taxReport, setTaxReport] = useState<TaxSummary | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock transaction data for demo
  const mockTransactions = [
    // 2020 Transactions
    {
      id: '2020-1',
      type: 'buy',
      asset: 'USDT',
      amount: 50000,
      price: 1.00,
      value: 50000,
      fee: 250,
      date: '2020-03-15',
      category: 'purchase',
      description: 'Initial USDT purchase',
      txHash: '0x2020-1...abc',
      network: 'Ethereum'
    },
    {
      id: '2020-2',
      type: 'buy',
      asset: 'USDC',
      amount: 25000,
      price: 1.00,
      value: 25000,
      fee: 125,
      date: '2020-06-20',
      category: 'purchase',
      description: 'USDC purchase',
      txHash: '0x2020-2...def',
      network: 'Ethereum'
    },
    {
      id: '2020-3',
      type: 'sell',
      asset: 'USDT',
      amount: 10000,
      price: 1.02,
      value: 10200,
      fee: 50,
      date: '2020-11-10',
      category: 'sale',
      description: 'Partial USDT sale',
      txHash: '0x2020-3...ghi',
      network: 'Ethereum'
    },

    // 2021 Transactions
    {
      id: '2021-1',
      type: 'buy',
      asset: 'CHF',
      amount: 50000,
      price: 1.10,
      value: 55000,
      fee: 275,
      date: '2021-02-15',
      category: 'purchase',
      description: 'CHF purchase',
      txHash: '0x2021-1...abc',
      network: 'Ethereum'
    },
    {
      id: '2021-2',
      type: 'buy',
      asset: 'AUD',
      amount: 75000,
      price: 0.75,
      value: 56250,
      fee: 281,
      date: '2021-05-10',
      category: 'purchase',
      description: 'AUD purchase',
      txHash: '0x2021-2...def',
      network: 'Ethereum'
    },
    {
      id: '2021-3',
      type: 'sell',
      asset: 'USDC',
      amount: 15000,
      price: 1.01,
      value: 15150,
      fee: 75,
      date: '2021-08-20',
      category: 'sale',
      description: 'USDC sale',
      txHash: '0x2021-3...ghi',
      network: 'Ethereum'
    },
    {
      id: '2021-4',
      type: 'buy',
      asset: 'EUR',
      amount: 40000,
      price: 1.20,
      value: 48000,
      fee: 240,
      date: '2021-10-05',
      category: 'purchase',
      description: 'EUR purchase',
      txHash: '0x2021-4...jkl',
      network: 'Ethereum'
    },
    {
      id: '2021-5',
      type: 'buy',
      asset: 'CAD',
      amount: 60000,
      price: 0.80,
      value: 48000,
      fee: 240,
      date: '2021-12-15',
      category: 'purchase',
      description: 'CAD purchase',
      txHash: '0x2021-5...mno',
      network: 'Ethereum'
    },

    // 2022 Transactions
    {
      id: '2022-1',
      type: 'buy',
      asset: 'SGD',
      amount: 60000,
      price: 0.73,
      value: 43800,
      fee: 219,
      date: '2022-01-15',
      category: 'purchase',
      description: 'SGD purchase',
      txHash: '0x2022-1...abc',
      network: 'Ethereum'
    },
    {
      id: '2022-2',
      type: 'sell',
      asset: 'CHF',
      amount: 25000,
      price: 1.08,
      value: 27000,
      fee: 135,
      date: '2022-03-20',
      category: 'sale',
      description: 'CHF sale',
      txHash: '0x2022-2...def',
      network: 'Ethereum'
    },
    {
      id: '2022-3',
      type: 'buy',
      asset: 'HKD',
      amount: 400000,
      price: 0.13,
      value: 52000,
      fee: 260,
      date: '2022-06-10',
      category: 'purchase',
      description: 'HKD purchase',
      txHash: '0x2022-3...ghi',
      network: 'Ethereum'
    },
    {
      id: '2022-4',
      type: 'sell',
      asset: 'AUD',
      amount: 40000,
      price: 0.72,
      value: 28800,
      fee: 144,
      date: '2022-09-15',
      category: 'sale',
      description: 'AUD sale',
      txHash: '0x2022-4...jkl',
      network: 'Ethereum'
    },
    {
      id: '2022-5',
      type: 'buy',
      asset: 'INR',
      amount: 2500000,
      price: 0.012,
      value: 30000,
      fee: 150,
      date: '2022-11-20',
      category: 'purchase',
      description: 'INR purchase',
      txHash: '0x2022-5...mno',
      network: 'Ethereum'
    },
    {
      id: '2022-6',
      type: 'buy',
      asset: 'NZD',
      amount: 80000,
      price: 0.62,
      value: 49600,
      fee: 248,
      date: '2022-12-10',
      category: 'purchase',
      description: 'NZD purchase',
      txHash: '0x2022-6...pqr',
      network: 'Ethereum'
    },

    // 2023 Transactions
    {
      id: '2023-1',
      type: 'buy',
      asset: 'USDT',
      amount: 125000,
      price: 1.00,
      value: 125000,
      fee: 625,
      date: '2023-01-15',
      category: 'purchase',
      description: 'USDT purchase',
      txHash: '0x2023-1...abc',
      network: 'Ethereum'
    },
    {
      id: '2023-2',
      type: 'buy',
      asset: 'USDC',
      amount: 90000,
      price: 1.00,
      value: 90000,
      fee: 450,
      date: '2023-03-20',
      category: 'purchase',
      description: 'USDC purchase',
      txHash: '0x2023-2...def',
      network: 'Ethereum'
    },
    {
      id: '2023-3',
      type: 'sell',
      asset: 'USDT',
      amount: 25000,
      price: 1.01,
      value: 25250,
      fee: 126,
      date: '2023-06-10',
      category: 'sale',
      description: 'Partial USDT sale',
      txHash: '0x2023-3...ghi',
      network: 'Ethereum'
    },
    {
      id: '2023-4',
      type: 'buy',
      asset: 'THB',
      amount: 1500000,
      price: 0.028,
      value: 42000,
      fee: 210,
      date: '2023-08-05',
      category: 'purchase',
      description: 'THB purchase',
      txHash: '0x2023-4...abc',
      network: 'Ethereum'
    },
    {
      id: '2023-5',
      type: 'sell',
      asset: 'EUR',
      amount: 20000,
      price: 1.18,
      value: 23600,
      fee: 118,
      date: '2023-11-15',
      category: 'sale',
      description: 'EUR sale',
      txHash: '0x2023-5...def',
      network: 'Ethereum'
    },
    {
      id: '2023-6',
      type: 'sell',
      asset: 'SGD',
      amount: 30000,
      price: 0.74,
      value: 22200,
      fee: 111,
      date: '2023-12-20',
      category: 'sale',
      description: 'SGD sale',
      txHash: '0x2023-6...ghi',
      network: 'Ethereum'
    },
    {
      id: '2023-7',
      type: 'buy',
      asset: 'MRP',
      amount: 75000,
      price: 0.022,
      value: 1650,
      fee: 8,
      date: '2023-12-25',
      category: 'purchase',
      description: 'MRP purchase',
      txHash: '0x2023-7...jkl',
      network: 'Ethereum'
    },

    // 2024 Transactions
    {
      id: '2024-1',
      type: 'sell',
      asset: 'USDC',
      amount: 40000,
      price: 1.00,
      value: 40000,
      fee: 200,
      date: '2024-01-20',
      category: 'sale',
      description: 'USDC sale',
      txHash: '0x2024-1...ghi',
      network: 'Ethereum'
    },
    {
      id: '2024-2',
      type: 'buy',
      asset: 'DEM',
      amount: 100000,
      price: 0.55,
      value: 55000,
      fee: 275,
      date: '2024-02-15',
      category: 'purchase',
      description: 'DEM purchase',
      txHash: '0x2024-2...abc',
      network: 'Ethereum'
    },
    {
      id: '2024-3',
      type: 'sell',
      asset: 'CAD',
      amount: 25000,
      price: 0.78,
      value: 19500,
      fee: 98,
      date: '2024-03-10',
      category: 'sale',
      description: 'CAD sale',
      txHash: '0x2024-3...def',
      network: 'Ethereum'
    },
    {
      id: '2024-4',
      type: 'buy',
      asset: 'MX',
      amount: 450000,
      price: 0.059,
      value: 26550,
      fee: 133,
      date: '2024-04-05',
      category: 'purchase',
      description: 'MX purchase',
      txHash: '0x2024-4...ghi',
      network: 'Ethereum'
    },
    {
      id: '2024-5',
      type: 'sell',
      asset: 'HKD',
      amount: 150000,
      price: 0.128,
      value: 19200,
      fee: 96,
      date: '2024-05-20',
      category: 'sale',
      description: 'HKD sale',
      txHash: '0x2024-5...jkl',
      network: 'Ethereum'
    },
    {
      id: '2024-6',
      type: 'buy',
      asset: 'ZAR',
      amount: 350000,
      price: 0.055,
      value: 19250,
      fee: 96,
      date: '2024-06-15',
      category: 'purchase',
      description: 'ZAR purchase',
      txHash: '0x2024-6...mno',
      network: 'Ethereum'
    }
  ];

  // Filter transactions by selected asset
  const filteredTransactions = selectedAsset === 'all' 
    ? mockTransactions 
    : mockTransactions.filter(tx => tx.asset === selectedAsset);

  // Get unique assets for the dropdown
  const assets = [...new Set(mockTransactions.map(tx => tx.asset))];

  const categories = ['Investment', 'Trading', 'Staking', 'Transfer', 'Reward', 'Other'];

  const generateTaxReport = async () => {
    setIsGenerating(true);
    
    // Simulate processing time for demo
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const report = generateYearlyTaxReport(mockTransactions, selectedYear, costBasisMethod);
      setTaxReport(report);
    } catch (error) {
      console.error('Error generating tax report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = (format: 'csv' | 'pdf' | 'json') => {
    if (!taxReport) return;
    
    const csvContent = generateCSVReport(taxReport, filteredTransactions);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tax-report-${selectedYear}-${format}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'buy': return 'bg-wallet-emerald/20 text-wallet-emerald border-wallet-emerald/30';
      case 'sell': return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'swap': return 'bg-wallet-dark/20 text-wallet-dark border-wallet-dark/30';
      case 'reward': return 'bg-purple-500/20 text-purple-500 border-purple-500/30';
      default: return 'bg-wallet-gray-400/20 text-wallet-gray-400 border-wallet-gray-400/30';
    }
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'buy': return <TrendingUp className="h-4 w-4" />;
      case 'sell': return <TrendingDown className="h-4 w-4" />;
      case 'swap': return <BarChart3 className="h-4 w-4" />;
      case 'reward': return <DollarSign className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  // Load data immediately when component mounts
  useEffect(() => {
    generateReport();
  }, []); // Empty dependency array to run only on mount

  useEffect(() => {
    generateReport();
  }, [selectedYear, costBasisMethod]);

  const generateReport = async () => {
    setIsGenerating(true);
    
    // Simulate processing time for demo
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      // Convert string dates to Date objects for the tax calculation
      const transactionsWithDates = mockTransactions.map(tx => ({
        ...tx,
        date: new Date(tx.date)
      }));
      
      const summary = generateYearlyTaxReport(transactionsWithDates, selectedYear, costBasisMethod);
      setTaxReport(summary);
      
      const washSaleResults = calculateWashSales(transactionsWithDates);
      setWashSales(washSaleResults);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportCSV = () => {
    if (!taxReport) return;
    
    const csvContent = generateCSVReport(taxReport, filteredTransactions);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tax-report-${selectedYear}-${costBasisMethod}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getTaxLiability = (gains: number, rate: number) => {
    return gains * (rate / 100);
  };

  const getStatusColor = (value: number) => {
    if (value > 0) return 'text-green-500';
    if (value < 0) return 'text-red-500';
    return 'text-wallet-gray-400';
  };

  if (isGenerating) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wallet-emerald mx-auto mb-4"></div>
            <p className="text-wallet-emerald">Generating tax report...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!taxReport) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-wallet-gray-400">No tax data available for {selectedYear}</p>
        </div>
      </div>
    );
  }

  const shortTermTaxLiability = getTaxLiability(taxReport.shortTermGains, 22);
  const longTermTaxLiability = getTaxLiability(taxReport.longTermGains, 15);
  const totalTaxLiability = shortTermTaxLiability + longTermTaxLiability;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-wallet-emerald text-left">Tax Reporting</h2>
          <p className="text-wallet-gray-400 text-left">Generate comprehensive tax reports and export data</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={generateReport} disabled={isGenerating} className="btn-primary">
            <RefreshCw className="h-4 w-4 mr-2" />
            Regenerate
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-wallet-emerald text-left flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-wallet-emerald text-left block mb-2">Tax Year</label>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full bg-wallet-white/10 border border-wallet-emerald/20 text-wallet-emerald rounded-lg px-3 py-2"
              >
                {[2024, 2023, 2022, 2021, 2020].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-wallet-emerald text-left block mb-2">Asset</label>
              <select 
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
                className="w-full bg-wallet-white/10 border border-wallet-emerald/20 text-wallet-emerald rounded-lg px-3 py-2"
              >
                <option value="all">All Assets</option>
                {assets.map(asset => (
                  <option key={asset} value={asset}>{asset}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-wallet-emerald">Net Gain/Loss</CardTitle>
            {taxReport.netGain > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(taxReport.netGain)}`}>
              ${taxReport.netGain.toFixed(2)}
            </div>
            <p className="text-xs text-wallet-gray-400">
              {taxReport.totalGains > 0 && `+$${taxReport.totalGains.toFixed(2)} gains`}
              {taxReport.totalLosses > 0 && ` -$${taxReport.totalLosses.toFixed(2)} losses`}
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-wallet-emerald">Tax Liability</CardTitle>
            <DollarSign className="h-4 w-4 text-wallet-emerald" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-wallet-emerald">
              ${totalTaxLiability.toFixed(2)}
            </div>
            <p className="text-xs text-wallet-gray-400">
              Based on current rates
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-wallet-emerald">Transactions</CardTitle>
            <FileText className="h-4 w-4 text-wallet-emerald" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-wallet-emerald">
              {taxReport.transactionCount}
            </div>
            <p className="text-xs text-wallet-gray-400">
              {taxReport.assets.length} assets
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-wallet-emerald">Capital Gains</CardTitle>
            <BarChart3 className="h-4 w-4 text-wallet-emerald" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-wallet-emerald">
              {taxReport.capitalGains.length}
            </div>
            <p className="text-xs text-wallet-gray-400">
              Realized gains/losses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Report */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tax Summary */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-wallet-emerald text-left">Tax Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-wallet-gray-400">Short-term Gains</span>
                <div className="flex items-center gap-2">
                  <span className="text-green-500 font-medium">${taxReport.shortTermGains.toFixed(2)}</span>
                  <Badge variant="outline" className="border-green-500/20 text-green-500">
                    22% rate
                  </Badge>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-wallet-gray-400">Long-term Gains</span>
                <div className="flex items-center gap-2">
                  <span className="text-green-500 font-medium">${taxReport.longTermGains.toFixed(2)}</span>
                  <Badge variant="outline" className="border-blue-500/20 text-blue-500">
                    15% rate
                  </Badge>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-wallet-gray-400">Short-term Losses</span>
                <span className="text-red-500 font-medium">${taxReport.shortTermLosses.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-wallet-gray-400">Long-term Losses</span>
                <span className="text-red-500 font-medium">${taxReport.longTermLosses.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-wallet-gray-400">Total Fees</span>
                <span className="text-wallet-emerald font-medium">${taxReport.totalFees.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tax Liability Breakdown */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-wallet-emerald text-left">Tax Liability Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-wallet-gray-400">Short-term Tax</span>
                <span className="text-wallet-emerald font-medium">${shortTermTaxLiability.toFixed(2)}</span>
              </div>
              <Progress value={(shortTermTaxLiability / totalTaxLiability) * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-wallet-gray-400">Long-term Tax</span>
                <span className="text-wallet-emerald font-medium">${longTermTaxLiability.toFixed(2)}</span>
              </div>
              <Progress value={(longTermTaxLiability / totalTaxLiability) * 100} className="h-2" />
            </div>

            <div className="pt-4 border-t border-wallet-emerald/20">
              <div className="flex justify-between items-center font-semibold text-lg">
                <span className="text-wallet-emerald">Total Tax Liability</span>
                <span className="text-wallet-emerald">${totalTaxLiability.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Capital Gains Details */}
      {taxReport.capitalGains.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-wallet-emerald text-left">Capital Gains Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {taxReport.capitalGains.map((gain, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-wallet-emerald/20">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${gain.gain > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                      <p className="font-medium text-wallet-emerald text-left">{gain.asset}</p>
                      <p className="text-sm text-wallet-gray-400 text-left">
                        {gain.date.toLocaleDateString()} • {gain.amount} {gain.asset}
                      </p>
                      <p className="text-xs text-wallet-gray-400 text-left">
                        Proceeds: ${gain.proceeds.toFixed(2)} | Cost Basis: ${gain.costBasis.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${getStatusColor(gain.gain)}`}>
                      ${gain.gain.toFixed(2)}
                    </p>
                    <Badge variant="outline" className={`text-xs ${gain.isLongTerm ? 'border-blue-500/20 text-blue-500' : 'border-orange-500/20 text-orange-500'}`}>
                      {gain.isLongTerm ? 'Long-term' : 'Short-term'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wash Sale Alerts */}
      {washSales.length > 0 && (
        <Card className="glass-card border-yellow-500/20">
          <CardHeader>
            <CardTitle className="text-yellow-500 text-left flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Wash Sale Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {washSales.map((washSale, index) => (
                <div key={index} className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <p className="text-sm text-wallet-gray-400 text-left">
                    <strong>Wash Sale Amount:</strong> ${washSale.washSaleAmount.toFixed(2)}
                  </p>
                  <p className="text-sm text-wallet-gray-400 text-left">
                    Loss transaction on {new Date(washSale.lossTransaction.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-wallet-gray-400 text-left">
                    Repurchase on {new Date(washSale.repurchaseTransaction.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Options */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-wallet-emerald text-left">Export Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={handleExportCSV} className="btn-primary">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" className="btn-secondary">
              <FileText className="h-4 w-4 mr-2" />
              Generate PDF
            </Button>
            <Button variant="outline" className="btn-secondary">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxReporting; 