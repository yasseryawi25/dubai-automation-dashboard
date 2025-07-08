import React, { useState } from 'react';
import { FileText, Download, Calendar, Settings, Play, Eye, Trash2, TrendingUp, MapPin, Users, DollarSign, Target } from 'lucide-react';
import type { Report } from '../types';
import { CustomPieChart, CustomBarChart, CustomLineChart } from '../charts';

const reportTemplates = [
  {
    id: 'performance',
    name: 'Agent Performance Report',
    description: 'Comprehensive analysis of agent sales performance, conversion rates, and revenue generation',
    icon: <TrendingUp className="w-8 h-8" />, 
    estimatedTime: '2-3 minutes',
    dataPoints: ['Sales Volume', 'Conversion Rates', 'Revenue', 'Client Satisfaction']
  },
  {
    id: 'market_analysis',
    name: 'Dubai Market Analysis',
    description: 'Complete market overview with price trends, demand analysis, and area performance',
    icon: <MapPin className="w-8 h-8" />, 
    estimatedTime: '3-4 minutes',
    dataPoints: ['Price Trends', 'Area Analysis', 'Property Types', 'Investment Opportunities']
  },
  {
    id: 'client_portfolio',
    name: 'Client Portfolio Review',
    description: 'Detailed client investment portfolio with ROI analysis and recommendations',
    icon: <Users className="w-8 h-8" />, 
    estimatedTime: '2-3 minutes',
    dataPoints: ['Portfolio Value', 'ROI Performance', 'Property Distribution', 'Future Projections']
  },
  {
    id: 'roi_analysis',
    name: 'ROI & Financial Analysis',
    description: 'Revenue, costs, profit margins, and automation savings comprehensive analysis',
    icon: <DollarSign className="w-8 h-8" />, 
    estimatedTime: '1-2 minutes',
    dataPoints: ['Revenue Breakdown', 'Cost Analysis', 'Profit Margins', 'Automation Impact']
  },
  {
    id: 'lead_source',
    name: 'Lead Source Performance',
    description: 'Analysis of lead generation sources, conversion rates, and cost-effectiveness',
    icon: <Target className="w-8 h-8" />, 
    estimatedTime: '2-3 minutes',
    dataPoints: ['Source Performance', 'Conversion Rates', 'Cost per Lead', 'Quality Scores']
  }
];

const sampleReports: Report[] = [
  {
    id: 'report-001',
    name: 'Q2 2024 Performance Analysis',
    type: 'performance',
    description: 'Comprehensive agent performance analysis for Q2 2024',
    generatedAt: '2024-07-08T09:30:00+04:00',
    generatedBy: 'Sarah (Manager Agent)',
    format: 'pdf',
    status: 'completed',
    fileSize: 2547328,
    downloadUrl: '/reports/q2-2024-performance.pdf',
    parameters: {
      dateRange: {
        start: '2024-04-01',
        end: '2024-06-30'
      },
      includeCharts: true,
      includeRawData: false,
      agents: ['Sarah (Manager Agent)', 'Alex (Pipeline Coordinator)', 'Omar (Lead Qualification)']
    }
  },
  {
    id: 'report-002',
    name: 'Dubai Market Insights - July 2024',
    type: 'market_analysis',
    description: 'Complete Dubai real estate market analysis for July 2024',
    generatedAt: '2024-07-08T08:15:00+04:00',
    generatedBy: 'Alex (Pipeline Coordinator)',
    format: 'excel',
    status: 'completed',
    fileSize: 1234567,
    downloadUrl: '/reports/dubai-market-july-2024.xlsx',
    parameters: {
      dateRange: {
        start: '2024-07-01',
        end: '2024-07-31'
      },
      includeCharts: true,
      includeRawData: true,
      areas: ['Downtown Dubai', 'Dubai Marina', 'Business Bay', 'JBR'],
      propertyTypes: ['apartment', 'villa', 'townhouse']
    }
  },
  {
    id: 'report-003',
    name: 'ROI Analysis - H1 2024',
    type: 'roi_analysis',
    description: 'First half 2024 ROI and financial performance analysis',
    generatedAt: '2024-07-08T07:45:00+04:00',
    generatedBy: 'Sarah (Manager Agent)',
    format: 'pdf',
    status: 'generating',
    parameters: {
      dateRange: {
        start: '2024-01-01',
        end: '2024-06-30'
      },
      includeCharts: true,
      includeRawData: false
    }
  }
];

