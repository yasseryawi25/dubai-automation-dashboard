import React, { useState } from 'react';
import { TrendingUp, Plus, Edit, Trash2, Eye, BarChart2, AlertTriangle } from 'lucide-react';
import type { MarketingCampaign, MarketingAnalytics } from '../types';

// Sample campaigns (Dubai context, AED, bilingual names, realistic data)
const sampleCampaigns: MarketingCampaign[] = [
  {
    id: 'cmp-001',
    name: 'Marina Luxury Launch | إطلاق شقق مارينا الفاخرة',
    objective: 'property_promotion',
    status: 'active',
    startDate: '2024-07-01',
    endDate: '2024-07-31',
    budget: 25000,
    spend: 14200,
    roi: 3.2,
    leadsGenerated: 48,
    platforms: ['instagram', 'facebook', 'tiktok'],
    properties: ['Dubai Marina, Marina Walk'],
    language: 'ar_en',
    analytics: {
      impressions: 120000,
      clicks: 5400,
      engagementRate: 4.5,
      costPerLead: 295.8,
      conversions: 19,
      conversionRate: 1.6,
      platformBreakdown: {
        instagram: { impressions: 70000, clicks: 3200, engagementRate: 5.1, leads: 28, spend: 8000 },
        facebook: { impressions: 40000, clicks: 1800, engagementRate: 3.8, leads: 15, spend: 4200 },
        tiktok: { impressions: 10000, clicks: 400, engagementRate: 2.7, leads: 5, spend: 2000 }
      }
    },
    createdAt: '2024-06-25T10:00:00+04:00',
    updatedAt: '2024-07-08T09:00:00+04:00'
  },
  {
    id: 'cmp-002',
    name: 'Agent Ahmad Branding | العلامة التجارية للوكيل أحمد',
    objective: 'agent_branding',
    status: 'completed',
    startDate: '2024-06-01',
    endDate: '2024-06-30',
    budget: 12000,
    spend: 11800,
    roi: 2.1,
    leadsGenerated: 22,
    platforms: ['linkedin', 'instagram'],
    properties: [],
    language: 'ar_en',
    analytics: {
      impressions: 54000,
      clicks: 2100,
      engagementRate: 3.9,
      costPerLead: 536.4,
      conversions: 7,
      conversionRate: 0.9,
      platformBreakdown: {
        linkedin: { impressions: 20000, clicks: 800, engagementRate: 2.8, leads: 4, spend: 4000 },
        instagram: { impressions: 34000, clicks: 1300, engagementRate: 4.6, leads: 18, spend: 7800 }
      }
    },
    createdAt: '2024-05-25T09:00:00+04:00',
    updatedAt: '2024-06-30T18:00:00+04:00'
  },
  {
    id: 'cmp-003',
    name: 'Eid Al Adha Offers | عروض عيد الأضحى',
    objective: 'seasonal',
    status: 'active',
    startDate: '2024-06-15',
    endDate: '2024-07-15',
    budget: 18000,
    spend: 9500,
    roi: 2.7,
    leadsGenerated: 31,
    platforms: ['facebook', 'tiktok'],
    properties: ['Downtown Dubai', 'Business Bay'],
    language: 'ar_en',
    analytics: {
      impressions: 67000,
      clicks: 3100,
      engagementRate: 4.1,
      costPerLead: 306.5,
      conversions: 12,
      conversionRate: 1.2,
      platformBreakdown: {
        facebook: { impressions: 40000, clicks: 1800, engagementRate: 4.3, leads: 19, spend: 6000 },
        tiktok: { impressions: 27000, clicks: 1300, engagementRate: 3.8, leads: 12, spend: 3500 }
      }
    },
    createdAt: '2024-06-10T12:00:00+04:00',
    updatedAt: '2024-07-08T09:00:00+04:00'
  },
  {
    id: 'cmp-004',
    name: 'Downtown Investment Drive',
    objective: 'property_promotion',
    status: 'draft',
    startDate: '2024-07-20',
    endDate: '2024-08-20',
    budget: 30000,
    spend: 0,
    roi: 0,
    leadsGenerated: 0,
    platforms: ['instagram', 'facebook', 'linkedin'],
    properties: ['Downtown Dubai'],
    language: 'en',
    analytics: {
      impressions: 0,
      clicks: 0,
      engagementRate: 0,
      costPerLead: 0,
      conversions: 0,
      conversionRate: 0,
      platformBreakdown: {}
    },
    createdAt: '2024-07-01T10:00:00+04:00',
    updatedAt: '2024-07-08T09:00:00+04:00'
  }
];

// Helper for AED formatting
const formatAED = (amount: number) => `AED ${amount.toLocaleString()}`;

