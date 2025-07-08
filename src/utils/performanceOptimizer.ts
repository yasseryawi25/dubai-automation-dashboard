import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://supabase.yasta.online'
const SUPABASE_SERVICE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_KEY || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc1MTM4NDIyMCwiZXhwIjo0OTA3MDU3ODIwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.t3sdqJQe-IqczBtSYp8rTJnMzQ22m3M8-22av-cVfAA'

const supabaseService = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_KEY)

export interface PerformanceAnalysis {
  timestamp: string
  overall: 'excellent' | 'good' | 'fair' | 'poor'
  metrics: {
    queryPerformance: QueryPerformanceMetrics
    indexAnalysis: IndexAnalysis
    connectionPooling: ConnectionPoolingMetrics
    caching: CachingMetrics
  }
  recommendations: PerformanceRecommendation[]
  summary: {
    totalRecommendations: number
    criticalIssues: number
    optimizationOpportunities: number
  }
}

export interface QueryPerformanceMetrics {
  averageResponseTime: number
  slowQueries: SlowQuery[]
  queryCount: number
  peakLoadTime: string
  issues: string[]
}

export interface SlowQuery {
  query: string
  executionTime: number
  frequency: number
  table: string
  optimization: string
}

export interface IndexAnalysis {
  missingIndexes: MissingIndex[]
  unusedIndexes: UnusedIndex[]
  duplicateIndexes: DuplicateIndex[]
  recommendations: string[]
}

export interface MissingIndex {
  table: string
  columns: string[]
  queryType: string
  estimatedImprovement: number
  priority: 'high' | 'medium' | 'low'
}

export interface UnusedIndex {
  table: string
  indexName: string
  size: number
  lastUsed: string
  recommendation: string
}

export interface DuplicateIndex {
  table: string
  indexes: string[]
  recommendation: string
}

export interface ConnectionPoolingMetrics {
  activeConnections: number
  maxConnections: number
  connectionUtilization: number
  connectionWaitTime: number
  issues: string[]
}

export interface CachingMetrics {
  cacheHitRate: number
  cacheSize: number
  cacheEvictions: number
  recommendations: string[]
}

export interface PerformanceRecommendation {
  id: string
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  effort: 'low' | 'medium' | 'high'
  category: 'index' | 'query' | 'connection' | 'cache' | 'schema'
  sql?: string
  estimatedImprovement: number
}

/**
 * Analyze database performance for real estate CRM
 */
export async function analyzePerformance(): Promise<PerformanceAnalysis> {
  console.log('⚡ Starting performance analysis...')
  
  try {
    const queryPerformance = await analyzeQueryPerformance()
    const indexAnalysis = await analyzeIndexes()
    const connectionPooling = await analyzeConnectionPooling()
    const caching = await analyzeCaching()
    
    const recommendations = generateRecommendations({
      queryPerformance,
      indexAnalysis,
      connectionPooling,
      caching
    })
    
    const summary = {
      totalRecommendations: recommendations.length,
      criticalIssues: recommendations.filter(r => r.impact === 'high').length,
      optimizationOpportunities: recommendations.filter(r => r.impact === 'medium' || r.impact === 'high').length
    }
    
    // Determine overall performance rating
    let overall: PerformanceAnalysis['overall'] = 'excellent'
    const criticalIssues = recommendations.filter(r => r.impact === 'high').length
    const totalIssues = recommendations.length
    
    if (criticalIssues > 3) {
      overall = 'poor'
    } else if (criticalIssues > 1 || totalIssues > 10) {
      overall = 'fair'
    } else if (totalIssues > 5) {
      overall = 'good'
    }
    
    return {
      timestamp: new Date().toISOString(),
      overall,
      metrics: {
        queryPerformance,
        indexAnalysis,
        connectionPooling,
        caching
      },
      recommendations,
      summary
    }
  } catch (error: any) {
    console.error('Performance analysis error:', error)
    throw new Error(`Performance analysis failed: ${error.message}`)
  }
}

/**
 * Analyze query performance
 */
