import { useState, useEffect, useCallback } from 'react';
import type { 
  DataSource, 
  ROIMetrics, 
  MarketInsight, 
  ClientPortfolio, 
  LeadSourceMetrics,
  AnalyticsDashboardStats 
} from '../types';

export const useAnalyticsData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Data states
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [roiMetrics, setROIMetrics] = useState<ROIMetrics | null>(null);
  const [marketInsights, setMarketInsights] = useState<MarketInsight[]>([]);
  const [clientPortfolios, setClientPortfolios] = useState<ClientPortfolio[]>([]);
  const [leadSourceMetrics, setLeadSourceMetrics] = useState<LeadSourceMetrics[]>([]);

  // Sample data - replace with real API calls
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
    }
  ];

  const sampleROIMetrics: ROIMetrics = {
    totalRevenue: 2847500,
    totalCosts: 1423750,
    netProfit: 1423750,
    profitMargin: 50.0,
    roi: 100.0,
    period: 'monthly',
    startDate: '2024-06-01',
    endDate: '2024-06-30',
    breakdown: {
      commissions: 2135625,
      operationalCosts: 284750,
      marketingSpend: 426750,
      toolingCosts: 142375,
      automationSavings: 184375
    }
  };

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 1200));
      setDataSources(sampleDataSources);
      setROIMetrics(sampleROIMetrics);
      setMarketInsights([]); // Will be populated by market insights hook
      setClientPortfolios([]); // Will be populated by client database hook
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      setError('Failed to fetch analytics data');
      console.error('Analytics data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshDataSources = useCallback(async () => {
    try {
      const updatedSources = sampleDataSources.map(source => ({
        ...source,
        lastSync: new Date().toISOString(),
        healthScore: Math.min(100, source.healthScore + Math.random() * 5)
      }));
      setDataSources(updatedSources);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      setError('Failed to refresh data sources');
    }
  }, []);

  const retryConnection = useCallback(async (sourceId: string) => {
    try {
      setDataSources(prev => prev.map(source => 
        source.id === sourceId 
          ? { 
              ...source, 
              status: 'connected' as const,
              errorMessage: undefined,
              lastSync: new Date().toISOString(),
              healthScore: 95
            }
          : source
      ));
    } catch (err) {
      setError('Failed to retry connection');
    }
  }, []);

  // Calculate dashboard stats
  const dashboardStats: AnalyticsDashboardStats = {
    totalRevenue: roiMetrics?.totalRevenue || 0,
    monthlyGrowth: 15.3,
    activeClients: clientPortfolios.length,
    conversionRate: 23.5,
    averageDealSize: roiMetrics ? roiMetrics.totalRevenue / 45 : 0,
    portfolioValue: clientPortfolios.reduce((sum, client) => sum + client.portfolioValue, 0),
    dataSourcesConnected: dataSources.filter(ds => ds.status === 'connected').length,
    lastReportGenerated: '2024-07-08T09:30:00+04:00',
    topPerformingArea: 'Dubai Marina',
    topPerformingAgent: 'Sarah (Manager Agent)'
  };

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return {
    dataSources,
    roiMetrics,
    marketInsights,
    clientPortfolios,
    leadSourceMetrics,
    dashboardStats,
    loading,
    error,
    lastUpdated,
    fetchAllData,
    refreshDataSources,
    retryConnection
  };
}; 