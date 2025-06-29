
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from "recharts";
import { Transaction } from "@/lib/mockData";
import { calculateBalanceHistory } from "@/lib/utils";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/language";

interface BalanceChartProps {
  transactions: Transaction[];
}

// Define proper types for the CustomTooltip component
interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value: number;
    name?: string;
    color?: string;
  }>;
  label?: string;
}

const BalanceChart: React.FC<BalanceChartProps> = ({ transactions }) => {
  const { t, formatCurrency } = useLanguage();
  const balanceHistory = calculateBalanceHistory(transactions);
  
  // Format data for Recharts
  const chartData = balanceHistory.map(item => ({
    date: format(item.date, "MMM d"),
    balance: item.balance
  }));

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-2 text-sm">
          <p className="text-white">{label}</p>
          <p className="text-crystal-primary font-medium">
            {formatCurrency(payload[0].value, 'USD')}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4">{t("tx.balanceHistory")}</h2>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: "#8E9196" }} 
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }} 
            />
            <YAxis 
              tick={{ fill: "#8E9196" }} 
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickFormatter={(value) => formatCurrency(value, 'USD').split('.')[0]} // Shortened currency without decimal
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="balance" 
              stroke="#9b87f5" 
              strokeWidth={2}
              dot={{ stroke: "#9b87f5", fill: "#1A1F2C", r: 4 }}
              activeDot={{ stroke: "#9b87f5", fill: "#9b87f5", r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BalanceChart;
