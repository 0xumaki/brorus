import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  type: 'transaction' | 'price' | 'gas' | 'security';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: any;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface PriceAlert {
  id: string;
  tokenSymbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  enabled: boolean;
  lastTriggered?: Date;
}

export interface GasAlert {
  id: string;
  network: string;
  threshold: number; // in gwei
  enabled: boolean;
  lastTriggered?: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  priceAlerts: PriceAlert[];
  gasAlerts: GasAlert[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
  addPriceAlert: (alert: Omit<PriceAlert, 'id'>) => void;
  removePriceAlert: (id: string) => void;
  addGasAlert: (alert: Omit<GasAlert, 'id'>) => void;
  removeGasAlert: (id: string) => void;
  unreadCount: number;
  isMonitoring: boolean;
  startMonitoring: () => void;
  stopMonitoring: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  const [gasAlerts, setGasAlerts] = useState<GasAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [monitoringInterval, setMonitoringInterval] = useState<NodeJS.Timeout | null>(null);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Add notification
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show toast for transaction notifications and high priority notifications
    if (notification.type === 'transaction' || notification.priority === 'high' || notification.priority === 'critical') {
      toast({
        title: notification.title,
        description: notification.message,
        variant: notification.priority === 'critical' ? 'destructive' : 
                notification.type === 'transaction' ? 'default' : 'default',
      });
    }

    // Store in localStorage
    const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    storedNotifications.unshift(newNotification);
    localStorage.setItem('notifications', JSON.stringify(storedNotifications.slice(0, 100))); // Keep last 100
  };

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );

    // Update localStorage
    const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const updatedNotifications = storedNotifications.map((n: Notification) => 
      n.id === id ? { ...n, read: true } : n
    );
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  // Clear notification
  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));

    // Update localStorage
    const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const filteredNotifications = storedNotifications.filter((n: Notification) => n.id !== id);
    localStorage.setItem('notifications', JSON.stringify(filteredNotifications));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('notifications');
  };

  // Price alert functions
  const addPriceAlert = (alert: Omit<PriceAlert, 'id'>) => {
    const newAlert: PriceAlert = {
      ...alert,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };

    setPriceAlerts(prev => [...prev, newAlert]);
    
    // Store in localStorage
    const storedAlerts = JSON.parse(localStorage.getItem('priceAlerts') || '[]');
    storedAlerts.push(newAlert);
    localStorage.setItem('priceAlerts', JSON.stringify(storedAlerts));
  };

  const removePriceAlert = (id: string) => {
    setPriceAlerts(prev => prev.filter(alert => alert.id !== id));
    
    // Update localStorage
    const storedAlerts = JSON.parse(localStorage.getItem('priceAlerts') || '[]');
    const filteredAlerts = storedAlerts.filter((alert: PriceAlert) => alert.id !== id);
    localStorage.setItem('priceAlerts', JSON.stringify(filteredAlerts));
  };

  // Gas alert functions
  const addGasAlert = (alert: Omit<GasAlert, 'id'>) => {
    const newAlert: GasAlert = {
      ...alert,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };

    setGasAlerts(prev => [...prev, newAlert]);
    
    // Store in localStorage
    const storedAlerts = JSON.parse(localStorage.getItem('gasAlerts') || '[]');
    storedAlerts.push(newAlert);
    localStorage.setItem('gasAlerts', JSON.stringify(storedAlerts));
  };

  const removeGasAlert = (id: string) => {
    setGasAlerts(prev => prev.filter(alert => alert.id !== id));
    
    // Update localStorage
    const storedAlerts = JSON.parse(localStorage.getItem('gasAlerts') || '[]');
    const filteredAlerts = storedAlerts.filter((alert: GasAlert) => alert.id !== id);
    localStorage.setItem('gasAlerts', JSON.stringify(filteredAlerts));
  };

  // Start monitoring
  const startMonitoring = () => {
    if (isMonitoring) return;
    
    setIsMonitoring(true);
    const interval = setInterval(() => {
      checkPriceAlerts();
      checkGasAlerts();
    }, 30000); // Check every 30 seconds
    
    setMonitoringInterval(interval);
  };

  // Stop monitoring
  const stopMonitoring = () => {
    if (monitoringInterval) {
      clearInterval(monitoringInterval);
      setMonitoringInterval(null);
    }
    setIsMonitoring(false);
  };

  // Check price alerts
  const checkPriceAlerts = async () => {
    for (const alert of priceAlerts) {
      if (!alert.enabled) continue;
      
      try {
        // Fetch current price (using CoinGecko API)
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${alert.tokenSymbol.toLowerCase()}&vs_currencies=usd`
        );
        const data = await response.json();
        const currentPrice = data[alert.tokenSymbol.toLowerCase()]?.usd;
        
        if (currentPrice) {
          const shouldTrigger = 
            (alert.condition === 'above' && currentPrice >= alert.targetPrice) ||
            (alert.condition === 'below' && currentPrice <= alert.targetPrice);
          
          if (shouldTrigger) {
            addNotification({
              type: 'price',
              title: 'Price Alert',
              message: `${alert.tokenSymbol} is now ${alert.condition} $${alert.targetPrice} (Current: $${currentPrice})`,
              priority: 'medium',
              data: { tokenSymbol: alert.tokenSymbol, currentPrice, targetPrice: alert.targetPrice }
            });
            
            // Update last triggered
            setPriceAlerts(prev => 
              prev.map(a => a.id === alert.id ? { ...a, lastTriggered: new Date() } : a)
            );
          }
        }
      } catch (error) {
        console.error('Error checking price alert:', error);
      }
    }
  };

  // Check gas alerts
  const checkGasAlerts = async () => {
    for (const alert of gasAlerts) {
      if (!alert.enabled) continue;
      
      try {
        // Fetch current gas price (using Etherscan API for Ethereum)
        const response = await fetch(
          `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=YourApiKeyToken`
        );
        const data = await response.json();
        const currentGasPrice = parseInt(data.result?.SafeGasPrice || '0');
        
        if (currentGasPrice > alert.threshold) {
          addNotification({
            type: 'gas',
            title: 'Gas Price Alert',
            message: `Gas price on ${alert.network} is now ${currentGasPrice} gwei (above ${alert.threshold} gwei threshold)`,
            priority: 'medium',
            data: { network: alert.network, currentGasPrice, threshold: alert.threshold }
          });
          
          // Update last triggered
          setGasAlerts(prev => 
            prev.map(a => a.id === alert.id ? { ...a, lastTriggered: new Date() } : a)
          );
        }
      } catch (error) {
        console.error('Error checking gas alert:', error);
      }
    }
  };

  // Load stored data on mount
  useEffect(() => {
    const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const storedPriceAlerts = JSON.parse(localStorage.getItem('priceAlerts') || '[]');
    const storedGasAlerts = JSON.parse(localStorage.getItem('gasAlerts') || '[]');
    
    setNotifications(storedNotifications);
    setPriceAlerts(storedPriceAlerts);
    setGasAlerts(storedGasAlerts);
  }, []);

  // Start monitoring on mount
  useEffect(() => {
    startMonitoring();
    
    return () => {
      stopMonitoring();
    };
  }, []);

  const value: NotificationContextType = {
    notifications,
    priceAlerts,
    gasAlerts,
    addNotification,
    markAsRead,
    clearNotification,
    clearAllNotifications,
    addPriceAlert,
    removePriceAlert,
    addGasAlert,
    removeGasAlert,
    unreadCount,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 