import React, { useEffect, useState } from 'react';
import { Wifi, Database, Cloud, RefreshCw, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

// Simulated status fetchers (replace with real API/db checks)
const fetchDbStatus = async () => Math.random() > 0.1;
const fetchApiStatus = async () => Math.random() > 0.1;
const fetchSyncStatus = async () => Math.random() > 0.2;

const ConnectionStatus: React.FC = () => {
  const [online, setOnline] = useState(navigator.onLine);
  const [dbStatus, setDbStatus] = useState(true);
  const [apiStatus, setApiStatus] = useState(true);
  const [syncStatus, setSyncStatus] = useState(true);
  const [loading, setLoading] = useState(false);

  // Listen for online/offline
  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Poll status every 10s
  useEffect(() => {
    let mounted = true;
    const poll = async () => {
      setLoading(true);
      const [db, api, sync] = await Promise.all([
        fetchDbStatus(),
        fetchApiStatus(),
        fetchSyncStatus()
      ]);
      if (mounted) {
        setDbStatus(db);
        setApiStatus(api);
        setSyncStatus(sync);
        setLoading(false);
      }
    };
    poll();
    const interval = setInterval(poll, 10000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  return (
    <div className="flex items-center gap-3 text-xs md:text-sm">
      {/* Online/offline */}
      <span className={`flex items-center gap-1 px-2 py-1 rounded-full ${online ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
        title={online ? 'Online' : 'Offline'}
        style={{ minHeight: 32 }}
      >
        <Wifi className={`w-4 h-4 ${online ? 'text-green-500' : 'text-red-500'}`} />
        {online ? 'متصل / Online' : 'غير متصل / Offline'}
      </span>
      {/* DB status */}
      <span className={`flex items-center gap-1 px-2 py-1 rounded-full ${dbStatus ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
        title={dbStatus ? 'Database Connected' : 'Database Disconnected'}
        style={{ minHeight: 32 }}
      >
        <Database className={`w-4 h-4 ${dbStatus ? 'text-green-500' : 'text-red-500'}`} />
        {dbStatus ? 'قاعدة البيانات متصلة' : 'انقطاع قاعدة البيانات'}
      </span>
      {/* API status */}
      <span className={`flex items-center gap-1 px-2 py-1 rounded-full ${apiStatus ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
        title={apiStatus ? 'API Online' : 'API Offline'}
        style={{ minHeight: 32 }}
      >
        <Cloud className={`w-4 h-4 ${apiStatus ? 'text-green-500' : 'text-red-500'}`} />
        {apiStatus ? 'API متصل' : 'API غير متصل'}
      </span>
      {/* Sync status */}
      <span className={`flex items-center gap-1 px-2 py-1 rounded-full ${syncStatus ? 'bg-blue-50 text-blue-700' : 'bg-yellow-50 text-yellow-700'}`}
        title={syncStatus ? 'Synchronized' : 'Sync Issue'}
        style={{ minHeight: 32 }}
      >
        {loading ? <RefreshCw className="w-4 h-4 animate-spin text-blue-400" /> : syncStatus ? <CheckCircle2 className="w-4 h-4 text-blue-500" /> : <AlertTriangle className="w-4 h-4 text-yellow-500" />}
        {syncStatus ? 'متزامن / Synced' : 'مشكلة في التزامن / Sync Issue'}
      </span>
    </div>
  );
};

export default ConnectionStatus; 