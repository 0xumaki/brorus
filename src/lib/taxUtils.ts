export interface TaxLot {
  id: string;
  asset: string;
  amount: number;
  costBasis: number;
  acquisitionDate: Date;
  remainingAmount: number;
}

export interface CapitalGain {
  asset: string;
  amount: number;
  proceeds: number;
  costBasis: number;
  gain: number;
  isLongTerm: boolean;
  date: Date;
  txHash: string;
}

export interface TaxSummary {
  year?: number;
  totalGains: number;
  totalLosses: number;
  netGain: number;
  shortTermGains: number;
  longTermGains: number;
  shortTermLosses: number;
  longTermLosses: number;
  totalFees: number;
  transactionCount: number;
  assets: string[];
  capitalGains: CapitalGain[];
}

// FIFO (First In, First Out) method for cost basis calculation
export const calculateFIFOCostBasis = (
  lots: TaxLot[],
  sellAmount: number,
  sellDate: Date
): { costBasis: number; usedLots: TaxLot[] } => {
  let remainingAmount = sellAmount;
  let totalCostBasis = 0;
  const usedLots: TaxLot[] = [];

  // Sort lots by acquisition date (oldest first)
  const sortedLots = [...lots].sort((a, b) => a.acquisitionDate.getTime() - b.acquisitionDate.getTime());

  for (const lot of sortedLots) {
    if (remainingAmount <= 0) break;

    const availableAmount = Math.min(lot.remainingAmount, remainingAmount);
    const costBasisRatio = availableAmount / lot.amount;
    const costBasis = lot.costBasis * costBasisRatio;

    totalCostBasis += costBasis;
    remainingAmount -= availableAmount;

    usedLots.push({
      ...lot,
      remainingAmount: availableAmount,
      costBasis: costBasis
    });
  }

  return { costBasis: totalCostBasis, usedLots };
};

// LIFO (Last In, First Out) method for cost basis calculation
export const calculateLIFOCostBasis = (
  lots: TaxLot[],
  sellAmount: number,
  sellDate: Date
): { costBasis: number; usedLots: TaxLot[] } => {
  let remainingAmount = sellAmount;
  let totalCostBasis = 0;
  const usedLots: TaxLot[] = [];

  // Sort lots by acquisition date (newest first)
  const sortedLots = [...lots].sort((a, b) => b.acquisitionDate.getTime() - a.acquisitionDate.getTime());

  for (const lot of sortedLots) {
    if (remainingAmount <= 0) break;

    const availableAmount = Math.min(lot.remainingAmount, remainingAmount);
    const costBasisRatio = availableAmount / lot.amount;
    const costBasis = lot.costBasis * costBasisRatio;

    totalCostBasis += costBasis;
    remainingAmount -= availableAmount;

    usedLots.push({
      ...lot,
      remainingAmount: availableAmount,
      costBasis: costBasis
    });
  }

  return { costBasis: totalCostBasis, usedLots };
};

// Specific Identification method (user chooses which lots to sell)
export const calculateSpecificIDCostBasis = (
  selectedLots: TaxLot[],
  sellAmount: number
): { costBasis: number; usedLots: TaxLot[] } => {
  let totalCostBasis = 0;
  const usedLots: TaxLot[] = [];

  for (const lot of selectedLots) {
    const costBasis = lot.costBasis;
    totalCostBasis += costBasis;
    usedLots.push(lot);
  }

  return { costBasis: totalCostBasis, usedLots };
};

// Determine if a gain is long-term (held for more than 1 year)
export const isLongTermGain = (acquisitionDate: Date, sellDate: Date): boolean => {
  const oneYearInMs = 365 * 24 * 60 * 60 * 1000;
  return sellDate.getTime() - acquisitionDate.getTime() >= oneYearInMs;
};

// Calculate capital gains for a series of transactions
export const calculateCapitalGains = (
  transactions: any[],
  method: 'FIFO' | 'LIFO' | 'SPECIFIC_ID' = 'FIFO'
): TaxSummary => {
  const lots: TaxLot[] = [];
  const capitalGains: CapitalGain[] = [];
  let totalFees = 0;

  for (const tx of transactions) {
    totalFees += tx.fee || 0;

    if (tx.type === 'buy') {
      // Add new lot
      lots.push({
        id: tx.id,
        asset: tx.asset,
        amount: tx.amount,
        costBasis: tx.value,
        acquisitionDate: new Date(tx.date),
        remainingAmount: tx.amount
      });
    } else if (tx.type === 'sell') {
      // Calculate capital gain
      const assetLots = lots.filter(lot => lot.asset === tx.asset && lot.remainingAmount > 0);
      
      if (assetLots.length > 0) {
        let costBasisCalculation;
        
        switch (method) {
          case 'FIFO':
            costBasisCalculation = calculateFIFOCostBasis(assetLots, tx.amount, new Date(tx.date));
            break;
          case 'LIFO':
            costBasisCalculation = calculateLIFOCostBasis(assetLots, tx.amount, new Date(tx.date));
            break;
          default:
            costBasisCalculation = calculateFIFOCostBasis(assetLots, tx.amount, new Date(tx.date));
        }

        const gain = tx.value - costBasisCalculation.costBasis;
        const isLongTerm = isLongTermGain(
          costBasisCalculation.usedLots[0]?.acquisitionDate || new Date(tx.date),
          new Date(tx.date)
        );

        capitalGains.push({
          asset: tx.asset,
          amount: tx.amount,
          proceeds: tx.value,
          costBasis: costBasisCalculation.costBasis,
          gain: gain,
          isLongTerm: isLongTerm,
          date: new Date(tx.date),
          txHash: tx.txHash
        });

        // Update remaining amounts in lots
        for (const usedLot of costBasisCalculation.usedLots) {
          const lotIndex = lots.findIndex(lot => lot.id === usedLot.id);
          if (lotIndex !== -1) {
            lots[lotIndex].remainingAmount -= usedLot.remainingAmount;
          }
        }
      }
    }
  }

  // Calculate summary
  const totalGains = capitalGains.filter(g => g.gain > 0).reduce((sum, g) => sum + g.gain, 0);
  const totalLosses = capitalGains.filter(g => g.gain < 0).reduce((sum, g) => sum + Math.abs(g.gain), 0);
  const shortTermGains = capitalGains.filter(g => g.gain > 0 && !g.isLongTerm).reduce((sum, g) => sum + g.gain, 0);
  const longTermGains = capitalGains.filter(g => g.gain > 0 && g.isLongTerm).reduce((sum, g) => sum + g.gain, 0);
  const shortTermLosses = capitalGains.filter(g => g.gain < 0 && !g.isLongTerm).reduce((sum, g) => sum + Math.abs(g.gain), 0);
  const longTermLosses = capitalGains.filter(g => g.gain < 0 && g.isLongTerm).reduce((sum, g) => sum + Math.abs(g.gain), 0);

  return {
    totalGains,
    totalLosses,
    netGain: totalGains - totalLosses,
    shortTermGains,
    longTermGains,
    shortTermLosses,
    longTermLosses,
    totalFees,
    transactionCount: transactions.length,
    assets: [...new Set(transactions.map(tx => tx.asset))],
    capitalGains
  };
};

