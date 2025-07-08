import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, FilePdf, Mail, Clock, CheckCircle2, Loader2 } from 'lucide-react';

export interface ExportOptions {
  format: 'excel' | 'pdf' | 'csv';
  template: 'standard' | 'summary' | 'detailed' | 'custom';
  dateRange?: { start: string; end: string };
  filters?: Record<string, any>;
  columns?: string[];
  language: 'en' | 'ar' | 'both';
  branding?: boolean;
}

export interface ExportJob {
  id: string;
  type: string;
  format: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: string;
  completedAt?: string;
  downloadUrl?: string;
  fileSize?: string;
}

const DataExporter: React.FC<{
  data: any[];
  type: 'leads' | 'properties' | 'campaigns' | 'workflows' | 'analytics';
  onExport: (options: ExportOptions) => Promise<ExportJob>;
}> = ({ data, type, onExport }) => {
  const [options, setOptions] = useState<ExportOptions>({
    format: 'excel',
    template: 'standard',
    language: 'en',
    branding: true
  });
  const [exporting, setExporting] = useState(false);
  const [exportHistory, setExportHistory] = useState<ExportJob[]>([]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const job = await onExport(options);
      setExportHistory(prev => [job, ...prev]);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  const formatIcons = {
    excel: <FileSpreadsheet className="w-5 h-5 text-green-600" />,
    pdf: <FilePdf className="w-5 h-5 text-red-600" />,
    csv: <FileText className="w-5 h-5 text-blue-600" />
  };

  const templates = {
    standard: { label: 'Standard Report', description: 'Basic data export' },
    summary: { label: 'Executive Summary', description: 'Key metrics and insights' },
    detailed: { label: 'Detailed Report', description: 'Comprehensive data analysis' },
    custom: { label: 'Custom Template', description: 'User-defined format' }
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center gap-2 mb-4">
        <Download className="w-5 h-5 text-primary-gold" />
        <h3 className="font-semibold">Export Data</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Export Format</label>
          <div className="flex gap-2">
            {(['excel', 'pdf', 'csv'] as const).map(format => (
              <button
                key={format}
                className={`flex items-center gap-2 px-3 py-2 rounded border ${options.format === format ? 'bg-primary-gold text-white' : 'bg-white'}`}
                onClick={() => setOptions(prev => ({ ...prev, format }))}
              >
                {formatIcons[format]}
                {format.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Template</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={options.template}
            onChange={e => setOptions(prev => ({ ...prev, template: e.target.value as any }))}
          >
            {Object.entries(templates).map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Language</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={options.language}
            onChange={e => setOptions(prev => ({ ...prev, language: e.target.value as any }))}
          >
            <option value="en">English</option>
            <option value="ar">Arabic</option>
            <option value="both">Bilingual</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Date Range</label>
          <div className="flex gap-2">
            <input
              type="date"
              className="flex-1 border rounded px-3 py-2"
              value={options.dateRange?.start || ''}
              onChange={e => setOptions(prev => ({ ...prev, dateRange: { ...prev.dateRange, start: e.target.value } }))}
            />
            <input
              type="date"
              className="flex-1 border rounded px-3 py-2"
              value={options.dateRange?.end || ''}
              onChange={e => setOptions(prev => ({ ...prev, dateRange: { ...prev.dateRange, end: e.target.value } }))}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          id="branding"
          checked={options.branding}
          onChange={e => setOptions(prev => ({ ...prev, branding: e.target.checked }))}
        />
        <label htmlFor="branding" className="text-sm">Include Dubai Properties branding</label>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          className="flex items-center gap-2 bg-primary-gold text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50"
          onClick={handleExport}
          disabled={exporting}
        >
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {exporting ? 'Exporting...' : 'Export Now'}
        </button>
        <button className="flex items-center gap-2 border px-4 py-2 rounded hover:bg-gray-50">
          <Mail className="w-4 h-4" />
          Email Export
        </button>
        <button className="flex items-center gap-2 border px-4 py-2 rounded hover:bg-gray-50">
          <Clock className="w-4 h-4" />
          Schedule Export
        </button>
      </div>

      {exportHistory.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Recent Exports</h4>
          <div className="space-y-2">
            {exportHistory.slice(0, 5).map(job => (
              <div key={job.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  {formatIcons[job.format as keyof typeof formatIcons]}
                  <span className="text-sm">{job.type} - {job.format.toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-2">
                  {job.status === 'completed' && job.downloadUrl && (
                    <a href={job.downloadUrl} className="text-primary-gold hover:underline text-sm">
                      Download
                    </a>
                  )}
                  {job.status === 'processing' && (
                    <div className="flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span className="text-xs">{job.progress}%</span>
                    </div>
                  )}
                  {job.status === 'completed' && (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataExporter; 