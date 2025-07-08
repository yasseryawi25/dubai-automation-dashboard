import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://supabase.yasta.online'
const SUPABASE_SERVICE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_KEY || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc1MTM4NDIyMCwiZXhwIjo0OTA3MDU3ODIwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.t3sdqJQe-IqczBtSYp8rTJnMzQ22m3M8-22av-cVfAA'

const supabaseService = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_KEY)

export interface SchemaValidationResult {
  success: boolean
  message: string
  details: {
    tables: TableValidation[]
    foreignKeys: ForeignKeyValidation[]
    rlsPolicies: RLSPolicyValidation[]
    permissions: PermissionValidation[]
    indexes: IndexValidation[]
  }
  summary: {
    totalTables: number
    validTables: number
    totalForeignKeys: number
    validForeignKeys: number
    totalRLSPolicies: number
    validRLSPolicies: number
  }
}

export interface TableValidation {
  tableName: string
  exists: boolean
  columns: ColumnValidation[]
  hasPrimaryKey: boolean
  hasTimestamps: boolean
  rowCount?: number
  issues: string[]
}

export interface ColumnValidation {
  columnName: string
  dataType: string
  isNullable: boolean
  hasDefault: boolean
  isPrimaryKey: boolean
  isForeignKey: boolean
  issues: string[]
}

export interface ForeignKeyValidation {
  tableName: string
  columnName: string
  referencedTable: string
  referencedColumn: string
  constraintName: string
  isValid: boolean
  issues: string[]
}

export interface RLSPolicyValidation {
  tableName: string
  policyName: string
  policyType: string
  roles: string[]
  command: string
  isValid: boolean
  issues: string[]
}

export interface PermissionValidation {
  tableName: string
  role: string
  permissions: {
    select: boolean
    insert: boolean
    update: boolean
    delete: boolean
  }
  issues: string[]
}

export interface IndexValidation {
  tableName: string
  indexName: string
  columns: string[]
  isUnique: boolean
  isValid: boolean
  issues: string[]
}

// Expected schema for real estate CRM
const EXPECTED_TABLES = [
  'client_profiles',
  'user_profiles',
  'leads',
  'property_listings',
  'ai_agents',
  'whatsapp_messages',
  'automation_workflows',
  'agent_tasks',
  'agent_communications',
  'agent_metrics_daily',
  'agent_errors',
  'email_campaigns',
  'analytics_events',
  'lead_followups',
  'lead_sentiments',
  'conversation_history'
]

const EXPECTED_COLUMNS = {
  client_profiles: [
    'id', 'name', 'email', 'phone', 'company_name', 'subscription_plan',
    'settings', 'created_at', 'updated_at'
  ],
  leads: [
    'id', 'client_id', 'name', 'phone', 'email', 'status', 'source',
    'notes', 'lead_score', 'assigned_agent', 'created_at', 'updated_at'
  ],
  property_listings: [
    'id', 'client_id', 'title', 'description', 'property_type', 'status',
    'listing_type', 'location', 'price', 'bedrooms', 'bathrooms',
    'area_sqft', 'is_featured', 'is_active', 'created_at', 'updated_at'
  ],
  ai_agents: [
    'id', 'client_id', 'name', 'type', 'specialty', 'status', 'avatar',
    'description', 'capabilities', 'configuration', 'is_enabled',
    'created_at', 'updated_at'
  ]
}

/**
 * Validate database schema integrity
 */
export async function validateDatabaseSchema(): Promise<SchemaValidationResult> {
  console.log('🔍 Starting database schema validation...')
  
  try {
    const tables = await validateTables()
    const foreignKeys = await validateForeignKeys()
    const rlsPolicies = await validateRLSPolicies()
    const permissions = await validatePermissions()
    const indexes = await validateIndexes()
    
    const summary = {
      totalTables: tables.length,
      validTables: tables.filter(t => t.exists && t.issues.length === 0).length,
      totalForeignKeys: foreignKeys.length,
      validForeignKeys: foreignKeys.filter(fk => fk.isValid).length,
      totalRLSPolicies: rlsPolicies.length,
      validRLSPolicies: rlsPolicies.filter(rls => rls.isValid).length
    }
    
    const hasIssues = tables.some(t => t.issues.length > 0) ||
                     foreignKeys.some(fk => !fk.isValid) ||
                     rlsPolicies.some(rls => !rls.isValid)
    
    return {
      success: !hasIssues,
      message: hasIssues ? 'Schema validation found issues' : 'Schema validation passed',
      details: {
        tables,
        foreignKeys,
        rlsPolicies,
        permissions,
        indexes
      },
      summary
    }
  } catch (error: any) {
    console.error('Schema validation error:', error)
    return {
      success: false,
      message: `Schema validation failed: ${error.message}`,
      details: {
        tables: [],
        foreignKeys: [],
        rlsPolicies: [],
        permissions: [],
        indexes: []
      },
      summary: {
        totalTables: 0,
        validTables: 0,
        totalForeignKeys: 0,
        validForeignKeys: 0,
        totalRLSPolicies: 0,
        validRLSPolicies: 0
      }
    }
  }
}

