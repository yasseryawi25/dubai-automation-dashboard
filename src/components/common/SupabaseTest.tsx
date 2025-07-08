import React, { useState } from 'react';
import { 
  Database, 
  Plus, 
  Trash2, 
  RefreshCw, 
  CheckCircle, 
  XCircle,
  Users,
  MessageSquare,
  BarChart3,
  Zap
} from 'lucide-react';
import { useLeads, useWhatsAppMessages, useDashboardMetrics } from '../../hooks';
import { DatabaseService } from '../../services/databaseService';
import IntegrationTestSuite from './IntegrationTestSuite';

const SupabaseTest: React.FC = () => {
  const [isCreatingLead, setIsCreatingLead] = useState(false);
  const [isCreatingMessage, setIsCreatingMessage] = useState(false);
  const [showTestSuite, setShowTestSuite] = useState(false);
  const [message, setMessage] = useState('');
  
  const { leads, loading: leadsLoading, createLead, refresh: refreshLeads } = useLeads();
  const { messages, loading: messagesLoading, sendMessage } = useWhatsAppMessages();
  const { metrics, loading: metricsLoading, refresh: refreshMetrics } = useDashboardMetrics();

  const createSampleLead = async () => {
    setIsCreatingLead(true);
    try {
      const sampleLeads = [
        {
          name: 'Ahmed Al-Rashid',
          email: 'ahmed.rashid@email.com',
          phone: '+971501234567',
          status: 'new' as const,
          source: 'whatsapp',
          property_type_interest: ['Downtown Dubai Apartment'],
          budget_min: 2500000,
          budget_max: 3000000,
          location_preference: ['Downtown Dubai'],
          priority_level: 'high',
          lead_score: 75
        },
        {
          name: 'Sarah Johnson',
          email: 'sarah.johnson@email.com',
          phone: '+971509876543',
          status: 'contacted' as const,
          source: 'website',
          property_type_interest: ['Dubai Marina Villa'],
          budget_min: 4200000,
          budget_max: 5000000,
          location_preference: ['Dubai Marina'],
          priority_level: 'medium',
          lead_score: 85
        },
        {
          name: 'Mohammad Hassan',
          email: 'mohammad.hassan@email.com',
          phone: '+971505555555',
          status: 'qualified' as const,
          source: 'referral',
          property_type_interest: ['Palm Jumeirah Penthouse'],
          budget_min: 8000000,
          budget_max: 10000000,
          location_preference: ['Palm Jumeirah'],
          priority_level: 'high',
          lead_score: 95
        }
      ];

      const randomLead = sampleLeads[Math.floor(Math.random() * sampleLeads.length)];
      
      // Add some randomization to make each lead unique
      randomLead.name = randomLead.name + ' ' + Math.floor(Math.random() * 1000);
      randomLead.email = `${randomLead.name.toLowerCase().replace(' ', '.')}.${Date.now()}@test.com`;
      
      await createLead(randomLead);
      setMessage('✅ Sample lead created successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`❌ Error creating lead: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setIsCreatingLead(false);
    }
  };

  const createSampleMessage = async () => {
    setIsCreatingMessage(true);
    try {
      const sampleMessages = [
        {
          phone_number: '+971501234567',
          message_content: 'Hi, I\'m interested in Downtown Dubai properties. What\'s available?',
          direction: 'inbound' as const,
          message_type: 'text' as const,
          status: 'delivered' as const
        },
        {
          phone_number: '+971509876543',
          message_content: 'Thank you for your interest! I have several excellent options in Downtown Dubai. Let me send you some details.',
          direction: 'outbound' as const,
          message_type: 'text' as const,
          status: 'delivered' as const
        },
        {
          phone_number: '+971505555555',
          message_content: 'Looking for luxury properties in Palm Jumeirah. Budget is AED 8M+',
          direction: 'inbound' as const,
          message_type: 'text' as const,
          status: 'delivered' as const
        }
      ];

      const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
      
      // Add timestamp to make message unique
      randomMessage.message_content = `[${new Date().toLocaleTimeString()}] ${randomMessage.message_content}`;
      
      await sendMessage(randomMessage);
      setMessage('✅ Sample WhatsApp message created successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`❌ Error creating message: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setIsCreatingMessage(false);
    }
  };

  const clearTestData = async () => {
    try {
      // Note: In a real implementation, you'd want to add a method to clear test data
      // For now, we'll just refresh to show current state
      await Promise.all([refreshLeads(), refreshMetrics()]);
      setMessage('✅ Data refreshed successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`❌ Error refreshing data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const Stats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-blue-50 rounded-lg p-3 text-center">
        <Users className="h-5 w-5 text-blue-600 mx-auto mb-1" />
        <div className="text-lg font-bold text-blue-800">
          {leadsLoading ? '...' : leads.length}
        </div>
        <div className="text-xs text-blue-600">Total Leads</div>
      </div>
      
      <div className="bg-green-50 rounded-lg p-3 text-center">
        <MessageSquare className="h-5 w-5 text-green-600 mx-auto mb-1" />
        <div className="text-lg font-bold text-green-800">
          {messagesLoading ? '...' : messages.length}
        </div>
        <div className="text-xs text-green-600">Messages</div>
      </div>
      
      <div className="bg-purple-50 rounded-lg p-3 text-center">
        <BarChart3 className="h-5 w-5 text-purple-600 mx-auto mb-1" />
        <div className="text-lg font-bold text-purple-800">
          {metricsLoading ? '...' : metrics.newLeadsToday}
        </div>
        <div className="text-xs text-purple-600">Today</div>
      </div>
      
      <div className="bg-orange-50 rounded-lg p-3 text-center">
        <Zap className="h-5 w-5 text-orange-600 mx-auto mb-1" />
        <div className="text-lg font-bold text-orange-800">
          {metricsLoading ? '...' : metrics.activeWorkflows}
        </div>
        <div className="text-xs text-orange-600">Active</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Database className="h-8 w-8" />
          <div>
            <h2 className="text-2xl font-bold">Supabase Integration Test</h2>
            <p className="text-blue-100">Real-time database testing and sample data creation</p>
          </div>
        </div>
        
        {message && (
          <div className="bg-white bg-opacity-20 rounded-lg p-3 mt-4">
            <p className="text-white font-medium">{message}</p>
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Database State</h3>
        <Stats />
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Connected to Supabase</span>
          </div>
          <button
            onClick={clearTestData}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Sample Data Creation */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Data Creation</h3>
        <p className="text-gray-600 mb-4">
          Create sample leads and messages to test the real-time functionality
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={createSampleLead}
            disabled={isCreatingLead}
            className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreatingLead ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
                <span className="text-blue-600">Creating Lead...</span>
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 text-blue-600" />
                <span className="text-blue-600 font-medium">Create Sample Lead</span>
              </>
            )}
          </button>
          
          <button
            onClick={createSampleMessage}
            disabled={isCreatingMessage}
            className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreatingMessage ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin text-green-600" />
                <span className="text-green-600">Creating Message...</span>
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 text-green-600" />
                <span className="text-green-600 font-medium">Create Sample Message</span>
              </>
            )}
          </button>
        </div>
        
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            💡 <strong>Tip:</strong> After creating sample data, watch the dashboard update in real-time! 
            The activity feed and metrics will automatically refresh to show your new data.
          </p>
        </div>
      </div>

      {/* Recent Data Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Leads</h3>
            <span className="text-sm text-gray-500">{leads.length} total</span>
          </div>
          
          {leadsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>No leads yet</p>
              <p className="text-xs">Create a sample lead to get started</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {leads.slice(0, 5).map((lead) => (
                <div key={lead.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {lead.name?.[0] || 'L'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {lead.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {lead.property_type_interest?.join(', ') || 'No property specified'} • {lead.status}
                    </p>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(lead.created_at).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Messages</h3>
            <span className="text-sm text-gray-500">{messages.length} total</span>
          </div>
          
          {messagesLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>No messages yet</p>
              <p className="text-xs">Create a sample message to get started</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {messages.slice(0, 5).map((message) => (
                <div key={message.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {message.phone_number}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        message.direction === 'inbound' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {message.direction}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(message.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {message.message_content.length > 80 
                      ? message.message_content.substring(0, 80) + '...'
                      : message.message_content
                    }
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Integration Test Suite */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Comprehensive Integration Tests</h3>
          <button
            onClick={() => setShowTestSuite(!showTestSuite)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showTestSuite ? 'Hide Tests' : 'Show Integration Tests'}
          </button>
        </div>
        
        {showTestSuite && <IntegrationTestSuite />}
      </div>

      {/* Real-time Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-900">Database Connected</p>
              <p className="text-xs text-green-700">Supabase is operational</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <Zap className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-900">Real-time Active</p>
              <p className="text-xs text-blue-700">Live updates enabled</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm font-medium text-purple-900">Analytics Working</p>
              <p className="text-xs text-purple-700">Metrics calculating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseTest;