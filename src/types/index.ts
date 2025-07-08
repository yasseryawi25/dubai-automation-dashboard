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

// Database Types (re-exported from database.ts)
export * from './database'

// Environment Variables
export interface EnvironmentConfig {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
}

declare global {
  interface Window {
    env: EnvironmentConfig;
  }
}

// User, Module, Notification, Metric Types for Navigation & Dashboard
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'admin' | 'agent' | 'manager';
  language: 'en' | 'ar';
  timezone: string;
}

export interface ClientProfile {
  id: string;
  companyName: string;
  businessType: 'individual' | 'small_agency' | 'medium_agency';
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'admin' | 'agent' | 'manager';
  language: 'en' | 'ar';
  profile?: UserProfile;
  clientProfile?: ClientProfile;
}

export interface Module {
  id: string;
  name: string;
  path: string;
  icon: React.ReactNode;
}

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  createdAt: string;
  read: boolean;
}

export interface Metric {
  id: string;
  label: string;
  value: number | string;
  trend?: 'up' | 'down' | 'stable';
  status: 'success' | 'warning' | 'error' | 'neutral';
  icon?: React.ReactNode;
}

// Fix SearchResult type
export interface SearchResult {
  id: string;
  type: 'document' | 'lead' | 'workflow' | 'property' | 'campaign' | 'agent';
  title: string;
  description: string;
  url: string;
  metadata: any;
  score: number;
}

// Fix BulkOperation status
export interface BulkOperation {
  id: string;
  action: string;
  itemIds: string[];
  timestamp: string;
  progress: number;
  status: 'failed' | 'pending' | 'completed' | 'processing';
  result?: any;
  error?: string;
}

// Fix Template interface
export interface Template {
  id: string;
  name: string;
  description: string;
  type: 'document' | 'email' | 'whatsapp' | 'sms' | 'contract';
  category: string;
  language: 'en' | 'ar' | 'both';
  content: string;
  variables: any[];
  isActive: boolean;
  usageCount: number;
  createdBy: string;
  version: number;
  tags: any[];
  createdAt: string;
  updatedAt: string;
}

// Fix Appointment interface
export interface Appointment {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  status: 'completed' | 'scheduled' | 'cancelled' | 'confirmed' | 'rescheduled';
  attendees: string[];
  location?: string;
  type: string;
}

// Fix BrandingProfile interface
export interface BrandingProfile {
  id: string;
  clientId: string;
  businessName: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  tagline?: string;
  bio?: string;
  website?: string;
  socialPlatforms: ('facebook' | 'instagram' | 'linkedin' | 'twitter' | 'tiktok' | 'youtube')[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
  };
}

// Fix DesignTemplate interface
export interface DesignTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  previewUrl: string;
  sampleText: string;
}

// Fix MarketingCampaign interface
export interface MarketingCampaign {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'completed' | 'draft';
  type: 'lead_generation' | 'brand_awareness' | 'property_sales' | 'engagement';
  startDate: string;
  endDate: string;
  budget: {
    total: number;
    spent: number;
    currency: 'AED';
    dailyLimit?: number;
  };
  spend: number;
  roi: number;
  leadsGenerated: number;
  platforms: {
    facebook?: { enabled: boolean; budget: number; targeting: any; adFormat: string; };
    instagram?: { enabled: boolean; budget: number; targeting: any; adFormat: string; };
    linkedin?: { enabled: boolean; budget: number; targeting: any; adFormat: string; };
    twitter?: { enabled: boolean; budget: number; targeting: any; adFormat: string; };
    tiktok?: { enabled: boolean; budget: number; targeting: any; adFormat: string; };
    youtube?: { enabled: boolean; budget: number; targeting: any; adFormat: string; };
  };
  analytics: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    cpc: number;
    cpa: number;
  };
  targeting: any;
  createdAt: string;
  updatedAt: string;
}