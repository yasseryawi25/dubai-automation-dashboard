// src/components/features/ManagerAgentChat.tsx
import React, { useState } from 'react';
import { Send, Phone, Mic, Clock, CheckCircle } from 'lucide-react';
import { AgentCommunication } from '../../services/agentAPI';

interface ManagerAgentChatProps {
  agentId: number;
  agentName: string;
}

export const ManagerAgentChat: React.FC<ManagerAgentChatProps> = ({ agentId, agentName }) => {
  const [message, setMessage] = useState('');
  const [communications, setCommunications] = useState<AgentCommunication[]>([
    {
      id: 1,
      agent_id: agentId,
      communication_type: 'chat',
      direction: 'outbound',
      content: `Hello! I'm ${agentName}, your AI Manager Agent. I'm here to help you analyze your real estate performance and provide strategic insights. How can I assist you today?`,
      metadata: {},
      client_contact_info: {},
      created_at: new Date().toISOString(),
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: AgentCommunication = {
      id: communications.length + 1,
      agent_id: agentId,
      communication_type: 'chat',
      direction: 'inbound',
      content: message,
      metadata: {},
      client_contact_info: {},
      created_at: new Date().toISOString(),
    };

    setCommunications(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: AgentCommunication = {
        id: communications.length + 2,
        agent_id: agentId,
        communication_type: 'chat',
        direction: 'outbound',
        content: getAIResponse(message),
        metadata: {},
        client_contact_info: {},
        created_at: new Date().toISOString(),
      };
      setCommunications(prev => [...prev, aiResponse]);
    }, 1500);

    setMessage('');
  };

  const getAIResponse = (userMessage: string): string => {
    const responses = [
      "Based on your current performance metrics, I recommend focusing on lead qualification automation. Your conversion rate could improve by 35% with better initial screening.",
      "I've analyzed your pipeline data. You have 12 high-priority leads that need immediate follow-up. Should I have Layla (Follow-up Specialist) contact them today?",
      "Market analysis shows Dubai Marina properties are trending 15% higher this week. I suggest having Maya (Campaign Coordinator) create targeted content for this area.",
      "Your appointment booking rate is excellent! Ahmed has scheduled 8 viewings for tomorrow. Would you like me to prepare property briefings for each appointment?",
      "I notice you're spending too much time on admin tasks. I can automate 70% of your daily workflows. Would you like me to set this up with Alex (Pipeline Coordinator)?",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
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