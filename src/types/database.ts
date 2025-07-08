// Enhanced TypeScript types for Dubai Real Estate Platform
// Updated to match the complete database schema

export interface Database {
  public: {
    Tables: {
      client_profiles: {
        Row: ClientProfile
        Insert: ClientProfileInsert
        Update: ClientProfileUpdate
      }
      user_profiles: {
        Row: UserProfile
        Insert: UserProfileInsert
        Update: UserProfileUpdate
      }
      leads: {
        Row: Lead
        Insert: LeadInsert
        Update: LeadUpdate
      }
      whatsapp_messages: {
        Row: WhatsappMessage
        Insert: WhatsappMessageInsert
        Update: WhatsappMessageUpdate
      }
      automation_workflows: {
        Row: AutomationWorkflow
        Insert: AutomationWorkflowInsert
        Update: AutomationWorkflowUpdate
      }
      property_listings: {
        Row: PropertyListing
        Insert: PropertyListingInsert
        Update: PropertyListingUpdate
      }
      email_campaigns: {
        Row: EmailCampaign
        Insert: EmailCampaignInsert
        Update: EmailCampaignUpdate
      }
      analytics_events: {
        Row: AnalyticsEvent
        Insert: AnalyticsEventInsert
        Update: AnalyticsEventUpdate
      }
      ai_agents: {
        Row: AIAgent
        Insert: AIAgentInsert
        Update: AIAgentUpdate
      }
      agent_tasks: {
        Row: AgentTask
        Insert: AgentTaskInsert
        Update: AgentTaskUpdate
      }
      agent_communications: {
        Row: AgentCommunication
        Insert: AgentCommunicationInsert
        Update: AgentCommunicationUpdate
      }
      agent_metrics_daily: {
        Row: AgentMetricsDaily
        Insert: AgentMetricsDailyInsert
        Update: AgentMetricsDailyUpdate
      }
      agent_errors: {
        Row: AgentError
        Insert: AgentErrorInsert
        Update: AgentErrorUpdate
      }
      lead_followups: {
        Row: LeadFollowup
        Insert: LeadFollowupInsert
        Update: LeadFollowupUpdate
      }
      lead_sentiments: {
        Row: LeadSentiment
        Insert: LeadSentimentInsert
        Update: LeadSentimentUpdate
      }
      conversation_history: {
        Row: ConversationHistory
        Insert: ConversationHistoryInsert
        Update: ConversationHistoryUpdate
      }
    }
  }
}

// =============================================================================
// CORE ENTITIES
// =============================================================================

export interface ClientProfile {
  id: string
  name: string
  email: string
  phone?: string
  company_name?: string
  subscription_plan: 'basic' | 'premium' | 'enterprise'
  settings?: any
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  client_id: string
  first_name: string
  last_name: string
  email: string
  role: 'admin' | 'manager' | 'agent' | 'viewer'
  avatar_url?: string
  preferences?: any
  created_at: string
  updated_at: string
}

export interface Lead {
  id: string
  client_id: string
  name: string
  phone?: string
  email?: string
  status: LeadStatus
  source?: string
  notes?: string
  lead_score: number
  assigned_agent?: string
  created_at: string
  updated_at: string
  lead_source?: string
  assigned_agent_id?: string
  priority_level?: string
  follow_up_date?: string
  conversion_probability?: number
  last_contacted_at?: string
  contact_attempts?: number
  preferred_contact_method?: string
  property_type_interest?: string[]
  budget_min?: number
  budget_max?: number
  location_preference?: string[]
  timeline?: string
  financing_status?: string
  lead_tags?: string[]
  whatsapp_number?: string
  source_details?: string
  referral_source?: string
}

export interface WhatsappMessage {
  id: string
  client_id: string
  lead_id?: string
  phone_number: string
  message_content: string
  direction: 'inbound' | 'outbound'
  status: MessageStatus
  message_type: 'text' | 'image' | 'document' | 'audio' | 'video'
  media_url?: string
  agent_generated?: boolean
  automation_triggered?: boolean
  sentiment?: string
  language_detected?: string
  created_at: string
}

export interface PropertyListing {
  id: string
  client_id: string
  title: string
  description?: string
  property_type: 'apartment' | 'villa' | 'townhouse' | 'penthouse' | 'studio' | 'office' | 'shop' | 'warehouse'
  status: 'available' | 'sold' | 'rented' | 'off_market'
  listing_type: 'sale' | 'rent' | 'both'
  location: string
  area?: string
  building_name?: string
  floor_number?: number
  unit_number?: string
  price: number
  rent_frequency?: 'monthly' | 'yearly' | 'weekly'
  bedrooms?: number
  bathrooms?: number
  area_sqft?: number
  parking_spaces?: number
  furnished_status?: 'furnished' | 'unfurnished' | 'semi_furnished'
  amenities?: string[]
  features?: any
  images?: any[]
  virtual_tour_url?: string
  is_featured: boolean
  is_active: boolean
  views_count: number
  inquiries_count: number
  created_at: string
  updated_at: string
}

