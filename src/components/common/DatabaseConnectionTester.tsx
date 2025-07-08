import React, { useState, useEffect } from 'react'
import { 
  Database, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Loader2, 
  RefreshCw, 
  Server,
  Zap,
  Cloud,
  Activity
} from 'lucide-react'
import { browserDatabaseManager, type DatabaseConnectionStatus } from '../services/browserDatabaseManager'

/**
 * Comprehensive Database Connection Testing Component
 * Tests and displays status of all database services
 */

// Use DatabaseConnectionStatus from browserDatabaseManager
type TestResult = DatabaseConnectionStatus & { name?: string }

const DatabaseConnectionTester: React.FC = () => {
  const [testResults, setTestResults] = useState<DatabaseConnectionStatus[]>([])
  const [isRunningTests, setIsRunningTests] = useState(false)
  const [selectedTest, setSelectedTest] = useState<string | null>(null)
  const [customTestResult, setCustomTestResult] = useState<TestResult | null>(null)
  const [overallStatus, setOverallStatus] = useState<'healthy' | 'degraded' | 'critical'>('healthy')

  // Auto-run tests on component mount
  useEffect(() => {
    runFullConnectionTests()
  }, [])

  const runFullConnectionTests = async () => {
    setIsRunningTests(true)
    setTestResults([])
    
    try {
      console.log('🧪 Running comprehensive database connection tests...')
      const results = await browserDatabaseManager.runAllTests()
      
      // Add Redis status (server-side only)
      const redisStatus: DatabaseConnectionStatus = {
        service: 'Redis Cache',
        status: 'warning',
        message: 'Cache layer - server-side only (not testable from browser)',
        details: {
          connection: 'Server-side only',
          purpose: 'Caching, sessions, real-time notifications',
          note: 'Redis health must be monitored on the server',
          fallback: 'Application works without Redis (reduced performance)'
        }
      }
      
      const allResults = [...results, redisStatus]
      setTestResults(allResults)
      
      // Calculate overall status
      const connectedCount = allResults.filter(r => r.status === 'connected').length
      const totalCount = allResults.length
      
      if (connectedCount >= 3) {
        setOverallStatus('healthy')
      } else if (connectedCount >= 2) {
        setOverallStatus('degraded')
      } else {
        setOverallStatus('critical')
      }
      
      console.log('✅ Database tests completed:', allResults)
    } catch (error) {
      console.error('❌ Database tests failed:', error)
    } finally {
      setIsRunningTests(false)
    }
  }

  const runCustomTest = async (operation: string) => {
    setSelectedTest(operation)
    setCustomTestResult({ service: operation, status: 'testing', message: 'Running test...', name: operation })
    
    try {
      let result: DatabaseConnectionStatus
      
      switch (operation) {
        case 'supabase_test':
          result = await browserDatabaseManager.testSupabaseConnection()
          break
        case 'postgres_test':
          result = await browserDatabaseManager.testPostgreSQLViaSupabase()
          break
        case 'n8n_test':
          result = await browserDatabaseManager.testN8nConnection()
          break
        case 'database_operations':
          result = await browserDatabaseManager.testDatabaseOperations()
          break
        default:
          throw new Error(`Unknown operation: ${operation}`)
      }
      
      setCustomTestResult({ ...result, name: operation })
    } catch (error) {
      setCustomTestResult({
        service: operation,
        status: 'error',
        message: `Test failed: ${error.message}`,
        details: { error: error.message },
        name: operation
      })
    }
  }

  const getStatusIcon = (status: DatabaseConnectionStatus['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'testing':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
      default:
        return <Database className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: DatabaseConnectionStatus['status']) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'error':
        return 'border-red-200 bg-red-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
      case 'testing':
        return 'border-blue-200 bg-blue-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  const ServiceCard: React.FC<{ test: TestResult; icon: React.ReactNode }> = ({ test, icon }) => (
    <div className={`p-6 rounded-lg border-2 transition-all duration-200 ${getStatusColor(test.status)}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {icon}
          <h3 className="font-semibold text-gray-900">{test.name || test.service}</h3>
        </div>
        {getStatusIcon(test.status)}
      </div>
      
      <p className="text-sm text-gray-700 mb-3">{test.message}</p>
      
      {test.responseTime && (
        <div className="text-xs text-gray-500 mb-2">
          Response Time: {test.responseTime}ms
        </div>
      )}
      
      {test.details && (
        <details className="text-xs text-gray-600">
          <summary className="cursor-pointer hover:text-gray-800">Show Details</summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
            {JSON.stringify(test.details, null, 2)}
          </pre>
        </details>
      )}
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Database Connection Center
        </h1>
        <p className="text-gray-600">
          Monitor and test all database connections for Dubai Real Estate AI Platform
        </p>
      </div>

      {/* Overall Status */}
      {testResults.length > 0 && (
        <div className={`p-6 rounded-lg border-2 ${getStatusColor(overallStatus)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Activity className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-semibold">System Status</h2>
                <p className="text-sm text-gray-600">
                  {testResults.filter(r => r.status === 'connected').length}/{testResults.length} services operational
                </p>
              </div>
            </div>
            {getStatusIcon(overallStatus)}
          </div>
          <p className="mt-3 text-gray-700">
            {overallStatus === 'healthy' && 'All systems operational'}
            {overallStatus === 'degraded' && 'Some systems offline - reduced functionality'}
            {overallStatus === 'critical' && 'Critical systems offline - limited functionality'}
          </p>
        </div>
      )}

      {/* Test Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={runFullConnectionTests}
          disabled={isRunningTests}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isRunningTests ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <RefreshCw className="w-5 h-5" />
          )}
          <span>{isRunningTests ? 'Testing...' : 'Run All Tests'}</span>
        </button>
      </div>

      {/* Service Status Cards */}
      {testResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testResults.map((result, index) => {
            const icons = {
              'Supabase': <Cloud className="w-6 h-6 text-green-600" />,
              'PostgreSQL': <Database className="w-6 h-6 text-blue-600" />,
              'Redis Cache': <Zap className="w-6 h-6 text-red-600" />,
              'n8n Automation': <Server className="w-6 h-6 text-purple-600" />,
              'Database Operations': <Database className="w-6 h-6 text-indigo-600" />
            }
            
            return (
              <ServiceCard 
                key={index}
                test={result} 
                icon={icons[result.service] || <Database className="w-6 h-6 text-gray-600" />}
              />
            )
          })}
        </div>
      )}

      {/* Custom Operation Tests */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Database Operation Tests</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <button
            onClick={() => runCustomTest('supabase_test')}
            disabled={selectedTest === 'supabase_test' && customTestResult?.status === 'testing'}
            className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="font-medium">Supabase Test</div>
            <div className="text-sm text-gray-600">Test Supabase connection</div>
          </button>
          
          <button
            onClick={() => runCustomTest('postgres_test')}
            disabled={selectedTest === 'postgres_test' && customTestResult?.status === 'testing'}
            className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="font-medium">PostgreSQL Test</div>
            <div className="text-sm text-gray-600">Test database access</div>
          </button>
          
          <button
            onClick={() => runCustomTest('n8n_test')}
            disabled={selectedTest === 'n8n_test' && customTestResult?.status === 'testing'}
            className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="font-medium">n8n Test</div>
            <div className="text-sm text-gray-600">Test automation engine</div>
          </button>
          
          <button
            onClick={() => runCustomTest('database_operations')}
            disabled={selectedTest === 'database_operations' && customTestResult?.status === 'testing'}
            className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="font-medium">CRUD Operations</div>
            <div className="text-sm text-gray-600">Test database operations</div>
          </button>
        </div>

        {/* Custom Test Results */}
        {customTestResult && (
          <div className={`p-4 rounded-lg border ${getStatusColor(customTestResult.status)}`}>
            <div className="flex items-center space-x-2 mb-2">
              {getStatusIcon(customTestResult.status)}
              <span className="font-medium">{customTestResult.name || customTestResult.service}</span>
              {customTestResult.responseTime && (
                <span className="text-sm text-gray-500">({customTestResult.responseTime}ms)</span>
              )}
            </div>
            <p className="text-sm text-gray-700">{customTestResult.message}</p>
            {customTestResult.details && (
              <details className="mt-2">
                <summary className="text-xs cursor-pointer text-gray-600">Details</summary>
                <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">
                  {JSON.stringify(customTestResult.details, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}
      </div>

      {/* Configuration Information */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Database Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-700">Supabase URL</div>
            <div className="text-gray-600 truncate">{import.meta.env.VITE_SUPABASE_URL || 'Not configured'}</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">n8n API URL</div>
            <div className="text-gray-600 truncate">{import.meta.env.VITE_N8N_API_URL || 'Not configured'}</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Environment</div>
            <div className="text-gray-600">{import.meta.env.MODE}</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Client ID</div>
            <div className="text-gray-600">{import.meta.env.VITE_CLIENT_ID || 'demo-client'}</div>
          </div>
        </div>
      </div>

      {/* Connection Architecture Diagram */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Database Architecture</h3>
        <div className="text-center">
          <div className="inline-flex flex-col space-y-4 text-sm">
            <div className="p-3 bg-blue-100 rounded-lg border border-blue-200">
              <strong>React Dashboard</strong><br />
              (Frontend - Browser)
            </div>
            <div className="text-gray-400">↕️ HTTPS/WebSocket</div>
            <div className="p-3 bg-green-100 rounded-lg border border-green-200">
              <strong>Supabase</strong><br />
              (API Gateway + Auth + Real-time)
            </div>
            <div className="text-gray-400">↕️ Internal Network</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-purple-100 rounded-lg border border-purple-200">
                <strong>PostgreSQL</strong><br />
                (Primary Database)
              </div>
              <div className="p-3 bg-red-100 rounded-lg border border-red-200">
                <strong>Redis</strong><br />
                (Cache + Sessions)
              </div>
            </div>
            <div className="text-gray-400">↔️ n8n Integration</div>
            <div className="p-3 bg-yellow-100 rounded-lg border border-yellow-200">
              <strong>n8n Workflows</strong><br />
              (Automation Engine)
            </div>
          </div>
        </div>
      </div>

      {/* Troubleshooting Guide */}
      <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6">
        <h3 className="text-lg font-semibold mb-4 text-yellow-800">Troubleshooting Guide</h3>
        <div className="space-y-3 text-sm text-yellow-700">
          <div>
            <strong>If Supabase fails:</strong> Check if https://supabase.yasta.online is accessible and verify API keys
          </div>
          <div>
            <strong>If PostgreSQL fails:</strong> Supabase should handle this automatically - check Coolify logs
          </div>
          <div>
            <strong>If Redis shows warning:</strong> Normal for browser environment - Redis works server-side only
          </div>
          <div>
            <strong>If n8n fails:</strong> Check if https://n8n.yasta.online is running in Coolify
          </div>
          <div>
            <strong>Overall system degraded:</strong> Platform will work with reduced functionality - prioritize Supabase connection
          </div>
        </div>
      </div>
    </div>
  )
}

export default DatabaseConnectionTester
