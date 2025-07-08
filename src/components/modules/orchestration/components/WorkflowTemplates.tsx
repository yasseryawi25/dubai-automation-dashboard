import React, { useState } from 'react';
import { Eye, Plus, Loader2, Download, Edit, Zap, Search, Share2, XCircle } from 'lucide-react';
import type { WorkflowTemplate } from '../types';

const categories = [
  'All',
  'Lead Management',
  'Property Marketing',
  'Client Communication',
  'Administrative',
  'Analytics',
];

const sampleTemplates: WorkflowTemplate[] = [
  {
    id: 'tmpl-lead-qual',
    name: 'Lead Qualification & Nurturing',
    description: 'Qualify, score, and nurture Dubai real estate leads with AI agents and automated comms.',
    nodes: [],
    connections: [],
    marketContext: 'dubai_real_estate',
    language: 'ar_en',
    sampleUseCase: 'Website lead → AI scoring → Email/SMS nurture → Agent handoff',
    createdBy: 'admin',
    createdAt: '2024-07-08T10:00:00+04:00',
    category: 'Lead Management',
    stats: { deployed: 12, avgSuccess: 0.92, avgROI: 3.1 },
  } as any,
  {
    id: 'tmpl-property-mkt',
    name: 'Property Marketing Automation',
    description: 'Automate property listing content creation and multi-platform publishing.',
    nodes: [],
    connections: [],
    marketContext: 'dubai_real_estate',
    language: 'ar_en',
    sampleUseCase: 'New listing → AI content → Instagram/Facebook/Portals',
    createdBy: 'admin',
    createdAt: '2024-07-08T10:00:00+04:00',
    category: 'Property Marketing',
    stats: { deployed: 8, avgSuccess: 0.88, avgROI: 2.7 },
  } as any,
  {
    id: 'tmpl-client-comm',
    name: 'Client Onboarding & Support',
    description: 'Onboard new clients, collect docs, and provide support with AI agents.',
    nodes: [],
    connections: [],
    marketContext: 'dubai_real_estate',
    language: 'ar_en',
    sampleUseCase: 'New client → Welcome → Doc collection → Support bot',
    createdBy: 'admin',
    createdAt: '2024-07-08T10:00:00+04:00',
    category: 'Client Communication',
    stats: { deployed: 5, avgSuccess: 0.95, avgROI: 3.8 },
  } as any,
  {
    id: 'tmpl-admin',
    name: 'Document Compliance & Reporting',
    description: 'Automate document processing, compliance checks, and reporting for Dubai RE.',
    nodes: [],
    connections: [],
    marketContext: 'dubai_real_estate',
    language: 'ar_en',
    sampleUseCase: 'Doc upload → Compliance check → Report generation',
    createdBy: 'admin',
    createdAt: '2024-07-08T10:00:00+04:00',
    category: 'Administrative',
    stats: { deployed: 3, avgSuccess: 0.91, avgROI: 2.2 },
  } as any,
  {
    id: 'tmpl-analytics',
    name: 'Performance Analytics & ROI',
    description: 'Track workflow performance, analyze ROI, and optimize automation.',
    nodes: [],
    connections: [],
    marketContext: 'dubai_real_estate',
    language: 'ar_en',
    sampleUseCase: 'Workflow exec → Metrics → ROI dashboard',
    createdBy: 'admin',
    createdAt: '2024-07-08T10:00:00+04:00',
    category: 'Analytics',
    stats: { deployed: 6, avgSuccess: 0.89, avgROI: 2.9 },
  } as any,
];

const WorkflowTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<WorkflowTemplate[]>(sampleTemplates);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<WorkflowTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtered templates
  const filtered = templates.filter(t =>
    (category === 'All' || t.category === category) &&
    (search === '' || t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()))
  );

  // Deploy template (demo)
  const handleDeploy = (tmpl: WorkflowTemplate) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(`Template '${tmpl.name}' deployed!`);
    }, 1000);
  };

  // Create custom template (demo)
  const handleCreate = () => {
    setLoading(true);
    setTimeout(() => {
      setTemplates(prev => [
        ...prev,
        {
          id: `tmpl-${Date.now()}`,
          name: 'Custom Template',
          description: 'Your custom Dubai RE workflow template.',
          nodes: [],
          connections: [],
          marketContext: 'dubai_real_estate',
          language: 'ar_en',
          sampleUseCase: 'Custom use case',
          createdBy: 'user',
          createdAt: new Date().toISOString(),
          category: 'Lead Management',
          stats: { deployed: 0, avgSuccess: 0, avgROI: 0 },
        } as any,
      ]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg border p-6 w-full max-w-5xl mx-auto">
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <select
          className="border rounded-md px-3 py-1 text-sm"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <input
          type="text"
          className="border rounded-md px-3 py-1 text-sm"
          placeholder="Search templates..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="ml-auto flex items-center px-3 py-1 bg-primary-gold text-white rounded text-sm hover:bg-yellow-600" onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-1" /> New Template
        </button>
      </div>
      {loading && <Loader2 className="w-5 h-5 animate-spin text-primary-gold mx-auto my-4" />}
      {error && <div className="text-xs text-red-500 my-2">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(tmpl => (
          <div key={tmpl.id} className="border rounded-lg p-4 flex flex-col gap-2 hover:shadow cursor-pointer" onClick={() => setSelected(tmpl)}>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary-gold" />
              <span className="font-bold text-sm">{tmpl.name}</span>
              <span className="ml-auto text-xs bg-gray-100 px-2 py-0.5 rounded">{tmpl.category}</span>
            </div>
            <div className="text-xs text-gray-500">{tmpl.description}</div>
            <div className="flex gap-2 text-xs mt-2">
              <span className="bg-gray-100 px-2 py-0.5 rounded">Deployed: {tmpl.stats?.deployed ?? 0}</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded">Success: {Math.round((tmpl.stats?.avgSuccess ?? 0) * 100)}%</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded">ROI: {tmpl.stats?.avgROI ?? 0}x</span>
            </div>
            <div className="flex gap-2 mt-2">
              <button className="flex-1 bg-primary-gold text-white py-1 px-2 rounded hover:bg-yellow-600 text-xs" onClick={e => { e.stopPropagation(); handleDeploy(tmpl); }}>Deploy</button>
              <button className="flex-1 border text-primary-gold py-1 px-2 rounded hover:bg-yellow-50 text-xs" onClick={e => { e.stopPropagation(); setSelected(tmpl); }}>Preview</button>
              <button className="flex-1 border text-primary-gold py-1 px-2 rounded hover:bg-yellow-50 text-xs" onClick={e => { e.stopPropagation(); alert('Share coming soon!'); }}><Share2 className="w-4 h-4 inline mr-1" />Share</button>
            </div>
          </div>
        ))}
      </div>
      {/* Template Preview Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              <XCircle className="w-5 h-5" />
            </button>
            <div className="mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary-gold" />
              <span className="font-bold text-lg">{selected.name}</span>
            </div>
            <div className="mb-2 text-xs">Category: {selected.category}</div>
            <div className="mb-2 text-xs">{selected.description}</div>
            <div className="mb-2 text-xs">Use Case: {selected.sampleUseCase}</div>
            <div className="mb-2 text-xs">Deployed: {selected.stats?.deployed ?? 0}</div>
            <div className="mb-2 text-xs">Success: {Math.round((selected.stats?.avgSuccess ?? 0) * 100)}%</div>
            <div className="mb-2 text-xs">ROI: {selected.stats?.avgROI ?? 0}x</div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 bg-primary-gold text-white py-2 px-4 rounded hover:bg-yellow-600" onClick={() => { handleDeploy(selected); setSelected(null); }}>Deploy</button>
              <button className="flex-1 border text-primary-gold py-2 px-4 rounded hover:bg-yellow-50" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowTemplates; 