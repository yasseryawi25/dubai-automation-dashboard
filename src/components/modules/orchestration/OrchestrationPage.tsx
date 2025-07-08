import React, { useState } from 'react';
import WorkflowBuilder from './components/WorkflowBuilder';
import WorkflowList from './components/WorkflowList';
import ExecutionLogs from './components/ExecutionLogs';
import AgentNodes from './components/AgentNodes';
import WorkflowTemplates from './components/WorkflowTemplates';
import { useWorkflows } from './hooks/useWorkflows';
import { useWorkflowExecution } from './hooks/useWorkflowExecution';
import { useAgentOrchestration } from './hooks/useAgentOrchestration';
import { Zap, List, FileText, Users, BookOpen } from 'lucide-react';

const tabs = [
  { id: 'builder', name: 'Workflow Builder', icon: <Zap className="w-5 h-5" /> },
  { id: 'workflows', name: 'My Workflows', icon: <List className="w-5 h-5" /> },
  { id: 'logs', name: 'Execution Logs', icon: <FileText className="w-5 h-5" /> },
  { id: 'agents', name: 'Agent Nodes', icon: <Users className="w-5 h-5" /> },
  { id: 'templates', name: 'Templates', icon: <BookOpen className="w-5 h-5" /> },
];

const OrchestrationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const workflows = useWorkflows();
  const executions = useWorkflowExecution();
  const agents = useAgentOrchestration();

  // Dashboard overview (demo)
  const overview = {
    workflows: workflows.workflows.length,
    templates: workflows.getAnalytics().templates,
    executions: executions.executions.length,
    agents: agents.orchestrations.length,
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 mt-2">Orchestration & Automation</h1>
      {/* Dashboard Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-xs text-gray-500 mb-1">Workflows</div>
          <div className="text-2xl font-bold text-primary-gold">{overview.workflows}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-xs text-gray-500 mb-1">Templates</div>
          <div className="text-2xl font-bold text-primary-gold">{overview.templates}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-xs text-gray-500 mb-1">Executions</div>
          <div className="text-2xl font-bold text-primary-gold">{overview.executions}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-xs text-gray-500 mb-1">Agent Orchestrations</div>
          <div className="text-2xl font-bold text-primary-gold">{overview.agents}</div>
        </div>
      </div>
      {/* Tabs */}
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
        {activeTab === 'builder' && <WorkflowBuilder />}
        {activeTab === 'workflows' && <WorkflowList />}
        {activeTab === 'logs' && <ExecutionLogs />}
        {activeTab === 'agents' && <AgentNodes />}
        {activeTab === 'templates' && <WorkflowTemplates />}
      </div>
    </div>
  );
};

export default OrchestrationPage; 