function formatDateTime(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleString('en-GB', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
function formatFileSize(size: number) {
  if (size >= 1000000) return `${(size / 1000000).toFixed(1)} MB`;
  if (size >= 1000) return `${(size / 1000).toFixed(0)} KB`;
  return `${size} B`;
}

const ReportsGenerator: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'templates' | 'custom' | 'scheduled' | 'history'>('templates');
  const [reports, setReports] = useState<Report[]>(sampleReports);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  return (
    <div>
      {/* Section Tabs */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setActiveSection('templates')} className={`px-4 py-2 rounded font-medium text-sm transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 ${activeSection === 'templates' ? 'bg-primary-gold text-white' : 'bg-gray-100 text-gray-700 hover:bg-gold-100'}`}>Templates</button>
        <button onClick={() => setActiveSection('custom')} className={`px-4 py-2 rounded font-medium text-sm transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 ${activeSection === 'custom' ? 'bg-primary-gold text-white' : 'bg-gray-100 text-gray-700 hover:bg-gold-100'}`}>Custom Report</button>
        <button onClick={() => setActiveSection('scheduled')} className={`px-4 py-2 rounded font-medium text-sm transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 ${activeSection === 'scheduled' ? 'bg-primary-gold text-white' : 'bg-gray-100 text-gray-700 hover:bg-gold-100'}`}>Scheduled</button>
        <button onClick={() => setActiveSection('history')} className={`px-4 py-2 rounded font-medium text-sm transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 ${activeSection === 'history' ? 'bg-primary-gold text-white' : 'bg-gray-100 text-gray-700 hover:bg-gold-100'}`}>History</button>
      </div>

      {/* Report Templates Gallery */}
      {activeSection === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTemplates.map(template => (
            <div 
              key={template.id}
              className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedTemplate(template.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary-gold bg-opacity-10 rounded-lg">
                  {template.icon}
                </div>
                <span className="text-sm text-gray-500">{template.estimatedTime}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{template.description}</p>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Includes:</h4>
                <div className="flex flex-wrap gap-1">
                  {template.dataPoints.map(point => (
                    <span 
                      key={point}
                      className="inline-block px-2 py-1 bg-gray-100 text-xs rounded-full"
                    >
                      {point}
                    </span>
                  ))}
                </div>
              </div>
              <button className="w-full bg-primary-gold text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors">
                Generate Report
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Custom Report Builder */}
      {activeSection === 'custom' && (
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-6">Custom Report Builder</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Report Configuration</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Report Name</label>
                  <input 
                    type="text" 
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="Enter report name..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Report Type</label>
                  <select className="w-full border rounded-md px-3 py-2">
                    <option value="">Select report type...</option>
                    <option value="performance">Performance Analysis</option>
                    <option value="market">Market Analysis</option>
                    <option value="client">Client Portfolio</option>
                    <option value="roi">ROI Analysis</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Date</label>
                    <input 
                      type="date" 
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">End Date</label>
                    <input 
                      type="date" 
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Export Format</label>
                  <select className="w-full border rounded-md px-3 py-2">
                    <option value="pdf">PDF Document</option>
                    <option value="excel">Excel Spreadsheet</option>
                    <option value="csv">CSV Data File</option>
                    <option value="json">JSON Data</option>
                  </select>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Data Filters</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Dubai Areas</label>
                  <div className="max-h-32 overflow-y-auto border rounded-md p-2">
                    {['Downtown Dubai', 'Dubai Marina', 'Business Bay', 'JBR', 'Palm Jumeirah'].map(area => (
                      <label key={area} className="flex items-center py-1">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">{area}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Property Types</label>
                  <div className="space-y-1">
                    {['Apartment', 'Villa', 'Townhouse', 'Penthouse'].map(type => (
                      <label key={type} className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Agents</label>
                  <select multiple className="w-full border rounded-md px-3 py-2 h-24">
                    <option value="sarah">Sarah (Manager Agent)</option>
                    <option value="alex">Alex (Pipeline Coordinator)</option>
                    <option value="omar">Omar (Lead Qualification)</option>
                    <option value="layla">Layla (Follow-up Specialist)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-4 mt-6">
            <button className="bg-primary-gold text-white px-6 py-2 rounded-md hover:bg-yellow-600">
              Generate Report
            </button>
            <button className="border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-50">
              Save as Template
            </button>
          </div>
        </div>
      )}

      {/* Scheduled Reports (Placeholder) */}
      {activeSection === 'scheduled' && (
        <div className="bg-white p-6 rounded-lg border text-center text-gray-400">
          <Calendar className="w-8 h-8 mx-auto mb-2" />
          <p className="text-lg font-semibold mb-2">Scheduled Reports</p>
          <p>Scheduled report automation coming soon.</p>
        </div>
      )}

      {/* Report History */}
      {activeSection === 'history' && (
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Report History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Report</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Generated</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">By</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Format</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reports.map(report => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <span className="font-medium">{report.name}</span>
                          <div className="text-xs text-gray-500">{report.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="capitalize text-sm">{report.type.replace('_', ' ')}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm">{formatDateTime(report.generatedAt)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">{report.generatedBy}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="uppercase text-sm font-medium">{report.format}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm">{report.fileSize ? formatFileSize(report.fileSize) : '-'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        report.status === 'completed' ? 'bg-green-100 text-green-800' :
                        report.status === 'generating' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-1">
                        {report.status === 'completed' && (
                          <>
                            <button className="p-1 text-gray-400 hover:text-blue-600" title="Preview">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-green-600" title="Download">
                              <Download className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button className="p-1 text-gray-400 hover:text-red-600" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsGenerator; 