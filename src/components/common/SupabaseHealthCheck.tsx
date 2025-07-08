import React, { useState, useEffect } from 'react'
import { runComprehensiveHealthCheck, quickHealthCheck, type HealthCheckResult } from '../../utils/supabaseHealthCheck'
import { generateTroubleshootingGuide } from '../../utils/troubleshootingGuide'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Activity, 
  RefreshCw, 
  Database, 
  Shield, 
  Wifi,
  Clock,
  AlertCircle
} from 'lucide-react'

interface HealthCheckProps {
  onHealthChange?: (healthy: boolean) => void
  showDetails?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
}

export const SupabaseHealthCheck: React.FC<HealthCheckProps> = ({
  onHealthChange,
  showDetails = true,
  autoRefresh = false,
  refreshInterval = 30000 // 30 seconds
}) => {
  const [healthResult, setHealthResult] = useState<HealthCheckResult | null>(null)
  const [quickHealth, setQuickHealth] = useState<{ healthy: boolean; message: string; issues: string[] } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [troubleshootingGuides, setTroubleshootingGuides] = useState<any[]>([])
  const [expandedChecks, setExpandedChecks] = useState<Set<string>>(new Set())

  // Run comprehensive health check
  const runHealthCheck = async () => {
    setIsLoading(true)
    try {
      const result = await runComprehensiveHealthCheck()
      setHealthResult(result)
      setLastChecked(new Date())
      
      // Generate troubleshooting guides if there are issues
      if (result.overall !== 'healthy') {
        const guides = generateTroubleshootingGuide(result)
        setTroubleshootingGuides(guides)
      } else {
        setTroubleshootingGuides([])
      }
      
      // Notify parent component
      onHealthChange?.(result.overall === 'healthy')
    } catch (error) {
      console.error('Health check failed:', error)
      setHealthResult({
        timestamp: new Date().toISOString(),
        overall: 'critical',
        checks: {
          error: {
            status: 'fail',
            message: `Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
          }
        },
        summary: { total: 1, passed: 0, failed: 1, warnings: 0 }
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Run quick health check
  const runQuickCheck = async () => {
    try {
      const result = await quickHealthCheck()
      setQuickHealth(result)
      onHealthChange?.(result.healthy)
    } catch (error) {
      console.error('Quick health check failed:', error)
      setQuickHealth({
        healthy: false,
        message: 'Quick check failed',
        issues: [error instanceof Error ? error.message : 'Unknown error']
      })
    }
  }

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(runQuickCheck, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval])

  // Initial health check
  useEffect(() => {
    runQuickCheck()
    if (showDetails) {
      runHealthCheck()
    }
  }, [showDetails])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      default:
        return <Activity className="w-5 h-5 text-gray-500" />
    }
  }

  const getOverallStatusColor = (overall: string) => {
    switch (overall) {
      case 'healthy':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getOverallStatusIcon = (overall: string) => {
    switch (overall) {
      case 'healthy':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />
      case 'critical':
        return <XCircle className="w-6 h-6 text-red-500" />
      default:
        return <Activity className="w-6 h-6 text-gray-500" />
    }
  }

  const toggleCheckExpansion = (checkId: string) => {
    const newExpanded = new Set(expandedChecks)
    if (newExpanded.has(checkId)) {
      newExpanded.delete(checkId)
    } else {
      newExpanded.add(checkId)
    }
    setExpandedChecks(newExpanded)
  }

  return (
    <div className="space-y-6">
      {/* Quick Health Status */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Database className="w-6 h-6 text-blue-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Database Connection</h3>
              <p className="text-sm text-gray-600">
                {quickHealth ? quickHealth.message : 'Checking connection...'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {quickHealth && (
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                quickHealth.healthy 
                  ? 'text-green-700 bg-green-100' 
                  : 'text-red-700 bg-red-100'
              }`}>
                {quickHealth.healthy ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                {quickHealth.healthy ? 'Connected' : 'Disconnected'}
              </div>
            )}
            <button
              onClick={runQuickCheck}
              disabled={isLoading}
              className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        
        {quickHealth?.issues && quickHealth.issues.length > 0 && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
              <div className="text-sm text-red-700">
                <p className="font-medium">Issues detected:</p>
                <ul className="mt-1 space-y-1">
                  {quickHealth.issues.map((issue, index) => (
                    <li key={index} className="text-red-600">• {issue}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Health Check */}
      {showDetails && (
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Activity className="w-6 h-6 text-blue-500" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Comprehensive Health Check</h3>
                  <p className="text-sm text-gray-600">
                    Last checked: {lastChecked ? lastChecked.toLocaleTimeString() : 'Never'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {healthResult && (
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${getOverallStatusColor(healthResult.overall)}`}>
                    {getOverallStatusIcon(healthResult.overall)}
                    <span className="capitalize">{healthResult.overall}</span>
                  </div>
                )}
                <button
                  onClick={runHealthCheck}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center space-x-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Run Check</span>
                </button>
              </div>
            </div>
          </div>

          {healthResult && (
            <div className="p-4">
              {/* Summary */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{healthResult.summary.passed}</div>
                  <div className="text-sm text-green-700">Passed</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{healthResult.summary.failed}</div>
                  <div className="text-sm text-red-700">Failed</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{healthResult.summary.warnings}</div>
                  <div className="text-sm text-yellow-700">Warnings</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">{healthResult.summary.total}</div>
                  <div className="text-sm text-gray-700">Total</div>
                </div>
              </div>

              {/* Individual Checks */}
              <div className="space-y-3">
                {Object.entries(healthResult.checks).map(([checkId, check]) => (
                  <div key={checkId} className="border rounded-lg">
                    <button
                      onClick={() => toggleCheckExpansion(checkId)}
                      className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(check.status)}
                        <div className="text-left">
                          <h4 className="font-medium text-gray-900 capitalize">
                            {checkId.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          <p className="text-sm text-gray-600">{check.message}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {check.duration && (
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>{check.duration}ms</span>
                          </div>
                        )}
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          check.status === 'pass' ? 'bg-green-100 text-green-700' :
                          check.status === 'fail' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {check.status}
                        </div>
                      </div>
                    </button>
                    
                    {expandedChecks.has(checkId) && check.details && (
                      <div className="px-4 pb-4 border-t bg-gray-50">
                        <pre className="text-sm text-gray-700 overflow-x-auto">
                          {JSON.stringify(check.details, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Troubleshooting Guides */}
      {troubleshootingGuides.length > 0 && (
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <h3 className="text-lg font-semibold text-gray-900">Troubleshooting Guides</h3>
            </div>
          </div>
          <div className="p-4 space-y-4">
            {troubleshootingGuides.map((guide, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{guide.issue}</h4>
                <div className="space-y-3">
                  {guide.solutions.map((solution) => (
                    <div key={solution.id} className="bg-gray-50 rounded-lg p-3">
                      <h5 className="font-medium text-gray-800 mb-2">{solution.title}</h5>
                      <p className="text-sm text-gray-600 mb-3">{solution.description}</p>
                      <div className="space-y-2">
                        {solution.steps.map((step, stepIndex) => (
                          <div key={stepIndex} className="flex items-start space-x-2">
                            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                              {stepIndex + 1}
                            </span>
                            <span className="text-sm text-gray-700">{step}</span>
                          </div>
                        ))}
                      </div>
                      {solution.codeExample && (
                        <div className="mt-3">
                          <pre className="text-xs bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto">
                            {solution.codeExample}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SupabaseHealthCheck 