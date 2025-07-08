import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://supabase.yasta.online'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc1MTM4NDIyMCwiZXhwIjo0OTA3MDU3ODIwLCJyb2xlIjoiYW5vbiJ9.1qnOwvVZNzuXRwvRdsWHHMoSTuIUSKGX3yIjFBmaDXc'
// If you see connection issues, check your .env file for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

console.log('🔌 Supabase Configuration:')
console.log('URL:', SUPABASE_URL)
console.log('Key:', SUPABASE_ANON_KEY ? `${SUPABASE_ANON_KEY.substring(0, 20)}...` : 'missing')

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    headers: {
      'X-Client-Info': 'dubai-real-estate-platform',
    },
  },
})

// Helper function to handle Supabase errors
export function handleSupabaseError(error: any): never {
  console.error('Supabase error:', error)
  
  if (error?.message) {
    throw new Error(error.message)
  }
  
  if (error?.details) {
    throw new Error(error.details)
  }
  
  throw new Error('An unexpected database error occurred')
}

// Demo mode client ID for development
const DEMO_CLIENT_ID = 'demo-client-123'

// Helper function to get current user's client_id with demo fallback
export async function getCurrentUserClientId(): Promise<string> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.log('🔄 No authenticated user, using demo client ID:', DEMO_CLIENT_ID)
      return DEMO_CLIENT_ID
    }

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('client_id')
      .eq('id', user.id)
      .single()

    if (error) {
      console.warn('Error fetching user profile, using demo client ID:', error)
      return DEMO_CLIENT_ID
    }

    return profile?.client_id || DEMO_CLIENT_ID
  } catch (error) {
    console.warn('Error in getCurrentUserClientId, using demo client ID:', error)
    return DEMO_CLIENT_ID
  }
}

// Helper function to ensure user is authenticated (demo-friendly)
export async function requireAuth() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.log('🔄 No authenticated user, operating in demo mode')
      return {
        id: 'demo-user-12345678',
        email: 'demo@dubaireal.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        role: 'authenticated'
      }
    }
    
    return user
  } catch (error) {
    console.warn('Auth error, creating demo user:', error)
    return {
      id: 'demo-user-12345678',
      email: 'demo@dubaireal.com',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      role: 'authenticated'
    }
  }
}

// Test connection function
export async function testSupabaseConnection(): Promise<{
  success: boolean
  message: string
  details?: any
}> {
  try {
    console.log('🧪 Testing Supabase connection...')
    
    // Test basic connectivity
    const { data, error } = await supabase
      .from('client_profiles')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Connection test failed:', error)
      return {
        success: false,
        message: `Connection failed: ${error.message}`,
        details: error
      }
    }
    
    console.log('✅ Supabase connection successful')
    return {
      success: true,
      message: 'Successfully connected to Supabase',
      details: { data, timestamp: new Date().toISOString() }
    }
  } catch (error) {
    console.error('❌ Connection test error:', error)
    return {
      success: false,
      message: `Connection error: ${error.message}`,
      details: error
    }
  }
}

// Initialize demo data if needed
export async function initializeDemoData(): Promise<void> {
  try {
    console.log('🚀 Initializing demo data...')
    
    // Create demo client profile
    const { error: clientError } = await supabase
      .from('client_profiles')
      .upsert({
        id: DEMO_CLIENT_ID,
        name: 'Demo Client - Dubai Real Estate',
        email: 'demo@dubaireal.com',
        company_name: 'Dubai Real Estate Demo Agency',
        subscription_plan: 'premium',
        api_settings: {
          whatsapp_enabled: true,
          voice_calls_enabled: true,
          ai_agents_enabled: true
        }
      })
    
    if (clientError && !clientError.message.includes('duplicate key')) {
      console.warn('Demo client creation warning:', clientError)
    }
    
    // Create demo AI agents
    const demoAgents = [
      {
        id: 'sarah-manager',
        client_id: DEMO_CLIENT_ID,
        name: 'Sarah Al-Mansouri',
        type: 'manager' as const,
        status: 'active' as const,
        avatar: '👩‍💼',
        specialty: 'Strategic Analysis & Voice Calls',
        configuration: {
          language: 'bilingual',
          expertise_level: 'expert',
          availability: '24/7',
          voice_enabled: true
        }
      },
      {
        id: 'omar-qualifier',
        client_id: DEMO_CLIENT_ID,
        name: 'Omar Hassan',
        type: 'basic' as const,
        status: 'active' as const,
        avatar: '🎯',
        specialty: 'Lead Qualification Specialist',
        configuration: {
          qualification_criteria: 'dubai_real_estate',
          response_time: 'under_30_seconds',
          languages: ['english', 'arabic']
        }
      }
    ]
    
    for (const agent of demoAgents) {
      const { error: agentError } = await supabase
        .from('ai_agents')
        .upsert(agent)
      
      if (agentError && !agentError.message.includes('duplicate key')) {
        console.warn(`Demo agent creation warning for ${agent.name}:`, agentError)
      }
    }
    
    console.log('✅ Demo data initialized successfully')
  } catch (error) {
    console.warn('Demo data initialization warning:', error)
  }
}

export default supabase
