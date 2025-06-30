// src/services/agentAPI.ts
// AI Agent API Service Layer for PostgreSQL Database

// Types for AI Agents
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

// API Base URL - will be set via environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Generic API function
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// AI Agents API
export const agentAPI = {
  // Get all agents for a client
  async getAgents(clientId: string = 'demo_client'): Promise<AIAgent[]> {
    return apiCall<AIAgent[]>(`/api/agents?client_id=${clientId}`);
  },

  // Get specific agent
  async getAgent(agentId: number): Promise<AIAgent> {
    return apiCall<AIAgent>(`/api/agents/${agentId}`);
  },

  // Get agent tasks
  async getAgentTasks(agentId: number): Promise<AgentTask[]> {
    return apiCall<AgentTask[]>(`/api/agents/${agentId}/tasks`);
  },

  // Get agent metrics
  async getAgentMetrics(agentId: number): Promise<AgentMetrics[]> {
    return apiCall<AgentMetrics[]>(`/api/agents/${agentId}/metrics`);
  },

  // Get agent communications
  async getAgentCommunications(agentId: number): Promise<AgentCommunication[]> {
    return apiCall<AgentCommunication[]>(`/api/agents/${agentId}/communications`);
  },

  // Update agent status
  async updateAgentStatus(agentId: number, status: string): Promise<AIAgent> {
    return apiCall<AIAgent>(`/api/agents/${agentId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Create new task for agent
  async createTask(agentId: number, task: Partial<AgentTask>): Promise<AgentTask> {
    return apiCall<AgentTask>(`/api/agents/${agentId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(task),
    });
  },

  // Send message to agent
  async sendMessage(agentId: number, message: Partial<AgentCommunication>): Promise<AgentCommunication> {
    return apiCall<AgentCommunication>(`/api/agents/${agentId}/messages`, {
      method: 'POST',
      body: JSON.stringify(message),
    });
  },
};

// Client Settings API
export const clientAPI = {
  // Get client settings
  async getClientSettings(clientId: string = 'demo_client'): Promise<ClientSettings> {
    return apiCall<ClientSettings>(`/api/clients/${clientId}`);
  },

  // Update client settings
  async updateClientSettings(clientId: string, settings: Partial<ClientSettings>): Promise<ClientSettings> {
    return apiCall<ClientSettings>(`/api/clients/${clientId}`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },
};

// Dashboard Analytics API
export const analyticsAPI = {
  // Get dashboard overview
  async getDashboardOverview(clientId: string = 'demo_client') {
    return apiCall(`/api/analytics/overview?client_id=${clientId}`);
  },

  // Get performance metrics
  async getPerformanceMetrics(clientId: string = 'demo_client', period: '7d' | '30d' | '90d' = '7d') {
    return apiCall(`/api/analytics/performance?client_id=${clientId}&period=${period}`);
  },
};

// Mock data for development (when API is not available)
export const mockAgentData: AIAgent[] = [
  {
    id: 1,
    client_id: 'demo_client',
    agent_name: 'Sarah',
    agent_type: 'manager',
    agent_role: 'Manager Agent',
    personality: { tone: 'professional', style: 'consultative', languages: ['en', 'ar'] },
    capabilities: { voice_calling: true, strategic_analysis: true, client_consultation: true },
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    client_id: 'demo_client',
    agent_name: 'Alex',
    agent_type: 'coordinator',
    agent_role: 'Pipeline Coordinator',
    personality: { tone: 'efficient', style: 'systematic', languages: ['en', 'ar'] },
    capabilities: { lead_routing: true, workflow_orchestration: true, performance_monitoring: true },
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    client_id: 'demo_client',
    agent_name: 'Maya',
    agent_type: 'coordinator',
    agent_role: 'Campaign Coordinator',
    personality: { tone: 'creative', style: 'marketing_focused', languages: ['en', 'ar'] },
    capabilities: { campaign_management: true, social_media: true, content_creation: true },
    status: 'busy',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    client_id: 'demo_client',
    agent_name: 'Omar',
    agent_type: 'basic',
    agent_role: 'Lead Qualification Agent',
    personality: { tone: 'friendly', style: 'conversational', languages: ['en', 'ar'] },
    capabilities: { lead_scoring: true, initial_contact: true, data_collection: true },
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    client_id: 'demo_client',
    agent_name: 'Layla',
    agent_type: 'basic',
    agent_role: 'Follow-up Specialist',
    personality: { tone: 'warm', style: 'nurturing', languages: ['en', 'ar'] },
    capabilities: { email_sequences: true, relationship_building: true, client_retention: true },
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 6,
    client_id: 'demo_client',
    agent_name: 'Ahmed',
    agent_type: 'basic',
    agent_role: 'Appointment Agent',
    personality: { tone: 'organized', style: 'scheduling_focused', languages: ['en', 'ar'] },
    capabilities: { calendar_management: true, appointment_scheduling: true, reminder_systems: true },
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// React Query hooks for data fetching
export const useAgents = (clientId: string = 'demo_client') => {
  return {
    data: mockAgentData, // For now, use mock data
    isLoading: false,
    error: null,
  };
};

export const useAgentMetrics = (agentId: number) => {
  // Mock metrics for development
  const mockMetrics = {
    tasks_completed: Math.floor(Math.random() * 50 + 10),
    communications_handled: Math.floor(Math.random() * 100 + 20),
    leads_processed: Math.floor(Math.random() * 30 + 5),
    response_time_avg: '5 minutes',
    satisfaction_score: Math.random() * 2 + 3, // 3-5 rating
  };

  return {
    data: mockMetrics,
    isLoading: false,
    error: null,
  };
};

export default agentAPI;