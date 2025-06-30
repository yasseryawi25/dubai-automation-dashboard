// src/App.tsx - Complete AI Agent Dashboard
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  MessageCircle, 
  TrendingUp, 
  Settings,
  Phone,
  Calendar,
  BarChart3,
  Activity,
  Send,
  Mic,
  Clock,
  CheckCircle
} from 'lucide-react';

// Mock AI Agent Data
const mockAgents = [
  {
    id: 1,
    agent_name: 'Sarah',
    agent_type: 'manager',
    agent_role: 'Manager Agent',
    status: 'active',
    capabilities: { voice_calling: true, strategic_analysis: true, client_consultation: true },
    tasks_completed: 42,
    communications_handled: 156,
    leads_processed: 28,
    response_time_avg: '2 minutes'
  },
  {
    id: 2,
    agent_name: 'Alex',
    agent_type: 'coordinator',
    agent_role: 'Pipeline Coordinator',
    status: 'active',
    capabilities: { lead_routing: true, workflow_orchestration: true, performance_monitoring: true },
    tasks_completed: 38,
    communications_handled: 124,
    leads_processed: 22,
    response_time_avg: '4 minutes'
  },
  {
    id: 3,
    agent_name: 'Maya',
    agent_type: 'coordinator',
    agent_role: 'Campaign Coordinator',
    status: 'busy',
    capabilities: { campaign_management: true, social_media: true, content_creation: true },
    tasks_completed: 31,
    communications_handled: 89,
    leads_processed: 15,
    response_time_avg: '6 minutes'
  },
  {
    id: 4,
    agent_name: 'Omar',
    agent_type: 'basic',
    agent_role: 'Lead Qualification Agent',
    status: 'active',
    capabilities: { lead_scoring: true, initial_contact: true, data_collection: true },
    tasks_completed: 67,
    communications_handled: 203,
    leads_processed: 58,
    response_time_avg: '3 minutes'
  },
  {
    id: 5,
    agent_name: 'Layla',
    agent_type: 'basic',
    agent_role: 'Follow-up Specialist',
    status: 'active',
    capabilities: { email_sequences: true, relationship_building: true, client_retention: true },
    tasks_completed: 54,
    communications_handled: 178,
    leads_processed: 41,
    response_time_avg: '5 minutes'
  },
  {
    id: 6,
    agent_name: 'Ahmed',
    agent_type: 'basic',
    agent_role: 'Appointment Agent',
    status: 'active',
    capabilities: { calendar_management: true, appointment_scheduling: true, reminder_systems: true },
    tasks_completed: 29,
    communications_handled: 95,
    leads_processed: 18,
    response_time_avg: '7 minutes'
  }
];

// Agent Card Component
const AgentCard = ({ agent, onClick }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'inactive': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getAgentTypeIcon = (type) => {
    switch (type) {
      case 'manager': return <Phone className="w-5 h-5" />;
      case 'coordinator': return <TrendingUp className="w-5 h-5" />;
      case 'basic': return <MessageCircle className="w-5 h-5" />;
      default: return <MessageCircle className="w-5 h-5" />;
    }
  };

  const getAgentTypeColor = (type) => {
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
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-600">Tasks Completed</div>
          <div className="font-semibold text-green-600">{agent.tasks_completed}</div>
        </div>
        <div>
          <div className="text-gray-600">Communications</div>
          <div className="font-semibold text-blue-600">{agent.communications_handled}</div>
        </div>
        <div>
          <div className="text-gray-600">Leads Processed</div>
          <div className="font-semibold text-purple-600">{agent.leads_processed}</div>
        </div>
        <div>
          <div className="text-gray-600">Avg Response</div>
          <div className="font-semibold text-orange-600">{agent.response_time_avg}</div>
        </div>
      </div>
    </div>
  );
};

