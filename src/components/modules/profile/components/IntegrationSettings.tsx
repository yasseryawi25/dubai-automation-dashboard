import React, { useState } from 'react';
import { IntegrationSettings } from '../types';
import { CheckCircle2, XCircle, Loader2, Link2, RefreshCw, HelpCircle } from 'lucide-react';

const sampleIntegrations: IntegrationSettings = {
  userId: 'user-001',
  apiKeys: [
    { name: 'Bayut', key: 'BYT-XXXX-1234', createdAt: '2024-05-01', lastUsed: '2024-06-10' },
    { name: 'Property Finder', key: 'PF-YYYY-5678', createdAt: '2024-05-10', lastUsed: '2024-06-09' },
  ],
  socialConnections: [
    { platform: 'facebook', connected: true, accountName: 'DubaiPropFB', connectedAt: '2024-05-15' },
    { platform: 'instagram', connected: false, accountName: '', connectedAt: '' },
    { platform: 'linkedin', connected: true, accountName: 'DubaiPropLinkedIn', connectedAt: '2024-05-20' },
    { platform: 'tiktok', connected: false, accountName: '', connectedAt: '' },
    { platform: 'twitter', connected: false, accountName: '', connectedAt: '' },
  ],
};

const IntegrationSettingsComponent: React.FC = () => {
  const [integrations, setIntegrations] = useState<IntegrationSettings>(sampleIntegrations);
  const [testing, setTesting] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ [key: string]: boolean | null }>({});
  const [syncing, setSyncing] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  // Simulate test connection
  const handleTest = (name: string) => {
    setTesting(name);
    setTestResult(prev => ({ ...prev, [name]: null }));
    setTimeout(() => {
      setTesting(null);
      setTestResult(prev => ({ ...prev, [name]: Math.random() > 0.2 }));
    }, 1000);
  };

  // Simulate sync
  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 1200);
  };

  return (
    <div className="bg-white rounded-lg border p-6 w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <div className="text-xl font-bold">Integration Settings</div>
        <button className="ml-auto text-primary-gold hover:underline flex items-center gap-1" onClick={() => setHelpOpen(v => !v)}><HelpCircle className="w-4 h-4" /> Help</button>
      </div>
      {helpOpen && (
        <div className="bg-yellow-50 border-l-4 border-primary-gold p-4 mb-4 rounded text-sm">
          <div className="font-semibold mb-1">Integration Help & Tutorials</div>
          <ul className="list-disc pl-5">
            <li>Connect your WhatsApp Business API for instant client messaging.</li>
            <li>Link Instagram, Facebook, LinkedIn for social media automation.</li>
            <li>Integrate Google Calendar for meeting sync.</li>
            <li>Enter API keys for Bayut/Property Finder to auto-publish listings.</li>
            <li>Test connections for real-time feedback.</li>
            <li>All credentials are securely encrypted and never shared.</li>
          </ul>
        </div>
      )}
      <div className="mb-6">
        <div className="font-semibold mb-2">Social Media Connections</div>
        <div className="flex flex-wrap gap-4">
          {integrations.socialConnections.map(conn => (
            <div key={conn.platform} className="flex items-center gap-2 border rounded px-3 py-2 min-w-[160px]">
              <span className="capitalize font-medium">{conn.platform}</span>
              {conn.connected ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-gray-400" />}
              <button className="ml-auto text-xs underline text-primary-gold" onClick={() => handleTest(conn.platform)} disabled={!!testing}>
                {testing === conn.platform ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Test'}
              </button>
              {testResult[conn.platform] === true && <span className="text-green-600 text-xs ml-1">OK</span>}
              {testResult[conn.platform] === false && <span className="text-red-500 text-xs ml-1">Fail</span>}
            </div>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <div className="font-semibold mb-2">API Keys & Property Portals</div>
        <div className="space-y-2">
          {integrations.apiKeys.map(api => (
            <div key={api.name} className="flex items-center gap-2 border rounded px-3 py-2">
              <span className="font-medium">{api.name}</span>
              <span className="text-xs text-gray-500 ml-2">{api.key.replace(/.(?=.{4})/g, '*')}</span>
              <button className="ml-auto text-xs underline text-primary-gold" onClick={() => handleTest(api.name)} disabled={!!testing}>
                {testing === api.name ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Test'}
              </button>
              {testResult[api.name] === true && <span className="text-green-600 text-xs ml-1">OK</span>}
              {testResult[api.name] === false && <span className="text-red-500 text-xs ml-1">Fail</span>}
            </div>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <div className="font-semibold mb-2">Other Integrations</div>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 border rounded px-3 py-2 min-w-[180px]">
            <span>WhatsApp Business</span>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <button className="ml-auto text-xs underline text-primary-gold" onClick={() => handleTest('whatsapp')} disabled={!!testing}>
              {testing === 'whatsapp' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Test'}
            </button>
            {testResult['whatsapp'] === true && <span className="text-green-600 text-xs ml-1">OK</span>}
            {testResult['whatsapp'] === false && <span className="text-red-500 text-xs ml-1">Fail</span>}
          </div>
          <div className="flex items-center gap-2 border rounded px-3 py-2 min-w-[180px]">
            <span>Google Calendar</span>
            <XCircle className="w-4 h-4 text-gray-400" />
            <button className="ml-auto text-xs underline text-primary-gold" onClick={() => handleTest('calendar')} disabled={!!testing}>
              {testing === 'calendar' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Test'}
            </button>
            {testResult['calendar'] === true && <span className="text-green-600 text-xs ml-1">OK</span>}
            {testResult['calendar'] === false && <span className="text-red-500 text-xs ml-1">Fail</span>}
          </div>
          <div className="flex items-center gap-2 border rounded px-3 py-2 min-w-[180px]">
            <span>Email Provider</span>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <button className="ml-auto text-xs underline text-primary-gold" onClick={() => handleTest('email')} disabled={!!testing}>
              {testing === 'email' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Test'}
            </button>
            {testResult['email'] === true && <span className="text-green-600 text-xs ml-1">OK</span>}
            {testResult['email'] === false && <span className="text-red-500 text-xs ml-1">Fail</span>}
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button type="button" className="flex-1 bg-primary-gold text-white py-2 px-4 rounded hover:bg-yellow-600" onClick={handleSync} disabled={syncing}>
          {syncing ? <Loader2 className="w-4 h-4 animate-spin inline mr-1" /> : <RefreshCw className="w-4 h-4 inline mr-1" />} Sync All
        </button>
      </div>
      <div className="text-xs text-gray-400 mt-2">All credentials are securely encrypted and never shared. <span className="text-primary-gold font-semibold">Need help?</span> See the Help section above.</div>
    </div>
  );
};

export default IntegrationSettingsComponent; 