// Base AI Agent interface
export interface AIAgent {
  id: string;
  name: string;
  type: 'manager' | 'coordinator' | 'basic';
  status: 'active' | 'idle' | 'busy' | 'offline';
  avatar: string;
  specialty: string;
  lastActivity: string;
  tasksCompleted: number;
  successRate: number;
  capabilities?: string[];
  configuration?: Record<string, any>;
}

// Agent Communication interface
export interface AgentCommunication {
  id: string;
  agentId: string;
  type: 'message' | 'response' | 'insight' | 'recommendation' | 'alert' | 'status_update';
  content: string;
  timestamp: string;
  metadata: Record<string, any>;
}

// Agent Task interface
export interface AgentTask {
  id: string;
  agentId: string;
  type: 'lead_qualification' | 'follow_up' | 'appointment_scheduling' | 'market_analysis' | 'content_creation' | 'voice_call' | 'data_processing';
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  deadline?: string;
  metadata: Record<string, any>;
}

// Agent Metrics interface
export interface AgentMetrics {
  agentId: string;
  date: string;
  tasksCompleted: number;
  tasksAssigned: number;
  successRate: number;
  responseTime: number; // in seconds
  clientSatisfaction: number; // 1-5 scale
  metadata: Record<string, any>;
}

// Agent Performance Summary
export interface AgentPerformance {
  agentId: string;
  period: string; // e.g., "2024-01", "2024-01-15"
  totalTasks: number;
  completedTasks: number;
  averageResponseTime: number;
  successRate: number;
  clientSatisfactionScore: number;
  improvementAreas: string[];
  strengths: string[];
}

// Voice Call interface
export interface VoiceCall {
  id: string;
  agentId: string;
  clientPhone: string;
  status: 'initiated' | 'ringing' | 'in_progress' | 'completed' | 'failed';
  startTime?: string;
  endTime?: string;
  duration?: number; // in seconds
  recordingUrl?: string;
  transcription?: string;
  outcome?: string;
  metadata: Record<string, any>;
}

// Agent Configuration interface
export interface AgentConfiguration {
  agentId: string;
  personalitySettings: {
    tone: 'professional' | 'friendly' | 'casual' | 'formal';
    language: 'english' | 'arabic' | 'bilingual';
    communicationStyle: 'direct' | 'conversational' | 'consultative';
  };
  workingHours: {
    timezone: string;
    availableHours: {
      start: string; // HH:MM format
      end: string;   // HH:MM format
    };
    workingDays: number[]; // 0=Sunday, 1=Monday, etc.
  };
  automationSettings: {
    autoResponseDelay: number; // in seconds
    escalationThreshold: number; // priority level
    maxConcurrentTasks: number;
  };
  specializations: string[];
  integrations: {
    whatsapp: boolean;
    email: boolean;
    voiceCalls: boolean;
    calendar: boolean;
  };
}

// Team Overview interface
export interface TeamOverview {
  totalAgents: number;
  activeAgents: number;
  busyAgents: number;
  idleAgents: number;
  totalTasksToday: number;
  completedTasksToday: number;
  averageSuccessRate: number;
  topPerformer: {
    agentId: string;
    name: string;
    successRate: number;
  };
  recentAlerts: AgentCommunication[];
}

// Lead information for agent processing
export interface LeadInfo {
  id: string;
  source: 'whatsapp' | 'email' | 'website' | 'phone' | 'referral';
  contactInfo: {
    name?: string;
    phone?: string;
    email?: string;
    preferredLanguage: 'english' | 'arabic' | 'both';
  };
  inquiry: {
    propertyType: 'apartment' | 'villa' | 'office' | 'retail' | 'land';
    purpose: 'buy' | 'rent' | 'invest';
    budget?: {
      min: number;
      max: number;
      currency: 'AED' | 'USD';
    };
    location?: string;
    timeline?: string;
  };
  status: 'new' | 'contacted' | 'qualified' | 'viewing_scheduled' | 'negotiating' | 'closed' | 'lost';
  assignedAgentId?: string;
  qualificationScore?: number;
  notes: string[];
  createdAt: string;
  updatedAt: string;
}

// Real-time updates interface
export interface RealtimeUpdate {
  type: 'agent_status' | 'new_task' | 'task_completed' | 'new_communication' | 'metric_update';
  agentId?: string;
  data: any;
  timestamp: string;
}

// Export all types
export type {
  AIAgent,
  AgentCommunication,
  AgentTask,
  AgentMetrics,
  AgentPerformance,
  VoiceCall,
  AgentConfiguration,
  TeamOverview,
  LeadInfo,
  RealtimeUpdate
};