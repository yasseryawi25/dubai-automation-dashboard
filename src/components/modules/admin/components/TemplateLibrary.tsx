import React, { useState, useMemo } from 'react';
import { FileText, Plus, Edit, Trash2, Copy, Eye, Download, Upload, Mail, MessageCircle, Phone, Search } from 'lucide-react';
import type { Template, TemplateFilter } from '../types';

const sampleTemplates: Template[] = [
  {
    id: 'tpl-1',
    name: 'Welcome Message - New Lead (Arabic)',
    description: 'Initial welcome message for Arabic-speaking prospects',
    type: 'whatsapp',
    category: 'welcome',
    language: 'ar',
    content: `مرحباً {{client_name}}! 🏠\n\nشكراً لك على اهتمامك بالعقارات في دبي. أنا {{agent_name}} من فريق وكلاء العقارات المختصين.\n\nلاحظت اهتمامك بـ {{property_type}} في منطقة {{location}}. لدينا خيارات ممتازة تناسب ميزانيتك {{budget}}.\n\nهل يمكنني ترتيب موعد لمعاينة بعض العقارات المناسبة؟\n\nللتواصل المباشر: {{agent_phone}}\nرقم الرخصة: {{rera_number}}`,
    variables: ['{{client_name}}', '{{agent_name}}', '{{property_type}}', '{{location}}', '{{budget}}', '{{agent_phone}}', '{{rera_number}}'],
    isActive: true,
    usageCount: 156,
    lastUsed: '2024-07-08T11:30:00+04:00',
    createdBy: 'Sarah (Manager Agent)',
    version: 2,
    tags: ['welcome', 'arabic', 'whatsapp', 'lead'],
    createdAt: '2024-06-15T10:00:00+04:00',
    updatedAt: '2024-07-01T14:20:00+04:00'
  },
  {
    id: 'tpl-2',
    name: 'Viewing Confirmation Email (English)',
    description: 'Professional viewing appointment confirmation',
    type: 'email',
    category: 'viewing_confirmation',
    language: 'en',
    subject: 'Property Viewing Confirmed - {{property_address}}',
    content: `Dear {{client_name}},\n\nThis email confirms your property viewing appointment:\n\n🏠 Property: {{property_address}}\n📅 Date: {{viewing_date}}\n🕐 Time: {{viewing_time}}\n👨‍💼 Agent: {{agent_name}}\n📱 Contact: {{agent_phone}}\n\nProperty Details:\n- Type: {{property_type}}\n- Size: {{property_size}}\n- Price: AED {{property_price}}\n- Features: {{property_features}}\n\nMeeting Point: {{meeting_location}}\n\nPlease bring a valid ID for the viewing. If you need to reschedule, please contact me at least 2 hours in advance.\n\nLooking forward to showing you this exceptional property!\n\nBest regards,\n{{agent_name}}\n{{agency_name}}\nRERA License: {{rera_number}}`,
    variables: ['{{client_name}}', '{{property_address}}', '{{viewing_date}}', '{{viewing_time}}', '{{agent_name}}', '{{agent_phone}}', '{{property_type}}', '{{property_size}}', '{{property_price}}', '{{property_features}}', '{{meeting_location}}', '{{agency_name}}', '{{rera_number}}'],
    isActive: true,
    usageCount: 89,
    lastUsed: '2024-07-08T09:15:00+04:00',
    createdBy: 'Ahmed (Appointment Agent)',
    version: 1,
    tags: ['viewing', 'confirmation', 'email', 'english'],
    createdAt: '2024-06-20T16:00:00+04:00',
    updatedAt: '2024-06-20T16:00:00+04:00'
  },
  {
    id: 'tpl-3',
    name: 'Investment Opportunity Follow-up',
    description: 'Follow-up template for investment-focused clients',
    type: 'email',
    category: 'follow_up',
    language: 'both',
    subject: 'Exclusive Investment Opportunity - Dubai Real Estate',
    content: `Dear {{client_name}},\n\nI hope this email finds you well. Following our recent conversation about investment opportunities in Dubai, I wanted to share some exciting updates:\n\n🔹 New Off-Plan Project in {{location}}\n✅ Expected ROI: {{expected_roi}}%\n✅ Payment Plan: {{payment_plan}}\n✅ Handover: {{handover_date}}\n✅ Golden Visa Eligible: {{golden_visa_eligible}}\n\nMarket Highlights:\n- Dubai property market up 20% YoY\n- Rental yields averaging 7-8%\n- No property taxes or capital gains tax\n- Strong economic fundamentals\n\nThis opportunity aligns perfectly with your investment criteria:\n- Budget: AED {{budget}}\n- Preferred areas: {{preferred_areas}}\n- Investment timeline: {{timeline}}\n\nI have prepared a detailed investment analysis including:\n📊 ROI projections\n📈 Market comparisons\n📋 Payment schedules\n🏆 Developer track record\n\nWould you like to schedule a call this week to discuss this further?\n\nBest regards,\n{{agent_name}}\nInvestment Property Specialist\n{{agent_phone}} | {{agent_email}}`,
    variables: ['{{client_name}}', '{{location}}', '{{expected_roi}}', '{{payment_plan}}', '{{handover_date}}', '{{golden_visa_eligible}}', '{{budget}}', '{{preferred_areas}}', '{{timeline}}', '{{agent_name}}', '{{agent_phone}}', '{{agent_email}}'],
    isActive: true,
    usageCount: 34,
    lastUsed: '2024-07-07T15:45:00+04:00',
    createdBy: 'Alex (Pipeline Coordinator)',
    version: 3,
    tags: ['investment', 'follow-up', 'roi', 'off-plan'],
    createdAt: '2024-05-30T12:00:00+04:00',
    updatedAt: '2024-07-05T10:30:00+04:00'
  }
  // Add more templates as needed
];

