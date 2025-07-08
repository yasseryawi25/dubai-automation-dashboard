import { supabase } from '../lib/supabase'
import Redis from 'ioredis'
import { Pool } from 'pg'

/**
 * Enhanced Database Connection Manager
 * Coordinates PostgreSQL, Supabase, and Redis for optimal performance
 */

// ===========================================
// CONNECTION CONFIGURATIONS
// ===========================================

// PostgreSQL Direct Connection (for n8n and heavy operations)
const postgresConfig = {
  host: import.meta.env.VITE_POSTGRES_HOST || 'automation-postgres',
  port: parseInt(import.meta.env.VITE_POSTGRES_PORT || '5432'),
  database: import.meta.env.VITE_POSTGRES_DB || 'postgres',
  user: import.meta.env.VITE_POSTGRES_USER || 'postgres',
  password: import.meta.env.VITE_POSTGRES_PASSWORD || '',
  max: 20, // Maximum number of connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
}

// Redis Configuration
const redisConfig = {
  host: import.meta.env.VITE_REDIS_HOST || 'automation-redis',
  port: parseInt(import.meta.env.VITE_REDIS_PORT || '6379'),
  password: import.meta.env.VITE_REDIS_PASSWORD || '',
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
}

// ===========================================
// CONNECTION INSTANCES
// ===========================================

let postgresPool: Pool | null = null
let redisClient: Redis | null = null

/**
 * Initialize PostgreSQL connection pool
 */
export async function initializePostgreSQL(): Promise<Pool> {
  if (postgresPool) return postgresPool

  try {
    console.log('🐘 Initializing PostgreSQL connection...')
    
    postgresPool = new Pool(postgresConfig)
    
    // Test connection
    const client = await postgresPool.connect()
    const result = await client.query('SELECT NOW() as current_time')
    client.release()
    
    console.log('✅ PostgreSQL connected successfully:', result.rows[0].current_time)
    return postgresPool
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error)
    
    // Fallback to browser-compatible mode (Supabase only)
    console.log('🔄 Falling back to Supabase-only mode for browser compatibility')
    postgresPool = null
    throw error
  }
}

/**
 * Initialize Redis connection
 */
export async function initializeRedis(): Promise<Redis> {
  if (redisClient?.status === 'ready') return redisClient

  try {
    console.log('🔴 Initializing Redis connection...')
    
    redisClient = new Redis(redisConfig)
    
    // Test connection
    const pong = await redisClient.ping()
    
    if (pong === 'PONG') {
      console.log('✅ Redis connected successfully')
      return redisClient
    } else {
      throw new Error('Redis ping failed')
    }
  } catch (error) {
    console.error('❌ Redis connection failed:', error)
    console.log('🔄 Operating without Redis cache')
    redisClient = null
    throw error
  }
}

/**
 * Initialize Supabase connection
 */
export async function initializeSupabase(): Promise<boolean> {
  try {
    console.log('⚡ Testing Supabase connection...')
    
    const { data, error } = await supabase
      .from('client_profiles')
      .select('count')
      .limit(1)

    if (error) {
      console.error('❌ Supabase connection failed:', error)
      return false
    }

    console.log('✅ Supabase connected successfully')
    return true
  } catch (error) {
    console.error('❌ Supabase connection error:', error)
    return false
  }
}

// ===========================================
// UNIFIED DATABASE OPERATIONS
// ===========================================

export interface DatabaseManager {
  postgres: Pool | null
  redis: Redis | null
  supabase: typeof supabase
  isPostgresAvailable: boolean
  isRedisAvailable: boolean
  isSupabaseAvailable: boolean
}

/**
 * Get unified database manager
 */
export async function getDatabaseManager(): Promise<DatabaseManager> {
  // Initialize connections in parallel
  const [postgresResult, redisResult, supabaseResult] = await Promise.allSettled([
    initializePostgreSQL(),
    initializeRedis(),
    initializeSupabase()
  ])

  return {
    postgres: postgresResult.status === 'fulfilled' ? postgresResult.value : null,
    redis: redisResult.status === 'fulfilled' ? redisResult.value : null,
    supabase: supabase,
    isPostgresAvailable: postgresResult.status === 'fulfilled',
    isRedisAvailable: redisResult.status === 'fulfilled',
    isSupabaseAvailable: supabaseResult.status === 'fulfilled' && supabaseResult.value
  }
}

// ===========================================
// SMART CACHING OPERATIONS
// ===========================================

/**
 * Get data with Redis caching fallback
 */
export async function getCachedData<T>(
  key: string,
  fetchFunction: () => Promise<T>,
  cacheTimeSeconds: number = 300
): Promise<T> {
  try {
    // Try Redis cache first
    if (redisClient?.status === 'ready') {
      const cached = await redisClient.get(key)
      if (cached) {
        console.log(`🎯 Cache hit for key: ${key}`)
        return JSON.parse(cached)
      }
    }

    // Fetch fresh data
    console.log(`🔄 Cache miss, fetching fresh data for: ${key}`)
    const data = await fetchFunction()

    // Cache the result if Redis is available
    if (redisClient?.status === 'ready' && data) {
      await redisClient.setex(key, cacheTimeSeconds, JSON.stringify(data))
      console.log(`💾 Cached data for key: ${key} (${cacheTimeSeconds}s)`)
    }

    return data
  } catch (error) {
    console.error(`❌ Error in getCachedData for key ${key}:`, error)
    // Fallback to direct fetch
    return await fetchFunction()
  }
}

