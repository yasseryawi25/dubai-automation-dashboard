import React, { useState } from 'react';
import { Bot, Users, TrendingUp, MessageSquare } from 'lucide-react';
import AgentCard from './AgentCard';
import type { AIAgent } from '../../types/agents';

interface AgentDashboardProps {
  agents: AIAgent[];
  onAgentSelect: (agent: AIAgent) => void;
}

const AgentDashboard: React.FC<AgentDashboardProps> = ({ agents, onAgentSelect }) => {
  const [filterType, setFilterType] = useState<string>('all');

  // Filter agents based on type
  const filteredAgents = filterType === 'all' 
    ? agents 
    : agents.filter(agent => agent.type === filterType);

  // Group agents by type
  const managerAgents = agents.filter(agent => agent.type === 'manager');
  const coordinatorAgents = agents.filter(agent => agent.type === 'coordinator');
  const basicAgents = agents.filter(agent => agent.type === 'basic');

  // Calculate stats
  const activeAgents = agents.filter(agent => agent.status === 'active').length;
  const totalTasks = agents.reduce((sum, agent) => sum + agent.tasksCompleted, 0);
  const avgSuccessRate = Math.round(
    agents.reduce((sum, agent) => sum + agent.successRate, 0) / agents.length
  );

  const AgentSection: React.FC<{ 
    title: string; 
    agents: AIAgent[]; 
    description: string; 
    icon: React.ReactNode;
  }> = ({ title, agents: sectionAgents, description, icon }) => (
    <div className="mb-8">
      <div className="flex items-center space-x-2 mb-4">
        {icon}
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <span className="text-sm text-gray-500">({sectionAgents.length})</span>
      </div>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sectionAgents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} onClick={onAgentSelect} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Bot className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Agents</p>
              <p className="text-2xl font-semibold text-gray-900">{agents.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Now</p>
              <p className="text-2xl font-semibold text-gray-900">{activeAgents}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Tasks</p>
              <p className="text-2xl font-semibold text-gray-900">{totalTasks}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Success</p>
              <p className="text-2xl font-semibold text-gray-900">{avgSuccessRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-2">
        {['all', 'manager', 'coordinator', 'basic'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterType === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
            {type !== 'all' && (
              <span className="ml-1">
                ({type === 'manager' ? managerAgents.length : 
                  type === 'coordinator' ? coordinatorAgents.length : 
                  basicAgents.length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Agent Sections */}
      {filterType === 'all' ? (
        <>
          <AgentSection
            title="Manager Agents"
            agents={managerAgents}
            description="Strategic oversight, voice consultations, and high-level decision making"
            icon={<Bot className="h-6 w-6 text-purple-600" />}
          />
          
          <AgentSection
            title="Coordinator Agents"
            agents={coordinatorAgents}
            description="Orchestrate multi-step processes and manage complex workflows"
            icon={<Users className="h-6 w-6 text-blue-600" />}
          />
          
          <AgentSection
            title="Specialist Agents"
            agents={basicAgents}
            description="Handle specific tasks with expertise in lead processing and client management"
            icon={<MessageSquare className="h-6 w-6 text-teal-600" />}
          />
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} onClick={onAgentSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;