async function analyzeQueryPerformance(): Promise<QueryPerformanceMetrics> {
  const slowQueries: SlowQuery[] = []
  const issues: string[] = []
  
  // Test common CRM queries
  const testQueries = [
    {
      name: 'Leads by Status',
      query: 'leads',
      filter: { status: 'new' },
      expectedTime: 100
    },
    {
      name: 'Property Listings',
      query: 'property_listings',
      filter: { is_active: true },
      expectedTime: 200
    },
    {
      name: 'AI Agents Status',
      query: 'ai_agents',
      filter: { status: 'active' },
      expectedTime: 50
    },
    {
      name: 'WhatsApp Messages',
      query: 'whatsapp_messages',
      filter: { direction: 'inbound' },
      expectedTime: 150
    },
    {
      name: 'Lead Analytics',
      query: 'leads',
      filter: {},
      expectedTime: 300
    }
  ]
  
  let totalTime = 0
  let queryCount = 0
  
  for (const testQuery of testQueries) {
    const startTime = Date.now()
    
    try {
      const { data, error } = await supabaseService
        .from(testQuery.query as any)
        .select('*')
        .match(testQuery.filter)
        .limit(100)
      
      const executionTime = Date.now() - startTime
      totalTime += executionTime
      queryCount++
      
      if (executionTime > testQuery.expectedTime) {
        slowQueries.push({
          query: `${testQuery.name} (${testQuery.query})`,
          executionTime,
          frequency: 1,
          table: testQuery.query,
          optimization: `Add index on ${Object.keys(testQuery.filter).join(', ')} columns`
        })
      }
      
      if (error) {
        issues.push(`${testQuery.name}: ${error.message}`)
      }
    } catch (error: any) {
      issues.push(`${testQuery.name}: ${error.message}`)
    }
  }
  
  return {
    averageResponseTime: queryCount > 0 ? totalTime / queryCount : 0,
    slowQueries,
    queryCount,
    peakLoadTime: new Date().toISOString(),
    issues
  }
}

/**
 * Analyze database indexes
 */
async function analyzeIndexes(): Promise<IndexAnalysis> {
  const missingIndexes: MissingIndex[] = []
  const unusedIndexes: UnusedIndex[] = []
  const duplicateIndexes: DuplicateIndex[] = []
  const recommendations: string[] = []
  
  // Define expected indexes for real estate CRM
  const expectedIndexes = [
    {
      table: 'leads',
      columns: ['client_id', 'status'],
      queryType: 'filter',
      priority: 'high' as const
    },
    {
      table: 'leads',
      columns: ['assigned_agent_id'],
      queryType: 'filter',
      priority: 'high' as const
    },
    {
      table: 'leads',
      columns: ['created_at'],
      queryType: 'sort',
      priority: 'medium' as const
    },
    {
      table: 'property_listings',
      columns: ['client_id', 'is_active'],
      queryType: 'filter',
      priority: 'high' as const
    },
    {
      table: 'property_listings',
      columns: ['property_type', 'status'],
      queryType: 'filter',
      priority: 'medium' as const
    },
    {
      table: 'property_listings',
      columns: ['price'],
      queryType: 'range',
      priority: 'medium' as const
    },
    {
      table: 'whatsapp_messages',
      columns: ['client_id', 'lead_id'],
      queryType: 'filter',
      priority: 'high' as const
    },
    {
      table: 'whatsapp_messages',
      columns: ['created_at'],
      queryType: 'sort',
      priority: 'medium' as const
    },
    {
      table: 'ai_agents',
      columns: ['client_id', 'status'],
      queryType: 'filter',
      priority: 'high' as const
    },
    {
      table: 'agent_tasks',
      columns: ['agent_id', 'status'],
      queryType: 'filter',
      priority: 'high' as const
    }
  ]
  
  // Check for missing indexes
  for (const expectedIndex of expectedIndexes) {
    try {
      const { data: existingIndexes, error } = await supabaseService
        .rpc('check_index_exists', {
          table_name: expectedIndex.table,
          column_names: expectedIndex.columns
        })
      
      if (error || !existingIndexes) {
        missingIndexes.push({
          table: expectedIndex.table,
          columns: expectedIndex.columns,
          queryType: expectedIndex.queryType,
          estimatedImprovement: expectedIndex.priority === 'high' ? 80 : 50,
          priority: expectedIndex.priority
        })
      }
    } catch (error) {
      // Assume index doesn't exist if check fails
      missingIndexes.push({
        table: expectedIndex.table,
        columns: expectedIndex.columns,
        queryType: expectedIndex.queryType,
        estimatedImprovement: expectedIndex.priority === 'high' ? 80 : 50,
        priority: expectedIndex.priority
      })
    }
  }
  
  // Generate recommendations
  if (missingIndexes.length > 0) {
    recommendations.push(`Add ${missingIndexes.length} missing indexes for better query performance`)
  }
  
  return {
    missingIndexes,
    unusedIndexes,
    duplicateIndexes,
    recommendations
  }
}

/**
 * Analyze connection pooling
 */
