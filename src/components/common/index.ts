// Common components for the Dubai Real Estate Platform
export { default as SupabaseHealthCheck } from './SupabaseHealthCheck'
export { default as DatabaseConnectionTester } from './DatabaseConnectionTester'
export { default as ConnectionDiagnostics } from './ConnectionDiagnostics'
export { default as DatabaseTest } from './DatabaseTest'
export { default as SupabaseConnectionTest } from './SupabaseConnectionTest'
export { default as SupabaseTest } from './SupabaseTest'
export { default as IntegrationTestSuite } from './IntegrationTestSuite'
export { default as N8nIntegrationTest } from './N8nIntegrationTest'
export { default as RealTimeActivityFeed } from './RealTimeActivityFeed'

// Re-export types for convenience
export type { 
  Lead, 
  WhatsappMessage, 
  AutomationWorkflow,
  PropertyListing,
  LeadStatus,
  MessageStatus 
} from '../../types/database'