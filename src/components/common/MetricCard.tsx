import React from 'react';
import type { Metric } from '../../types';

const statusColors = {
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
  neutral: 'text-neutral-500',
};

const MetricCard: React.FC<{ metric: Metric }> = ({ metric }) => (
  <div className="bg-white rounded-lg shadow p-4 flex items-center space-x-4">
    {metric.icon && <span className={`text-2xl ${statusColors[metric.status]}`}>{metric.icon}</span>}
    <div>
      <div className="text-sm text-neutral-500">{metric.label}</div>
      <div className="text-xl font-bold">{metric.value}</div>
      {metric.trend && (
        <div className="text-xs mt-1">
          {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
        </div>
      )}
    </div>
  </div>
);

export default MetricCard; 