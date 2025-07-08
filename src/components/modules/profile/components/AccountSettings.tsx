import React, { useState } from 'react';
import { AccountSettings } from '../types';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

const sampleSettings: AccountSettings = {
  userId: 'user-001',
  passwordLastChanged: '2024-06-01',
  emailNotifications: {
    marketing: true,
    workflow: true,
    security: true,
    billing: false,
  },
  language: 'ar_en',
  timezone: 'Asia/Dubai',
  theme: 'light',
  autoLogoutMinutes: 30,
};

const AccountSettingsComponent: React.FC = () => {
  const [settings, setSettings] = useState<AccountSettings>(sampleSettings);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Handle field change
  const handleChange = (field: keyof AccountSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  // Handle notification change
  const handleNotifChange = (field: keyof AccountSettings['emailNotifications'], value: boolean) => {
    setSettings(prev => ({ ...prev, emailNotifications: { ...prev.emailNotifications, [field]: value } }));
  };

  // Validate form
  const validate = () => {
    if (password && password.length < 8) return 'Password must be at least 8 characters';
    if (password && password !== confirmPassword) return 'Passwords do not match';
    return null;
  };

  // Save settings
  const handleSave = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setEditing(false);
      setError(null);
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(false), 2000);
    }, 1200);
  };

  // Cancel edit
  const handleCancel = () => {
    setSettings(sampleSettings);
    setEditing(false);
    setError(null);
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="bg-white rounded-lg border p-6 w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <div className="text-xl font-bold">Account Settings</div>
        <div className="ml-auto">
          {!editing && (
            <button className="px-3 py-1 bg-primary-gold text-white rounded hover:bg-yellow-600" onClick={() => setEditing(true)}>Edit</button>
          )}
        </div>
      </div>
      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Change Password</label>
            <input
              type="password"
              className="w-full border rounded-md px-3 py-2"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={!editing}
              placeholder="New password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              className="w-full border rounded-md px-3 py-2"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              disabled={!editing}
              placeholder="Confirm password"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email Notifications</label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={settings.emailNotifications.marketing} onChange={e => handleNotifChange('marketing', e.target.checked)} disabled={!editing} />
              <span className="text-xs">Marketing</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={settings.emailNotifications.workflow} onChange={e => handleNotifChange('workflow', e.target.checked)} disabled={!editing} />
              <span className="text-xs">Workflow</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={settings.emailNotifications.security} onChange={e => handleNotifChange('security', e.target.checked)} disabled={!editing} />
              <span className="text-xs">Security</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={settings.emailNotifications.billing} onChange={e => handleNotifChange('billing', e.target.checked)} disabled={!editing} />
              <span className="text-xs">Billing</span>
            </label>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Language</label>
            <select
              className="w-full border rounded-md px-3 py-2"
              value={settings.language}
              onChange={e => handleChange('language', e.target.value)}
              disabled={!editing}
            >
              <option value="en">English</option>
              <option value="ar">Arabic</option>
              <option value="ar_en">Arabic/English</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Timezone</label>
            <select
              className="w-full border rounded-md px-3 py-2"
              value={settings.timezone}
              onChange={e => handleChange('timezone', e.target.value)}
              disabled={!editing}
            >
              <option value="Asia/Dubai">UAE (Asia/Dubai)</option>
              <option value="Asia/Abu_Dhabi">Abu Dhabi</option>
              <option value="Asia/Riyadh">Riyadh</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Theme</label>
            <select
              className="w-full border rounded-md px-3 py-2"
              value={settings.theme}
              onChange={e => handleChange('theme', e.target.value)}
              disabled={!editing}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Auto-Logout (minutes)</label>
            <input
              type="number"
              className="w-full border rounded-md px-3 py-2"
              value={settings.autoLogoutMinutes}
              onChange={e => handleChange('autoLogoutMinutes', Number(e.target.value))}
              disabled={!editing}
              min={5}
              max={120}
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          {editing && (
            <>
              <button type="button" className="flex-1 bg-primary-gold text-white py-2 px-4 rounded hover:bg-yellow-600" onClick={handleSave} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin inline mr-1" /> : <CheckCircle2 className="w-4 h-4 inline mr-1" />} Save
              </button>
              <button type="button" className="flex-1 border rounded py-2 px-4 hover:bg-gray-50" onClick={handleCancel} disabled={loading}>
                <XCircle className="w-4 h-4 inline mr-1" /> Cancel
              </button>
            </>
          )}
        </div>
        {error && <div className="text-xs text-red-500 mt-2">{error}</div>}
        {success && <div className="text-xs text-green-600 mt-2">Settings updated successfully!</div>}
      </form>
    </div>
  );
};

export default AccountSettingsComponent; 