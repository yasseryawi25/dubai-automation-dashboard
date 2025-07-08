// Orchestration Module Types for n8n + AI Agent Workflows (Dubai Real Estate)

// --- Node Types ---
export type NodeType =
  | 'ai_agent'
  | 'webhook'
  | 'http_request'
  | 'database_query'
  | 'email_send'
  | 'property_portal'
  | 'lead_scoring'
  | 'client_communication'
  | 'custom';

export interface WorkflowNode {
  id: string;
  name: string;
  type: NodeType;
  config: Record<string, any>; // Node-specific config (prompt, endpoint, etc)
  agentType?: AgentType; // For AI agent nodes
  position: { x: number; y: number };
  inputs?: string[]; // Node IDs
  outputs?: string[]; // Node IDs
  enabled: boolean;
  description?: string;
  language?: 'en' | 'ar' | 'ar_en';
  skills?: string[]; // For AI agent nodes
  persona?: string; // For AI agent nodes
  context?: string; // For AI agent nodes
}

export interface WorkflowConnection {
  source: string; // Node ID
  target: string; // Node ID
  dataMapping?: Record<string, string>; // Map output fields to input fields
  condition?: string; // Optional condition for flow
}

export interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  createdBy: string; // user or tenant id
  createdAt: string;
  updatedAt: string;
  description?: string;
  tags?: string[];
  isTemplate?: boolean;
  marketContext: 'dubai_real_estate';
  language: 'en' | 'ar' | 'ar_en';
  tenantId: string;
}

export type ExecutionStatus =
  | 'pending'
  | 'running'
  | 'success'
  | 'failed'
  | 'cancelled'
  | 'retrying';

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  startedAt: string;
  finishedAt?: string;
  status: ExecutionStatus;
  currentNodeId?: string;
  logs: ExecutionLog[];
  error?: ExecutionError;
  tenantId: string;
  triggeredBy: string; // user, webhook, schedule, etc
  realTimeUpdates: boolean;
}

export interface ExecutionLog {
  id: string;
  executionId: string;
  nodeId: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug' | 'agent' | 'success' | 'warning';
  message: string;
  data?: any;
}

export interface ExecutionError {
  nodeId: string;
  message: string;
  code?: string;
  retryCount?: number;
  lastTriedAt?: string;
  stack?: string;
}

// --- AI Agent Types ---
export type AgentType = 'manager' | 'coordinator' | 'specialist' | 'notifier' | 'custom';

export interface AgentNode extends WorkflowNode {
  agentType: AgentType;
  skills: string[];
  persona: string;
  language: 'en' | 'ar' | 'ar_en';
  context: string; // e.g. "Dubai lead qualification"
}

// --- Workflow Templates ---
export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  marketContext: 'dubai_real_estate';
  language: 'en' | 'ar' | 'ar_en';
  sampleUseCase: string;
  createdBy: string;
  createdAt: string;
  category?: string;
  stats?: {
    deployed: number;
    avgSuccess: number;
    avgROI: number;
  };
}

// --- Multi-Tenant Orchestration ---
export interface AgentOrchestration {
  id: string;
  tenantId: string;
  workflowIds: string[];
  agentIds: string[];
  status: 'active' | 'paused' | 'error';
  lastRunAt?: string;
  error?: ExecutionError;
  realTimeStatus: {
    runningExecutions: number;
    failedExecutions: number;
    lastExecutionStatus: ExecutionStatus;
  };
}

// --- Sample Data Types ---
export const sampleWorkflowTemplates: WorkflowTemplate[] = [
  {
    id: 'tmpl-lead-processing',
    name: 'Lead Processing & Qualification',
    description: 'Automated workflow for capturing, qualifying, and routing Dubai real estate leads using AI agents and n8n nodes.',
    nodes: [
      {
        id: 'node-webhook',
        name: 'Lead Webhook',
        type: 'webhook',
        config: { url: '/api/leads/webhook' },
        position: { x: 100, y: 100 },
        enabled: true,
        language: 'en',
      },
      {
        id: 'node-ai-qualifier',
        name: 'AI Lead Qualifier',
        type: 'ai_agent',
        agentType: 'specialist',
        config: { prompt: 'Qualify Dubai real estate lead', model: 'gpt-4' },
        position: { x: 300, y: 100 },
        enabled: true,
        language: 'ar_en',
        skills: ['lead qualification', 'arabic', 'english'],
        persona: 'Dubai Lead Specialist',
        context: 'Dubai lead qualification',
      },
      {
        id: 'node-manager',
        name: 'Manager Notification',
        type: 'ai_agent',
        agentType: 'manager',
        config: { notify: true },
        position: { x: 500, y: 100 },
        enabled: true,
        language: 'en',
        skills: ['notification'],
        persona: 'Manager',
        context: 'Lead assignment',
      }
    ],
    connections: [
      { source: 'node-webhook', target: 'node-ai-qualifier' },
      { source: 'node-ai-qualifier', target: 'node-manager' }
    ],
    marketContext: 'dubai_real_estate',
    language: 'ar_en',
    sampleUseCase: 'New lead arrives from website, AI agent qualifies, manager notified.',
    createdBy: 'admin',
    createdAt: '2024-07-08T10:00:00+04:00',
  },
  {
    id: 'tmpl-property-marketing',
    name: 'Property Marketing Automation',
    description: 'Automate property listing distribution and marketing across Dubai portals and social media.',
    nodes: [
      {
        id: 'node-listing-db',
        name: 'Fetch New Listing',
        type: 'database_query',
        config: { table: 'listings', filter: { status: 'active' } },
        position: { x: 100, y: 100 },
        enabled: true,
        language: 'en',
      },
      {
        id: 'node-social-post',
        name: 'AI Social Media Poster',
        type: 'ai_agent',
        agentType: 'coordinator',
        config: { platforms: ['instagram', 'facebook'], prompt: 'Create Dubai property post' },
        position: { x: 300, y: 100 },
        enabled: true,
        language: 'ar_en',
        skills: ['social media', 'marketing'],
        persona: 'Marketing Coordinator',
        context: 'Dubai property marketing',
      }
    ],
    connections: [
      { source: 'node-listing-db', target: 'node-social-post' }
    ],
    marketContext: 'dubai_real_estate',
    language: 'ar_en',
    sampleUseCase: 'New property listing triggers AI-generated social post.',
    createdBy: 'admin',
    createdAt: '2024-07-08T10:00:00+04:00',
  }
]; 