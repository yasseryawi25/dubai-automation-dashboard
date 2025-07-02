import type { AIAgent, AgentCommunication, AgentTask, AgentMetrics } from '../types/agents';
import realAgentAPI from './realAgentAPI';

// Check if we should use mock data
const USE_MOCK_DATA = import.meta.env.VITE_MOCK_DATA === 'true' || import.meta.env.DEV;

// Mock data for development (keeping existing mock data)
const mockAgents: AIAgent[] = [
  {
    id: 'omar-hassan',
    name: 'Omar Hassan',
    type: 'basic',
    status: 'active',
    avatar: '🎯',
    specialty: 'Lead Qualification Specialist - 24/7 Prospect Processing',
    lastActivity: 'Processing WhatsApp leads - 3 in queue',
    tasksCompleted: 189,
    successRate: 87.3,
    capabilities: ['whatsapp_automation', 'lead_scoring', 'language_detection', 'qualification', 'real_time_response'],
    configuration: {
      qualification_criteria: 'dubai_real_estate',
      response_time: 'under_30_seconds',
      escalation_threshold: 'high_value',
      languages: ['english', 'arabic'],
      specialization: 'dubai_property_market'
    }
  },
  {
    id: 'sarah-manager',
    name: 'Sarah Al-Mansouri',
    type: 'manager',
    status: 'active',
    avatar: '👩‍💼',
    specialty: 'Strategic Analysis & Voice Calls',
    lastActivity: 'Analyzing market trends',
    tasksCompleted: 47,
    successRate: 96.2,
    capabilities: ['voice_calls', 'market_analysis', 'strategic_planning', 'arabic_english', 'client_consultation'],
    configuration: {
      language: 'bilingual',
      expertise_level: 'expert',
      availability: '24/7'
    }
  },
  {
    id: 'alex-coordinator',
    name: 'Alex Thompson',
    type: 'coordinator',
    status: 'busy',
    avatar: '👨‍💻',
    specialty: 'Pipeline Coordination',
    lastActivity: 'Coordinating 12 active leads',
    tasksCompleted: 342,
    successRate: 87.3,
    capabilities: ['lead_routing', 'workflow_coordination', 'team_management'],
    configuration: {
      pipeline_focus: 'sales',
      automation_level: 'high',
      reporting: 'real_time'
    }
  },
  {
    id: 'maya-coordinator',
    name: 'Maya Patel',
    type: 'coordinator',
    status: 'active',
    avatar: '👩‍🎨',
    specialty: 'Campaign Management',
    lastActivity: 'Optimizing email sequences',
    tasksCompleted: 89,
    successRate: 91.5,
    capabilities: ['campaign_management', 'content_optimization', 'a_b_testing'],
    configuration: {
      campaign_focus: 'marketing',
      optimization_frequency: 'daily',
      target_metrics: ['open_rate', 'click_rate', 'conversion']
    }
  },
  {
    id: 'layla-basic',
    name: 'Layla Ahmed',
    type: 'basic',
    status: 'idle',
    avatar: '💌',
    specialty: 'Follow-up Specialist',
    lastActivity: 'Completed email sequence',
    tasksCompleted: 1247,
    successRate: 89.7,
    capabilities: ['follow_up_sequences', 'nurture_campaigns', 'engagement_tracking'],
    configuration: {
      sequence_type: 'personalized',
      follow_up_frequency: 'optimal',
      content_style: 'professional'
    }
  },
  {
    id: 'ahmed-basic',
    name: 'Ahmed Khalil',
    type: 'basic',
    status: 'busy',
    avatar: '📅',
    specialty: 'Appointment Scheduling',
    lastActivity: 'Scheduling client meetings',
    tasksCompleted: 156,
    successRate: 89.7,
    capabilities: ['appointment_scheduling', 'calendar_management', 'reminder_system'],
    configuration: {
      scheduling_preferences: 'flexible',
      reminder_timing: 'optimal',
      conflict_resolution: 'automatic'
    }
  }
];

