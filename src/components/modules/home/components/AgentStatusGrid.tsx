import React from 'react';
import { MessageCircle, Settings, Monitor, PhoneCall, CheckCircle, Circle, User } from 'lucide-react';

export interface AgentStatus {
  id: string;
  name: string;
  type: 'manager' | 'coordinator' | 'basic';
  avatar: string;
  status: 'active' | 'busy' | 'idle';
  currentTask: string;
  tasksToday: number;
  successRate: number;
  capabilities: string[];
}

const statusColor = {
  active: 'bg-success',
  busy: 'bg-warning',
  idle: 'bg-neutral-400',
};

const agents: AgentStatus[] = [
  {
    id: 'sarah',
    name: 'Sarah Al-Mansouri',
    type: 'manager',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    status: 'active',
    currentTask: 'Voice consultation',
    tasksToday: 18,
    successRate: 0.96,
    capabilities: ['Voice', 'Strategic Planning', 'Arabic/English'],
  },
  {
    id: 'omar',
    name: 'Omar Hassan',
    type: 'basic',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    status: 'busy',
    currentTask: 'Processing WhatsApp leads',
    tasksToday: 22,
    successRate: 0.87,
    capabilities: ['WhatsApp', 'Lead Qualification'],
  },
  {
    id: 'alex',
    name: 'Alex Thompson',
    type: 'coordinator',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    status: 'active',
    currentTask: 'Pipeline coordination',
    tasksToday: 15,
    successRate: 0.91,
    capabilities: ['Pipeline', 'Scheduling'],
  },
  {
    id: 'maya',
    name: 'Maya Patel',
    type: 'coordinator',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    status: 'idle',
    currentTask: 'Campaign optimization',
    tasksToday: 10,
    successRate: 0.89,
    capabilities: ['Campaigns', 'Analytics'],
  },
  {
    id: 'layla',
    name: 'Layla Ahmed',
    type: 'basic',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    status: 'active',
    currentTask: 'Follow-up sequences',
    tasksToday: 13,
    successRate: 0.93,
    capabilities: ['Follow-up', 'Arabic'],
  },
  {
    id: 'ahmed',
    name: 'Ahmed Khalil',
    type: 'basic',
    avatar: 'https://randomuser.me/api/portraits/men/77.jpg',
    status: 'busy',
    currentTask: 'Appointment scheduling',
    tasksToday: 11,
    successRate: 0.88,
    capabilities: ['Scheduling', 'Calls'],
  },
];

const AgentStatusGrid: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {agents.map(agent => (
      <div key={agent.id} className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 flex flex-col items-center">
        <div className="relative mb-2">
          <img src={agent.avatar} alt={agent.name} className="w-16 h-16 rounded-full border-2 border-primary-gold object-cover" />
          <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${statusColor[agent.status]}`}></span>
        </div>
        <div className="text-lg font-semibold text-neutral-900 flex items-center">
          {agent.name}
          {agent.type === 'manager' && <span className="ml-2 px-2 py-0.5 text-xs rounded bg-primary-gold text-white">Manager</span>}
          {agent.type === 'coordinator' && <span className="ml-2 px-2 py-0.5 text-xs rounded bg-primary text-white">Coordinator</span>}
        </div>
        <div className="text-sm text-neutral-500 mb-1">{agent.currentTask}</div>
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-xs text-neutral-400">Tasks Today:</span>
          <span className="font-bold text-primary-gold">{agent.tasksToday}</span>
          <span className="text-xs text-neutral-400">Success:</span>
          <span className="font-bold text-success">{Math.round(agent.successRate * 100)}%</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-2">
          {agent.capabilities.map(cap => (
            <span key={cap} className="px-2 py-0.5 text-xs rounded bg-neutral-100 text-neutral-700">{cap}</span>
          ))}
        </div>
        <div className="flex space-x-2 mt-2">
          <button className="p-2 rounded bg-primary-gold text-white hover:bg-primary focus:outline-none" aria-label="Quick Chat"><MessageCircle className="w-4 h-4" /></button>
          <button className="p-2 rounded bg-neutral-200 text-primary-gold hover:bg-neutral-300 focus:outline-none" aria-label="Configure"><Settings className="w-4 h-4" /></button>
          <button className="p-2 rounded bg-neutral-200 text-primary-gold hover:bg-neutral-300 focus:outline-none" aria-label="Monitor"><Monitor className="w-4 h-4" /></button>
          {agent.type === 'manager' && (
            <button className="p-2 rounded bg-success text-white hover:bg-green-700 focus:outline-none" aria-label="Voice Call"><PhoneCall className="w-4 h-4" /></button>
          )}
        </div>
      </div>
    ))}
  </div>
);

export default AgentStatusGrid; 