import { useState, useEffect, useCallback } from 'react';
import type { AgentOrchestration } from '../types';

const STORAGE_KEY = 'orchestration_agent_orchestration';

const sampleOrchestration: AgentOrchestration[] = [
  {
    id: 'orch-001',
    tenantId: 'tenant-001',
    workflowIds: ['wf-lead-qualification', 'wf-property-marketing'],
    agentIds: ['agent-001', 'agent-002', 'agent-003'],
    status: 'active',
    lastRunAt: '2024-07-08T11:00:00+04:00',
    realTimeStatus: {
      runningExecutions: 2,
      failedExecutions: 0,
      lastExecutionStatus: 'success',
    },
    error: undefined,
  },
];

export const useAgentOrchestration = () => {
  const [orchestrations, setOrchestrations] = useState<AgentOrchestration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        setOrchestrations(stored ? JSON.parse(stored) : sampleOrchestration);
        setLoading(false);
      } catch (e) {
        setError('Failed to load agent orchestration');
        setLoading(false);
      }
    }, 500);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orchestrations));
  }, [orchestrations]);

  // Task assignment (demo)
  const assignTask = useCallback((agentId: string, workflowId: string) => {
    setLoading(true);
    setTimeout(() => {
      setOrchestrations(prev => prev.map(o =>
        o.agentIds.includes(agentId) && o.workflowIds.includes(workflowId)
          ? { ...o, realTimeStatus: { ...o.realTimeStatus, runningExecutions: o.realTimeStatus.runningExecutions + 1 } }
          : o
      ));
      setLoading(false);
    }, 700);
  }, []);

  // Performance tracking (demo)
  const getPerformance = useCallback(() => {
    return orchestrations.reduce((acc, o) => {
      acc.totalOrchestrations++;
      acc.active += o.status === 'active' ? 1 : 0;
      acc.failed += o.realTimeStatus.failedExecutions;
      return acc;
    }, { totalOrchestrations: 0, active: 0, failed: 0 });
  }, [orchestrations]);

  return {
    orchestrations,
    loading,
    error,
    assignTask,
    getPerformance
  };
}; 