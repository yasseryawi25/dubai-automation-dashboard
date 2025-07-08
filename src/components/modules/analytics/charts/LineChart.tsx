import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LineChartData {
  name: string;
  value: number;
  trend?: number;
  forecast?: number;
}

interface CustomLineChartProps {
  data: LineChartData[];
  title: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  height?: number;
  showTrend?: boolean;
  showForecast?: boolean;
}

const CustomLineChart: React.FC<CustomLineChartProps> = ({ 
  data, 
  title, 
  xAxisLabel, 
  yAxisLabel, 
  height = 300,
  showTrend = false,
  showForecast = false
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
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#d4af37" 
            strokeWidth={3}
            dot={{ fill: '#d4af37', strokeWidth: 2, r: 4 }}
            name="Actual"
          />
          {showTrend && (
            <Line 
              type="monotone" 
              dataKey="trend" 
              stroke="#10b981" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
              name="Trend"
            />
          )}
          {showForecast && (
            <Line 
              type="monotone" 
              dataKey="forecast" 
              stroke="#3b82f6" 
              strokeWidth={2}
              strokeDasharray="10 5"
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
              name="Forecast"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart; 