// src/types/index.ts
// Core AI Agent Types

export interface AIAgent {
  id: number;
  client_id: string;
  agent_name: string;
  agent_type: 'manager' | 'coordinator' | 'basic';
  agent_role: string;
  personality: Record<string, any>;
  capabilities: Record<string, any>;
  status: 'active' | 'inactive' | 'busy';
  created_at: string;
  updated_at: string;
}

export interface AgentTask {
  id: number;
  agent_id: number;
  task_type: string;
  task_description: string;
  task_data: Record<string, any>;
  priority: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  assigned_at: string;
  started_at?: string;
  completed_at?: string;
  result: Record<string, any>;
}

export interface AgentMetrics {
  id: number;
  agent_id: number;
  metric_date: string;
  tasks_completed: number;
  tasks_failed: number;
  communications_handled: number;
  leads_processed: number;
  appointments_scheduled: number;
  calls_made: number;
  response_time_avg: string;
  satisfaction_score: number;
}

export interface AgentCommunication {
  id: number;
  agent_id: number;
  communication_type: 'chat' | 'voice_call' | 'email' | 'whatsapp';
  direction: 'inbound' | 'outbound';
  content: string;
  metadata: Record<string, any>;
  client_contact_info: Record<string, any>;
  created_at: string;
  processed_at?: string;
}

export interface ClientSettings {
  id: number;
  client_id: string;
  business_name: string;
  business_type: 'individual' | 'small_agency' | 'medium_agency';
  primary_language: 'en' | 'ar' | 'both';
  timezone: string;
  working_hours: Record<string, any>;
  branding: Record<string, any>;
  preferences: Record<string, any>;
}

// Dashboard Types
export interface DashboardStats {
  total_agents: number;
  active_agents: number;
  total_tasks: number;
  total_communications: number;
}

// API Response Types
export interface APIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// Component Props Types
export interface AgentCardProps {
  agent: AIAgent;
  onClick?: () => void;
}

export interface ManagerAgentChatProps {
  agentId: number;
  agentName: string;
}

// Environment Variables
export interface EnvironmentConfig {
  VITE_API_URL: string;
  VITE_DATABASE_URL: string;
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
}

declare global {
  interface Window {
    env: EnvironmentConfig;
  }
}