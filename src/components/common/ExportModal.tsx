import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Eye, Download, CheckCircle2, Loader2 } from 'lucide-react';
import { ExportOptions } from './DataExporter';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any[];
  type: string;
  onExport: (options: ExportOptions) => Promise<{ downloadUrl: string }>;
}

const steps = [
  { id: 1, title: 'Select Data', description: 'Choose what to export' },
  { id: 2, title: 'Format & Template', description: 'Select export format' },
  { id: 3, title: 'Preview & Export', description: 'Review and download' }
];

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  data,
  type,
  onExport
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [options, setOptions] = useState<ExportOptions>({
    format: 'excel',
    template: 'standard',
    language: 'en',
    branding: true,
    columns: []
  });
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [exporting, setExporting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string>('');

  const availableColumns = data.length > 0 ? Object.keys(data[0]) : [];

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const result = await onExport({ ...options, columns: selectedColumns, filters });
      setDownloadUrl(result.downloadUrl);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  const filteredData = data.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return item[key]?.toString().toLowerCase().includes(value.toLowerCase());
    });
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Export {type}</h2>
            <p className="text-gray-500">Step {currentStep} of 3</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            style={{ minWidth: 44, minHeight: 44 }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center p-4 bg-gray-50">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= step.id ? 'bg-primary-gold text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : step.id}
              </div>
              <div className="ml-2">
                <div className="text-sm font-medium">{step.title}</div>
                <div className="text-xs text-gray-500">{step.description}</div>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight className="w-5 h-5 text-gray-400 mx-4" />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Select Columns</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableColumns.map(column => (
                    <label key={column} className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes(column)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedColumns([...selectedColumns, column]);
                          } else {
                            setSelectedColumns(selectedColumns.filter(c => c !== column));
                          }
                        }}
                      />
                      <span className="text-sm">{column}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Apply Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableColumns.slice(0, 4).map(column => (
                    <div key={column}>
                      <label className="block text-sm font-medium mb-1">{column}</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        placeholder={`Filter by ${column}...`}
                        value={filters[column] || ''}
                        onChange={(e) => setFilters({ ...filters, [column]: e.target.value })}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Data Preview ({filteredData.length} items)</h3>
                <div className="border rounded overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          {selectedColumns.map(column => (
                            <th key={column} className="px-3 py-2 text-left">{column}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.slice(0, 5).map((item, index) => (
                          <tr key={index} className="border-t">
                            {selectedColumns.map(column => (
                              <td key={column} className="px-3 py-2">{item[column]}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Export Format</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(['excel', 'pdf', 'csv'] as const).map(format => (
                    <button
                      key={format}
                      className={`p-4 border rounded-lg text-left ${
                        options.format === format ? 'border-primary-gold bg-primary-gold text-white' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setOptions(prev => ({ ...prev, format }))}
                    >
                      <div className="font-medium">{format.toUpperCase()}</div>
                      <div className="text-sm opacity-75">
                        {format === 'excel' && 'Spreadsheet with formatting'}
                        {format === 'pdf' && 'Professional report layout'}
                        {format === 'csv' && 'Simple data export'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Template</h3>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={options.template}
                  onChange={(e) => setOptions(prev => ({ ...prev, template: e.target.value as any }))}
                >
                  <option value="standard">Standard Report</option>
                  <option value="summary">Executive Summary</option>
                  <option value="detailed">Detailed Report</option>
                  <option value="custom">Custom Template</option>
                </select>
              </div>

              <div>
                <h3 className="font-medium mb-3">Language</h3>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={options.language}
                  onChange={(e) => setOptions(prev => ({ ...prev, language: e.target.value as any }))}
                >
                  <option value="en">English</option>
                  <option value="ar">Arabic</option>
                  <option value="both">Bilingual</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={options.branding}
                    onChange={(e) => setOptions(prev => ({ ...prev, branding: e.target.checked }))}
                  />
                  <span>Include Dubai Properties branding</span>
                </label>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                {exporting ? (
                  <div className="space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary-gold" />
                    <div className="font-medium">Generating export...</div>
                    <div className="text-sm text-gray-500">This may take a few moments</div>
                  </div>
                ) : downloadUrl ? (
                  <div className="space-y-4">
                    <CheckCircle2 className="w-12 h-12 mx-auto text-green-500" />
                    <div className="font-medium">Export completed!</div>
                    <a
                      href={downloadUrl}
                      download
                      className="inline-flex items-center gap-2 bg-primary-gold text-white px-6 py-3 rounded-lg hover:bg-yellow-600"
                    >
                      <Download className="w-5 h-5" />
                      Download File
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="font-medium">Ready to export</div>
                    <div className="text-sm text-gray-500">
                      {filteredData.length} items will be exported as {options.format.toUpperCase()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 bg-primary-gold text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleExport}
                disabled={exporting}
                className="flex items-center gap-2 bg-primary-gold text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50"
              >
                {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Export
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal; 