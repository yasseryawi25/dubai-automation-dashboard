import React from 'react';
import { CheckCircle2, AlertTriangle, RefreshCw, XCircle, Clock } from 'lucide-react';

export type StatusType = 'success' | 'error' | 'syncing' | 'stale' | 'fresh' | 'warning';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  lastUpdated?: string;
  onClick?: () => void;
  className?: string;
}

const statusConfig = {
  success: {
    color: 'bg-green-50 text-green-700',
    icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    defaultLabel: 'Up to date'
  },
  error: {
    color: 'bg-red-50 text-red-700',
    icon: <XCircle className="w-4 h-4 text-red-500" />,
    defaultLabel: 'Error'
  },
  syncing: {
    color: 'bg-blue-50 text-blue-700',
    icon: <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />,
    defaultLabel: 'Syncing...'
  },
  stale: {
    color: 'bg-yellow-50 text-yellow-700',
    icon: <Clock className="w-4 h-4 text-yellow-500" />,
    defaultLabel: 'Outdated'
  },
  fresh: {
    color: 'bg-primary-gold text-white',
    icon: <CheckCircle2 className="w-4 h-4 text-white" />,
    defaultLabel: 'Fresh'
  },
  warning: {
    color: 'bg-yellow-100 text-yellow-800',
    icon: <AlertTriangle className="w-4 h-4 text-yellow-600" />,
    defaultLabel: 'Warning'
  }
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, lastUpdated, onClick, className = '' }) => {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium text-xs min-h-[32px] min-w-[44px] ${config.color} ${onClick ? 'cursor-pointer hover:opacity-80' : ''} ${className}`}
      onClick={onClick}
      title={lastUpdated ? `Last updated: ${lastUpdated}` : label || config.defaultLabel}
      style={{ touchAction: 'manipulation' }}
    >
      {config.icon}
      {label || config.defaultLabel}
      {lastUpdated && (
        <span className="ml-2 text-gray-400 text-[10px]">{lastUpdated}</span>
      )}
    </span>
  );
};

export default StatusBadge; 