import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { DatabaseService } from '../services/databaseService'
import type {
  Lead,
  WhatsappMessage,
  AutomationWorkflow,
  PropertyListing
} from '../types/database'

/**
 * Hook for real-time leads data
 */
export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true)
      const data = await DatabaseService.leads.getAll()
      setLeads(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leads')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLeads()

    // Subscribe to real-time changes
    const subscription = DatabaseService.leads.subscribeToChanges((payload) => {
      console.log('Lead change:', payload)
      
      setLeads(current => {
        switch (payload.eventType) {
          case 'INSERT':
            return [payload.new, ...current]
          case 'UPDATE':
            return current.map(lead => 
              lead.id === payload.new.id ? payload.new : lead
            )
          case 'DELETE':
            return current.filter(lead => lead.id !== payload.old.id)
          default:
            return current
        }
      })
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchLeads])

  const createLead = async (leadData: Omit<Lead, 'id' | 'client_id' | 'created_at' | 'updated_at'>) => {
    try {
      await DatabaseService.leads.create(leadData)
      // Real-time subscription will update the state
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create lead')
    }
  }

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    try {
      await DatabaseService.leads.update(id, updates)
      // Real-time subscription will update the state
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update lead')
    }
  }

  return {
    leads,
    loading,
    error,
    refresh: fetchLeads,
    createLead,
    updateLead
  }
}

/**
 * Hook for real-time WhatsApp messages
 */
export function useWhatsAppMessages(phoneNumber?: string) {
  const [messages, setMessages] = useState<WhatsappMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true)
      const data = phoneNumber 
        ? await DatabaseService.whatsapp.getByPhoneNumber(phoneNumber)
        : await DatabaseService.whatsapp.getAll()
      setMessages(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages')
    } finally {
      setLoading(false)
    }
  }, [phoneNumber])

  useEffect(() => {
    fetchMessages()

    // Subscribe to real-time changes
    const subscription = DatabaseService.whatsapp.subscribeToChanges((payload) => {
      console.log('WhatsApp message change:', payload)
      
      // Only update if no phone filter or message matches phone filter
      if (!phoneNumber || 
          payload.new?.phone_number === phoneNumber || 
          payload.old?.phone_number === phoneNumber) {
        
        setMessages(current => {
          switch (payload.eventType) {
            case 'INSERT':
              return [payload.new, ...current]
            case 'UPDATE':
              return current.map(msg => 
                msg.id === payload.new.id ? payload.new : msg
              )
            case 'DELETE':
              return current.filter(msg => msg.id !== payload.old.id)
            default:
              return current
          }
        })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchMessages, phoneNumber])

  const sendMessage = async (messageData: Omit<WhatsappMessage, 'id' | 'client_id' | 'created_at'>) => {
    try {
      await DatabaseService.whatsapp.create(messageData)
      // Real-time subscription will update the state
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message')
    }
  }

  return {
    messages,
    loading,
    error,
    refresh: fetchMessages,
    sendMessage
  }
}

/**
 * Hook for automation workflows
 */
export function useWorkflows() {
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWorkflows = useCallback(async () => {
    try {
      setLoading(true)
      const data = await DatabaseService.workflows.getAll()
      setWorkflows(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch workflows')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWorkflows()
  }, [fetchWorkflows])

  const toggleWorkflow = async (id: string, isActive: boolean) => {
    try {
      await DatabaseService.workflows.toggleActive(id, isActive)
      await fetchWorkflows() // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle workflow')
    }
  }

  return {
    workflows,
    loading,
    error,
    refresh: fetchWorkflows,
    toggleWorkflow
  }
}

/**
 * Hook for dashboard analytics
 */
export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    activeWorkflows: 0,
    totalMessages: 0,
    totalProperties: 0,
    newLeadsToday: 0,
    conversionsThisWeek: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true)
      const data = await DatabaseService.analytics.getDashboardMetrics()
      setMetrics(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMetrics()

    // Refresh metrics every 30 seconds
    const interval = setInterval(fetchMetrics, 30000)

    return () => {
      clearInterval(interval)
    }
  }, [fetchMetrics])

  const trackEvent = async (eventType: string, eventData: any) => {
    try {
      await DatabaseService.analytics.trackEvent(eventType, eventData)
    } catch (err) {
      console.error('Failed to track event:', err)
    }
  }

  return {
    metrics,
    loading,
    error,
    refresh: fetchMetrics,
    trackEvent
  }
}

/**
 * Generic hook for real-time table data
 */
export function useRealtimeTable<T>(
  tableName: string,
  fetchFunction: () => Promise<T[]>
) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const result = await fetchFunction()
      setData(result)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }, [fetchFunction])

  useEffect(() => {
    fetchData()

    // Subscribe to real-time changes
    const subscription = supabase
      .channel(`${tableName}-changes`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: tableName
      }, (payload) => {
        console.log(`${tableName} change:`, payload)
        
        setData(current => {
          switch (payload.eventType) {
            case 'INSERT':
              return [payload.new as T, ...current]
            case 'UPDATE':
              return current.map(item => 
                (item as any).id === (payload.new as any).id ? payload.new as T : item
              )
            case 'DELETE':
              return current.filter(item => (item as any).id !== (payload.old as any).id)
            default:
              return current
          }
        })
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [tableName, fetchData])

  return {
    data,
    loading,
    error,
    refresh: fetchData
  }
}
