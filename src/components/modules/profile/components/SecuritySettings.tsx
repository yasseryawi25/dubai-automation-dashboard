import React, { useState } from 'react';
import { SecuritySettings } from '../types';
import { CheckCircle2, XCircle, Loader2, Eye, Key, Download, HelpCircle } from 'lucide-react';

const sampleSecurity: SecuritySettings = {
  userId: 'user-001',
  twoFactorEnabled: true,
  loginHistory: [
    { date: '2024-06-10 09:12', ip: '213.42.21.100', location: 'Dubai, UAE', device: 'Chrome/Windows', success: true },
    { date: '2024-06-09 18:44', ip: '5.32.11.200', location: 'Abu Dhabi, UAE', device: 'Safari/iPhone', success: true },
    { date: '2024-06-08 22:01', ip: '213.42.21.100', location: 'Dubai, UAE', device: 'Chrome/Windows', success: false },
  ],
  lastPasswordReset: '2024-05-30',
};

const SecuritySettingsComponent: React.FC = () => {
  const [security, setSecurity] = useState<SecuritySettings>(sampleSecurity);
  const [apiKeys, setApiKeys] = useState([
    { name: 'Main API', key: 'sk-XXXX-1234', createdAt: '2024-05-01', lastUsed: '2024-06-10' },
  ]);
  const [twoFA, setTwoFA] = useState(security.twoFactorEnabled);
  const [exporting, setExporting] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  // Simulate 2FA toggle
  const handle2FAToggle = () => {
    setTwoFA(v => !v);
    setSecurity(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }));
  };

  // Simulate data export
  const handleExport = () => {
    setExporting(true);
    setTimeout(() => setExporting(false), 1200);
  };

  // Simulate API key creation
  const handleCreateKey = () => {
    setApiKeys(keys => [...keys, { name: `API Key ${keys.length + 1}`, key: `sk-NEW-${Math.random().toString(36).slice(-6)}`, createdAt: new Date().toISOString().slice(0, 10), lastUsed: '' }]);
  };

  // Simulate API key deletion
  const handleDeleteKey = (idx: number) => {
    setApiKeys(keys => keys.filter((_, i) => i !== idx));
  };

  return (
    <div className="bg-white rounded-lg border p-6 w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <div className="text-xl font-bold">Security Settings</div>
        <button className="ml-auto text-primary-gold hover:underline flex items-center gap-1" onClick={() => setHelpOpen(v => !v)}><HelpCircle className="w-4 h-4" /> Help</button>
      </div>
      {helpOpen && (
        <div className="bg-yellow-50 border-l-4 border-primary-gold p-4 mb-4 rounded text-sm">
          <div className="font-semibold mb-1">Security Tips & Account Recovery</div>
          <ul className="list-disc pl-5">
            <li>Enable 2FA for maximum account protection.</li>
            <li>Use strong, unique passwords and change them regularly.</li>
            <li>API keys are sensitive—never share them publicly.</li>
            <li>Export your data securely for backup or compliance.</li>
            <li>Contact support for account recovery or privacy requests.</li>
          </ul>
        </div>
      )}
      <div className="mb-6 flex items-center gap-4">
        <span className="font-semibold">Two-Factor Authentication</span>
        <button className={`px-3 py-1 rounded ${twoFA ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`} onClick={handle2FAToggle}>
          {twoFA ? 'Enabled' : 'Disabled'}
        </button>
        <span className="text-xs text-gray-500 ml-2">{twoFA ? <CheckCircle2 className="w-4 h-4 inline text-green-500" /> : <XCircle className="w-4 h-4 inline text-gray-400" />}</span>
      </div>
      <div className="mb-6">
        <div className="font-semibold mb-2">Login History</div>
        <table className="w-full text-xs border rounded">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2">Date</th>
              <th>IP</th>
              <th>Location</th>
              <th>Device</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {security.loginHistory.map((log, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{log.date}</td>
                <td>{log.ip}</td>
                <td>{log.location}</td>
                <td>{log.device}</td>
                <td>{log.success ? <CheckCircle2 className="w-4 h-4 text-green-500 inline" /> : <XCircle className="w-4 h-4 text-red-500 inline" />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mb-6">
        <div className="font-semibold mb-2 flex items-center gap-2">API Keys <button className="text-xs bg-primary-gold text-white px-2 py-1 rounded" onClick={handleCreateKey}>+ New</button></div>
        <div className="space-y-2">
          {apiKeys.map((api, idx) => (
            <div key={api.key} className="flex items-center gap-2 border rounded px-3 py-2">
              <Key className="w-4 h-4 text-primary-gold" />
              <span className="font-medium">{api.name}</span>
              <span className="text-xs text-gray-500 ml-2">{api.key.replace(/.(?=.{4})/g, '*')}</span>
              <span className="text-xs ml-2">Created: {api.createdAt}</span>
              <span className="text-xs ml-2">Last Used: {api.lastUsed || '-'}</span>
              <button className="ml-auto text-xs underline text-red-500" onClick={() => handleDeleteKey(idx)}><XCircle className="w-4 h-4 inline" /></button>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <div className="font-semibold mb-2">Password & Account Recovery</div>
        <div className="text-xs text-gray-600">Last password reset: <span className="font-semibold">{security.lastPasswordReset}</span></div>
        <div className="text-xs text-gray-600 mt-1">For account recovery, contact <a href="mailto:support@dubaiproperties.ae" className="text-primary-gold underline">support@dubaiproperties.ae</a></div>
      </div>
      <div className="mb-6">
        <div className="font-semibold mb-2">Privacy & Data Export</div>
        <button className="flex items-center gap-2 bg-primary-gold text-white px-4 py-2 rounded hover:bg-yellow-600" onClick={handleExport} disabled={exporting}>
          <Download className="w-4 h-4" /> {exporting ? 'Exporting...' : 'Export My Data'}
        </button>
      </div>
      <div className="text-xs text-gray-400 mt-2">Your data is encrypted and privacy is our top priority. <span className="text-primary-gold font-semibold">Need help?</span> See the Help section above.</div>
    </div>
  );
};

export default SecuritySettingsComponent; 