import React from 'react';
import MetricsGrid from './components/MetricsGrid';
import AlertsTable from './components/AlertsTable';
import AgentStatusGrid from './components/AgentStatusGrid';
import SimpleCharts from './components/SimpleCharts';
// Import other components as they're created

const HomePage: React.FC = () => {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Dubai Real Estate AI Dashboard
        </h1>
        <p className="text-neutral-600">
          Monitor your AI agent team performance and business metrics
        </p>
      </div>

      {/* Section 1: Key Metrics */}
      <MetricsGrid />

      {/* Section 2: Charts */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Performance Trends</h2>
        <SimpleCharts />
      </div>

      {/* Section 3: Alerts */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Recent Alerts</h2>
        <AlertsTable />
      </div>

      {/* Section 4: Agent Status */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">AI Agent Status</h2>
        <AgentStatusGrid />
      </div>
    </div>
  );
};

export default HomePage; 