import { useState, useEffect } from 'react';
import { ExportOptions } from './DataExporter';

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
  error?: string;
}

export interface ExportHistory {
  jobs: ExportJob[];
  totalExports: number;
  totalSize: string;
}

export function useDataExport() {
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([]);
  const [currentJob, setCurrentJob] = useState<ExportJob | null>(null);

  // Load export history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('dubai_export_history');
    if (stored) {
      setExportJobs(JSON.parse(stored));
    }
  }, []);

  // Save export history to localStorage
  useEffect(() => {
    localStorage.setItem('dubai_export_history', JSON.stringify(exportJobs));
  }, [exportJobs]);

  // Create new export job
  const createExportJob = (type: string, format: string): ExportJob => {
    const job: ExportJob = {
      id: Date.now().toString(),
      type,
      format,
      status: 'pending',
      progress: 0,
      createdAt: new Date().toISOString()
    };
    setExportJobs(prev => [job, ...prev]);
    return job;
  };

  // Update job progress
  const updateJobProgress = (jobId: string, progress: number) => {
    setExportJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, progress } : job
    ));
  };

  // Complete job
  const completeJob = (jobId: string, downloadUrl: string, fileSize: string) => {
    setExportJobs(prev => prev.map(job => 
      job.id === jobId ? { 
        ...job, 
        status: 'completed', 
        progress: 100,
        completedAt: new Date().toISOString(),
        downloadUrl,
        fileSize
      } : job
    ));
  };

  // Fail job
  const failJob = (jobId: string, error: string) => {
    setExportJobs(prev => prev.map(job => 
      job.id === jobId ? { 
        ...job, 
        status: 'failed', 
        error,
        completedAt: new Date().toISOString()
      } : job
    ));
  };

  // Execute export
  const executeExport = async (
    data: any[],
    options: ExportOptions,
    type: string
  ): Promise<ExportJob> => {
    const job = createExportJob(type, options.format);
    setCurrentJob(job);

    try {
      // Simulate export process
      updateJobProgress(job.id, 10);
      await new Promise(resolve => setTimeout(resolve, 500));

      updateJobProgress(job.id, 30);
      await new Promise(resolve => setTimeout(resolve, 500));

      updateJobProgress(job.id, 60);
      await new Promise(resolve => setTimeout(resolve, 500));

      updateJobProgress(job.id, 90);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Generate download URL (in real app, this would be from backend)
      const downloadUrl = `data:text/csv;charset=utf-8,${encodeURIComponent(
        generateCSV(data, options)
      )}`;
      const fileSize = formatFileSize(data.length * 100); // Simulated size

      completeJob(job.id, downloadUrl, fileSize);
      setCurrentJob(null);
      return job;

    } catch (error) {
      failJob(job.id, error instanceof Error ? error.message : 'Export failed');
      setCurrentJob(null);
      throw error;
    }
  };

  // Generate CSV content
  const generateCSV = (data: any[], options: ExportOptions): string => {
    if (data.length === 0) return '';

    const columns = options.columns || Object.keys(data[0]);
    const headers = columns.join(',');
    const rows = data.map(item => 
      columns.map(col => {
        const value = item[col];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    );

    return [headers, ...rows].join('\n');
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get export history
  const getExportHistory = (): ExportHistory => {
    const completedJobs = exportJobs.filter(job => job.status === 'completed');
    const totalSize = completedJobs.reduce((sum, job) => {
      const size = job.fileSize ? parseInt(job.fileSize.split(' ')[0]) : 0;
      return sum + size;
    }, 0);

    return {
      jobs: exportJobs,
      totalExports: completedJobs.length,
      totalSize: formatFileSize(totalSize * 1024) // Convert to bytes
    };
  };

  // Clear export history
  const clearHistory = () => {
    setExportJobs([]);
    localStorage.removeItem('dubai_export_history');
  };

  // Retry failed job
  const retryJob = async (jobId: string) => {
    const job = exportJobs.find(j => j.id === jobId);
    if (!job) return;

    // Reset job status
    setExportJobs(prev => prev.map(j => 
      j.id === jobId ? { ...j, status: 'pending', progress: 0, error: undefined } : j
    ));

    // Re-execute export (this would need the original data and options)
    // For now, just mark as completed
    setTimeout(() => {
      completeJob(jobId, 'retry-download-url', '1.2 MB');
    }, 2000);
  };

  // Download file
  const downloadFile = (job: ExportJob) => {
    if (!job.downloadUrl) return;

    const link = document.createElement('a');
    link.href = job.downloadUrl;
    link.download = `${job.type}_export_${new Date().toISOString().split('T')[0]}.${job.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    exportJobs,
    currentJob,
    executeExport,
    getExportHistory,
    clearHistory,
    retryJob,
    downloadFile,
    updateJobProgress
  };
} 