/**
 * Browser-Compatible Database Service
 * Simplified version that works in browser environment
 */

import { supabase } from '../lib/supabase'

export interface DatabaseConnectionStatus {
  service: string
  status: 'connected' | 'error' | 'warning' | 'testing'
  message: string
  responseTime?: number
  details?: any
}

export interface BrowserDatabaseManager {
  testSupabaseConnection: () => Promise<DatabaseConnectionStatus>
  testPostgreSQLViaSupabase: () => Promise<DatabaseConnectionStatus>
  testN8nConnection: () => Promise<DatabaseConnectionStatus>
  runAllTests: () => Promise<DatabaseConnectionStatus[]>
  testDatabaseOperations: () => Promise<DatabaseConnectionStatus>
}

/**
 * Test Supabase connection
 */
async function testSupabaseConnection(): Promise<DatabaseConnectionStatus> {
  const startTime = Date.now()
  
  try {
    const { data, error } = await supabase
      .from('client_profiles')
      .select('count')
      .limit(1)

    if (error) throw error

    return {
      service: 'Supabase',
      status: 'connected',
      message: `Connected successfully (${Date.now() - startTime}ms)`,
      responseTime: Date.now() - startTime,
      details: {
        url: import.meta.env.VITE_SUPABASE_URL,
        features: ['Authentication', 'Real-time', 'REST API', 'Storage']
      }
    }
  } catch (error) {
    return {
      service: 'Supabase',
      status: 'error',
      message: `Connection failed: ${error.message}`,
      responseTime: Date.now() - startTime,
      details: { error: error.message }
    }
  }
}

/**
 * Test PostgreSQL via Supabase
 */
async function testPostgreSQLViaSupabase(): Promise<DatabaseConnectionStatus> {
  const startTime = Date.now()
  
  try {
    // Test multiple table access
    const tests = await Promise.all([
      supabase.from('leads').select('count').limit(1),
      supabase.from('ai_agents').select('count').limit(1),
      supabase.from('automation_workflows').select('count').limit(1)
    ])

    const errors = tests.filter(test => test.error)
    if (errors.length > 0) {
      throw new Error(`Table access issues: ${errors.map(e => e.error?.message).join(', ')}`)
    }

    return {
      service: 'PostgreSQL',
      status: 'connected',
      message: `Database accessible via Supabase (${Date.now() - startTime}ms)`,
      responseTime: Date.now() - startTime,
      details: {
        connection: 'Via Supabase API',
        tablesAccessible: ['leads', 'ai_agents', 'automation_workflows'],
        note: 'Direct PostgreSQL connection not available in browser'
      }
    }
  } catch (error) {
    return {
      service: 'PostgreSQL',
      status: 'error',
      message: `Database access failed: ${error.message}`,
      responseTime: Date.now() - startTime,
      details: { error: error.message }
    }
  }
}

/**
 * Test n8n connection
 */
async function testN8nConnection(): Promise<DatabaseConnectionStatus> {
  const startTime = Date.now()
  
  try {
    const n8nUrl = import.meta.env.VITE_N8N_API_URL || 'https://n8n.yasta.online'
    
    const response = await fetch(`${n8nUrl}/healthz`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return {
      service: 'n8n Automation',
      status: 'connected',
      message: `Automation engine connected (${Date.now() - startTime}ms)`,
      responseTime: Date.now() - startTime,
      details: {
        url: n8nUrl,
        purpose: 'Workflow automation and AI agent orchestration'
      }
    }
  } catch (error) {
    return {
      service: 'n8n Automation',
      status: 'error',
      message: `Automation engine not accessible: ${error.message}`,
      responseTime: Date.now() - startTime,
      details: { error: error.message }
    }
  }
}

/**
 * Test database operations
 */
async function testDatabaseOperations(): Promise<DatabaseConnectionStatus> {
  const startTime = Date.now()
  
  try {
    // Test 1: Create and delete a test record
    const testLead = {
      client_id: 'demo-client-123',
      name: 'Database Test Lead',
      phone: '+971501234567',
      email: 'test@database.local',
      status: 'new' as const,
      source: 'database_test',
      notes: 'Automated database connection test',
      created_at: new Date().toISOString()
    }

    const { data: created, error: createError } = await supabase
      .from('leads')
      .insert(testLead)
      .select()
      .single()

    if (createError) throw createError

    // Test 2: Read the record
    const { data: retrieved, error: readError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', created.id)
      .single()

    if (readError) throw readError

    // Test 3: Update the record
    const { data: updated, error: updateError } = await supabase
      .from('leads')
      .update({ notes: 'Updated via database test' })
      .eq('id', created.id)
      .select()
      .single()

    if (updateError) throw updateError

    // Test 4: Delete the record
    const { error: deleteError } = await supabase
      .from('leads')
      .delete()
      .eq('id', created.id)

    if (deleteError) throw deleteError

    return {
      service: 'Database Operations',
      status: 'connected',
      message: `CRUD operations successful (${Date.now() - startTime}ms)`,
      responseTime: Date.now() - startTime,
      details: {
        operations: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
        testRecord: created.id,
        note: 'All database operations working correctly'
      }
    }
  } catch (error) {
    return {
      service: 'Database Operations',
      status: 'error',
      message: `Database operations failed: ${error.message}`,
      responseTime: Date.now() - startTime,
      details: { error: error.message }
    }
  }
}

/**
 * Run all database tests
 */
async function runAllTests(): Promise<DatabaseConnectionStatus[]> {
  console.log('🧪 Running all database connection tests...')
  
  const tests = await Promise.all([
    testSupabaseConnection(),
    testPostgreSQLViaSupabase(),
    testN8nConnection(),
    testDatabaseOperations()
  ])

  const successCount = tests.filter(test => test.status === 'connected').length
  console.log(`📊 Database tests completed: ${successCount}/${tests.length} successful`)

  return tests
}

/**
 * Get Redis status (server-side only)
 */
function getRedisStatus(): DatabaseConnectionStatus {
  return {
    service: 'Redis Cache',
    status: 'warning',
    message: 'Cache layer - server-side only (not testable from browser)',
    details: {
      connection: 'Server-side only',
      purpose: 'Caching, sessions, real-time notifications',
      note: 'Redis health must be monitored on the server',
      fallback: 'Application works without Redis (reduced performance)'
    }
  }
}

// Browser-compatible database manager
export const browserDatabaseManager: BrowserDatabaseManager = {
  testSupabaseConnection,
  testPostgreSQLViaSupabase,
  testN8nConnection,
  runAllTests,
  testDatabaseOperations
}

export default browserDatabaseManager
