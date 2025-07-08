import { useState, useEffect, useCallback } from 'react';
import type { WorkflowExecution, ExecutionLog, ExecutionStatus } from '../types';

const EXEC_STORAGE_KEY = 'orchestration_executions';
const LOG_STORAGE_KEY = 'orchestration_logs';

const sampleExecutions: WorkflowExecution[] = [
  {
    id: 'exec-001',
    workflowId: 'wf-lead-qualification',
    startedAt: '2024-07-08T11:00:00+04:00',
    finishedAt: '2024-07-08T11:01:00+04:00',
    status: 'success',
    logs: [],
    tenantId: 'tenant-001',
    triggeredBy: 'user',
    realTimeUpdates: true,
  },
];
const sampleLogs: ExecutionLog[] = [
  { id: 'log-1', executionId: 'exec-001', nodeId: 'n1', timestamp: '2024-07-08T11:00:01+04:00', level: 'info', message: 'Workflow started', data: {} },
  { id: 'log-2', executionId: 'exec-001', nodeId: 'n2', timestamp: '2024-07-08T11:00:03+04:00', level: 'agent', message: 'AI Lead Qualifier: Scoring lead', data: { score: 87 } },
  { id: 'log-3', executionId: 'exec-001', nodeId: 'n3', timestamp: '2024-07-08T11:00:05+04:00', level: 'success', message: 'Email sent to client', data: { email: 'client@dubai.com' } },
  { id: 'log-4', executionId: 'exec-001', nodeId: 'n4', timestamp: '2024-07-08T11:00:07+04:00', level: 'warning', message: 'Appointment slot not available, retrying', data: {} },
  { id: 'log-5', executionId: 'exec-001', nodeId: 'n4', timestamp: '2024-07-08T11:00:09+04:00', level: 'error', message: 'Failed to book appointment', data: { retry: true } },
  { id: 'log-6', executionId: 'exec-001', nodeId: 'n4', timestamp: '2024-07-08T11:00:11+04:00', level: 'success', message: 'Appointment booked after retry', data: { slot: '2024-07-10 14:00' } },
];

export const useWorkflowExecution = () => {
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      try {
        const storedExec = localStorage.getItem(EXEC_STORAGE_KEY);
        const storedLogs = localStorage.getItem(LOG_STORAGE_KEY);
        setExecutions(storedExec ? JSON.parse(storedExec) : sampleExecutions);
        setLogs(storedLogs ? JSON.parse(storedLogs) : sampleLogs);
        setLoading(false);
      } catch (e) {
        setError('Failed to load execution data');
        setLoading(false);
      }
    }, 500);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(EXEC_STORAGE_KEY, JSON.stringify(executions));
  }, [executions]);
  useEffect(() => {
    localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(logs));
  }, [logs]);

  // Log management
  const addLog = useCallback((log: ExecutionLog) => {
    setLogs(prev => [...prev, log]);
  }, []);
  const filterLogs = useCallback((level: string) => {
    return logs.filter(l => l.level === level);
  }, [logs]);

  // Error handling and retry
  const retryError = useCallback((logId: string) => {
    setLoading(true);
    setTimeout(() => {
      setLogs(prev => prev.map(l => l.id === logId ? { ...l, level: 'info', message: 'Retry successful' } : l));
      setLoading(false);
    }, 800);
  }, []);

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        addLog({
          id: `log-${Date.now()}`,
          executionId: 'exec-001',
          nodeId: 'n2',
          timestamp: new Date().toISOString(),
          level: ['info', 'success', 'warning', 'error', 'agent'][Math.floor(Math.random() * 5)] as any,
          message: 'Simulated log entry',
          data: {},
        });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [addLog]);

  // Execution monitoring (demo)
  const getExecutionStatus = useCallback((id: string): ExecutionStatus => {
    const exec = executions.find(e => e.id === id);
    return exec ? exec.status : 'pending';
  }, [executions]);

  return {
    executions,
    logs,
    loading,
    error,
    addLog,
    filterLogs,
    retryError,
    getExecutionStatus,
    setExecutions,
    setLogs
  };
}; 