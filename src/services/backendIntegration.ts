// Backend Integration Service
// This orchestrates n8n, WhatsApp, and VAPI services with the dashboard

import { n8nService } from './n8nService';
import { whatsappService } from './whatsappService';
import { vapiService } from './vapiService';
import { supabase } from '../lib/supabase';

interface IntegrationStatus {
  n8n: { connected: boolean; message: string };
  whatsapp: { connected: boolean; message: string };
  vapi: { connected: boolean; message: string };
  database: { connected: boolean; message: string };
}

interface LeadProcessingResult {
  success: boolean;
  leadId: string;
  qualificationScore?: number;
  nextActions: string[];
  automationTriggered: boolean;
  error?: string;
}

class BackendIntegrationService {
  private clientId: string;

  constructor(clientId: string = 'demo-client') {
    this.clientId = clientId;
    console.log('🔗 Backend Integration Service initialized for client:', clientId);
  }

  // ===========================================
  // SYSTEM STATUS & HEALTH CHECKS
  // ===========================================

  /**
   * Check status of all backend integrations
   */
  async checkSystemHealth(): Promise<IntegrationStatus> {
    console.log('🏥 Checking system health...');

    const [n8nStatus, whatsappStatus, vapiStatus, dbStatus] = await Promise.all([
      n8nService.testConnection(),
      whatsappService.testConnection(),
      vapiService.testConnection(),
      this.testDatabaseConnection()
    ]);

    const status: IntegrationStatus = {
      n8n: n8nStatus,
      whatsapp: whatsappStatus,
      vapi: vapiStatus,
      database: dbStatus
    };

    console.log('📊 System health check complete:', status);
    return status;
  }

  /**
   * Test database connection
   */
  private async testDatabaseConnection(): Promise<{ connected: boolean; message: string }> {
    try {
      const { data, error } = await supabase
        .from('client_profiles')
        .select('count')
        .limit(1);

      if (error) throw error;

      return {
        connected: true,
        message: 'Database connection successful'
      };
    } catch (error) {
      return {
        connected: false,
        message: `Database connection failed: ${error.message}`
      };
    }
  }

  // ===========================================
  // LEAD PROCESSING WORKFLOWS
  // ===========================================

