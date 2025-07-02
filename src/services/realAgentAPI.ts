// Real database API implementation using backend server
import type { AIAgent, AgentCommunication, AgentTask, AgentMetrics } from '../types/agents';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// HTTP client helper
class APIClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorData.error || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request error for ${endpoint}:`, error);
      throw error;
    }
  }

  async get(endpoint: string): Promise<any> {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint: string, data: any): Promise<any> {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint: string, data: any): Promise<any> {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

const apiClient = new APIClient(API_BASE_URL);

// Real database API implementation
export const realAgentAPI = {
  // Agent Management
  async getAgents(): Promise<AIAgent[]> {
    try {
      return await apiClient.get('/api/agents');
    } catch (error) {
      console.error('Error fetching agents:', error);
      return [];
    }
  },

  async getAgent(agentId: string): Promise<AIAgent | null> {
    try {
      const agents = await this.getAgents();
      return agents.find(agent => agent.id === agentId) || null;
    } catch (error) {
      console.error('Error fetching agent:', error);
      return null;
    }
  },

  async updateAgentStatus(agentId: string, status: AIAgent['status']): Promise<boolean> {
    try {
      const result = await apiClient.put(`/api/agents/${agentId}/status`, { status });
      return result.success === true;
    } catch (error) {
      console.error('Error updating agent status:', error);
      return false;
    }
  },

  async updateAgentConfiguration(agentId: string, configuration: Record<string, any>): Promise<boolean> {
    try {
      // For now, we'll store this in localStorage since we don't have a backend endpoint
      // In production, you'd want to add this to the API server
      const key = `agent_config_${agentId}`;
      localStorage.setItem(key, JSON.stringify(configuration));
      return true;
    } catch (error) {
      console.error('Error updating agent configuration:', error);
      return false;
    }
  },

  // Communication
  async getCommunications(agentId?: string): Promise<AgentCommunication[]> {
    try {
      if (agentId) {
        return await apiClient.get(`/api/agents/${agentId}/communications`);
      } else {
        // Get communications for all agents
        const agents = await this.getAgents();
        const allCommunications: AgentCommunication[] = [];
        
        for (const agent of agents) {
          try {
            const communications = await apiClient.get(`/api/agents/${agent.id}/communications`);
            allCommunications.push(...communications);
          } catch (error) {
            console.warn(`Failed to fetch communications for agent ${agent.id}:`, error);
          }
        }
        
        // Sort by timestamp descending
        return allCommunications.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      }
    } catch (error) {
      console.error('Error fetching communications:', error);
      return [];
    }
  },

  async sendMessage(agentId: string, content: string, type: AgentCommunication['type'] = 'message'): Promise<AgentCommunication> {
    try {
      return await apiClient.post(`/api/agents/${agentId}/message`, { content, type });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  async getAgentResponse(agentId: string): Promise<AgentCommunication> {
    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Get agent info for contextual response
      const agent = await this.getAgent(agentId);
      let responseContent = 'I understand your request. Let me help you with that.';

      if (agent) {
        if (agent.name.includes('Omar')) {
          responseContent = `I'm analyzing this request now. As your Lead Qualification Agent, I can process this inquiry immediately. My current stats: ${agent.tasksCompleted} leads processed with ${agent.successRate}% accuracy. I'll have results within 30 seconds.`;
        } else if (agent.name.includes('Sarah')) {
          responseContent = 'مرحباً! أنا سارة، مديرة الفريق. سأحلل طلبك وأقدم توصيات استراتيجية.\n\nHello! I\'m Sarah, your team manager. I\'ll analyze your request and provide strategic recommendations based on current market data.';
        } else if (agent.type === 'coordinator') {
          responseContent = `I'll coordinate this request across the team. Currently managing ${agent.tasksCompleted} completed tasks with ${agent.successRate}% success rate. Let me optimize the workflow for you.`;
        } else if (agent.type === 'basic') {
          responseContent = `Perfect! This request aligns with my specialization: ${agent.specialty}. I'll handle this efficiently using my proven processes.`;
        }
      }

      // Send the response through the API
      return await this.sendMessage(agentId, responseContent, 'response');
    } catch (error) {
      console.error('Error generating agent response:', error);
      throw error;
    }
  },

  // Task Management
  async getTasks(agentId?: string): Promise<AgentTask[]> {
    try {
      if (agentId) {
        return await apiClient.get(`/api/agents/${agentId}/tasks`);
      } else {
        // Get tasks for all agents
        const agents = await this.getAgents();
        const allTasks: AgentTask[] = [];
        
        for (const agent of agents) {
          try {
            const tasks = await apiClient.get(`/api/agents/${agent.id}/tasks`);
            allTasks.push(...tasks);
          } catch (error) {
            console.warn(`Failed to fetch tasks for agent ${agent.id}:`, error);
          }
        }
        
        // Sort by priority and creation date
        return allTasks.sort((a, b) => {
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          const aPriority = priorityOrder[a.priority] || 1;
          const bPriority = priorityOrder[b.priority] || 1;
          
          if (aPriority !== bPriority) {
            return bPriority - aPriority;
          }
          
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  },

  async createTask(task: Omit<AgentTask, 'id' | 'createdAt'>): Promise<AgentTask> {
    try {
      // For now, this would need to be implemented in the backend
      // Simulating task creation
      const newTask: AgentTask = {
        ...task,
        id: `task-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      
      console.log('Task creation would be implemented in backend:', newTask);
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  async updateTaskStatus(taskId: string, status: AgentTask['status']): Promise<boolean> {
    try {
      // This would need to be implemented in the backend
      console.log(`Task ${taskId} status update to ${status} would be implemented in backend`);
      return true;
    } catch (error) {
      console.error('Error updating task status:', error);
      return false;
    }
  },

  // Metrics and Analytics
  async getAgentMetrics(agentId: string, startDate?: string, endDate?: string): Promise<AgentMetrics[]> {
    try {
      // This would need to be implemented in the backend
      // For now, return empty array
      console.log(`Agent metrics for ${agentId} would be fetched from backend`);
      return [];
    } catch (error) {
      console.error('Error fetching agent metrics:', error);
      return [];
    }
  },

  async getTeamMetrics(startDate?: string, endDate?: string): Promise<AgentMetrics[]> {
    try {
      // This would need to be implemented in the backend
      console.log('Team metrics would be fetched from backend');
      return [];
    } catch (error) {
      console.error('Error fetching team metrics:', error);
      return [];
    }
  },

  // Voice and Advanced Features
  async initiateVoiceCall(phoneNumber: string): Promise<{ callId: string; status: string }> {
    try {
      // This would integrate with VAPI service
      console.log('Voice call initiation would use VAPI integration');
      return {
        callId: `call-${Date.now()}`,
        status: 'initiated'
      };
    } catch (error) {
      console.error('Error initiating voice call:', error);
      throw error;
    }
  },

  async getVoiceCallStatus(callId: string): Promise<{ status: string; duration?: number; recording?: string }> {
    try {
      // This would check VAPI call status
      console.log(`Voice call status check for ${callId} would use VAPI`);
      return {
        status: 'completed',
        duration: 180,
        recording: `recording-${callId}.mp3`
      };
    } catch (error) {
      console.error('Error getting voice call status:', error);
      throw error;
    }
  },

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const health = await apiClient.get('/health');
      return health.status === 'healthy';
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
};

export default realAgentAPI;
