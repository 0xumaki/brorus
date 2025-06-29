import React from 'react';
import WalletLayout from '@/components/layout/WalletLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { 
  BarChart3, 
  FileText, 
  Settings, 
  Calculator,
  TrendingUp,
  Download,
  AlertTriangle
} from 'lucide-react';
import TaxDashboard from '@/components/tax/TaxDashboard';
import TaxReporting from '@/components/tax/TaxReporting';
import TaxSettings from '@/components/tax/TaxSettings';
import { useLanguage } from '@/contexts/language';

const Tax: React.FC = () => {
  const { t } = useLanguage();

  return (
    <WalletLayout>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-wallet-emerald to-wallet-dark rounded-2xl flex items-center justify-center shadow-lg border border-wallet-emerald/30">
              <Calculator className="h-6 w-6 text-wallet-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-wallet-emerald tracking-tight text-left">Tax Center</h1>
              <p className="text-wallet-gray-400 text-sm text-left">
                Comprehensive crypto tax reporting, calculations, and compliance tools
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Banner */}
        <div className="glass-card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-left">
              <div className="text-2xl font-bold text-wallet-emerald">$12,500</div>
              <div className="text-sm text-wallet-gray-400">Total Gains 2024</div>
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-red-500">$2,046</div>
              <div className="text-sm text-wallet-gray-400">Estimated Tax</div>
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-wallet-dark">156</div>
              <div className="text-sm text-wallet-gray-400">Transactions</div>
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-orange-500">45</div>
              <div className="text-sm text-wallet-gray-400">Days to Deadline</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 glass-dark border border-wallet-emerald/20">
            <TabsTrigger 
              value="dashboard" 
              className="data-[state=active]:bg-wallet-emerald data-[state=active]:text-wallet-white data-[state=active]:shadow-lg transition-all duration-200"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="reporting" 
              className="data-[state=active]:bg-wallet-emerald data-[state=active]:text-wallet-white data-[state=active]:shadow-lg transition-all duration-200"
            >
              <FileText className="h-4 w-4 mr-2" />
              Reports
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-wallet-emerald data-[state=active]:text-wallet-white data-[state=active]:shadow-lg transition-all duration-200"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
            <TabsTrigger 
              value="tools" 
              className="data-[state=active]:bg-wallet-emerald data-[state=active]:text-wallet-white data-[state=active]:shadow-lg transition-all duration-200"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <TaxDashboard />
          </TabsContent>

          <TabsContent value="reporting" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-wallet-emerald text-left mb-2">Tax Reporting</h2>
              <p className="text-wallet-gray-400 text-left">
                Generate comprehensive tax reports, track transactions, and export data for tax compliance
              </p>
            </div>
            <TaxReporting />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-wallet-emerald text-left mb-2">Tax Settings</h2>
              <p className="text-wallet-gray-400 text-left">
                Configure tax calculation preferences, cost basis methods, and reporting options
              </p>
            </div>
            <TaxSettings />
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Tax Calculator */}
              <div className="glass-card p-6 hover:shadow-xl transition-all duration-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-wallet-emerald to-wallet-dark rounded-xl flex items-center justify-center">
                    <Calculator className="h-5 w-5 text-wallet-white" />
                  </div>
                  <h3 className="font-semibold text-wallet-emerald text-left">Tax Calculator</h3>
                </div>
                <p className="text-wallet-gray-400 text-sm mb-4 text-left">
                  Calculate estimated taxes on your crypto gains
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-wallet-gray-400">Short-term Gains</span>
                    <span className="text-wallet-emerald font-medium">$7,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-wallet-gray-400">Long-term Gains</span>
                    <span className="text-wallet-emerald font-medium">$5,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-wallet-gray-400">Tax Rate</span>
                    <span className="text-wallet-emerald font-medium">22% / 15%</span>
                  </div>
                  <div className="border-t border-wallet-emerald/20 pt-3">
                    <div className="flex justify-between font-semibold">
                      <span className="text-wallet-dark">Estimated Tax</span>
                      <span className="text-red-500">$2,046</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost Basis Tracker */}
              <div className="glass-card p-6 hover:shadow-xl transition-all duration-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-wallet-dark to-wallet-emerald rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-wallet-white" />
                  </div>
                  <h3 className="font-semibold text-wallet-emerald text-left">Cost Basis Tracker</h3>
                </div>
                <p className="text-wallet-gray-400 text-sm mb-4 text-left">
                  Track your asset cost basis and lot identification
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-wallet-gray-400">BTC Holdings</span>
                    <span className="text-wallet-emerald font-medium">2.5 BTC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-wallet-gray-400">Avg Cost Basis</span>
                    <span className="text-wallet-emerald font-medium">$45,200</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-wallet-gray-400">Current Value</span>
                    <span className="text-wallet-emerald font-medium">$52,500</span>
                  </div>
                  <div className="border-t border-wallet-emerald/20 pt-3">
                    <div className="flex justify-between font-semibold">
                      <span className="text-wallet-dark">Unrealized Gain</span>
                      <span className="text-wallet-emerald">$7,300</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wash Sale Detector */}
              <div className="glass-card p-6 hover:shadow-xl transition-all duration-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-wallet-white" />
                  </div>
                  <h3 className="font-semibold text-wallet-emerald text-left">Wash Sale Detector</h3>
                </div>
                <p className="text-wallet-gray-400 text-sm mb-4 text-left">
                  Identify wash sale transactions (US tax law)
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-wallet-gray-400">Wash Sales Found</span>
                    <span className="text-wallet-emerald font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-wallet-gray-400">Disallowed Losses</span>
                    <span className="text-wallet-emerald font-medium">$850</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-wallet-gray-400">Last Check</span>
                    <span className="text-wallet-emerald font-medium">2 days ago</span>
                  </div>
                  <div className="border-t border-wallet-emerald/20 pt-3">
                    <div className="flex justify-between font-semibold">
                      <span className="text-wallet-dark">Status</span>
                      <span className="text-wallet-emerald">Compliant</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Export Tools */}
              <div className="glass-card p-6 hover:shadow-xl transition-all duration-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-wallet-dark to-wallet-emerald rounded-xl flex items-center justify-center">
                    <Download className="h-5 w-5 text-wallet-white" />
                  </div>
                  <h3 className="font-semibold text-wallet-emerald text-left">Export Tools</h3>
                </div>
                <p className="text-wallet-gray-400 text-sm mb-4 text-left">
                  Export your data in various formats
                </p>
                <div className="space-y-2">
                  <button className="w-full text-left p-2 rounded-lg hover:bg-wallet-emerald/10 text-sm text-wallet-gray-400 hover:text-wallet-emerald transition-colors">
                    CSV Export
                  </button>
                  <button className="w-full text-left p-2 rounded-lg hover:bg-wallet-emerald/10 text-sm text-wallet-gray-400 hover:text-wallet-emerald transition-colors">
                    PDF Report
                  </button>
                  <button className="w-full text-left p-2 rounded-lg hover:bg-wallet-emerald/10 text-sm text-wallet-gray-400 hover:text-wallet-emerald transition-colors">
                    JSON Data
                  </button>
                  <button className="w-full text-left p-2 rounded-lg hover:bg-wallet-emerald/10 text-sm text-wallet-gray-400 hover:text-wallet-emerald transition-colors">
                    TurboTax Import
                  </button>
                </div>
              </div>

              {/* Tax Calendar */}
              <div className="glass-card p-6 hover:shadow-xl transition-all duration-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-wallet-white" />
                  </div>
                  <h3 className="font-semibold text-wallet-emerald text-left">Tax Calendar</h3>
                </div>
                <p className="text-wallet-gray-400 text-sm mb-4 text-left">
                  Important tax deadlines and reminders
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                    <div>
                      <div className="text-sm font-medium text-orange-500">Tax Filing Deadline</div>
                      <div className="text-xs text-wallet-gray-400">April 15, 2025</div>
                    </div>
                    <div className="text-sm text-orange-500 font-semibold">45 days</div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-wallet-emerald/10 rounded-lg border border-wallet-emerald/20">
                    <div>
                      <div className="text-sm font-medium text-wallet-emerald">Q4 Estimated Tax</div>
                      <div className="text-xs text-wallet-gray-400">January 15, 2025</div>
                    </div>
                    <div className="text-sm text-wallet-emerald font-semibold">Past Due</div>
                  </div>
                </div>
              </div>

              {/* Tax Resources */}
              <div className="glass-card p-6 hover:shadow-xl transition-all duration-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-wallet-emerald to-wallet-dark rounded-xl flex items-center justify-center">
                    <FileText className="h-5 w-5 text-wallet-white" />
                  </div>
                  <h3 className="font-semibold text-wallet-emerald text-left">Tax Resources</h3>
                </div>
                <p className="text-wallet-gray-400 text-sm mb-4 text-left">
                  Helpful resources and guides
                </p>
                <div className="space-y-2">
                  <button className="w-full text-left p-2 rounded-lg hover:bg-wallet-emerald/10 text-sm text-wallet-gray-400 hover:text-wallet-emerald transition-colors">
                    Crypto Tax Guide
                  </button>
                  <button className="w-full text-left p-2 rounded-lg hover:bg-wallet-emerald/10 text-sm text-wallet-gray-400 hover:text-wallet-emerald transition-colors">
                    IRS Guidelines
                  </button>
                  <button className="w-full text-left p-2 rounded-lg hover:bg-wallet-emerald/10 text-sm text-wallet-gray-400 hover:text-wallet-emerald transition-colors">
                    FAQ
                  </button>
                  <button className="w-full text-left p-2 rounded-lg hover:bg-wallet-emerald/10 text-sm text-wallet-gray-400 hover:text-wallet-emerald transition-colors">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </WalletLayout>
  );
};

export default Tax; 