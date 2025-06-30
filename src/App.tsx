import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  Phone,
  MessageSquare,
  Users,
  TrendingUp,
  Bot,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

// Types
interface AIAgent {
  id: string;
  name: string;
  type: 'manager' | 'coordinator' | 'basic';
  status: 'active' | 'idle' | 'busy';
  avatar: string;
  specialty: string;
  lastActivity: string;
  tasksCompleted: number;
  successRate: number;
}

interface AgentCardProps {
  agent: AIAgent;
  onClick: (agent: AIAgent) => void;
}

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}

// Sample data
const sampleAgents: AIAgent[] = [
  {
    id: 'sarah-manager',
    name: 'Sarah',
    type: 'manager',
    status: 'active',
    avatar: '👩‍💼',
    specialty: 'Strategic Analysis & Voice Calls',
    lastActivity: 'Analyzing market trends',
    tasksCompleted: 47,
    successRate: 96
  },
  {
    id: 'alex-coordinator',
    name: 'Alex',
    type: 'coordinator',
    status: 'busy',
    avatar: '👨‍💻',
    specialty: 'Pipeline Coordination',
    lastActivity: 'Coordinating 12 active leads',
    tasksCompleted: 156,
    successRate: 94
  },
  {
    id: 'maya-coordinator',
    name: 'Maya',
    type: 'coordinator',
    status: 'active',
    avatar: '👩‍🎨',
    specialty: 'Campaign Management',
    lastActivity: 'Optimizing email sequences',
    tasksCompleted: 203,
    successRate: 92
  },
  {
    id: 'omar-basic',
    name: 'Omar',
    type: 'basic',
    status: 'active',
    avatar: '👨‍🔬',
    specialty: 'Lead Qualification',
    lastActivity: 'Processing WhatsApp leads',
    tasksCompleted: 89,
    successRate: 88
  },
  {
    id: 'layla-basic',
    name: 'Layla',
    type: 'basic',
    status: 'idle',
    avatar: '👩‍📋',
    specialty: 'Follow-up Specialist',
    lastActivity: 'Completed email sequence',
    tasksCompleted: 134,
    successRate: 91
  },
  {
    id: 'ahmed-basic',
    name: 'Ahmed',
    type: 'basic',
    status: 'busy',
    avatar: '👨‍📅',
    specialty: 'Appointment Scheduling',
    lastActivity: 'Scheduling client meetings',
    tasksCompleted: 67,
    successRate: 89
  }
];

// Components
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

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, trend, icon }) => (
  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        <div className="flex items-center mt-2">
          {trend === 'up' ? (
            <ArrowUp className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowDown className="h-4 w-4 text-red-500" />
          )}
          <span className={`text-sm font-medium ml-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </span>
          <span className="text-sm text-gray-500 ml-1">vs last month</span>
        </div>
      </div>
      <div className="text-primary/20">
        {icon}
      </div>
    </div>
  </div>
);

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);

  const metrics = [
    {
      title: 'Active Leads',
      value: '247',
      change: '+23%',
      trend: 'up' as const,
      icon: <Users className="h-8 w-8" />
    },
    {
      title: 'Calls Completed',
      value: '89',
      change: '+12%',
      trend: 'up' as const,
      icon: <Phone className="h-8 w-8" />
    },
    {
      title: 'Messages Sent',
      value: '1,456',
      change: '+34%',
      trend: 'up' as const,
      icon: <MessageSquare className="h-8 w-8" />
    },
    {
      title: 'Conversion Rate',
      value: '18.5%',
      change: '+5.2%',
      trend: 'up' as const,
      icon: <TrendingUp className="h-8 w-8" />
    }
  ];

  // Group agents by type
  const managerAgents = sampleAgents.filter(agent => agent.type === 'manager');
  const coordinatorAgents = sampleAgents.filter(agent => agent.type === 'coordinator');
  const basicAgents = sampleAgents.filter(agent => agent.type === 'basic');

  const AgentSection: React.FC<{ title: string; agents: AIAgent[]; description: string }> = ({ title, agents, description }) => (
    <div className="mb-8">
      <div className="flex items-center space-x-2 mb-4">
        <Bot className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <span className="text-sm text-gray-500">({agents.length})</span>
      </div>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} onClick={setSelectedAgent} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">AI Real Estate Agent Team</h1>
        <p className="text-blue-100 text-lg">
          Your complete AI-powered team managing leads, calls, and client relationships 24/7
        </p>
        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">All systems operational</span>
          </div>
          <div className="text-sm">
            6 agents active • Processing {Math.floor(Math.random() * 50) + 20} tasks
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Agent Teams */}
      <div>
        <AgentSection
          title="Manager Agents"
          agents={managerAgents}
          description="Strategic oversight, voice consultations, and high-level decision making"
        />
        
        <AgentSection
          title="Coordinator Agents"
          agents={coordinatorAgents}
          description="Orchestrate multi-step processes and manage complex workflows"
        />
        
        <AgentSection
          title="Specialist Agents"
          agents={basicAgents}
          description="Handle specific tasks with expertise in lead processing and client management"
        />
      </div>

      {/* Agent Modal would go here */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">{selectedAgent.name} - Agent Details</h3>
            <p className="text-gray-600 mb-4">Detailed agent interaction would go here...</p>
            <button
              onClick={() => setSelectedAgent(null)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Dubai Real Estate AI Platform
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">Welcome back, Yasser</span>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  Y
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;