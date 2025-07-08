import React, { useState, useRef } from 'react';
import { Upload, Eye, Download, Edit, Palette, Type, FileText, User, Mail, Phone, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import type { BrandingProfile, DesignTemplate } from '../types';

// Sample branding profiles (Dubai agent, bilingual)
const sampleProfiles: BrandingProfile[] = [
  {
    id: 'profile-001',
    agentName: 'Ahmad Al-Mansouri',
    company: 'Dubai Properties Pro',
    logoUrl: '/brand/logo.png',
    tagline: 'Your Trusted Dubai Real Estate Expert',
    bio: 'خبرة في سوق دبي العقاري لأكثر من 10 سنوات. متخصص في العقارات الفاخرة والاستثمارية.',
    contact: {
      phone: '+971 50 123 4567',
      email: 'ahmad@dubaiproperties.ae',
      website: 'dubaiproperties.ae',
      address: 'Dubai Marina, Dubai, UAE'
    },
    colors: {
      primary: '#FFD700',
      secondary: '#1A202C',
      accent: '#0099A8'
    },
    fontFamily: 'Tajawal',
    language: 'ar_en'
  }
];

const fontOptions = [
  'Tajawal', 'Cairo', 'Roboto', 'Montserrat', 'Open Sans', 'Lato', 'Noto Sans Arabic'
];

// Sample design templates
const sampleTemplates: DesignTemplate[] = [
  {
    id: 'tmpl-001',
    name: 'Instagram Post',
    type: 'social',
    previewUrl: '/templates/insta-preview.jpg',
    editableFields: ['headline', 'subheadline', 'image', 'cta'],
    platform: 'Instagram',
    aspectRatio: '1:1',
    sampleText: {
      headline: 'Luxury Apartment in Dubai Marina',
      subheadline: 'AED 1.8M | Sea View | Ready to Move',
      cta: 'Contact Ahmad',
      image: '/images/marina-living.jpg'
    }
  },
  {
    id: 'tmpl-002',
    name: 'Property Flyer',
    type: 'flyer',
    previewUrl: '/templates/flyer-preview.jpg',
    editableFields: ['headline', 'details', 'image', 'contact'],
    platform: 'Print',
    aspectRatio: 'A4',
    sampleText: {
      headline: 'Exclusive Villa in Arabian Ranches',
      details: '4BR | 5 Bath | 3500 sqft | AED 4.2M',
      contact: 'Ahmad Al-Mansouri | +971 50 123 4567',
      image: '/images/villa-exterior.jpg'
    }
  },
  {
    id: 'tmpl-003',
    name: 'Business Card',
    type: 'business_card',
    previewUrl: '/templates/card-preview.jpg',
    editableFields: ['name', 'title', 'logo', 'contact'],
    platform: 'Print',
    aspectRatio: '3.5:2',
    sampleText: {
      name: 'Ahmad Al-Mansouri',
      title: 'Senior Property Consultant',
      contact: '+971 50 123 4567',
      logo: '/brand/logo.png'
    }
  },
  {
    id: 'tmpl-004',
    name: 'Email Signature',
    type: 'email_signature',
    previewUrl: '/templates/email-signature-preview.jpg',
    editableFields: ['name', 'title', 'logo', 'contact', 'website'],
    platform: 'Email',
    aspectRatio: 'auto',
    sampleText: {
      name: 'Ahmad Al-Mansouri',
      title: 'Dubai Properties Pro',
      contact: 'ahmad@dubaiproperties.ae',
      website: 'dubaiproperties.ae',
      logo: '/brand/logo.png'
    }
  }
];

const BrandingTools: React.FC = () => {
  const [profile, setProfile] = useState<BrandingProfile>(sampleProfiles[0]);
  const [templates] = useState<DesignTemplate[]>(sampleTemplates);
  const [selectedTemplateIdx, setSelectedTemplateIdx] = useState(0);
  const [beforeAfter, setBeforeAfter] = useState<'after' | 'before'>('after');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handlers
  const handleColorChange = (key: 'primary' | 'secondary' | 'accent', value: string) => {
    setProfile(p => ({ ...p, colors: { ...p.colors, [key]: value } }));
  };
  const handleFontChange = (font: string) => {
    setProfile(p => ({ ...p, fontFamily: font }));
  };
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfile(p => ({ ...p, logoUrl: url }));
    }
  };
  const handleProfileField = (field: string, value: string) => {
    setProfile(p => ({ ...p, [field]: value }));
  };
  const handleContactField = (field: string, value: string) => {
    setProfile(p => ({ ...p, contact: { ...p.contact, [field]: value } }));
  };

  // Download/export (demo)
  const handleDownload = () => {
    alert('Download/export functionality coming soon!');
  };

  // Live preview template rendering (simplified)
  const renderTemplatePreview = (tmpl: DesignTemplate, prof: BrandingProfile) => {
    // For demo, overlay branding on sample image/text
    return (
      <div
        className="relative rounded-lg shadow border overflow-hidden flex flex-col items-center justify-center"
        style={{
          background: prof.colors.primary,
          fontFamily: prof.fontFamily,
          color: prof.colors.secondary,
          minHeight: 220,
          width: '100%',
          maxWidth: 340
        }}
      >
        {/* Logo */}
        <div className="absolute top-2 left-2">
          <img src={prof.logoUrl} alt="Logo" className="h-10 w-10 rounded bg-white border p-1" />
        </div>
        {/* Headline / Name */}
        <div className="mt-8 text-lg font-bold text-center" style={{ color: prof.colors.secondary }}>
          {tmpl.sampleText.headline || tmpl.sampleText.name}
        </div>
        {/* Subheadline / Details */}
        {tmpl.sampleText.subheadline && (
          <div className="text-sm text-center mt-1" style={{ color: prof.colors.accent }}>{tmpl.sampleText.subheadline}</div>
        )}
        {tmpl.sampleText.details && (
          <div className="text-sm text-center mt-1" style={{ color: prof.colors.accent }}>{tmpl.sampleText.details}</div>
        )}
        {/* Image */}
        {tmpl.sampleText.image && (
          <div className="my-2 flex justify-center">
            <img src={tmpl.sampleText.image} alt="Preview" className="h-24 rounded shadow" />
          </div>
        )}
        {/* Contact/CTA */}
        {tmpl.sampleText.cta && (
          <div className="mt-2 text-base font-semibold" style={{ color: prof.colors.secondary }}>{tmpl.sampleText.cta}</div>
        )}
        {tmpl.sampleText.contact && (
          <div className="mt-2 text-xs" style={{ color: prof.colors.secondary }}>{tmpl.sampleText.contact}</div>
        )}
        {/* Website/Email */}
        {tmpl.sampleText.website && (
          <div className="mt-1 text-xs" style={{ color: prof.colors.secondary }}>{tmpl.sampleText.website}</div>
        )}
        {/* Tagline */}
        <div className="absolute bottom-2 left-2 right-2 text-xs text-center" style={{ color: prof.colors.accent }}>
          {prof.tagline}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Customization Controls */}
      <div className="md:w-1/2 w-full bg-white rounded-lg border p-6 flex flex-col gap-6">
        <h2 className="text-lg font-semibold mb-2">Brand Profile Management</h2>
        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">Logo</label>
          <div className="flex items-center gap-3">
            <img src={profile.logoUrl} alt="Logo" className="h-12 w-12 rounded bg-white border p-1" />
            <button
              className="px-3 py-1 border rounded text-sm flex items-center gap-1 hover:bg-gray-50"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4" /> Upload
            </button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleLogoUpload}
            />
          </div>
        </div>
        {/* Color Palette */}
        <div className="flex gap-4">
          {(['primary', 'secondary', 'accent'] as const).map(key => (
            <div key={key}>
              <label className="block text-xs font-medium mb-1 capitalize">{key} Color</label>
              <input
                type="color"
                value={profile.colors[key]}
                onChange={e => handleColorChange(key, e.target.value)}
                className="w-10 h-10 border rounded"
                style={{ background: profile.colors[key] }}
              />
            </div>
          ))}
        </div>
        {/* Font Family */}
        <div>
          <label className="block text-sm font-medium mb-1">Font Family</label>
          <select
            className="border rounded-md px-3 py-2"
            value={profile.fontFamily}
            onChange={e => handleFontChange(e.target.value)}
          >
            {fontOptions.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        {/* Tagline & Bio */}
        <div>
          <label className="block text-sm font-medium mb-1">Tagline</label>
          <input
            type="text"
            className="w-full border rounded-md px-3 py-2 mb-2"
            value={profile.tagline}
            onChange={e => handleProfileField('tagline', e.target.value)}
          />
          <label className="block text-sm font-medium mb-1">Bio (Arabic/English)</label>
          <textarea
            className="w-full border rounded-md px-3 py-2"
            value={profile.bio}
            onChange={e => handleProfileField('bio', e.target.value)}
            rows={2}
          />
        </div>
        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2"
              value={profile.contact.phone}
              onChange={e => handleContactField('phone', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-md px-3 py-2"
              value={profile.contact.email}
              onChange={e => handleContactField('email', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Website</label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2"
              value={profile.contact.website}
              onChange={e => handleContactField('website', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2"
              value={profile.contact.address}
              onChange={e => handleContactField('address', e.target.value)}
            />
          </div>
        </div>
      </div>
      {/* Live Preview & Template Customization */}
      <div className="md:w-1/2 w-full bg-white rounded-lg border p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Live Preview</h2>
          <div className="flex gap-2">
            <button
              className={`px-2 py-1 rounded text-xs border ${beforeAfter === 'after' ? 'bg-primary-gold text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setBeforeAfter('after')}
            >After</button>
            <button
              className={`px-2 py-1 rounded text-xs border ${beforeAfter === 'before' ? 'bg-primary-gold text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setBeforeAfter('before')}
            >Before</button>
          </div>
        </div>
        {/* Template Carousel */}
        <div className="flex items-center gap-2 mb-4">
          <button
            className="p-1 border rounded hover:bg-gray-50"
            onClick={() => setSelectedTemplateIdx(i => (i - 1 + templates.length) % templates.length)}
            aria-label="Previous Template"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 flex flex-col items-center">
            <div className="text-sm font-medium mb-1">{templates[selectedTemplateIdx].name}</div>
            <div className="w-full flex justify-center">
              {beforeAfter === 'after'
                ? renderTemplatePreview(templates[selectedTemplateIdx], profile)
                : <img src={templates[selectedTemplateIdx].previewUrl} alt="Before" className="rounded-lg shadow border max-w-xs" />}
            </div>
          </div>
          <button
            className="p-1 border rounded hover:bg-gray-50"
            onClick={() => setSelectedTemplateIdx(i => (i + 1) % templates.length)}
            aria-label="Next Template"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        {/* Export/Download */}
        <button
          className="flex items-center gap-2 px-4 py-2 bg-primary-gold text-white rounded hover:bg-yellow-600 self-center"
          onClick={handleDownload}
        >
          <Download className="w-4 h-4" /> Download Branded Template
        </button>
        {/* Usage Stats & Sharing (placeholder) */}
        <div className="mt-4 text-xs text-gray-500 text-center">Usage stats and sharing options coming soon.</div>
      </div>
    </div>
  );
};

export default BrandingTools; 