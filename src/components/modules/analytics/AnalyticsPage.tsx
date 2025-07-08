import React, { useState } from 'react';
import ModuleLayout from '../../layout/ModuleLayout';
import { Database, TrendingUp, Users, FileText } from 'lucide-react';
import DataSourcesPanel from './components/DataSourcesPanel';
import ROIDashboard from './components/ROIDashboard';
import MarketInsights from './components/MarketInsights';
import ClientDatabase from './components/ClientDatabase';
import ReportsGenerator from './components/ReportsGenerator';

const tabs = [
  {
    id: 'data_sources',
    name: 'Data Sources',
    icon: <Database className="w-5 h-5" />,
    component: <DataSourcesPanel />,
  },
  {
    id: 'roi_dashboard',
    name: 'ROI Dashboard',
    icon: <TrendingUp className="w-5 h-5" />,
    component: <ROIDashboard />,
  },
  {
    id: 'market_insights',
    name: 'Market Insights',
    icon: <Users className="w-5 h-5" />,
    component: <MarketInsights />,
  },
  {
    id: 'client_database',
    name: 'Client Database',
    icon: <Database className="w-5 h-5" />,
    component: <ClientDatabase />,
  },
  {
    id: 'reports',
    name: 'Reports',
    icon: <FileText className="w-5 h-5" />,
    component: <ReportsGenerator />,
  },
];

const AnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <ModuleLayout module="Analytics" sidebarItems={[]}> {/* Sidebar handled by parent layout */}
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 mt-2">Analytics</h1>
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center gap-2 px-4 py-2 text-sm md:text-base font-medium rounded-t-md transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2
                ${activeTab === tab.id
                  ? 'bg-white dark:bg-zinc-900 text-gold-600 border-b-2 border-gold-500 shadow-sm'
                  : 'text-gray-500 dark:text-gray-300 hover:text-gold-600 hover:bg-gray-50 dark:hover:bg-zinc-800'}
              `}
              style={{ borderColor: activeTab === tab.id ? '#FFD700' : 'transparent' }}
              onClick={() => setActiveTab(tab.id)}
              aria-selected={activeTab === tab.id}
              aria-controls={`tab-panel-${tab.id}`}
              tabIndex={0}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
        <div
          className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4 min-h-[200px] transition-all duration-200"
          id={`tab-panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={activeTab}
        >
          {tabs.find((tab) => tab.id === activeTab)?.component}
        </div>
      </div>
    </ModuleLayout>
  );
};

export default AnalyticsPage; 