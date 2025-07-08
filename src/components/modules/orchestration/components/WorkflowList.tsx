import React, { useState, useEffect } from 'react';
import { Play, Pause, Edit, Trash2, Copy, Eye, Loader2, Plus, Zap } from 'lucide-react';
import type { Workflow, ExecutionStatus, WorkflowExecution } from '../types';

// Sample workflows
const sampleWorkflows: Workflow[] = [
  {
    id: 'wf-lead-qualification',
    name: 'Lead Qualification Pipeline',
    nodes: [],
    connections: [],
    createdBy: 'admin',
    createdAt: '2024-07-08T10:00:00+04:00',
    updatedAt: '2024-07-08T10:00:00+04:00',
    marketContext: 'dubai_real_estate',
    language: 'ar_en',
    tenantId: 'tenant-001',
    description: 'WhatsApp → AI Qualifier → Email → Appointment',
    tags: ['lead', 'qualification'],
    isTemplate: false,
  },
  {
    id: 'wf-property-marketing',
    name: 'Property Marketing Automation',
    nodes: [],
    connections: [],
    createdBy: 'admin',
    createdAt: '2024-07-08T10:00:00+04:00',
    updatedAt: '2024-07-08T10:00:00+04:00',
    marketContext: 'dubai_real_estate',
    language: 'ar_en',
    tenantId: 'tenant-001',
    description: 'Content Creation → Multi-platform Publishing → Analytics',
    tags: ['marketing', 'automation'],
    isTemplate: false,
  },
  {
    id: 'wf-client-onboarding',
    name: 'Client Onboarding Journey',
    nodes: [],
    connections: [],
    createdBy: 'admin',
    createdAt: '2024-07-08T10:00:00+04:00',
    updatedAt: '2024-07-08T10:00:00+04:00',
    marketContext: 'dubai_real_estate',
    language: 'ar_en',
    tenantId: 'tenant-001',
    description: 'Welcome → Document Collection → Property Matching',
    tags: ['client', 'onboarding'],
    isTemplate: false,
  },
  {
    id: 'wf-followup-sequence',
    name: 'Follow-up Sequence Manager',
    nodes: [],
    connections: [],
    createdBy: 'admin',
    createdAt: '2024-07-08T10:00:00+04:00',
    updatedAt: '2024-07-08T10:00:00+04:00',
    marketContext: 'dubai_real_estate',
    language: 'ar_en',
    tenantId: 'tenant-001',
    description: 'Initial Contact → Nurturing → Conversion',
    tags: ['followup', 'conversion'],
    isTemplate: false,
  }
];

const statusOptions: ExecutionStatus[] = ['pending', 'running', 'success', 'failed', 'cancelled', 'retrying'];

// Sample execution data
const sampleExecutions: WorkflowExecution[] = [
  {
    id: 'exec-001',
    workflowId: 'wf-lead-qualification',
    startedAt: '2024-07-08T11:00:00+04:00',
    finishedAt: '2024-07-08T11:01:00+04:00',
    status: 'success',
    logs: [],
    tenantId: 'tenant-001',
    triggeredBy: 'user',
    realTimeUpdates: true,
  },
  {
    id: 'exec-002',
    workflowId: 'wf-property-marketing',
    startedAt: '2024-07-08T10:30:00+04:00',
    finishedAt: '2024-07-08T10:31:00+04:00',
    status: 'failed',
    logs: [],
    tenantId: 'tenant-001',
    triggeredBy: 'schedule',
    realTimeUpdates: true,
  },
  {
    id: 'exec-003',
    workflowId: 'wf-client-onboarding',
    startedAt: '2024-07-08T09:00:00+04:00',
    finishedAt: '2024-07-08T09:01:00+04:00',
    status: 'success',
    logs: [],
    tenantId: 'tenant-001',
    triggeredBy: 'user',
    realTimeUpdates: true,
  }
];

