import React, { useState, useEffect, useRef } from 'react'
import { 
  Activity, 
  Wifi, 
  Database, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  BarChart3,
  Settings,
  Zap,
  Shield
} from 'lucide-react'
import { quickHealthCheck } from '../../utils/supabaseHealthCheck'
import { quickSchemaValidation } from '../../utils/databaseValidator'
import { quickPerformanceCheck } from '../../utils/performanceOptimizer'

interface DiagnosticMetric {
  name: string
  value: string | number
  status: 'good' | 'warning' | 'error'
  trend?: 'up' | 'down' | 'stable'
  description?: string
}

interface ConnectionStatus {
  timestamp: string
  healthy: boolean
  responseTime: number
  error?: string
}

interface DiagnosticData {
  connection: ConnectionStatus
  metrics: DiagnosticMetric[]
  alerts: string[]
  recommendations: string[]
}

export const ConnectionDiagnostics: React.FC = () => {
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticData | null>(null)
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [monitoringInterval, setMonitoringInterval] = useState(30000) // 30 seconds
  const [connectionHistory, setConnectionHistory] = useState<ConnectionStatus[]>([])
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Start monitoring
  const startMonitoring = () => {
    setIsMonitoring(true)
    runDiagnostics()
    
    intervalRef.current = setInterval(() => {
      runDiagnostics()
    }, monitoringInterval)
  }

  // Stop monitoring
  const stopMonitoring = () => {
    setIsMonitoring(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  // Run comprehensive diagnostics
  const runDiagnostics = async () => {
    const startTime = Date.now()
    const alerts: string[] = []
    const recommendations: string[] = []
    const metrics: DiagnosticMetric[] = []

    try {
      // Health check
      const healthResult = await quickHealthCheck()
      const responseTime = Date.now() - startTime

      const connection: ConnectionStatus = {
        timestamp: new Date().toISOString(),
        healthy: healthResult.healthy,
        responseTime,
        error: healthResult.issues.length > 0 ? healthResult.issues[0] : undefined
      }

      // Add to history (keep last 50 entries)
      setConnectionHistory(prev => {
        const newHistory = [...prev, connection].slice(-50)
        return newHistory
      })

      // Schema validation
      const schemaResult = await quickSchemaValidation()

      // Performance check
      const performanceResult = await quickPerformanceCheck()

      // Calculate metrics
      metrics.push({
        name: 'Response Time',
        value: `${responseTime}ms`,
        status: responseTime < 500 ? 'good' : responseTime < 1000 ? 'warning' : 'error',
        trend: getTrend(connectionHistory, 'responseTime'),
        description: 'Database query response time'
      })

      metrics.push({
        name: 'Connection Health',
        value: healthResult.healthy ? 'Connected' : 'Disconnected',
        status: healthResult.healthy ? 'good' : 'error',
        description: 'Overall connection status'
      })

      metrics.push({
        name: 'Schema Integrity',
        value: schemaResult.valid ? 'Valid' : 'Issues Found',
        status: schemaResult.valid ? 'good' : 'warning',
        description: 'Database schema validation'
      })

      metrics.push({
        name: 'Performance Rating',
        value: performanceResult.performance,
        status: performanceResult.performance === 'excellent' || performanceResult.performance === 'good' ? 'good' : 'warning',
        description: 'Query performance analysis'
      })

      // Calculate uptime
      const uptime = calculateUptime(connectionHistory)
      metrics.push({
        name: 'Uptime',
        value: `${uptime.toFixed(1)}%`,
        status: uptime > 99 ? 'good' : uptime > 95 ? 'warning' : 'error',
        description: 'Connection uptime over last 50 checks'
      })

      // Generate alerts
      if (!healthResult.healthy) {
        alerts.push('Database connection is down')
      }

      if (responseTime > 1000) {
        alerts.push('Response time is slow (>1s)')
      }

      if (!schemaResult.valid) {
        alerts.push('Schema validation issues detected')
      }

      if (performanceResult.performance === 'poor') {
        alerts.push('Performance issues detected')
      }

      if (uptime < 95) {
        alerts.push('Low uptime detected')
      }

      // Generate recommendations
      if (responseTime > 500) {
        recommendations.push('Consider optimizing database queries or adding indexes')
      }

      if (!schemaResult.valid) {
        recommendations.push('Review and fix database schema issues')
      }

      if (performanceResult.performance === 'poor' || performanceResult.performance === 'fair') {
        recommendations.push('Implement performance optimizations')
      }

      if (healthResult.issues.length > 0) {
        recommendations.push('Check network connectivity and Supabase configuration')
      }

      setDiagnosticData({
        connection,
        metrics,
        alerts,
        recommendations
      })

    } catch (error: any) {
      const connection: ConnectionStatus = {
        timestamp: new Date().toISOString(),
        healthy: false,
        responseTime: Date.now() - startTime,
        error: error.message
      }

      setConnectionHistory(prev => [...prev, connection].slice(-50))

      setDiagnosticData({
        connection,
        metrics: [{
          name: 'Error',
          value: 'Diagnostics Failed',
          status: 'error',
          description: error.message
        }],
        alerts: ['Diagnostic check failed'],
        recommendations: ['Check system configuration and try again']
      })
    }
  }

  // Calculate trend for metrics
  const getTrend = (history: ConnectionStatus[], metric: keyof ConnectionStatus): 'up' | 'down' | 'stable' => {
    if (history.length < 3) return 'stable'
    
    const recent = history.slice(-3)
    const values = recent.map(h => h[metric] as number)
    
    if (values[2] > values[1] && values[1] > values[0]) return 'up'
    if (values[2] < values[1] && values[1] < values[0]) return 'down'
    return 'stable'
  }

  // Calculate uptime percentage
  const calculateUptime = (history: ConnectionStatus[]): number => {
    if (history.length === 0) return 100
    
    const healthyCount = history.filter(h => h.healthy).length
    return (healthyCount / history.length) * 100
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  // Initial diagnostics
  useEffect(() => {
    runDiagnostics()
  }, [])

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity className="w-8 h-8 text-blue-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Connection Diagnostics</h1>
              <p className="text-gray-600">Real-time monitoring and diagnostics for your Supabase connection</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {diagnosticData && (
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(diagnosticData.connection.healthy ? 'good' : 'error')}`}>
                {getStatusIcon(diagnosticData.connection.healthy ? 'good' : 'error')}
                <span>{diagnosticData.connection.healthy ? 'Connected' : 'Disconnected'}</span>
              </div>
            )}
            <button
              onClick={isMonitoring ? stopMonitoring : startMonitoring}
              className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                isMonitoring 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isMonitoring ? 'animate-spin' : ''}`} />
              <span>{isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      {diagnosticData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diagnosticData.metrics.map((metric, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg border p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedMetric(selectedMetric === metric.name ? null : metric.name)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(metric.status)}
                  <h3 className="font-semibold text-gray-900">{metric.name}</h3>
                </div>
                {metric.trend && (
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    metric.trend === 'up' ? 'bg-green-100 text-green-700' :
                    metric.trend === 'down' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
                  </div>
                )}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {metric.value}
              </div>
              {metric.description && (
                <p className="text-sm text-gray-600">{metric.description}</p>
              )}
              
              {selectedMetric === metric.name && metric.name === 'Response Time' && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Response Time History</h4>
                  <div className="space-y-2">
                    {connectionHistory.slice(-10).map((conn, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {new Date(conn.timestamp).toLocaleTimeString()}
                        </span>
                        <span className={`font-medium ${
                          conn.responseTime < 500 ? 'text-green-600' :
                          conn.responseTime < 1000 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {conn.responseTime}ms
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Alerts and Recommendations */}
      {diagnosticData && (diagnosticData.alerts.length > 0 || diagnosticData.recommendations.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alerts */}
          {diagnosticData.alerts.length > 0 && (
            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Active Alerts</h3>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {diagnosticData.alerts.map((alert, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                    <span className="text-sm text-red-700">{alert}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {diagnosticData.recommendations.length > 0 && (
            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b">
                <div className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Recommendations</h3>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {diagnosticData.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Settings className="w-4 h-4 text-blue-500 mt-0.5" />
                    <span className="text-sm text-blue-700">{recommendation}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Connection History Chart */}
      {connectionHistory.length > 0 && (
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900">Connection History</h3>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-end space-x-1 h-32">
              {connectionHistory.slice(-20).map((conn, index) => (
                <div
                  key={index}
                  className={`flex-1 rounded-t ${
                    conn.healthy 
                      ? conn.responseTime < 500 ? 'bg-green-500' : 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ 
                    height: `${Math.min(100, (conn.responseTime / 1000) * 100)}%`,
                    minHeight: '4px'
                  }}
                  title={`${new Date(conn.timestamp).toLocaleTimeString()}: ${conn.responseTime}ms`}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>0ms</span>
              <span>500ms</span>
              <span>1000ms</span>
            </div>
          </div>
        </div>
      )}

      {/* Monitoring Settings */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Monitoring Settings</h3>
            <p className="text-sm text-gray-600">Configure monitoring interval and alerts</p>
          </div>
          <div className="flex items-center space-x-3">
            <label className="text-sm text-gray-600">
              Interval:
              <select
                value={monitoringInterval}
                onChange={(e) => setMonitoringInterval(Number(e.target.value))}
                className="ml-2 border rounded px-2 py-1"
              >
                <option value={10000}>10 seconds</option>
                <option value={30000}>30 seconds</option>
                <option value={60000}>1 minute</option>
                <option value={300000}>5 minutes</option>
              </select>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConnectionDiagnostics
