export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: 'whatsapp' | 'website' | 'bayut' | 'property_finder' | 'referral';
  score: number; // 0-100
  status: 'new' | 'contacted' | 'qualified' | 'interested' | 'viewing_scheduled' | 'negotiating' | 'closed_won' | 'closed_lost';
  lastActivity: string;
  propertyInterest: string;
  budget: number;
  location: string;
  timeline: string;
  assignedAgent: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  leadId: string;
  type: 'whatsapp' | 'email' | 'call' | 'note';
  sender: 'lead' | 'agent' | 'ai';
  agentName?: string;
  content: string;
  timestamp: string;
  metadata?: any;
}

export interface PipelineStage {
  id: string;
  name: string;
  color: string;
  leads: Lead[];
  conversionRate: number;
  averageTimeInStage: number;
  totalValue: number;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  conditions: string[];
  actions: string[];
  isActive: boolean;
  agentAssigned: string;
}

export interface ResponseTemplate {
  id: string;
  name: string;
  type: 'whatsapp' | 'email' | 'sms';
  language: 'en' | 'ar' | 'both';
  subject?: string;
  content: string;
  variables: string[];
  category: string;
} 