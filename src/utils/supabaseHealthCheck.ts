import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

// Environment configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://supabase.yasta.online'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc1MTM4NDIyMCwiZXhwIjo0OTA3MDU3ODIwLCJyb2xlIjoiYW5vbiJ9.1qnOwvVZNzuXRwvRdsWHHMoSTuIUSKGX3yIjFBmaDXc'
const SUPABASE_SERVICE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_KEY || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc1MTM4NDIyMCwiZXhwIjo0OTA3MDU3ODIwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.t3sdqJQe-IqczBtSYp8rTJnMzQ22m3M8-22av-cVfAA'

// Create clients
const supabaseAnon = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)
const supabaseService = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_KEY)

export interface HealthCheckResult {
  timestamp: string
  overall: 'healthy' | 'warning' | 'critical'
  checks: {
    [key: string]: {
      status: 'pass' | 'fail' | 'warning'
      message: string
      details?: any
      duration?: number
    }
  }
  summary: {
    total: number
    passed: number
    failed: number
    warnings: number
  }
}

export interface ConnectionTestResult {
  success: boolean
  message: string
  details?: any
  duration?: number
}

// Core database tables to validate
const CRITICAL_TABLES = [
  'client_profiles',
  'leads',
  'property_listings',
  'ai_agents',
  'whatsapp_messages',
  'automation_workflows',
  'user_profiles',
  'agent_tasks',
  'email_campaigns',
  'analytics_events'
]

// API endpoints to test
const API_ENDPOINTS = [
  '/rest/v1/client_profiles',
  '/rest/v1/leads',
  '/rest/v1/property_listings',
  '/rest/v1/ai_agents',
  '/rest/v1/whatsapp_messages',
  '/auth/v1/user',
  '/auth/v1/session'
]

/**
 * Test basic connectivity to Supabase
 */
export async function testBasicConnectivity(): Promise<ConnectionTestResult> {
  const startTime = Date.now()
  
  try {
    // Test with anon key
    const { data, error } = await supabaseAnon
      .from('client_profiles')
      .select('count')
      .limit(1)
    
    const duration = Date.now() - startTime
    
    if (error) {
      return {
        success: false,
        message: `Basic connectivity failed: ${error.message}`,
        details: error,
        duration
      }
    }
    
    return {
      success: true,
      message: 'Basic connectivity successful',
      details: { data, responseTime: duration },
      duration
    }
  } catch (error: any) {
    const duration = Date.now() - startTime
    return {
      success: false,
      message: `Connectivity error: ${error.message}`,
      details: error,
      duration
    }
  }
}

/**
 * Test authentication with both anon and service keys
 */
export async function testAuthentication(): Promise<ConnectionTestResult> {
  const startTime = Date.now()
  
  try {
    // Test anon key
    const { data: anonData, error: anonError } = await supabaseAnon.auth.getUser()
    
    // Test service key (should work without user)
    const { data: serviceData, error: serviceError } = await supabaseService.auth.getUser()
    
    const duration = Date.now() - startTime
    
    if (anonError && serviceError) {
      return {
        success: false,
        message: 'Both authentication methods failed',
        details: { anonError, serviceError },
        duration
      }
    }
    
    return {
      success: true,
      message: 'Authentication successful',
      details: { anonData, serviceData },
      duration
    }
  } catch (error: any) {
    const duration = Date.now() - startTime
    return {
      success: false,
      message: `Authentication error: ${error.message}`,
      details: error,
      duration
    }
  }
}

/**
 * Test all critical database tables
 */
export async function testDatabaseTables(): Promise<ConnectionTestResult> {
  const startTime = Date.now()
  const results: { [table: string]: any } = {}
  const errors: string[] = []
  
  try {
    for (const table of CRITICAL_TABLES) {
      try {
        const { data, error } = await supabaseService
          .from(table as any)
          .select('count')
          .limit(1)
        
        results[table] = {
          accessible: !error,
          error: error?.message,
          hasData: data && data.length > 0
        }
        
        if (error) {
          errors.push(`${table}: ${error.message}`)
        }
      } catch (tableError: any) {
        results[table] = {
          accessible: false,
          error: tableError.message
        }
        errors.push(`${table}: ${tableError.message}`)
      }
    }
    
    const duration = Date.now() - startTime
    const accessibleTables = Object.values(results).filter(r => r.accessible).length
    
    if (errors.length === 0) {
      return {
        success: true,
        message: `All ${CRITICAL_TABLES.length} tables are accessible`,
        details: { results, accessibleTables },
        duration
      }
    } else {
      return {
        success: false,
        message: `${errors.length} tables have issues`,
        details: { results, errors, accessibleTables },
        duration
      }
    }
  } catch (error: any) {
    const duration = Date.now() - startTime
    return {
      success: false,
      message: `Database tables test error: ${error.message}`,
      details: error,
      duration
    }
  }
}