const mockCommunications: AgentCommunication[] = [
  {
    id: '1',
    agentId: 'omar-hassan',
    type: 'status_update',
    content: 'Omar online and monitoring WhatsApp channel. 3 leads in qualification queue. Average response time: 28 seconds. Ready for new inquiries.',
    timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
    metadata: {
      status: 'active',
      queue_size: 3,
      avg_response_time: 28,
      channels_monitored: ['whatsapp', 'web_form']
    }
  },
  {
    id: '2',
    agentId: 'omar-hassan',
    type: 'insight',
    content: 'Successfully qualified lead Ahmed Al-Rashid (Downtown apartment). Qualification score: 8.5/10. Budget confirmed: AED 800K-1.2M. Available for viewing this week. Forwarded to viewing coordinator.',
    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    metadata: {
      insight_type: 'qualification_completed',
      qualification_score: 8.5,
      confidence: 0.92,
      next_agent: 'viewing_coordinator'
    }
  },
  {
    id: '3',
    agentId: 'sarah-manager',
    type: 'insight',
    content: 'مرحباً! لقد حللت أداء الأسبوع الماضي. معدل تحويل العملاء المحتملين تحسن بنسبة 15%. النهج الأكثر فعالية كان الرسائل ثنائية اللغة العربية-الإنجليزية.\n\nHello! I\'ve analyzed last week\'s performance. Your lead conversion rate improved by 15%. The most effective approach was the Arabic-English bilingual messaging.',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    metadata: {
      confidence: 0.95,
      data_points: 156,
      trend: 'positive',
      bilingual: true
    }
  }
];

const mockTasks: AgentTask[] = [
  {
    id: 'task-omar-1',
    agentId: 'omar-hassan',
    type: 'lead_qualification',
    title: 'Qualify WhatsApp Lead - Ahmed Al-Rashid',
    description: 'New WhatsApp inquiry from Ahmed Al-Rashid about 2BR apartment in Downtown Dubai. Budget: AED 800K-1.2M. Timeline: 3 months.',
    status: 'pending',
    priority: 'high',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    deadline: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
    metadata: {
      lead_source: 'whatsapp',
      language_detected: 'english',
      property_interest: 'apartment',
      location_preference: 'downtown',
      budget_qualified: true,
      timeline_urgent: false
    }
  },
  {
    id: 'task-omar-2',
    agentId: 'omar-hassan',
    type: 'lead_qualification',
    title: 'Process Marina Inquiry - Sarah Johnson',
    description: 'WhatsApp lead about villa rental in Dubai Marina',
    status: 'completed',
    priority: 'medium',
    createdAt: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
    completedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    metadata: {
      lead_source: 'whatsapp',
      language_detected: 'english',
      qualification_score: 8.5,
      qualified: true,
      next_action: 'schedule_viewing'
    }
  }
];

const mockMetrics: AgentMetrics[] = [
  {
    agentId: 'omar-hassan',
    date: new Date().toISOString().split('T')[0],
    tasksCompleted: 4,
    tasksAssigned: 5,
    successRate: 80,
    responseTime: 28,
    clientSatisfaction: 4.6,
    metadata: {
      leads_qualified: 4,
      avg_qualification_score: 7.2,
      languages_processed: 2,
      auto_responses_sent: 12
    }
  }
];

