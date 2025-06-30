// VAPI Service for AI Voice Agent Integration
// Handles voice calls via VAPI.ai for Manager Agent (Sarah)

interface VAPIConfig {
  apiKey: string;
  baseURL: string;
  defaultVoice: {
    provider: 'azure' | 'elevenlabs' | 'openai';
    voiceId: string;
  };
  arabicVoice: {
    provider: 'azure' | 'elevenlabs' | 'openai';  
    voiceId: string;
  };
}

interface CallRequest {
  phoneNumber: string;
  assistantId?: string;
  language?: 'en' | 'ar' | 'bilingual';
  customerInfo?: {
    name?: string;
    context?: string;
    previousInteraction?: boolean;
  };
}

interface CallResponse {
  id: string;
  status: 'queued' | 'ringing' | 'in-progress' | 'completed' | 'failed';
  phoneNumber: string;
  startedAt?: string;
  endedAt?: string;
  duration?: number;
  cost?: number;
  recordingUrl?: string;
  transcription?: string;
  summary?: string;
  metadata?: Record<string, any>;
}

interface Assistant {
  id: string;
  name: string;
  voice: {
    provider: string;
    voiceId: string;
  };
  model: {
    provider: 'openai';
    model: 'gpt-4' | 'gpt-3.5-turbo';
    systemMessage: string;
  };
  firstMessage?: string;
  endCallMessage?: string;
  endCallPhrases?: string[];
}

class VAPIService {
  private config: VAPIConfig;
  private assistants: Map<string, Assistant> = new Map();

  constructor(config: VAPIConfig) {
    this.config = config;
    this.initializeAssistants();
  }

  private initializeAssistants() {
    // Sarah - Manager Agent (English)
    this.assistants.set('sarah-en', {
      id: 'sarah-en',
      name: 'Sarah - English Assistant',
      voice: this.config.defaultVoice,
      model: {
        provider: 'openai',
        model: 'gpt-4',
        systemMessage: `You are Sarah, a professional AI assistant specializing in Dubai real estate. 

ROLE: You work for a Dubai real estate professional and help with client consultations.

PERSONALITY:
- Professional but warm and approachable
- Knowledgeable about Dubai real estate market
- Helpful and solution-oriented
- Confident but not pushy

CAPABILITIES:
- Provide market insights and property recommendations
- Schedule viewings and appointments
- Answer questions about Dubai real estate process
- Assist with investment analysis
- Help with area recommendations

GUIDELINES:
- Keep responses concise but informative
- Always ask qualifying questions to understand client needs
- Offer to schedule in-person meetings when appropriate
- Mention specific Dubai areas and developments when relevant
- Be helpful with visa and residency questions related to property purchase

EXAMPLE AREAS TO MENTION: Downtown Dubai, Dubai Marina, Palm Jumeirah, DIFC, Business Bay, Dubai Hills, Arabian Ranches

Remember: You represent a professional real estate service, so maintain high standards.`
      },
      firstMessage: "Hello! This is Sarah, your AI assistant for Dubai real estate. I'm here to help you with property inquiries, market insights, and scheduling. How can I assist you today?",
      endCallMessage: "Thank you for speaking with me today. I'll make sure all the information is passed along, and someone will follow up with you shortly. Have a great day!",
      endCallPhrases: ["goodbye", "bye", "thank you", "that's all", "end call"]
    });

    // Sarah - Manager Agent (Arabic)
    this.assistants.set('sarah-ar', {
      id: 'sarah-ar',
      name: 'Sarah - Arabic Assistant',
      voice: this.config.arabicVoice,
      model: {
        provider: 'openai',
        model: 'gpt-4',
        systemMessage: `أنت سارة، مساعدة ذكية متخصصة في العقارات في دبي.

الدور: تعملين لدى متخصص عقارات في دبي وتساعدين في استشارات العملاء.

الشخصية:
- مهنية ولكن ودودة ومتاحة
- خبيرة في سوق العقارات في دبي  
- مفيدة وموجهة نحو الحلول
- واثقة ولكن غير متطفلة

القدرات:
- تقديم رؤى السوق وتوصيات العقارات
- جدولة المعاينات والمواعيد
- الإجابة على أسئلة حول عملية العقارات في دبي
- المساعدة في تحليل الاستثمار
- المساعدة في توصيات المناطق

التوجيهات:
- اجعلي الردود موجزة ولكن مفيدة
- اسألي دائماً أسئلة مؤهلة لفهم احتياجات العميل
- اعرضي جدولة اجتماعات شخصية عند الاقتضاء
- اذكري مناطق وتطوير دبي المحددة عند الحاجة
- كوني مفيدة مع أسئلة التأشيرة والإقامة المتعلقة بشراء العقارات

مناطق للذكر: وسط مدينة دبي، مارينا دبي، نخلة جميرا، مركز دبي المالي العالمي، الخليج التجاري، تلال دبي، المرابع العربية

تذكري: أنت تمثلين خدمة عقارية مهنية، لذا حافظي على معايير عالية.`
      },
      firstMessage: "السلام عليكم! أنا سارة، مساعدتكم الذكية للعقارات في دبي. أنا هنا لمساعدتكم في استفسارات العقارات ورؤى السوق والجدولة. كيف يمكنني مساعدتكم اليوم؟",
      endCallMessage: "شكراً لكم للتحدث معي اليوم. سأتأكد من تمرير جميع المعلومات، وسيتابع معكم أحد زملائي قريباً. أتمنى لكم يوماً سعيداً!",
      endCallPhrases: ["مع السلامة", "شكراً", "هذا كل شيء", "انهاء المكالمة", "وداعاً"]
    });
  }

