import { useState, useEffect, useCallback } from 'react';
import type { MarketingCampaign } from '../types';

const STORAGE_KEY = 'marketing_campaigns';

const sampleCampaigns: MarketingCampaign[] = [
  // ... (use the sampleCampaigns array from CampaignTracker.tsx)
];

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        setCampaigns(stored ? JSON.parse(stored) : sampleCampaigns);
        setLoading(false);
      } catch (e) {
        setError('Failed to load campaigns');
        setLoading(false);
      }
    }, 500);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
  }, [campaigns]);

  // CRUD operations
  const createCampaign = useCallback(async (data: Partial<MarketingCampaign>) => {
    setLoading(true);
    setError(null);
    return new Promise<MarketingCampaign>((resolve, reject) => {
      setTimeout(() => {
        try {
          const newCampaign: MarketingCampaign = {
            ...data,
            id: `cmp-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: data.status || 'draft',
            spend: data.spend || 0,
            roi: data.roi || 0,
            leadsGenerated: data.leadsGenerated || 0,
            analytics: data.analytics || { impressions: 0, clicks: 0, engagementRate: 0, costPerLead: 0, conversions: 0, conversionRate: 0, platformBreakdown: {} },
            platforms: data.platforms || [],
            properties: data.properties || [],
            language: data.language || 'en',
            budget: data.budget || 0,
            startDate: data.startDate || '',
            endDate: data.endDate || ''
          } as MarketingCampaign;
          setCampaigns(prev => [newCampaign, ...prev]);
          setLoading(false);
          resolve(newCampaign);
        } catch (e) {
          setError('Failed to create campaign');
          setLoading(false);
          reject(e);
        }
      }, 600);
    });
  }, []);

  const updateCampaign = useCallback(async (id: string, updates: Partial<MarketingCampaign>) => {
    setLoading(true);
    setError(null);
    return new Promise<MarketingCampaign | null>((resolve, reject) => {
      setTimeout(() => {
        try {
          setCampaigns(prev => {
            const idx = prev.findIndex(c => c.id === id);
            if (idx === -1) return prev;
            const updated = { ...prev[idx], ...updates, updatedAt: new Date().toISOString() };
            const newArr = [...prev];
            newArr[idx] = updated;
            resolve(updated);
            return newArr;
          });
          setLoading(false);
        } catch (e) {
          setError('Failed to update campaign');
          setLoading(false);
          reject(e);
        }
      }, 600);
    });
  }, []);

  const deleteCampaign = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    return new Promise<boolean>((resolve, reject) => {
      setTimeout(() => {
        try {
          setCampaigns(prev => prev.filter(c => c.id !== id));
          setLoading(false);
          resolve(true);
        } catch (e) {
          setError('Failed to delete campaign');
          setLoading(false);
          reject(e);
        }
      }, 500);
    });
  }, []);

  // Simulate real-time updates (e.g., spend, leads, ROI)
  useEffect(() => {
    const interval = setInterval(() => {
      setCampaigns(prev => prev.map(c => {
        if (c.status === 'active') {
          // Simulate spend/leads/ROI growth
          const spendInc = Math.floor(Math.random() * 100);
          const leadsInc = Math.floor(Math.random() * 2);
          const roiInc = Math.random() * 0.01;
          return {
            ...c,
            spend: c.spend + spendInc,
            leadsGenerated: c.leadsGenerated + leadsInc,
            roi: +(c.roi + roiInc).toFixed(2),
            analytics: {
              ...c.analytics,
              impressions: c.analytics.impressions + Math.floor(Math.random() * 100),
              clicks: c.analytics.clicks + Math.floor(Math.random() * 10),
              engagementRate: c.analytics.engagementRate,
              costPerLead: c.leadsGenerated > 0 ? c.spend / c.leadsGenerated : 0,
              conversions: c.analytics.conversions + Math.floor(Math.random() * 1),
              conversionRate: c.analytics.conversionRate,
              platformBreakdown: c.analytics.platformBreakdown
            }
          };
        }
        return c;
      }));
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Budget tracking and alerts
  const getBudgetAlerts = useCallback(() => {
    return campaigns.filter(c => c.status === 'active' && c.spend / c.budget > 0.8);
  }, [campaigns]);

  // Performance analytics (aggregate)
  const getAnalytics = useCallback(() => {
    return campaigns.reduce((acc, c) => {
      acc.totalCampaigns++;
      acc.totalSpend += c.spend;
      acc.totalLeads += c.leadsGenerated;
      acc.avgROI += c.roi;
      return acc;
    }, { totalCampaigns: 0, totalSpend: 0, totalLeads: 0, avgROI: 0 });
  }, [campaigns]);

  return {
    campaigns,
    loading,
    error,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    getBudgetAlerts,
    getAnalytics
  };
}; 