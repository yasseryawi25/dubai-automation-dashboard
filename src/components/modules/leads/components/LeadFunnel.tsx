import React, { useState } from 'react';
import { useLeadsData } from '../hooks/useLeadsData';
import type { Lead, PipelineStage } from '../types';

const pipelineStages: Omit<PipelineStage, 'leads'>[] = [
  {
    id: 'new',
    name: 'New Leads',
    color: 'bg-red-500',
    conversionRate: 0.75,
    averageTimeInStage: 2,
    totalValue: 0
  },
  {
    id: 'contacted',
    name: 'Contacted',
    color: 'bg-yellow-500',
    conversionRate: 0.60,
    averageTimeInStage: 3,
    totalValue: 0
  },
  {
    id: 'qualified',
    name: 'Qualified',
    color: 'bg-blue-500',
    conversionRate: 0.45,
    averageTimeInStage: 5,
    totalValue: 0
  },
  {
    id: 'interested',
    name: 'Interested',
    color: 'bg-green-500',
    conversionRate: 0.70,
    averageTimeInStage: 4,
    totalValue: 0
  },
  {
    id: 'viewing_scheduled',
    name: 'Viewing Scheduled',
    color: 'bg-purple-500',
    conversionRate: 0.80,
    averageTimeInStage: 2,
    totalValue: 0
  },
  {
    id: 'negotiating',
    name: 'Negotiating',
    color: 'bg-orange-500',
    conversionRate: 0.65,
    averageTimeInStage: 7,
    totalValue: 0
  },
  {
    id: 'closed_won',
    name: 'Closed Won',
    color: 'bg-green-700',
    conversionRate: 1.0,
    averageTimeInStage: 0,
    totalValue: 0
  }
];

const LeadFunnel: React.FC = () => {
  const { leads } = useLeadsData();
  const [loading] = useState(false); // Placeholder for async

  // Group leads by status
  const stagesWithLeads: PipelineStage[] = pipelineStages.map(stage => {
    const stageLeads = leads.filter(lead => lead.status === stage.id);
    const totalValue = stageLeads.reduce((sum, lead) => sum + lead.budget, 0);
    return {
      ...stage,
      leads: stageLeads,
      totalValue
    };
  });

  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    e.dataTransfer.setData('leadId', lead.id);
    e.dataTransfer.setData('sourceStage', lead.status);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    const sourceStage = e.dataTransfer.getData('sourceStage');
    if (sourceStage !== targetStage) {
      // Would update lead status in real app
      alert(`Lead moved to ${targetStage.replace('_', ' ')} stage`);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-neutral-400">Loading pipeline...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-2">Sales Pipeline</h2>
        <p className="text-neutral-600">Drag and drop leads between stages to update their status</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-7 gap-4 overflow-x-auto">
        {stagesWithLeads.map(stage => (
          <div
            key={stage.id}
            className="min-w-[250px] bg-neutral-50 rounded-lg p-4"
            onDragOver={handleDragOver}
            onDrop={e => handleDrop(e, stage.id)}
          >
            <div className={`${stage.color} text-white rounded-lg p-3 mb-4`}>
              <h3 className="font-semibold text-sm">{stage.name}</h3>
              <div className="flex justify-between text-xs mt-1">
                <span>{stage.leads.length} leads</span>
                <span>{stage.conversionRate * 100}%</span>
              </div>
              <div className="text-xs mt-1">
                AED {stage.totalValue.toLocaleString()}
              </div>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {stage.leads.map(lead => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={e => handleDragStart(e, lead)}
                  className="bg-white p-3 rounded border cursor-move hover:shadow-md transition"
                >
                  <div className="font-medium text-sm text-neutral-900">{lead.name}</div>
                  <div className="text-xs text-neutral-500 mt-1">{lead.propertyInterest}</div>
                  <div className="text-xs text-primary-gold font-medium mt-1">
                    AED {lead.budget.toLocaleString()}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs bg-primary-gold text-white px-2 py-0.5 rounded">
                      Score: {lead.score}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {lead.assignedAgent.split(' ')[0]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {stage.leads.length === 0 && (
              <div className="text-neutral-400 text-center text-sm py-8">
                No leads in this stage
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900">Total Pipeline Value</h4>
          <p className="text-2xl font-bold text-blue-700">
            AED {stagesWithLeads.reduce((sum, stage) => sum + stage.totalValue, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-900">Active Leads</h4>
          <p className="text-2xl font-bold text-green-700">
            {leads.filter(l => !['closed_won', 'closed_lost'].includes(l.status)).length}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-900">Close Rate</h4>
          <p className="text-2xl font-bold text-purple-700">
            {leads.length > 0 ? Math.round((leads.filter(l => l.status === 'closed_won').length / leads.length) * 100) : 0}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeadFunnel; 