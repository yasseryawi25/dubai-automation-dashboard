import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Phone, Mail, MessageSquare, X, BarChart3, Users, Clock } from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'manager' | 'omar';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface OmarManagerChatProps {
  isOpen: boolean;
  onClose: () => void;
  agentName: string;
  webhookUrl: string;
}

const OmarManagerChat: React.FC<OmarManagerChatProps> = ({ 
  isOpen, 
  onClose, 
  agentName,
  webhookUrl 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'omar',
      content: 'Good morning! I\'m ready to report on my lead qualification activities. Currently processing 23 active leads with 87.3% qualification success rate. How can I assist you today?',
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
        agentId: 'omar-hassan',
        sessionId: `manager_session_${Date.now()}`,
        conversationType: 'manager_employee_chat',
        requestType: 'status_report',
        source: 'manager_dashboard',
        chatType: 'performance_review',
        managerRole: 'real_estate_agency_manager'
      });

      const urlWithParams = `${webhookUrl}?${params.toString()}`;
      
      // Enhanced debug logging
      console.log('🚀 Omar AI Agent - Sending request to n8n:');
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
      
      // Extract Omar's response from the n8n workflow response
      const omarResponse = data.response || data.omarResponse || data.message || 'I\'m currently processing your request and will provide a detailed update shortly, sir.';
      console.log('💬 Omar Response:', omarResponse);
      
      return omarResponse;
    } catch (error) {
      console.error('❌ Error communicating with Omar via n8n:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        webhookUrl: webhookUrl,
        timestamp: new Date().toISOString()
      });
      
      // Return different error messages based on error type
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          return 'I apologize, sir. I cannot reach my n8n workflow system. Please check if the workflow is active and the URL is accessible.';
        } else if (error.message.includes('HTTP 404')) {
          return 'I apologize, sir. My n8n workflow endpoint was not found. Please verify the webhook URL and ensure the workflow is active.';
        } else if (error.message.includes('HTTP 500')) {
          return 'I apologize, sir. There\'s an error in my n8n workflow execution. Please check the workflow logs and database connections.';
        }
      }
      
      return 'I apologize, sir. I\'m experiencing technical difficulties with my reporting system. Please give me a moment to reconnect.';
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
      // Send manager's message to Omar via n8n workflow
      const omarResponse = await sendToN8N(managerMessage.content);

      // Simulate Omar processing time
      setTimeout(() => {
        const omarMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'omar',
          content: omarResponse,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, omarMessage]);
        setIsTyping(false);
        setIsLoading(false);
      }, 2000); // Omar takes a moment to gather data and respond

    } catch (error) {
      console.error('Error in manager-Omar communication:', error);
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
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[700px] flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-xl">
              🎯
            </div>
            <div>
              <h3 className="font-semibold text-xl">Omar Hassan</h3>
              <p className="text-indigo-100 text-sm">AI Lead Qualification Specialist - Employee Chat</p>
            </div>
            <div className="ml-6 flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <BarChart3 className="h-4 w-4" />
                <span>87.3% Success</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>23 Active Leads</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Real-time</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-indigo-500 bg-opacity-50 rounded-full px-3 py-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs">Working</span>
            </div>
            <button
              onClick={onClose}
              className="text-indigo-100 hover:text-white transition-colors"
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
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === 'manager' ? 'bg-blue-600 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
                  {message.type === 'manager' ? (
                    <User className="h-5 w-5" />
                  ) : (
                    <span className="text-lg">🎯</span>
                  )}
                </div>
                <div className={`rounded-2xl px-5 py-3 ${message.type === 'manager' ? 'bg-blue-600 text-white rounded-br-md' : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-200'}`}>
                  <div className={`text-xs font-medium mb-1 ${message.type === 'manager' ? 'text-blue-100' : 'text-indigo-600'}`}>
                    {message.type === 'manager' ? 'Manager' : 'Omar Hassan'}
                  </div>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-2 ${message.type === 'manager' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Omar Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3 max-w-[85%]">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🎯</span>
                </div>
                <div className="bg-white rounded-2xl rounded-bl-md px-5 py-3 shadow-sm border border-gray-200">
                  <div className="text-xs font-medium text-indigo-600 mb-1">Omar Hassan</div>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-600">Gathering data and preparing report</span>
                    <div className="flex space-x-1 ml-2">
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
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
              'Show me today\'s lead summary',
              'What\'s your current task status?',
              'Any high-priority leads?',
              'Performance metrics update',
              'Which leads need my attention?',
              'Workflow status report'
            ].map((quickQuestion) => (
              <button
                key={quickQuestion}
                onClick={() => {
                  setInputMessage(quickQuestion);
                  setTimeout(() => handleSendMessage(), 100);
                }}
                className="whitespace-nowrap text-xs bg-indigo-50 text-indigo-700 px-3 py-2 rounded-full hover:bg-indigo-100 transition-colors font-medium"
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
                placeholder="Ask Omar about leads, tasks, performance, or give instructions..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                rows={2}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          
          {/* Connection Status */}
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>Connected to Omar via n8n AI Workflow</span>
            </div>
            <div className="flex items-center space-x-3">
              <span>Manager Dashboard</span>
              <span>•</span>
              <span className="text-indigo-600 font-medium">Real Estate Agency</span>
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

export default OmarManagerChat;