// Generate CSV report
export const generateCSVReport = (taxSummary: TaxSummary, transactions: any[]): string => {
  const headers = [
    'Date',
    'Type',
    'Asset',
    'Amount',
    'Price',
    'Value',
    'Fee',
    'Category',
    'Description',
    'Transaction Hash'
  ];

  const rows = transactions.map(tx => [
    new Date(tx.date).toLocaleDateString(),
    tx.type,
    tx.asset,
    tx.amount,
    tx.price,
    tx.value,
    tx.fee,
    tx.category,
    tx.description,
    tx.txHash
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  return csvContent;
};

// Generate tax summary for specific year
export const generateYearlyTaxReport = (
  transactions: any[],
  year: number,
  method: 'FIFO' | 'LIFO' | 'SPECIFIC_ID' = 'FIFO'
): TaxSummary => {
  // Include all transactions up to the selected year for proper cost basis calculation
  const relevantTransactions = transactions.filter(tx => {
    const txYear = new Date(tx.date).getFullYear();
    return txYear <= year;
  });

  // Filter capital gains to only include those from the selected year
  const summary = calculateCapitalGains(relevantTransactions, method);
  
  // Filter capital gains to only show those from the selected year
  const yearlyCapitalGains = summary.capitalGains.filter(gain => {
    const gainYear = gain.date.getFullYear();
    return gainYear === year;
  });

  // Recalculate totals based on yearly capital gains only
  const totalGains = yearlyCapitalGains.filter(g => g.gain > 0).reduce((sum, g) => sum + g.gain, 0);
  const totalLosses = yearlyCapitalGains.filter(g => g.gain < 0).reduce((sum, g) => sum + Math.abs(g.gain), 0);
  const shortTermGains = yearlyCapitalGains.filter(g => g.gain > 0 && !g.isLongTerm).reduce((sum, g) => sum + g.gain, 0);
  const longTermGains = yearlyCapitalGains.filter(g => g.gain > 0 && g.isLongTerm).reduce((sum, g) => sum + g.gain, 0);
  const shortTermLosses = yearlyCapitalGains.filter(g => g.gain < 0 && !g.isLongTerm).reduce((sum, g) => sum + Math.abs(g.gain), 0);
  const longTermLosses = yearlyCapitalGains.filter(g => g.gain < 0 && g.isLongTerm).reduce((sum, g) => sum + Math.abs(g.gain), 0);

  // Calculate fees for the selected year only
  const yearlyTransactions = transactions.filter(tx => {
    const txYear = new Date(tx.date).getFullYear();
    return txYear === year;
  });
  const totalFees = yearlyTransactions.reduce((sum, tx) => sum + (tx.fee || 0), 0);

  return {
    year: year,
    totalGains,
    totalLosses,
    netGain: totalGains - totalLosses,
    shortTermGains,
    longTermGains,
    shortTermLosses,
    longTermLosses,
    totalFees,
    transactionCount: yearlyTransactions.length,
    assets: [...new Set(yearlyTransactions.map(tx => tx.asset))],
    capitalGains: yearlyCapitalGains
  };
};

// Calculate wash sale losses (for US tax purposes)
export const calculateWashSales = (transactions: any[]): any[] => {
  const washSales: any[] = [];
  const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;

  for (let i = 0; i < transactions.length; i++) {
    const tx = transactions[i];
    
    if (tx.type === 'sell' && tx.value < tx.costBasis) {
      // Look for repurchase within 30 days
      for (let j = i + 1; j < transactions.length; j++) {
        const repurchaseTx = transactions[j];
        
        if (repurchaseTx.asset === tx.asset && 
            repurchaseTx.type === 'buy' &&
            new Date(repurchaseTx.date).getTime() - new Date(tx.date).getTime() <= thirtyDaysInMs) {
          
          washSales.push({
            lossTransaction: tx,
            repurchaseTransaction: repurchaseTx,
            washSaleAmount: Math.min(tx.costBasis - tx.value, repurchaseTx.value)
          });
        }
      }
    }
  }

  return washSales;
}; 