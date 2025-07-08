import React from 'react';
import type { Notification } from '../../types';
import StatusIcon from './StatusIcon';

const AlertsList: React.FC<{ alerts: Notification[] }> = ({ alerts }) => (
  <ul className="space-y-2">
    {alerts.map((alert) => (
      <li key={alert.id} className="flex items-center space-x-2 p-2 rounded bg-neutral-100">
        <StatusIcon status={alert.type} />
        <span className="flex-1 text-sm">{alert.message}</span>
        <span className="text-xs text-neutral-400">{new Date(alert.createdAt).toLocaleTimeString()}</span>
      </li>
    ))}
  </ul>
);

export default AlertsList; 