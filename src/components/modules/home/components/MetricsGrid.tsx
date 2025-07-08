import React from 'react';
import MetricCard from '../../../common/MetricCard';
import { TrendingUp, Clock, CheckCircle, Activity, Users, ShieldCheck } from 'lucide-react';
import type { Metric } from '../../../../types';

export interface DashboardMetrics {
  totalLeadsToday: number;
  timeSavedHours: number;
  dealsInProgress: number;
  complianceStatus: string;
  systemHealth: string;
  responseTimeAvg: string;
  conversionRate: number;
  activeAgents: number;
}

const metrics: DashboardMetrics = {
  totalLeadsToday: 47,
  timeSavedHours: 12.5,
  dealsInProgress: 23,
  complianceStatus: '100% Compliant',
  systemHealth: 'All Agents Active',
  responseTimeAvg: '< 30s',
  conversionRate: 21.7,
  activeAgents: 6,
};

const metricCards: Metric[] = [
  {
    id: 'totalLeadsToday',
    label: 'Total Leads Today',
    value: `${metrics.totalLeadsToday} leads`,
    trend: 'up',
    status: 'success',
    icon: <TrendingUp />,
  },
  {
    id: 'timeSavedHours',
    label: 'Time Saved',
    value: `${metrics.timeSavedHours} hours`,
    status: 'success',
    icon: <Clock />,
  },
  {
    id: 'dealsInProgress',
    label: 'Deals in Progress',
    value: `${metrics.dealsInProgress} (AED 15.2M)` ,
    status: 'neutral',
    icon: <Activity />,
  },
  {
    id: 'complianceStatus',
    label: 'Compliance Status',
    value: metrics.complianceStatus,
    status: 'success',
    icon: <ShieldCheck />,
  },
  {
    id: 'systemHealth',
    label: 'System Health',
    value: metrics.systemHealth,
    status: 'success',
    icon: <CheckCircle />,
  },
  {
    id: 'responseTimeAvg',
    label: 'Avg Response Time',
    value: metrics.responseTimeAvg,
    status: 'success',
    icon: <Clock />,
  },
];

const MetricsGrid: React.FC = React.memo(() => (
  <section aria-label="Key Metrics" className="mb-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      {metricCards.map((metric) => (
        <MetricCard key={metric.id} metric={metric} />
      ))}
    </div>
  </section>
));

export default MetricsGrid; 