/**
 * Test API endpoints accessibility
 */
export async function testAPIEndpoints(): Promise<ConnectionTestResult> {
  const startTime = Date.now()
  const results: { [endpoint: string]: any } = {}
  const errors: string[] = []
  
  try {
    for (const endpoint of API_ENDPOINTS) {
      try {
        const response = await fetch(`${SUPABASE_URL}${endpoint}`, {
          method: 'GET',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          }
        })
        
        results[endpoint] = {
          status: response.status,
          accessible: response.status < 500,
          error: response.status >= 400 ? `HTTP ${response.status}` : null
        }
        
        if (response.status >= 400) {
          errors.push(`${endpoint}: HTTP ${response.status}`)
        }
      } catch (endpointError: any) {
        results[endpoint] = {
          status: 'error',
          accessible: false,
          error: endpointError.message
        }
        errors.push(`${endpoint}: ${endpointError.message}`)
      }
    }
    
    const duration = Date.now() - startTime
    const accessibleEndpoints = Object.values(results).filter(r => r.accessible).length
    
    if (errors.length === 0) {
      return {
        success: true,
        message: `All ${API_ENDPOINTS.length} API endpoints are accessible`,
        details: { results, accessibleEndpoints },
        duration
      }
    } else {
      return {
        success: false,
        message: `${errors.length} API endpoints have issues`,
        details: { results, errors, accessibleEndpoints },
        duration
      }
    }
  } catch (error: any) {
    const duration = Date.now() - startTime
    return {
      success: false,
      message: `API endpoints test error: ${error.message}`,
      details: error,
      duration
    }
  }
}

/**
 * Test real-time subscriptions
 */
export async function testRealtimeSubscriptions(): Promise<ConnectionTestResult> {
  const startTime = Date.now()
  
  try {
    return new Promise((resolve) => {
      const channel = supabaseAnon
        .channel('health-check')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'leads' },
          (payload) => {
            // Successfully received real-time event
            channel.unsubscribe()
            const duration = Date.now() - startTime
            resolve({
              success: true,
              message: 'Real-time subscriptions working',
              details: { payload },
              duration
            })
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            // Test by inserting a temporary record
            setTimeout(async () => {
              try {
                await supabaseService
                  .from('leads')
                  .insert({
                    client_id: 'health-check',
                    name: 'Health Check Test',
                    status: 'new',
                    lead_score: 0
                  })
                  .select()
              } catch (error) {
                // Expected error due to RLS, but subscription should still work
              }
            }, 1000)
          } else if (status === 'CHANNEL_ERROR') {
            channel.unsubscribe()
            const duration = Date.now() - startTime
            resolve({
              success: false,
              message: 'Real-time subscription failed',
              details: { status },
              duration
            })
          }
        })
      
      // Timeout after 10 seconds
      setTimeout(() => {
        channel.unsubscribe()
        const duration = Date.now() - startTime
        resolve({
          success: false,
          message: 'Real-time subscription timeout',
          details: { timeout: true },
          duration
        })
      }, 10000)
    })
  } catch (error: any) {
    const duration = Date.now() - startTime
    return {
      success: false,
      message: `Real-time test error: ${error.message}`,
      details: error,
      duration
    }
  }
}

/**
 * Test CORS configuration
 */
