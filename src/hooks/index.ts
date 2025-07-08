// Hooks exports for easier importing
export { default as useAuth } from './useAuth'
export { default as useDemoAuth } from './useDemoAuth'
export {
  useLeads,
  useWhatsAppMessages,
  useWorkflows,
  useDashboardMetrics,
  useRealtimeTable
} from './useSupabase'

// Re-export types
export type { AuthUser, LoginCredentials, RegisterData } from '../services/authService'
