import React, { useState } from 'react';
import { useLeadsData } from '../hooks/useLeadsData';
import LeadCard from './LeadCard';
import LeadFilters from './LeadFilters';
import ConversationThread from './ConversationThread';
import QuickActions from './QuickActions';

const LiveInbox: React.FC = () => {
  const {
    leads,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,
  } = useLeadsData();
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(leads[0]?.id || null);
  const selectedLead = leads.find(l => l.id === selectedLeadId) || leads[0];

  return (
    <div className="flex flex-col md:flex-row gap-4 h-[70vh]">
      {/* Left Panel: Lead List */}
      <div className="md:w-1/3 w-full bg-neutral-50 rounded-lg border border-neutral-200 p-4 overflow-y-auto">
        <LeadFilters
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortDir={sortDir}
          setSortDir={setSortDir}
        />
        <div className="overflow-y-auto max-h-[60vh] pr-2">
          {leads.length === 0 && <div className="text-neutral-400 text-center py-8">No leads found.</div>}
          {leads.map(lead => (
            <LeadCard
              key={lead.id}
              lead={lead}
              selected={lead.id === selectedLeadId}
              onClick={() => setSelectedLeadId(lead.id)}
            />
          ))}
        </div>
      </div>
      {/* Right Panel: Conversation & Actions */}
      <div className="flex-1 bg-white rounded-lg border border-neutral-200 p-4 flex flex-col">
        {selectedLead ? (
          <>
            <div className="mb-2">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-bold text-lg text-primary-gold">{selectedLead.name}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-primary-gold text-white">{selectedLead.status.replace('_', ' ')}</span>
                <span className="text-xs text-neutral-400">{selectedLead.phone}</span>
                <span className="text-xs text-neutral-400">{selectedLead.email}</span>
              </div>
              <div className="text-xs text-neutral-500 mb-1">{selectedLead.propertyInterest} | Budget: AED {selectedLead.budget.toLocaleString()} | {selectedLead.location}</div>
              <div className="text-xs text-neutral-400 mb-2">Assigned: {selectedLead.assignedAgent}</div>
              <QuickActions
                onCall={() => alert('Call lead')}
                onEmail={() => alert('Email lead')}
                onSchedule={() => alert('Schedule viewing')}
                onTakeOver={() => alert('Take over lead')}
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              <ConversationThread
                messages={selectedLead.messages}
                leadName={selectedLead.name}
                agentName={selectedLead.assignedAgent}
              />
            </div>
          </>
        ) : (
          <div className="text-neutral-400 text-center py-8">Select a lead to view details.</div>
        )}
      </div>
    </div>
  );
};

export default LiveInbox; 