export interface AutomationWorkflow {
  id: string
  client_id: string
  name: string
  type: 'lead_generation' | 'follow_up' | 'nurturing' | 'scheduling' | 'qualification' | 'marketing'
  description?: string
  is_active: boolean
  configuration?: any
  n8n_workflow_id?: string
  trigger_conditions?: any
  actions?: any
  success_count: number
  error_count: number
  last_execution?: string
  created_at: string
  updated_at: string
}

// =============================================================================
// AI AGENTS ENTITIES
// =============================================================================

export interface AIAgent {
  id: string
  client_id: string
  name: string
  type: 'manager' | 'coordinator' | 'basic'
  specialty: string
  status: 'active' | 'busy' | 'idle' | 'offline'
  avatar?: string
  description?: string
  capabilities?: string[]
  configuration?: any
  is_enabled: boolean
  created_at: string
  updated_at: string
}

export interface AgentTask {
  id: string
  client_id: string
  agent_id: string
  task_type: string
  task_description?: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  related_lead_id?: string
  input_data?: any
  output_data?: any
  started_at?: string
  completed_at?: string
  created_at: string
}

export interface AgentCommunication {
  id: string
  client_id: string
  from_agent_id: string
  to_agent_id?: string
  message_type: 'task_assignment' | 'status_update' | 'escalation' | 'collaboration'
  message_content: string
  related_task_id?: string
  is_read: boolean
  created_at: string
}

export interface AgentMetricsDaily {
  id: string
  client_id: string
  agent_id: string
  date: string
  tasks_completed: number
  tasks_failed: number
  response_time_avg?: number
  success_rate?: number
  leads_processed: number
  messages_sent: number
  calls_made: number
  efficiency_score?: number
  uptime_minutes: number
  created_at: string
}

export interface AgentError {
  id: string
  client_id: string
  agent_id: string
  error_type: string
  error_message: string
  error_context?: any
  stack_trace?: string
  related_task_id?: string
  is_resolved: boolean
  resolved_at?: string
  created_at: string
}

// =============================================================================
// ADDITIONAL ENTITIES
// =============================================================================

export interface EmailCampaign {
  id: string
  client_id: string
  name: string
  subject: string
  content: string
  template_id?: string
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'completed' | 'failed'
  target_audience?: any
  scheduled_at?: string
  sent_count: number
  delivered_count: number
  open_count: number
  click_count: number
  bounce_count: number
  unsubscribe_count: number
  created_at: string
  updated_at: string
}

export interface AnalyticsEvent {
  id: string
  client_id: string
  event_type: string
  event_category?: string
  event_data?: any
  user_agent?: string
  ip_address?: string
  session_id?: string
  user_id?: string
  page_url?: string
  referrer?: string
  created_at: string
}

export interface LeadFollowup {
  id: string
  client_id: string
  lead_id: string
  type: 'call' | 'email' | 'whatsapp' | 'meeting' | 'property_viewing'
  status: 'scheduled' | 'completed' | 'missed' | 'cancelled'
  scheduled_at: string
  completed_at?: string
  notes?: string
  outcome?: string
  next_action?: string
  agent_assigned?: string
  created_at: string
}

export interface LeadSentiment {
  id: string
  client_id: string
  lead_id: string
  sentiment_score?: number
  sentiment_label?: 'very_negative' | 'negative' | 'neutral' | 'positive' | 'very_positive'
  confidence?: number
  analysis_source?: string
  context?: string
  created_at: string
}

export interface ConversationHistory {
  id: string
  client_id: string
  lead_id: string
  conversation_id?: string
  platform: 'whatsapp' | 'email' | 'phone' | 'in_person' | 'web_chat'
  message_content: string
  direction: 'inbound' | 'outbound'
  participant_name?: string
  participant_type?: 'lead' | 'agent' | 'ai_agent' | 'system'
  metadata?: any
  created_at: string
}

// =============================================================================
// INSERT/UPDATE TYPES
// =============================================================================

export type ClientProfileInsert = Omit<ClientProfile, 'id' | 'created_at' | 'updated_at'>
export type ClientProfileUpdate = Partial<ClientProfileInsert>

export type UserProfileInsert = Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>
export type UserProfileUpdate = Partial<UserProfileInsert>

export type LeadInsert = Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'lead_score'> & {
  lead_score?: number
}
export type LeadUpdate = Partial<LeadInsert>

export type WhatsappMessageInsert = Omit<WhatsappMessage, 'id' | 'created_at'>
export type WhatsappMessageUpdate = Partial<WhatsappMessageInsert>

