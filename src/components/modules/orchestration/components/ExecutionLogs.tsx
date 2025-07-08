import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Search, Download, RefreshCw, Play, Pause, AlertTriangle, CheckCircle2, Info, XCircle, Zap } from 'lucide-react';
import type { ExecutionLog, ExecutionStatus } from '../types';

// Sample log data
const sampleLogs: ExecutionLog[] = [
  { id: 'log-1', executionId: 'exec-001', nodeId: 'n1', timestamp: '2024-07-08T11:00:01+04:00', level: 'info', message: 'Workflow started', data: {} },
  { id: 'log-2', executionId: 'exec-001', nodeId: 'n2', timestamp: '2024-07-08T11:00:03+04:00', level: 'agent', message: 'AI Lead Qualifier: Scoring lead', data: { score: 87 } },
  { id: 'log-3', executionId: 'exec-001', nodeId: 'n3', timestamp: '2024-07-08T11:00:05+04:00', level: 'success', message: 'Email sent to client', data: { email: 'client@dubai.com' } },
  { id: 'log-4', executionId: 'exec-001', nodeId: 'n4', timestamp: '2024-07-08T11:00:07+04:00', level: 'warning', message: 'Appointment slot not available, retrying', data: {} },
  { id: 'log-5', executionId: 'exec-001', nodeId: 'n4', timestamp: '2024-07-08T11:00:09+04:00', level: 'error', message: 'Failed to book appointment', data: { retry: true } },
  { id: 'log-6', executionId: 'exec-001', nodeId: 'n4', timestamp: '2024-07-08T11:00:11+04:00', level: 'success', message: 'Appointment booked after retry', data: { slot: '2024-07-10 14:00' } },
];

const levelColors: Record<string, string> = {
  info: 'text-blue-500',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  error: 'text-red-600',
  agent: 'text-primary-gold',
};
const levelIcons: Record<string, React.ReactNode> = {
  info: <Info className="w-4 h-4" />,
  success: <CheckCircle2 className="w-4 h-4" />,
  warning: <AlertTriangle className="w-4 h-4" />,
  error: <XCircle className="w-4 h-4" />,
  agent: <Zap className="w-4 h-4" />,
};

const ExecutionLogs: React.FC = () => {
  const [logs, setLogs] = useState<ExecutionLog[]>(sampleLogs);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [replaying, setReplaying] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Simulate real-time log updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Add a random log (demo)
      if (Math.random() > 0.7) {
        const newLog: ExecutionLog = {
          id: `log-${Date.now()}`,
          executionId: 'exec-001',
          nodeId: 'n2',
          timestamp: new Date().toISOString(),
          level: ['info', 'success', 'warning', 'error', 'agent'][Math.floor(Math.random() * 5)] as any,
          message: 'Simulated log entry',
          data: {},
        };
        setLogs(prev => [...prev, newLog]);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom on new log
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Filtered logs
  const filteredLogs = logs.filter(log =>
    (filter === 'all' || log.level === filter) &&
    (search === '' || log.message.toLowerCase().includes(search.toLowerCase()))
  );

  // Export logs
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'execution-logs.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Replay execution (demo)
  const handleReplay = () => {
    setReplaying(true);
    setTimeout(() => {
      setLogs(sampleLogs);
      setReplaying(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-lg border p-6 w-full max-w-4xl mx-auto">
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <input
          type="text"
          className="border rounded-md px-3 py-1 text-sm"
          placeholder="Search logs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="border rounded-md px-3 py-1 text-sm"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="all">All Levels</option>
          <option value="info">Info</option>
          <option value="success">Success</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
          <option value="agent">Agent</option>
        </select>
        <button className="ml-auto flex items-center px-3 py-1 bg-primary-gold text-white rounded text-sm hover:bg-yellow-600" onClick={handleExport}>
          <Download className="w-4 h-4 mr-1" /> Export Logs
        </button>
        <button className="flex items-center px-3 py-1 bg-primary-gold text-white rounded text-sm hover:bg-yellow-600" onClick={handleReplay}>
          <RefreshCw className={`w-4 h-4 mr-1 ${replaying ? 'animate-spin' : ''}`} /> Replay
        </button>
      </div>
      {loading && <Loader2 className="w-5 h-5 animate-spin text-primary-gold mx-auto my-4" />}
      <div className="overflow-y-auto max-h-[400px] border rounded bg-gray-50 p-2">
        {filteredLogs.map(log => (
          <div key={log.id} className="flex items-center gap-2 py-1 border-b last:border-b-0">
            <span className={levelColors[log.level] + ' flex items-center'}>{levelIcons[log.level]}</span>
            <span className="text-xs font-mono text-gray-500">{log.timestamp.split('T')[1].slice(0,8)}</span>
            <span className="text-xs font-semibold">{log.level.toUpperCase()}</span>
            <span className="text-xs flex-1">{log.message}</span>
            {log.level === 'error' && (
              <button className="ml-2 px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200">Retry</button>
            )}
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
        <div>Logs: {filteredLogs.length}</div>
        <div>Performance: Avg. Step Time 1.2s (demo)</div>
        <div>Status: <span className="font-bold text-green-600">Live</span></div>
      </div>
    </div>
  );
};

export default ExecutionLogs; 