const templateCategories = [
  { id: 'all', name: 'All Templates', count: 0 },
  { id: 'welcome', name: 'Welcome', count: 0 },
  { id: 'follow_up', name: 'Follow-up', count: 0 },
  { id: 'viewing_confirmation', name: 'Viewing Confirmation', count: 0 },
  { id: 'contract', name: 'Contracts', count: 0 },
  { id: 'rera_compliance', name: 'RERA Compliance', count: 0 },
  { id: 'investment', name: 'Investment', count: 0 },
  { id: 'market_update', name: 'Market Updates', count: 0 }
];

const formatTime = (dateString?: string) => {
  if (!dateString) return '';
  return new Intl.DateTimeFormat('en-AE', {
    timeZone: 'Asia/Dubai',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
};

const TemplateCard: React.FC<{
  template: Template;
  onEdit: (template: Template) => void;
  onDelete: (id: string) => void;
  onDuplicate: (template: Template) => void;
  onPreview: (template: Template) => void;
}> = ({ template, onEdit, onDelete, onDuplicate, onPreview }) => {
  const typeIcons = {
    email: <Mail className="w-4 h-4" />,
    whatsapp: <MessageCircle className="w-4 h-4" />,
    sms: <Phone className="w-4 h-4" />,
    document: <FileText className="w-4 h-4" />,
    contract: <FileText className="w-4 h-4" />,
  };
  const languageColors = {
    en: 'bg-blue-100 text-blue-800',
    ar: 'bg-green-100 text-green-800',
    both: 'bg-purple-100 text-purple-800',
  };
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <div className="p-2 bg-gray-100 rounded-md mr-3">{typeIcons[template.type]}</div>
          <div>
            <h3 className="font-semibold text-sm">{template.name}</h3>
            <p className="text-xs text-gray-600 mt-1">{template.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`inline-block px-2 py-1 text-xs rounded-full ${languageColors[template.language]}`}>
            {template.language === 'both' ? 'EN/AR' : template.language.toUpperCase()}
          </span>
          <div className={`w-2 h-2 rounded-full ${template.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
        <div><strong>Type:</strong> {template.type}</div>
        <div><strong>Category:</strong> {template.category.replace('_', ' ')}</div>
        <div><strong>Used:</strong> {template.usageCount} times</div>
        <div><strong>Last used:</strong> {template.lastUsed ? formatTime(template.lastUsed) : 'Never'}</div>
      </div>
      <div className="mb-3">
        <div className="text-xs text-gray-500 mb-1">Variables ({template.variables.length}):</div>
        <div className="flex flex-wrap gap-1">
          {template.variables.slice(0, 3).map(variable => (
            <span key={variable} className="inline-block px-1 py-0.5 bg-gray-100 text-xs rounded">
              {variable}
            </span>
          ))}
          {template.variables.length > 3 && (
            <span className="text-xs text-gray-500">
              +{template.variables.length - 3} more
            </span>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-500">
          v{template.version} • {template.createdBy}
        </div>
        <div className="flex space-x-1">
          <button onClick={() => onPreview(template)} className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded" title="Preview"><Eye className="w-4 h-4" /></button>
          <button onClick={() => onEdit(template)} className="p-1 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded" title="Edit"><Edit className="w-4 h-4" /></button>
          <button onClick={() => onDuplicate(template)} className="p-1 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded" title="Duplicate"><Copy className="w-4 h-4" /></button>
          <button onClick={() => onDelete(template.id)} className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded" title="Delete"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
};

const TemplateLibrary: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>(sampleTemplates);
  const [filter, setFilter] = useState<TemplateFilter>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editorMode, setEditorMode] = useState<'create' | 'edit' | 'view'>('view');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtering logic
  const filteredTemplates = useMemo(() => {
    let result = templates;
    if (selectedCategory !== 'all') {
      result = result.filter(t => t.category === selectedCategory);
    }
    if (filter.type) {
      result = result.filter(t => t.type === filter.type);
    }
    if (filter.language) {
      result = result.filter(t => t.language === filter.language);
    }
    if (filter.isActive !== undefined) {
      result = result.filter(t => t.isActive === filter.isActive);
    }
    if (searchTerm) {
      result = result.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return result;
  }, [templates, selectedCategory, filter, searchTerm]);

  function updateFilter(key: keyof TemplateFilter, value: string) {
    setFilter(prev => ({ ...prev, [key]: value || undefined }));
  }

  function openEditor(mode: 'create' | 'edit' | 'view', template?: Template) {
    setEditorMode(mode);
    setSelectedTemplate(template || null);
    setShowEditor(true);
  }
  function closeEditor() {
    setShowEditor(false);
    setSelectedTemplate(null);
  }

  function handleEditTemplate(template: Template) {
    openEditor('edit', template);
  }
  function handleDeleteTemplate(id: string) {
    setTemplates(prev => prev.filter(t => t.id !== id));
  }
  function handleDuplicateTemplate(template: Template) {
    const newTemplate = { ...template, id: `tpl-${Date.now()}`, name: template.name + ' (Copy)', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setTemplates(prev => [newTemplate, ...prev]);
  }
  function handlePreviewTemplate(template: Template) {
    openEditor('view', template);
  }
  function handleSaveTemplate(template: Template) {
    if (editorMode === 'edit' && selectedTemplate) {
      setTemplates(prev => prev.map(t => t.id === selectedTemplate.id ? { ...template, id: selectedTemplate.id } : t));
    } else if (editorMode === 'create') {
      setTemplates(prev => [{ ...template, id: `tpl-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...prev]);
    }
    closeEditor();
  }

  // Import/export (mock)
  function handleImportTemplates() {
    alert('Import functionality coming soon!');
  }
  function handleExportTemplates() {
    alert('Export functionality coming soon!');
  }

  // Editor modal (simplified for brevity)
  function renderEditor() {
    if (!showEditor || !editorMode) return null;
    const template = selectedTemplate || { name: '', description: '', type: 'email', category: 'welcome', language: 'en', content: '', variables: [], isActive: true, usageCount: 0, createdBy: '', version: 1, tags: [], createdAt: '', updatedAt: '' };
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg">
          <h3 className="text-lg font-semibold mb-4">{editorMode === 'create' ? 'Create Template' : editorMode === 'edit' ? 'Edit Template' : 'Preview Template'}</h3>
          <div className="space-y-2 text-sm">
            <input className="w-full border rounded px-2 py-1 mb-2" placeholder="Template Name" value={template.name} readOnly={editorMode === 'view'} />
            <textarea className="w-full border rounded px-2 py-1 mb-2" placeholder="Description" value={template.description} readOnly={editorMode === 'view'} />
            <textarea className="w-full border rounded px-2 py-1 mb-2" placeholder="Content" value={template.content} readOnly={editorMode === 'view'} rows={6} />
            {/* Variable preview (mock) */}
            <div className="bg-neutral-50 p-2 rounded mt-2">
              <strong>Variables:</strong>
              <div className="flex flex-wrap gap-1 mt-1">
                {template.variables.map((v, i) => (
                  <span key={i} className="px-2 py-0.5 bg-primary-gold text-white text-xs rounded">{v}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex space-x-2 mt-6">
            {editorMode !== 'view' && (
              <button className="bg-primary-gold px-4 py-2 rounded text-white" onClick={() => handleSaveTemplate(template)}>
                Save
              </button>
            )}
            <button className="bg-gray-500 px-4 py-2 rounded text-white" onClick={closeEditor}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header Controls */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search templates..."
                className="pl-10 pr-4 py-2 border rounded-lg w-64"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            </div>
            <select
              className="border rounded-md px-3 py-2"
              value={filter.type || ''}
              onChange={e => updateFilter('type', e.target.value)}
            >
              <option value="">All Types</option>
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="sms">SMS</option>
              <option value="document">Document</option>
              <option value="contract">Contract</option>
            </select>
            <select
              className="border rounded-md px-3 py-2"
              value={filter.language || ''}
              onChange={e => updateFilter('language', e.target.value)}
            >
              <option value="">All Languages</option>
              <option value="en">English</option>
              <option value="ar">Arabic</option>
              <option value="both">Both</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <button className="flex items-center px-4 py-2 border rounded-md hover:bg-gray-50" onClick={handleImportTemplates}>
              <Upload className="w-4 h-4 mr-2" />
              Import
            </button>
            <button className="flex items-center px-4 py-2 border rounded-md hover:bg-gray-50" onClick={handleExportTemplates}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button
              onClick={() => openEditor('create')}
              className="flex items-center px-4 py-2 bg-primary-gold text-white rounded-md hover:bg-yellow-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Template
            </button>
          </div>
        </div>
        {/* Category Tabs */}
        <div className="border-b">
          <div className="flex space-x-8">
            {templateCategories.map(category => {
              const count = category.id === 'all'
                ? templates.length
                : templates.filter(t => t.category === category.id).length;
              return (
                <button
                  key={category.id}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition ${
                    selectedCategory === category.id
                      ? 'border-primary-gold text-primary-gold'
                      : 'border-transparent text-gray-500 hover:text-primary-gold'
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map(template => (
          <TemplateCard
            key={template.id}
            template={template}
            onEdit={handleEditTemplate}
            onDelete={handleDeleteTemplate}
            onDuplicate={handleDuplicateTemplate}
            onPreview={handlePreviewTemplate}
          />
        ))}
      </div>
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-500 mb-4">
            {templates.length === 0
              ? 'Create your first template to get started'
              : 'Try adjusting your filters or search terms'}
          </p>
          {templates.length === 0 && (
            <button
              onClick={() => openEditor('create')}
              className="bg-primary-gold text-white px-4 py-2 rounded-md hover:bg-yellow-600"
            >
              Create Template
            </button>
          )}
        </div>
      )}
      {/* Editor Modal */}
      {renderEditor()}
    </div>
  );
};

export default TemplateLibrary; 