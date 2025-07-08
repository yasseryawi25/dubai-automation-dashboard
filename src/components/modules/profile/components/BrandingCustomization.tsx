import React, { useState, useRef } from 'react';
import { BrandingSettings } from '../types';
import { Loader2, CheckCircle2, XCircle, UploadCloud, Eye } from 'lucide-react';

const fontOptions = [
  { label: 'Dubai', value: 'Dubai' },
  { label: 'Cairo', value: 'Cairo' },
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Tajawal', value: 'Tajawal' },
  { label: 'Montserrat', value: 'Montserrat' },
];

const sampleBranding: BrandingSettings = {
  userId: 'user-001',
  logoUrl: '/logos/dubai-prop-logo.png',
  primaryColor: '#C9B037', // Dubai gold
  secondaryColor: '#1A1A1A',
  accentColor: '#0077B6',
  theme: 'light',
};

const BrandingCustomization: React.FC = () => {
  const [branding, setBranding] = useState<BrandingSettings>(sampleBranding);
  const [font, setFont] = useState('Dubai');
  const [watermark, setWatermark] = useState('Dubai Properties Pro');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle logo upload
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
    }
  };

  // Handle color change
  const handleColorChange = (field: keyof BrandingSettings, value: string) => {
    setBranding(prev => ({ ...prev, [field]: value }));
  };

  // Save branding
  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setEditing(false);
      setError(null);
      if (logoPreview) setBranding(prev => ({ ...prev, logoUrl: logoPreview }));
      setTimeout(() => setSuccess(false), 2000);
    }, 1200);
  };

  // Cancel edit
  const handleCancel = () => {
    setBranding(sampleBranding);
    setFont('Dubai');
    setWatermark('Dubai Properties Pro');
    setEditing(false);
    setError(null);
    setLogoPreview(null);
  };

  // Business card preview
  const BusinessCard = () => (
    <div className="w-64 h-36 rounded-lg shadow border flex flex-col justify-between p-4" style={{ background: branding.primaryColor, color: branding.secondaryColor, fontFamily: font }}>
      <div className="flex items-center gap-2">
        <img src={logoPreview || branding.logoUrl} alt="Logo" className="w-10 h-10 rounded bg-white p-1" />
        <span className="font-bold text-lg">Dubai Properties Pro</span>
      </div>
      <div className="text-xs">Ahmad Al-Mansouri<br/>Senior Property Consultant<br/>+971 50 123 4567</div>
      <div className="text-xs opacity-60">{watermark}</div>
    </div>
  );

  // Email signature preview
  const EmailSignature = () => (
    <div className="border-l-4 pl-3 mt-2" style={{ borderColor: branding.accentColor, fontFamily: font }}>
      <div className="font-bold">Ahmad Al-Mansouri</div>
      <div>Senior Property Consultant</div>
      <div>Dubai Properties Pro</div>
      <div className="text-xs text-gray-500">RERA: 12345 | +971 50 123 4567</div>
      <img src={logoPreview || branding.logoUrl} alt="Logo" className="w-16 mt-1" />
    </div>
  );

  // Social media template preview
  const SocialTemplate = () => (
    <div className="w-48 h-48 rounded-lg shadow flex flex-col items-center justify-center" style={{ background: branding.accentColor, color: branding.theme === 'dark' ? '#fff' : '#222', fontFamily: font }}>
      <img src={logoPreview || branding.logoUrl} alt="Logo" className="w-12 h-12 mb-2 bg-white rounded-full p-1" />
      <div className="font-bold text-lg">Dubai Properties Pro</div>
      <div className="text-xs mt-1">#DubaiRealEstate</div>
      <div className="absolute bottom-2 right-2 text-xs opacity-50">{watermark}</div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg border p-6 w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <div className="text-xl font-bold">Branding Customization</div>
        <div className="ml-auto">
          {!editing && (
            <button className="px-3 py-1 bg-primary-gold text-white rounded hover:bg-yellow-600" onClick={() => setEditing(true)}>Edit</button>
          )}
        </div>
      </div>
      <form className="space-y-4">
        <div className="flex items-center gap-4">
          <img src={logoPreview || branding.logoUrl} alt="Logo" className="w-16 h-16 rounded bg-white border p-1" />
          {editing && (
            <button type="button" className="bg-primary-gold text-white rounded p-2 hover:bg-yellow-600" onClick={() => fileInputRef.current?.click()}><UploadCloud className="w-5 h-5" /></button>
          )}
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleLogoChange} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Primary Color</label>
            <input type="color" value={branding.primaryColor} onChange={e => handleColorChange('primaryColor', e.target.value)} disabled={!editing} className="w-10 h-10 p-0 border-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Secondary Color</label>
            <input type="color" value={branding.secondaryColor} onChange={e => handleColorChange('secondaryColor', e.target.value)} disabled={!editing} className="w-10 h-10 p-0 border-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Accent Color</label>
            <input type="color" value={branding.accentColor} onChange={e => handleColorChange('accentColor', e.target.value)} disabled={!editing} className="w-10 h-10 p-0 border-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Font</label>
          <select className="w-full border rounded-md px-3 py-2" value={font} onChange={e => setFont(e.target.value)} disabled={!editing}>
            {fontOptions.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Watermark</label>
          <input type="text" className="w-full border rounded-md px-3 py-2" value={watermark} onChange={e => setWatermark(e.target.value)} disabled={!editing} />
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          <div>
            <div className="font-semibold mb-1 flex items-center gap-1"><Eye className="w-4 h-4" /> Business Card Preview</div>
            <BusinessCard />
          </div>
          <div>
            <div className="font-semibold mb-1 flex items-center gap-1"><Eye className="w-4 h-4" /> Email Signature</div>
            <EmailSignature />
          </div>
          <div>
            <div className="font-semibold mb-1 flex items-center gap-1"><Eye className="w-4 h-4" /> Social Template</div>
            <SocialTemplate />
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
        {success && <div className="text-xs text-green-600 mt-2">Branding updated successfully!</div>}
      </form>
    </div>
  );
};

export default BrandingCustomization; 