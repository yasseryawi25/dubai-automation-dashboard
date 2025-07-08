import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, AlertCircle, RefreshCw, Settings, Zap } from 'lucide-react';
import type { DataSource } from '../types';

const sampleDataSources: DataSource[] = [
  {
    id: 'crm-hubspot',
    name: 'HubSpot CRM',
    type: 'crm',
    status: 'connected',
    lastSync: '2024-07-08T09:15:00+04:00',
    recordCount: 1247,
    syncFrequency: 'real_time',
    healthScore: 98,
    integrationDetails: {
      provider: 'HubSpot',
      apiVersion: 'v3',
      endpoint: 'api.hubapi.com'
    }
  },
  {
    id: 'portal-bayut',
    name: 'Bayut Property Portal',
    type: 'property_portal',
    status: 'connected',
    lastSync: '2024-07-08T08:30:00+04:00',
    recordCount: 3456,
    syncFrequency: 'hourly',
    healthScore: 92,
    integrationDetails: {
      provider: 'Bayut',
      apiVersion: 'v2',
      endpoint: 'api.bayut.com'
    }
  },
  {
    id: 'portal-pf',
    name: 'Property Finder',
    type: 'property_portal',
    status: 'syncing',
    lastSync: '2024-07-08T07:45:00+04:00',
    recordCount: 2891,
    syncFrequency: 'hourly',
    healthScore: 88,
    integrationDetails: {
      provider: 'Property Finder',
      apiVersion: 'v1',
      endpoint: 'api.propertyfinder.ae'
    }
  },
  {
    id: 'whatsapp-business',
    name: 'WhatsApp Business API',
    type: 'whatsapp',
    status: 'connected',
    lastSync: '2024-07-08T09:30:00+04:00',
    recordCount: 8234,
    syncFrequency: 'real_time',
    healthScore: 96,
    integrationDetails: {
      provider: 'Meta',
      apiVersion: 'v18',
      endpoint: 'graph.facebook.com'
    }
  },
  {
    id: 'email-gmail',
    name: 'Gmail Integration',
    type: 'email',
    status: 'error',
    lastSync: '2024-07-08T06:20:00+04:00',
    errorMessage: 'OAuth token expired, requires re-authentication',
    recordCount: 5678,
    syncFrequency: 'real_time',
    healthScore: 45,
    integrationDetails: {
      provider: 'Google',
      apiVersion: 'v1',
      endpoint: 'gmail.googleapis.com'
    }
  },
  {
    id: 'social-instagram',
    name: 'Instagram Business',
    type: 'social_media',
    status: 'connected',
    lastSync: '2024-07-08T09:00:00+04:00',
    recordCount: 1456,
    syncFrequency: 'daily',
    healthScore: 85,
    integrationDetails: {
      provider: 'Meta',
      apiVersion: 'v18',
      endpoint: 'graph.facebook.com'
    }
  },
  {
    id: 'calendar-google',
    name: 'Google Calendar',
    type: 'calendar',
    status: 'connected',
    lastSync: '2024-07-08T09:25:00+04:00',
    recordCount: 342,
    syncFrequency: 'real_time',
    healthScore: 94,
    integrationDetails: {
      provider: 'Google',
      apiVersion: 'v3',
      endpoint: 'calendar.googleapis.com'
    }
  },
  {
    id: 'financial-quickbooks',
    name: 'QuickBooks Online',
    type: 'financial',
    status: 'disconnected',
    lastSync: '2024-07-07T18:00:00+04:00',
    recordCount: 234,
    syncFrequency: 'daily',
    healthScore: 0,
    integrationDetails: {
      provider: 'Intuit',
      apiVersion: 'v3',
      endpoint: 'sandbox-quickbooks.api.intuit.com'
    }
  }
];

const statusConfig = {
  connected: {
    icon: <CheckCircle className="w-5 h-5" />,
    color: 'text-green-600 bg-green-100',
    bgColor: 'bg-green-50 border-green-200'
  },
  syncing: {
    icon: <RefreshCw className="w-5 h-5 animate-spin" />,
    color: 'text-blue-600 bg-blue-100',
    bgColor: 'bg-blue-50 border-blue-200'
  },
  error: {
    icon: <AlertCircle className="w-5 h-5" />,
    color: 'text-red-600 bg-red-100',
    bgColor: 'bg-red-50 border-red-200'
  },
  disconnected: {
    icon: <Database className="w-5 h-5" />,
    color: 'text-gray-600 bg-gray-100',
    bgColor: 'bg-gray-50 border-gray-200'
  }
};

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleString('en-GB', { hour12: false, month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const DataSourcesPanel: React.FC = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setDataSources(sampleDataSources);
      setLoading(false);
    }, 600);
  }, []);

  // Overview metrics
  const crmCount = dataSources.filter(ds => ds.type === 'crm').length;
  const portalCount = dataSources.filter(ds => ds.type === 'property_portal').length;
  const commCount = dataSources.filter(ds => ['whatsapp','email','social_media'].includes(ds.type)).length;
  const commErrors = dataSources.filter(ds => ['whatsapp','email','social_media'].includes(ds.type) && ds.status === 'error').length;
  const totalRecords = dataSources.reduce((sum, ds) => sum + ds.recordCount, 0);

  return (
    <div>
      {/* Connection Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">CRM Systems</h3>
              <p className="text-2xl font-bold text-primary-gold">{crmCount}</p>
              <p className="text-xs text-green-600">Connected</p>
            </div>
            <Database className="w-8 h-8 text-primary-gold" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Property Portals</h3>
              <p className="text-2xl font-bold text-primary-gold">{portalCount}</p>
              <p className="text-xs text-green-600">Active</p>
            </div>
            <Zap className="w-8 h-8 text-primary-gold" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Communication</h3>
              <p className="text-2xl font-bold text-primary-gold">{commCount}</p>
              <p className={`text-xs ${commErrors > 0 ? 'text-blue-600' : 'text-green-600'}`}>{commErrors > 0 ? `${commErrors} Error` : 'Healthy'}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-primary-gold" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Total Records</h3>
              <p className="text-2xl font-bold text-primary-gold">{(totalRecords/1000).toFixed(1)}K</p>
              <p className="text-xs text-green-600">Synced</p>
            </div>
            <RefreshCw className="w-8 h-8 text-primary-gold" />
          </div>
        </div>
      </div>

      {/* Detailed Data Sources List */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Data Source Connections</h3>
        </div>
        <div className="divide-y">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading data sources...</div>
          ) : dataSources.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No data sources found.</div>
          ) : (
            dataSources.map(source => (
              <div key={source.id} className={`p-4 ${statusConfig[source.status].bgColor}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${statusConfig[source.status].color}`}>{statusConfig[source.status].icon}</div>
                    <div>
                      <h4 className="font-medium">{source.name}</h4>
                      <p className="text-sm text-gray-600">{source.integrationDetails.provider}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-sm font-medium">{source.recordCount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Records</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">{source.healthScore}%</p>
                        <p className="text-xs text-gray-500">Health</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">{formatTime(source.lastSync)}</p>
                        <p className="text-xs text-gray-500">Last Sync</p>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                {source.status === 'error' && source.errorMessage && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                    <p className="text-sm text-red-700">{source.errorMessage}</p>
                    <button className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium">
                      Retry Connection
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DataSourcesPanel; 