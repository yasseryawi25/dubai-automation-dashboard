import axios from 'axios';

// VAPI Voice AI Service for Dubai Real Estate Platform
// This service handles AI voice calling with Arabic/English support

interface VoiceCall {
  id: string;
  phoneNumber: string;
  status: 'queued' | 'ringing' | 'in-progress' | 'completed' | 'failed' | 'no-answer' | 'busy';
  duration?: number;
  recording?: string;
  transcript?: string;
  startedAt: string;
  endedAt?: string;
  cost?: number;
  summary?: string;
}

interface CallResult {
  success: boolean;
  outcome?: 'interested' | 'not_interested' | 'callback_requested' | 'no_answer' | 'wrong_number';
  notes?: string;
  nextAction?: string;
  followUpDate?: string;
}

class VAPIService {
  private apiUrl: string;
  private apiKey: string;
  private assistantIdEn: string;
  private assistantIdAr: string;

  constructor() {
    this.apiUrl = 'https://api.vapi.ai';
    this.apiKey = import.meta.env.VITE_VAPI_API_KEY || '';
    this.assistantIdEn = import.meta.env.VITE_VAPI_ASSISTANT_ID_EN || '';
    this.assistantIdAr = import.meta.env.VITE_VAPI_ASSISTANT_ID_AR || '';

    console.log('🎤 VAPI Service initialized:', {
      hasApiKey: !!this.apiKey,
      hasEnAssistant: !!this.assistantIdEn,
      hasArAssistant: !!this.assistantIdAr
    });
  }

  // ===========================================
  // VOICE CALL MANAGEMENT
  // ===========================================

