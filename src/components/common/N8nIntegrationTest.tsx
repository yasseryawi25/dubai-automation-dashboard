// src/components/common/N8nIntegrationTest.tsx
// Test component for n8n Dashboard Webhook integration

import React, { useState } from 'react';

interface TestResponse {
  agent: string;
  action: string;
  message: string;
  timestamp: string;
  status: string;
  [key: string]: any;
}

export const N8nIntegrationTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<TestResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Your actual n8n webhook URL
  const N8N_WEBHOOK_URL = 'https://n8n.yasta.online/webhook/dashboard';

  const testAgent = async (agentType: string, testData: any) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const requestData = {
        action: 'test',
        agent: agentType,
        clientId: 'demo',
        data: testData
      };

      console.log('🚀 Sending to n8n:', requestData);

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ n8n response:', data);
      setResponse(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('❌ n8n test error:', err);
    } finally {
      setLoading(false);
    }
  };

  const testScenarios = [
    {
      name: 'Lead Qualification Agent',
      agent: 'lead_qualification',
      icon: '🎯',
      data: {
        name: 'Ahmed Al-Rashid',
        phone: '+971501234567',
        message: 'Looking for 2BR apartment in Dubai Marina with sea view, budget AED 2M',
        source: 'WhatsApp',
        timeline: '3-6 months',
        budget: 'AED 1.5M - 2M'
      },
      description: 'Test AI lead qualification with Dubai real estate prospect'
    },
    {
      name: 'Manager Agent (Sarah)',
      agent: 'manager',
      icon: '👩‍💼',
      data: {
        period: 'today',
        metrics: ['leads_processed', 'conversion_rate', 'response_time'],
        request_type: 'performance_insights'
      },
      description: 'Get strategic insights and performance analysis from Manager AI'
    },
    {
      name: 'Appointment Agent',
      agent: 'appointment',
      icon: '📅',
      data: {
        client_name: 'Sarah Johnson',
        property_location: 'Dubai Marina - Address Residences',
        preferred_dates: ['2024-01-16', '2024-01-17'],
        preferred_time: 'afternoon',
        property_type: '2BR with marina view'
      },
      description: 'Schedule property viewing appointment in Dubai'
    },
    {
      name: 'Follow-up Specialist',
      agent: 'follow_up',
      icon: '📞',
      data: {
        lead_profile: 'investment_buyer',
        last_interaction: '3 days ago',
        lead_status: 'warm',
        property_interest: 'Business Bay commercial',
        budget_range: 'AED 2M-3M'
      },
      description: 'Create personalized follow-up sequence for investor'
    },
    {
      name: 'Pipeline Coordinator',
      agent: 'pipeline_coordinator',
      icon: '🎭',
      data: {
        pipeline_stage: 'qualified',
        lead_count: 15,
        priority_leads: 3,
        bottlenecks: ['viewing_availability', 'documentation']
      },
      description: 'Coordinate pipeline and optimize agent workflow'
    },
    {
      name: 'General Assistant',
      agent: 'general',
      icon: '🤖',
      data: {
        query: 'What are the current market trends in Dubai real estate?',
        context: 'client_consultation',
        urgency: 'medium'
      },
      description: 'Ask general questions to AI assistant'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg border">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
          <h2 className="text-2xl font-bold mb-2">🤖 n8n AI Agent Integration Test</h2>
          <p className="text-blue-100">
            Test your React dashboard → n8n workflow communication with Dubai real estate scenarios
          </p>
        </div>

        <div className="p-6">
          {/* Connection Status */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">🔗 Connection Details:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Webhook URL:</span>
                <p className="text-gray-800 font-mono break-all">{N8N_WEBHOOK_URL}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Status:</span>
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  ✅ Ready to Test
                </span>
              </div>
            </div>
          </div>

          {/* Test Scenarios Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {testScenarios.map((scenario) => (
              <div key={scenario.agent} className="border rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-blue-300">
                <div className="flex items-start space-x-3 mb-3">
                  <span className="text-2xl">{scenario.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{scenario.name}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{scenario.description}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => testAgent(scenario.agent, scenario.data)}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? '⏳ Testing...' : '🚀 Test Agent'}
                </button>
              </div>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8 bg-blue-50 rounded-lg mb-6">
              <div className="inline-flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <div>
                  <p className="text-blue-800 font-medium">Communicating with AI Agent...</p>
                  <p className="text-blue-600 text-sm">Processing your request through n8n workflow</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <span className="text-xl">❌</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-red-800 mb-2">Connection Error</h4>
                  <p className="text-red-700 text-sm mb-3">{error}</p>
                  <div className="bg-red-100 p-3 rounded text-sm text-red-700">
                    <strong>Troubleshooting Steps:</strong>
                    <ul className="mt-2 ml-4 list-disc space-y-1">
                      <li>Ensure n8n is running at: <code className="bg-red-200 px-1 rounded">{N8N_WEBHOOK_URL}</code></li>
                      <li>Check the "Dashboard Webhook - Quick Start" workflow is <strong>active</strong> in n8n</li>
                      <li>Verify the webhook path is set to <code className="bg-red-200 px-1 rounded">/dashboard</code></li>
                      <li>Check browser developer console for detailed error logs</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success Response */}
          {response && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start space-x-3 mb-4">
                <span className="text-xl">✅</span>
                <h4 className="font-semibold text-green-800">Agent Response Received Successfully!</h4>
              </div>
              
              <div className="bg-white rounded-lg p-4 border">
                {/* Response Header */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pb-4 border-b">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Agent:</span>
                    <p className="text-gray-900 font-medium">{response.agent}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Status:</span>
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      {response.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Response Time:</span>
                    <p className="text-gray-900 text-sm">{new Date(response.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>

                {/* Main Message */}
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-600">AI Response:</span>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-900 leading-relaxed">{response.message}</p>
                  </div>
                </div>

                {/* Additional Data */}
                {Object.keys(response).filter(key => 
                  !['agent', 'action', 'message', 'timestamp', 'status'].includes(key)
                ).length > 0 && (
                  <div className="mt-4">
                    <span className="text-sm font-medium text-gray-600">Additional Agent Data:</span>
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <pre className="text-xs text-gray-700 overflow-auto leading-relaxed">
                        {JSON.stringify(
                          Object.fromEntries(
                            Object.entries(response).filter(([key]) => 
                              !['agent', 'action', 'message', 'timestamp', 'status'].includes(key)
                            )
                          ), 
                          null, 
                          2
                        )}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Next Steps Guide */}
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
              <span className="mr-2">🚀</span>
              Integration Success - Next Steps
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                <h5 className="font-medium mb-2">✅ If Tests Pass:</h5>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>Your n8n integration is working perfectly!</li>
                  <li>Import the full AI Agent workflows</li>
                  <li>Set up WhatsApp Business API</li>
                  <li>Configure OpenAI credentials in n8n</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">🎯 Ready for Business:</h5>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>Start conducting client demos</li>
                  <li>Target AED 4,997 setup + AED 1,497/month</li>
                  <li>Position as "AI Agent Team"</li>
                  <li>Close first clients this week!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default N8nIntegrationTest;