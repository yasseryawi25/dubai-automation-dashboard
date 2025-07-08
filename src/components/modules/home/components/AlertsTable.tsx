import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle, Filter } from 'lucide-react';

export interface Alert {
  id: string;
  timestamp: string;
  alertType: 'info' | 'warning' | 'error' | 'success';
  message: string;
  status: 'new' | 'acknowledged' | 'resolved';
  actionRequired: boolean;
  agentName?: string;
}

const alertTypeColor = {
  info: 'text-primary-gold',
  warning: 'text-warning',
  error: 'text-error',
  success: 'text-success',
};

const alertTypeIcon = {
  info: <Info className="w-4 h-4 text-primary-gold" />,
  warning: <AlertTriangle className="w-4 h-4 text-warning" />,
  error: <XCircle className="w-4 h-4 text-error" />,
  success: <CheckCircle className="w-4 h-4 text-success" />,
};

const sampleAlerts: Alert[] = [
  {
    id: '1',
    timestamp: '2025-07-07T09:15:00Z',
    alertType: 'success',
    message: 'High-value lead detected (AED 8M budget)',
    status: 'new',
    actionRequired: true,
    agentName: 'Sarah Al-Mansouri',
  },
  {
    id: '2',
    timestamp: '2025-07-07T08:50:00Z',
    alertType: 'info',
    message: 'Omar processed 50+ leads in last hour',
    status: 'acknowledged',
    actionRequired: false,
    agentName: 'Omar Hassan',
  },
  {
    id: '3',
    timestamp: '2025-07-07T08:30:00Z',
    alertType: 'warning',
    message: 'Calendar integration needs attention',
    status: 'new',
    actionRequired: true,
  },
  {
    id: '4',
    timestamp: '2025-07-07T08:10:00Z',
    alertType: 'success',
    message: 'Sarah completed voice consultation',
    status: 'resolved',
    actionRequired: false,
    agentName: 'Sarah Al-Mansouri',
  },
  {
    id: '5',
    timestamp: '2025-07-07T07:55:00Z',
    alertType: 'info',
    message: 'New property inquiry from Marina',
    status: 'new',
    actionRequired: false,
  },
];

const AlertsTable: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>(sampleAlerts);
  const [sortBy, setSortBy] = useState<'timestamp' | 'alertType' | 'status'>('timestamp');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [filter, setFilter] = useState<'all' | 'info' | 'warning' | 'error' | 'success'>('all');

  const sortedAlerts = [...alerts]
    .filter(a => filter === 'all' ? true : a.alertType === filter)
    .sort((a, b) => {
      if (sortBy === 'timestamp') {
        return sortDir === 'asc'
          ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      if (sortBy === 'alertType') {
        return sortDir === 'asc'
          ? a.alertType.localeCompare(b.alertType)
          : b.alertType.localeCompare(a.alertType);
      }
      if (sortBy === 'status') {
        return sortDir === 'asc'
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      return 0;
    });

  const handleAcknowledge = (id: string) => {
    setAlerts(alerts => alerts.map(a => a.id === id ? { ...a, status: 'acknowledged' } : a));
  };
  const handleResolve = (id: string) => {
    setAlerts(alerts => alerts.map(a => a.id === id ? { ...a, status: 'resolved', actionRequired: false } : a));
  };

  return (
    <div>
      <div className="flex items-center mb-2 space-x-2">
        <button
          className="flex items-center px-2 py-1 border rounded text-sm text-neutral-600 hover:bg-neutral-100"
          onClick={() => setFilter('all')}
        >
          <Filter className="w-4 h-4 mr-1" /> All
        </button>
        {(['info', 'warning', 'error', 'success'] as const).map(type => (
          <button
            key={type}
            className={`flex items-center px-2 py-1 border rounded text-sm ml-1 ${filter === type ? 'bg-primary-gold text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}
            onClick={() => setFilter(type)}
          >
            {alertTypeIcon[type]} {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-neutral-50">
              <th className="px-3 py-2 cursor-pointer" onClick={() => { setSortBy('timestamp'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); }}>Time</th>
              <th className="px-3 py-2 cursor-pointer" onClick={() => { setSortBy('alertType'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); }}>Type</th>
              <th className="px-3 py-2">Message</th>
              <th className="px-3 py-2">Agent</th>
              <th className="px-3 py-2 cursor-pointer" onClick={() => { setSortBy('status'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); }}>Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedAlerts.map(alert => (
              <tr key={alert.id} className="border-b last:border-0 hover:bg-neutral-50">
                <td className="px-3 py-2 whitespace-nowrap">{new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td className={`px-3 py-2 font-medium ${alertTypeColor[alert.alertType]}`}>{alertTypeIcon[alert.alertType]}</td>
                <td className="px-3 py-2">{alert.message}</td>
                <td className="px-3 py-2">{alert.agentName || '-'}</td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    alert.status === 'new' ? 'bg-primary-gold text-white' :
                    alert.status === 'acknowledged' ? 'bg-warning text-white' :
                    'bg-success text-white'
                  }`}>
                    {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                  </span>
                </td>
                <td className="px-3 py-2 space-x-1">
                  {alert.status === 'new' && (
                    <button
                      className="px-2 py-1 rounded bg-warning text-white text-xs font-medium hover:bg-yellow-600"
                      onClick={() => handleAcknowledge(alert.id)}
                    >Acknowledge</button>
                  )}
                  {alert.status !== 'resolved' && (
                    <button
                      className="px-2 py-1 rounded bg-success text-white text-xs font-medium hover:bg-green-700"
                      onClick={() => handleResolve(alert.id)}
                    >Resolve</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sortedAlerts.length === 0 && (
          <div className="text-center text-neutral-400 py-8">No alerts found for this filter.</div>
        )}
      </div>
    </div>
  );
};

export default AlertsTable; 