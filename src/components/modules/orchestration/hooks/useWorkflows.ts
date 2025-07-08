import { useState, useEffect, useCallback } from 'react';
import type { Workflow, ExecutionStatus } from '../types';

const STORAGE_KEY = 'orchestration_workflows';

const sampleWorkflows: Workflow[] = [
  {
    id: 'wf-lead-qualification',
    name: 'Lead Qualification Pipeline',
    nodes: [],
    connections: [],
    createdBy: 'admin',
    createdAt: '2024-07-08T10:00:00+04:00',
    updatedAt: '2024-07-08T10:00:00+04:00',
    marketContext: 'dubai_real_estate',
    language: 'ar_en',
    tenantId: 'tenant-001',
    description: 'WhatsApp → AI Qualifier → Email → Appointment',
    tags: ['lead', 'qualification'],
    isTemplate: false,
  },
  {
    id: 'wf-property-marketing',
    name: 'Property Marketing Automation',
    nodes: [],
    connections: [],
    createdBy: 'admin',
    createdAt: '2024-07-08T10:00:00+04:00',
    updatedAt: '2024-07-08T10:00:00+04:00',
    marketContext: 'dubai_real_estate',
    language: 'ar_en',
    tenantId: 'tenant-001',
    description: 'Content Creation → Multi-platform Publishing → Analytics',
    tags: ['marketing', 'automation'],
    isTemplate: false,
  },
];

export const useWorkflows = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        setWorkflows(stored ? JSON.parse(stored) : sampleWorkflows);
        setLoading(false);
      } catch (e) {
        setError('Failed to load workflows');
        setLoading(false);
      }
    }, 500);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
  }, [workflows]);

  // CRUD operations
  const createWorkflow = useCallback(async (data: Partial<Workflow>) => {
    setLoading(true);
    setError(null);
    return new Promise<Workflow>((resolve, reject) => {
      setTimeout(() => {
        try {
          const newWorkflow: Workflow = {
            ...data,
            id: `wf-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            marketContext: 'dubai_real_estate',
            language: 'ar_en',
            tenantId: 'tenant-001',
            nodes: data.nodes || [],
            connections: data.connections || [],
            createdBy: data.createdBy || 'user',
            description: data.description || '',
            tags: data.tags || [],
            isTemplate: data.isTemplate || false,
          } as Workflow;
          setWorkflows(prev => [newWorkflow, ...prev]);
          setLoading(false);
          resolve(newWorkflow);
        } catch (e) {
          setError('Failed to create workflow');
          setLoading(false);
          reject(e);
        }
      }, 600);
    });
  }, []);

  const updateWorkflow = useCallback(async (id: string, updates: Partial<Workflow>) => {
    setLoading(true);
    setError(null);
    return new Promise<Workflow | null>((resolve, reject) => {
      setTimeout(() => {
        try {
          setWorkflows(prev => {
            const idx = prev.findIndex(wf => wf.id === id);
            if (idx === -1) return prev;
            const updated = { ...prev[idx], ...updates, updatedAt: new Date().toISOString() };
            const newArr = [...prev];
            newArr[idx] = updated;
            resolve(updated);
            return newArr;
          });
          setLoading(false);
        } catch (e) {
          setError('Failed to update workflow');
          setLoading(false);
          reject(e);
        }
      }, 600);
    });
  }, []);

  const deleteWorkflow = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    return new Promise<boolean>((resolve, reject) => {
      setTimeout(() => {
        try {
          setWorkflows(prev => prev.filter(wf => wf.id !== id));
          setLoading(false);
          resolve(true);
        } catch (e) {
          setError('Failed to delete workflow');
          setLoading(false);
          reject(e);
        }
      }, 500);
    });
  }, []);

  // Real-time status simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setWorkflows(prev => prev.map(wf => {
        if (Math.random() > 0.8) {
          return { ...wf, updatedAt: new Date().toISOString() };
        }
        return wf;
      }));
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Performance analytics (demo)
  const getAnalytics = useCallback(() => {
    return workflows.reduce((acc, wf) => {
      acc.totalWorkflows++;
      acc.templates += wf.isTemplate ? 1 : 0;
      return acc;
    }, { totalWorkflows: 0, templates: 0 });
  }, [workflows]);

  return {
    workflows,
    loading,
    error,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    getAnalytics
  };
}; 