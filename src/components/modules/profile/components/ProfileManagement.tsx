import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';
import { User, Camera, Loader2, CheckCircle2, XCircle } from 'lucide-react';

const sampleProfile: UserProfile = {
  id: 'user-001',
  name: 'Ahmad Al-Mansouri',
  email: 'ahmad@dubaiproperties.ae',
  phone: '+971 50 123 4567',
  title: 'Senior Property Consultant',
  avatarUrl: '/avatars/ahmad.jpg',
  bio: 'خبرة في سوق دبي العقاري لأكثر من 10 سنوات. متخصص في العقارات الفاخرة والاستثمارية.',
  reraNumber: 'RERA-12345',
  licenseExpiry: '2025-06-30',
  company: 'Dubai Properties Pro',
  language: 'ar_en',
  address: 'Dubai Marina, Dubai, UAE',
};

const ProfileManagement: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(sampleProfile);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  // Handle form field change
  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  // Validate form
  const validate = () => {
    if (!profile.name.trim()) return 'Name is required';
    if (!profile.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) return 'Valid email required';
    if (!profile.phone.match(/^\+971 \d{2} \d{3} \d{4}$/)) return 'Valid UAE phone required';
    if (!profile.reraNumber.trim()) return 'RERA number required';
    return null;
  };

  // Save profile
  const handleSave = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setEditing(false);
      setError(null);
      if (avatarPreview) setProfile(prev => ({ ...prev, avatarUrl: avatarPreview }));
      setTimeout(() => setSuccess(false), 2000);
    }, 1200);
  };

  // Cancel edit
  const handleCancel = () => {
    setProfile(sampleProfile);
    setEditing(false);
    setError(null);
    setAvatarPreview(null);
  };

  return (
    <div className="bg-white rounded-lg border p-6 w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <img
            src={avatarPreview || profile.avatarUrl}
            alt="Avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-primary-gold"
          />
          {editing && (
            <button
              className="absolute bottom-0 right-0 bg-primary-gold text-white rounded-full p-2 shadow hover:bg-yellow-600"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Upload Photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleAvatarChange}
          />
        </div>
        <div>
          <div className="text-xl font-bold">{profile.name}</div>
          <div className="text-sm text-gray-500">{profile.title} @ {profile.company}</div>
          <div className="text-xs text-gray-400">RERA: {profile.reraNumber}</div>
        </div>
        <div className="ml-auto">
          {!editing && (
            <button className="px-3 py-1 bg-primary-gold text-white rounded hover:bg-yellow-600" onClick={() => setEditing(true)}>Edit</button>
          )}
        </div>
      </div>
      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2"
              value={profile.name}
              onChange={e => handleChange('name', e.target.value)}
              disabled={!editing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-md px-3 py-2"
              value={profile.email}
              onChange={e => handleChange('email', e.target.value)}
              disabled={!editing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone (+971)</label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2"
              value={profile.phone}
              onChange={e => handleChange('phone', e.target.value)}
              disabled={!editing}
              placeholder="+971 50 123 4567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2"
              value={profile.title}
              onChange={e => handleChange('title', e.target.value)}
              disabled={!editing}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bio / Professional Description</label>
          <textarea
            className="w-full border rounded-md px-3 py-2"
            value={profile.bio}
            onChange={e => handleChange('bio', e.target.value)}
            disabled={!editing}
            rows={3}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">RERA Number</label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2"
              value={profile.reraNumber}
              onChange={e => handleChange('reraNumber', e.target.value)}
              disabled={!editing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">License Expiry</label>
            <input
              type="date"
              className="w-full border rounded-md px-3 py-2"
              value={profile.licenseExpiry}
              onChange={e => handleChange('licenseExpiry', e.target.value)}
              disabled={!editing}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Company</label>
          <input
            type="text"
            className="w-full border rounded-md px-3 py-2"
            value={profile.company}
            onChange={e => handleChange('company', e.target.value)}
            disabled={!editing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <input
            type="text"
            className="w-full border rounded-md px-3 py-2"
            value={profile.address}
            onChange={e => handleChange('address', e.target.value)}
            disabled={!editing}
          />
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
        {success && <div className="text-xs text-green-600 mt-2">Profile updated successfully!</div>}
      </form>
    </div>
  );
};

export default ProfileManagement; 