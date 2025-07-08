import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Plus, 
  MessageSquare, 
  Phone, 
  Mail, 
  MapPin, 
  Home, 
  DollarSign,
  Calendar,
  User,
  Star,
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Eye,
  Edit,
  ExternalLink
} from 'lucide-react'
import EnhancedAPIService from '../../services/enhancedAPI'

interface LeadWithMessages {
  id: string
  name: string
  phone?: string
  email?: string
  source: string
  status: string
  priority: string
  budget_min?: number
  budget_max?: number
  property_type?: string
  location_preference?: string
  bedrooms?: number
  notes?: string
  assigned_agent?: string
  lead_score: number
  last_contact_date?: string
  next_follow_up?: string
  conversion_probability?: number
  tags?: string[]
  created_at: string
  updated_at: string
  recentMessages: any[]
  messageCount: number
}

const EnhancedLeadsManagement: React.FC = () => {
  const [leads, setLeads] = useState<LeadWithMessages[]>([])
  const [filteredLeads, setFilteredLeads] = useState<LeadWithMessages[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedLead, setSelectedLead] = useState<LeadWithMessages | null>(null)

  useEffect(() => {
    loadLeads()
    
    // Set up real-time updates
    const unsubscribe = EnhancedAPIService.subscribeToRealTimeUpdates((change) => {
      if (change.table === 'leads' || change.table === 'whatsapp_messages') {
        loadLeads()
      }
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    applyFilters()
  }, [leads, searchTerm, statusFilter, priorityFilter, sourceFilter, sortBy, sortOrder])

  const loadLeads = async () => {
    try {
      setLoading(true)
      const leadsData = await EnhancedAPIService.getLeadsWithDetails()
      setLeads(leadsData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leads')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...leads]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone?.includes(searchTerm) ||
        lead.location_preference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.property_type?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter)
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(lead => lead.priority === priorityFilter)
    }

    // Apply source filter
    if (sourceFilter !== 'all') {
      filtered = filtered.filter(lead => lead.source === sourceFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof LeadWithMessages]
      let bValue: any = b[sortBy as keyof LeadWithMessages]

      if (sortBy === 'created_at' || sortBy === 'updated_at') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    setFilteredLeads(filtered)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'converted': return 'bg-green-100 text-green-800'
      case 'qualified': return 'bg-blue-100 text-blue-800'
      case 'viewing_scheduled': return 'bg-purple-100 text-purple-800'
      case 'offer_made': return 'bg-orange-100 text-orange-800'
      case 'contacted': return 'bg-indigo-100 text-indigo-800'
      case 'new': return 'bg-yellow-100 text-yellow-800'
      case 'lost': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'whatsapp': return <MessageSquare className="h-4 w-4 text-green-500" />
      case 'phone': return <Phone className="h-4 w-4 text-blue-500" />
      case 'email': return <Mail className="h-4 w-4 text-purple-500" />
      case 'website': return <ExternalLink className="h-4 w-4 text-indigo-500" />
      case 'referral': return <User className="h-4 w-4 text-pink-500" />
      case 'social_media': return <Star className="h-4 w-4 text-orange-500" />
      default: return <Target className="h-4 w-4 text-gray-500" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leads from database...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
          <h3 className="text-lg font-medium text-red-800">Error Loading Leads</h3>
        </div>
        <p className="text-red-700 mt-2">{error}</p>
        <button 
          onClick={loadLeads}
          className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  const statusOptions = ['all', 'new', 'contacted', 'qualified', 'viewing_scheduled', 'offer_made', 'converted', 'lost']
  const priorityOptions = ['all', 'low', 'medium', 'high', 'urgent']
  const sourceOptions = ['all', 'whatsapp', 'website', 'phone', 'email', 'referral', 'social_media', 'walk_in']

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">Leads Management</h1>
            <p className="text-blue-100">Real-time lead data from Supabase database</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{leads.length}</div>
            <div className="text-blue-100">Total Leads</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-lg font-semibold">{leads.filter(l => l.status === 'new').length}</div>
            <div className="text-blue-100 text-sm">New Leads</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-lg font-semibold">{leads.filter(l => l.status === 'qualified').length}</div>
            <div className="text-blue-100 text-sm">Qualified</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-lg font-semibold">{leads.filter(l => l.status === 'converted').length}</div>
            <div className="text-blue-100 text-sm">Converted</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-lg font-semibold">
              {leads.filter(l => l.priority === 'high' || l.priority === 'urgent').length}
            </div>
            <div className="text-blue-100 text-sm">High Priority</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {priorityOptions.map(priority => (
                <option key={priority} value={priority}>
                  {priority === 'all' ? 'All Priority' : priority.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Source Filter */}
          <div>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {sourceOptions.map(source => (
                <option key={source} value={source}>
                  {source === 'all' ? 'All Sources' : source.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={`${sortBy}_${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('_')
                setSortBy(field)
                setSortOrder(order as 'asc' | 'desc')
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="created_at_desc">Newest First</option>
              <option value="created_at_asc">Oldest First</option>
              <option value="lead_score_desc">Highest Score</option>
              <option value="lead_score_asc">Lowest Score</option>
              <option value="name_asc">Name A-Z</option>
              <option value="name_desc">Name Z-A</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Showing {filteredLeads.length} of {leads.length} leads
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead Information
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact & Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property Interest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status & Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium text-lg">
                          {lead.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(lead.priority)} mr-2`}>
                            {lead.priority}
                          </span>
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(lead.created_at).toLocaleDateString()}
                        </div>
                        {lead.assigned_agent && (
                          <div className="text-xs text-blue-600 mt-1">
                            Agent: {lead.assigned_agent}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="space-y-1">
                      {lead.phone && (
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-2 text-gray-400" />
                          {lead.phone}
                        </div>
                      )}
                      {lead.email && (
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-2 text-gray-400" />
                          {lead.email}
                        </div>
                      )}
                      <div className="flex items-center">
                        {getSourceIcon(lead.source)}
                        <span className="ml-1 text-xs text-gray-500">
                          {lead.source.replace('_', ' ')}
                        </span>
                      </div>
                      {lead.messageCount > 0 && (
                        <div className="flex items-center">
                          <MessageSquare className="h-3 w-3 mr-1 text-green-500" />
                          <span className="text-xs text-green-600">
                            {lead.messageCount} messages
                          </span>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      {lead.property_type && (
                        <div className="flex items-center">
                          <Home className="h-3 w-3 mr-1 text-gray-400" />
                          <span className="capitalize">{lead.property_type}</span>
                        </div>
                      )}
                      {lead.location_preference && (
                        <div className="flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                          <span className="text-gray-600">{lead.location_preference}</span>
                        </div>
                      )}
                      {lead.bedrooms && (
                        <div className="text-xs text-gray-500 mt-1">
                          {lead.bedrooms} bedrooms
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lead.budget_min && lead.budget_max ? (
                      <div>
                        <div className="flex items-center">
                          <DollarSign className="h-3 w-3 mr-1 text-gray-400" />
                          <span>{formatCurrency(lead.budget_min)}</span>
                        </div>
                        <div className="text-gray-500 text-xs">
                          to {formatCurrency(lead.budget_max)}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">Not specified</span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                        {lead.status.replace('_', ' ')}
                      </span>
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${getScoreBarColor(lead.lead_score)}`}
                            style={{ width: `${Math.min(lead.lead_score, 100)}%` }}
                          ></div>
                        </div>
                        <span className={`font-medium text-sm ${getScoreColor(lead.lead_score)}`}>
                          {lead.lead_score}
                        </span>
                      </div>
                      {lead.conversion_probability && (
                        <div className="text-xs text-gray-500">
                          {lead.conversion_probability.toFixed(1)}% conversion prob.
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-900 p-1 rounded"
                        title="Contact"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                      <button
                        className="text-purple-600 hover:text-purple-900 p-1 rounded"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLeads.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || sourceFilter !== 'all' 
                ? 'No leads match your current filters' 
                : 'No leads found in database'
              }
            </div>
          </div>
        )}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold flex items-center">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium mr-3">
                  {selectedLead.name.charAt(0)}
                </div>
                {selectedLead.name}
              </h2>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Lead Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    {selectedLead.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{selectedLead.phone}</span>
                      </div>
                    )}
                    {selectedLead.email && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{selectedLead.email}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      {getSourceIcon(selectedLead.source)}
                      <span className="ml-2 capitalize">{selectedLead.source.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Property Requirements</h3>
                  <div className="space-y-2">
                    {selectedLead.property_type && (
                      <div className="flex items-center">
                        <Home className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="capitalize">{selectedLead.property_type}</span>
                      </div>
                    )}
                    {selectedLead.location_preference && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{selectedLead.location_preference}</span>
                      </div>
                    )}
                    {selectedLead.budget_min && selectedLead.budget_max && (
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{formatCurrency(selectedLead.budget_min)} - {formatCurrency(selectedLead.budget_max)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status and Score */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Status</div>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedLead.status)}`}>
                    {selectedLead.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Lead Score</div>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-3 mr-3">
                      <div 
                        className={`h-3 rounded-full ${getScoreBarColor(selectedLead.lead_score)}`}
                        style={{ width: `${Math.min(selectedLead.lead_score, 100)}%` }}
                      ></div>
                    </div>
                    <span className={`font-bold ${getScoreColor(selectedLead.lead_score)}`}>
                      {selectedLead.lead_score}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Priority</div>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(selectedLead.priority)}`}>
                    {selectedLead.priority}
                  </span>
                </div>
              </div>

              {/* Recent Messages */}
              {selectedLead.recentMessages.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Recent Messages</h3>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {selectedLead.recentMessages.map((message, index) => (
                      <div key={index} className={`p-3 rounded-lg ${
                        message.direction === 'inbound' ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-green-50 border-l-4 border-green-500'
                      }`}>
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-medium">
                            {message.direction === 'inbound' ? 'Incoming' : 'Outgoing'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(message.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{message.message_content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {selectedLead.tags && selectedLead.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedLead.tags.map((tag, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedLead.notes && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Notes</h3>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-3">{selectedLead.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EnhancedLeadsManagement