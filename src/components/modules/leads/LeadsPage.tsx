import React, { useState } from 'react';
import { Inbox, Library, Settings as SettingsIcon } from 'lucide-react';
import LiveInbox from './components/LiveInbox';
import LeadFunnel from './components/LeadFunnel';
import LeadsSettings from './components/LeadsSettings';

interface LeadsPageTab {
  id: 'inbox' | 'funnel' | 'settings';
  name: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

const tabs: LeadsPageTab[] = [
  {
    id: 'inbox',
    name: 'Live Inbox',
    icon: <Inbox className="w-5 h-5" />,
    component: <LiveInbox />,
  },
  {
    id: 'funnel',
    name: 'Lead Funnel',
    icon: <Library className="w-5 h-5" />,
    component: <LeadFunnel />,
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: <SettingsIcon className="w-5 h-5" />,
    component: <LeadsSettings />,
  },
];

const LeadsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LeadsPageTab['id']>('inbox');
  const currentTab = tabs.find(t => t.id === activeTab) || tabs[0];

  return (
    <div className="p-6">
      <div className="mb-6 flex space-x-2 border-b">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`flex items-center px-4 py-2 font-medium text-sm border-b-2 transition focus:outline-none ${
              activeTab === tab.id
                ? 'border-primary-gold text-primary-gold bg-neutral-50'
                : 'border-transparent text-neutral-500 hover:text-primary-gold'
            }`}
            onClick={() => setActiveTab(tab.id)}
            aria-selected={activeTab === tab.id}
            aria-controls={`tab-panel-${tab.id}`}
            role="tab"
          >
            {tab.icon}
            <span className="ml-2">{tab.name}</span>
          </button>
        ))}
      </div>
      <div id={`tab-panel-${currentTab.id}`} role="tabpanel">
        {currentTab.component}
      </div>
    </div>
  );
};

export default LeadsPage; 