async function analyzeConnectionPooling(): Promise<ConnectionPoolingMetrics> {
  const issues: string[] = []
  
  try {
    // Get connection pool statistics
    const { data: poolStats, error } = await supabaseService
      .rpc('get_connection_pool_stats')
    
    if (error) {
      issues.push(`Could not retrieve connection pool stats: ${error.message}`)
      return {
        activeConnections: 0,
        maxConnections: 100,
        connectionUtilization: 0,
        connectionWaitTime: 0,
        issues
      }
    }
    
    const activeConnections = poolStats?.active_connections || 0
    const maxConnections = poolStats?.max_connections || 100
    const connectionUtilization = (activeConnections / maxConnections) * 100
    const connectionWaitTime = poolStats?.avg_wait_time || 0
    
    // Check for connection issues
    if (connectionUtilization > 80) {
      issues.push('Connection pool utilization is high (>80%)')
    }
    
    if (connectionWaitTime > 1000) {
      issues.push('Connection wait time is high (>1s)')
    }
    
    return {
      activeConnections,
      maxConnections,
      connectionUtilization,
      connectionWaitTime,
      issues
    }
  } catch (error: any) {
    issues.push(`Connection pool analysis error: ${error.message}`)
    return {
      activeConnections: 0,
      maxConnections: 100,
      connectionUtilization: 0,
      connectionWaitTime: 0,
      issues
    }
  }
}

/**
 * Analyze caching performance
 */
async function analyzeCaching(): Promise<CachingMetrics> {
  const recommendations: string[] = []
  
  try {
    // Get cache statistics
    const { data: cacheStats, error } = await supabaseService
      .rpc('get_cache_stats')
    
    if (error) {
      return {
        cacheHitRate: 0,
        cacheSize: 0,
        cacheEvictions: 0,
        recommendations: ['Enable query result caching for better performance']
      }
    }
    
    const cacheHitRate = cacheStats?.hit_rate || 0
    const cacheSize = cacheStats?.cache_size || 0
    const cacheEvictions = cacheStats?.evictions || 0
    
    // Generate recommendations
    if (cacheHitRate < 70) {
      recommendations.push('Cache hit rate is low - consider optimizing queries')
    }
    
    if (cacheEvictions > 100) {
      recommendations.push('High cache eviction rate - consider increasing cache size')
    }
    
    if (cacheSize < 100) {
      recommendations.push('Cache size is small - consider increasing for better performance')
    }
    
    return {
      cacheHitRate,
      cacheSize,
      cacheEvictions,
      recommendations
    }
  } catch (error: any) {
    return {
      cacheHitRate: 0,
      cacheSize: 0,
      cacheEvictions: 0,
      recommendations: ['Enable query result caching for better performance']
    }
  }
}

/**
 * Generate performance recommendations
 */
function generateRecommendations(metrics: {
  queryPerformance: QueryPerformanceMetrics
  indexAnalysis: IndexAnalysis
  connectionPooling: ConnectionPoolingMetrics
  caching: CachingMetrics
}): PerformanceRecommendation[] {
  const recommendations: PerformanceRecommendation[] = []
  
  // Index recommendations
  metrics.indexAnalysis.missingIndexes.forEach((missingIndex, index) => {
    recommendations.push({
      id: `index-${index}`,
      title: `Add Index on ${missingIndex.table}.${missingIndex.columns.join(', ')}`,
      description: `Create a composite index on ${missingIndex.columns.join(', ')} columns in the ${missingIndex.table} table to improve query performance.`,
      impact: missingIndex.priority,
      effort: 'low',
      category: 'index',
      sql: `CREATE INDEX idx_${missingIndex.table}_${missingIndex.columns.join('_')} ON ${missingIndex.table} (${missingIndex.columns.join(', ')});`,
      estimatedImprovement: missingIndex.estimatedImprovement
    })
  })
  
  // Query optimization recommendations
  metrics.queryPerformance.slowQueries.forEach((slowQuery, index) => {
    recommendations.push({
      id: `query-${index}`,
      title: `Optimize ${slowQuery.query}`,
      description: `Query execution time is ${slowQuery.executionTime}ms. ${slowQuery.optimization}`,
      impact: slowQuery.executionTime > 1000 ? 'high' : 'medium',
      effort: 'medium',
      category: 'query',
      estimatedImprovement: 60
    })
  })
  
  // Connection pooling recommendations
  if (metrics.connectionPooling.connectionUtilization > 80) {
    recommendations.push({
      id: 'connection-pool',
      title: 'Optimize Connection Pool Configuration',
      description: 'Connection pool utilization is high. Consider increasing max connections or implementing connection pooling.',
      impact: 'high',
      effort: 'medium',
      category: 'connection',
      estimatedImprovement: 40
    })
  }
  
  // Caching recommendations
  if (metrics.caching.cacheHitRate < 70) {
    recommendations.push({
      id: 'caching',
      title: 'Implement Query Result Caching',
      description: 'Cache hit rate is low. Implement Redis or application-level caching for frequently accessed data.',
      impact: 'high',
      effort: 'high',
      category: 'cache',
      estimatedImprovement: 70
    })
  }
  
  // Real estate CRM specific recommendations
  recommendations.push({
    id: 'partitioning',
    title: 'Implement Table Partitioning',
    description: 'Consider partitioning large tables like leads and whatsapp_messages by date for better performance.',
    impact: 'medium',
    effort: 'high',
    category: 'schema',
    estimatedImprovement: 50
  })
  
  recommendations.push({
    id: 'materialized-views',
    title: 'Create Materialized Views for Analytics',
    description: 'Create materialized views for lead analytics, agent performance, and property statistics.',
    impact: 'medium',
    effort: 'medium',
    category: 'schema',
    estimatedImprovement: 60
  })
  
  return recommendations
}

