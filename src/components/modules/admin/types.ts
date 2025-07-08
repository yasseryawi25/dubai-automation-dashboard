// Types for Admin module will be defined here as needed. 

// --- Dubai Real Estate Context Enums ---
export const DUBAI_LOCATIONS = [
  'Downtown Dubai',
  'Dubai Marina',
  'JBR (Jumeirah Beach Residence)',
  'Business Bay',
  'DIFC (Dubai International Financial Centre)',
  'Dubai Hills Estate',
  'Arabian Ranches',
  'The Springs',
  'Emirates Hills',
  'Palm Jumeirah',
  'Dubai South',
  'Al Barsha',
  'Jumeirah Village Circle (JVC)',
  'Dubai Investment Park (DIP)'
] as const;

export const AGENT_NAMES = [
  'Sarah (Manager Agent)',
  'Alex (Pipeline Coordinator)',
  'Maya (Campaign Coordinator)',
  'Omar (Lead Qualification)',
  'Layla (Follow-up Specialist)',
  'Ahmed (Appointment Agent)'
] as const;

export const TEMPLATE_VARIABLES = [
  '{{client_name}}',
  '{{client_phone}}',
  '{{property_address}}',
  '{{property_type}}',
  '{{property_price}}',
  '{{viewing_date}}',
  '{{viewing_time}}',
  '{{agent_name}}',
  '{{agent_phone}}',
  '{{agency_name}}',
  '{{rera_number}}'
] as const;

// --- Calendar Event Interface ---
export interface CalendarEvent {
  id: string;
  title: string;
  type: 'viewing' | 'meeting' | 'call' | 'task' | 'rera_appointment';
  startTime: string; // ISO string
  endTime: string;
  location: string;
  clientName?: string;
  clientPhone?: string;
  propertyAddress?: string;
  propertyType?: 'apartment' | 'villa' | 'townhouse' | 'penthouse';
  agentAssigned: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
  recurring?: boolean;
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- Automated Task Interface ---
export interface AutomatedTask {
  id: string;
  name: string;
  description: string;
  type: 'lead_followup' | 'document_generation' | 'compliance_check' | 'social_media' | 'email_campaign' | 'whatsapp_sequence' | 'market_report';
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'paused' | 'scheduled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedAgent: string;
  targetEntity?: string; // lead ID, client ID, etc.
  scheduledAt: string;
  startedAt?: string;
  completedAt?: string;
  estimatedDuration: number; // minutes
  actualDuration?: number;
  errorMessage?: string;
  retryCount: number;
  maxRetries: number;
  nextRetryAt?: string;
  workflow: string; // n8n workflow name
  metadata: {
    leadId?: string;
    clientName?: string;
    propertyId?: string;
    templateId?: string;
    campaignId?: string;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
}

// --- Template Interface ---
export interface Template {
  id: string;
  name: string;
  description?: string;
  type: 'email' | 'whatsapp' | 'sms' | 'document' | 'contract';
  category: 'welcome' | 'follow_up' | 'viewing_confirmation' | 'contract' | 'rera_compliance' | 'investment' | 'market_update';
  language: 'en' | 'ar' | 'both';
  subject?: string; // for emails
  content: string;
  variables: string[]; // {{client_name}}, {{property_address}}, etc.
  isActive: boolean;
  usageCount: number;
  lastUsed?: string;
  createdBy: string;
  approvedBy?: string; // for compliance templates
  version: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// --- Supporting Interfaces ---
export interface TaskFilter {
  status?: AutomatedTask['status'][];
  type?: AutomatedTask['type'][];
  priority?: AutomatedTask['priority'][];
  agent?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
}

export interface TemplateFilter {
  type?: Template['type'][];
  category?: Template['category'][];
  language?: Template['language'][];
  isActive?: boolean;
  searchTerm?: string;
}

export interface AdminStats {
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  pendingTasks: number;
  averageTaskDuration: number;
  totalTemplates: number;
  activeTemplates: number;
  templateUsageToday: number;
  upcomingEvents: number;
  completedEventsToday: number;
} 