import React, { useState } from 'react';
import type { AutomationRule, ResponseTemplate } from '../types';

const sampleRules: AutomationRule[] = [
  {
    id: '1',
    name: 'High Budget Lead Alert',
    trigger: 'New lead with budget > AED 5M',
    conditions: ['budget > 5000000'],
    actions: ['Notify Sarah Al-Mansouri', 'Set priority to high'],
    isActive: true,
    agentAssigned: 'Sarah Al-Mansouri'
  },
  {
    id: '2',
    name: 'Auto-Response for New WhatsApp Leads',
    trigger: 'WhatsApp message received',
    conditions: ['source = whatsapp', 'first_contact = true'],
    actions: ['Send welcome message', 'Schedule follow-up in 2 hours'],
    isActive: true,
    agentAssigned: 'Omar Hassan'
  }
];

const sampleTemplates: ResponseTemplate[] = [
  {
    id: '1',
    name: 'Welcome Message - Arabic',
    type: 'whatsapp',
    language: 'ar',
    content: 'أهلاً وسهلاً بك! شكراً لك على اهتمامك بالعقارات في دبي. سنتواصل معك قريباً.',
    variables: ['{{client_name}}', '{{property_type}}'],
    category: 'welcome'
  },
  {
    id: '2',
    name: 'Viewing Confirmation - English',
    type: 'email',
    language: 'en',
    subject: 'Property Viewing Confirmation - {{property_address}}',
    content: 'Dear {{client_name}}, Your property viewing is confirmed for {{date}} at {{time}}. Address: {{property_address}}. Contact: {{agent_phone}}',
    variables: ['{{client_name}}', '{{date}}', '{{time}}', '{{property_address}}', '{{agent_phone}}'],
    category: 'appointment'
  }
];

const LeadsSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'automation' | 'templates' | 'working_hours'>('automation');
  const [rules, setRules] = useState<AutomationRule[]>(sampleRules);
  const [templates, setTemplates] = useState<ResponseTemplate[]>(sampleTemplates);
  const [loading] = useState(false); // Placeholder for async

  const toggleRule = (ruleId: string) => {
    setRules(rules.map(rule =>
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  if (loading) {
    return <div className="p-8 text-center text-neutral-400">Loading settings...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-2">Lead Management Settings</h2>
        <p className="text-neutral-600">Configure automation rules, templates, and working hours</p>
      </div>
      <div className="flex space-x-4 border-b mb-6">
        {[
          { id: 'automation', name: 'Automation Rules' },
          { id: 'templates', name: 'Response Templates' },
          { id: 'working_hours', name: 'Working Hours' }
        ].map(tab => (
          <button
            key={tab.id}
            className={`pb-2 px-1 font-medium text-sm transition ${
              activeTab === tab.id
                ? 'border-b-2 border-primary-gold text-primary-gold'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
            onClick={() => setActiveTab(tab.id as any)}
          >
            {tab.name}
          </button>
        ))}
      </div>
      {activeTab === 'automation' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-neutral-900">Automation Rules</h3>
            <button className="bg-primary-gold text-white px-4 py-2 rounded hover:bg-primary">
              Add New Rule
            </button>
          </div>
          {rules.map(rule => (
            <div key={rule.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-neutral-900">{rule.name}</h4>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rule.isActive}
                    onChange={() => toggleRule(rule.id)}
                    className="mr-2"
                  />
                  <span className="text-sm text-neutral-600">Active</span>
                </label>
              </div>
              <p className="text-sm text-neutral-600 mb-2">{rule.trigger}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-medium text-neutral-700">Conditions:</span>
                  <ul className="text-neutral-600 mt-1">
                    {rule.conditions.map((condition, i) => (
                      <li key={i}>• {condition}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-medium text-neutral-700">Actions:</span>
                  <ul className="text-neutral-600 mt-1">
                    {rule.actions.map((action, i) => (
                      <li key={i}>• {action}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-2 text-xs text-neutral-500">
                Assigned to: {rule.agentAssigned}
              </div>
            </div>
          ))}
        </div>
      )}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-neutral-900">Response Templates</h3>
            <button className="bg-primary-gold text-white px-4 py-2 rounded hover:bg-primary">
              Add New Template
            </button>
          </div>
          {templates.map(template => (
            <div key={template.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-neutral-900">{template.name}</h4>
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    template.type === 'whatsapp' ? 'bg-green-100 text-green-700' :
                    template.type === 'email' ? 'bg-blue-100 text-blue-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {template.type}
                  </span>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-neutral-100 text-neutral-700">
                    {template.language.toUpperCase()}
                  </span>
                </div>
              </div>
              {template.subject && (
                <div className="mb-2">
                  <span className="text-xs font-medium text-neutral-700">Subject:</span>
                  <p className="text-sm text-neutral-600">{template.subject}</p>
                </div>
              )}
              <div className="mb-2">
                <span className="text-xs font-medium text-neutral-700">Content:</span>
                <p className="text-sm text-neutral-600 bg-neutral-50 p-2 rounded mt-1">
                  {template.content}
                </p>
              </div>
              <div className="mb-2">
                <span className="text-xs font-medium text-neutral-700">Variables:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {template.variables.map((variable, i) => (
                    <span key={i} className="px-2 py-0.5 bg-primary-gold text-white text-xs rounded">
                      {variable}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {activeTab === 'working_hours' && (
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Working Hours Configuration</h3>
          <div className="bg-neutral-50 p-4 rounded-lg">
            <p className="text-neutral-600 mb-4">Configure when AI agents should be active and when to escalate to human agents.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Business Hours</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-20 text-sm">Sunday:</span>
                    <input type="time" value="09:00" className="border rounded px-2 py-1 text-sm" />
                    <span className="text-sm">to</span>
                    <input type="time" value="18:00" className="border rounded px-2 py-1 text-sm" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-20 text-sm">Monday:</span>
                    <input type="time" value="09:00" className="border rounded px-2 py-1 text-sm" />
                    <span className="text-sm">to</span>
                    <input type="time" value="18:00" className="border rounded px-2 py-1 text-sm" />
                  </div>
                  {/* Add other days */}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">AI Response Settings</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" checked className="mr-2" />
                    <span className="text-sm">24/7 AI responses</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" checked className="mr-2" />
                    <span className="text-sm">Escalate high-value leads immediately</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Out-of-hours notification to agents</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <button className="bg-success text-white px-4 py-2 rounded hover:bg-green-700">
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsSettings; 