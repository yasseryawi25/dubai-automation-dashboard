import { supabase, handleSupabaseError, getCurrentUserClientId } from '../lib/supabase'
import type {
  Lead,
  LeadInsert,
  LeadUpdate,
  WhatsappMessage,
  WhatsappMessageInsert,
  AutomationWorkflow,
  AutomationWorkflowInsert,
  PropertyListing,
  PropertyListingInsert,
  EmailCampaign,
  EmailCampaignInsert,
  AnalyticsEvent,
  AnalyticsEventInsert,
  AIAgent,
  AIAgentInsert,
  AIAgentUpdate,
  AgentTask,
  AgentTaskInsert,
  AgentTaskUpdate,
  AgentMetricsDaily,
  AgentMetricsDailyInsert,
  AgentCommunication,
  AgentCommunicationInsert,
  LeadStatus,
  MessageStatus,
  DashboardMetrics,
  AgentPerformance,
  LeadAnalytics,
  PropertyAnalytics
} from '../types/database'

// Real-time subscription types
export type RealtimeCallback<T> = (payload: {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new: T
  old: T
  table: string
  schema: string
}) => void

/**
 * Enhanced Leads Service with AI Agent integration
 */
export class LeadsService {
  static async getAll(): Promise<Lead[]> {
    try {
      // const clientId = await getCurrentUserClientId();
      // console.log('Fetching leads for clientId:', clientId);
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        // .eq('client_id', clientId) // Removed for debugging
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Leads query error:', error);
        return [];
      }
      console.log('Leads data:', data);
      return data || [];
    } catch (error) {
      console.error('Leads fetch error:', error);
      return [];
    }
  }

  static async getById(id: string): Promise<Lead | null> {
    try {
      const clientId = await getCurrentUserClientId()
      if (!clientId) throw new Error('No client ID found')

      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .eq('client_id', clientId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  static async create(lead: Omit<LeadInsert, 'client_id'>): Promise<Lead> {
    try {
      const clientId = await getCurrentUserClientId()
      if (!clientId) throw new Error('No client ID found')

      const { data, error } = await supabase
        .from('leads')
        .insert({ 
          ...lead, 
          client_id: clientId,
          lead_score: lead.lead_score || 0 
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  static async update(id: string, updates: LeadUpdate): Promise<Lead> {
    try {
      const clientId = await getCurrentUserClientId()
      if (!clientId) throw new Error('No client ID found')

      const { data, error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', id)
        .eq('client_id', clientId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      const clientId = await getCurrentUserClientId()
      if (!clientId) throw new Error('No client ID found')

      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id)
        .eq('client_id', clientId)

      if (error) throw error
      return true
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  static async getByStatus(status: LeadStatus): Promise<Lead[]> {
    try {
      const clientId = await getCurrentUserClientId()
      if (!clientId) throw new Error('No client ID found')

      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('client_id', clientId)
        .eq('status', status)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  static async getAnalytics(): Promise<LeadAnalytics> {
    try {
      const clientId = await getCurrentUserClientId()
      if (!clientId) throw new Error('No client ID found')

      // Get all leads for analysis
      const { data: leads, error } = await supabase
        .from('leads')
        .select('*')
        .eq('client_id', clientId)

      if (error) throw error

      const totalLeads = leads?.length || 0
      
      // Analyze leads by status
      const leadsByStatus = leads?.reduce((acc, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1
        return acc
      }, {} as Record<LeadStatus, number>) || {}

      // Analyze leads by source
      const leadsBySource = leads?.reduce((acc, lead) => {
        acc[lead.source] = (acc[lead.source] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {}

      // Calculate conversion rate
      const convertedLeads = leads?.filter(lead => lead.status === 'converted').length || 0
      const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0

      // Calculate average deal size
      const convertedLeadsWithBudget = leads?.filter(lead => 
        lead.status === 'converted' && lead.budget_max
      ) || []
      const avgDealSize = convertedLeadsWithBudget.length > 0 
        ? convertedLeadsWithBudget.reduce((sum, lead) => sum + (lead.budget_max || 0), 0) / convertedLeadsWithBudget.length
        : 0

      return {
        totalLeads,
        leadsByStatus,
        leadsBySource,
        leadsByPriority: leads?.reduce((acc, lead) => {
          acc[lead.priority] = (acc[lead.priority] || 0) + 1
          return acc
        }, {} as Record<string, number>) || {},
        conversionRate,
        avgDealSize,
        topPerformingAgents: [] // TODO: Implement agent performance ranking
      }
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  static subscribeToChanges(callback: RealtimeCallback<Lead>) {
    // Temporarily disable realtime subscriptions due to type issues
    console.log('Realtime subscriptions temporarily disabled')
    return {
      unsubscribe: () => console.log('Realtime subscription disabled')
    }
  }
}

/**
 * Enhanced WhatsApp Messages Service
 */
export class WhatsAppService {
  static async getAll(): Promise<WhatsappMessage[]> {
    try {
      const clientId = await getCurrentUserClientId()
      if (!clientId) throw new Error('No client ID found')

      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  static async getByPhoneNumber(phoneNumber: string): Promise<WhatsappMessage[]> {
    try {
      const clientId = await getCurrentUserClientId()
      if (!clientId) throw new Error('No client ID found')

      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .eq('client_id', clientId)
        .eq('phone_number', phoneNumber)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  static async getByLeadId(leadId: string): Promise<WhatsappMessage[]> {
    try {
      const clientId = await getCurrentUserClientId()
      if (!clientId) throw new Error('No client ID found')

      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .eq('client_id', clientId)
        .eq('lead_id', leadId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  static async create(message: Omit<WhatsappMessageInsert, 'client_id'>): Promise<WhatsappMessage> {
    try {
      const clientId = await getCurrentUserClientId()
      if (!clientId) throw new Error('No client ID found')

      const { data, error } = await supabase
        .from('whatsapp_messages')
        .insert({ ...message, client_id: clientId })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  static subscribeToChanges(callback: RealtimeCallback<WhatsappMessage>) {
    // Temporarily disable realtime subscriptions due to type issues
    console.log('Realtime subscriptions temporarily disabled')
    return {
      unsubscribe: () => console.log('Realtime subscription disabled')
    }
  }
}

/**
 * AI Agents Service - NEW
 */
export class AIAgentsService {
  static async getAll(): Promise<AIAgent[]> {
    try {
      const clientId = await getCurrentUserClientId()
      console.log('🔍 Getting AI agents for client:', clientId)

      const { data, error } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('client_id', clientId)
        .order('type', { ascending: true })
        .order('created_at', { ascending: true })

      if (error) {
        console.warn('AI agents query warning:', error)
        return [] // Return empty array instead of throwing
      }
      
      console.log('✅ AI agents fetched:', data?.length || 0)
      return data || []
    } catch (error) {
      console.error('AI agents fetch error:', error)
      return [] // Return empty array for demo mode
    }
  }

  static async getById(id: string): Promise<AIAgent | null> {
    try {
      const clientId = await getCurrentUserClientId()
      if (!clientId) throw new Error('No client ID found')

      const { data, error } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('id', id)
        .eq('client_id', clientId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  static async getByType(type: 'manager' | 'coordinator' | 'basic'): Promise<AIAgent[]> {
    try {
      const clientId = await getCurrentUserClientId()
      if (!clientId) throw new Error('No client ID found')

      const { data, error } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('client_id', clientId)
        .eq('type', type)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  static async create(agent: Omit<AIAgentInsert, 'client_id'>): Promise<AIAgent> {
    try {
      const clientId = await getCurrentUserClientId()
      if (!clientId) throw new Error('No client ID found')

      const { data, error } = await supabase
        .from('ai_agents')
        .insert({ ...agent, client_id: clientId })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  static async update(id: string, updates: AIAgentUpdate): Promise<AIAgent> {
    try {
      const clientId = await getCurrentUserClientId()
      if (!clientId) throw new Error('No client ID found')

      const { data, error } = await supabase
        .from('ai_agents')
        .update(updates)
        .eq('id', id)
        .eq('client_id', clientId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  static async updateStatus(id: string, status: 'active' | 'busy' | 'idle' | 'offline'): Promise<AIAgent> {
    return this.update(id, { status })
  }

  static async getPerformance(): Promise<AgentPerformance[]> {
    try {
      const clientId = await getCurrentUserClientId()
      if (!clientId) throw new Error('No client ID found')

      // Get agents
      const agents = await this.getAll()
      
      // Get today's metrics for each agent
      const performances: AgentPerformance[] = []
      
      for (const agent of agents) {
        // Get today's metrics
        const { data: metrics, error: metricsError } = await supabase
          .from('agent_metrics_daily')
          .select('*')
          .eq('client_id', clientId)
          .eq('agent_id', agent.id)
          .eq('date', new Date().toISOString().split('T')[0])
          .single()

        if (metricsError && metricsError.code !== 'PGRST116') {
          console.warn(`No metrics found for agent ${agent.id}:`, metricsError)
        }

        // Get recent tasks
        const { data: tasks, error: tasksError } = await supabase
          .from('agent_tasks')
          .select('*')
          .eq('client_id', clientId)
          .eq('agent_id', agent.id)
          .order('created_at', { ascending: false })
          .limit(5)

        if (tasksError) {
          console.warn(`No tasks found for agent ${agent.id}:`, tasksError)
        }

        performances.push({
          agent,
          metrics: metrics || {
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
          tasks: tasks || [],
          recentActivity: agent.status === 'active' ? 'Processing tasks' : `Status: ${agent.status}`,
          efficiency: metrics?.efficiency_score || 0,
          successRate: metrics?.success_rate || 0
        })
      }

      return performances
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  static subscribeToChanges(callback: RealtimeCallback<AIAgent>) {
    // Temporarily disable realtime subscriptions due to type issues
    console.log('Realtime subscriptions temporarily disabled')
    return {
      unsubscribe: () => console.log('Realtime subscription disabled')
    }
  }
}

/**
 * Agent Tasks Service - NEW
 */
export class AgentTasksService {
  static async getAll(): Promise<AgentTask[]> {
    try {
      const clientId = await getCurrentUserClientId()
      if (!clientId) throw new Error('No client ID found')

      const { data, error } = await supabase
        .from('agent_tasks')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  static async getByAgentId(agentId: string): Promise<AgentTask[]> {
    try {
      const clientId = await getCurrentUserClientId()
      if (!clientId) throw new Error('No client ID found')

      const { data, error } = await supabase
        .from('agent_tasks')
        .select('*')
        .eq('client_id', clientId)
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  static async create(task: Omit<AgentTaskInsert, 'client_id'>): Promise<AgentTask> {
    try {
      const clientId = await getCurrentUserClientId()
      if (!clientId) throw new Error('No client ID found')

      const { data, error } = await supabase
        .from('agent_tasks')
        .insert({ ...task, client_id: clientId })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  static async updateStatus(id: string, status: 'pending' | 'in_progress' | 'completed' | 'failed', outputData?: any): Promise<AgentTask> {
    try {
      const clientId = await getCurrentUserClientId()
      if (!clientId) throw new Error('No client ID found')

      const updates: any = { status }
      
      if (status === 'in_progress' && !outputData) {
        updates.started_at = new Date().toISOString()
      }
      
      if ((status === 'completed' || status === 'failed') && !outputData) {
        updates.completed_at = new Date().toISOString()
      }
      
      if (outputData) {
        updates.output_data = outputData
      }

      const { data, error } = await supabase
        .from('agent_tasks')
        .update(updates)
        .eq('id', id)
        .eq('client_id', clientId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  static subscribeToChanges(callback: RealtimeCallback<AgentTask>) {
    // Temporarily disable realtime subscriptions due to type issues
    console.log('Realtime subscriptions temporarily disabled')
    return {
      unsubscribe: () => console.log('Realtime subscription disabled')
    }
  }
}

/**
 * Enhanced Automation Workflows Service
 */
export class WorkflowsService {
  static async getAll(): Promise<AutomationWorkflow[]> {
    try {
      const clientId = await getCurrentUserClientId()
      console.log('🔍 Getting workflows for client:', clientId)

      const { data, error } = await supabase
        .from('automation_workflows')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })

      if (error) {
        console.warn('Workflows query warning:', error)
        return [] // Return empty array instead of throwing
      }
      
      console.log('✅ Workflows fetched:', data?.length || 0)
      return data || []
    } catch (error) {
      console.error('Workflows fetch error:', error)
      return [] // Return empty array for demo mode
    }
  }

  static async getActive(): Promise<AutomationWorkflow[]> {
    try {
      const clientId = await getCurrentUserClientId()
      if (!clientId) throw new Error('No client ID found')

      const { data, error } = await supabase
        .from('automation_workflows')
        .select('*')
        .eq('client_id', clientId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  static async create(workflow: Omit<AutomationWorkflowInsert, 'client_id'>): Promise<AutomationWorkflow> {
    try {
      const clientId = await getCurrentUserClientId()
      if (!clientId) throw new Error('No client ID found')

      const { data, error } = await supabase
        .from('automation_workflows')
        .insert({ 
          ...workflow, 
          client_id: clientId,
          success_count: 0,
          error_count: 0
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  static async toggleActive(id: string, isActive: boolean): Promise<AutomationWorkflow> {
    try {
      const clientId = await getCurrentUserClientId()
      if (!clientId) throw new Error('No client ID found')

      const { data, error } = await supabase
        .from('automation_workflows')
        .update({ is_active: isActive })
        .eq('id', id)
        .eq('client_id', clientId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  static subscribeToChanges(callback: RealtimeCallback<AutomationWorkflow>) {
    // Temporarily disable realtime subscriptions due to type issues
    console.log('Realtime subscriptions temporarily disabled')
    return {
      unsubscribe: () => console.log('Realtime subscription disabled')
    }
  }
}

/**
 * Enhanced Properties Service
 */
export class PropertiesService {
  static async getAll(): Promise<PropertyListing[]> {
    try {
      const clientId = await getCurrentUserClientId()
      if (!clientId) throw new Error('No client ID found')

      const { data, error } = await supabase
        .from('property_listings')
        .select('*')
        .eq('client_id', clientId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  static async create(property: Omit<PropertyListingInsert, 'client_id'>): Promise<PropertyListing> {
    try {
      const clientId = await getCurrentUserClientId()
      if (!clientId) throw new Error('No client ID found')

      const { data, error } = await supabase
        .from('property_listings')
        .insert({ 
          ...property, 
          client_id: clientId,
          views_count: 0,
          inquiries_count: 0
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  static async searchByLocation(location: string): Promise<PropertyListing[]> {
    try {
      const clientId = await getCurrentUserClientId()
      if (!clientId) throw new Error('No client ID found')

      const { data, error } = await supabase
        .from('property_listings')
        .select('*')
        .eq('client_id', clientId)
        .eq('is_active', true)
        .ilike('location', `%${location}%`)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  static async getAnalytics(): Promise<PropertyAnalytics> {
    try {
      const clientId = await getCurrentUserClientId()
      if (!clientId) throw new Error('No client ID found')

      const { data: properties, error } = await supabase
        .from('property_listings')
        .select('*')
        .eq('client_id', clientId)
        .eq('is_active', true)

      if (error) throw error

      const totalProperties = properties?.length || 0
      
      return {
        totalProperties,
        propertiesByType: properties?.reduce((acc, prop) => {
          acc[prop.property_type] = (acc[prop.property_type] || 0) + 1
          return acc
        }, {} as Record<string, number>) || {},
        propertiesByStatus: properties?.reduce((acc, prop) => {
          acc[prop.status] = (acc[prop.status] || 0) + 1
          return acc
        }, {} as Record<string, number>) || {},
        avgPropertyValue: properties && properties.length > 0
          ? properties.reduce((sum, prop) => sum + prop.price, 0) / properties.length
          : 0,
        topLocations: Object.entries(
          properties?.reduce((acc, prop) => {
            acc[prop.location] = (acc[prop.location] || 0) + 1
            return acc
          }, {} as Record<string, number>) || {}
        )
          .sort(([,a], [,b]) => (b as number) - (a as number))
          .slice(0, 5)
          .map(([location]) => location),
        inquiryRates: properties?.reduce((acc, prop) => {
          acc[prop.id] = prop.inquiries_count
          return acc
        }, {} as Record<string, number>) || {}
      }
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  static subscribeToChanges(callback: RealtimeCallback<PropertyListing>) {
    // Temporarily disable realtime subscriptions due to type issues
    console.log('Realtime subscriptions temporarily disabled')
    return {
      unsubscribe: () => console.log('Realtime subscription disabled')
    }
  }
}

/**
 * Enhanced Analytics Service
 */
export class AnalyticsService {
  static async trackEvent(eventType: string, eventData: any, eventCategory?: string): Promise<AnalyticsEvent> {
    try {
      const clientId = await getCurrentUserClientId()
      if (!clientId) throw new Error('No client ID found')

      const { data, error } = await supabase
        .from('analytics_events')
        .insert({
          client_id: clientId,
          event_type: eventType,
          event_category: eventCategory,
          event_data: eventData,
          user_agent: navigator.userAgent,
          page_url: window.location.href,
          session_id: `session-${Date.now()}`,
          user_id: 'demo-user-12345678'
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  static async getDashboardMetrics(): Promise<DashboardMetrics> {
    try {
      const clientId = await getCurrentUserClientId()
      if (!clientId) throw new Error('No client ID found')

      // Get all metrics in parallel
      const [
        leadsResult,
        workflowsResult,
        messagesResult,
        propertiesResult,
        agentsResult,
        tasksResult
      ] = await Promise.all([
        supabase.from('leads').select('*', { count: 'exact' }).eq('client_id', clientId),
        supabase.from('automation_workflows').select('*', { count: 'exact' }).eq('client_id', clientId).eq('is_active', true),
        supabase.from('whatsapp_messages').select('*', { count: 'exact' }).eq('client_id', clientId),
        supabase.from('property_listings').select('*', { count: 'exact' }).eq('client_id', clientId).eq('is_active', true),
        supabase.from('ai_agents').select('*').eq('client_id', clientId),
        supabase.from('agent_tasks').select('*').eq('client_id', clientId).gte('created_at', new Date().toISOString().split('T')[0])
      ])

      // Get new leads today
      const today = new Date().toISOString().split('T')[0]
      const { count: newLeadsToday } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', clientId)
        .gte('created_at', today)

      // Get conversions this week
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      const { count: conversionsThisWeek } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', clientId)
        .eq('status', 'converted')
        .gte('created_at', weekAgo)

      // Calculate additional metrics
      const totalLeads = leadsResult.count || 0
      const convertedLeads = leadsResult.data?.filter(lead => lead.status === 'converted').length || 0
      const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0

      const activeAgents = agentsResult.data?.filter(agent => agent.status === 'active').length || 0
      const tasksCompletedToday = tasksResult.data?.filter(task => task.status === 'completed').length || 0

      // Calculate revenue from converted leads
      const revenue = leadsResult.data
        ?.filter(lead => lead.status === 'converted' && lead.budget_max)
        .reduce((sum, lead) => sum + (lead.budget_max || 0), 0) || 0

      return {
        totalLeads,
        activeWorkflows: workflowsResult.count || 0,
        totalMessages: messagesResult.count || 0,
        totalProperties: propertiesResult.count || 0,
        newLeadsToday: newLeadsToday || 0,
        conversionsThisWeek: conversionsThisWeek || 0,
        avgResponseTime: 45.2, // TODO: Calculate from actual data
        totalAgents: agentsResult.data?.length || 0,
        activeAgents,
        tasksCompletedToday,
        revenue,
        conversionRate
      }
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  static subscribeToChanges(callback: RealtimeCallback<AnalyticsEvent>) {
    // Temporarily disable realtime subscriptions due to type issues
    console.log('Realtime subscriptions temporarily disabled')
    return {
      unsubscribe: () => console.log('Realtime subscription disabled')
    }
  }
}

/**
 * Combined Database Service Export
 */
export const DatabaseService = {
  leads: LeadsService,
  whatsapp: WhatsAppService,
  workflows: WorkflowsService,
  properties: PropertiesService,
  analytics: AnalyticsService,
  agents: AIAgentsService,
  tasks: AgentTasksService
}

export default DatabaseService