  async createCall(request: CallRequest): Promise<CallResponse> {
    try {
      // Determine which assistant to use based on language preference
      const assistantId = this.getAssistantId(request.language);
      const assistant = this.assistants.get(assistantId);
      
      if (!assistant) {
        throw new Error(`Assistant not found for language: ${request.language}`);
      }

      const callPayload = {
        phoneNumber: request.phoneNumber,
        assistant: {
          model: assistant.model,
          voice: assistant.voice,
          firstMessage: assistant.firstMessage,
          endCallMessage: assistant.endCallMessage,
          endCallPhrases: assistant.endCallPhrases
        },
        customer: {
          name: request.customerInfo?.name || 'Dubai Real Estate Client',
          number: request.phoneNumber
        },
        metadata: {
          clientContext: request.customerInfo?.context || '',
          language: request.language || 'en',
          agentType: 'manager',
          timestamp: new Date().toISOString()
        }
      };

      const response = await fetch(`${this.config.baseURL}/call`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(callPayload)
      });

      if (!response.ok) {
        throw new Error(`VAPI API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        id: data.id,
        status: data.status || 'queued',
        phoneNumber: request.phoneNumber,
        startedAt: data.startedAt,
        metadata: {
          assistantId,
          language: request.language,
          vapiCallId: data.id
        }
      };

    } catch (error) {
      console.error('VAPI Call Creation Error:', error);
      throw error;
    }
  }

  async getCallStatus(callId: string): Promise<CallResponse> {
    try {
      const response = await fetch(`${this.config.baseURL}/call/${callId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        }
      });

      if (!response.ok) {
        throw new Error(`VAPI API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        id: data.id,
        status: data.status,
        phoneNumber: data.customer?.number || '',
        startedAt: data.startedAt,
        endedAt: data.endedAt,
        duration: data.duration,
        cost: data.cost,
        recordingUrl: data.recordingUrl,
        transcription: data.transcript,
        summary: data.summary,
        metadata: data.metadata
      };

    } catch (error) {
      console.error('VAPI Get Call Status Error:', error);
      throw error;
    }
  }

  async getAllCalls(limit: number = 50): Promise<CallResponse[]> {
    try {
      const response = await fetch(`${this.config.baseURL}/call?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        }
      });

      if (!response.ok) {
        throw new Error(`VAPI API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return data.map((call: any) => ({
        id: call.id,
        status: call.status,
        phoneNumber: call.customer?.number || '',
        startedAt: call.startedAt,
        endedAt: call.endedAt,
        duration: call.duration,
        cost: call.cost,
        recordingUrl: call.recordingUrl,
        transcription: call.transcript,
        summary: call.summary,
        metadata: call.metadata
      }));

    } catch (error) {
      console.error('VAPI Get All Calls Error:', error);
      throw error;
    }
  }

  private getAssistantId(language?: string): string {
    switch (language) {
      case 'ar':
        return 'sarah-ar';
      case 'bilingual':
        // For bilingual, default to English but mention Arabic capability
        return 'sarah-en';
      case 'en':
      default:
        return 'sarah-en';
    }
  }

  // Utility method to validate phone number format
  static validatePhoneNumber(phoneNumber: string): boolean {
    // UAE phone number validation
    const uaePhoneRegex = /^(\+971|971|0)?[1-9]\d{8}$/;
    // International format validation
    const intlPhoneRegex = /^\+[1-9]\d{1,14}$/;
    
    return uaePhoneRegex.test(phoneNumber) || intlPhoneRegex.test(phoneNumber);
  }

  // Format phone number for UAE/international use
  static formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters except +
    let cleaned = phoneNumber.replace(/[^\d+]/g, '');
    
    // Handle UAE numbers
    if (cleaned.startsWith('00971')) {
      cleaned = '+971' + cleaned.substring(5);
    } else if (cleaned.startsWith('971')) {
      cleaned = '+971' + cleaned.substring(3);
    } else if (cleaned.startsWith('0') && cleaned.length === 10) {
      cleaned = '+971' + cleaned.substring(1);
    } else if (!cleaned.startsWith('+')) {
      // Assume UAE number if no country code
      cleaned = '+971' + cleaned;
    }
    
    return cleaned;
  }
}

// Create and export VAPI service instance
const vapiConfig: VAPIConfig = {
  apiKey: import.meta.env.VITE_VAPI_API_KEY || '',
  baseURL: 'https://api.vapi.ai/v1',
  defaultVoice: {
    provider: 'azure',
    voiceId: 'en-US-SaraNeural' // Professional female voice
  },
  arabicVoice: {
    provider: 'azure', 
    voiceId: 'ar-SA-ZariyahNeural' // Arabic female voice
  }
};

export const vapiService = new VAPIService(vapiConfig);
export { VAPIService }; // Export the class for static methods
export default vapiService;

// Re-export types for use in components
export type { CallRequest, CallResponse, Assistant, VAPIConfig };
