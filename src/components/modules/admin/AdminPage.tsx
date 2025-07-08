import React, { useState } from 'react';
import { Calendar, CheckSquare, FileText, Wifi } from 'lucide-react';
import CalendarView from './components/CalendarView';
import TaskManager from './components/TaskManager';
import TemplateLibrary from './components/TemplateLibrary';
import BackendConnectionTester from '../../common/BackendConnectionTester';

interface AdminPageTab {
  id: 'calendar' | 'tasks' | 'templates' | 'connections';
  name: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

const tabs: AdminPageTab[] = [
  {
    id: 'calendar',
    name: 'Calendar',
    icon: <Calendar className="w-5 h-5" />,
    component: <CalendarView />,
  },
  {
    id: 'tasks',
    name: 'Task Manager',
    icon: <CheckSquare className="w-5 h-5" />,
    component: <TaskManager />,
  },
  {
    id: 'templates',
    name: 'Templates',
    icon: <FileText className="w-5 h-5" />,
    component: <TemplateLibrary />,
  },
  {
    id: 'connections',
    name: 'Backend Connections',
    icon: <Wifi className="w-5 h-5" />,
    component: <BackendConnectionTester />,
  },
];

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminPageTab['id']>('connections');
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

export default AdminPage;