import React, { useState, useRef } from 'react';
import { Plus, Save, Loader2, Eye, Trash2, Edit, Play, Pause, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Workflow, WorkflowNode, WorkflowConnection, NodeType, AgentType } from '../types';

// --- Sample Node Library ---
const nodeLibrary: Array<{ type: NodeType; label: string; icon: React.ReactNode; agentType?: AgentType }> = [
  { type: 'ai_agent', label: 'Manager Agent', icon: <Zap className="w-4 h-4 text-yellow-500" />, agentType: 'manager' },
  { type: 'ai_agent', label: 'Coordinator Agent', icon: <Zap className="w-4 h-4 text-blue-500" />, agentType: 'coordinator' },
  { type: 'ai_agent', label: 'Specialist Agent', icon: <Zap className="w-4 h-4 text-green-500" />, agentType: 'specialist' },
  { type: 'webhook', label: 'Lead Webhook', icon: <ChevronRight className="w-4 h-4 text-gray-500" /> },
  { type: 'http_request', label: 'HTTP Request', icon: <ChevronRight className="w-4 h-4 text-gray-500" /> },
  { type: 'database_query', label: 'DB Query', icon: <ChevronRight className="w-4 h-4 text-gray-500" /> },
  { type: 'email_send', label: 'Send Email', icon: <ChevronRight className="w-4 h-4 text-gray-500" /> },
  { type: 'property_portal', label: 'Property Portal', icon: <ChevronRight className="w-4 h-4 text-gray-500" /> },
  { type: 'lead_scoring', label: 'Lead Scoring', icon: <ChevronRight className="w-4 h-4 text-gray-500" /> },
  { type: 'client_communication', label: 'Client Communication', icon: <ChevronRight className="w-4 h-4 text-gray-500" /> },
];

// --- Sample Workflow Data ---
const sampleWorkflow: Workflow = {
  id: 'wf-lead-qualification',
  name: 'Lead Qualification Pipeline',
  nodes: [
    { id: 'n1', name: 'WhatsApp Webhook', type: 'webhook', config: { url: '/api/whatsapp' }, position: { x: 80, y: 120 }, enabled: true },
    { id: 'n2', name: 'AI Lead Qualifier', type: 'ai_agent', agentType: 'specialist', config: { prompt: 'Qualify lead' }, position: { x: 300, y: 120 }, enabled: true },
    { id: 'n3', name: 'Send Email', type: 'email_send', config: { to: '', subject: '' }, position: { x: 520, y: 120 }, enabled: true },
    { id: 'n4', name: 'Book Appointment', type: 'client_communication', config: { channel: 'calendar' }, position: { x: 740, y: 120 }, enabled: true },
  ],
  connections: [
    { source: 'n1', target: 'n2' },
    { source: 'n2', target: 'n3' },
    { source: 'n3', target: 'n4' },
  ],
  createdBy: 'admin',
  createdAt: '2024-07-08T10:00:00+04:00',
  updatedAt: '2024-07-08T10:00:00+04:00',
  marketContext: 'dubai_real_estate',
  language: 'ar_en',
  tenantId: 'tenant-001',
};

