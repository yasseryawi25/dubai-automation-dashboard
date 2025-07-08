import { useMemo } from 'react';
import { useCalendarData } from './useCalendarData';
import { useTasks } from './useTasks';
import { useTemplates } from './useTemplates';
import { AdminStats } from '../types';

export const useAdminData = () => {
  const calendar = useCalendarData();
  const tasks = useTasks();
  const templates = useTemplates();

  const stats = useMemo((): AdminStats => {
    const today = new Date().toISOString().split('T')[0];
    return {
      totalTasks: tasks.tasks.length,
      completedTasks: tasks.tasks.filter(t => t.status === 'completed').length,
      failedTasks: tasks.tasks.filter(t => t.status === 'failed').length,
      pendingTasks: tasks.tasks.filter(t => t.status === 'pending').length,
      averageTaskDuration: tasks.tasks
        .filter(t => t.actualDuration)
        .reduce((acc, t) => acc + (t.actualDuration || 0), 0) /
        Math.max(1, tasks.tasks.filter(t => t.actualDuration).length),
      totalTemplates: templates.templates.length,
      activeTemplates: templates.templates.filter(t => t.isActive).length,
      templateUsageToday: templates.templates
        .filter(t => t.lastUsed?.startsWith(today))
        .reduce((acc, t) => acc + t.usageCount, 0),
      upcomingEvents: calendar.events.filter(e =>
        new Date(e.startTime) > new Date() &&
        ['scheduled', 'confirmed'].includes(e.status)
      ).length,
      completedEventsToday: calendar.events.filter(e =>
        (e as any).completedAt?.startsWith(today)
      ).length
    };
  }, [calendar.events, tasks.tasks, templates.templates]);

  const loading = calendar.loading || tasks.loading || templates.loading;
  const error = calendar.error || tasks.error || templates.error;

  return {
    calendar,
    tasks,
    templates,
    stats,
    loading,
    error
  };
}; 