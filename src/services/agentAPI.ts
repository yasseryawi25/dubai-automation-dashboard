import type { AIAgent, AgentCommunication, AgentTask, AgentMetrics } from '../types/agents';

// Mock data for development
const mockAgents: AIAgent[] = [
  {
    id: 'sarah-manager',
    name: 'Sarah',
    type: 'manager',
    status: 'active',
    avatar: '👩‍💼',
    specialty: 'Strategic Analysis & Voice Calls',
    lastActivity: 'Analyzing market trends',
    tasksCompleted: 47,
    successRate: 96,
    capabilities: ['voice_calls', 'market_analysis', 'strategic_planning'],
    configuration: {
      language: 'bilingual',
      expertise_level: 'expert',
      availability: '24/7'
    }
  },
  {
    id: 'alex-coordinator',
    name: 'Alex',
    type: 'coordinator',
    status: 'busy',
    avatar: '👨‍💻',
    specialty: 'Pipeline Coordination',
    lastActivity: 'Coordinating 12 active leads',
    tasksCompleted: 156,
    successRate: 94,
    capabilities: ['lead_routing', 'workflow_coordination', 'team_management'],
    configuration: {
      pipeline_focus: 'sales',
      automation_level: 'high',
      reporting: 'real_time'
    }
  },
  {
    id: 'maya-coordinator',
    name: 'Maya',
    type: 'coordinator',
    status: 'active',
    avatar: '👩‍🎨',
    specialty: 'Campaign Management',
    lastActivity: 'Optimizing email sequences',
    tasksCompleted: 203,
    successRate: 92,
    capabilities: ['campaign_management', 'content_optimization', 'a_b_testing'],
    configuration: {
      campaign_focus: 'marketing',
      optimization_frequency: 'daily',
      target_metrics: ['open_rate', 'click_rate', 'conversion']
    }
  },
  {
    id: 'omar-basic',
    name: 'Omar',
    type: 'basic',
    status: 'active',
    avatar: '👨‍🔬',
    specialty: 'Lead Qualification',
    lastActivity: 'Processing WhatsApp leads',
    tasksCompleted: 89,
    successRate: 88,
    capabilities: ['lead_qualification', 'data_processing', 'initial_contact'],
    configuration: {
      qualification_criteria: 'standard',
      response_time: 'immediate',
      escalation_threshold: 'high_value'
    }
  },
  {
    id: 'layla-basic',
    name: 'Layla',
    type: 'basic',
    status: 'idle',
    avatar: '👩‍📋',
    specialty: 'Follow-up Specialist',
    lastActivity: 'Completed email sequence',
    tasksCompleted: 134,
    successRate: 91,
    capabilities: ['follow_up_sequences', 'nurture_campaigns', 'engagement_tracking'],
    configuration: {
      sequence_type: 'personalized',
      follow_up_frequency: 'optimal',
      content_style: 'professional'
    }
  },
  {
    id: 'ahmed-basic',
    name: 'Ahmed',
    type: 'basic',
    status: 'busy',
    avatar: '👨‍📅',
    specialty: 'Appointment Scheduling',
    lastActivity: 'Scheduling client meetings',
    tasksCompleted: 67,
    successRate: 89,
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
    agentId: 'sarah-manager',
    type: 'insight',
    content: 'Market analysis shows 23% increase in Downtown Dubai inquiries. Recommend adjusting targeting.',
    timestamp: new Date().toISOString(),
    metadata: {
      confidence: 0.92,
      data_points: 156,
      trend: 'positive'
    }
  },
  {
    id: '2',
    agentId: 'alex-coordinator',
    type: 'status_update',
    content: 'Pipeline coordination: 12 leads in progress, 3 ready for viewing, 2 pending approval.',
    timestamp: new Date().toISOString(),
    metadata: {
      pipeline_stage: 'active',
      priority_leads: 3
    }
  }
];