  /**
   * Initiate a voice call through VAPI
   */
  async initiateCall(
    phoneNumber: string,
    clientData: {
      name: string;
      language: 'en' | 'ar';
      purpose: string;
      context?: any;
      clientId: string;
    }
  ): Promise<{ success: boolean; callId?: string; error?: string }> {
    try {
      console.log('📞 Initiating VAPI call to:', phoneNumber, 'Language:', clientData.language);

      // Clean phone number
      const cleanPhone = this.formatPhoneNumber(phoneNumber);

      // Select appropriate assistant based on language
      const assistantId = clientData.language === 'ar' 
        ? this.assistantIdAr 
        : this.assistantIdEn;

      const payload = {
        assistant: {
          id: assistantId,
          // Override assistant settings for this call
          model: {
            provider: 'openai',
            model: 'gpt-4',
            temperature: 0.7,
            maxTokens: 500
          },
          voice: {
            provider: 'elevenlabs',
            voiceId: clientData.language === 'ar' 
              ? 'pNInz6obpgDQGcFmaJgB'  // Arabic voice
              : 'EXAVITQu4vr4xnSDxMaL',  // English voice
            speed: 1.0,
            pitch: 1.0
          },
          firstMessage: clientData.language === 'ar'
            ? `مرحباً ${clientData.name}، أنا سارة من فريق العقارات الذكي. ${clientData.purpose}`
            : `Hello ${clientData.name}, this is Sarah from your AI Real Estate Team. ${clientData.purpose}`,
          systemPrompt: this.generateSystemPrompt(clientData)
        },
        phoneNumber: cleanPhone,
        customerData: {
          name: clientData.name,
          language: clientData.language,
          purpose: clientData.purpose,
          context: clientData.context,
          clientId: clientData.clientId
        }
      };

      const response = await axios.post(
        `${this.apiUrl}/call`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      console.log('✅ VAPI call initiated successfully:', response.data);

      return {
        success: true,
        callId: response.data.id,
        error: null
      };
    } catch (error) {
      console.error('❌ VAPI call initiation failed:', error);
      return {
        success: false,
        error: this.handleError(error)
      };
    }
  }

  /**
   * Get call status and details
   */
  async getCallStatus(callId: string): Promise<VoiceCall | null> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/call/${callId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          },
          timeout: 10000
        }
      );

      const callData = response.data;

      return {
        id: callData.id,
        phoneNumber: callData.phoneNumber,
        status: callData.status,
        duration: callData.duration,
        recording: callData.recordingUrl,
        transcript: callData.transcript,
        startedAt: callData.createdAt,
        endedAt: callData.endedAt,
        cost: callData.cost,
        summary: callData.summary
      };
    } catch (error) {
      console.error('❌ Failed to get call status:', error);
      return null;
    }
  }

  /**
   * Get call transcript and analysis
   */
  async getCallAnalysis(callId: string): Promise<CallResult | null> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/call/${callId}/analysis`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          },
          timeout: 10000
        }
      );

      return {
        success: response.data.callSuccessful || false,
        outcome: response.data.outcome,
        notes: response.data.summary,
        nextAction: response.data.recommendedAction,
        followUpDate: response.data.followUpDate
      };
    } catch (error) {
      console.error('❌ Failed to get call analysis:', error);
      return null;
    }
  }

  // ===========================================
  // ASSISTANT MANAGEMENT
  // ===========================================

  /**
   * Create a custom assistant for specific use cases
   */
  async createAssistant(
    name: string,
    language: 'en' | 'ar',
    purpose: string,
    personality: string
  ): Promise<{ success: boolean; assistantId?: string; error?: string }> {
    try {
      const payload = {
        name: name,
        model: {
          provider: 'openai',
          model: 'gpt-4',
          temperature: 0.7,
          maxTokens: 500
        },
        voice: {
          provider: 'elevenlabs',
          voiceId: language === 'ar' 
            ? 'pNInz6obpgDQGcFmaJgB'  // Arabic voice
            : 'EXAVITQu4vr4xnSDxMaL',  // English voice
          speed: 1.0,
          pitch: 1.0
        },
        firstMessage: language === 'ar'
          ? 'مرحباً، أنا مساعدك الذكي للعقارات في دبي.'
          : 'Hello, I\'m your AI Real Estate Assistant for Dubai.',
        systemPrompt: this.generateSystemPrompt({
          language,
          purpose,
          context: { personality }
        })
      };

      const response = await axios.post(
        `${this.apiUrl}/assistant`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000
        }
      );

      return {
        success: true,
        assistantId: response.data.id,
        error: null
      };
    } catch (error) {
      console.error('❌ Failed to create assistant:', error);
      return {
        success: false,
        error: this.handleError(error)
      };
    }
  }

  // ===========================================
  // CALL HISTORY & ANALYTICS
  // ===========================================

  /**
   * Get call history for a client
   */
  async getCallHistory(
    clientId: string,
    limit: number = 50
  ): Promise<VoiceCall[]> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/calls`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          },
          params: {
            clientId: clientId,
            limit: limit,
            sortBy: 'createdAt',
            sortOrder: 'desc'
          },
          timeout: 10000
        }
      );

      return response.data.calls || [];
    } catch (error) {
      console.error('❌ Failed to get call history:', error);
      return [];
    }
  }

  /**
   * Get call analytics
   */
  async getCallAnalytics(
    clientId: string,
    startDate: string,
    endDate: string
  ): Promise<any> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/analytics/calls`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          },
          params: {
            clientId: clientId,
            startDate: startDate,
            endDate: endDate
          },
          timeout: 10000
        }
      );

      return response.data;
    } catch (error) {
      console.error('❌ Failed to get call analytics:', error);
      return null;
    }
  }

  // ===========================================
  // WEBHOOK HANDLING
  // ===========================================

  /**
   * Process VAPI webhook events
   */
  processWebhookEvent(event: any): void {
    console.log('📡 Processing VAPI webhook event:', event.type);

    switch (event.type) {
      case 'call-started':
        console.log('📞 Call started:', event.data.callId);
        this.handleCallStarted(event.data);
        break;
      
      case 'call-ended':
        console.log('📞 Call ended:', event.data.callId, 'Duration:', event.data.duration);
        this.handleCallEnded(event.data);
        break;
      
      case 'transcript':
        console.log('💬 Call transcript:', event.data.callId);
        this.handleTranscriptUpdate(event.data);
        break;
      
      case 'call-analysis':
        console.log('📊 Call analysis ready:', event.data.callId);
        this.handleCallAnalysis(event.data);
        break;
      
      default:
        console.log('❓ Unknown webhook event type:', event.type);
    }
  }

  // ===========================================
  // HELPER METHODS
  // ===========================================

  /**
   * Generate system prompt based on context
   */
  private generateSystemPrompt(clientData: any): string {
    const basePrompt = clientData.language === 'ar' 
      ? this.getArabicSystemPrompt()
      : this.getEnglishSystemPrompt();

    // Add specific context based on purpose
    let contextPrompt = '';
    if (clientData.purpose?.includes('qualification')) {
      contextPrompt = clientData.language === 'ar'
        ? '\n\nهدفك هو تأهيل العميل المحتمل وفهم احتياجاته العقارية.'
        : '\n\nYour goal is to qualify the lead and understand their real estate needs.';
    } else if (clientData.purpose?.includes('follow-up')) {
      contextPrompt = clientData.language === 'ar'
        ? '\n\nهذه مكالمة متابعة لعميل سابق. كن ودوداً ومفيداً.'
        : '\n\nThis is a follow-up call with a previous client. Be friendly and helpful.';
    }

    return basePrompt + contextPrompt;
  }

  /**
   * English system prompt
   */
  private getEnglishSystemPrompt(): string {
    return `You are Sarah Al-Mansouri, a senior AI real estate consultant for Dubai properties. You are professional, knowledgeable, and helpful.

