import axios from 'axios';

// n8n Service for Dubai Real Estate AI Platform
// This service connects the dashboard to n8n workflows for real automation

interface N8nWorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'success' | 'error' | 'waiting' | 'canceled';
  data?: any;
  error?: string;
  startedAt: string;
  finishedAt?: string;
}

interface N8nWebhookPayload {
  trigger: string;
  data: any;
  timestamp: string;
  clientId: string;
}

class N8nService {
  private baseUrl: string;
  private apiKey: string;
  private webhookUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_N8N_API_URL || 'https://n8n.yasta.online';
    this.apiKey = import.meta.env.VITE_N8N_API_KEY || '';
    this.webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://n8n.yasta.online/webhook';
    
    console.log('🔗 n8n Service initialized:', {
      baseUrl: this.baseUrl,
      hasApiKey: !!this.apiKey,
      webhookUrl: this.webhookUrl
    });
  }

  // ===========================================
  // LEAD QUALIFICATION WORKFLOWS
  // ===========================================

  /**
   * Trigger lead qualification workflow
   * This processes new leads through Omar Hassan (Lead Qualification Agent)
   */
  async triggerLeadQualification(leadData: {
    id: string;
    name: string;
    phone: string;
    email?: string;
    message: string;
    source: string;
    clientId: string;
  }): Promise<{ success: boolean; executionId?: string; error?: string }> {
    try {
      console.log('🎯 Triggering lead qualification for:', leadData.name);

      const payload: N8nWebhookPayload = {
        trigger: 'lead_qualification',
        data: {
          ...leadData,
          timestamp: new Date().toISOString(),
          agent: 'omar-hassan',
          priority: this.calculateLeadPriority(leadData)
        },
        timestamp: new Date().toISOString(),
        clientId: leadData.clientId
      };

      const response = await axios.post(
        `${this.webhookUrl}/lead-qualification`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this.apiKey,
            'X-Client-ID': leadData.clientId
          },
          timeout: 10000
        }
      );

      console.log('✅ Lead qualification triggered successfully:', response.data);

      return {
        success: true,
        executionId: response.data.executionId || response.data.id,
        error: null
      };
    } catch (error) {
      console.error('❌ Lead qualification trigger failed:', error);
      return {
        success: false,
        error: this.handleError(error)
      };
    }
  }

  /**
   * Trigger WhatsApp automation workflow
   */
  async triggerWhatsAppAutomation(data: {
    phoneNumber: string;
    message: string;
    template?: string;
    leadId?: string;
    clientId: string;
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      console.log('💬 Triggering WhatsApp automation for:', data.phoneNumber);

      const payload: N8nWebhookPayload = {
        trigger: 'whatsapp_automation',
        data: {
          ...data,
          timestamp: new Date().toISOString(),
          agent: 'omar-hassan'
        },
        timestamp: new Date().toISOString(),
        clientId: data.clientId
      };

      const response = await axios.post(
        `${this.webhookUrl}/whatsapp-automation`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this.apiKey,
            'X-Client-ID': data.clientId
          },
          timeout: 10000
        }
      );

      return {
        success: true,
        messageId: response.data.messageId || response.data.id,
        error: null
      };
    } catch (error) {
      console.error('❌ WhatsApp automation trigger failed:', error);
      return {
        success: false,
        error: this.handleError(error)
      };
    }
  }

  /**
   * Trigger email follow-up sequence
   */
  async triggerEmailSequence(data: {
    email: string;
    firstName: string;
    lastName: string;
    sequenceType: 'first_time_buyer' | 'investor' | 'luxury' | 'renter';
    leadId: string;
    clientId: string;
  }): Promise<{ success: boolean; sequenceId?: string; error?: string }> {
    try {
      console.log('📧 Triggering email sequence for:', data.email);

      const payload: N8nWebhookPayload = {
        trigger: 'email_sequence',
        data: {
          ...data,
          timestamp: new Date().toISOString(),
          agent: 'layla-ahmed'
        },
        timestamp: new Date().toISOString(),
        clientId: data.clientId
      };

      const response = await axios.post(
        `${this.webhookUrl}/email-sequence`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this.apiKey,
            'X-Client-ID': data.clientId
          },
          timeout: 10000
        }
      );

      return {
        success: true,
        sequenceId: response.data.sequenceId || response.data.id,
        error: null
      };
    } catch (error) {
      console.error('❌ Email sequence trigger failed:', error);
      return {
        success: false,
        error: this.handleError(error)
      };
    }
  }

  // ===========================================
  // AGENT COORDINATION WORKFLOWS
  // ===========================================

  /**
   * Trigger agent coordination workflow
   * This orchestrates multiple agents for complex tasks
   */
  async triggerAgentCoordination(data: {
    task: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    agents: string[];
    context: any;
    clientId: string;
  }): Promise<{ success: boolean; coordinationId?: string; error?: string }> {
    try {
      console.log('🎭 Triggering agent coordination for task:', data.task);

      const payload: N8nWebhookPayload = {
        trigger: 'agent_coordination',
        data: {
          ...data,
          timestamp: new Date().toISOString(),
          coordinator: 'alex-thompson'
        },
        timestamp: new Date().toISOString(),
        clientId: data.clientId
      };

      const response = await axios.post(
        `${this.webhookUrl}/agent-coordination`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this.apiKey,
            'X-Client-ID': data.clientId
          },
          timeout: 15000
        }
      );

      return {
        success: true,
        coordinationId: response.data.coordinationId || response.data.id,
        error: null
      };
    } catch (error) {
      console.error('❌ Agent coordination trigger failed:', error);
      return {
        success: false,
        error: this.handleError(error)
      };
    }
  }

  // ===========================================
  // WORKFLOW STATUS & MONITORING
  // ===========================================

  /**
   * Get workflow execution status
   */
  async getExecutionStatus(executionId: string): Promise<N8nWorkflowExecution | null> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/api/v1/executions/${executionId}`,
        {
          headers: {
            'X-N8N-API-KEY': this.apiKey
          },
          timeout: 5000
        }
      );

      return {
        id: response.data.id,
        workflowId: response.data.workflowId,
        status: response.data.status,
        data: response.data.data,
        error: response.data.error,
        startedAt: response.data.startedAt,
        finishedAt: response.data.finishedAt
      };
    } catch (error) {
      console.error('❌ Failed to get execution status:', error);
      return null;
    }
  }

  /**
   * Get active workflows for client
   */
  async getActiveWorkflows(clientId: string): Promise<N8nWorkflowExecution[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/api/v1/executions`,
        {
          headers: {
            'X-N8N-API-KEY': this.apiKey,
            'X-Client-ID': clientId
          },
          params: {
            status: 'running',
            limit: 50
          },
          timeout: 5000
        }
      );

      return response.data.data || [];
    } catch (error) {
      console.error('❌ Failed to get active workflows:', error);
      return [];
    }
  }

  // ===========================================
  // HELPER METHODS
  // ===========================================

  /**
   * Calculate lead priority based on data
   */
  private calculateLeadPriority(leadData: any): 'low' | 'medium' | 'high' | 'urgent' {
    let score = 0;

    // Phone number provided
    if (leadData.phone) score += 20;
    
    // Email provided
    if (leadData.email) score += 15;
    
    // Message length indicates serious inquiry
    if (leadData.message && leadData.message.length > 50) score += 25;
    
    // Source quality
    if (leadData.source === 'website') score += 20;
    if (leadData.source === 'referral') score += 30;
    if (leadData.source === 'whatsapp') score += 25;
    
    // Keywords in message indicating urgency
    const urgentKeywords = ['urgent', 'immediately', 'asap', 'today', 'now'];
    if (urgentKeywords.some(keyword => 
      leadData.message?.toLowerCase().includes(keyword)
    )) {
      score += 40;
    }

    if (score >= 80) return 'urgent';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }

  /**
   * Handle errors consistently
   */
  private handleError(error: any): string {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        return 'Unable to connect to n8n server. Please check if n8n is running.';
      }
      if (error.response?.status === 401) {
        return 'Invalid n8n API key. Please check your configuration.';
      }
      if (error.response?.status === 404) {
        return 'n8n webhook endpoint not found. Please check your webhook URL.';
      }
      return `n8n API error: ${error.response?.data?.message || error.message}`;
    }
    
    return error.message || 'Unknown error occurred';
  }

  /**
   * Test dashboard webhook directly
   */
  async testDashboardWebhook(data: {
    action: string;
    agent: string;
    clientId: string;
    data: any;
  }): Promise<{ success: boolean; response?: any; message: string }> {
    try {
      console.log('🎯 Testing dashboard webhook with agent:', data.agent);

      const response = await axios.post(
        `${this.baseUrl}/webhook/dashboard`,
        data,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      if (response.status === 200) {
        console.log('✅ Dashboard webhook test successful:', response.data);
        return {
          success: true,
          response: response.data,
          message: 'Dashboard webhook working perfectly!'
        };
      }

      return {
        success: false,
        message: `Unexpected response code: ${response.status}`
      };
    } catch (error) {
      console.error('❌ Dashboard webhook test failed:', error);
      return {
        success: false,
        message: this.handleError(error)
      };
    }
  }

  /**
   * Test n8n connection
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🔍 Testing n8n connection...');
      
      const response = await axios.get(
        `${this.baseUrl}/healthz`,
        {
          timeout: 5000
        }
      );

      if (response.status === 200) {
        console.log('✅ n8n connection successful');
        return {
          success: true,
          message: 'Successfully connected to n8n'
        };
      }

      return {
        success: false,
        message: `Unexpected response: ${response.status}`
      };
    } catch (error) {
      console.error('❌ n8n connection test failed:', error);
      return {
        success: false,
        message: this.handleError(error)
      };
    }
  }
}

// Export singleton instance
export const n8nService = new N8nService();
export default n8nService;

// Development helper
if (import.meta.env.DEV) {
  console.log('🔗 n8n Service loaded in development mode');
  console.log('📋 Available methods:', [
    'triggerLeadQualification',
    'triggerWhatsAppAutomation', 
    'triggerEmailSequence',
    'triggerAgentCoordination',
    'getExecutionStatus',
    'getActiveWorkflows',
    'testDashboardWebhook',
    'testConnection'
  ]);
}