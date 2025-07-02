import React, { useState, useEffect } from 'react';
import { Database, Wifi, WifiOff, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ConnectionStatus {
  connected: boolean;
  agents: number;
  omarFound: boolean;
  lastChecked: Date;
  error?: string;
  latency?: number;
}

const DatabaseTest: React.FC = () => {
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [useMockData, setUseMockData] = useState(
    import.meta.env.VITE_MOCK_DATA === 'true'
  );

  const checkConnection = async () => {
    setIsChecking(true);
    const startTime = Date.now();

    try {
      // Test API health endpoint
      const response = await fetch(`${import.meta.env.VITE_API_URL}/health`);
      const latency = Date.now() - startTime;

      if (response.ok) {
        const healthData = await response.json();
        
        // Try to fetch agents to test full functionality
        try {
          const agentsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/agents`);
          if (agentsResponse.ok) {
            const agents = await agentsResponse.json();
            const omarFound = agents.some((agent: any) => 
              agent.name.includes('Omar') && agent.specialty.includes('Lead')
            );

            setStatus({
              connected: true,
              agents: agents.length,
              omarFound,
              lastChecked: new Date(),
              latency
            });
          } else {
            throw new Error('Failed to fetch agents data');
          }
        } catch (agentError) {
          setStatus({
            connected: true,
            agents: 0,
            omarFound: false,
            lastChecked: new Date(),
            latency,
            error: 'API connected but agents data unavailable'
          });
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      setStatus({
        connected: false,
        agents: 0,
        omarFound: false,
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsChecking(false);
    }
  };

  const toggleDataSource = () => {
    setUseMockData(!useMockData);
    // In a real app, you'd update environment or reload the page
    window.location.reload();
  };

  useEffect(() => {
    // Auto-check on component mount
    checkConnection();
  }, []);

  const getStatusIcon = () => {
    if (isChecking) {
      return <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />;
    }
    
    if (!status) {
      return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }

    if (status.connected && status.omarFound) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (status.connected) {
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    } else {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    if (!status) return 'border-gray-200';
    if (status.connected && status.omarFound) return 'border-green-200 bg-green-50';
    if (status.connected) return 'border-yellow-200 bg-yellow-50';
    return 'border-red-200 bg-red-50';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Database className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Database Connection</h3>
        </div>
        <button
          onClick={checkConnection}
          disabled={isChecking}
          className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {isChecking ? 'Checking...' : 'Test Connection'}
        </button>
      </div>

      {/* Data Source Toggle */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Data Source:</span>
          <button
            onClick={toggleDataSource}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              useMockData 
                ? 'bg-gray-200 text-gray-700' 
                : 'bg-blue-100 text-blue-700'
            }`}
          >
            {useMockData ? '📊 Mock Data' : '🗄️ Real Database'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {useMockData 
            ? 'Using mock data for development. Omar will show sample data.'
            : 'Connected to real database. Omar will show live data from PostgreSQL.'
          }
        </p>
      </div>

      {/* Connection Status */}
      <div className={`border rounded-lg p-4 ${getStatusColor()}`}>
        <div className="flex items-center space-x-2 mb-3">
          {getStatusIcon()}
          <span className="font-medium text-gray-900">
            {isChecking 
              ? 'Checking connection...' 
              : status?.connected 
                ? 'Database Connected' 
                : 'Connection Failed'
            }
          </span>
        </div>

        {status && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">API Endpoint:</span>
              <span className="font-mono text-xs">{import.meta.env.VITE_API_URL}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Response Time:</span>
              <span className={`font-medium ${
                status.latency && status.latency < 500 ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {status.latency ? `${status.latency}ms` : 'N/A'}
              </span>
            </div>

            {status.connected && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">AI Agents Found:</span>
                  <span className="font-medium text-blue-600">{status.agents}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Omar Hassan:</span>
                  <span className={`font-medium ${
                    status.omarFound ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {status.omarFound ? '✅ Active' : '⚠️ Not Found'}
                  </span>
                </div>
              </>
            )}

            {status.error && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                <p className="text-red-700 text-xs">{status.error}</p>
              </div>
            )}

            <div className="flex justify-between text-xs text-gray-500">
              <span>Last checked:</span>
              <span>{status.lastChecked.toLocaleTimeString()}</span>
            </div>
          </div>
        )}

        {!status && !isChecking && (
          <p className="text-sm text-gray-600">
            Click "Test Connection" to check database connectivity
          </p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => window.open('/health', '_blank')}
          className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          View API Health
        </button>
        {status?.connected && (
          <button
            onClick={() => window.open('/api/agents', '_blank')}
            className="flex-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            View Agents API
          </button>
        )}
      </div>

      {/* Omar Status Card */}
      {status?.omarFound && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎯</span>
            <div>
              <p className="font-medium text-green-800">Omar Hassan Ready!</p>
              <p className="text-sm text-green-600">
                Lead Qualification Agent is operational and ready to process leads
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseTest;
