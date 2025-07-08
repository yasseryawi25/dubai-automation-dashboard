import { supabase } from '../lib/supabase'

/**
 * Database Connection Tester for Dubai Real Estate AI Platform
 * Tests all database connections from the browser environment
 */

export interface ConnectionTest {
  name: string
  status: 'testing' | 'success' | 'error' | 'warning'
  message: string
  responseTime?: number
  details?: any
}

export interface DatabaseTestResults {
  supabase: ConnectionTest
  postgres: ConnectionTest
  redis: ConnectionTest
  n8n: ConnectionTest
  overall: {
    status: 'healthy' | 'degraded' | 'critical'
    message: string
    connectedServices: number
    totalServices: number
  }
}

/**
 * Test Supabase connection and features
 */
async function testSupabaseConnection(): Promise<ConnectionTest> {
  const startTime = Date.now()
  
  try {
    console.log('🧪 Testing Supabase connection...')

    // Test 1: Basic connectivity
    const { data: healthData, error: healthError } = await supabase
      .from('client_profiles')
      .select('count')
      .limit(1)

    if (healthError) {
      throw new Error(`Connectivity test failed: ${healthError.message}`)
    }

    // Test 2: Authentication status
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.warn('Auth test warning:', authError)
    }

    // Test 3: Real-time capabilities
    let realtimeStatus = 'Unknown'
    try {
      const channel = supabase.channel('test-channel')
      channel.subscribe((status) => {
        realtimeStatus = status
      })
      await new Promise(resolve => setTimeout(resolve, 1000))
      supabase.removeChannel(channel)
    } catch (realtimeError) {
      console.warn('Realtime test warning:', realtimeError)
      realtimeStatus = 'Error'
    }

    const responseTime = Date.now() - startTime

    return {
      name: 'Supabase',
      status: 'success',
      message: `Connected successfully (${responseTime}ms)`,
      responseTime,
      details: {
        url: import.meta.env.VITE_SUPABASE_URL,
        auth: user ? 'Authenticated' : 'Anonymous',
        realtime: realtimeStatus,
        features: ['REST API', 'Auth', 'Real-time', 'Storage']
      }
    }
  } catch (error) {
    console.error('❌ Supabase test failed:', error)
    return {
      name: 'Supabase',
      status: 'error',
      message: `Connection failed: ${error.message}`,
      responseTime: Date.now() - startTime,
      details: {
        url: import.meta.env.VITE_SUPABASE_URL,
        error: error.message
      }
    }
  }
}

/**
 * Test PostgreSQL connection via Supabase
 */
async function testPostgreSQLConnection(): Promise<ConnectionTest> {
  const startTime = Date.now()
  
  try {
    console.log('🐘 Testing PostgreSQL via Supabase...')

    // Test database operations
    const tests = await Promise.all([
      // Test 1: Select operation
      supabase.from('leads').select('count').limit(1),
      // Test 2: Check if tables exist
      supabase.from('ai_agents').select('count').limit(1),
      // Test 3: Check client profiles
      supabase.from('client_profiles').select('count').limit(1)
    ])

    const failedTests = tests.filter(test => test.error)
    
    if (failedTests.length > 0) {
      const errors = failedTests.map(test => test.error?.message).join(', ')
      throw new Error(`Table access failed: ${errors}`)
    }

    const responseTime = Date.now() - startTime

    return {
      name: 'PostgreSQL',
      status: 'success',
      message: `Database accessible via Supabase (${responseTime}ms)`,
      responseTime,
      details: {
        connection: 'Via Supabase API',
        tablesAccessible: ['leads', 'ai_agents', 'client_profiles'],
        directConnection: 'Not available in browser (security)'
      }
    }
  } catch (error) {
    console.error('❌ PostgreSQL test failed:', error)
    return {
      name: 'PostgreSQL',
      status: 'error',
      message: `Database access failed: ${error.message}`,
      responseTime: Date.now() - startTime,
      details: {
        error: error.message,
        note: 'PostgreSQL is accessed via Supabase in browser environment'
      }
    }
  }
}

