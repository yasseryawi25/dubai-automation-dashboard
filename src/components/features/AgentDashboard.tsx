// src/components/features/AgentDashboard.tsx
import React, { useState } from 'react';
import { Users, Activity, MessageSquare, TrendingUp, Phone } from 'lucide-react';
import { AgentCard } from './AgentCard';
import { useAgents } from '../../services/agentAPI';

export const AgentDashboard: React.FC = () => {
  const { data: agents, isLoading, error } = useAgents();
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading agents: {error}</p>
      </div>
    );
  }

  // Group agents by type
  const managerAgents = agents?.filter(agent => agent.agent_type === 'manager') || [];
  const coordinatorAgents = agents?.filter(agent => agent.agent_type === 'coordinator') || [];
  const basicAgents = agents?.filter(agent => agent.agent_type === 'basic') || [];

  // Calculate summary stats
  const totalAgents = agents?.length || 0;
  const activeAgents = agents?.filter(agent => agent.status === 'active').length || 0;
  const totalTasks = agents?.reduce((sum, agent) => sum + (Math.floor(Math.random() * 50 + 10)), 0) || 0;
  const totalCommunications = agents?.reduce((sum, agent) => sum + (Math.floor(Math.random() * 100 + 20)), 0) || 0;

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">AI Agent Team Dashboard</h1>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Agents</div>
              <div className="text-2xl font-bold text-gray-900">{totalAgents}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Active Agents</div>
              <div className="text-2xl font-bold text-gray-900">{activeAgents}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Tasks Today</div>
              <div className="text-2xl font-bold text-gray-900">{totalTasks}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Communications</div>
              <div className="text-2xl font-bold text-gray-900">{totalCommunications}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Manager Agents */}
      {managerAgents.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Phone className="w-5 h-5 mr-2 text-purple-600" />
            Manager Agents
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {managerAgents.map(agent => (
              <AgentCard 
                key={agent.id} 
                agent={agent} 
                onClick={() => setSelectedAgent(agent.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Coordinator Agents */}
      {coordinatorAgents.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Coordinator Agents
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {coordinatorAgents.map(agent => (
              <AgentCard 
                key={agent.id} 
                agent={agent} 
                onClick={() => setSelectedAgent(agent.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Basic Agents */}
      {basicAgents.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-green-600" />
            Specialist Agents
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {basicAgents.map(agent => (
              <AgentCard 
                key={agent.id} 
                agent={agent} 
                onClick={() => setSelectedAgent(agent.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};