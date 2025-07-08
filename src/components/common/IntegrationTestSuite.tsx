import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Loader, 
  Database, 
  Wifi, 
  Users, 
  MessageSquare,
  Activity,
  RefreshCw
} from 'lucide-react';
import { useAuth, useLeads, useWhatsAppMessages, useDashboardMetrics } from '../../hooks';
import { DatabaseService } from '../../services/databaseService';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error' | 'warning';
  message: string;
  duration?: number;
  details?: any;
}

interface IntegrationTestSuiteProps {
  onComplete?: (results: TestResult[]) => void;
}

const IntegrationTestSuite: React.FC<IntegrationTestSuiteProps> = ({ onComplete }) => {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');

  const { user, isAuthenticated } = useAuth();
  const { leads, loading: leadsLoading, error: leadsError } = useLeads();
  const { messages, loading: messagesLoading, error: messagesError } = useWhatsAppMessages();
  const { metrics, loading: metricsLoading, error: metricsError } = useDashboardMetrics();

  const addTestResult = (result: TestResult) => {
    setTests(prev => [...prev, result]);
  };

  const updateLastTest = (updates: Partial<TestResult>) => {
    setTests(prev => {
      const updated = [...prev];
      if (updated.length > 0) {
        updated[updated.length - 1] = { ...updated[updated.length - 1], ...updates };
      }
      return updated;
    });
  };

  const runTest = async (name: string, testFn: () => Promise<any>): Promise<TestResult> => {
    setCurrentTest(name);
    const startTime = Date.now();
    
    addTestResult({
      name,
      status: 'pending',
      message: 'Running...'
    });

    try {
      const result = await testFn();
      const duration = Date.now() - startTime;
      
      const testResult: TestResult = {
        name,
        status: 'success',
        message: 'Passed',
        duration,
        details: result
      };
      
      updateLastTest(testResult);
      return testResult;
    } catch (error) {
      const duration = Date.now() - startTime;
      const testResult: TestResult = {
        name,
        status: 'error',
        message: error instanceof Error ? error.message : 'Test failed',
        duration,
        details: error
      };
      
      updateLastTest(testResult);
      return testResult;
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTests([]);
    setCurrentTest('');

    try {
      // Test 1: Authentication
      await runTest('Authentication Check', async () => {
        if (!isAuthenticated || !user) {
          throw new Error('User not authenticated');
        }
        return { user: user.email, clientId: user.profile?.client_id };
      });

      // Test 2: Database Connection
      await runTest('Database Connection', async () => {
        const { data, error } = await DatabaseService.analytics.getDashboardMetrics();
        if (error) throw new Error(`Database connection failed: ${error}`);
        return data;
      });

      // Test 3: Leads Service
      await runTest('Leads Service', async () => {
        if (leadsError) throw new Error(`Leads error: ${leadsError}`);
        const leadsData = await DatabaseService.leads.getAll();
        return { count: leadsData.length, sample: leadsData.slice(0, 2) };
      });

      // Test 4: WhatsApp Messages Service
      await runTest('WhatsApp Messages Service', async () => {
        if (messagesError) throw new Error(`Messages error: ${messagesError}`);
        const messagesData = await DatabaseService.whatsapp.getAll();
        return { count: messagesData.length, sample: messagesData.slice(0, 2) };
      });

      // Test 5: Real-time Subscriptions
      await runTest('Real-time Subscriptions', async () => {
        return new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Real-time test timeout'));
          }, 3000);

          // Test real-time subscription
          const subscription = DatabaseService.leads.subscribeToChanges((payload) => {
            clearTimeout(timeout);
            subscription.unsubscribe();
            resolve({ eventType: payload.eventType, realTime: true });
          });

          // Create a test lead to trigger the subscription
          DatabaseService.leads.create({
            name: 'Test User',
            email: 'test@example.com',
            phone: '+971501234567',
            status: 'new',
            source: 'website'
          }).catch(reject);
        });
      });

      // Test 6: Metrics Calculation
      await runTest('Metrics Calculation', async () => {
        if (metricsError) throw new Error(`Metrics error: ${metricsError}`);
        const metricsData = await DatabaseService.analytics.getDashboardMetrics();
        
        if (typeof metricsData.totalLeads !== 'number') {
          throw new Error('Invalid metrics data structure');
        }
        
        return metricsData;
      });

      // Test 7: Data Consistency
      await runTest('Data Consistency', async () => {
        const [leadsData, metricsData] = await Promise.all([
          DatabaseService.leads.getAll(),
          DatabaseService.analytics.getDashboardMetrics()
        ]);

        if (leadsData.length !== metricsData.totalLeads) {
          throw new Error(`Data inconsistency: Leads count (${leadsData.length}) doesn't match metrics (${metricsData.totalLeads})`);
        }

        return { consistent: true, leadCount: leadsData.length };
      });

      // Test 8: Performance Test
      await runTest('Performance Test', async () => {
        const startTime = Date.now();
        
        await Promise.all([
          DatabaseService.leads.getAll(),
          DatabaseService.whatsapp.getAll(),
          DatabaseService.analytics.getDashboardMetrics()
        ]);
        
        const duration = Date.now() - startTime;
        
        if (duration > 2000) {
          throw new Error(`Performance issue: Operations took ${duration}ms (expected < 2000ms)`);
        }
        
        return { duration, performance: 'good' };
      });

    } catch (error) {
      console.error('Test suite failed:', error);
    } finally {
      setIsRunning(false);
      setCurrentTest('');
      
      if (onComplete) {
        onComplete(tests);
      }
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <Loader className="h-4 w-4 animate-spin text-blue-600" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return 'border-blue-200 bg-blue-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const successCount = tests.filter(t => t.status === 'success').length;
  const errorCount = tests.filter(t => t.status === 'error').length;
  const overallStatus = errorCount > 0 ? 'error' : tests.length > 0 && successCount === tests.length ? 'success' : 'pending';

  useEffect(() => {
    // Auto-run tests on component mount
    if (isAuthenticated && !isRunning && tests.length === 0) {
      setTimeout(() => runAllTests(), 1000);
    }
  }, [isAuthenticated]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Database className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Integration Test Suite</h2>
            <p className="text-sm text-gray-600">Comprehensive testing of Supabase integration</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {tests.length > 0 && (
            <div className="text-sm">
              <span className="text-green-600 font-medium">{successCount} passed</span>
              {errorCount > 0 && (
                <span className="text-red-600 font-medium ml-2">{errorCount} failed</span>
              )}
            </div>
          )}
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Running Tests...' : 'Run Tests'}</span>
          </button>
        </div>
      </div>

      {/* Overall Status */}
      {tests.length > 0 && (
        <div className={`p-4 rounded-lg mb-6 border-2 ${getStatusColor(overallStatus)}`}>
          <div className="flex items-center space-x-2">
            {getStatusIcon(overallStatus)}
            <span className="font-medium">
              Overall Status: {overallStatus === 'success' ? 'All tests passed!' : 
                               overallStatus === 'error' ? 'Some tests failed' : 
                               'Tests in progress...'}
            </span>
          </div>
          {overallStatus === 'success' && (
            <p className="text-sm text-green-700 mt-2">
              ✅ Supabase integration is working perfectly! All features are operational.
            </p>
          )}
        </div>
      )}

      {/* Current Test Status */}
      {isRunning && currentTest && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <Loader className="h-4 w-4 animate-spin text-blue-600" />
            <span className="text-blue-800 font-medium">Currently running: {currentTest}</span>
          </div>
        </div>
      )}

      {/* Test Results */}
      <div className="space-y-3">
        {tests.length === 0 && !isRunning && (
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>Click "Run Tests" to start the integration test suite</p>
          </div>
        )}

        {tests.map((test, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${getStatusColor(test.status)} transition-all duration-200`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(test.status)}
                <div>
                  <h3 className="font-medium text-gray-900">{test.name}</h3>
                  <p className="text-sm text-gray-600">{test.message}</p>
                </div>
              </div>
              {test.duration && (
                <span className="text-xs text-gray-500">{test.duration}ms</span>
              )}
            </div>
            
            {test.details && test.status === 'success' && (
              <div className="mt-2 text-xs text-gray-600 bg-white bg-opacity-50 rounded p-2">
                <pre className="overflow-x-auto">
                  {JSON.stringify(test.details, null, 2)}
                </pre>
              </div>
            )}
            
            {test.status === 'error' && (
              <div className="mt-2 text-xs text-red-700 bg-red-100 rounded p-2">
                Error details: {test.details?.message || test.message}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      {tests.length > 0 && !isRunning && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-lg font-bold text-green-800">{successCount}</div>
              <div className="text-sm text-green-600">Tests Passed</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <div className="text-lg font-bold text-red-800">{errorCount}</div>
              <div className="text-sm text-red-600">Tests Failed</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-lg font-bold text-blue-800">{tests.length}</div>
              <div className="text-sm text-blue-600">Total Tests</div>
            </div>
          </div>
        </div>
      )}

      {/* Integration Status */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Integration Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center space-x-2 text-sm">
            <Wifi className={`h-4 w-4 ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`} />
            <span>Auth: {isAuthenticated ? 'Connected' : 'Disconnected'}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Users className={`h-4 w-4 ${!leadsLoading && !leadsError ? 'text-green-600' : 'text-red-600'}`} />
            <span>Leads: {!leadsLoading && !leadsError ? `${leads.length} loaded` : 'Error'}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <MessageSquare className={`h-4 w-4 ${!messagesLoading && !messagesError ? 'text-green-600' : 'text-red-600'}`} />
            <span>Messages: {!messagesLoading && !messagesError ? `${messages.length} loaded` : 'Error'}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Activity className={`h-4 w-4 ${!metricsLoading && !metricsError ? 'text-green-600' : 'text-red-600'}`} />
            <span>Metrics: {!metricsLoading && !metricsError ? 'Active' : 'Error'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationTestSuite;