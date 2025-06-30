// src/components/features/AgentCard.tsx
import React from 'react';
import { Phone, MessageCircle, Clock, TrendingUp } from 'lucide-react';
import { AIAgent, useAgentMetrics } from '../../services/agentAPI';

interface AgentCardProps {
  agent: AIAgent;
  onClick?: () => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onClick }) => {
  const { data: metrics } = useAgentMetrics(agent.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'inactive': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getAgentTypeIcon = (type: string) => {
    switch (type) {
      case 'manager': return <Phone className="w-5 h-5" />;
      case 'coordinator': return <TrendingUp className="w-5 h-5" />;
      case 'basic': return <MessageCircle className="w-5 h-5" />;
      default: return <MessageCircle className="w-5 h-5" />;
    }
  };

  const getAgentTypeColor = (type: string) => {
    switch (type) {
      case 'manager': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'coordinator': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'basic': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {/* Agent Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getAgentTypeColor(agent.agent_type)}`}>
            {getAgentTypeIcon(agent.agent_type)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{agent.agent_name}</h3>
            <p className="text-sm text-gray-600">{agent.agent_role}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`}></div>
          <span className="text-sm text-gray-600 capitalize">{agent.status}</span>
        </div>
      </div>

      {/* Agent Capabilities */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {Object.entries(agent.capabilities).map(([key, value]) => 
            value && (
              <span 
                key={key}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {key.replace('_', ' ')}
              </span>
            )
          )}
        </div>
      </div>

      {/* Performance Metrics */}
      {metrics && (
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Tasks Completed</div>
            <div className="font-semibold text-green-600">{metrics.tasks_completed}</div>
          </div>
          <div>
            <div className="text-gray-600">Communications</div>
            <div className="font-semibold text-blue-600">{metrics.communications_handled}</div>
          </div>
          <div>
            <div className="text-gray-600">Leads Processed</div>
            <div className="font-semibold text-purple-600">{metrics.leads_processed}</div>
          </div>
          <div>
            <div className="text-gray-600">Avg Response</div>
            <div className="font-semibold text-orange-600">{metrics.response_time_avg}</div>
          </div>
        </div>
      )}
    </div>
  );
};