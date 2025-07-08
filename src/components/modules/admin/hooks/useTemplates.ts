import { useState, useEffect, useCallback } from 'react';
import { Template, TemplateFilter } from '../types';

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
  }
  // Add more templates as needed
];

export const useTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 600));
      setTemplates(sampleTemplates);
    } catch (err) {
      setError('Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTemplate = useCallback(async (template: Omit<Template, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'version'>) => {
    try {
      const newTemplate: Template = {
        ...template,
        id: `tpl-${Date.now()}`,
        usageCount: 0,
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setTemplates(prev => [...prev, newTemplate]);
      return newTemplate;
    } catch (err) {
      setError('Failed to create template');
      throw err;
    }
  }, []);

  const updateTemplate = useCallback(async (id: string, updates: Partial<Template>) => {
    try {
      setTemplates(prev => prev.map(template =>
        template.id === id
          ? {
              ...template,
              ...updates,
              version: template.version + 1,
              updatedAt: new Date().toISOString()
            }
          : template
      ));
    } catch (err) {
      setError('Failed to update template');
      throw err;
    }
  }, []);

  const deleteTemplate = useCallback(async (id: string) => {
    try {
      setTemplates(prev => prev.filter(template => template.id !== id));
    } catch (err) {
      setError('Failed to delete template');
      throw err;
    }
  }, []);

  const duplicateTemplate = useCallback(async (template: Template) => {
    try {
      const duplicated: Template = {
        ...template,
        id: `tpl-${Date.now()}`,
        name: `${template.name} (Copy)`,
        usageCount: 0,
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setTemplates(prev => [...prev, duplicated]);
      return duplicated;
    } catch (err) {
      setError('Failed to duplicate template');
      throw err;
    }
  }, []);

  const filterTemplates = useCallback((templates: Template[], filter: TemplateFilter) => {
    return templates.filter(template => {
      if (filter.type && !filter.type.includes(template.type)) return false;
      if (filter.category && !filter.category.includes(template.category)) return false;
      if (filter.language && template.language !== filter.language && template.language !== 'both') return false;
      if (filter.isActive !== undefined && template.isActive !== filter.isActive) return false;
      if (filter.searchTerm) {
        const searchLower = filter.searchTerm.toLowerCase();
        return (
          template.name.toLowerCase().includes(searchLower) ||
          template.description?.toLowerCase().includes(searchLower) ||
          template.content.toLowerCase().includes(searchLower) ||
          template.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      return true;
    });
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return {
    templates,
    loading,
    error,
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    filterTemplates
  };
}; 