export async function testCORSConfiguration(): Promise<ConnectionTestResult> {
  const startTime = Date.now()
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/client_profiles`, {
      method: 'OPTIONS',
      headers: {
        'Origin': window.location.origin,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'apikey,authorization,content-type'
      }
    })
    
    const duration = Date.now() - startTime
    
    const corsHeaders = {
      'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
      'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
      'access-control-allow-headers': response.headers.get('access-control-allow-headers')
    }
    
    if (response.status === 200 || response.status === 204) {
      return {
        success: true,
        message: 'CORS configuration is working',
        details: { corsHeaders, status: response.status },
        duration
      }
    } else {
      return {
        success: false,
        message: `CORS test failed with status ${response.status}`,
        details: { corsHeaders, status: response.status },
        duration
      }
    }
  } catch (error: any) {
    const duration = Date.now() - startTime
    return {
      success: false,
      message: `CORS test error: ${error.message}`,
      details: error,
      duration
    }
  }
}

/**
 * Test SSL/TLS certificate
 */
export async function testSSLCertificate(): Promise<ConnectionTestResult> {
  const startTime = Date.now()
  
  try {
    const response = await fetch(SUPABASE_URL, {
      method: 'HEAD'
    })
    
    const duration = Date.now() - startTime
    
    if (response.ok) {
      return {
        success: true,
        message: 'SSL/TLS certificate is valid',
        details: { 
          status: response.status,
          secure: window.location.protocol === 'https:' || SUPABASE_URL.startsWith('https://')
        },
        duration
      }
    } else {
      return {
        success: false,
        message: `SSL test failed with status ${response.status}`,
        details: { status: response.status },
        duration
      }
    }
  } catch (error: any) {
    const duration = Date.now() - startTime
    return {
      success: false,
      message: `SSL test error: ${error.message}`,
      details: error,
      duration
    }
  }
}

/**
 * Comprehensive health check
 */
export async function runComprehensiveHealthCheck(): Promise<HealthCheckResult> {
  const startTime = Date.now()
  const checks: HealthCheckResult['checks'] = {}
  
  console.log('🏥 Starting comprehensive Supabase health check...')
  
  // Test 1: Basic Connectivity
  console.log('🔌 Testing basic connectivity...')
  const connectivity = await testBasicConnectivity()
  checks.connectivity = {
    status: connectivity.success ? 'pass' : 'fail',
    message: connectivity.message,
    details: connectivity.details,
    duration: connectivity.duration
  }
  
  // Test 2: Authentication
  console.log('🔐 Testing authentication...')
  const auth = await testAuthentication()
  checks.authentication = {
    status: auth.success ? 'pass' : 'fail',
    message: auth.message,
    details: auth.details,
    duration: auth.duration
  }
  
  // Test 3: Database Tables
  console.log('🗄️ Testing database tables...')
  const tables = await testDatabaseTables()
  checks.databaseTables = {
    status: tables.success ? 'pass' : 'fail',
    message: tables.message,
    details: tables.details,
    duration: tables.duration
  }
  
  // Test 4: API Endpoints
  console.log('🌐 Testing API endpoints...')
  const endpoints = await testAPIEndpoints()
  checks.apiEndpoints = {
    status: endpoints.success ? 'pass' : 'fail',
    message: endpoints.message,
    details: endpoints.details,
    duration: endpoints.duration
  }
  
  // Test 5: CORS Configuration
  console.log('🔒 Testing CORS configuration...')
  const cors = await testCORSConfiguration()
  checks.cors = {
    status: cors.success ? 'pass' : 'fail',
    message: cors.message,
    details: cors.details,
    duration: cors.duration
  }
  
  // Test 6: SSL Certificate
  console.log('🔐 Testing SSL certificate...')
  const ssl = await testSSLCertificate()
  checks.ssl = {
    status: ssl.success ? 'pass' : 'fail',
    message: ssl.message,
    details: ssl.details,
    duration: ssl.duration
  }
  
  // Test 7: Real-time Subscriptions (async, don't block)
  console.log('📡 Testing real-time subscriptions...')
  testRealtimeSubscriptions().then(realtime => {
    checks.realtime = {
      status: realtime.success ? 'pass' : 'fail',
      message: realtime.message,
      details: realtime.details,
      duration: realtime.duration
    }
  }).catch(error => {
    checks.realtime = {
      status: 'fail',
      message: `Real-time test error: ${error.message}`,
      details: error
    }
  })
  
  // Calculate summary
  const total = Object.keys(checks).length
  const passed = Object.values(checks).filter(c => c.status === 'pass').length
  const failed = Object.values(checks).filter(c => c.status === 'fail').length
  const warnings = Object.values(checks).filter(c => c.status === 'warning').length
  
  // Determine overall status
  let overall: HealthCheckResult['overall'] = 'healthy'
  if (failed > 0) {
    overall = failed > 2 ? 'critical' : 'warning'
  } else if (warnings > 0) {
    overall = 'warning'
  }
  
  const result: HealthCheckResult = {
    timestamp: new Date().toISOString(),
    overall,
    checks,
    summary: {
      total,
      passed,
      failed,
      warnings
    }
  }
  
  console.log('✅ Health check completed:', result)
  return result
}

/**
 * Quick health check for dashboard
 */
export async function quickHealthCheck(): Promise<{
  healthy: boolean
  message: string
  issues: string[]
}> {
  try {
    const { data, error } = await supabaseAnon
      .from('client_profiles')
      .select('count')
      .limit(1)
    
    if (error) {
      return {
        healthy: false,
        message: 'Database connection failed',
        issues: [error.message]
      }
    }
    
    return {
      healthy: true,
      message: 'All systems operational',
      issues: []
    }
  } catch (error: any) {
    return {
      healthy: false,
      message: 'Connection error',
      issues: [error.message]
    }
  }
} 