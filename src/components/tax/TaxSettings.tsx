import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Calculator, 
  FileText, 
  DollarSign,
  Calendar,
  AlertTriangle,
  Info,
  Save,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '@/contexts/language';

interface TaxSettings {
  costBasisMethod: 'FIFO' | 'LIFO' | 'SPECIFIC_ID';
  taxYear: number;
  country: string;
  currency: string;
  includeFees: boolean;
  includeStakingRewards: boolean;
  includeAirdrops: boolean;
  washSaleTracking: boolean;
  autoCategorization: boolean;
  taxRate: {
    shortTerm: number;
    longTerm: number;
  };
  reportingCurrency: string;
  fiscalYearStart: string;
}

const TaxSettings: React.FC = () => {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<TaxSettings>({
    costBasisMethod: 'FIFO',
    taxYear: new Date().getFullYear(),
    country: 'US',
    currency: 'USD',
    includeFees: true,
    includeStakingRewards: true,
    includeAirdrops: true,
    washSaleTracking: true,
    autoCategorization: true,
    taxRate: {
      shortTerm: 22,
      longTerm: 15
    },
    reportingCurrency: 'USD',
    fiscalYearStart: '01-01'
  });

  const [isSaving, setIsSaving] = useState(false);

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'UK', name: 'United Kingdom' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'JP', name: 'Japan' },
    { code: 'SG', name: 'Singapore' }
  ];

  const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'SGD', name: 'Singapore Dollar' }
  ];

  const costBasisMethods = [
    {
      value: 'FIFO',
      name: 'FIFO (First In, First Out)',
      description: 'Sell the oldest assets first. Most common method.'
    },
    {
      value: 'LIFO',
      name: 'LIFO (Last In, First Out)',
      description: 'Sell the newest assets first. May reduce taxes in some cases.'
    },
    {
      value: 'SPECIFIC_ID',
      name: 'Specific Identification',
      description: 'Choose which specific lots to sell. Requires detailed tracking.'
    }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    // Show success message
  };

  const handleReset = () => {
    // Reset to default settings
    setSettings({
      costBasisMethod: 'FIFO',
      taxYear: new Date().getFullYear(),
      country: 'US',
      currency: 'USD',
      includeFees: true,
      includeStakingRewards: true,
      includeAirdrops: true,
      washSaleTracking: true,
      autoCategorization: true,
      taxRate: {
        shortTerm: 22,
        longTerm: 15
      },
      reportingCurrency: 'USD',
      fiscalYearStart: '01-01'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-wallet-emerald text-left">Tax Settings</h2>
          <p className="text-wallet-gray-400 text-left">Configure your tax calculation preferences and reporting options</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset} className="btn-secondary">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="btn-primary">
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-wallet-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Settings */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-wallet-emerald to-wallet-dark rounded-xl flex items-center justify-center">
              <Settings className="h-4 w-4 text-wallet-white" />
            </div>
            <h3 className="font-semibold text-wallet-emerald text-left">Basic Settings</h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-left">
                <Label className="text-wallet-emerald font-medium !text-left">Country</Label>
              </div>
              <Select value={settings.country} onValueChange={(value) => setSettings({...settings, country: value})}>
                <SelectTrigger className="bg-wallet-white/10 border-wallet-emerald/20 text-wallet-emerald">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={country.code} value={country.code}>{country.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="text-left">
                <Label className="text-wallet-emerald font-medium !text-left">Tax Year</Label>
              </div>
              <Select value={settings.taxYear.toString()} onValueChange={(value) => setSettings({...settings, taxYear: parseInt(value)})}>
                <SelectTrigger className="bg-wallet-white/10 border-wallet-emerald/20 text-wallet-emerald">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2024, 2023, 2022, 2021, 2020].map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="text-left">
                <Label className="text-wallet-emerald font-medium !text-left">Reporting Currency</Label>
              </div>
              <Select value={settings.reportingCurrency} onValueChange={(value) => setSettings({...settings, reportingCurrency: value})}>
                <SelectTrigger className="bg-wallet-white/10 border-wallet-emerald/20 text-wallet-emerald">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map(currency => (
                    <SelectItem key={currency.code} value={currency.code}>{currency.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="text-left">
                <Label className="text-wallet-emerald font-medium !text-left">Fiscal Year Start</Label>
              </div>
              <Input 
                type="date" 
                value={`${settings.taxYear}-${settings.fiscalYearStart}`}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const day = String(date.getDate()).padStart(2, '0');
                  setSettings({...settings, fiscalYearStart: `${month}-${day}`});
                }}
                className="bg-wallet-white/10 border-wallet-emerald/20 text-wallet-emerald"
              />
            </div>
          </div>
        </div>

        {/* Cost Basis Method */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-wallet-dark to-wallet-emerald rounded-xl flex items-center justify-center">
              <Calculator className="h-4 w-4 text-wallet-white" />
            </div>
            <h3 className="font-semibold text-wallet-emerald text-left">Cost Basis Method</h3>
          </div>

          <div className="space-y-4">
            {costBasisMethods.map((method) => (
              <div key={method.value} className="flex items-start gap-3 p-3 rounded-lg border border-wallet-emerald/20">
                <input
                  type="radio"
                  id={method.value}
                  name="costBasisMethod"
                  value={method.value}
                  checked={settings.costBasisMethod === method.value}
                  onChange={(e) => setSettings({...settings, costBasisMethod: e.target.value as 'FIFO' | 'LIFO' | 'SPECIFIC_ID'})}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="text-left">
                    <Label htmlFor={method.value} className="text-wallet-emerald font-medium cursor-pointer !text-left">
                      {method.name}
                    </Label>
                  </div>
                  <p className="text-sm text-wallet-gray-400 mt-1 text-left">{method.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tax Rates */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-wallet-white" />
            </div>
            <h3 className="font-semibold text-wallet-emerald text-left">Tax Rates</h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-left">
                <Label className="text-wallet-emerald font-medium !text-left">Short-term Capital Gains Rate (%)</Label>
              </div>
              <Input 
                type="number" 
                value={settings.taxRate.shortTerm}
                onChange={(e) => setSettings({
                  ...settings, 
                  taxRate: {...settings.taxRate, shortTerm: parseFloat(e.target.value)}
                })}
                className="bg-wallet-white/10 border-wallet-emerald/20 text-wallet-emerald"
                min="0"
                max="100"
                step="0.1"
              />
            </div>

            <div>
              <div className="text-left">
                <Label className="text-wallet-emerald font-medium !text-left">Long-term Capital Gains Rate (%)</Label>
              </div>
              <Input 
                type="number" 
                value={settings.taxRate.longTerm}
                onChange={(e) => setSettings({
                  ...settings, 
                  taxRate: {...settings.taxRate, longTerm: parseFloat(e.target.value)}
                })}
                className="bg-wallet-white/10 border-wallet-emerald/20 text-wallet-emerald"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
          </div>
        </div>

        {/* Transaction Options */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <FileText className="h-4 w-4 text-wallet-white" />
            </div>
            <h3 className="font-semibold text-wallet-emerald text-left">Transaction Options</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-left">
                  <Label className="text-wallet-emerald font-medium !text-left">Include Transaction Fees</Label>
                </div>
                <p className="text-sm text-wallet-gray-400 text-left">Add fees to cost basis calculations</p>
              </div>
              <Switch 
                checked={settings.includeFees}
                onCheckedChange={(checked) => setSettings({...settings, includeFees: checked})}
              />
            </div>

            <Separator className="bg-wallet-emerald/20" />

            <div className="flex items-center justify-between">
              <div>
                <div className="text-left">
                  <Label className="text-wallet-emerald font-medium !text-left">Include Staking Rewards</Label>
                </div>
                <p className="text-sm text-wallet-gray-400 text-left">Treat staking rewards as income</p>
              </div>
              <Switch 
                checked={settings.includeStakingRewards}
                onCheckedChange={(checked) => setSettings({...settings, includeStakingRewards: checked})}
              />
            </div>

            <Separator className="bg-wallet-emerald/20" />

            <div className="flex items-center justify-between">
              <div>
                <div className="text-left">
                  <Label className="text-wallet-emerald font-medium !text-left">Include Airdrops</Label>
                </div>
                <p className="text-sm text-wallet-gray-400 text-left">Treat airdrops as income</p>
              </div>
              <Switch 
                checked={settings.includeAirdrops}
                onCheckedChange={(checked) => setSettings({...settings, includeAirdrops: checked})}
              />
            </div>

            <Separator className="bg-wallet-emerald/20" />

            <div className="flex items-center justify-between">
              <div>
                <div className="text-left">
                  <Label className="text-wallet-emerald font-medium !text-left">Wash Sale Tracking</Label>
                </div>
                <p className="text-sm text-wallet-gray-400 text-left">Track wash sale losses (US only)</p>
              </div>
              <Switch 
                checked={settings.washSaleTracking}
                onCheckedChange={(checked) => setSettings({...settings, washSaleTracking: checked})}
              />
            </div>

            <Separator className="bg-wallet-emerald/20" />

            <div className="flex items-center justify-between">
              <div>
                <div className="text-left">
                  <Label className="text-wallet-emerald font-medium !text-left">Auto Categorization</Label>
                </div>
                <p className="text-sm text-wallet-gray-400 text-left">Automatically categorize transactions</p>
              </div>
              <Switch 
                checked={settings.autoCategorization}
                onCheckedChange={(checked) => setSettings({...settings, autoCategorization: checked})}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tax Information */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
            <Info className="h-4 w-4 text-wallet-white" />
          </div>
          <h3 className="font-semibold text-wallet-emerald text-left">Tax Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-wallet-emerald mb-3 text-left">Current Settings Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-wallet-gray-400">Country:</span>
                <Badge variant="outline" className="border-wallet-emerald/20 text-wallet-emerald">
                  {countries.find(c => c.code === settings.country)?.name}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-wallet-gray-400">Cost Basis Method:</span>
                <Badge variant="outline" className="border-wallet-emerald/20 text-wallet-emerald">
                  {settings.costBasisMethod}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-wallet-gray-400">Reporting Currency:</span>
                <Badge variant="outline" className="border-wallet-emerald/20 text-wallet-emerald">
                  {settings.reportingCurrency}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-wallet-gray-400">Short-term Rate:</span>
                <span className="text-wallet-emerald">{settings.taxRate.shortTerm}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-wallet-gray-400">Long-term Rate:</span>
                <span className="text-wallet-emerald">{settings.taxRate.longTerm}%</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-wallet-emerald mb-3 text-left">Important Notes</h4>
            <div className="space-y-2 text-sm text-wallet-gray-400">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <p className="text-left">Tax laws vary by country. Consult a tax professional for accurate advice.</p>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <p className="text-left">Cost basis method affects your tax liability. Choose carefully.</p>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <p className="text-left">Keep detailed records of all transactions for tax purposes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxSettings; 