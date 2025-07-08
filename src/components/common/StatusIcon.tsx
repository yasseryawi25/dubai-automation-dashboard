import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

const iconMap = {
  success: <CheckCircle className="text-success w-4 h-4" />,
  warning: <AlertTriangle className="text-warning w-4 h-4" />,
  error: <XCircle className="text-error w-4 h-4" />,
  info: <Info className="text-primary w-4 h-4" />,
};

const StatusIcon: React.FC<{ status: 'success' | 'warning' | 'error' | 'info' }> = ({ status }) => (
  <span>{iconMap[status]}</span>
);

export default StatusIcon; 