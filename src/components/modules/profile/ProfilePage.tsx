import React, { useState } from 'react';
import ProfileManagement from './components/ProfileManagement';
import AccountSettings from './components/AccountSettings';
import BrandingCustomization from './components/BrandingCustomization';
import IntegrationSettings from './components/IntegrationSettings';
import SubscriptionManagement from './components/SubscriptionManagement';
import { useProfile } from './hooks/useProfile';
import { useSubscription } from './hooks/useSubscription';
import { useIntegrations } from './hooks/useIntegrations';

const tabs = [
  { label: 'Profile Management', key: 'profile' },
  { label: 'Account Settings', key: 'account' },
  { label: 'Branding', key: 'branding' },
  { label: 'Integrations', key: 'integrations' },
  { label: 'Subscription', key: 'subscription' },
];

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const profileHook = useProfile();
  const subscriptionHook = useSubscription();
  const integrationsHook = useIntegrations();

  return (
    <div className="max-w-4xl mx-auto py-8 px-2">
      <div className="mb-6">
        <div className="flex gap-2 border-b">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`px-4 py-2 font-semibold border-b-2 transition-colors ${activeTab === tab.key ? 'border-primary-gold text-primary-gold' : 'border-transparent text-gray-500 hover:text-primary-gold'}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        {activeTab === 'profile' && <ProfileManagement />}
        {activeTab === 'account' && <AccountSettings />}
        {activeTab === 'branding' && <BrandingCustomization />}
        {activeTab === 'integrations' && <IntegrationSettings />}
        {activeTab === 'subscription' && <SubscriptionManagement />}
      </div>
    </div>
  );
};

export default ProfilePage; 