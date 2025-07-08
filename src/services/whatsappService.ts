import axios from 'axios';

// WhatsApp Business API Service for Dubai Real Estate Platform
// This service handles direct WhatsApp Business API integration

interface WhatsAppMessage {
  id: string;
  phoneNumber: string;
  content: string;
  type: 'text' | 'image' | 'document' | 'template';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  direction: 'inbound' | 'outbound';
}

interface WhatsAppTemplate {
  name: string;
  language: 'en' | 'ar';
  components: any[];
  status: 'approved' | 'pending' | 'rejected';
}

class WhatsAppService {
  private apiUrl: string;
  private accessToken: string;
  private phoneNumberId: string;
  private businessAccountId: string;
  private webhookVerifyToken: string;

  constructor() {
    this.apiUrl = 'https://graph.facebook.com/v18.0';
    this.accessToken = import.meta.env.VITE_WHATSAPP_API_TOKEN || '';
    this.phoneNumberId = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID || '';
    this.businessAccountId = import.meta.env.VITE_WHATSAPP_BUSINESS_ACCOUNT_ID || '';
    this.webhookVerifyToken = import.meta.env.VITE_WHATSAPP_WEBHOOK_VERIFY_TOKEN || '';

    console.log('💬 WhatsApp Service initialized:', {
      hasToken: !!this.accessToken,
      phoneNumberId: this.phoneNumberId,
      businessAccountId: this.businessAccountId
    });
  }

  // ===========================================
  // MESSAGE SENDING
  // ===========================================

  /**
   * Send a text message via WhatsApp Business API
   */
  async sendTextMessage(
    phoneNumber: string,
    message: string,
    clientId: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      console.log('📤 Sending WhatsApp message to:', phoneNumber);

      // Clean phone number (remove + and spaces)
      const cleanPhone = phoneNumber.replace(/[^\d]/g, '');

      const payload = {
        messaging_product: 'whatsapp',
        to: cleanPhone,
        type: 'text',
        text: {
          body: message
        }
      };

      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      console.log('✅ WhatsApp message sent successfully:', response.data);

      return {
        success: true,
        messageId: response.data.messages?.[0]?.id,
        error: null
      };
    } catch (error) {
      console.error('❌ WhatsApp message send failed:', error);
      return {
        success: false,
        error: this.handleError(error)
      };
    }
  }

  /**
   * Send a template message (for marketing/automated sequences)
   */
  async sendTemplateMessage(
    phoneNumber: string,
    templateName: string,
    language: 'en' | 'ar',
    parameters: string[] = [],
    clientId: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      console.log('📋 Sending WhatsApp template to:', phoneNumber, templateName);

      const cleanPhone = phoneNumber.replace(/[^\d]/g, '');

      const payload = {
        messaging_product: 'whatsapp',
        to: cleanPhone,
        type: 'template',
        template: {
          name: templateName,
          language: {
            code: language
          },
          components: parameters.length > 0 ? [
            {
              type: 'body',
              parameters: parameters.map(param => ({
                type: 'text',
                text: param
              }))
            }
          ] : []
        }
      };

      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      return {
        success: true,
        messageId: response.data.messages?.[0]?.id,
        error: null
      };
    } catch (error) {
      console.error('❌ WhatsApp template send failed:', error);
      return {
        success: false,
        error: this.handleError(error)
      };
    }
  }

  // ===========================================
  // WEBHOOK HANDLING
  // ===========================================

  /**
   * Verify webhook (for initial setup)
   */
  verifyWebhook(mode: string, token: string, challenge: string): string | null {
    if (mode === 'subscribe' && token === this.webhookVerifyToken) {
      console.log('✅ WhatsApp webhook verified successfully');
      return challenge;
    }
    console.error('❌ WhatsApp webhook verification failed');
    return null;
  }

  /**
   * Process incoming webhook data
   */
  async processWebhookData(body: any): Promise<WhatsAppMessage[]> {
    try {
      const messages: WhatsAppMessage[] = [];

      if (body.object === 'whatsapp_business_account') {
        for (const entry of body.entry || []) {
          for (const change of entry.changes || []) {
            if (change.field === 'messages') {
              const value = change.value;

              // Process incoming messages
              for (const message of value.messages || []) {
                const phoneNumber = value.contacts?.[0]?.wa_id || 'unknown';
                const profileName = value.contacts?.[0]?.profile?.name || 'Unknown';

                const whatsappMessage: WhatsAppMessage = {
                  id: message.id,
                  phoneNumber: phoneNumber,
                  content: this.extractMessageContent(message),
                  type: message.type as any,
                  status: 'read',
                  timestamp: new Date(parseInt(message.timestamp) * 1000).toISOString(),
                  direction: 'inbound'
                };

                messages.push(whatsappMessage);

                console.log('📨 Incoming WhatsApp message from:', profileName, phoneNumber);
              }

              // Process message status updates
              for (const status of value.statuses || []) {
                console.log('📊 Message status update:', status.id, status.status);
              }
            }
          }
        }
      }

      return messages;
    } catch (error) {
      console.error('❌ WhatsApp webhook processing failed:', error);
      return [];
    }
  }

  // ===========================================
  // PHONE NUMBER MANAGEMENT
  // ===========================================

  /**
   * Get phone number information
   */
  async getPhoneNumberInfo(): Promise<any> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/${this.phoneNumberId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          },
          timeout: 5000
        }
      );

      return response.data;
    } catch (error) {
      console.error('❌ Failed to get phone number info:', error);
      return null;
    }
  }

  /**
   * Get business profile
   */
  async getBusinessProfile(): Promise<any> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/${this.phoneNumberId}/whatsapp_business_profile`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          },
          timeout: 5000
        }
      );

      return response.data;
    } catch (error) {
      console.error('❌ Failed to get business profile:', error);
      return null;
    }
  }

  // ===========================================
  // MESSAGE TEMPLATES
  // ===========================================

  /**
   * Get approved message templates
   */
  async getMessageTemplates(): Promise<WhatsAppTemplate[]> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/${this.businessAccountId}/message_templates`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          },
          timeout: 10000
        }
      );

      return response.data.data || [];
    } catch (error) {
      console.error('❌ Failed to get message templates:', error);
      return [];
    }
  }

  // ===========================================
  // ANALYTICS
  // ===========================================

  /**
   * Get messaging analytics
   */
  async getAnalytics(startDate: string, endDate: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/${this.phoneNumberId}/analytics`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          },
          params: {
            start: startDate,
            end: endDate,
            granularity: 'day'
          },
          timeout: 10000
        }
      );

      return response.data;
    } catch (error) {
      console.error('❌ Failed to get analytics:', error);
      return null;
    }
  }

  // ===========================================
  // HELPER METHODS
  // ===========================================

  /**
   * Extract message content based on message type
   */
  private extractMessageContent(message: any): string {
    switch (message.type) {
      case 'text':
        return message.text?.body || '';
      case 'image':
        return `[Image: ${message.image?.caption || 'No caption'}]`;
      case 'document':
        return `[Document: ${message.document?.filename || 'Unknown file'}]`;
      case 'audio':
        return '[Audio message]';
      case 'video':
        return '[Video message]';
      case 'location':
        return `[Location: ${message.location?.name || 'Shared location'}]`;
      case 'contacts':
        return '[Contact information]';
      default:
        return '[Unsupported message type]';
    }
  }

  /**
   * Format phone number for WhatsApp
   */
  formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/[^\d]/g, '');
    
    // Add UAE country code if not present
    if (!cleaned.startsWith('971') && cleaned.startsWith('5')) {
      return '971' + cleaned;
    }
    
    return cleaned;
  }

  /**
   * Validate phone number format
   */
  isValidPhoneNumber(phoneNumber: string): boolean {
    const cleaned = phoneNumber.replace(/[^\d]/g, '');
    // UAE mobile numbers start with 971 and are 12 digits total
    return /^971[0-9]{9}$/.test(cleaned);
  }

  /**
   * Handle errors consistently
   */
  private handleError(error: any): string {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return 'Invalid WhatsApp API token. Please check your configuration.';
      }
      if (error.response?.status === 403) {
        return 'WhatsApp API access forbidden. Check your permissions.';
      }
      if (error.response?.status === 429) {
        return 'WhatsApp API rate limit exceeded. Please try again later.';
      }
      return `WhatsApp API error: ${error.response?.data?.error?.message || error.message}`;
    }
    
    return error.message || 'Unknown WhatsApp error occurred';
  }

  /**
   * Test WhatsApp API connection
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🔍 Testing WhatsApp API connection...');
      
      const phoneInfo = await this.getPhoneNumberInfo();
      
      if (phoneInfo) {
        console.log('✅ WhatsApp API connection successful');
        return {
          success: true,
          message: `Successfully connected to WhatsApp Business API (${phoneInfo.display_phone_number})`
        };
      }

      return {
        success: false,
        message: 'Failed to retrieve phone number information'
      };
    } catch (error) {
      console.error('❌ WhatsApp API connection test failed:', error);
      return {
        success: false,
        message: this.handleError(error)
      };
    }
  }
}

// Export singleton instance
export const whatsappService = new WhatsAppService();
export default whatsappService;

// Development helper
if (import.meta.env.DEV) {
  console.log('💬 WhatsApp Service loaded in development mode');
  console.log('📋 Available methods:', [
    'sendTextMessage',
    'sendTemplateMessage',
    'processWebhookData',
    'getMessageTemplates',
    'getAnalytics',
    'testConnection'
  ]);
}