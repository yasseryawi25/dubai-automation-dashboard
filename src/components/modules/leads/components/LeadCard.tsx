import React from 'react';
import type { Lead } from '../types';
import { User, Phone, Mail, MapPin, Star } from 'lucide-react';

const statusColor: Record<Lead['status'], string> = {
  new: 'bg-red-100 text-red-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  qualified: 'bg-blue-100 text-blue-700',
  interested: 'bg-green-100 text-green-700',
  viewing_scheduled: 'bg-purple-100 text-purple-700',
  negotiating: 'bg-orange-100 text-orange-700',
  closed_won: 'bg-green-200 text-green-900',
  closed_lost: 'bg-neutral-200 text-neutral-500',
};

const LeadCard: React.FC<{
  lead: Lead;
  selected?: boolean;
  onClick?: () => void;
}> = React.memo(({ lead, selected, onClick }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border p-4 mb-2 cursor-pointer transition hover:shadow-md flex flex-col space-y-2 ${selected ? 'ring-2 ring-primary-gold' : ''}`}
      onClick={onClick}
      aria-selected={selected}
      tabIndex={0}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5 text-primary-gold" />
          <span className="font-semibold text-neutral-900">{lead.name}</span>
        </div>
        <span className={`px-2 py-0.5 rounded text-xs font-bold ${statusColor[lead.status]}`}>{lead.status.replace('_', ' ')}</span>
      </div>
      <div className="flex items-center text-xs text-neutral-500 space-x-2">
        <Phone className="w-4 h-4" />
        <span>{lead.phone}</span>
        <Mail className="w-4 h-4 ml-2" />
        <span>{lead.email}</span>
      </div>
      <div className="flex items-center text-xs text-neutral-500 space-x-2">
        <MapPin className="w-4 h-4" />
        <span>{lead.location}</span>
        <span className="ml-2">{lead.propertyInterest}</span>
      </div>
      <div className="flex items-center text-xs text-neutral-500 space-x-2">
        <span>Budget:</span>
        <span className="font-bold text-primary">AED {lead.budget.toLocaleString()}</span>
        <span className="ml-2">Assigned: <span className="font-medium text-primary-gold">{lead.assignedAgent}</span></span>
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="font-bold text-yellow-600">{lead.score}</span>
        </div>
        <span className="text-xs text-neutral-400">Last activity: {new Date(lead.lastActivity).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}</span>
      </div>
    </div>
  );
});

export default LeadCard; 