// Manager Agent Chat Component
const ManagerAgentChat = ({ agentName = 'Sarah' }) => {
  const [message, setMessage] = useState('');
  const [communications, setCommunications] = useState([
    {
      id: 1,
      direction: 'outbound',
      content: `Hello! I'm ${agentName}, your AI Manager Agent. I'm here to help you analyze your real estate performance and provide strategic insights. How can I assist you today?`,
      created_at: new Date().toISOString(),
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      id: communications.length + 1,
      direction: 'inbound',
      content: message,
      created_at: new Date().toISOString(),
    };

    setCommunications(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Based on your current performance metrics, I recommend focusing on lead qualification automation. Your conversion rate could improve by 35% with better initial screening.",
        "I've analyzed your pipeline data. You have 12 high-priority leads that need immediate follow-up. Should I have Layla (Follow-up Specialist) contact them today?",
        "Market analysis shows Dubai Marina properties are trending 15% higher this week. I suggest having Maya (Campaign Coordinator) create targeted content for this area.",
        "Your appointment booking rate is excellent! Ahmed has scheduled 8 viewings for tomorrow. Would you like me to prepare property briefings for each appointment?",
        "I notice you're spending too much time on admin tasks. I can automate 70% of your daily workflows. Would you like me to set this up with Alex (Pipeline Coordinator)?",
      ];
      
      const aiResponse = {
        id: communications.length + 2,
        direction: 'outbound',
        content: responses[Math.floor(Math.random() * responses.length)],
        created_at: new Date().toISOString(),
      };
      setCommunications(prev => [...prev, aiResponse]);
    }, 1500);

    setMessage('');
  };

  const handleVoiceCall = () => {
    alert(`Initiating voice call with ${agentName}... (VAPI integration will be implemented here)`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-96 flex flex-col">
      {/* Chat Header */}
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{agentName}</h3>
            <div className="flex items-center space-x-1 text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Online</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleVoiceCall}
          className="flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Mic className="w-4 h-4" />
          <span>Voice Call</span>
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {communications.map((comm) => (
          <div
            key={comm.id}
            className={`flex ${comm.direction === 'inbound' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                comm.direction === 'inbound'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{comm.content}</p>
              <div className="flex items-center justify-end space-x-1 mt-1">
                <Clock className="w-3 h-3 opacity-50" />
                <span className="text-xs opacity-75">
                  {new Date(comm.created_at).toLocaleTimeString()}
                </span>
                {comm.direction === 'inbound' && (
                  <CheckCircle className="w-3 h-3 opacity-50" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask your Manager Agent anything..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  // Group agents by type
  const managerAgents = mockAgents.filter(agent => agent.agent_type === 'manager');
  const coordinatorAgents = mockAgents.filter(agent => agent.agent_type === 'coordinator');
  const basicAgents = mockAgents.filter(agent => agent.agent_type === 'basic');

  // Calculate summary stats
  const totalAgents = mockAgents.length;
  const activeAgents = mockAgents.filter(agent => agent.status === 'active').length;
  const totalTasks = mockAgents.reduce((sum, agent) => sum + agent.tasks_completed, 0);
  const totalCommunications = mockAgents.reduce((sum, agent) => sum + agent.communications_handled, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">AI Real Estate Team</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{activeAgents} Agents Active</span>
              </div>
              
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">Demo</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white p-6 mb-8">
          <h2 className="text-2xl font-bold mb-2">Welcome to Your AI Real Estate Team</h2>
          <p className="text-blue-100">
            Your {totalAgents} AI agents are working 24/7 to grow your business. Monitor their performance and interact with your Manager Agent below.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <div className="text-sm text-gray-600">Total Agents</div>
                <div className="text-2xl font-bold text-gray-900">{totalAgents}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                <Activity className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <div className="text-sm text-gray-600">Active Agents</div>
                <div className="text-2xl font-bold text-gray-900">{activeAgents}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <div className="text-sm text-gray-600">Tasks Today</div>
                <div className="text-2xl font-bold text-gray-900">{totalTasks}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <div className="text-sm text-gray-600">Communications</div>
                <div className="text-2xl font-bold text-gray-900">{totalCommunications}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Overview and Manager Chat */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Agent Team Overview */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">AI Agent Team</h2>
            
            {/* Manager Agents */}
            {managerAgents.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-purple-600" />
                  Manager Agent
                </h3>
                <div className="space-y-4">
                  {managerAgents.map(agent => (
                    <AgentCard key={agent.id} agent={agent} onClick={() => {}} />
                  ))}
                </div>
              </div>
            )}

            {/* Coordinator Agents */}
            {coordinatorAgents.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  Coordinator Agents
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {coordinatorAgents.map(agent => (
                    <AgentCard key={agent.id} agent={agent} onClick={() => {}} />
                  ))}
                </div>
              </div>
            )}

            {/* Basic Agents */}
            {basicAgents.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-green-600" />
                  Specialist Agents
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {basicAgents.map(agent => (
                    <AgentCard key={agent.id} agent={agent} onClick={() => {}} />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Manager Agent Chat */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Chat with Sarah - Manager Agent</h3>
            <ManagerAgentChat agentName="Sarah" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;