export type PropertyListingInsert = Omit<PropertyListing, 'id' | 'created_at' | 'updated_at' | 'views_count' | 'inquiries_count'> & {
  views_count?: number
  inquiries_count?: number
}
export type PropertyListingUpdate = Partial<PropertyListingInsert>

export type AutomationWorkflowInsert = Omit<AutomationWorkflow, 'id' | 'created_at' | 'updated_at' | 'success_count' | 'error_count'> & {
  success_count?: number
  error_count?: number
}
export type AutomationWorkflowUpdate = Partial<AutomationWorkflowInsert>

export type AIAgentInsert = Omit<AIAgent, 'id' | 'created_at' | 'updated_at'>
export type AIAgentUpdate = Partial<AIAgentInsert>

export type AgentTaskInsert = Omit<AgentTask, 'id' | 'created_at'>
export type AgentTaskUpdate = Partial<AgentTaskInsert>

export type AgentCommunicationInsert = Omit<AgentCommunication, 'id' | 'created_at'>
export type AgentCommunicationUpdate = Partial<AgentCommunicationInsert>

export type AgentMetricsDailyInsert = Omit<AgentMetricsDaily, 'id' | 'created_at'>
export type AgentMetricsDailyUpdate = Partial<AgentMetricsDailyInsert>

export type AgentErrorInsert = Omit<AgentError, 'id' | 'created_at'>
export type AgentErrorUpdate = Partial<AgentErrorInsert>

export type EmailCampaignInsert = Omit<EmailCampaign, 'id' | 'created_at' | 'updated_at' | 'sent_count' | 'delivered_count' | 'open_count' | 'click_count' | 'bounce_count' | 'unsubscribe_count'> & {
  sent_count?: number
  delivered_count?: number
  open_count?: number
  click_count?: number
  bounce_count?: number
  unsubscribe_count?: number
}
export type EmailCampaignUpdate = Partial<EmailCampaignInsert>

export type AnalyticsEventInsert = Omit<AnalyticsEvent, 'id' | 'created_at'>
export type AnalyticsEventUpdate = Partial<AnalyticsEventInsert>

export type LeadFollowupInsert = Omit<LeadFollowup, 'id' | 'created_at'>
export type LeadFollowupUpdate = Partial<LeadFollowupInsert>

export type LeadSentimentInsert = Omit<LeadSentiment, 'id' | 'created_at'>
export type LeadSentimentUpdate = Partial<LeadSentimentInsert>

export type ConversationHistoryInsert = Omit<ConversationHistory, 'id' | 'created_at'>
export type ConversationHistoryUpdate = Partial<ConversationHistoryInsert>

// =============================================================================
// ENUMS AND CONSTANTS
// =============================================================================

export type LeadStatus = 
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'viewing_scheduled'
  | 'offer_made'
  | 'converted'
  | 'lost'
  | 'inactive'

export type MessageStatus = 
  | 'sent'
  | 'delivered'
  | 'read'
  | 'failed'

export type AgentType = 'manager' | 'coordinator' | 'basic'

export type AgentStatus = 'active' | 'busy' | 'idle' | 'offline'

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed'

export type Priority = 'low' | 'medium' | 'high' | 'urgent'

// =============================================================================
// DASHBOARD SPECIFIC TYPES
// =============================================================================

export interface DashboardMetrics {
  totalLeads: number
  activeWorkflows: number
  totalMessages: number
  totalProperties: number
  newLeadsToday: number
  conversionsThisWeek: number
  avgResponseTime: number
  totalAgents: number
  activeAgents: number
  tasksCompletedToday: number
  revenue: number
  conversionRate: number
  data?: any
  error?: any
}

export interface AgentPerformance {
  agent: AIAgent
  metrics: AgentMetricsDaily
  tasks: AgentTask[]
  recentActivity: string
  efficiency: number
  successRate: number
}

export interface LeadAnalytics {
  totalLeads: number
  leadsByStatus: Record<LeadStatus, number>
  leadsBySource: Record<string, number>
  leadsByPriority: Record<Priority, number>
  conversionRate: number
  avgDealSize: number
  topPerformingAgents: string[]
}

export interface PropertyAnalytics {
  totalProperties: number
  propertiesByType: Record<string, number>
  propertiesByStatus: Record<string, number>
  avgPropertyValue: number
  topLocations: string[]
  inquiryRates: Record<string, number>
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// =============================================================================
// REAL-TIME SUBSCRIPTION TYPES
// =============================================================================

export interface RealtimePayload<T> {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new: T
  old: T
  table: string
  schema: string
}

export type RealtimeCallback<T> = (payload: RealtimePayload<T>) => void

// Export all for easy importing
export default Database
