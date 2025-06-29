import { useNotifications } from '@/contexts/NotificationContext';

// Transaction notification types
export interface TransactionNotification {
  type: 'incoming' | 'outgoing' | 'failed';
  amount: string;
  currency: string;
  txHash: string;
  from?: string;
  to?: string;
  network?: string;
  gasUsed?: string;
  gasPrice?: string;
}

// Security alert types
export interface SecurityAlert {
  type: 'suspicious_address' | 'high_amount' | 'unknown_contract' | 'gas_spike' | 'multiple_failed_tx';
  details: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  txHash?: string;
  address?: string;
  amount?: string;
}

// Add transaction notification
export const addTransactionNotification = (
  addNotification: ReturnType<typeof useNotifications>['addNotification'],
  transaction: TransactionNotification
) => {
  const { type, amount, currency, txHash, from, to, network, gasUsed, gasPrice } = transaction;

  let title = '';
  let message = '';
  let priority: 'low' | 'medium' | 'high' | 'critical' = 'high';

  switch (type) {
    case 'incoming':
      title = 'Incoming Transaction';
      message = `Received ${amount} ${currency} on ${network || 'network'}`;
      priority = 'high';
      break;
    case 'outgoing':
      title = 'Outgoing Transaction';
      message = `Sent ${amount} ${currency} to ${to ? `${to.slice(0, 6)}...${to.slice(-4)}` : 'recipient'}`;
      priority = 'high';
      break;
    case 'failed':
      title = 'Transaction Failed';
      message = `Failed to send ${amount} ${currency}. Gas used: ${gasUsed || 'N/A'}`;
      priority = 'high';
      break;
  }

  addNotification({
    type: 'transaction',
    title,
    message,
    priority,
    data: {
      txHash,
      from,
      to,
      network,
      gasUsed,
      gasPrice,
      amount,
      currency
    }
  });
};

// Add security alert
export const addSecurityAlert = (
  addNotification: ReturnType<typeof useNotifications>['addNotification'],
  alert: SecurityAlert
) => {
  const { type, details, severity, txHash, address, amount } = alert;

  let title = '';
  let message = '';

  switch (type) {
    case 'suspicious_address':
      title = 'Suspicious Address Detected';
      message = `Address ${address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'unknown'} has been flagged as suspicious`;
      break;
    case 'high_amount':
      title = 'High Amount Transaction';
      message = `Large transaction detected: ${amount}. Please verify this is correct.`;
      break;
    case 'unknown_contract':
      title = 'Unknown Contract Interaction';
      message = `Interacting with unknown contract. Please review carefully.`;
      break;
    case 'gas_spike':
      title = 'Gas Price Spike';
      message = `Gas price has increased significantly. Consider waiting or adjusting gas settings.`;
      break;
    case 'multiple_failed_tx':
      title = 'Multiple Failed Transactions';
      message = `Multiple failed transactions detected. Check your network connection and gas settings.`;
      break;
  }

  addNotification({
    type: 'security',
    title,
    message,
    priority: severity,
    data: {
      txHash,
      address,
      amount,
      alertType: type
    }
  });
};

// Check for suspicious activity
export const checkSuspiciousActivity = (
  addNotification: ReturnType<typeof useNotifications>['addNotification'],
  transaction: {
    amount: number;
    currency: string;
    to: string;
    gasPrice?: string;
    network?: string;
  }
) => {
  const { amount, currency, to, gasPrice, network } = transaction;

  // Check for high amount transactions (example threshold: $10,000 USD)
  const highAmountThreshold = 10000;
  if (amount > highAmountThreshold) {
    addSecurityAlert(addNotification, {
      type: 'high_amount',
      details: `Transaction amount ${amount} ${currency} exceeds threshold`,
      severity: 'high',
      amount: `${amount} ${currency}`
    });
  }

  // Check for known suspicious addresses (example)
  const suspiciousAddresses = [
    '0x1234567890123456789012345678901234567890', // Example
    '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'  // Example
  ];
  
  if (suspiciousAddresses.includes(to.toLowerCase())) {
    addSecurityAlert(addNotification, {
      type: 'suspicious_address',
      details: `Recipient address is flagged as suspicious`,
      severity: 'critical',
      address: to
    });
  }

  // Check for gas price spikes (example threshold: 100 gwei)
  if (gasPrice) {
    const gasPriceGwei = parseInt(gasPrice) / 1e9;
    if (gasPriceGwei > 100) {
      addSecurityAlert(addNotification, {
        type: 'gas_spike',
        details: `Gas price ${gasPriceGwei} gwei is unusually high`,
        severity: 'medium',
        amount: `${gasPriceGwei} gwei`
      });
    }
  }
};

// Monitor transaction status
export const monitorTransaction = async (
  txHash: string,
  network: string,
  addNotification: ReturnType<typeof useNotifications>['addNotification']
) => {
  try {
    // Simulate transaction monitoring
    setTimeout(() => {
      // Simulate successful transaction
      addTransactionNotification(addNotification, {
        type: 'incoming',
        amount: '0.1',
        currency: 'ETH',
        txHash,
        network,
        from: '0x1234...5678',
        to: '0xabcd...efgh'
      });
    }, 5000);

    // Simulate failed transaction (random chance)
    if (Math.random() < 0.1) {
      setTimeout(() => {
        addTransactionNotification(addNotification, {
          type: 'failed',
          amount: '0.05',
          currency: 'ETH',
          txHash,
          network,
          gasUsed: '21000',
          gasPrice: '20000000000'
        });
      }, 3000);
    }
  } catch (error) {
    console.error('Error monitoring transaction:', error);
  }
}; 