// Mock API implementation
const mockAPI = {
  async getAgents(): Promise<AIAgent[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockAgents;
  },

  async getAgent(agentId: string): Promise<AIAgent | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockAgents.find(agent => agent.id === agentId) || null;
  },

  async updateAgentStatus(agentId: string, status: AIAgent['status']): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const agentIndex = mockAgents.findIndex(agent => agent.id === agentId);
    if (agentIndex !== -1) {
      mockAgents[agentIndex].status = status;
      mockAgents[agentIndex].lastActivity = `Status changed to ${status}`;
      return true;
    }
    return false;
  },

  async getCommunications(agentId?: string): Promise<AgentCommunication[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (agentId) {
      return mockCommunications.filter(comm => comm.agentId === agentId);
    }
    return mockCommunications;
  },

  async sendMessage(agentId: string, content: string, type: AgentCommunication['type'] = 'message'): Promise<AgentCommunication> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newCommunication: AgentCommunication = {
      id: Date.now().toString(),
      agentId: 'user',
      type,
      content,
      timestamp: new Date().toISOString(),
      metadata: {
        target_agent: agentId,
        source: 'dashboard'
      }
    };
    mockCommunications.unshift(newCommunication);
    return newCommunication;
  },

  async getAgentResponse(agentId: string): Promise<AgentCommunication> {
    await new Promise(resolve => setTimeout(resolve, 1200));
    const agent = mockAgents.find(a => a.id === agentId);
    
    let responseContent = 'I understand your request. Let me help you with that.';
    
    if (agent?.name.includes('Omar')) {
      responseContent = 'I\'ll qualify this lead immediately. Based on the information provided, I can score this inquiry and provide next steps within 30 seconds. My current qualification accuracy is 87.3% with average response time of 28 seconds.';
    } else if (agent?.name.includes('Sarah')) {
      responseContent = 'Based on current market analysis, I recommend focusing on high-conversion strategies. Would you like me to provide specific insights about Dubai\'s real estate trends?';
    } else if (agent?.type === 'coordinator') {
      responseContent = 'I\'ll coordinate this request across the team and ensure optimal execution. Let me check the current pipeline status.';
    } else if (agent?.type === 'basic') {
      responseContent = 'I\'ll process this request efficiently according to my specialization. This aligns perfectly with my capabilities.';
    }

    const response: AgentCommunication = {
      id: Date.now().toString(),
      agentId,
      type: 'response',
      content: responseContent,
      timestamp: new Date().toISOString(),
      metadata: {
        confidence: 0.85,
        response_time: Math.floor(800 + Math.random() * 400),
        generated: true
      }
    };
    
    mockCommunications.unshift(response);
    return response;
  },

  async getTasks(agentId?: string): Promise<AgentTask[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (agentId) {
      return mockTasks.filter(task => task.agentId === agentId);
    }
    return mockTasks;
  },

  async createTask(task: Omit<AgentTask, 'id' | 'createdAt'>): Promise<AgentTask> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newTask: AgentTask = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    mockTasks.unshift(newTask);
    return newTask;
  },

  async updateTaskStatus(taskId: string, status: AgentTask['status']): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const taskIndex = mockTasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      mockTasks[taskIndex].status = status;
      if (status === 'completed') {
        mockTasks[taskIndex].completedAt = new Date().toISOString();
      }
      return true;
    }
    return false;
  },

  async getAgentMetrics(agentId: string, startDate?: string, endDate?: string): Promise<AgentMetrics[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockMetrics.filter(metric => {
      const matchesAgent = metric.agentId === agentId;
      const matchesDateRange = !startDate || !endDate || 
        (metric.date >= startDate && metric.date <= endDate);
      return matchesAgent && matchesDateRange;
    });
  },

  async getTeamMetrics(startDate?: string, endDate?: string): Promise<AgentMetrics[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockMetrics.filter(metric => {
      const matchesDateRange = !startDate || !endDate || 
        (metric.date >= startDate && metric.date <= endDate);
      return matchesDateRange;
    });
  },

  async initiateVoiceCall(phoneNumber: string): Promise<{ callId: string; status: string }> {
    await new Promise(resolve => setTimeout(resolve, 600));
    console.log('Initiating call to:', phoneNumber);
    return {
      callId: `call-${Date.now()}`,
      status: 'initiated'
    };
  },

  async getVoiceCallStatus(callId: string): Promise<{ status: string; duration?: number; recording?: string }> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      status: 'completed',
      duration: 180,
      recording: `recording-${callId}.mp3`
    };
  },

  async healthCheck(): Promise<boolean> {
    return true;
  }
};

// Export the appropriate API based on configuration
export const agentAPI = USE_MOCK_DATA ? mockAPI : realAgentAPI;

// Export individual functions for easier testing
export const {
  getAgents,
  getAgent,
  updateAgentStatus,
  getCommunications,
  sendMessage,
  getAgentResponse,
  getTasks,
  createTask,
  updateTaskStatus,
  getAgentMetrics,
  getTeamMetrics,
  initiateVoiceCall,
  getVoiceCallStatus
} = agentAPI;

export default agentAPI;

// Development helper
if (import.meta.env.DEV) {
  console.log(`🤖 AI Agent API Mode: ${USE_MOCK_DATA ? 'MOCK DATA' : 'REAL DATABASE'}`);
  if (USE_MOCK_DATA) {
    console.log('📊 Using mock data with Omar Hassan as featured Lead Qualification Agent');
  }
}
