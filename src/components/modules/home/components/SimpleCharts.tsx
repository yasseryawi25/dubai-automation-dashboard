import React from 'react';

const leadsTrend = [32, 40, 28, 55, 47, 60, 52, 44, 38, 50, 41, 36, 48, 53, 45, 39, 42, 56, 49, 51, 37, 43, 54, 46, 58, 59, 60, 57, 55, 52];
const conversionRates = [0.18, 0.21, 0.19, 0.22, 0.23, 0.20, 0.25];
const agentPerformance = [
  { name: 'Sarah', percent: 0.96 },
  { name: 'Omar', percent: 0.87 },
  { name: 'Alex', percent: 0.91 },
  { name: 'Maya', percent: 0.89 },
  { name: 'Layla', percent: 0.93 },
  { name: 'Ahmed', percent: 0.88 },
];

const SimpleCharts: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Leads Trend */}
    <div className="bg-neutral-50 rounded-lg p-4">
      <h3 className="text-md font-semibold mb-2">Leads Trend (30 days)</h3>
      <div className="flex items-end h-24 space-x-0.5">
        {leadsTrend.map((val, i) => (
          <div
            key={i}
            className="bg-primary-gold rounded-t"
            style={{ height: `${val * 1.5}px`, width: '4px' }}
            title={`Day ${i + 1}: ${val} leads`}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-neutral-400 mt-2">
        <span>Day 1</span>
        <span>Day 30</span>
      </div>
    </div>
    {/* Conversion Rate */}
    <div className="bg-neutral-50 rounded-lg p-4">
      <h3 className="text-md font-semibold mb-2">Conversion Rate</h3>
      <div className="space-y-2">
        {conversionRates.map((rate, i) => (
          <div key={i} className="flex items-center">
            <span className="w-16 text-xs text-neutral-500">Week {i + 1}</span>
            <div className="flex-1 h-3 bg-neutral-200 rounded mx-2">
              <div
                className="h-3 rounded bg-success"
                style={{ width: `${rate * 100}%` }}
                title={`${Math.round(rate * 100)}%`}
              />
            </div>
            <span className="text-xs font-bold text-success">{Math.round(rate * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
    {/* Agent Performance */}
    <div className="bg-neutral-50 rounded-lg p-4">
      <h3 className="text-md font-semibold mb-2">Agent Performance</h3>
      <div className="space-y-2">
        {agentPerformance.map((agent) => (
          <div key={agent.name} className="flex items-center">
            <span className="w-20 text-xs text-neutral-500">{agent.name}</span>
            <div className="flex-1 h-3 bg-neutral-200 rounded mx-2">
              <div
                className="h-3 rounded bg-primary-gold"
                style={{ width: `${agent.percent * 100}%` }}
                title={`${Math.round(agent.percent * 100)}%`}
              />
            </div>
            <span className="text-xs font-bold text-primary-gold">{Math.round(agent.percent * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SimpleCharts; 