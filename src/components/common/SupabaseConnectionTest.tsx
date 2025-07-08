import React, { useState, useEffect } from 'react'
import { supabase, testSupabaseConnection, initializeDemoData } from '../../lib/supabase'
import { DatabaseService } from '../../services/databaseService'
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Database } from 'lucide-react'

interface ConnectionStatus {
  status: 'loading' | 'success' | 'error' | 'warning'
  message: string
  details?: any
}

const SupabaseConnectionTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    status: 'loading',
    message: 'Initializing connection test...'
  })
  const [todos, setTodos] = useState<any[]>([])
  const [leads, setLeads] = useState<any[]>([])
  const [agents, setAgents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Test database connection and load data
  useEffect(() => {
    async function initializeAndTest() {
      try {
        setIsLoading(true)
        setConnectionStatus({ status: 'loading', message: 'Testing connection...' })

        // Test basic connection
        const connectionTest = await testSupabaseConnection()
        
        if (!connectionTest.success) {
          setConnectionStatus({
            status: 'error',
            message: connectionTest.message,
            details: connectionTest.details
          })
          return
        }

        // Initialize demo data
        await initializeDemoData()
        
        setConnectionStatus({
          status: 'success',
          message: 'Connected to Supabase successfully!',
          details: connectionTest.details
        })

        // Test fetching different types of data
        await fetchData()
        
      } catch (error) {
        console.error('Initialization error:', error)
        setConnectionStatus({
          status: 'error',
          message: `Failed to initialize: ${error.message}`,
          details: error
        })
      } finally {
        setIsLoading(false)
      }
    }

    initializeAndTest()
  }, [])

  const fetchData = async () => {
    try {
      // Test direct Supabase query
      const { data: clientData, error: clientError } = await supabase
        .from('client_profiles')
        .select('*')
        .limit(5)

      if (clientError) {
        console.warn('Client profiles query warning:', clientError)
      }

      // Test service layer
      const leadsData = await DatabaseService.leads.getAll()
      const agentsData = await DatabaseService.agents.getAll()

      setTodos(clientData || [])
      setLeads(leadsData || [])
      setAgents(agentsData || [])

      console.log('✅ Data fetching successful:')
      console.log('Clients:', clientData?.length || 0)
      console.log('Leads:', leadsData?.length || 0) 
      console.log('Agents:', agentsData?.length || 0)

    } catch (error) {
      console.error('Data fetching error:', error)
    }
  }

  const createSampleLead = async () => {
    try {
      const sampleLead = {
        name: `Test Lead ${Date.now()}`,
        phone: '+971501234567',
        email: 'test@example.com',
        status: 'new' as const,
        source: 'website',
        lead_score: 75,
        priority_level: 'medium',
        notes: 'Created via connection test'
      }

      const newLead = await DatabaseService.leads.create(sampleLead)
      console.log('✅ Created sample lead:', newLead)
      
      // Refresh leads
      await fetchData()
      
      setConnectionStatus({
        status: 'success',
        message: `Sample lead created successfully! ID: ${newLead.id}`,
        details: newLead
      })
    } catch (error) {
      console.error('❌ Sample lead creation failed:', error)
      setConnectionStatus({
        status: 'error',
        message: `Failed to create sample lead: ${error.message}`,
        details: error
      })
    }
  }

  const getStatusIcon = () => {
    switch (connectionStatus.status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'loading':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Database className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Supabase Connection Test</h2>
        </div>

        {/* Connection Status */}
        <div className="flex items-center space-x-3 p-4 rounded-lg bg-gray-50 mb-6">
          {getStatusIcon()}
          <div>
            <p className="font-medium text-gray-900">Connection Status</p>
            <p className="text-sm text-gray-600">{connectionStatus.message}</p>
          </div>
        </div>

        {/* Environment Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Environment Variables</h3>
            <div className="text-sm space-y-1">
              <div>URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</div>
              <div>Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</div>
              <div>Mode: {import.meta.env.DEV ? 'Development' : 'Production'}</div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-medium text-green-900 mb-2">Data Summary</h3>
            <div className="text-sm space-y-1">
              <div>Client Profiles: {todos.length}</div>
              <div>Leads: {leads.length}</div>
              <div>AI Agents: {agents.length}</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Refresh Data'}
          </button>
          
          <button
            onClick={createSampleLead}
            disabled={isLoading || connectionStatus.status !== 'success'}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            Create Sample Lead
          </button>
        </div>

        {/* Data Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Client Profiles */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Client Profiles ({todos.length})</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {todos.map((client, index) => (
                <div key={client.id || index} className="p-2 bg-gray-50 rounded text-sm">
                  <div className="font-medium">{client.name}</div>
                  <div className="text-gray-600">{client.email}</div>
                </div>
              ))}
              {todos.length === 0 && (
                <div className="text-gray-500 text-sm">No client profiles found</div>
              )}
            </div>
          </div>

          {/* Leads */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Leads ({leads.length})</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {leads.map((lead, index) => (
                <div key={lead.id || index} className="p-2 bg-gray-50 rounded text-sm">
                  <div className="font-medium">{lead.name}</div>
                  <div className="text-gray-600">{lead.phone}</div>
                  <div className="text-xs text-gray-500">{lead.status}</div>
                </div>
              ))}
              {leads.length === 0 && (
                <div className="text-gray-500 text-sm">No leads found</div>
              )}
            </div>
          </div>

          {/* AI Agents */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">AI Agents ({agents.length})</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {agents.map((agent, index) => (
                <div key={agent.id || index} className="p-2 bg-gray-50 rounded text-sm">
                  <div className="font-medium">{agent.name}</div>
                  <div className="text-gray-600">{agent.type}</div>
                  <div className="text-xs text-gray-500">{agent.status}</div>
                </div>
              ))}
              {agents.length === 0 && (
                <div className="text-gray-500 text-sm">No agents found</div>
              )}
            </div>
          </div>
        </div>

        {/* Connection Details */}
        {connectionStatus.details && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Connection Details</h3>
            <pre className="text-xs text-gray-700 overflow-auto">
              {JSON.stringify(connectionStatus.details, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default SupabaseConnectionTest
