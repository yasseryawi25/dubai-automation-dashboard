import React, { useState } from 'react';
import { Send, Phone, Mic, TrendingUp, AlertCircle } from 'lucide-react';
import type { AgentCommunication } from '../../types/agents';

interface ManagerAgentChatProps {
  agentId: string;
  onVoiceCall?: () => void;
}

const ManagerAgentChat: React.FC<ManagerAgentChatProps> = ({ agentId, onVoiceCall }) => {
  const [message, setMessage] = useState('');
  const [communications, setCommunications] = useState<AgentCommunication[]>([
    {
      id: '1',
      agentId: 'sarah-manager',
      type: 'insight',
      content: 'Good morning! I\'ve analyzed last week\'s performance. Your lead conversion rate improved by 15%. The most effective approach was the Arabic-English bilingual messaging.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      metadata: {
        insight_type: 'performance',
        confidence: 0.92
      }
    },
    {
      id: '2',
      agentId: 'sarah-manager',
      type: 'recommendation',
      content: 'I recommend focusing on Downtown Dubai properties this week. Market analysis shows 23% higher inquiry rates. Shall I adjust the campaign targeting?',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      metadata: {
        action_required: true,
        market_area: 'Downtown Dubai'
      }
    },
    {
      id: '3',
      agentId: 'sarah-manager',
      type: 'alert',
      content: 'High-priority lead detected: Investment inquiry for AED 5M+ portfolio. Client prefers voice consultation. Should I schedule a call?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      metadata: {
        priority: 'high',
        value: '5000000',
        action_required: true
      }
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: AgentCommunication = {
      id: Date.now().toString(),
      agentId: 'user',
      type: 'message',
      content: message,
      timestamp: new Date().toISOString(),
      metadata: {}
    };

    setCommunications(prev => [...prev, newMessage]);
    setMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: AgentCommunication = {
        id: (Date.now() + 1).toString(),
        agentId: agentId,
        type: 'response',
        content: 'I understand your request. Let me analyze the current situation and provide you with actionable insights.',
        timestamp: new Date().toISOString(),
        metadata: {
          response_to: newMessage.id
        }
      };
      setCommunications(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'insight':
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'recommendation':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'alert':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getMessageBg = (type: string) => {
    switch (type) {
      case 'insight':
        return 'bg-blue-50 border-blue-200';
      case 'recommendation':
        return 'bg-green-50 border-green-200';
      case 'alert':
        return 'bg-red-50 border-red-200';
      case 'message':
        return 'bg-gray-100 border-gray-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md h-96 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">👩‍💼</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Sarah - Manager Agent</h3>
            <p className="text-sm text-gray-500">Strategic Analysis & Voice Calls</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onVoiceCall}
            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
            title="Start Voice Call"
          >
            <Phone className="h-4 w-4" />
          </button>
          <button
            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
            title="Voice Message"
          >
            <Mic className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {communications.map((comm) => (
          <div
            key={comm.id}
            className={`p-3 rounded-lg border ${getMessageBg(comm.type)} ${
              comm.agentId === 'user' ? 'ml-8' : 'mr-8'
            }`}
          >
            <div className="flex items-start space-x-2">
              {comm.agentId !== 'user' && getMessageIcon(comm.type)}
              <div className="flex-1">
                <p className="text-sm text-gray-900">{comm.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(comm.timestamp).toLocaleTimeString()}
                </p>
                {comm.metadata.action_required && (
                  <div className="mt-2 flex space-x-2">
                    <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">
                      Accept
                    </button>
                    <button className="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400">
                      Review
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask Sarah about strategy, performance, or market insights..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Sarah responds with market insights, strategic recommendations, and can make voice calls to clients.
        </p>
      </div>
    </div>
  );
};

export default ManagerAgentChat;