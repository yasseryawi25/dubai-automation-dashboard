import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, XCircle, AlertCircle, Settings, ExternalLink } from 'lucide-react';
import { backendIntegration } from '../../services/backendIntegration';

interface ConnectionTest {
  service: string;
  name: string;
  status: 'testing' | 'connected' | 'disconnected' | 'error';
  message: string;
  icon: React.ReactNode;
  setupUrl?: string;
}

const BackendConnectionTester: React.FC = () => {
  const [connections, setConnections] = useState<ConnectionTest[]>([
    {
      service: 'database',
      name: 'Supabase Database',
      status: 'testing',
      message: 'Checking connection...',
      icon: '🗄️',
      setupUrl: 'https://supabase.com'
    },
    {
      service: 'n8n',
      name: 'n8n Workflows',
      status: 'testing',
      message: 'Checking connection...',
      icon: '⚡',
      setupUrl: 'https://n8n.io'
    },
    {
      service: 'whatsapp',
      name: 'WhatsApp Business API',
      status: 'testing',
      message: 'Checking connection...',
      icon: '💬',
      setupUrl: 'https://business.whatsapp.com'
    },
    {
      service: 'vapi',
      name: 'VAPI Voice AI',
      status: 'testing',
      message: 'Checking connection...',
      icon: '🎤',
      setupUrl: 'https://vapi.ai'
    }
  ]);

  const [isTestingAll, setIsTestingAll] = useState(false);
  const [lastTestTime, setLastTestTime] = useState<Date | null>(null);

  useEffect(() => {
    // Auto-test on component mount
    testAllConnections();
  }, []);

  const testAllConnections = async () => {
    setIsTestingAll(true);
    setConnections(prev => prev.map(conn => ({
      ...conn,
      status: 'testing',
      message: 'Testing connection...'
    })));

    try {
      console.log('🔍 Starting comprehensive backend connection test...');
      
      const healthStatus = await backendIntegration.checkSystemHealth();
      
      setConnections(prev => prev.map(conn => {
        const serviceStatus = healthStatus[conn.service as keyof typeof healthStatus];
        return {
          ...conn,
          status: serviceStatus?.connected ? 'connected' : 'disconnected',
          message: serviceStatus?.message || 'Unknown status'
        };
      }));

      setLastTestTime(new Date());
      console.log('✅ Backend connection test completed');
    } catch (error) {
      console.error('❌ Backend connection test failed:', error);
      
      setConnections(prev => prev.map(conn => ({
        ...conn,
        status: 'error',
        message: 'Test failed: ' + error.message
      })));
    } finally {
      setIsTestingAll(false);
    }
  };

  const testSingleConnection = async (serviceKey: string) => {
    setConnections(prev => prev.map(conn => 
      conn.service === serviceKey 
        ? { ...conn, status: 'testing', message: 'Testing connection...' }
        : conn
    ));

    try {
      const healthStatus = await backendIntegration.checkSystemHealth();
      const serviceStatus = healthStatus[serviceKey as keyof typeof healthStatus];

      setConnections(prev => prev.map(conn => 
        conn.service === serviceKey 
          ? {
              ...conn,
              status: serviceStatus?.connected ? 'connected' : 'disconnected',
              message: serviceStatus?.message || 'Unknown status'
            }
          : conn
      ));
    } catch (error) {
      setConnections(prev => prev.map(conn => 
        conn.service === serviceKey 
          ? { ...conn, status: 'error', message: 'Test failed: ' + error.message }
          : conn
      ));
    }
  };

  const getStatusIcon = (status: ConnectionTest['status']) => {
    switch (status) {
      case 'testing':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'disconnected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: ConnectionTest['status']) => {
    switch (status) {
      case 'testing':
        return 'border-blue-200 bg-blue-50';
      case 'connected':
        return 'border-green-200 bg-green-50';
      case 'disconnected':
        return 'border-red-200 bg-red-50';
      case 'error':
        return 'border-orange-200 bg-orange-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const connectedCount = connections.filter(c => c.status === 'connected').length;
  const totalConnections = connections.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800">Backend Connections</h2>
          <p className="text-neutral-600 mt-1">
            Test and monitor your automation backend services
          </p>
        </div>
        <button
          onClick={testAllConnections}
          disabled={isTestingAll}
          className="flex items-center gap-2 px-4 py-2 bg-primary-gold text-white rounded-lg hover:bg-primary-gold-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${isTestingAll ? 'animate-spin' : ''}`} />
          {isTestingAll ? 'Testing...' : 'Test All'}
        </button>
      </div>

      {/* Status Overview */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-800">System Status</h3>
          <div className="flex items-center gap-2">
            {getStatusIcon(connectedCount === totalConnections ? 'connected' : 'disconnected')}
            <span className={`font-medium ${
              connectedCount === totalConnections ? 'text-green-600' : 'text-red-600'
            }`}>
              {connectedCount}/{totalConnections} Connected
            </span>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-gold h-2 rounded-full transition-all duration-500"
            style={{ width: `${(connectedCount / totalConnections) * 100}%` }}
          ></div>
        </div>
        
        {lastTestTime && (
          <p className="text-sm text-neutral-500 mt-2">
            Last tested: {lastTestTime.toLocaleString()}
          </p>
        )}
      </div>

      {/* Connection Tests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {connections.map((connection) => (
          <div
            key={connection.service}
            className={`border rounded-lg p-4 ${getStatusColor(connection.status)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{connection.icon}</span>
                <div>
                  <h4 className="font-medium text-neutral-800">
                    {connection.name}
                  </h4>
                  <p className="text-sm text-neutral-600 mt-1">
                    {connection.message}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(connection.status)}
                <button
                  onClick={() => testSingleConnection(connection.service)}
                  disabled={connection.status === 'testing'}
                  className="p-1 text-neutral-400 hover:text-neutral-600 disabled:opacity-50"
                  title="Test this connection"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex items-center gap-2">
              {connection.status === 'disconnected' && (
                <a
                  href={connection.setupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  <Settings className="w-4 h-4" />
                  Setup Guide
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              
              {connection.status === 'connected' && (
                <span className="flex items-center gap-1 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  Ready for automation
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Environment Configuration */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-neutral-800 mb-4">
          Environment Configuration
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-neutral-700">Mock Data Mode</span>
            <span className={`text-sm px-2 py-1 rounded ${
              import.meta.env.VITE_MOCK_DATA === 'true' 
                ? 'bg-orange-100 text-orange-700' 
                : 'bg-green-100 text-green-700'
            }`}>
              {import.meta.env.VITE_MOCK_DATA === 'true' ? 'Enabled (Demo)' : 'Disabled (Production)'}
            </span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-neutral-700">Environment</span>
            <span className="text-sm text-neutral-600">
              {import.meta.env.VITE_ENVIRONMENT || 'development'}
            </span>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium text-neutral-700">Debug Mode</span>
            <span className={`text-sm px-2 py-1 rounded ${
              import.meta.env.VITE_DEBUG === 'true' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700'
            }`}>
              {import.meta.env.VITE_DEBUG === 'true' ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
      </div>

      {/* Setup Instructions */}
      {connectedCount < totalConnections && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            ⚙️ Setup Required
          </h3>
          <p className="text-yellow-700 mb-4">
            Some backend services need configuration. Complete setup to enable full automation.
          </p>
          
          <div className="space-y-2">
            {connections
              .filter(conn => conn.status !== 'connected')
              .map(conn => (
                <div key={conn.service} className="flex items-center justify-between">
                  <span className="text-sm text-yellow-800">
                    {conn.name}: {conn.message}
                  </span>
                  {conn.setupUrl && (
                    <a
                      href={conn.setupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      Setup <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Success Message */}
      {connectedCount === totalConnections && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            🎉 All Systems Connected!
          </h3>
          <p className="text-green-700">
            Your AI Real Estate automation platform is fully operational. All backend services are connected and ready for automation.
          </p>
        </div>
      )}
    </div>
  );
};

export default BackendConnectionTester;