const CampaignTracker: React.FC = () => {
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(sampleCampaigns);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Overview metrics
  const activeCount = campaigns.filter(c => c.status === 'active').length;
  const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
  const avgROI = campaigns.length ? (campaigns.reduce((sum, c) => sum + c.roi, 0) / campaigns.length).toFixed(2) : '0.00';
  const totalLeads = campaigns.reduce((sum, c) => sum + c.leadsGenerated, 0);

  // Filtered campaigns
  const filteredCampaigns = filterStatus === 'all' ? campaigns : campaigns.filter(c => c.status === filterStatus);

  // Budget alert logic
  const budgetAlerts = campaigns.filter(c => c.status === 'active' && c.spend / c.budget > 0.8);

  // Simple CSS bar chart for platform breakdown
  const renderPlatformChart = (analytics: MarketingAnalytics['platformBreakdown']) => {
    const platforms = Object.keys(analytics || {});
    if (!platforms.length) return <div className="text-xs text-gray-400">No data</div>;
    const maxImpressions = Math.max(...platforms.map(p => analytics[p].impressions));
    return (
      <div className="flex items-end gap-2 h-16">
        {platforms.map(p => (
          <div key={p} className="flex flex-col items-center w-10">
            <div
              className="bg-primary-gold rounded-t"
              style={{ height: `${(analytics[p].impressions / maxImpressions) * 60 || 2}px`, minHeight: 2 }}
              title={`${p}: ${analytics[p].impressions.toLocaleString()} impressions`}
            />
            <span className="text-[10px] mt-1 capitalize">{p}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Active Campaigns</h3>
              <p className="text-2xl font-bold text-primary-gold">{activeCount}</p>
              <p className="text-xs text-green-600">Running now</p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary-gold" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Total Spend</h3>
              <p className="text-2xl font-bold text-primary-gold">{formatAED(totalSpend)}</p>
              <p className="text-xs text-blue-600">All campaigns</p>
            </div>
            <BarChart2 className="w-8 h-8 text-primary-gold" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Avg. ROI</h3>
              <p className="text-2xl font-bold text-primary-gold">{avgROI}x</p>
              <p className="text-xs text-green-600">Return on investment</p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary-gold" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Leads Generated</h3>
              <p className="text-2xl font-bold text-primary-gold">{totalLeads}</p>
              <p className="text-xs text-blue-600">All campaigns</p>
            </div>
            <Eye className="w-8 h-8 text-primary-gold" />
          </div>
        </div>
      </div>

      {/* Budget Alerts */}
      {budgetAlerts.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
            <span className="text-sm text-yellow-800 font-medium">
              Budget Alert: {budgetAlerts.map(c => c.name).join(', ')} is over 80% of budget!
            </span>
          </div>
        </div>
      )}

      {/* Campaign Table */}
      <div className="bg-white rounded-lg border mb-6">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Campaigns</h3>
          <div className="flex space-x-2">
            <select
              className="border rounded-md px-3 py-1 text-sm"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="draft">Draft</option>
            </select>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center px-3 py-1 bg-primary-gold text-white rounded text-sm hover:bg-yellow-600"
            >
              <Plus className="w-4 h-4 mr-1" />
              New Campaign
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Objective</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Budget</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Spend</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ROI</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leads</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Platforms</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCampaigns.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="font-medium text-sm">{c.name}</span>
                  </td>
                  <td className="px-4 py-3 capitalize text-xs">{c.objective.replace('_', ' ')}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      c.status === 'active' ? 'bg-green-100 text-green-800' :
                      c.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      c.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {c.startDate} - {c.endDate}
                  </td>
                  <td className="px-4 py-3 font-medium">{formatAED(c.budget)}</td>
                  <td className="px-4 py-3 font-medium">{formatAED(c.spend)}</td>
                  <td className="px-4 py-3">{c.roi}x</td>
                  <td className="px-4 py-3">{c.leadsGenerated}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {c.platforms.map(p => (
                        <span key={p} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs capitalize">{p}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-1">
                      <button className="p-1 text-gray-400 hover:text-blue-600" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-yellow-600" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Analytics Section */}
      <div className="bg-white rounded-lg border mb-6">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Performance Analytics</h3>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCampaigns.map(c => (
            <div key={c.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-sm">{c.name}</span>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  c.status === 'active' ? 'bg-green-100 text-green-800' :
                  c.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  c.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {c.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 mb-2">
                <div className="text-xs">Impressions: <span className="font-medium">{c.analytics.impressions.toLocaleString()}</span></div>
                <div className="text-xs">Clicks: <span className="font-medium">{c.analytics.clicks.toLocaleString()}</span></div>
                <div className="text-xs">Engagement: <span className="font-medium">{c.analytics.engagementRate}%</span></div>
                <div className="text-xs">Leads: <span className="font-medium">{c.leadsGenerated}</span></div>
                <div className="text-xs">Cost/Lead: <span className="font-medium">{formatAED(Math.round(c.analytics.costPerLead))}</span></div>
                <div className="text-xs">ROI: <span className="font-medium">{c.roi}x</span></div>
              </div>
              <div className="mb-2">
                <span className="text-xs font-medium">Platform Breakdown:</span>
                {renderPlatformChart(c.analytics.platformBreakdown)}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs text-gray-500">{c.startDate} - {c.endDate}</span>
                <span className="text-xs text-gray-500">Budget: {formatAED(c.budget)}</span>
                <span className="text-xs text-gray-500">Spend: {formatAED(c.spend)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campaign Creation Modal (placeholder) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              onClick={() => setShowCreateModal(false)}
              aria-label="Close"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4">Create New Campaign</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Campaign Name</label>
                <input type="text" className="w-full border rounded-md px-3 py-2" placeholder="e.g. Downtown Summer Promo" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Objective</label>
                <select className="w-full border rounded-md px-3 py-2">
                  <option value="">Select objective...</option>
                  <option value="property_promotion">Property Promotion</option>
                  <option value="agent_branding">Agent Branding</option>
                  <option value="seasonal">Seasonal</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input type="date" className="w-full border rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input type="date" className="w-full border rounded-md px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Budget (AED)</label>
                <input type="number" className="w-full border rounded-md px-3 py-2" min={0} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Platforms</label>
                <div className="flex flex-wrap gap-2">
                  {['instagram', 'facebook', 'linkedin', 'tiktok'].map(p => (
                    <label key={p} className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="capitalize text-sm">{p}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <button type="submit" className="flex-1 bg-primary-gold text-white py-2 px-4 rounded hover:bg-yellow-600">Create Campaign</button>
                <button type="button" className="px-4 py-2 border rounded hover:bg-gray-50" onClick={() => setShowCreateModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignTracker; 