Key guidelines:
- Keep conversations concise and focused (2-3 minutes max)
- Ask relevant questions about property needs
- Provide helpful Dubai market insights
- Be respectful of the client's time
- Suggest next steps (viewing, consultation, etc.)
- Handle objections professionally
- If the client is not interested, thank them politely and end the call

Dubai market knowledge:
- Popular areas: Downtown, Marina, JBR, Palm Jumeirah, Business Bay
- Investment opportunities available
- Golden Visa eligibility with AED 2M+ investment
- Current market trends and pricing

Always end calls with a clear next step or polite closure.`;
  }

  /**
   * Arabic system prompt
   */
  private getArabicSystemPrompt(): string {
    return `أنت سارة المنصوري، مستشارة عقارية كبيرة متخصصة في عقارات دبي. أنت محترفة وذات معرفة واسعة ومفيدة.

التوجيهات الأساسية:
- حافظي على المحادثات مختصرة ومركزة (2-3 دقائق كحد أقصى)
- اطرحي أسئلة ذات صلة حول احتياجات العقار
- قدمي رؤى مفيدة حول السوق العقاري في دبي
- احترمي وقت العميل
- اقترحي الخطوات التالية (معاينة، استشارة، إلخ)
- تعاملي مع الاعتراضات بمهنية
- إذا لم يكن العميل مهتماً، اشكريه بأدب وأنهي المكالمة

معرفة السوق العقاري في دبي:
- المناطق الشائعة: وسط المدينة، المارينا، جي بي آر، نخلة جميرا، الخليج التجاري
- فرص استثمارية متاحة
- أهلية الإقامة الذهبية بشراء عقار بقيمة 2 مليون درهم أو أكثر
- اتجاهات السوق الحالية والأسعار

أنهي المكالمات دائماً بخطوة واضحة أو إغلاق مهذب.`;
  }

  /**
   * Format phone number for VAPI
   */
  private formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/[^\d]/g, '');
    
    // Add + prefix and ensure UAE format
    if (cleaned.startsWith('971')) {
      return '+' + cleaned;
    } else if (cleaned.startsWith('5') && cleaned.length === 9) {
      return '+971' + cleaned;
    }
    
    return '+' + cleaned;
  }

  /**
   * Handle webhook events
   */
  private handleCallStarted(data: any): void {
    // Update database with call start
    // Notify dashboard in real-time
  }

  private handleCallEnded(data: any): void {
    // Update database with call results
    // Generate follow-up actions
  }

  private handleTranscriptUpdate(data: any): void {
    // Store transcript for analysis
    // Update real-time dashboard
  }

  private handleCallAnalysis(data: any): void {
    // Process AI analysis
    // Create follow-up tasks
    // Update lead status
  }

  /**
   * Handle errors consistently
   */
  private handleError(error: any): string {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return 'Invalid VAPI API key. Please check your configuration.';
      }
      if (error.response?.status === 402) {
        return 'Insufficient VAPI credits. Please add credits to your account.';
      }
      if (error.response?.status === 429) {
        return 'VAPI rate limit exceeded. Please try again later.';
      }
      return `VAPI API error: ${error.response?.data?.message || error.message}`;
    }
    
    return error.message || 'Unknown VAPI error occurred';
  }

  /**
   * Test VAPI connection
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🔍 Testing VAPI connection...');
      
      const response = await axios.get(
        `${this.apiUrl}/assistant/${this.assistantIdEn}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          },
          timeout: 5000
        }
      );

      if (response.data) {
        console.log('✅ VAPI connection successful');
        return {
          success: true,
          message: 'Successfully connected to VAPI'
        };
      }

      return {
        success: false,
        message: 'Failed to retrieve assistant information'
      };
    } catch (error) {
      console.error('❌ VAPI connection test failed:', error);
      return {
        success: false,
        message: this.handleError(error)
      };
    }
  }
}

// Export singleton instance
export const vapiService = new VAPIService();
export default vapiService;

// Development helper
if (import.meta.env.DEV) {
  console.log('🎤 VAPI Service loaded in development mode');
  console.log('📋 Available methods:', [
    'initiateCall',
    'getCallStatus',
    'getCallAnalysis',
    'createAssistant',
    'getCallHistory',
    'getCallAnalytics',
    'testConnection'
  ]);
}