const WorkflowList: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>(sampleWorkflows);
  const [executions, setExecutions] = useState<WorkflowExecution[]>(sampleExecutions);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ExecutionStatus | 'all'>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtered workflows
  const filteredWorkflows = workflows.filter(wf =>
    (search === '' || wf.name.toLowerCase().includes(search.toLowerCase()) || (wf.tags && wf.tags.some(t => t.includes(search.toLowerCase()))))
  );

  // Workflow status (simulate)
  const getWorkflowStatus = (id: string): ExecutionStatus => {
    const lastExec = executions.filter(e => e.workflowId === id).sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())[0];
    return lastExec ? lastExec.status : 'pending';
  };

  // Performance metrics (simulate)
  const getMetrics = (id: string) => {
    const wfExecs = executions.filter(e => e.workflowId === id);
    return {
      runs: wfExecs.length,
      success: wfExecs.filter(e => e.status === 'success').length,
      failed: wfExecs.filter(e => e.status === 'failed').length,
    };
  };

  // Quick actions (simulate async)
  const handleAction = (action: string, id: string) => {
    setLoading(true);
    setTimeout(() => {
      if (action === 'delete') setWorkflows(prev => prev.filter(wf => wf.id !== id));
      if (action === 'duplicate') {
        const wf = workflows.find(wf => wf.id === id);
        if (wf) setWorkflows(prev => [...prev, { ...wf, id: `wf-${Date.now()}`, name: wf.name + ' (Copy)' }]);
      }
      setLoading(false);
    }, 700);
  };

  // Template creation (simulate)
  const handleCreateTemplate = (id: string) => {
    setLoading(true);
    setTimeout(() => {
      setWorkflows(prev => prev.map(wf => wf.id === id ? { ...wf, isTemplate: true } : wf));
      setLoading(false);
    }, 700);
  };

  return (
    <div className="bg-white rounded-lg border p-6 w-full max-w-5xl mx-auto">
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <input
          type="text"
          className="border rounded-md px-3 py-1 text-sm"
          placeholder="Search workflows..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="border rounded-md px-3 py-1 text-sm"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as ExecutionStatus | 'all')}
        >
          <option value="all">All Statuses</option>
          {statusOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <button className="ml-auto flex items-center px-3 py-1 bg-primary-gold text-white rounded text-sm hover:bg-yellow-600">
          <Plus className="w-4 h-4 mr-1" /> New Workflow
        </button>
      </div>
      {loading && <Loader2 className="w-5 h-5 animate-spin text-primary-gold mx-auto my-4" />}
      {error && <div className="text-xs text-red-500 my-2">{error}</div>}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-2 py-2 text-left">Workflow</th>
              <th className="px-2 py-2 text-left">Status</th>
              <th className="px-2 py-2 text-left">Runs</th>
              <th className="px-2 py-2 text-left">Success</th>
              <th className="px-2 py-2 text-left">Failed</th>
              <th className="px-2 py-2 text-left">Tags</th>
              <th className="px-2 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredWorkflows
              .filter(wf => statusFilter === 'all' || getWorkflowStatus(wf.id) === statusFilter)
              .map(wf => {
                const metrics = getMetrics(wf.id);
                return (
                  <tr key={wf.id} className="hover:bg-gray-50">
                    <td className="px-2 py-2 font-medium flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary-gold" />
                      {wf.name}
                      {wf.isTemplate && <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs">Template</span>}
                    </td>
                    <td className="px-2 py-2">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        getWorkflowStatus(wf.id) === 'success' ? 'bg-green-100 text-green-800' :
                        getWorkflowStatus(wf.id) === 'failed' ? 'bg-red-100 text-red-800' :
                        getWorkflowStatus(wf.id) === 'running' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {getWorkflowStatus(wf.id)}
                      </span>
                    </td>
                    <td className="px-2 py-2">{metrics.runs}</td>
                    <td className="px-2 py-2">{metrics.success}</td>
                    <td className="px-2 py-2">{metrics.failed}</td>
                    <td className="px-2 py-2">
                      {wf.tags?.map(t => <span key={t} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs mr-1">{t}</span>)}
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex space-x-1">
                        <button className="p-1 text-gray-400 hover:text-green-600" title="Start">
                          <Play className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-yellow-600" title="Pause">
                          <Pause className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-blue-600" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-purple-600" title="Duplicate" onClick={() => handleAction('duplicate', wf.id)}>
                          <Copy className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600" title="Delete" onClick={() => handleAction('delete', wf.id)}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-primary-gold" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        {!wf.isTemplate && (
                          <button className="p-1 text-gray-400 hover:text-yellow-600" title="Create Template" onClick={() => handleCreateTemplate(wf.id)}>
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkflowList; 