/**
 * Invalidate cache for specific pattern
 */
export async function invalidateCache(pattern: string): Promise<void> {
  try {
    if (redisClient?.status === 'ready') {
      const keys = await redisClient.keys(pattern)
      if (keys.length > 0) {
        await redisClient.del(...keys)
        console.log(`🗑️ Invalidated ${keys.length} cache keys matching: ${pattern}`)
      }
    }
  } catch (error) {
    console.warn('⚠️ Cache invalidation warning:', error)
  }
}

// ===========================================
// DATABASE HEALTH MONITORING
// ===========================================

export interface DatabaseHealth {
  postgres: { status: 'connected' | 'error' | 'unavailable'; message: string; responseTime?: number }
  redis: { status: 'connected' | 'error' | 'unavailable'; message: string; responseTime?: number }
  supabase: { status: 'connected' | 'error' | 'unavailable'; message: string; responseTime?: number }
  overall: 'healthy' | 'degraded' | 'critical'
}

/**
 * Check health of all database connections
 */
export async function checkDatabaseHealth(): Promise<DatabaseHealth> {
  const startTime = Date.now()
  
  const results = await Promise.allSettled([
    // PostgreSQL health check
    (async () => {
      const pgStart = Date.now()
      try {
        if (!postgresPool) {
          return { status: 'unavailable' as const, message: 'PostgreSQL not initialized', responseTime: 0 }
        }
        
        const client = await postgresPool.connect()
        await client.query('SELECT 1')
        client.release()
        
        return {
          status: 'connected' as const,
          message: 'PostgreSQL connection healthy',
          responseTime: Date.now() - pgStart
        }
      } catch (error) {
        return {
          status: 'error' as const,
          message: `PostgreSQL error: ${error.message}`,
          responseTime: Date.now() - pgStart
        }
      }
    })(),

    // Redis health check
    (async () => {
      const redisStart = Date.now()
      try {
        if (!redisClient || redisClient.status !== 'ready') {
          return { status: 'unavailable' as const, message: 'Redis not connected', responseTime: 0 }
        }
        
        const pong = await redisClient.ping()
        if (pong !== 'PONG') {
          throw new Error('Redis ping failed')
        }
        
        return {
          status: 'connected' as const,
          message: 'Redis connection healthy',
          responseTime: Date.now() - redisStart
        }
      } catch (error) {
        return {
          status: 'error' as const,
          message: `Redis error: ${error.message}`,
          responseTime: Date.now() - redisStart
        }
      }
    })(),

    // Supabase health check
    (async () => {
      const supabaseStart = Date.now()
      try {
        const { error } = await supabase
          .from('client_profiles')
          .select('count')
          .limit(1)
        
        if (error) {
          throw error
        }
        
        return {
          status: 'connected' as const,
          message: 'Supabase connection healthy',
          responseTime: Date.now() - supabaseStart
        }
      } catch (error) {
        return {
          status: 'error' as const,
          message: `Supabase error: ${error.message}`,
          responseTime: Date.now() - supabaseStart
        }
      }
    })()
  ])

  const health: DatabaseHealth = {
    postgres: results[0].status === 'fulfilled' ? results[0].value : { status: 'error', message: 'Health check failed' },
    redis: results[1].status === 'fulfilled' ? results[1].value : { status: 'error', message: 'Health check failed' },
    supabase: results[2].status === 'fulfilled' ? results[2].value : { status: 'error', message: 'Health check failed' },
    overall: 'healthy'
  }

  // Determine overall health
  const connectedCount = [health.postgres, health.redis, health.supabase]
    .filter(db => db.status === 'connected').length

  if (connectedCount === 3) {
    health.overall = 'healthy'
  } else if (connectedCount >= 1) {
    health.overall = 'degraded'
  } else {
    health.overall = 'critical'
  }

  const totalTime = Date.now() - startTime
  console.log(`🏥 Database health check completed in ${totalTime}ms:`, health.overall)

  return health
}

// ===========================================
// GRACEFUL SHUTDOWN
// ===========================================

/**
 * Close all database connections gracefully
 */
export async function closeDatabaseConnections(): Promise<void> {
  console.log('🛑 Closing database connections...')

  const closePromises = []

  if (postgresPool) {
    closePromises.push(
      postgresPool.end().then(() => {
        console.log('✅ PostgreSQL connection pool closed')
        postgresPool = null
      }).catch(err => console.error('❌ Error closing PostgreSQL:', err))
    )
  }

  if (redisClient && redisClient.status !== 'end') {
    closePromises.push(
      redisClient.quit().then(() => {
        console.log('✅ Redis connection closed')
        redisClient = null
      }).catch(err => console.error('❌ Error closing Redis:', err))
    )
  }

  await Promise.all(closePromises)
  console.log('🏁 All database connections closed')
}

// ===========================================
// BROWSER COMPATIBILITY
// ===========================================

// In browser environment, only Supabase will be available
if (typeof window !== 'undefined') {
  console.log('🌐 Browser environment detected - PostgreSQL and Redis will use Supabase fallbacks')
}

// Handle page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    closeDatabaseConnections()
  })
}

export default {
  getDatabaseManager,
  getCachedData,
  invalidateCache,
  checkDatabaseHealth,
  closeDatabaseConnections,
  initializePostgreSQL,
  initializeRedis,
  initializeSupabase
}
