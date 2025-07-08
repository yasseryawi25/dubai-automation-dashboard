import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BarChartData {
  name: string;
  value: number;
  comparison?: number;
}

interface CustomBarChartProps {
  data: BarChartData[];
  title: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  height?: number;
  showComparison?: boolean;
}

const CustomBarChart: React.FC<CustomBarChartProps> = ({ 
  data, 
  title, 
  xAxisLabel, 
  yAxisLabel, 
  height = 300,
  showComparison = false 
}) => {
  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            label={{ value: xAxisLabel, position: 'insideBottom', offset: -10 }}
          />
          <YAxis 
            tickFormatter={formatValue}
            label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value: number) => [formatValue(value), 'Value']}
            labelStyle={{ color: '#374151' }}
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #d1d5db' }}
          />
          <Legend />
          <Bar dataKey="value" fill="#d4af37" name="Current Period" />
          {showComparison && (
            <Bar dataKey="comparison" fill="#10b981" name="Previous Period" />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart; 