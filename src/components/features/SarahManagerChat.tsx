import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Phone, Mail, MessageSquare, X, BarChart3, Users, Clock, Crown, TrendingUp } from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'manager' | 'sarah';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface SarahManagerChatProps {
  isOpen: boolean;
  onClose: () => void;
  agentName: string;
  webhookUrl: string;
  onVoiceCall?: (phoneNumber?: string) => void;
}

const SarahManagerChat: React.FC<SarahManagerChatProps> = ({ 
  isOpen, 
  onClose, 
  agentName,
  webhookUrl,
  onVoiceCall
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'sarah',
      content: 'Good morning! I\'m Sarah, your AI Team Manager. I oversee the entire AI agent network and can provide strategic insights, coordinate voice calls with clients, and analyze overall performance. How can I assist you with managing your real estate business today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendToN8N = async (managerMessage: string): Promise<string> => {
    try {
      // Validate webhook URL
      if (!webhookUrl) {
        throw new Error('Webhook URL not configured');
      }

      // Create URL with query parameters for GET request
      const params = new URLSearchParams({
        managerMessage: managerMessage,
        timestamp: new Date().toISOString(),
        agentId: 'sarah-manager',
        sessionId: `manager_session_${Date.now()}`,
        conversationType: 'broker_manager_chat',
        requestType: 'strategic_consultation',
        source: 'manager_dashboard',
        chatType: 'strategic_management',
        managerRole: 'ai_team_manager',
        capabilities: 'voice_calls,strategic_planning,team_coordination,market_analysis'
      });

      const urlWithParams = `${webhookUrl}?${params.toString()}`;
      
      // Enhanced debug logging
      console.log('🚀 Sarah AI Manager - Sending request to n8n:');
      console.log('📍 Webhook URL:', webhookUrl);
      console.log('📍 Full URL with params:', urlWithParams);
      console.log('💬 Manager Message:', managerMessage);
      console.log('⏰ Timestamp:', new Date().toISOString());

      const response = await fetch(urlWithParams, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      console.log('📥 Response Status:', response.status);
      console.log('📥 Response OK:', response.ok);
      console.log('📥 Response Headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ HTTP Error:', response.status, response.statusText);
        console.error('❌ Error Response Body:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      console.log('📋 Response Content-Type:', contentType);
      
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const textData = await response.text();
        console.warn('⚠️ Non-JSON response received:', textData);
        data = { response: textData, message: textData };
      }
      
      console.log('📋 Response Data:', data);
      
      // Extract Sarah's response from the n8n workflow response
      const sarahResponse = data.response || data.sarahResponse || data.message || 'I\'m analyzing your request and coordinating with the team to provide you with comprehensive strategic insights. Please give me a moment.';
      console.log('💬 Sarah Response:', sarahResponse);
      
      return sarahResponse;
    } catch (error) {
      console.error('❌ Error communicating with Sarah via n8n:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        webhookUrl: webhookUrl,
        timestamp: new Date().toISOString()
      });
      
      // Return different error messages based on error type
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          return 'I apologize for the technical difficulty. I cannot reach my strategic analysis systems at the moment. Please check if my n8n workflow is active.';
        } else if (error.message.includes('HTTP 404')) {
          return 'I\'m having trouble accessing my management systems. Please verify that my n8n workflow endpoint is properly configured and active.';
        } else if (error.message.includes('HTTP 500')) {
          return 'There appears to be an issue with my strategic analysis workflow. Please check the n8n execution logs and team coordination systems.';
        }
      }
      
      return 'I apologize for the inconvenience. I\'m experiencing technical difficulties with my management systems. Let me coordinate with the technical team to resolve this.';
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const managerMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'manager',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, managerMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Send manager's message to Sarah via n8n workflow
      const sarahResponse = await sendToN8N(managerMessage.content);

      // Simulate Sarah processing time (strategic analysis takes time)
      setTimeout(() => {
        const sarahMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'sarah',
          content: sarahResponse,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, sarahMessage]);
        setIsTyping(false);
        setIsLoading(false);
      }, 2500); // Sarah takes slightly longer for strategic analysis

    } catch (error) {
      console.error('Error in manager-Sarah communication:', error);
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceCall = () => {
    if (onVoiceCall) {
      onVoiceCall();
      // Add a message about the voice call
      const voiceCallMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'sarah',
        content: 'Initiating voice call with bilingual capabilities (Arabic/English). I\'m ready to conduct strategic consultations with your clients or provide market analysis over the phone.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, voiceCallMessage]);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[750px] flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-xl">
              👩‍💼
            </div>
            <div>
              <h3 className="font-semibold text-xl flex items-center">
                <Crown className="h-5 w-5 mr-2" />
                Sarah Al-Mansouri
              </h3>
              <p className="text-purple-100 text-sm">AI Team Manager</p>
            </div>
            <div className="ml-6 flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4" />
                <span>96.2% Success</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>AI Team Leader</span>
              </div>
              <div className="flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span>Voice Ready</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleVoiceCall}
              className="flex items-center space-x-1 bg-green-500 bg-opacity-50 rounded-full px-3 py-1 hover:bg-green-600 transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span className="text-xs">Voice Call</span>
            </button>
            <div className="flex items-center space-x-1 bg-purple-500 bg-opacity-50 rounded-full px-3 py-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs">Managing</span>
            </div>
            <button
              onClick={onClose}
              className="text-purple-100 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'manager' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-[85%] ${message.type === 'manager' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === 'manager' ? 'bg-blue-600 text-white' : 'bg-purple-100 text-purple-700'}`}>
                  {message.type === 'manager' ? (
                    <User className="h-5 w-5" />
                  ) : (
                    <span className="text-lg">👩‍💼</span>
                  )}
                </div>
                <div className={`rounded-2xl px-5 py-3 ${message.type === 'manager' ? 'bg-blue-600 text-white rounded-br-md' : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-200'}`}>
                  <div className={`text-xs font-medium mb-1 ${message.type === 'manager' ? 'text-blue-100' : 'text-purple-600'}`}>
                    {message.type === 'manager' ? 'You' : 'Sarah Al-Mansouri'}
                  </div>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-2 ${message.type === 'manager' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Sarah Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3 max-w-[85%]">
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">👩‍💼</span>
                </div>
                <div className="bg-white rounded-2xl rounded-bl-md px-5 py-3 shadow-sm border border-gray-200">
                  <div className="text-xs font-medium text-purple-600 mb-1">Sarah Al-Mansouri</div>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-600">Analyzing strategy and coordinating team response</span>
                    <div className="flex space-x-1 ml-2">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Manager Questions */}
        <div className="px-6 py-3 bg-white border-t border-gray-200">
          <div className="flex space-x-2 overflow-x-auto">
            {[
              'Analyze team performance',
              'Strategic market insights',
              'Schedule client voice call',
              'Coordinate AI agents',
              'Review conversion metrics',
              'Market expansion strategy'
            ].map((quickQuestion) => (
              <button
                key={quickQuestion}
                onClick={() => {
                  setInputMessage(quickQuestion);
                  setTimeout(() => handleSendMessage(), 100);
                }}
                className="whitespace-nowrap text-xs bg-purple-50 text-purple-700 px-3 py-2 rounded-full hover:bg-purple-100 transition-colors font-medium"
                disabled={isLoading}
              >
                {quickQuestion}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="p-6 bg-white border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Sarah about team strategy, market analysis, voice consultations, or coordination needs..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                rows={2}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-purple-600 text-white p-3 rounded-xl hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          
          {/* Connection Status */}
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>Connected to Sarah via n8n Strategic Workflow</span>
            </div>
            <div className="flex items-center space-x-3">
              <span>AI Team Manager</span>
              <span>•</span>
              <span className="text-purple-600 font-medium">Strategic Analysis</span>
              <span>•</span>
              <span className="text-xs text-gray-400 font-mono" title={webhookUrl}>
                {webhookUrl.split('/').pop()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SarahManagerChat;
