import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Calendar, 
  Award, 
  Activity,
  Zap,
  DollarSign,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Building,
  Home,
  BarChart3,
  PieChart,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import EnhancedAPIService from '../../services/enhancedAPI'
import type { AgentPerformance } from '../../types/database'

interface DashboardStats {
  totalLeads: number
  newLeadsToday: number
  conversionsThisWeek: number
  totalAgents: number
  activeAgents: number
  activeWorkflows: number
  totalMessages: number
  totalProperties: number
  tasksCompletedToday: number
  totalTasksCompleted: number
  successRate: number
  revenue: number
  avgResponseTime: number
  conversionRate: number
  leadsByStatus: Record<string, number>
  leadsByPriority: Record<string, number>
  leadsBySource: Record<string, number>
  agentsByStatus: Record<string, number>
  agentsByType: Record<string, number>
  recentLeads: any[]
  recentMessages: any[]
  recentTasks: any[]
}

const EnhancedDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [agentPerformance, setAgentPerformance] = useState<AgentPerformance[]>([])
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    loadDashboardData()
    
    // Set up real-time updates
    const unsubscribe = EnhancedAPIService.subscribeToRealTimeUpdates((change) => {
      console.log('Real-time update:', change)
      setLastUpdated(new Date())
      // Refresh data when changes occur
      loadDashboardData()
    })

    // Refresh data every 30 seconds
    const interval = setInterval(loadDashboardData, 30000)

    return () => {
      unsubscribe()
      clearInterval(interval)
    }
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [statsData, agentsData, activitiesData] = await Promise.all([
        EnhancedAPIService.getDashboardStats(),
        EnhancedAPIService.getAgentsWithPerformance(),
        EnhancedAPIService.getRecentActivities()
      ])
      
      setStats(statsData)
      setAgentPerformance(agentsData)
      setRecentActivities(activitiesData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-700 mb-2">Loading Real Data...</p>
          <p className="text-gray-500">Connecting to Supabase Database</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-8 w-8 text-red-500 mr-3" />
            <h2 className="text-xl font-bold text-gray-900">Database Error</h2>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  if (!stats) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'busy': return 'text-yellow-600 bg-yellow-100'
      case 'idle': return 'text-gray-600 bg-gray-100'
      case 'converted': return 'text-green-600 bg-green-100'
      case 'qualified': return 'text-blue-600 bg-blue-100'
      case 'new': return 'text-purple-600 bg-purple-100'
      case 'contacted': return 'text-indigo-600 bg-indigo-100'
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
      case 'high': return <ArrowUp className="h-4 w-4 text-red-500" />
      case 'medium': return <Target className="h-4 w-4 text-yellow-500" />
      case 'low': return <ArrowDown className="h-4 w-4 text-gray-500" />
      default: return <Target className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Header with Real-time Status */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2">AI Real Estate Platform</h1>
            <p className="text-blue-100 text-lg">Live data from Supabase • Last updated: {lastUpdated.toLocaleTimeString()}</p>
            <div className="flex items-center mt-3 space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2"></div>
                <span className="text-sm">Database Connected</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse mr-2"></div>
                <span className="text-sm">{stats.activeAgents} Agents Active</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{formatCurrency(stats.revenue)}</div>
            <div className="text-blue-100">Total Revenue</div>
          </div>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Leads Today</p>
              <p className="text-3xl font-bold text-gray-900">{stats.newLeadsToday}</p>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                Live from DB
              </p>
            </div>
            <div className="text-blue-500">
              <Users className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversions</p>
              <p className="text-3xl font-bold text-gray-900">{stats.conversionsThisWeek}</p>
              <p className="text-sm text-green-600">{stats.conversionRate.toFixed(1)}% rate</p>
            </div>
            <div className="text-green-500">
              <Target className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">AI Agents</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeAgents}/{stats.totalAgents}</p>
              <p className="text-sm text-purple-600">Active now</p>
            </div>
            <div className="text-purple-500">
              <Zap className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-3xl font-bold text-gray-900">{stats.successRate}%</p>
              <p className="text-sm text-yellow-600">AI Performance</p>
            </div>
            <div className="text-yellow-500">
              <Award className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-indigo-500 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tasks Today</p>
              <p className="text-3xl font-bold text-gray-900">{stats.tasksCompletedToday}</p>
              <p className="text-sm text-indigo-600">Completed</p>
            </div>
            <div className="text-indigo-500">
              <CheckCircle className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Response</p>
              <p className="text-3xl font-bold text-gray-900">{stats.avgResponseTime.toFixed(0)}s</p>
              <p className="text-sm text-red-600">Real-time</p>
            </div>
            <div className="text-red-500">
              <Clock className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* AI Agents Performance Dashboard */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Zap className="h-6 w-6 text-blue-600 mr-2" />
            AI Agent Team Performance
          </h3>
          <div className="text-sm text-gray-500">Real-time data from database</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agentPerformance.map((performance) => (
            <div 
              key={performance.agent.id} 
              className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{performance.agent.avatar}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{performance.agent.name}</h4>
                    <p className="text-sm text-gray-600">{performance.agent.specialty}</p>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  performance.agent.status === 'active' ? 'bg-green-500 animate-pulse' :
                  performance.agent.status === 'busy' ? 'bg-yellow-500' :
                  'bg-gray-500'
                }`}></div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tasks Completed:</span>
                  <span className="font-medium text-gray-900">{performance.metrics.tasks_completed}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Success Rate:</span>
                  <span className="font-medium text-green-600">{performance.successRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Efficiency:</span>
                  <span className="font-medium text-blue-600">{performance.efficiency.toFixed(1)}/100</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Messages Sent:</span>
                  <span className="font-medium text-gray-900">{performance.metrics.messages_sent}</span>
                </div>
              </div>

              <div className="border-t pt-3">
                <p className="text-xs text-gray-500 mb-2">Recent Activity:</p>
                <p className="text-sm text-gray-700">{performance.recentActivity}</p>
              </div>

              <div className="mt-3 pt-3 border-t">
                <div className="text-xs text-gray-500 mb-1">Type: {performance.agent.type}</div>
                <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(performance.agent.status)}`}>
                  {performance.agent.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leads Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
            Leads by Status
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.leadsByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${getStatusColor(status).split(' ')[1]}`}></div>
                  <span className="text-sm text-gray-700 capitalize">{status.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 mr-2">{count}</span>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getStatusColor(status).split(' ')[1]}`}
                      style={{ width: `${Math.min((count / stats.totalLeads) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <PieChart className="h-5 w-5 text-green-600 mr-2" />
            Lead Sources
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.leadsBySource).map(([source, count]) => (
              <div key={source} className="flex items-center justify-between">
                <div className="flex items-center">
                  {source === 'whatsapp' && <MessageSquare className="h-4 w-4 text-green-500 mr-2" />}
                  {source === 'website' && <Building className="h-4 w-4 text-blue-500 mr-2" />}
                  {source === 'referral' && <Users className="h-4 w-4 text-purple-500 mr-2" />}
                  {source === 'social_media' && <Activity className="h-4 w-4 text-pink-500 mr-2" />}
                  {!['whatsapp', 'website', 'referral', 'social_media'].includes(source) && 
                    <Target className="h-4 w-4 text-gray-500 mr-2" />}
                  <span className="text-sm text-gray-700 capitalize">{source.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 mr-2">{count}</span>
                  <span className="text-xs text-gray-500">
                    ({((count / stats.totalLeads) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="h-5 w-5 text-purple-600 mr-2" />
          Live Activity Feed
        </h3>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-shrink-0">
                {activity.type === 'task' && <CheckCircle className="h-5 w-5 text-blue-500" />}
                {activity.type === 'message' && <MessageSquare className="h-5 w-5 text-green-500" />}
                {activity.type === 'lead' && <Users className="h-5 w-5 text-purple-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <div className="flex items-center space-x-2">
                    {activity.priority && getPriorityIcon(activity.priority)}
                    {activity.status && (
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(activity.timestamp).toLocaleString()}
                  {activity.agent && (
                    <>
                      <span className="mx-2">•</span>
                      <span>Agent: {activity.agent}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Leads Table */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Users className="h-5 w-5 text-blue-600 mr-2" />
          Recent Leads from Database
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property Interest</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentLeads.slice(0, 8).map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                          {lead.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          {getPriorityIcon(lead.priority)}
                          <span className="ml-1">{lead.priority} priority</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      {lead.phone && (
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {lead.phone}
                        </div>
                      )}
                      {lead.email && (
                        <div className="flex items-center mt-1">
                          <Mail className="h-3 w-3 mr-1" />
                          {lead.email}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="flex items-center">
                        <Home className="h-3 w-3 mr-1" />
                        {lead.property_type}
                      </div>
                      {lead.location_preference && (
                        <div className="flex items-center mt-1 text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          {lead.location_preference}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lead.budget_min && lead.budget_max ? (
                      <div>
                        <div className="flex items-center">
                          <DollarSign className="h-3 w-3 mr-1" />
                          {formatCurrency(lead.budget_min)}
                        </div>
                        <div className="text-gray-500">to {formatCurrency(lead.budget_max)}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">Not specified</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                      {lead.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${lead.lead_score >= 80 ? 'bg-green-500' : lead.lead_score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(lead.lead_score, 100)}%` }}
                        ></div>
                      </div>
                      <span className="font-medium">{lead.lead_score}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Status Footer */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-sm text-gray-600">Database: Connected</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-sm text-gray-600">Real-time: Active</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">AI Agents: {stats.activeAgents} Active</span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Total Records: {stats.totalLeads + stats.totalMessages + stats.totalProperties + stats.totalTasksCompleted}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedDashboard