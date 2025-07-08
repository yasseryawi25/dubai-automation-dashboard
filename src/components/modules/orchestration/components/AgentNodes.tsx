import React, { useState, useEffect } from 'react';
import { Zap, User, Phone, Mail, Calendar, MessageCircle, Loader2, CheckCircle2, AlertTriangle, XCircle, Globe, Users } from 'lucide-react';
import type { AgentType } from '../types';

const agentTypes: { type: AgentType; label: string; desc: string; color: string }[] = [
  { type: 'manager', label: 'Manager Agent', desc: 'Strategic decisions, voice calls', color: 'bg-yellow-200' },
  { type: 'coordinator', label: 'Coordinator Agent', desc: 'Multi-workflow orchestration', color: 'bg-blue-200' },
  { type: 'specialist', label: 'Lead Agent', desc: 'Lead qualification and scoring', color: 'bg-green-200' },
  { type: 'notifier', label: 'Follow-up Agent', desc: 'Automated nurturing sequences', color: 'bg-purple-200' },
  { type: 'custom', label: 'Marketing Agent', desc: 'Content creation and publishing', color: 'bg-pink-200' },
  { type: 'custom', label: 'Appointment Agent', desc: 'Calendar management and scheduling', color: 'bg-orange-200' },
];

// Sample agent status and metrics
const sampleAgents = [
  {
    id: 'agent-001',
    type: 'manager',
    name: 'Manager Agent',
    status: 'active',
    tasks: 3,
    successRate: 0.98,
    lastAction: '2024-07-08T11:00:00+04:00',
    language: 'ar_en',
    commLogs: [
      { id: 'log-1', type: 'call', message: 'Called client for deal closure', time: '2024-07-08T10:50:00+04:00' },
      { id: 'log-2', type: 'decision', message: 'Approved lead assignment', time: '2024-07-08T10:55:00+04:00' },
    ],
    errors: [],
  },
  {
    id: 'agent-002',
    type: 'coordinator',
    name: 'Coordinator Agent',
    status: 'active',
    tasks: 5,
    successRate: 0.93,
    lastAction: '2024-07-08T10:59:00+04:00',
    language: 'ar_en',
    commLogs: [
      { id: 'log-3', type: 'coordination', message: 'Orchestrated property marketing workflow', time: '2024-07-08T10:58:00+04:00' },
    ],
    errors: [],
  },
  {
    id: 'agent-003',
    type: 'specialist',
    name: 'Lead Agent',
    status: 'error',
    tasks: 2,
    successRate: 0.85,
    lastAction: '2024-07-08T10:57:00+04:00',
    language: 'ar_en',
    commLogs: [
      { id: 'log-4', type: 'qualification', message: 'Scored lead: 87', time: '2024-07-08T10:56:00+04:00' },
    ],
    errors: [
      { id: 'err-1', message: 'Failed to access CRM API', time: '2024-07-08T10:57:00+04:00', retry: true },
    ],
  },
];

const statusColors: Record<string, string> = {
  active: 'text-green-600',
  error: 'text-red-600',
  paused: 'text-yellow-600',
};

const AgentNodes: React.FC = () => {
  const [agents, setAgents] = useState<any[]>(sampleAgents);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Simulate real-time status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        if (agent.status === 'active' && Math.random() > 0.8) {
          return { ...agent, tasks: agent.tasks + 1, lastAction: new Date().toISOString() };
        }
        return agent;
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filtered agents
  const filteredAgents = agents.filter(a =>
    (filter === 'all' || a.type === filter) &&
    (search === '' || a.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-lg border p-6 w-full max-w-4xl mx-auto">
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <select
          className="border rounded-md px-3 py-1 text-sm"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="all">All Agents</option>
          {agentTypes.map(a => <option key={a.type} value={a.type}>{a.label}</option>)}
        </select>
        <input
          type="text"
          className="border rounded-md px-3 py-1 text-sm"
          placeholder="Search agents..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {loading && <Loader2 className="w-5 h-5 animate-spin text-primary-gold mx-auto my-4" />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAgents.map(agent => (
          <div key={agent.id} className={`border rounded-lg p-4 flex flex-col gap-2 ${agent.status === 'error' ? 'border-red-400' : 'border-gray-200'}`}>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary-gold" />
              <span className="font-bold text-sm">{agent.name}</span>
              <span className={`ml-auto text-xs font-semibold ${statusColors[agent.status]}`}>{agent.status.toUpperCase()}</span>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="bg-gray-100 px-2 py-0.5 rounded">Tasks: {agent.tasks}</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded">Success: {(agent.successRate * 100).toFixed(0)}%</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded">Lang: {agent.language}</span>
            </div>
            <div className="text-xs text-gray-500">Last Action: {agent.lastAction.replace('T', ' ').slice(0, 16)}</div>
            <div className="flex gap-2 mt-2">
              <button className="px-2 py-1 bg-primary-gold text-white rounded text-xs hover:bg-yellow-600" onClick={() => setSelectedAgentId(agent.id)}>View Details</button>
              {agent.status === 'error' && (
                <button className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200">Retry</button>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Agent Details Panel */}
      {selectedAgentId && (() => {
        const agent = agents.find(a => a.id === selectedAgentId);
        if (!agent) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                onClick={() => setSelectedAgentId(null)}
                aria-label="Close"
              >
                <XCircle className="w-5 h-5" />
              </button>
              <div className="mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary-gold" />
                <span className="font-bold text-lg">{agent.name}</span>
                <span className={`ml-auto text-xs font-semibold ${statusColors[agent.status]}`}>{agent.status.toUpperCase()}</span>
              </div>
              <div className="mb-2 text-xs">Type: {agent.type}</div>
              <div className="mb-2 text-xs">Success Rate: {(agent.successRate * 100).toFixed(0)}%</div>
              <div className="mb-2 text-xs">Language: {agent.language}</div>
              <div className="mb-2 text-xs">Last Action: {agent.lastAction.replace('T', ' ').slice(0, 16)}</div>
              <div className="mb-2 text-xs font-semibold">Communication Logs:</div>
              <div className="mb-2 max-h-32 overflow-y-auto border rounded p-2 bg-gray-50">
                {agent.commLogs.map((log: any) => (
                  <div key={log.id} className="flex items-center gap-2 text-xs mb-1">
                    <MessageCircle className="w-3 h-3 text-primary-gold" />
                    <span>{log.message}</span>
                    <span className="ml-auto text-gray-400">{log.time.replace('T', ' ').slice(0, 16)}</span>
                  </div>
                ))}
              </div>
              {agent.errors.length > 0 && (
                <div className="mb-2 text-xs font-semibold text-red-600">Errors:</div>
              )}
              {agent.errors.map((err: any) => (
                <div key={err.id} className="flex items-center gap-2 text-xs mb-1">
                  <AlertTriangle className="w-3 h-3 text-red-500" />
                  <span>{err.message}</span>
                  <span className="ml-auto text-gray-400">{err.time.replace('T', ' ').slice(0, 16)}</span>
                  {err.retry && <button className="ml-2 px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200">Retry</button>}
                </div>
              ))}
              <div className="mt-4 flex gap-2">
                <button className="flex-1 bg-primary-gold text-white py-2 px-4 rounded hover:bg-yellow-600" onClick={() => setSelectedAgentId(null)}>Close</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default AgentNodes; 