const WorkflowBuilder: React.FC = () => {
  const [workflow, setWorkflow] = useState<Workflow>(sampleWorkflow);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<{ type: NodeType; agentType?: AgentType } | null>(null);
  const [connecting, setConnecting] = useState<{ from: string | null }>({ from: null });
  const canvasRef = useRef<HTMLDivElement>(null);

  // --- Node Placement ---
  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedNode) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    const x = e.clientX - (rect?.left || 0);
    const y = e.clientY - (rect?.top || 0);
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      name: draggedNode.agentType ? `${draggedNode.agentType.charAt(0).toUpperCase() + draggedNode.agentType.slice(1)} Agent` : draggedNode.type,
      type: draggedNode.type,
      agentType: draggedNode.agentType,
      config: {},
      position: { x, y },
      enabled: true,
    };
    setWorkflow(wf => ({ ...wf, nodes: [...wf.nodes, newNode] }));
    setDraggedNode(null);
  };

  // --- Node Drag Start ---
  const handleNodeDragStart = (node: { type: NodeType; agentType?: AgentType }) => {
    setDraggedNode(node);
  };

  // --- Node Selection ---
  const handleNodeClick = (id: string) => {
    setSelectedNodeId(id);
  };

  // --- Node Connection ---
  const handleStartConnect = (id: string) => {
    setConnecting({ from: id });
  };
  const handleEndConnect = (id: string) => {
    if (connecting.from && connecting.from !== id) {
      setWorkflow(wf => ({ ...wf, connections: [...wf.connections, { source: connecting.from!, target: id }] }));
    }
    setConnecting({ from: null });
  };

  // --- Node Config Update ---
  const handleConfigChange = (key: string, value: any) => {
    if (!selectedNodeId) return;
    setWorkflow(wf => ({
      ...wf,
      nodes: wf.nodes.map(n => n.id === selectedNodeId ? { ...n, config: { ...n.config, [key]: value } } : n)
    }));
  };

  // --- Save/Load ---
  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('orchestration_workflow', JSON.stringify(workflow));
      setLoading(false);
    }, 700);
  };
  const handleLoad = () => {
    setLoading(true);
    setTimeout(() => {
      const stored = localStorage.getItem('orchestration_workflow');
      if (stored) setWorkflow(JSON.parse(stored));
      setLoading(false);
    }, 700);
  };

  // --- Node Delete ---
  const handleDeleteNode = (id: string) => {
    setWorkflow(wf => ({
      ...wf,
      nodes: wf.nodes.filter(n => n.id !== id),
      connections: wf.connections.filter(c => c.source !== id && c.target !== id)
    }));
    setSelectedNodeId(null);
  };

  // --- Render ---
  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Node Library */}
      <div className="md:w-1/5 w-full bg-white rounded-lg border p-4 flex flex-col gap-4">
        <h3 className="text-md font-semibold mb-2">Node Library</h3>
        {nodeLibrary.map(node => (
          <div
            key={node.label}
            className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-yellow-50"
            draggable
            onDragStart={() => handleNodeDragStart(node)}
          >
            {node.icon}
            <span className="text-sm">{node.label}</span>
          </div>
        ))}
        <button className="mt-4 px-3 py-1 bg-primary-gold text-white rounded hover:bg-yellow-600" onClick={handleLoad}>
          <Eye className="w-4 h-4 inline mr-1" /> Load Workflow
        </button>
        <button className="mt-2 px-3 py-1 bg-primary-gold text-white rounded hover:bg-yellow-600" onClick={handleSave}>
          <Save className="w-4 h-4 inline mr-1" /> Save Workflow
        </button>
        {loading && <Loader2 className="w-5 h-5 animate-spin text-primary-gold mx-auto mt-2" />}
        {error && <div className="text-xs text-red-500 mt-2">{error}</div>}
      </div>
      {/* Canvas */}
      <div
        ref={canvasRef}
        className="relative flex-1 bg-gray-50 rounded-lg border min-h-[500px] overflow-auto"
        onDrop={handleCanvasDrop}
        onDragOver={e => e.preventDefault()}
      >
        {/* Connections (simple lines) */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {workflow.connections.map((c, i) => {
            const from = workflow.nodes.find(n => n.id === c.source);
            const to = workflow.nodes.find(n => n.id === c.target);
            if (!from || !to) return null;
            return (
              <line
                key={i}
                x1={from.position.x + 60}
                y1={from.position.y + 30}
                x2={to.position.x + 0}
                y2={to.position.y + 30}
                stroke="#FFD700"
                strokeWidth={2}
                markerEnd="url(#arrowhead)"
              />
            );
          })}
          <defs>
            <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L6,3 z" fill="#FFD700" />
            </marker>
          </defs>
        </svg>
        {/* Nodes */}
        {workflow.nodes.map(node => (
          <div
            key={node.id}
            className={`absolute bg-white border rounded-lg shadow-md p-4 min-w-[120px] cursor-pointer ${selectedNodeId === node.id ? 'ring-2 ring-primary-gold' : ''}`}
            style={{ left: node.position.x, top: node.position.y, zIndex: 2 }}
            onClick={() => handleNodeClick(node.id)}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-sm capitalize">{node.name}</span>
              {node.type === 'ai_agent' && <Zap className="w-4 h-4 text-yellow-500" />}
            </div>
            <div className="flex gap-1">
              <button className="p-1 text-gray-400 hover:text-blue-600" title="Connect" onClick={() => handleStartConnect(node.id)}>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button className="p-1 text-gray-400 hover:text-red-600" title="Delete" onClick={() => handleDeleteNode(node.id)}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            {connecting.from && connecting.from !== node.id && (
              <button className="mt-1 px-2 py-1 bg-primary-gold text-white rounded text-xs" onClick={() => handleEndConnect(node.id)}>
                Connect Here
              </button>
            )}
          </div>
        ))}
      </div>
      {/* Node Config Panel */}
      <div className="md:w-1/4 w-full bg-white rounded-lg border p-4 flex flex-col gap-4">
        <h3 className="text-md font-semibold mb-2">Node Configuration</h3>
        {selectedNodeId ? (
          (() => {
            const node = workflow.nodes.find(n => n.id === selectedNodeId);
            if (!node) return null;
            return (
              <div>
                <div className="mb-2 font-bold text-sm">{node.name}</div>
                {Object.keys(node.config).map(key => (
                  <div key={key} className="mb-2">
                    <label className="block text-xs font-medium mb-1">{key}</label>
                    <input
                      className="w-full border rounded px-2 py-1"
                      value={node.config[key]}
                      onChange={e => handleConfigChange(key, e.target.value)}
                    />
                  </div>
                ))}
                <button
                  className="mt-2 px-3 py-1 bg-primary-gold text-white rounded hover:bg-yellow-600"
                  onClick={() => handleConfigChange('newField', '')}
                >
                  <Plus className="w-4 h-4 inline mr-1" /> Add Config Field
                </button>
              </div>
            );
          })()
        ) : (
          <div className="text-xs text-gray-400">Select a node to configure</div>
        )}
      </div>
    </div>
  );
};

export default WorkflowBuilder; 