const mockTasks: AgentTask[] = [
  {
    id: 'task-1',
    agentId: 'omar-basic',
    type: 'lead_qualification',
    title: 'Qualify WhatsApp inquiry - Downtown apartment',
    description: 'New WhatsApp inquiry about 2BR apartment in Downtown Dubai',
    status: 'in_progress',
    priority: 'medium',
    createdAt: new Date().toISOString(),
    deadline: new Date(Date.now() + 86400000).toISOString(), // 24 hours
    metadata: {
      lead_source: 'whatsapp',
      property_type: 'apartment',
      location: 'downtown'
    }
  },
  {
    id: 'task-2',
    agentId: 'layla-basic',
    type: 'follow_up',
    title: 'Follow up with investment client',
    description: 'Third follow-up email for high-value investment opportunity',
    status: 'pending',
    priority: 'high',
    createdAt: new Date().toISOString(),
    deadline: new Date(Date.now() + 43200000).toISOString(), // 12 hours
    metadata: {
      client_value: 'high',
      follow_up_sequence: 3,
      previous_response: 'interested'
    }
  }
];

const mockMetrics: AgentMetrics[] = [
  {
    agentId: 'sarah-manager',
    date: new Date().toISOString().split('T')[0],
    tasksCompleted: 8,
    tasksAssigned: 10,
    successRate: 96,
    responseTime: 145, // seconds
    clientSatisfaction: 4.8,
    metadata: {
      voice_calls_made: 5,
      insights_generated: 12,
      recommendations_accepted: 8
    }
  }
];

// API Functions
export const agentAPI = {
  // Agent Management
  async getAgents(): Promise<AIAgent[]> {
    // Simulate API delay
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
      return true;
    }
    return false;
  },

  async updateAgentConfiguration(agentId: string, configuration: Record<string, any>): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const agentIndex = mockAgents.findIndex(agent => agent.id === agentId);
    if (agentIndex !== -1) {
      mockAgents[agentIndex].configuration = { 
        ...mockAgents[agentIndex].configuration, 
        ...configuration 
      };
      return true;
    }
    return false;
  },

  // Communication
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
        target_agent: agentId
      }
    };
    mockCommunications.push(newCommunication);
    return newCommunication;
  },

  async getAgentResponse(agentId: string): Promise<AgentCommunication> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const agent = mockAgents.find(a => a.id === agentId);
    
    // Generate contextual response based on agent type
    let responseContent = 'I understand your request. Let me help you with that.';
    
    if (agent?.type === 'manager') {
      responseContent = 'Based on current market analysis, I recommend focusing on high-conversion strategies. Would you like me to provide specific insights?';
    } else if (agent?.type === 'coordinator') {
      responseContent = 'I\'ll coordinate this request across the team and ensure optimal execution. Let me check the current pipeline status.';
    } else if (agent?.type === 'basic') {
      responseContent = 'I\'ll process this request immediately. This task aligns with my specialization and I can handle it efficiently.';
    }

    const response: AgentCommunication = {
      id: Date.now().toString(),
      agentId,
      type: 'response',
      content: responseContent,
      timestamp: new Date().toISOString(),
      metadata: {
        confidence: 0.85
      }
    };
    
    mockCommunications.push(response);
    return response;
  },

  // Task Management
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
    mockTasks.push(newTask);
    return newTask;
  },

  async updateTaskStatus(taskId: string, status: AgentTask['status']): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const taskIndex = mockTasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      mockTasks[taskIndex].status = status;
      return true;
    }
    return false;
  },

  // Metrics and Analytics
  async getAgentMetrics(agentId: string, startDate?: string, endDate?: string): Promise<AgentMetrics[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    // Filter and return metrics for the specified agent and date range
    return mockMetrics.filter(metric => {
      const matchesAgent = metric.agentId === agentId;
      const matchesDateRange = !startDate || !endDate || 
        (metric.date >= startDate && metric.date <= endDate);
      return matchesAgent && matchesDateRange;
    });
  },

  async getTeamMetrics(startDate?: string, endDate?: string): Promise<AgentMetrics[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Return all metrics for team overview
    return mockMetrics.filter(metric => {
      const matchesDateRange = !startDate || !endDate || 
        (metric.date >= startDate && metric.date <= endDate);
      return matchesDateRange;
    });
  },

  // Voice and Advanced Features
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
      duration: 180, // seconds
      recording: `recording-${callId}.mp3`
    };
  }
};

export default agentAPI;