/**
 * Validate all tables exist and have correct structure
 */
async function validateTables(): Promise<TableValidation[]> {
  const validations: TableValidation[] = []
  
  for (const tableName of EXPECTED_TABLES) {
    const validation: TableValidation = {
      tableName,
      exists: false,
      columns: [],
      hasPrimaryKey: false,
      hasTimestamps: false,
      issues: []
    }
    
    try {
      // Check if table exists
      const { data: tableExists, error: tableError } = await supabaseService
        .rpc('check_table_exists', { table_name: tableName })
      
      if (tableError) {
        // Fallback: try to query the table
        const { data, error } = await supabaseService
          .from(tableName as any)
          .select('*')
          .limit(1)
        
        validation.exists = !error
        if (error) {
          validation.issues.push(`Table does not exist: ${error.message}`)
        }
      } else {
        validation.exists = tableExists
      }
      
      if (validation.exists) {
        // Get table structure
        const { data: columns, error: columnsError } = await supabaseService
          .rpc('get_table_columns', { table_name: tableName })
        
        if (!columnsError && columns) {
          validation.columns = columns.map((col: any) => ({
            columnName: col.column_name,
            dataType: col.data_type,
            isNullable: col.is_nullable === 'YES',
            hasDefault: col.column_default !== null,
            isPrimaryKey: col.column_name === 'id',
            isForeignKey: col.column_name.endsWith('_id'),
            issues: []
          }))
          
          // Check for primary key
          validation.hasPrimaryKey = validation.columns.some(col => col.isPrimaryKey)
          
          // Check for timestamps
          validation.hasTimestamps = validation.columns.some(col => 
            col.columnName === 'created_at' || col.columnName === 'updated_at'
          )
          
          // Validate expected columns
          const expectedCols = EXPECTED_COLUMNS[tableName as keyof typeof EXPECTED_COLUMNS]
          if (expectedCols) {
            for (const expectedCol of expectedCols) {
              const found = validation.columns.find(col => col.columnName === expectedCol)
              if (!found) {
                validation.issues.push(`Missing expected column: ${expectedCol}`)
              }
            }
          }
          
          // Get row count
          try {
            const { count, error: countError } = await supabaseService
              .from(tableName as any)
              .select('*', { count: 'exact', head: true })
            
            if (!countError) {
              validation.rowCount = count || 0
            }
          } catch (error) {
            // Ignore count errors
          }
        } else {
          validation.issues.push(`Could not retrieve table structure: ${columnsError?.message}`)
        }
      }
    } catch (error: any) {
      validation.issues.push(`Validation error: ${error.message}`)
    }
    
    validations.push(validation)
  }
  
  return validations
}

/**
 * Validate foreign key relationships
 */
async function validateForeignKeys(): Promise<ForeignKeyValidation[]> {
  const validations: ForeignKeyValidation[] = []
  
  try {
    // Get all foreign key constraints
    const { data: foreignKeys, error } = await supabaseService
      .rpc('get_foreign_keys')
    
    if (error) {
      console.warn('Could not retrieve foreign keys:', error)
      return validations
    }
    
    for (const fk of foreignKeys || []) {
      const validation: ForeignKeyValidation = {
        tableName: fk.table_name,
        columnName: fk.column_name,
        referencedTable: fk.referenced_table,
        referencedColumn: fk.referenced_column,
        constraintName: fk.constraint_name,
        isValid: true,
        issues: []
      }
      
      // Validate foreign key integrity
      try {
        const { data: integrityCheck, error: integrityError } = await supabaseService
          .rpc('check_foreign_key_integrity', {
            table_name: fk.table_name,
            column_name: fk.column_name,
            referenced_table: fk.referenced_table,
            referenced_column: fk.referenced_column
          })
        
        if (integrityError || !integrityCheck) {
          validation.isValid = false
          validation.issues.push(`Foreign key integrity check failed: ${integrityError?.message}`)
        }
      } catch (error: any) {
        validation.isValid = false
        validation.issues.push(`Foreign key validation error: ${error.message}`)
      }
      
      validations.push(validation)
    }
  } catch (error: any) {
    console.error('Foreign key validation error:', error)
  }
  
  return validations
}

