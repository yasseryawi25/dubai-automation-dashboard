import React from 'react';
import { Phone, Mail, Calendar, UserCheck } from 'lucide-react';

interface QuickActionsProps {
  onCall?: () => void;
  onEmail?: () => void;
  onSchedule?: () => void;
  onTakeOver?: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onCall, onEmail, onSchedule, onTakeOver }) => (
  <div className="flex space-x-2 mt-2">
    <button
      className="p-2 rounded bg-success text-white hover:bg-green-700 focus:outline-none"
      onClick={onCall}
      aria-label="Call Lead"
    >
      <Phone className="w-5 h-5" />
    </button>
    <button
      className="p-2 rounded bg-primary-gold text-white hover:bg-primary focus:outline-none"
      onClick={onEmail}
      aria-label="Email Lead"
    >
      <Mail className="w-5 h-5" />
    </button>
    <button
      className="p-2 rounded bg-blue-500 text-white hover:bg-blue-700 focus:outline-none"
      onClick={onSchedule}
      aria-label="Schedule Viewing"
    >
      <Calendar className="w-5 h-5" />
    </button>
    <button
      className="p-2 rounded bg-warning text-white hover:bg-yellow-700 focus:outline-none"
      onClick={onTakeOver}
      aria-label="Take Over Lead"
    >
      <UserCheck className="w-5 h-5" />
    </button>
  </div>
);

export default QuickActions; 