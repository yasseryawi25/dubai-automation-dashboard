// User Profile & Settings Types (Dubai Real Estate Platform)

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  title: string;
  avatarUrl: string;
  bio: string;
  reraNumber: string;
  licenseExpiry: string;
  company: string;
  language: 'en' | 'ar' | 'ar_en';
  address: string;
}

export interface AccountSettings {
  userId: string;
  passwordLastChanged: string;
  emailNotifications: {
    marketing: boolean;
    workflow: boolean;
    security: boolean;
    billing: boolean;
  };
  language: 'en' | 'ar' | 'ar_en';
  timezone: 'Asia/Dubai' | string;
  theme: 'light' | 'dark' | 'system';
  autoLogoutMinutes: number;
}

export interface BrandingSettings {
  userId: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  theme: 'light' | 'dark' | 'system';
}

export interface SecuritySettings {
  userId: string;
  twoFactorEnabled: boolean;
  loginHistory: Array<{
    date: string;
    ip: string;
    location: string;
    device: string;
    success: boolean;
  }>;
  lastPasswordReset: string;
}

export interface SubscriptionInfo {
  userId: string;
  plan: 'free' | 'pro' | 'enterprise';
  billingCycle: 'monthly' | 'yearly';
  renewalDate: string;
  usage: {
    workflows: number;
    agents: number;
    executions: number;
    storageMB: number;
  };
  paymentMethod: string;
  status: 'active' | 'past_due' | 'cancelled';
}

export interface IntegrationSettings {
  userId: string;
  apiKeys: Array<{
    name: string;
    key: string;
    createdAt: string;
    lastUsed: string;
  }>;
  socialConnections: Array<{
    platform: 'facebook' | 'linkedin' | 'instagram' | 'tiktok' | 'twitter';
    connected: boolean;
    accountName: string;
    connectedAt: string;
  }>;
} 