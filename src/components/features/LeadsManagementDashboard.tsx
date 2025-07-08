import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MapPin, 
  DollarSign, 
  Calendar,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  RefreshCw,
  Users,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useLeads } from '../../hooks';
import type { Lead, LeadStatus } from '../../types/database';

interface LeadsManagementDashboardProps {
  className?: string;
}

const LeadsManagementDashboard: React.FC<LeadsManagementDashboardProps> = ({ className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<LeadStatus | 'all'>('all');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const { leads, loading, error, refresh, createLead, updateLead } = useLeads();

  // Filter and search logic
  const filteredLeads = useMemo(() => {
    let filtered = leads;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(lead => lead.status === filterStatus);
    }

    // Search by name, email, phone, or property interest
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(lead => 
        lead.name?.toLowerCase().includes(term) ||
        lead.email?.toLowerCase().includes(term) ||
        lead.phone?.includes(term) ||
        lead.property_type_interest?.join(', ').toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [leads, filterStatus, searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    const total = leads.length;
    const newLeads = leads.filter(l => l.status === 'new').length;
    const contacted = leads.filter(l => l.status === 'contacted').length;
    const qualified = leads.filter(l => l.status === 'qualified').length;
    const converted = leads.filter(l => l.status === 'converted').length;
    const avgBudget = leads.reduce((sum, lead) => {
      const budget = lead.budget_max || lead.budget_min || 0;
      return sum + budget;
    }, 0) / total;

    return {
      total,
      newLeads,
      contacted,
      qualified,
      converted,
      avgBudget: isNaN(avgBudget) ? 0 : avgBudget,
      conversionRate: total > 0 ? Math.round((converted / total) * 100) : 0
    };
  }, [leads]);

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'qualified':
        return 'bg-green-100 text-green-800';
      case 'converted':
        return 'bg-purple-100 text-purple-800';
      case 'lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatCurrency = (amount: string | undefined) => {
    if (!amount) return 'Not specified';
    const num = parseFloat(amount.replace(/[^\d.]/g, '') || '0');
    if (num >= 1000000) return `AED ${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `AED ${(num / 1000).toFixed(0)}K`;
    return `AED ${num.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="text-center py-8">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600 font-medium">Failed to load leads</p>
          <p className="text-gray-500 text-sm mt-1">{error}</p>
          <button
            onClick={refresh}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Leads Management</h2>
            <p className="text-sm text-gray-600">Manage and track your real estate leads in real-time</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={refresh}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Lead</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <p className="text-xs text-blue-600 font-medium">Total</p>
                <p className="text-lg font-bold text-blue-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <p className="text-xs text-yellow-600 font-medium">New</p>
                <p className="text-lg font-bold text-yellow-900">{stats.newLeads}</p>
              </div>
            </div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-orange-600 mr-2" />
              <div>
                <p className="text-xs text-orange-600 font-medium">Contacted</p>
                <p className="text-lg font-bold text-orange-900">{stats.contacted}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <p className="text-xs text-green-600 font-medium">Qualified</p>
                <p className="text-lg font-bold text-green-900">{stats.qualified}</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-purple-600 mr-2" />
              <div>
                <p className="text-xs text-purple-600 font-medium">Converted</p>
                <p className="text-lg font-bold text-purple-900">{stats.converted}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-gray-600 mr-2" />
              <div>
                <p className="text-xs text-gray-600 font-medium">Conv. Rate</p>
                <p className="text-lg font-bold text-gray-900">{stats.conversionRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search leads by name, email, phone, or property interest..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as LeadStatus | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lead Details
              </th>
              <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Info
              </th>
              <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property Interest
              </th>
              <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Budget
              </th>
              <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No leads found</p>
                  <p className="text-xs mt-1">
                    {searchTerm || filterStatus !== 'all' 
                      ? 'Try adjusting your search or filters'
                      : 'Start by adding your first lead'
                    }
                  </p>
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {lead.name?.[0] || 'L'}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {lead.name}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className={`mr-2 ${getPriorityColor(lead.priority_level)}`}>
                            ●
                          </span>
                          {lead.priority_level || 'normal'} priority
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      {lead.email && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-3 w-3 mr-1" />
                          {lead.email}
                        </div>
                      )}
                      {lead.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-3 w-3 mr-1" />
                          {lead.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">
                      {lead.property_type_interest?.join(', ') || 'Not specified'}
                    </div>
                    {lead.location_preference && (
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {lead.location_preference.join(', ')}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-medium text-gray-900">
                      {lead.budget_min && lead.budget_max ? 
                        `AED ${lead.budget_min.toLocaleString()} - ${lead.budget_max.toLocaleString()}` : 
                        'Not specified'
                      }
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(lead.created_at)}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="View Lead"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        title="Edit Lead"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete Lead"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            Showing {filteredLeads.length} of {leads.length} leads
          </div>
          <div className="flex items-center space-x-2">
            <span>Connected to Supabase</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadsManagementDashboard;