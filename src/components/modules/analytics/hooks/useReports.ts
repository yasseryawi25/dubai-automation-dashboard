import { useState, useCallback } from 'react';
import type { Report, AnalyticsFilter } from '../types';

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        agents: ['Sarah (Manager Agent)', 'Alex (Pipeline Coordinator)']
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
        areas: ['Downtown Dubai', 'Dubai Marina', 'Business Bay'],
        propertyTypes: ['apartment', 'villa', 'townhouse']
      }
    }
  ];

  const generateReport = useCallback(async (
    type: Report['type'],
    parameters: Report['parameters'],
    format: Report['format'] = 'pdf'
  ) => {
    try {
      setLoading(true);
      setError(null);
      const newReport: Report = {
        id: `report-${Date.now()}`,
        name: `${type.replace('_', ' ')} Report - ${new Date().toLocaleDateString()}`,
        type,
        description: `Generated ${type.replace('_', ' ')} analysis`,
        generatedAt: new Date().toISOString(),
        generatedBy: 'Current User',
        format,
        status: 'generating',
        parameters
      };
      setReports(prev => [newReport, ...prev]);
      setTimeout(() => {
        setReports(prev => prev.map(report => 
          report.id === newReport.id 
            ? {
                ...report,
                status: 'completed' as const,
                fileSize: Math.floor(Math.random() * 5000000) + 1000000,
                downloadUrl: `/reports/${newReport.id}.${format}`
              }
            : report
        ));
        setLoading(false);
      }, 3000);
    } catch (err) {
      setError('Failed to generate report');
      setLoading(false);
    }
  }, []);

  const deleteReport = useCallback(async (reportId: string) => {
    try {
      setReports(prev => prev.filter(report => report.id !== reportId));
    } catch (err) {
      setError('Failed to delete report');
    }
  }, []);

  const downloadReport = useCallback(async (reportId: string) => {
    try {
      const report = reports.find(r => r.id === reportId);
      if (report && report.downloadUrl) {
        // In real implementation, trigger download
        console.log(`Downloading report: ${report.name}`);
      }
    } catch (err) {
      setError('Failed to download report');
    }
  }, [reports]);

  // Initialize with sample data
  useState(() => {
    setReports(sampleReports);
  });

  return {
    reports,
    loading,
    error,
    generateReport,
    deleteReport,
    downloadReport
  };
}; 