/**
 * Validate Row Level Security policies
 */
async function validateRLSPolicies(): Promise<RLSPolicyValidation[]> {
  const validations: RLSPolicyValidation[] = []
  
  try {
    // Get RLS policies for each table
    for (const tableName of EXPECTED_TABLES) {
      const { data: policies, error } = await supabaseService
        .rpc('get_rls_policies', { table_name: tableName })
      
      if (error) {
        console.warn(`Could not retrieve RLS policies for ${tableName}:`, error)
        continue
      }
      
      for (const policy of policies || []) {
        const validation: RLSPolicyValidation = {
          tableName: policy.table_name,
          policyName: policy.policy_name,
          policyType: policy.policy_type,
          roles: policy.roles || [],
          command: policy.command,
          isValid: true,
          issues: []
        }
        
        // Validate policy syntax and logic
        try {
          const { data: policyCheck, error: policyError } = await supabaseService
            .rpc('validate_rls_policy', {
              table_name: tableName,
              policy_name: policy.policy_name
            })
          
          if (policyError || !policyCheck) {
            validation.isValid = false
            validation.issues.push(`Policy validation failed: ${policyError?.message}`)
          }
        } catch (error: any) {
          validation.isValid = false
          validation.issues.push(`Policy validation error: ${error.message}`)
        }
        
        validations.push(validation)
      }
    }
  } catch (error: any) {
    console.error('RLS policy validation error:', error)
  }
  
  return validations
}

/**
 * Validate database permissions
 */
async function validatePermissions(): Promise<PermissionValidation[]> {
  const validations: PermissionValidation[] = []
  
  try {
    const roles = ['anon', 'authenticated', 'service_role']
    
    for (const tableName of EXPECTED_TABLES) {
      for (const role of roles) {
        const validation: PermissionValidation = {
          tableName,
          role,
          permissions: {
            select: false,
            insert: false,
            update: false,
            delete: false
          },
          issues: []
        }
        
        // Test each permission
        try {
          // Test SELECT
          const { error: selectError } = await supabaseService
            .from(tableName as any)
            .select('*')
            .limit(1)
          validation.permissions.select = !selectError
          
          // Test INSERT (with minimal data)
          const { error: insertError } = await supabaseService
            .from(tableName as any)
            .insert({ id: 'test-permission-check' })
          validation.permissions.insert = !insertError
          
          // Test UPDATE
          const { error: updateError } = await supabaseService
            .from(tableName as any)
            .update({ id: 'test-permission-check-updated' })
            .eq('id', 'test-permission-check')
          validation.permissions.update = !updateError
          
          // Test DELETE
          const { error: deleteError } = await supabaseService
            .from(tableName as any)
            .delete()
            .eq('id', 'test-permission-check-updated')
          validation.permissions.delete = !deleteError
          
        } catch (error: any) {
          validation.issues.push(`Permission test error: ${error.message}`)
        }
        
        validations.push(validation)
      }
    }
  } catch (error: any) {
    console.error('Permission validation error:', error)
  }
  
  return validations
}

/**
 * Validate database indexes
 */
async function validateIndexes(): Promise<IndexValidation[]> {
  const validations: IndexValidation[] = []
  
  try {
    // Get indexes for each table
    for (const tableName of EXPECTED_TABLES) {
      const { data: indexes, error } = await supabaseService
        .rpc('get_table_indexes', { table_name: tableName })
      
      if (error) {
        console.warn(`Could not retrieve indexes for ${tableName}:`, error)
        continue
      }
      
      for (const index of indexes || []) {
        const validation: IndexValidation = {
          tableName: index.table_name,
          indexName: index.index_name,
          columns: index.columns || [],
          isUnique: index.is_unique,
          isValid: true,
          issues: []
        }
        
        // Validate index performance
        try {
          const { data: indexCheck, error: indexError } = await supabaseService
            .rpc('validate_index_performance', {
              table_name: tableName,
              index_name: index.index_name
            })
          
          if (indexError || !indexCheck) {
            validation.isValid = false
            validation.issues.push(`Index validation failed: ${indexError?.message}`)
          }
        } catch (error: any) {
          validation.isValid = false
          validation.issues.push(`Index validation error: ${error.message}`)
        }
        
        validations.push(validation)
      }
    }
  } catch (error: any) {
    console.error('Index validation error:', error)
  }
  
  return validations
}

