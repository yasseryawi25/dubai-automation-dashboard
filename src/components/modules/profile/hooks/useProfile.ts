import { useState, useEffect } from 'react';
import { UserProfile } from '../types';

const LOCAL_KEY = 'dubai_profile';

const defaultProfile: UserProfile = {
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

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    return stored ? JSON.parse(stored) : defaultProfile;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Could fetch from backend for real-time
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(profile));
  }, [profile]);

  // CRUD operations
  const updateProfile = async (updates: Partial<UserProfile>) => {
    setLoading(true);
    setTimeout(() => {
      setProfile(prev => ({ ...prev, ...updates }));
      setLoading(false);
      setError(null);
    }, 800);
  };

  const uploadPhoto = async (file: File) => {
    setLoading(true);
    // Simulate upload
    setTimeout(() => {
      setProfile(prev => ({ ...prev, avatarUrl: URL.createObjectURL(file) }));
      setLoading(false);
    }, 1000);
  };

  return { profile, loading, error, updateProfile, uploadPhoto };
} 