/**
 * Test Redis connection via health endpoint
 */
async function testRedisConnection(): Promise<ConnectionTest> {
  const startTime = Date.now()
  
  try {
    console.log('🔴 Testing Redis connection...')

    // Since Redis can't be accessed directly from browser,
    // we'll test via a health endpoint or Supabase functions
    
    // For now, we'll create a mock test that checks if Redis would be available
    // In production, this would hit an API endpoint that tests Redis
    
    const responseTime = Date.now() - startTime

    return {
      name: 'Redis',
      status: 'warning',
      message: `Cache layer - not directly testable from browser (${responseTime}ms)`,
      responseTime,
      details: {
        connection: 'Server-side only',
        purpose: 'Caching, Sessions, Real-time notifications',
        note: 'Redis health should be monitored server-side',
        fallback: 'Application works without Redis (reduced performance)'
      }
    }
  } catch (error) {
    console.error('❌ Redis test failed:', error)
    return {
      name: 'Redis',
      status: 'error',
      message: `Redis test failed: ${error.message}`,
      responseTime: Date.now() - startTime,
      details: {
        error: error.message
      }
    }
  }
}

/**
 * Test n8n connection
 */
async function testN8nConnection(): Promise<ConnectionTest> {
  const startTime = Date.now()
  
  try {
    console.log('🔗 Testing n8n connection...')

    const n8nUrl = import.meta.env.VITE_N8N_API_URL || 'https://n8n.yasta.online'
    
    // Test n8n health endpoint
    const response = await fetch(`${n8nUrl}/healthz`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const responseTime = Date.now() - startTime

    return {
      name: 'n8n Automation',
      status: 'success',
      message: `Automation engine connected (${responseTime}ms)`,
      responseTime,
      details: {
        url: n8nUrl,
        purpose: 'Workflow automation, AI agent orchestration',
        features: ['Lead processing', 'WhatsApp automation', 'Email sequences', 'Agent coordination']
      }
    }
  } catch (error) {
    console.error('❌ n8n test failed:', error)
    return {
      name: 'n8n Automation',
      status: 'error',
      message: `Automation engine not accessible: ${error.message}`,
      responseTime: Date.now() - startTime,
      details: {
        error: error.message,
        impact: 'Automation workflows will not function',
        url: import.meta.env.VITE_N8N_API_URL
      }
    }
  }
}

/**
 * Run comprehensive database connection tests
 */
export async function runDatabaseConnectionTests(): Promise<DatabaseTestResults> {
  console.log('🧪 Starting comprehensive database connection tests...')
  
  // Run all tests in parallel for faster execution
  const [supabaseTest, postgresTest, redisTest, n8nTest] = await Promise.all([
    testSupabaseConnection(),
    testPostgreSQLConnection(),
    testRedisConnection(),
    testN8nConnection()
  ])

  // Calculate overall status
  const connectedServices = [supabaseTest, postgresTest, redisTest, n8nTest]
    .filter(test => test.status === 'success').length
  
  const totalServices = 4
  
  let overallStatus: 'healthy' | 'degraded' | 'critical'
  let overallMessage: string

  if (connectedServices === totalServices) {
    overallStatus = 'healthy'
    overallMessage = 'All systems operational'
  } else if (connectedServices >= 2) {
    overallStatus = 'degraded'
    overallMessage = `${connectedServices}/${totalServices} systems operational - reduced functionality`
  } else {
    overallStatus = 'critical'
    overallMessage = `Only ${connectedServices}/${totalServices} systems operational - critical issues`
  }

  const results: DatabaseTestResults = {
    supabase: supabaseTest,
    postgres: postgresTest,
    redis: redisTest,
    n8n: n8nTest,
    overall: {
      status: overallStatus,
      message: overallMessage,
      connectedServices,
      totalServices
    }
  }

  console.log('📊 Database connection tests completed:', results.overall)
  
  return results
}

/**
 * Test specific database operation
 */
export async function testDatabaseOperation(operation: string): Promise<ConnectionTest> {
  const startTime = Date.now()
  
  try {
    console.log(`🔧 Testing database operation: ${operation}`)
    
    switch (operation) {
      case 'create_lead':
        // Test creating a lead
        const { data: lead, error: leadError } = await supabase
          .from('leads')
          .insert({
            client_id: 'demo-client-123',
            name: 'Test Lead',
            phone: '+971501234567',
            email: 'test@example.com',
            status: 'new',
            source: 'test',
            notes: 'Database connection test',
            created_at: new Date().toISOString()
          })
          .select()
          .single()

        if (leadError) throw leadError

        // Clean up test data
        await supabase.from('leads').delete().eq('id', lead.id)

        return {
          name: 'Create Lead Operation',
          status: 'success',
          message: `Lead creation test successful (${Date.now() - startTime}ms)`,
          responseTime: Date.now() - startTime,
          details: { operation: 'create_lead', testData: lead }
        }

      case 'get_agents':
        // Test getting AI agents
        const { data: agents, error: agentsError } = await supabase
          .from('ai_agents')
          .select('*')
          .limit(5)

        if (agentsError) throw agentsError

        return {
          name: 'Get AI Agents Operation',
          status: 'success',
          message: `Retrieved ${agents?.length || 0} agents (${Date.now() - startTime}ms)`,
          responseTime: Date.now() - startTime,
          details: { operation: 'get_agents', count: agents?.length || 0 }
        }

      case 'realtime_test':
        // Test real-time subscriptions
        return new Promise((resolve) => {
          const channel = supabase
            .channel('test-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
              resolve({
                name: 'Real-time Subscription Test',
                status: 'success',
                message: `Real-time subscription active (${Date.now() - startTime}ms)`,
                responseTime: Date.now() - startTime,
                details: { operation: 'realtime_test', subscribed: true }
              })
            })
            .subscribe()

          // Timeout after 5 seconds
          setTimeout(() => {
            supabase.removeChannel(channel)
            resolve({
              name: 'Real-time Subscription Test',
              status: 'warning',
              message: `Real-time test timeout (${Date.now() - startTime}ms)`,
              responseTime: Date.now() - startTime,
              details: { operation: 'realtime_test', timeout: true }
            })
          }, 5000)
        })

      default:
        throw new Error(`Unknown operation: ${operation}`)
    }
  } catch (error) {
    console.error(`❌ Database operation test failed: ${operation}`, error)
    return {
      name: `Database Operation: ${operation}`,
      status: 'error',
      message: `Operation failed: ${error.message}`,
      responseTime: Date.now() - startTime,
      details: { operation, error: error.message }
    }
  }
}

/**
 * Monitor database connections continuously
 */
export function startDatabaseMonitoring(intervalMs: number = 30000): () => void {
  console.log(`📊 Starting database monitoring (every ${intervalMs/1000}s)`)
  
  const interval = setInterval(async () => {
    try {
      const results = await runDatabaseConnectionTests()
      
      if (results.overall.status === 'critical') {
        console.error('🚨 CRITICAL: Database connectivity issues detected!', results)
      } else if (results.overall.status === 'degraded') {
        console.warn('⚠️ WARNING: Some database services are unavailable', results)
      } else {
        console.log('✅ All database systems healthy')
      }
    } catch (error) {
      console.error('❌ Database monitoring error:', error)
    }
  }, intervalMs)

  // Return cleanup function
  return () => {
    clearInterval(interval)
    console.log('🛑 Database monitoring stopped')
  }
}

export default {
  runDatabaseConnectionTests,
  testDatabaseOperation,
  startDatabaseMonitoring,
  testSupabaseConnection,
  testPostgreSQLConnection,
  testRedisConnection,
  testN8nConnection
}
