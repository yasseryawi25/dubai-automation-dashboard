import { supabase } from '../lib/supabase'
import type {
  AIAgent,
  Lead,
  WhatsappMessage,
  AgentTask,
  AgentMetricsDaily,
  PropertyListing,
  AutomationWorkflow,
  AgentPerformance
} from '../types/database'

/**
 * Enhanced API Service for Real Dashboard Data
 * This service fetches and processes real data from Supabase tables
 */

export class EnhancedAPIService {
  
  /**
   * Get comprehensive dashboard statistics
   */
  static async getDashboardStats() {
    try {
      const clientId = 'demo-client-12345678'

      // Fetch all core data in parallel
      const [
        agentsResult,
        leadsResult,
        messagesResult,
        propertiesResult,
        workflowsResult,
        tasksResult,
        metricsResult
      ] = await Promise.all([
        supabase.from('ai_agents').select('*').eq('client_id', clientId),
        supabase.from('leads').select('*').eq('client_id', clientId),
        supabase.from('whatsapp_messages').select('*').eq('client_id', clientId),
        supabase.from('property_listings').select('*').eq('client_id', clientId),
        supabase.from('automation_workflows').select('*').eq('client_id', clientId),
        supabase.from('agent_tasks').select('*').eq('client_id', clientId),
        supabase.from('agent_metrics_daily').select('*').eq('client_id', clientId).eq('date', new Date().toISOString().split('T')[0])
      ])

      // Process the data
      const agents = agentsResult.data || []
      const leads = leadsResult.data || []
      const messages = messagesResult.data || []
      const properties = propertiesResult.data || []
      const workflows = workflowsResult.data || []
      const tasks = tasksResult.data || []
      const metrics = metricsResult.data || []

      // Calculate key metrics
      const totalLeads = leads.length
      const newLeadsToday = leads.filter(lead => {
        const today = new Date().toISOString().split('T')[0]
        return lead.created_at.startsWith(today)
      }).length
      
      const conversionsThisWeek = leads.filter(lead => {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        return lead.status === 'converted' && new Date(lead.created_at) >= weekAgo
      }).length

      const activeAgents = agents.filter(agent => agent.status === 'active').length
      const activeWorkflows = workflows.filter(w => w.is_active).length
      
      const tasksCompletedToday = tasks.filter(task => 
        task.status === 'completed' && 
        task.created_at.startsWith(new Date().toISOString().split('T')[0])
      ).length

      // Calculate total task performance
      const totalTasksCompleted = metrics.reduce((sum, metric) => sum + metric.tasks_completed, 0)
      const totalTasksFailed = metrics.reduce((sum, metric) => sum + metric.tasks_failed, 0)
      const successRate = totalTasksCompleted > 0 ? 
        ((totalTasksCompleted / (totalTasksCompleted + totalTasksFailed)) * 100) : 0

      // Calculate revenue from converted leads
      const revenue = leads
        .filter(lead => lead.status === 'converted' && lead.budget_max)
        .reduce((sum, lead) => sum + (lead.budget_max || 0), 0)

      // Calculate average response time
      const avgResponseTime = metrics.length > 0 ?
        metrics.reduce((sum, metric) => sum + (metric.response_time_avg || 0), 0) / metrics.length : 0

      return {
        totalLeads,
        newLeadsToday,
        conversionsThisWeek,
        totalAgents: agents.length,
        activeAgents,
        activeWorkflows,
        totalMessages: messages.length,
        totalProperties: properties.filter(p => p.is_active).length,
        tasksCompletedToday,
        totalTasksCompleted,
        successRate: Math.round(successRate * 10) / 10,
        revenue,
        avgResponseTime: Math.round(avgResponseTime * 10) / 10,
        conversionRate: totalLeads > 0 ? Math.round((conversionsThisWeek / totalLeads) * 100 * 10) / 10 : 0,
        
        // Status distributions
        leadsByStatus: this.groupByField(leads, 'status'),
        leadsByPriority: this.groupByField(leads, 'priority'),
        leadsBySource: this.groupByField(leads, 'source'),
        agentsByStatus: this.groupByField(agents, 'status'),
        agentsByType: this.groupByField(agents, 'type'),
        
        // Recent activity
        recentLeads: leads
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5),
        recentMessages: messages
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 10),
        recentTasks: tasks
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 10)
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw error
    }
  }

  /**
   * Get enhanced AI agents with performance data
   */
  static async getAgentsWithPerformance(): Promise<AgentPerformance[]> {
    try {
      const clientId = 'demo-client-12345678'
      
      // Get agents and their performance data
      const [agentsResult, metricsResult, tasksResult] = await Promise.all([
        supabase.from('ai_agents').select('*').eq('client_id', clientId).order('type'),
        supabase.from('agent_metrics_daily')
          .select('*')
          .eq('client_id', clientId)
          .eq('date', new Date().toISOString().split('T')[0]),
        supabase.from('agent_tasks')
          .select('*')
          .eq('client_id', clientId)
          .order('created_at', { ascending: false })
          .limit(50)
      ])

      const agents = agentsResult.data || []
      const metrics = metricsResult.data || []
      const allTasks = tasksResult.data || []

      return agents.map(agent => {
        const agentMetrics = metrics.find(m => m.agent_id === agent.id)
        const agentTasks = allTasks.filter(t => t.agent_id === agent.id).slice(0, 5)
        
        // Calculate efficiency and success rate
        const efficiency = agentMetrics?.efficiency_score || 0
        const successRate = agentMetrics?.success_rate || 0
        
        // Determine recent activity based on status and recent tasks
        let recentActivity = `Status: ${agent.status}`
        if (agentTasks.length > 0) {
          const latestTask = agentTasks[0]
          if (latestTask.status === 'in_progress') {
            recentActivity = `Working on: ${latestTask.task_description}`
          } else if (latestTask.status === 'completed') {
            recentActivity = `Completed: ${latestTask.task_description}`
          }
        }

        return {
          agent,
          metrics: agentMetrics || {
            id: '',
            client_id: clientId,
            agent_id: agent.id,
            date: new Date().toISOString().split('T')[0],
            tasks_completed: 0,
            tasks_failed: 0,
            response_time_avg: 0,
            success_rate: 0,
            leads_processed: 0,
            messages_sent: 0,
            calls_made: 0,
            efficiency_score: 0,
            uptime_minutes: 0,
            created_at: new Date().toISOString()
          },
          tasks: agentTasks,
          recentActivity,
          efficiency,
          successRate
        }
      })
    } catch (error) {
      console.error('Error fetching agents with performance:', error)
      throw error
    }
  }

  /**
   * Get live leads data with enhanced information
   */
  static async getLeadsWithDetails() {
    try {
      const clientId = 'demo-client-12345678'
      
      const { data: leads, error } = await supabase
        .from('leads')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Get associated WhatsApp messages for each lead
      const leadsWithMessages = await Promise.all(
        (leads || []).map(async (lead) => {
          const { data: messages } = await supabase
            .from('whatsapp_messages')
            .select('*')
            .eq('client_id', clientId)
            .eq('lead_id', lead.id)
            .order('created_at', { ascending: false })
            .limit(3)

          return {
            ...lead,
            recentMessages: messages || [],
            messageCount: messages?.length || 0
          }
        })
      )

      return leadsWithMessages
    } catch (error) {
      console.error('Error fetching leads with details:', error)
      throw error
    }
  }

  /**
   * Get recent activities for activity feed
   */
  static async getRecentActivities() {
    try {
      const clientId = 'demo-client-12345678'
      
      // Get recent activities from various tables
      const [tasksResult, messagesResult, leadsResult] = await Promise.all([
        supabase
          .from('agent_tasks')
          .select('*, ai_agents(name)')
          .eq('client_id', clientId)
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('whatsapp_messages')
          .select('*, leads(name)')
          .eq('client_id', clientId)
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('leads')
          .select('*')
          .eq('client_id', clientId)
          .order('created_at', { ascending: false })
          .limit(5)
      ])

      const activities = []

      // Add task activities
      ;(tasksResult.data || []).forEach(task => {
        activities.push({
          id: `task-${task.id}`,
          type: 'task',
          title: task.task_description || `${task.task_type} task`,
          description: `${(task as any).ai_agents?.name || 'Agent'} ${task.status === 'completed' ? 'completed' : 'is working on'} this task`,
          timestamp: task.created_at,
          status: task.status,
          priority: task.priority,
          agent: (task as any).ai_agents?.name
        })
      })

      // Add message activities
      ;(messagesResult.data || []).forEach(message => {
        activities.push({
          id: `message-${message.id}`,
          type: 'message',
          title: `${message.direction === 'inbound' ? 'Received' : 'Sent'} WhatsApp message`,
          description: `${message.direction === 'inbound' ? 'From' : 'To'} ${(message as any).leads?.name || message.phone_number}: ${message.message_content.substring(0, 50)}...`,
          timestamp: message.created_at,
          status: message.status,
          direction: message.direction,
          phone: message.phone_number
        })
      })

      // Add lead activities
      ;(leadsResult.data || []).forEach(lead => {
        activities.push({
          id: `lead-${lead.id}`,
          type: 'lead',
          title: `New lead: ${lead.name}`,
          description: `${lead.source} lead interested in ${lead.property_type} in ${lead.location_preference}`,
          timestamp: lead.created_at,
          status: lead.status,
          priority: lead.priority,
          source: lead.source
        })
      })

      // Sort all activities by timestamp
      return activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 15)
    } catch (error) {
      console.error('Error fetching recent activities:', error)
      throw error
    }
  }

  /**
   * Get property listings with analytics
   */
  static async getPropertiesWithAnalytics() {
    try {
      const clientId = 'demo-client-12345678'
      
      const { data: properties, error } = await supabase
        .from('property_listings')
        .select('*')
        .eq('client_id', clientId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Calculate analytics
      const totalProperties = properties?.length || 0
      const totalValue = properties?.reduce((sum, prop) => sum + prop.price, 0) || 0
      const avgPrice = totalProperties > 0 ? totalValue / totalProperties : 0
      const totalViews = properties?.reduce((sum, prop) => sum + prop.views_count, 0) || 0
      const totalInquiries = properties?.reduce((sum, prop) => sum + prop.inquiries_count, 0) || 0

      return {
        properties: properties || [],
        analytics: {
          totalProperties,
          totalValue,
          avgPrice,
          totalViews,
          totalInquiries,
          inquiryRate: totalViews > 0 ? (totalInquiries / totalViews) * 100 : 0,
          byType: this.groupByField(properties || [], 'property_type'),
          byLocation: this.groupByField(properties || [], 'location'),
          byStatus: this.groupByField(properties || [], 'status')
        }
      }
    } catch (error) {
      console.error('Error fetching properties with analytics:', error)
      throw error
    }
  }

  /**
   * Get workflow performance data
   */
  static async getWorkflowPerformance() {
    try {
      const clientId = 'demo-client-12345678'
      
      const { data: workflows, error } = await supabase
        .from('automation_workflows')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })

      if (error) throw error

      const totalWorkflows = workflows?.length || 0
      const activeWorkflows = workflows?.filter(w => w.is_active).length || 0
      const totalExecutions = workflows?.reduce((sum, w) => sum + w.success_count + w.error_count, 0) || 0
      const totalSuccesses = workflows?.reduce((sum, w) => sum + w.success_count, 0) || 0
      const successRate = totalExecutions > 0 ? (totalSuccesses / totalExecutions) * 100 : 0

      return {
        workflows: workflows || [],
        analytics: {
          totalWorkflows,
          activeWorkflows,
          totalExecutions,
          totalSuccesses,
          successRate,
          byType: this.groupByField(workflows || [], 'type'),
          byStatus: workflows?.reduce((acc, w) => {
            const status = w.is_active ? 'active' : 'inactive'
            acc[status] = (acc[status] || 0) + 1
            return acc
          }, {} as Record<string, number>) || {}
        }
      }
    } catch (error) {
      console.error('Error fetching workflow performance:', error)
      throw error
    }
  }

  /**
   * Helper function to group array by field
   */
  private static groupByField<T extends Record<string, any>>(array: T[], field: string): Record<string, number> {
    return array.reduce((acc, item) => {
      const value = item[field] || 'unknown'
      acc[value] = (acc[value] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  /**
   * Subscribe to real-time changes across all relevant tables
   */
  static subscribeToRealTimeUpdates(callback: (change: any) => void) {
    const subscriptions = [
      'ai_agents',
      'leads', 
      'whatsapp_messages',
      'agent_tasks',
      'property_listings',
      'automation_workflows'
    ].map(table => 
      supabase
        .channel(`${table}-realtime`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: table,
          filter: 'client_id=eq.demo-client-12345678'
        }, (payload) => {
          callback({
            table,
            eventType: payload.eventType,
            new: payload.new,
            old: payload.old
          })
        })
        .subscribe()
    )

    return () => {
      subscriptions.forEach(sub => sub.unsubscribe())
    }
  }
}

export default EnhancedAPIService