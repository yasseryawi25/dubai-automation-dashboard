import { useState, useEffect } from 'react';
import { IntegrationSettings } from '../types';

const LOCAL_KEY = 'dubai_integrations';

const defaultIntegrations: IntegrationSettings = {
  userId: 'user-001',
  apiKeys: [
    { name: 'Bayut', key: 'BYT-XXXX-1234', createdAt: '2024-05-01', lastUsed: '2024-06-10' },
    { name: 'Property Finder', key: 'PF-YYYY-5678', createdAt: '2024-05-10', lastUsed: '2024-06-09' },
  ],
  socialConnections: [
    { platform: 'facebook', connected: true, accountName: 'DubaiPropFB', connectedAt: '2024-05-15' },
    { platform: 'instagram', connected: false, accountName: '', connectedAt: '' },
    { platform: 'linkedin', connected: true, accountName: 'DubaiPropLinkedIn', connectedAt: '2024-05-20' },
    { platform: 'tiktok', connected: false, accountName: '', connectedAt: '' },
    { platform: 'twitter', connected: false, accountName: '', connectedAt: '' },
  ],
};

export function useIntegrations() {
  const [integrations, setIntegrations] = useState<IntegrationSettings>(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    return stored ? JSON.parse(stored) : defaultIntegrations;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(integrations));
  }, [integrations]);

  // Simulate connection test
  const testConnection = async (name: string) => {
    setLoading(true);
    return new Promise<boolean>(resolve => {
      setTimeout(() => {
        setLoading(false);
        resolve(Math.random() > 0.2);
      }, 800);
    });
  };

  // Simulate sync
  const syncIntegrations = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  // Simulate credential update
  const updateCredential = async (platform: string, key: string) => {
    setLoading(true);
    setTimeout(() => {
      setIntegrations(prev => ({
        ...prev,
        apiKeys: prev.apiKeys.map(api => api.name === platform ? { ...api, key } : api),
      }));
      setLoading(false);
    }, 700);
  };

  return { integrations, loading, error, testConnection, syncIntegrations, updateCredential };
} 