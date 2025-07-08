import type { HealthCheckResult } from './supabaseHealthCheck'

export interface TroubleshootingStep {
  id: string
  title: string
  description: string
  steps: string[]
  codeExample?: string
  expectedResult?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export interface TroubleshootingGuide {
  issue: string
  symptoms: string[]
  causes: string[]
  solutions: TroubleshootingStep[]
  prevention: string[]
}

/**
 * Generate troubleshooting guide based on health check results
 */
export function generateTroubleshootingGuide(healthCheck: HealthCheckResult): TroubleshootingGuide[] {
  const guides: TroubleshootingGuide[] = []
  
  // Check for connectivity issues
  if (healthCheck.checks.connectivity?.status === 'fail') {
    guides.push(createConnectivityGuide(healthCheck.checks.connectivity))
  }
  
  // Check for authentication issues
  if (healthCheck.checks.authentication?.status === 'fail') {
    guides.push(createAuthenticationGuide(healthCheck.checks.authentication))
  }
  
  // Check for database table issues
  if (healthCheck.checks.databaseTables?.status === 'fail') {
    guides.push(createDatabaseTablesGuide(healthCheck.checks.databaseTables))
  }
  
  // Check for API endpoint issues
  if (healthCheck.checks.apiEndpoints?.status === 'fail') {
    guides.push(createAPIEndpointsGuide(healthCheck.checks.apiEndpoints))
  }
  
  // Check for CORS issues
  if (healthCheck.checks.cors?.status === 'fail') {
    guides.push(createCORSGuide(healthCheck.checks.cors))
  }
  
  // Check for SSL issues
  if (healthCheck.checks.ssl?.status === 'fail') {
    guides.push(createSSLGuide(healthCheck.checks.ssl))
  }
  
  // Check for real-time issues
  if (healthCheck.checks.realtime?.status === 'fail') {
    guides.push(createRealtimeGuide(healthCheck.checks.realtime))
  }
  
  return guides
}

function createConnectivityGuide(check: any): TroubleshootingGuide {
  return {
    issue: 'Database Connectivity Failure',
    symptoms: [
      'Cannot connect to Supabase instance',
      'Network timeout errors',
      'Connection refused errors',
      'Dashboard shows "Connection Error"'
    ],
    causes: [
      'Incorrect Supabase URL',
      'Network connectivity issues',
      'Firewall blocking connections',
      'DNS resolution problems',
      'Supabase instance is down'
    ],
    solutions: [
      {
        id: 'verify-url',
        title: 'Verify Supabase URL Configuration',
        description: 'Check if the Supabase URL is correctly configured in your environment variables.',
        steps: [
          'Open your .env file or environment configuration',
          'Verify VITE_SUPABASE_URL is set to: https://supabase.yasta.online',
          'Ensure there are no trailing slashes or typos',
          'Check that the URL is accessible in your browser'
        ],
        codeExample: `// .env file
VITE_SUPABASE_URL=https://supabase.yasta.online
VITE_SUPABASE_ANON_KEY=your_anon_key_here`,
        expectedResult: 'URL should be accessible and return a valid response',
        severity: 'high'
      },
      {
        id: 'test-network',
        title: 'Test Network Connectivity',
        description: 'Verify that your application can reach the Supabase instance.',
        steps: [
          'Open browser developer tools (F12)',
          'Go to Network tab',
          'Try to access https://supabase.yasta.online',
          'Check for any CORS or network errors',
          'Verify DNS resolution using nslookup or ping'
        ],
        codeExample: `// Test in browser console
fetch('https://supabase.yasta.online/rest/v1/client_profiles', {
  headers: {
    'apikey': 'your_anon_key',
    'Authorization': 'Bearer your_anon_key'
  }
}).then(r => console.log(r.status))`,
        expectedResult: 'Should return HTTP 200 or 401 (not 404 or connection errors)',
        severity: 'medium'
      },
      {
        id: 'check-firewall',
        title: 'Check Firewall and Network Settings',
        description: 'Ensure your network allows outbound HTTPS connections.',
        steps: [
          'Check if your firewall blocks outbound HTTPS (port 443)',
          'Verify corporate proxy settings if applicable',
          'Test with a different network (mobile hotspot)',
          'Check if VPN is interfering with connections'
        ],
        severity: 'medium'
      }
    ],
    prevention: [
      'Use environment variables for configuration',
      'Implement connection retry logic',
      'Monitor Supabase status page',
      'Set up health checks in your application'
    ]
  }
}

function createAuthenticationGuide(check: any): TroubleshootingGuide {
  return {
    issue: 'Authentication Failure',
    symptoms: [
      'Invalid API key errors',
      'Authentication failed messages',
      'JWT token errors',
      'Unauthorized access errors'
    ],
    causes: [
      'Invalid or expired API keys',
      'Wrong key type (anon vs service)',
      'JWT token expiration',
      'Incorrect key format',
      'RLS policies blocking access'
    ],
    solutions: [
      {
        id: 'verify-keys',
        title: 'Verify API Keys',
        description: 'Ensure you are using the correct API keys for your Supabase instance.',
        steps: [
          'Check your .env file for correct keys',
          'Verify VITE_SUPABASE_ANON_KEY is set correctly',
          'Ensure VITE_SUPABASE_SERVICE_KEY is available for admin operations',
          'Test keys in Supabase dashboard'
        ],
        codeExample: `// Current keys from your setup
VITE_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc1MTM4NDIyMCwiZXhwIjo0OTA3MDU3ODIwLCJyb2xlIjoiYW5vbiJ9.1qnOwvVZNzuXRwvRdsWHHMoSTuIUSKGX3yIjFBmaDXc
VITE_SUPABASE_SERVICE_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc1MTM4NDIyMCwiZXhwIjo0OTA3MDU3ODIwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.t3sdqJQe-IqczBtSYp8rTJnMzQ22m3M8-22av-cVfAA`,
        expectedResult: 'Keys should be valid JWT tokens',
        severity: 'critical'
      },
      {
        id: 'test-auth',
        title: 'Test Authentication Flow',
        description: 'Verify that authentication is working with both anon and service keys.',
        steps: [
          'Test anon key with basic query',
          'Test service key with admin operations',
          'Check JWT token expiration',
          'Verify user authentication flow'
        ],
        codeExample: `// Test authentication
const { data, error } = await supabase.auth.getUser()
if (error) {
  console.error('Auth error:', error)
} else {
  console.log('User:', data.user)
}`,
        expectedResult: 'Should return user data or valid error message',
        severity: 'high'
      }
    ],
    prevention: [
      'Rotate API keys regularly',
      'Use environment variables for key storage',
      'Implement proper error handling',
      'Monitor authentication logs'
    ]
  }
}

function createDatabaseTablesGuide(check: any): TroubleshootingGuide {
  return {
    issue: 'Database Tables Access Issues',
    symptoms: [
      'Table not found errors',
      'Permission denied errors',
      'RLS policy violations',
      'Missing tables in schema'
    ],
    causes: [
      'Tables not created in database',
      'Insufficient database permissions',
      'RLS policies blocking access',
      'Schema migration issues',
      'Wrong database schema'
    ],
    solutions: [
      {
        id: 'verify-schema',
        title: 'Verify Database Schema',
        description: 'Check if all required tables exist in your database.',
        steps: [
          'Connect to Supabase dashboard',
          'Go to Table Editor',
          'Verify all critical tables exist:',
          '  - client_profiles',
          '  - leads',
          '  - property_listings',
          '  - ai_agents',
          '  - whatsapp_messages',
          '  - automation_workflows',
          '  - user_profiles',
          '  - agent_tasks',
          '  - email_campaigns',
          '  - analytics_events'
        ],
        codeExample: `-- SQL to check tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'client_profiles', 'leads', 'property_listings', 
  'ai_agents', 'whatsapp_messages', 'automation_workflows'
);`,
        expectedResult: 'All critical tables should exist',
        severity: 'critical'
      },
      {
        id: 'check-permissions',
        title: 'Check Database Permissions',
        description: 'Verify that your database user has proper permissions.',
        steps: [
          'Check RLS policies on tables',
          'Verify anon and authenticated roles',
          'Test with service role key',
          'Check table-level permissions'
        ],
        codeExample: `-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public';`,
        expectedResult: 'RLS policies should allow appropriate access',
        severity: 'high'
      },
      {
        id: 'create-missing-tables',
        title: 'Create Missing Tables',
        description: 'Create any missing tables using the provided schema.',
        steps: [
          'Run the database setup script',
          'Execute schema migrations',
          'Verify table creation',
          'Test table access'
        ],
        codeExample: `-- Example table creation
CREATE TABLE IF NOT EXISTS client_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  -- ... other columns
);`,
        expectedResult: 'All tables should be created successfully',
        severity: 'high'
      }
    ],
    prevention: [
      'Use database migrations',
      'Implement schema validation',
      'Test with different user roles',
      'Monitor database access logs'
    ]
  }
}

function createAPIEndpointsGuide(check: any): TroubleshootingGuide {
  return {
    issue: 'API Endpoints Not Accessible',
    symptoms: [
      '404 Not Found errors',
      'API endpoint timeouts',
      'Method not allowed errors',
      'PostgREST errors'
    ],
    causes: [
      'Incorrect API URL structure',
      'PostgREST service not running',
      'Kong gateway issues',
      'Table permissions problems',
      'CORS configuration issues'
    ],
    solutions: [
      {
        id: 'verify-endpoints',
        title: 'Verify API Endpoint URLs',
        description: 'Check that API endpoints are correctly structured.',
        steps: [
          'Verify base URL: https://supabase.yasta.online',
          'Check endpoint paths: /rest/v1/table_name',
          'Test with curl or Postman',
          'Verify HTTP methods (GET, POST, etc.)'
        ],
        codeExample: `// Test endpoints
const endpoints = [
  '/rest/v1/client_profiles',
  '/rest/v1/leads',
  '/rest/v1/property_listings'
];

for (const endpoint of endpoints) {
  const response = await fetch(\`https://supabase.yasta.online\${endpoint}\`, {
    headers: {
      'apikey': 'your_anon_key',
      'Authorization': 'Bearer your_anon_key'
    }
  });
  console.log(\`\${endpoint}: \${response.status}\`);
}`,
        expectedResult: 'Endpoints should return 200 or 401 status codes',
        severity: 'high'
      },
      {
        id: 'check-postgrest',
        title: 'Check PostgREST Service',
        description: 'Verify that PostgREST is running and accessible.',
        steps: [
          'Check Supabase service status',
          'Verify PostgREST configuration',
          'Check database connection',
          'Review service logs'
        ],
        severity: 'critical'
      }
    ],
    prevention: [
      'Monitor API endpoint health',
      'Implement proper error handling',
      'Use API versioning',
      'Set up endpoint monitoring'
    ]
  }
}

function createCORSGuide(check: any): TroubleshootingGuide {
  return {
    issue: 'CORS Configuration Problems',
    symptoms: [
      'CORS policy errors in browser',
      'Cross-origin request blocked',
      'Preflight request failures',
      'Origin not allowed errors'
    ],
    causes: [
      'Missing CORS headers',
      'Incorrect origin configuration',
      'Preflight request handling issues',
      'Proxy configuration problems'
    ],
    solutions: [
      {
        id: 'configure-cors',
        title: 'Configure CORS Headers',
        description: 'Set up proper CORS configuration for your Supabase instance.',
        steps: [
          'Access Supabase dashboard',
          'Go to Settings > API',
          'Configure allowed origins',
          'Add your frontend domain',
          'Test CORS preflight requests'
        ],
        codeExample: `// CORS configuration in Supabase
// Add to your allowed origins:
// - http://localhost:3000 (development)
// - https://yourdomain.com (production)
// - https://yourdomain.com:3000 (if needed)`,
        expectedResult: 'CORS preflight requests should succeed',
        severity: 'high'
      },
      {
        id: 'test-cors',
        title: 'Test CORS Configuration',
        description: 'Verify CORS is working from your frontend.',
        steps: [
          'Open browser developer tools',
          'Check Network tab for CORS errors',
          'Test with different origins',
          'Verify preflight requests'
        ],
        codeExample: `// Test CORS in browser console
fetch('https://supabase.yasta.online/rest/v1/client_profiles', {
  method: 'GET',
  headers: {
    'apikey': 'your_anon_key',
    'Authorization': 'Bearer your_anon_key'
  }
}).then(r => console.log('CORS test:', r.status))`,
        expectedResult: 'No CORS errors in browser console',
        severity: 'medium'
      }
    ],
    prevention: [
      'Configure CORS properly in production',
      'Use environment-specific origins',
      'Monitor CORS errors',
      'Test from different domains'
    ]
  }
}

function createSSLGuide(check: any): TroubleshootingGuide {
  return {
    issue: 'SSL/TLS Certificate Problems',
    symptoms: [
      'SSL certificate errors',
      'HTTPS connection failures',
      'Certificate expired warnings',
      'Untrusted certificate errors'
    ],
    causes: [
      'Expired SSL certificate',
      'Self-signed certificate',
      'Certificate chain issues',
      'DNS configuration problems',
      'Certificate not matching domain'
    ],
    solutions: [
      {
        id: 'verify-certificate',
        title: 'Verify SSL Certificate',
        description: 'Check the SSL certificate status and validity.',
        steps: [
          'Visit https://supabase.yasta.online in browser',
          'Check certificate details (click lock icon)',
          'Verify certificate expiration date',
          'Check certificate issuer',
          'Verify domain name matches'
        ],
        expectedResult: 'Certificate should be valid and not expired',
        severity: 'critical'
      },
      {
        id: 'check-dns',
        title: 'Check DNS Configuration',
        description: 'Verify DNS is properly configured for SSL.',
        steps: [
          'Check DNS A record for supabase.yasta.online',
          'Verify CNAME records if applicable',
          'Test DNS resolution',
          'Check for DNS propagation issues'
        ],
        severity: 'medium'
      }
    ],
    prevention: [
      'Monitor certificate expiration',
      'Set up certificate renewal automation',
      'Use proper DNS configuration',
      'Implement certificate monitoring'
    ]
  }
}

function createRealtimeGuide(check: any): TroubleshootingGuide {
  return {
    issue: 'Real-time Subscription Issues',
    symptoms: [
      'Real-time events not received',
      'WebSocket connection failures',
      'Subscription timeout errors',
      'Real-time data not updating'
    ],
    causes: [
      'WebSocket connection issues',
      'RLS policies blocking real-time',
      'Network connectivity problems',
      'Subscription configuration errors',
      'Database triggers not set up'
    ],
    solutions: [
      {
        id: 'test-websocket',
        title: 'Test WebSocket Connection',
        description: 'Verify WebSocket connectivity to Supabase.',
        steps: [
          'Check WebSocket endpoint accessibility',
          'Test real-time subscription',
          'Verify RLS policies for real-time',
          'Check network connectivity'
        ],
        codeExample: `// Test real-time subscription
const channel = supabase
  .channel('test')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'leads' },
    (payload) => console.log('Real-time event:', payload)
  )
  .subscribe((status) => {
    console.log('Subscription status:', status)
  })`,
        expectedResult: 'Should receive subscription status and events',
        severity: 'medium'
      },
      {
        id: 'check-rls-realtime',
        title: 'Check RLS for Real-time',
        description: 'Ensure RLS policies allow real-time subscriptions.',
        steps: [
          'Verify RLS policies on tables',
          'Check if policies block real-time',
          'Test with different user roles',
          'Review real-time configuration'
        ],
        severity: 'high'
      }
    ],
    prevention: [
      'Monitor WebSocket connections',
      'Implement connection retry logic',
      'Test real-time in different environments',
      'Set up real-time health monitoring'
    ]
  }
}

/**
 * Get common troubleshooting steps for any issue
 */
export function getCommonTroubleshootingSteps(): TroubleshootingStep[] {
  return [
    {
      id: 'check-env-vars',
      title: 'Verify Environment Variables',
      description: 'Ensure all required environment variables are properly set.',
      steps: [
        'Check .env file exists and is loaded',
        'Verify VITE_SUPABASE_URL is correct',
        'Verify VITE_SUPABASE_ANON_KEY is valid',
        'Ensure VITE_SUPABASE_SERVICE_KEY is available',
        'Restart development server after changes'
      ],
      codeExample: `// .env file should contain:
VITE_SUPABASE_URL=https://supabase.yasta.online
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_SUPABASE_SERVICE_KEY=your_service_key_here`,
      severity: 'high'
    },
    {
      id: 'check-console',
      title: 'Check Browser Console',
      description: 'Look for error messages in browser developer tools.',
      steps: [
        'Open browser developer tools (F12)',
        'Go to Console tab',
        'Look for Supabase-related errors',
        'Check Network tab for failed requests',
        'Note any CORS or authentication errors'
      ],
      severity: 'medium'
    },
    {
      id: 'test-simple-query',
      title: 'Test Simple Database Query',
      description: 'Try a basic query to isolate the issue.',
      steps: [
        'Open browser console',
        'Import Supabase client',
        'Try a simple SELECT query',
        'Check for specific error messages',
        'Verify table exists and is accessible'
      ],
      codeExample: `// Test in browser console
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://supabase.yasta.online',
  'your_anon_key'
)

const { data, error } = await supabase
  .from('client_profiles')
  .select('*')
  .limit(1)

console.log('Data:', data)
console.log('Error:', error)`,
      severity: 'medium'
    }
  ]
} 