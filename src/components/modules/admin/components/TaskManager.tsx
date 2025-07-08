import React, { useState, useEffect } from 'react';
import { Play, Pause, RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import type { AutomatedTask, TaskFilter } from '../types';

const sampleTasks: AutomatedTask[] = [
  {
    id: 'task-1',
    name: 'WhatsApp Follow-up Sequence',
    description: 'Send 3-day follow-up sequence to qualified lead Ahmed Al-Rashid',
    type: 'whatsapp_sequence',
    status: 'in_progress',
    priority: 'high',
    assignedAgent: 'Layla (Follow-up Specialist)',
    targetEntity: 'lead-123',
    scheduledAt: '2024-07-08T09:00:00+04:00',
    startedAt: '2024-07-08T09:00:00+04:00',
    estimatedDuration: 15,
    retryCount: 0,
    maxRetries: 3,
    workflow: 'whatsapp-followup-sequence',
    metadata: {
      leadId: 'lead-123',
      clientName: 'Ahmed Al-Rashid',
      propertyId: 'prop-456',
      sequenceStep: 2,
      totalSteps: 3
    },
    createdAt: '2024-07-08T08:55:00+04:00',
    updatedAt: '2024-07-08T09:00:00+04:00'
  },
  {
    id: 'task-2',
    name: 'RERA Compliance Document Generation',
    description: 'Generate compliance documents for Marina Tower Unit 1204',
    type: 'document_generation',
    status: 'failed',
    priority: 'critical',
    assignedAgent: 'Sarah (Manager Agent)',
    targetEntity: 'property-789',
    scheduledAt: '2024-07-08T08:00:00+04:00',
    startedAt: '2024-07-08T08:00:00+04:00',
    estimatedDuration: 30,
    actualDuration: 5,
    errorMessage: 'Missing RERA certificate number in property data',
    retryCount: 2,
    maxRetries: 3,
    nextRetryAt: '2024-07-08T10:00:00+04:00',
    workflow: 'rera-document-generator',
    metadata: {
      propertyId: 'property-789',
      documentType: 'sale_agreement',
      clientName: 'Marina Investment LLC'
    },
    createdAt: '2024-07-08T07:55:00+04:00',
    updatedAt: '2024-07-08T08:05:00+04:00'
  },
  {
    id: 'task-3',
    name: 'Daily Market Report Generation',
    description: 'Generate daily Dubai market report for VIP clients',
    type: 'market_report',
    status: 'completed',
    priority: 'medium',
    assignedAgent: 'Alex (Pipeline Coordinator)',
    scheduledAt: '2024-07-08T07:00:00+04:00',
    startedAt: '2024-07-08T07:00:00+04:00',
    completedAt: '2024-07-08T07:12:00+04:00',
    estimatedDuration: 20,
    actualDuration: 12,
    retryCount: 0,
    maxRetries: 2,
    workflow: 'daily-market-report',
    metadata: {
      reportDate: '2024-07-08',
      clientCount: 45,
      areasIncluded: ['Downtown', 'Marina', 'JBR', 'Business Bay']
    },
    createdAt: '2024-07-07T18:00:00+04:00',
    updatedAt: '2024-07-08T07:12:00+04:00'
  },
  {
    id: 'task-4',
    name: 'Lead Follow-up Call',
    description: 'Call lead Olga Petrova for feedback on JBR viewing',
    type: 'lead_followup',
    status: 'pending',
    priority: 'medium',
    assignedAgent: 'Omar (Lead Qualification)',
    targetEntity: 'lead-456',
    scheduledAt: '2024-07-08T10:30:00+04:00',
    estimatedDuration: 10,
    retryCount: 0,
    maxRetries: 2,
    workflow: 'lead-followup-call',
    metadata: {
      leadId: 'lead-456',
      clientName: 'Olga Petrova',
      propertyId: 'prop-789'
    },
    createdAt: '2024-07-08T09:00:00+04:00',
    updatedAt: '2024-07-08T09:00:00+04:00'
  },
  {
    id: 'task-5',
    name: 'Social Media Post',
    description: 'Schedule Instagram post for new Dubai Hills listing',
    type: 'social_media',
    status: 'scheduled',
    priority: 'low',
    assignedAgent: 'Maya (Campaign Coordinator)',
    scheduledAt: '2024-07-08T12:00:00+04:00',
    estimatedDuration: 5,
    retryCount: 0,
    maxRetries: 1,
    workflow: 'social-media-scheduler',
    metadata: {
      platform: 'Instagram',
      propertyId: 'prop-321',
      campaignId: 'camp-001'
    },
    createdAt: '2024-07-08T10:00:00+04:00',
    updatedAt: '2024-07-08T10:00:00+04:00'
  },
  {
    id: 'task-6',
    name: 'Compliance Check',
    description: 'Verify RERA compliance for Business Bay office',
    type: 'compliance_check',
    status: 'completed',
    priority: 'high',
    assignedAgent: 'Sarah (Manager Agent)',
    scheduledAt: '2024-07-08T11:00:00+04:00',
    startedAt: '2024-07-08T11:00:00+04:00',
    completedAt: '2024-07-08T11:05:00+04:00',
    estimatedDuration: 10,
    actualDuration: 5,
    retryCount: 0,
    maxRetries: 2,
    workflow: 'compliance-check',
    metadata: {
      propertyId: 'prop-654',
      complianceType: 'RERA',
      office: 'Business Bay'
    },
    createdAt: '2024-07-08T10:30:00+04:00',
    updatedAt: '2024-07-08T11:05:00+04:00'
  },
  {
    id: 'task-7',
    name: 'Email Campaign',
    description: 'Send July newsletter to all Dubai Marina clients',
    type: 'email_campaign',
    status: 'in_progress',
    priority: 'medium',
    assignedAgent: 'Alex (Pipeline Coordinator)',
    scheduledAt: '2024-07-08T13:00:00+04:00',
    startedAt: '2024-07-08T13:00:00+04:00',
    estimatedDuration: 20,
    retryCount: 0,
    maxRetries: 2,
    workflow: 'email-campaign',
    metadata: {
      campaignId: 'camp-002',
      audience: 'Dubai Marina',
      templateId: 'tmpl-001'
    },
    createdAt: '2024-07-08T12:00:00+04:00',
    updatedAt: '2024-07-08T13:00:00+04:00'
  },
  {
    id: 'task-8',
    name: 'WhatsApp Welcome Sequence',
    description: 'Send welcome sequence to new lead Priya Singh',
    type: 'whatsapp_sequence',
    status: 'completed',
    priority: 'low',
    assignedAgent: 'Layla (Follow-up Specialist)',
    targetEntity: 'lead-789',
    scheduledAt: '2024-07-08T14:00:00+04:00',
    startedAt: '2024-07-08T14:00:00+04:00',
    completedAt: '2024-07-08T14:10:00+04:00',
    estimatedDuration: 10,
    actualDuration: 10,
    retryCount: 0,
    maxRetries: 2,
    workflow: 'whatsapp-welcome-sequence',
    metadata: {
      leadId: 'lead-789',
      clientName: 'Priya Singh',
      propertyId: 'prop-987',
      sequenceStep: 3,
      totalSteps: 3
    },
    createdAt: '2024-07-08T13:30:00+04:00',
    updatedAt: '2024-07-08T14:10:00+04:00'
  },
  {
    id: 'task-9',
    name: 'Market Report Generation',
    description: 'Generate weekly market report for DIFC',
    type: 'market_report',
    status: 'pending',
    priority: 'medium',
    assignedAgent: 'Maya (Campaign Coordinator)',
    scheduledAt: '2024-07-08T15:00:00+04:00',
    estimatedDuration: 15,
    retryCount: 0,
    maxRetries: 2,
    workflow: 'weekly-market-report',
    metadata: {
      reportDate: '2024-07-08',
      area: 'DIFC',
      clientCount: 12
    },
    createdAt: '2024-07-08T14:00:00+04:00',
    updatedAt: '2024-07-08T14:00:00+04:00'
  },
  {
    id: 'task-10',
    name: 'Pause Social Media Campaign',
    description: 'Pause Facebook campaign for Palm Jumeirah listing',
    type: 'social_media',
    status: 'paused',
    priority: 'high',
    assignedAgent: 'Maya (Campaign Coordinator)',
    scheduledAt: '2024-07-08T16:00:00+04:00',
    estimatedDuration: 5,
    retryCount: 1,
    maxRetries: 2,
    workflow: 'social-media-campaign',
    metadata: {
      platform: 'Facebook',
      propertyId: 'prop-555',
      campaignId: 'camp-003'
    },
    createdAt: '2024-07-08T15:00:00+04:00',
    updatedAt: '2024-07-08T15:00:00+04:00'
  }
];

const statusConfig = {
  pending: {
    icon: <Clock className="w-4 h-4" />,
    color: 'text-yellow-600 bg-yellow-100',
    bgColor: 'bg-yellow-50 border-yellow-200'
  },
  in_progress: {
    icon: <Play className="w-4 h-4" />,
    color: 'text-blue-600 bg-blue-100',
    bgColor: 'bg-blue-50 border-blue-200'
  },
  completed: {
    icon: <CheckCircle className="w-4 h-4" />,
    color: 'text-green-600 bg-green-100',
    bgColor: 'bg-green-50 border-green-200'
  },
  failed: {
    icon: <AlertCircle className="w-4 h-4" />,
    color: 'text-red-600 bg-red-100',
    bgColor: 'bg-red-50 border-red-200'
  },
  paused: {
    icon: <Pause className="w-4 h-4" />,
    color: 'text-gray-600 bg-gray-100',
    bgColor: 'bg-gray-50 border-gray-200'
  },
  scheduled: {
    icon: <Clock className="w-4 h-4" />,
    color: 'text-purple-600 bg-purple-100',
    bgColor: 'bg-purple-50 border-purple-200'
  }
};

const priorityConfig = {
  low: 'border-l-4 border-l-green-400',
  medium: 'border-l-4 border-l-yellow-400',
  high: 'border-l-4 border-l-orange-400',
  critical: 'border-l-4 border-l-red-400'
};

const formatTime = (dateString?: string) => {
  if (!dateString) return '';
  return new Intl.DateTimeFormat('en-AE', {
    timeZone: 'Asia/Dubai',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
};

const TaskCard: React.FC<{ task: AutomatedTask; onRetry: (id: string) => void; onClick: (task: AutomatedTask) => void }> = ({ task, onRetry, onClick }) => {
  const statusInfo = statusConfig[task.status];
  return (
    <div
      className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${statusInfo.bgColor} ${priorityConfig[task.priority]}`}
      onClick={() => onClick(task)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <div className={`p-1 rounded-full mr-2 ${statusInfo.color}`}>
            {statusInfo.icon}
          </div>
          <div>
            <h3 className="font-semibold text-sm">{task.name}</h3>
            <p className="text-xs text-gray-600 mt-1">{task.description}</p>
          </div>
        </div>
        <div className="text-right">
          <span className={`inline-block px-2 py-1 text-xs rounded-full ${statusInfo.color}`}>
            {task.status.replace('_', ' ')}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
        <div><strong>Agent:</strong> {task.assignedAgent}</div>
        <div><strong>Priority:</strong> {task.priority}</div>
        <div><strong>Type:</strong> {task.type.replace('_', ' ')}</div>
        <div><strong>Duration:</strong> {task.actualDuration || task.estimatedDuration}min</div>
      </div>
      {task.status === 'failed' && (
        <div className="mb-3">
          <p className="text-xs text-red-600 bg-red-50 p-2 rounded">
            <strong>Error:</strong> {task.errorMessage}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Retry {task.retryCount}/{task.maxRetries}
            {task.nextRetryAt && ` • Next retry: ${formatTime(task.nextRetryAt)}`}
          </p>
        </div>
      )}
      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-500">
          {formatTime(task.scheduledAt)}
        </div>
        <div className="flex space-x-1">
          {task.status === 'failed' && task.retryCount < task.maxRetries && (
            <button
              onClick={e => {
                e.stopPropagation();
                onRetry(task.id);
              }}
              className="text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
            >
              Retry
            </button>
          )}
          {task.status === 'in_progress' && (
            <button
              onClick={e => e.stopPropagation()}
              className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              Pause
            </button>
          )}
          <button
            onClick={e => e.stopPropagation()}
            className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
          >
            Logs
          </button>
        </div>
      </div>
    </div>
  );
};

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<AutomatedTask[]>(sampleTasks);
  const [filteredTasks, setFilteredTasks] = useState<AutomatedTask[]>(sampleTasks);
  const [filter, setFilter] = useState<TaskFilter>({});
  const [selectedTask, setSelectedTask] = useState<AutomatedTask | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(refreshTasks, 30000);
    return () => clearInterval(interval);
  }, [tasks]);

  function refreshTasks() {
    setIsRefreshing(true);
    // Simulate async fetch
    setTimeout(() => {
      setTasks([...sampleTasks]);
      setIsRefreshing(false);
    }, 800);
  }

  function updateFilter(key: keyof TaskFilter, value: string) {
    setFilter(prev => ({ ...prev, [key]: value || undefined }));
  }

  function clearFilters() {
    setFilter({});
  }

  useEffect(() => {
    let result = tasks;
    if (filter.status) result = result.filter(t => t.status === filter.status);
    if (filter.type) result = result.filter(t => t.type === filter.type);
    if (filter.priority) result = result.filter(t => t.priority === filter.priority);
    if (filter.agent) result = result.filter(t => t.assignedAgent === filter.agent);
    setFilteredTasks(result);
  }, [tasks, filter]);

  function handleRetryTask(id: string) {
    setTasks(prev =>
      prev.map(t =>
        t.id === id
          ? {
              ...t,
              status: 'pending',
              retryCount: t.retryCount + 1,
              errorMessage: undefined,
              nextRetryAt: undefined,
            }
          : t
      )
    );
  }

  function openTaskModal(task: AutomatedTask) {
    setSelectedTask(task);
    setShowTaskModal(true);
  }
  function closeTaskModal() {
    setShowTaskModal(false);
    setSelectedTask(null);
  }

  // Performance metrics per agent
  const agentMetrics = React.useMemo(() => {
    const metrics: Record<string, { total: number; completed: number; failed: number }> = {};
    tasks.forEach(t => {
      if (!metrics[t.assignedAgent]) metrics[t.assignedAgent] = { total: 0, completed: 0, failed: 0 };
      metrics[t.assignedAgent].total++;
      if (t.status === 'completed') metrics[t.assignedAgent].completed++;
      if (t.status === 'failed') metrics[t.assignedAgent].failed++;
    });
    return metrics;
  }, [tasks]);

  return (
    <div className="">
      {/* Filters & Metrics */}
      <div className="mb-6 bg-white p-4 rounded-lg border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              className="w-full border rounded-md px-3 py-2"
              value={filter.status || ''}
              onChange={e => updateFilter('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="paused">Paused</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <select
              className="w-full border rounded-md px-3 py-2"
              value={filter.type || ''}
              onChange={e => updateFilter('type', e.target.value)}
            >
              <option value="">All Types</option>
              <option value="lead_followup">Lead Follow-up</option>
              <option value="document_generation">Document Generation</option>
              <option value="compliance_check">Compliance Check</option>
              <option value="social_media">Social Media</option>
              <option value="email_campaign">Email Campaign</option>
              <option value="whatsapp_sequence">WhatsApp Sequence</option>
              <option value="market_report">Market Report</option>
            </select>
          </div>
          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Priority</label>
            <select
              className="w-full border rounded-md px-3 py-2"
              value={filter.priority || ''}
              onChange={e => updateFilter('priority', e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          {/* Agent Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Agent</label>
            <select
              className="w-full border rounded-md px-3 py-2"
              value={filter.agent || ''}
              onChange={e => updateFilter('agent', e.target.value)}
            >
              <option value="">All Agents</option>
              <option value="Sarah (Manager Agent)">Sarah (Manager)</option>
              <option value="Alex (Pipeline Coordinator)">Alex (Pipeline)</option>
              <option value="Maya (Campaign Coordinator)">Maya (Campaign)</option>
              <option value="Omar (Lead Qualification)">Omar (Lead Qual)</option>
              <option value="Layla (Follow-up Specialist)">Layla (Follow-up)</option>
              <option value="Ahmed (Appointment Agent)">Ahmed (Appointment)</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-2">
          <div className="flex space-x-2">
            <button
              onClick={refreshTasks}
              disabled={isRefreshing}
              className="flex items-center px-4 py-2 bg-primary-gold text-white rounded-md hover:bg-yellow-600 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </div>
        </div>
        {/* Metrics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(agentMetrics).map(([agent, m]) => (
            <div key={agent} className="bg-neutral-50 p-4 rounded-lg border">
              <div className="font-semibold text-primary-gold mb-1">{agent}</div>
              <div className="flex space-x-4 text-xs">
                <span>Tasks: <strong>{m.total}</strong></span>
                <span>Completed: <strong>{m.completed}</strong></span>
                <span>Failed: <strong>{m.failed}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onRetry={handleRetryTask}
            onClick={openTaskModal}
          />
        ))}
      </div>
      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-500">Try adjusting your filters or check back later.</p>
        </div>
      )}
      {/* Task Details Modal */}
      {showTaskModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg">
            <h3 className="text-lg font-semibold mb-4">{selectedTask.name}</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Description:</strong> {selectedTask.description}</p>
              <p><strong>Status:</strong> {selectedTask.status}</p>
              <p><strong>Type:</strong> {selectedTask.type}</p>
              <p><strong>Priority:</strong> {selectedTask.priority}</p>
              <p><strong>Agent:</strong> {selectedTask.assignedAgent}</p>
              <p><strong>Scheduled At:</strong> {formatTime(selectedTask.scheduledAt)}</p>
              {selectedTask.startedAt && <p><strong>Started At:</strong> {formatTime(selectedTask.startedAt)}</p>}
              {selectedTask.completedAt && <p><strong>Completed At:</strong> {formatTime(selectedTask.completedAt)}</p>}
              <p><strong>Workflow:</strong> {selectedTask.workflow}</p>
              <p><strong>Retries:</strong> {selectedTask.retryCount} / {selectedTask.maxRetries}</p>
              {selectedTask.errorMessage && <p className="text-red-600"><strong>Error:</strong> {selectedTask.errorMessage}</p>}
              <div className="bg-neutral-50 p-2 rounded mt-2">
                <strong>Metadata:</strong>
                <pre className="text-xs mt-1 whitespace-pre-wrap">{JSON.stringify(selectedTask.metadata, null, 2)}</pre>
              </div>
            </div>
            <div className="flex space-x-2 mt-6">
              {selectedTask.status === 'failed' && selectedTask.retryCount < selectedTask.maxRetries && (
                <button
                  className="bg-yellow-500 px-4 py-2 rounded text-white"
                  onClick={() => handleRetryTask(selectedTask.id)}
                >
                  Retry
                </button>
              )}
              <button className="bg-gray-500 px-4 py-2 rounded text-white" onClick={closeTaskModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager; 