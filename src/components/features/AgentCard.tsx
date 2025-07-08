import React from 'react';
import { Bot, Activity, Database, Wifi } from 'lucide-react';
import { useDashboardMetrics } from '../../hooks';
import type { AIAgent } from '../../types/agents';

interface AgentCardProps {
  agent: AIAgent;
  onClick: (agent: AIAgent) => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onClick }) => {
  const { metrics } = useDashboardMetrics();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'idle': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'manager': return 'bg-purple-100 text-purple-800';
      case 'coordinator': return 'bg-blue-100 text-blue-800';
      case 'basic': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeName = (type: string, agentName?: string) => {
    // Special handling for Sarah as the AI Team Manager
    if (agentName?.includes('Sarah') && type === 'manager') {
      return 'AI Team Manager';
    }
    switch (type) {
      case 'manager': return 'Manager Agent';
      case 'coordinator': return 'Coordinator Agent';
      case 'basic': return 'Specialist Agent';
      default: return 'Agent';
    }
  };

  // Get agent-specific data from real-time metrics
  const getAgentData = (agent: AIAgent) => {
    if (agent.name.includes('Omar')) {
      return {
        tasksCompleted: metrics.totalLeads,
        indicator: 'Live Lead Processing',
        dataSource: 'Supabase Leads'
      };
    } else if (agent.name.includes('Sarah') && agent.type === 'manager') {
      // Special handling for Sarah as AI Team Manager
      return {
        tasksCompleted: agent.tasksCompleted,
        indicator: 'AI Team Management',
        dataSource: 'Strategic Analytics'
      };
    } else if (agent.type === 'manager') {
      return {
        tasksCompleted: agent.tasksCompleted,
        indicator: 'Voice Calls Ready',
        dataSource: 'VAPI Integration'
      };
    } else if (agent.type === 'coordinator') {
      return {
        tasksCompleted: agent.tasksCompleted,
        indicator: `${metrics.activeWorkflows} Workflows`,
        dataSource: 'Automation Engine'
      };
    } else {
      return {
        tasksCompleted: agent.tasksCompleted,
        indicator: 'Processing Queue',
        dataSource: 'Real-time Data'
      };
    }
  };

  const agentData = getAgentData(agent);
  
  // Special styling for Sarah as AI Team Manager
  const isSarahManager = agent.name.includes('Sarah') && agent.type === 'manager';
  const cardClasses = isSarahManager 
    ? "bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 cursor-pointer border-2 border-purple-200 hover:border-purple-400 group transform hover:scale-[1.02]"
    : "bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200 hover:border-blue-300 group";

  return (
    <div 
      className={cardClasses}
      onClick={() => onClick(agent)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl group-hover:scale-110 transition-transform duration-200">
            {agent.avatar}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">
              {agent.name}
            </h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(agent.type)} ${isSarahManager ? 'font-bold' : ''}`}>
              {isSarahManager && '👑 '}{getTypeName(agent.type, agent.name)}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-1">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
            <Activity className="h-3 w-3 mr-1" />
            {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
          </span>
          {agent.name.includes('Omar') && (
            <div className="flex items-center text-xs text-green-600">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></div>
              <span>Live Data</span>
            </div>
          )}
          {isSarahManager && (
            <div className="flex items-center text-xs text-purple-600">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1 animate-pulse"></div>
              <span>Team Leader</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm text-gray-600 font-medium">{agent.specialty}</p>
        <p className="text-sm text-gray-500">{agent.lastActivity}</p>
        
        {/* Real-time indicator */}
        <div className={`flex items-center space-x-2 text-xs rounded-lg px-2 py-1 ${
          isSarahManager 
            ? 'text-purple-700 bg-purple-100' 
            : 'text-blue-600 bg-blue-50'
        }`}>
          <Database className="h-3 w-3" />
          <span>{agentData.indicator}</span>
        </div>
        
        <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-100">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {agentData.tasksCompleted}
              {agent.name.includes('Omar') && (
                <span className="text-xs text-green-600 ml-1">●</span>
              )}
            </div>
            <div className="text-xs text-gray-500">Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">{agent.successRate}%</div>
            <div className="text-xs text-gray-500">Success</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center">
              <Wifi className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-xs text-gray-500">Connected</div>
          </div>
        </div>
      </div>

      {/* Data source indicator */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{agentData.dataSource}</span>
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span>Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;