/**
 * Generate SQL functions for validation
 */
export async function createValidationFunctions(): Promise<void> {
  const functions = [
    // Check if table exists
    `
    CREATE OR REPLACE FUNCTION check_table_exists(table_name text)
    RETURNS boolean
    LANGUAGE plpgsql
    AS $$
    BEGIN
      RETURN EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      );
    END;
    $$;
    `,
    
    // Get table columns
    `
    CREATE OR REPLACE FUNCTION get_table_columns(table_name text)
    RETURNS TABLE (
      column_name text,
      data_type text,
      is_nullable text,
      column_default text
    )
    LANGUAGE plpgsql
    AS $$
    BEGIN
      RETURN QUERY
      SELECT 
        c.column_name::text,
        c.data_type::text,
        c.is_nullable::text,
        c.column_default::text
      FROM information_schema.columns c
      WHERE c.table_schema = 'public'
      AND c.table_name = $1
      ORDER BY c.ordinal_position;
    END;
    $$;
    `,
    
    // Get foreign keys
    `
    CREATE OR REPLACE FUNCTION get_foreign_keys()
    RETURNS TABLE (
      table_name text,
      column_name text,
      referenced_table text,
      referenced_column text,
      constraint_name text
    )
    LANGUAGE plpgsql
    AS $$
    BEGIN
      RETURN QUERY
      SELECT 
        tc.table_name::text,
        kcu.column_name::text,
        ccu.table_name::text as referenced_table,
        ccu.column_name::text as referenced_column,
        tc.constraint_name::text
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = 'public';
    END;
    $$;
    `,
    
    // Get RLS policies
    `
    CREATE OR REPLACE FUNCTION get_rls_policies(table_name text)
    RETURNS TABLE (
      table_name text,
      policy_name text,
      policy_type text,
      roles text[],
      command text
    )
    LANGUAGE plpgsql
    AS $$
    BEGIN
      RETURN QUERY
      SELECT 
        schemaname::text,
        tablename::text,
        policyname::text,
        roles::text[],
        cmd::text
      FROM pg_policies
      WHERE schemaname = 'public'
      AND tablename = $1;
    END;
    $$;
    `,
    
    // Get table indexes
    `
    CREATE OR REPLACE FUNCTION get_table_indexes(table_name text)
    RETURNS TABLE (
      table_name text,
      index_name text,
      columns text[],
      is_unique boolean
    )
    LANGUAGE plpgsql
    AS $$
    BEGIN
      RETURN QUERY
      SELECT 
        t.relname::text,
        i.relname::text,
        array_agg(a.attname ORDER BY array_position(ix.indkey, a.attnum))::text[],
        ix.indisunique
      FROM pg_class t
      JOIN pg_index ix ON t.oid = ix.indrelid
      JOIN pg_class i ON ix.indexrelid = i.oid
      JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(ix.indkey)
      WHERE t.relname = $1
      AND t.relkind = 'r'
      GROUP BY t.relname, i.relname, ix.indisunique;
    END;
    $$;
    `
  ]
  
  for (const func of functions) {
    try {
      const { error } = await supabaseService.rpc('exec_sql', { sql: func })
      if (error) {
        console.warn('Failed to create validation function:', error)
      }
    } catch (error) {
      console.warn('Error creating validation function:', error)
    }
  }
}

/**
 * Quick schema validation for dashboard
 */
export async function quickSchemaValidation(): Promise<{
  valid: boolean
  message: string
  issues: string[]
}> {
  try {
    const result = await validateDatabaseSchema()
    
    if (result.success) {
      return {
        valid: true,
        message: 'Database schema is valid',
        issues: []
      }
    }
    
    const issues: string[] = []
    
    // Collect issues from table validations
    result.details.tables.forEach(table => {
      if (!table.exists) {
        issues.push(`Missing table: ${table.tableName}`)
      } else if (table.issues.length > 0) {
        issues.push(...table.issues.map(issue => `${table.tableName}: ${issue}`))
      }
    })
    
    // Collect issues from foreign key validations
    result.details.foreignKeys.forEach(fk => {
      if (!fk.isValid) {
        issues.push(`Invalid foreign key: ${fk.tableName}.${fk.columnName}`)
      }
    })
    
    return {
      valid: false,
      message: `Schema validation found ${issues.length} issues`,
      issues
    }
  } catch (error: any) {
    return {
      valid: false,
      message: 'Schema validation failed',
      issues: [error.message]
    }
  }
} 