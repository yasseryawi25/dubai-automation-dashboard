import React from 'react';
import { Bot, Activity } from 'lucide-react';
import type { AIAgent } from '../../types/agents';

interface AgentCardProps {
  agent: AIAgent;
  onClick: (agent: AIAgent) => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onClick }) => {
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

  const getTypeName = (type: string) => {
    switch (type) {
      case 'manager': return 'Manager Agent';
      case 'coordinator': return 'Coordinator Agent';
      case 'basic': return 'Specialist Agent';
      default: return 'Agent';
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
      onClick={() => onClick(agent)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{agent.avatar}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(agent.type)}`}>
              {getTypeName(agent.type)}
            </span>
          </div>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
          <Activity className="h-3 w-3 mr-1" />
          {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
        </span>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm text-gray-600 font-medium">{agent.specialty}</p>
        <p className="text-sm text-gray-500">{agent.lastActivity}</p>
        
        <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-100">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">{agent.tasksCompleted}</div>
            <div className="text-xs text-gray-500">Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">{agent.successRate}%</div>
            <div className="text-xs text-gray-500">Success</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;