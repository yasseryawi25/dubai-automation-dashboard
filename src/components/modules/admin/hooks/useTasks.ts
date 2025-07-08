import { useState, useEffect, useCallback } from 'react';
import { AutomatedTask, TaskFilter } from '../types';

export const useTasks = () => {
  const [tasks, setTasks] = useState<AutomatedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sample data - replace with actual API calls
  const sampleTasks: AutomatedTask[] = [
    {
      id: 'task-1',
      name: 'WhatsApp Follow-up Sequence',
      description: 'Send 3-day follow-up sequence to qualified lead Ahmed Al-Rashid',
      type: 'whatsapp_sequence',
      status: 'in_progress',
      priority: 'high',
      assignedAgent: 'Layla (Follow-up Specialist)',
      targetEntity: 'lead-123',
      scheduledAt: '2024-07-08T09:00:00+04:00',
      startedAt: '2024-07-08T09:00:00+04:00',
      estimatedDuration: 15,
      retryCount: 0,
      maxRetries: 3,
      workflow: 'whatsapp-followup-sequence',
      metadata: {
        leadId: 'lead-123',
        clientName: 'Ahmed Al-Rashid',
        propertyId: 'prop-456',
        sequenceStep: 2,
        totalSteps: 3
      },
      createdAt: '2024-07-08T08:55:00+04:00',
      updatedAt: '2024-07-08T09:00:00+04:00'
    }
    // Add more tasks...
  ];

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 800));
      setTasks(sampleTasks);
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const retryTask = useCallback(async (taskId: string) => {
    try {
      setTasks(prev => prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              status: 'pending' as const,
              retryCount: task.retryCount + 1,
              updatedAt: new Date().toISOString()
            }
          : task
      ));
    } catch (err) {
      setError('Failed to retry task');
      throw err;
    }
  }, []);

  const pauseTask = useCallback(async (taskId: string) => {
    try {
      setTasks(prev => prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              status: 'paused' as const,
              updatedAt: new Date().toISOString()
            }
          : task
      ));
    } catch (err) {
      setError('Failed to pause task');
      throw err;
    }
  }, []);

  const filterTasks = useCallback((tasks: AutomatedTask[], filter: TaskFilter) => {
    return tasks.filter(task => {
      if (filter.status && !filter.status.includes(task.status)) return false;
      if (filter.type && !filter.type.includes(task.type)) return false;
      if (filter.priority && !filter.priority.includes(task.priority)) return false;
      if (filter.agent && task.assignedAgent !== filter.agent) return false;
      if (filter.searchTerm) {
        const searchLower = filter.searchTerm.toLowerCase();
        return (
          task.name.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower) ||
          task.assignedAgent.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchTasks, 30000);
    return () => clearInterval(interval);
  }, [fetchTasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    retryTask,
    pauseTask,
    filterTasks
  };
}; 