/**
 * Generate SQL for performance optimizations
 */
export function generateOptimizationSQL(recommendations: PerformanceRecommendation[]): string {
  const sqlStatements: string[] = []
  
  recommendations
    .filter(r => r.category === 'index' && r.sql)
    .forEach(recommendation => {
      sqlStatements.push(`-- ${recommendation.title}`)
      sqlStatements.push(recommendation.sql!)
      sqlStatements.push('')
    })
  
  // Add materialized views for analytics
  sqlStatements.push(`-- Create materialized view for lead analytics
CREATE MATERIALIZED VIEW lead_analytics AS
SELECT 
  client_id,
  status,
  COUNT(*) as lead_count,
  AVG(lead_score) as avg_lead_score,
  DATE_TRUNC('day', created_at) as date
FROM leads
GROUP BY client_id, status, DATE_TRUNC('day', created_at);

CREATE INDEX idx_lead_analytics_client_date ON lead_analytics (client_id, date);
`)

  sqlStatements.push(`-- Create materialized view for agent performance
CREATE MATERIALIZED VIEW agent_performance AS
SELECT 
  agent_id,
  client_id,
  COUNT(*) as tasks_completed,
  AVG(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as success_rate,
  DATE_TRUNC('day', created_at) as date
FROM agent_tasks
GROUP BY agent_id, client_id, DATE_TRUNC('day', created_at);

CREATE INDEX idx_agent_performance_agent_date ON agent_performance (agent_id, date);
`)

  sqlStatements.push(`-- Create materialized view for property statistics
CREATE MATERIALIZED VIEW property_statistics AS
SELECT 
  client_id,
  property_type,
  status,
  COUNT(*) as property_count,
  AVG(price) as avg_price,
  SUM(views_count) as total_views,
  SUM(inquiries_count) as total_inquiries
FROM property_listings
GROUP BY client_id, property_type, status;

CREATE INDEX idx_property_statistics_client_type ON property_statistics (client_id, property_type);
`)

  return sqlStatements.join('\n')
}

/**
 * Quick performance check for dashboard
 */
export async function quickPerformanceCheck(): Promise<{
  performance: 'excellent' | 'good' | 'fair' | 'poor'
  message: string
  issues: string[]
}> {
  try {
    const startTime = Date.now()
    
    // Test a few key queries
    const queries = [
      supabaseService.from('leads').select('count').limit(1),
      supabaseService.from('property_listings').select('count').limit(1),
      supabaseService.from('ai_agents').select('count').limit(1)
    ]
    
    await Promise.all(queries)
    const totalTime = Date.now() - startTime
    
    const issues: string[] = []
    let performance: 'excellent' | 'good' | 'fair' | 'poor' = 'excellent'
    
    if (totalTime > 2000) {
      performance = 'poor'
      issues.push('Query response time is very slow (>2s)')
    } else if (totalTime > 1000) {
      performance = 'fair'
      issues.push('Query response time is slow (>1s)')
    } else if (totalTime > 500) {
      performance = 'good'
      issues.push('Query response time could be improved')
    }
    
    return {
      performance,
      message: `Performance check completed in ${totalTime}ms`,
      issues
    }
  } catch (error: any) {
    return {
      performance: 'poor',
      message: 'Performance check failed',
      issues: [error.message]
    }
  }
} 