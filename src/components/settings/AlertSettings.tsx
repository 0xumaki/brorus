import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Bell, Zap, TrendingUp } from 'lucide-react';
import { useNotifications, PriceAlert, GasAlert } from '@/contexts/NotificationContext';
import { useLanguage } from '@/contexts/language';

const AlertSettings: React.FC = () => {
  const { t } = useLanguage();
  const { 
    priceAlerts, 
    gasAlerts, 
    addPriceAlert, 
    removePriceAlert, 
    addGasAlert, 
    removeGasAlert 
  } = useNotifications();

  const [newPriceAlert, setNewPriceAlert] = useState({
    tokenSymbol: '',
    targetPrice: '',
    condition: 'above' as 'above' | 'below',
  });

  const [newGasAlert, setNewGasAlert] = useState({
    network: 'ethereum',
    threshold: '',
  });

  const popularTokens = [
    { symbol: 'bitcoin', name: 'Bitcoin' },
    { symbol: 'ethereum', name: 'Ethereum' },
    { symbol: 'tether', name: 'Tether' },
    { symbol: 'usd-coin', name: 'USD Coin' },
    { symbol: 'binancecoin', name: 'BNB' },
    { symbol: 'cardano', name: 'Cardano' },
    { symbol: 'solana', name: 'Solana' },
    { symbol: 'polkadot', name: 'Polkadot' },
  ];

  const networks = [
    { id: 'ethereum', name: 'Ethereum' },
    { id: 'polygon', name: 'Polygon' },
    { id: 'avalanche', name: 'Avalanche' },
    { id: 'bsc', name: 'BNB Smart Chain' },
  ];

  const handleAddPriceAlert = () => {
    if (!newPriceAlert.tokenSymbol || !newPriceAlert.targetPrice) return;

    addPriceAlert({
      tokenSymbol: newPriceAlert.tokenSymbol,
      targetPrice: parseFloat(newPriceAlert.targetPrice),
      condition: newPriceAlert.condition,
      enabled: true,
    });

    setNewPriceAlert({
      tokenSymbol: '',
      targetPrice: '',
      condition: 'above',
    });
  };

  const handleAddGasAlert = () => {
    if (!newGasAlert.threshold) return;

    addGasAlert({
      network: newGasAlert.network,
      threshold: parseInt(newGasAlert.threshold),
      enabled: true,
    });

    setNewGasAlert({
      network: 'ethereum',
      threshold: '',
    });
  };

  const formatLastTriggered = (date?: Date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Price Alerts Section */}
      <Card className="p-6 border-white/10 bg-black/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Price Alerts</h3>
            <p className="text-sm text-gray-400">Get notified when token prices reach your targets</p>
          </div>
        </div>

        {/* Add New Price Alert */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Price Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="border-white/10 bg-black/20">
            <DialogHeader>
              <DialogTitle className="text-white">Add Price Alert</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="token" className="text-white">Token</Label>
                <Select 
                  value={newPriceAlert.tokenSymbol} 
                  onValueChange={(value) => setNewPriceAlert(prev => ({ ...prev, tokenSymbol: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a token" />
                  </SelectTrigger>
                  <SelectContent>
                    {popularTokens.map((token) => (
                      <SelectItem key={token.symbol} value={token.symbol}>
                        {token.name} ({token.symbol.toUpperCase()})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="condition" className="text-white">Condition</Label>
                <Select 
                  value={newPriceAlert.condition} 
                  onValueChange={(value: 'above' | 'below') => setNewPriceAlert(prev => ({ ...prev, condition: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">Above</SelectItem>
                    <SelectItem value="below">Below</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="price" className="text-white">Target Price (USD)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={newPriceAlert.targetPrice}
                  onChange={(e) => setNewPriceAlert(prev => ({ ...prev, targetPrice: e.target.value }))}
                  placeholder="0.00"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              
              <Button onClick={handleAddPriceAlert} className="w-full">
                Add Alert
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Existing Price Alerts */}
        <div className="mt-6 space-y-3">
          {priceAlerts.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No price alerts set</p>
            </div>
          ) : (
            priceAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{alert.tokenSymbol.toUpperCase()}</span>
                    <Badge variant={alert.condition === 'above' ? 'default' : 'secondary'}>
                      {alert.condition} ${alert.targetPrice}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    Last triggered: {formatLastTriggered(alert.lastTriggered)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={alert.enabled} />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePriceAlert(alert.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Gas Alerts Section */}
      <Card className="p-6 border-white/10 bg-black/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Gas Price Alerts</h3>
            <p className="text-sm text-gray-400">Get notified when gas prices are high</p>
          </div>
        </div>

        {/* Add New Gas Alert */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Gas Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="border-white/10 bg-black/20">
            <DialogHeader>
              <DialogTitle className="text-white">Add Gas Alert</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="network" className="text-white">Network</Label>
                <Select 
                  value={newGasAlert.network} 
                  onValueChange={(value) => setNewGasAlert(prev => ({ ...prev, network: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {networks.map((network) => (
                      <SelectItem key={network.id} value={network.id}>
                        {network.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="threshold" className="text-white">Threshold (Gwei)</Label>
                <Input
                  id="threshold"
                  type="number"
                  value={newGasAlert.threshold}
                  onChange={(e) => setNewGasAlert(prev => ({ ...prev, threshold: e.target.value }))}
                  placeholder="50"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              
              <Button onClick={handleAddGasAlert} className="w-full">
                Add Alert
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Existing Gas Alerts */}
        <div className="mt-6 space-y-3">
          {gasAlerts.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No gas alerts set</p>
            </div>
          ) : (
            gasAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{alert.network}</span>
                    <Badge variant="outline">
                      Above {alert.threshold} gwei
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    Last triggered: {formatLastTriggered(alert.lastTriggered)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={alert.enabled} />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeGasAlert(alert.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default AlertSettings; 