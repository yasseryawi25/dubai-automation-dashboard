import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Bot, Bell, Settings, User } from 'lucide-react';

// Import our AI Agent components
import AgentDashboard from './components/features/AgentDashboard';
import ManagerAgentChat from './components/features/ManagerAgentChat';
import { agentAPI } from './services/agentAPI';
import { vapiService } from './services/vapiService';
import type { AIAgent } from './types/agents';

// Main Dashboard Component with AI Agent Integration
const Dashboard: React.FC = () => {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [loading, setLoading] = useState(true);
  const [showManagerChat, setShowManagerChat] = useState(false);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      setLoading(true);
      const agentData = await agentAPI.getAgents();
      setAgents(agentData);
    } catch (error) {
      console.error('Failed to load agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAgentSelect = (agent: AIAgent) => {
    setSelectedAgent(agent);
    
    // If it's Sarah (Manager Agent), show the chat interface
    if (agent.id === 'sarah-manager' || agent.type === 'manager') {
      setShowManagerChat(true);
    }
  };

  const handleVoiceCall = async (phoneNumber?: string) => {
    if (!phoneNumber) {
      // For demo purposes, use a sample number
      phoneNumber = '+971501234567';
    }

    try {
      console.log('Initiating voice call to:', phoneNumber);
      
      // Validate phone number
      if (!vapiService.validatePhoneNumber(phoneNumber)) {
        alert('Please enter a valid phone number');
        return;
      }

      // Format phone number
      const formattedNumber = vapiService.formatPhoneNumber(phoneNumber);
      
      // Create call via VAPI
      const callResponse = await vapiService.createCall({
        phoneNumber: formattedNumber,
        language: 'bilingual', // Sarah can handle both Arabic and English
        customerInfo: {
          name: 'Dubai Real Estate Client',
          context: 'Manager Agent consultation call',
          previousInteraction: false
        }
      });

      console.log('Call initiated:', callResponse);
      alert(`Voice call initiated! Call ID: ${callResponse.id}`);
      
    } catch (error) {
      console.error('Voice call failed:', error);
      alert('Voice call failed. Please check your VAPI configuration.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header with Real-time Status */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-lg p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">AI Real Estate Agent Team</h1>
              <p className="text-blue-100 text-lg">
                Your complete AI-powered team replacing AED 22,000/month human staff
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">AED 1,497/month</div>
              <div className="text-sm text-blue-200">93% cost savings</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">System Status</span>
              </div>
              <div className="text-xl font-bold">All Operational</div>
              <div className="text-xs text-blue-200">6 agents active</div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-sm font-medium mb-2">Today's Activity</div>
              <div className="text-xl font-bold">{Math.floor(Math.random() * 50) + 30} Tasks</div>
              <div className="text-xs text-blue-200">Processing in real-time</div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-sm font-medium mb-2">Manager Agent</div>
              <div className="text-xl font-bold">Sarah Available</div>
              <div className="text-xs text-blue-200">Ready for voice calls</div>
            </div>
          </div>
        </div>
      </div>

      {/* Manager Agent Quick Access */}
      {agents.find(a => a.type === 'manager') && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">👩‍💼</div>
              <div>
                <h3 className="text-lg font-semibold text-purple-900">
                  Sarah Al-Mansouri - Your Manager Agent
                </h3>
                <p className="text-purple-700">
                  Personal AI assistant with voice calling • Speaks Arabic & English
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowManagerChat(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Chat with Sarah
              </button>
              <button
                onClick={() => handleVoiceCall()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Voice Call
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Agent Dashboard */}
      <AgentDashboard agents={agents} onAgentSelect={handleAgentSelect} />

      {/* Manager Agent Chat Modal */}
      {showManagerChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Sarah Al-Mansouri - Manager Agent</h2>
              <button
                onClick={() => setShowManagerChat(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <ManagerAgentChat 
                agentId="sarah-manager" 
                onVoiceCall={handleVoiceCall}
              />
            </div>
          </div>
        </div>
      )}

      {/* Selected Agent Details Modal */}
      {selectedAgent && !showManagerChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-3xl">{selectedAgent.avatar}</div>
              <div>
                <h3 className="text-lg font-semibold">{selectedAgent.name}</h3>
                <p className="text-sm text-gray-600">{selectedAgent.specialty}</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`text-sm font-medium ${
                  selectedAgent.status === 'active' ? 'text-green-600' : 
                  selectedAgent.status === 'busy' ? 'text-yellow-600' : 'text-gray-600'
                }`}>
                  {selectedAgent.status.charAt(0).toUpperCase() + selectedAgent.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tasks Completed:</span>
                <span className="text-sm font-medium">{selectedAgent.tasksCompleted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Success Rate:</span>
                <span className="text-sm font-medium text-green-600">{selectedAgent.successRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Last Activity:</span>
                <span className="text-sm">{selectedAgent.lastActivity}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              {selectedAgent.type === 'manager' && (
                <button
                  onClick={() => {
                    setSelectedAgent(null);
                    setShowManagerChat(true);
                  }}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Chat with {selectedAgent.name}
                </button>
              )}
              <button
                onClick={() => setSelectedAgent(null)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
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
        {/* Enhanced Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Dubai Real Estate AI Platform
                  </h1>
                  <div className="text-xs text-gray-500">
                    Demo Client - Premium Package
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Quick status indicators */}
                <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>6 Agents Active</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Real-time Processing</span>
                  </div>
                </div>
                
                {/* Action buttons */}
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Bell className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Settings className="h-5 w-5" />
                </button>
                
                {/* User profile */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700 hidden sm:inline">Demo Client</span>
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    <User className="h-4 w-4" />
                  </div>
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

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="text-center text-sm text-gray-500">
              Dubai Real Estate AI Platform - Demo Environment • 
              <span className="text-blue-600 ml-1">Powered by n8n + AI Agent Technology</span>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