  /**
   * Process new lead through complete automation pipeline
   */
  async processNewLead(leadData: {
    name: string;
    phone: string;
    email?: string;
    message: string;
    source: string;
    propertyInterest?: string;
    budget?: string;
  }): Promise<LeadProcessingResult> {
    try {
      console.log('🎯 Processing new lead:', leadData.name);

      // Step 1: Create lead in database
      const { data: lead, error: dbError } = await supabase
        .from('leads')
        .insert({
          client_id: this.clientId,
          name: leadData.name,
          phone: leadData.phone,
          email: leadData.email,
          status: 'new',
          source: leadData.source,
          notes: leadData.message,
          lead_score: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (dbError) throw dbError;

      const leadId = lead.id;

      // Step 2: Trigger n8n qualification workflow
      const qualificationResult = await n8nService.triggerLeadQualification({
        id: leadId,
        name: leadData.name,
        phone: leadData.phone,
        email: leadData.email,
        message: leadData.message,
        source: leadData.source,
        clientId: this.clientId
      });

      // Step 3: Send immediate WhatsApp response
      const whatsappResult = await whatsappService.sendTextMessage(
        leadData.phone,
        this.generateWelcomeMessage(leadData.name),
        this.clientId
      );

      // Step 4: Determine qualification score and next actions
      const qualificationScore = this.calculateQualificationScore(leadData);
      const nextActions = this.determineNextActions(qualificationScore, leadData);

      // Step 5: Update lead with initial assessment
      await supabase
        .from('leads')
        .update({
          lead_score: qualificationScore,
          status: qualificationScore >= 70 ? 'qualified' : 'contacted',
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId);

      // Step 6: Trigger appropriate follow-up workflows
      await this.triggerFollowUpWorkflows(leadId, leadData, qualificationScore);

      console.log('✅ Lead processing completed successfully');

      return {
        success: true,
        leadId: leadId,
        qualificationScore: qualificationScore,
        nextActions: nextActions,
        automationTriggered: qualificationResult.success && whatsappResult.success,
        error: null
      };
    } catch (error) {
      console.error('❌ Lead processing failed:', error);
      return {
        success: false,
        leadId: '',
        nextActions: ['Manual follow-up required'],
        automationTriggered: false,
        error: error.message
      };
    }
  }

  /**
   * Trigger follow-up workflows based on lead quality
   */
  private async triggerFollowUpWorkflows(
    leadId: string,
    leadData: any,
    qualificationScore: number
  ): Promise<void> {
    try {
      // High-quality leads get immediate voice call
      if (qualificationScore >= 80) {
        console.log('🎤 Triggering voice call for high-quality lead');
        
        const callResult = await vapiService.initiateCall(
          leadData.phone,
          {
            name: leadData.name,
            language: this.detectLanguage(leadData.message),
            purpose: 'Thank you for your interest in Dubai real estate. I\'d like to understand your needs better.',
            context: leadData,
            clientId: this.clientId
          }
        );

        if (callResult.success) {
          // Log the call initiation
          await supabase
            .from('lead_followups')
            .insert({
              client_id: this.clientId,
              lead_id: leadId,
              type: 'call',
              status: 'scheduled',
              scheduled_at: new Date().toISOString(),
              notes: `AI voice call initiated - Call ID: ${callResult.callId}`,
              agent_assigned: 'sarah-manager'
            });
        }
      }

      // Medium-quality leads get email sequence
      else if (qualificationScore >= 50 && leadData.email) {
        console.log('📧 Triggering email sequence for medium-quality lead');
        
        const emailResult = await n8nService.triggerEmailSequence({
          email: leadData.email,
          firstName: leadData.name.split(' ')[0],
          lastName: leadData.name.split(' ').slice(1).join(' '),
          sequenceType: this.determineEmailSequenceType(leadData),
          leadId: leadId,
          clientId: this.clientId
        });

        if (emailResult.success) {
          await supabase
            .from('lead_followups')
            .insert({
              client_id: this.clientId,
              lead_id: leadId,
              type: 'email',
              status: 'scheduled',
              scheduled_at: new Date().toISOString(),
              notes: `Email sequence initiated - Sequence ID: ${emailResult.sequenceId}`,
              agent_assigned: 'layla-followup'
            });
        }
      }

      // All leads get WhatsApp follow-up sequence
      console.log('💬 Triggering WhatsApp automation sequence');
      
      await n8nService.triggerWhatsAppAutomation({
        phoneNumber: leadData.phone,
        message: 'Follow-up sequence initiated',
        template: this.selectWhatsAppTemplate(qualificationScore),
        leadId: leadId,
        clientId: this.clientId
      });

    } catch (error) {
      console.warn('⚠️ Follow-up workflow trigger warning:', error);
    }
  }

  // ===========================================
  // AI AGENT COORDINATION
  // ===========================================

  /**
   * Coordinate multiple AI agents for complex tasks
   */
  async coordinateAgents(task: {
    type: 'lead_conversion' | 'client_onboarding' | 'property_search' | 'market_analysis';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    context: any;
    assignedAgents: string[];
  }): Promise<{ success: boolean; coordinationId?: string; error?: string }> {
    try {
      console.log('🎭 Coordinating AI agents for task:', task.type);

      // Trigger agent coordination workflow in n8n
      const coordinationResult = await n8nService.triggerAgentCoordination({
        task: task.type,
        priority: task.priority,
        agents: task.assignedAgents,
        context: task.context,
        clientId: this.clientId
      });

      if (coordinationResult.success) {
        // Log the coordination in database
        await supabase
          .from('agent_tasks')
          .insert({
            client_id: this.clientId,
            agent_id: 'alex-coordinator',
            task_type: 'coordination',
            task_description: `Agent coordination for ${task.type}`,
            status: 'in_progress',
            priority: task.priority,
            input_data: task.context,
            created_at: new Date().toISOString()
          });

        return {
          success: true,
          coordinationId: coordinationResult.coordinationId,
          error: null
        };
      }

      return coordinationResult;
    } catch (error) {
      console.error('❌ Agent coordination failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===========================================
  // REAL-TIME EVENT PROCESSING
  // ===========================================

  /**
   * Process incoming webhooks from external services
   */
  async processWebhookEvent(source: 'whatsapp' | 'vapi' | 'n8n', eventData: any): Promise<void> {
    try {
      console.log('📡 Processing webhook event from:', source);

      switch (source) {
        case 'whatsapp':
          await this.processWhatsAppWebhook(eventData);
          break;
        case 'vapi':
          await this.processVAPIWebhook(eventData);
          break;
        case 'n8n':
          await this.processN8nWebhook(eventData);
          break;
        default:
          console.warn('❓ Unknown webhook source:', source);
      }
    } catch (error) {
      console.error('❌ Webhook processing error:', error);
    }
  }

  private async processWhatsAppWebhook(data: any): Promise<void> {
    const messages = await whatsappService.processWebhookData(data);
    
    for (const message of messages) {
      // Find or create lead
      let { data: existingLead } = await supabase
        .from('leads')
        .select('*')
        .eq('phone', message.phoneNumber)
        .eq('client_id', this.clientId)
        .single();

      if (!existingLead) {
        // Create new lead from WhatsApp message
        await this.processNewLead({
          name: `WhatsApp Lead ${message.phoneNumber}`,
          phone: message.phoneNumber,
          message: message.content,
          source: 'whatsapp'
        });
      } else {
        // Update existing lead with new message
        await supabase
          .from('conversation_history')
          .insert({
            client_id: this.clientId,
            lead_id: existingLead.id,
            platform: 'whatsapp',
            message_content: message.content,
            direction: 'inbound',
            participant_type: 'lead',
            created_at: new Date().toISOString()
          });
      }
    }
  }

  private async processVAPIWebhook(data: any): Promise<void> {
    vapiService.processWebhookEvent(data);
    
    // Update call records in database
    if (data.type === 'call-ended') {
      const callAnalysis = await vapiService.getCallAnalysis(data.callId);
      
      if (callAnalysis) {
        // Update lead status based on call outcome
        await supabase
          .from('leads')
          .update({
            status: this.mapCallOutcomeToLeadStatus(callAnalysis.outcome),
            notes: callAnalysis.notes,
            updated_at: new Date().toISOString()
          })
          .eq('phone', data.phoneNumber)
          .eq('client_id', this.clientId);
      }
    }
  }

  private async processN8nWebhook(data: any): Promise<void> {
    // Update workflow execution status
    if (data.executionId) {
      const status = await n8nService.getExecutionStatus(data.executionId);
      
      // Update related tasks or leads based on workflow results
      if (status && status.status === 'success') {
        console.log('✅ n8n workflow completed successfully:', data.workflowName);
      }
    }
  }

  // ===========================================
  // HELPER METHODS
  // ===========================================

  private calculateQualificationScore(leadData: any): number {
    let score = 0;

    // Contact information quality
    if (leadData.phone) score += 20;
    if (leadData.email) score += 15;

    // Message quality and intent
    if (leadData.message && leadData.message.length > 20) score += 15;
    if (leadData.message && leadData.message.length > 100) score += 10;

    // Source quality
    const sourceScores = {
      'website': 25,
      'referral': 30,
      'whatsapp': 20,
      'facebook': 15,
      'google': 20
    };
    score += sourceScores[leadData.source] || 10;

    // Property interest specificity
    if (leadData.propertyInterest) score += 15;
    if (leadData.budget) score += 10;

    // Urgency indicators
    const urgentKeywords = ['urgent', 'immediately', 'asap', 'ready to buy', 'serious'];
    if (urgentKeywords.some(keyword => 
      leadData.message?.toLowerCase().includes(keyword)
    )) {
      score += 20;
    }

    return Math.min(100, score);
  }

  private determineNextActions(score: number, leadData: any): string[] {
    const actions = [];

    if (score >= 80) {
      actions.push('Immediate voice call');
      actions.push('Schedule property viewing');
      actions.push('Send premium property listings');
    } else if (score >= 60) {
      actions.push('WhatsApp follow-up within 2 hours');
      actions.push('Email sequence initiation');
      actions.push('Send relevant property listings');
    } else if (score >= 40) {
      actions.push('Email nurture sequence');
      actions.push('WhatsApp follow-up in 24 hours');
      actions.push('Retargeting campaign');
    } else {
      actions.push('General nurture sequence');
      actions.push('Social media retargeting');
    }

    return actions;
  }

  private generateWelcomeMessage(name: string): string {
    return `Hi ${name}! Thank you for your interest in Dubai real estate. Our AI team is processing your inquiry and will get back to you shortly with personalized property recommendations. How can we help you find your perfect property?`;
  }

  private detectLanguage(message: string): 'en' | 'ar' {
    // Simple Arabic detection
    const arabicPattern = /[\u0600-\u06FF]/;
    return arabicPattern.test(message) ? 'ar' : 'en';
  }

  private determineEmailSequenceType(leadData: any): 'first_time_buyer' | 'investor' | 'luxury' | 'renter' {
    const message = leadData.message?.toLowerCase() || '';
    
    if (message.includes('invest') || message.includes('investment')) return 'investor';
    if (message.includes('rent') || message.includes('rental')) return 'renter';
    if (message.includes('luxury') || message.includes('premium')) return 'luxury';
    return 'first_time_buyer';
  }

  private selectWhatsAppTemplate(score: number): string {
    if (score >= 80) return 'high_priority_lead';
    if (score >= 60) return 'qualified_lead';
    if (score >= 40) return 'standard_lead';
    return 'nurture_lead';
  }

  private mapCallOutcomeToLeadStatus(outcome: string): string {
    const statusMap = {
      'interested': 'qualified',
      'not_interested': 'lost',
      'callback_requested': 'follow_up',
      'no_answer': 'contacted',
      'wrong_number': 'inactive'
    };
    return statusMap[outcome] || 'contacted';
  }
}

// Export factory function for different clients
export const createBackendIntegration = (clientId: string) => {
  return new BackendIntegrationService(clientId);
};

// Export default instance for demo
export const backendIntegration = new BackendIntegrationService('demo-client');

export default BackendIntegrationService;