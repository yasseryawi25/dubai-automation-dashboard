// Social Media & Content Interfaces
export interface SocialMediaPost {
  id: string;
  title: string;
  content: string;
  media: {
    type: 'image' | 'video' | 'carousel';
    urls: string[];
    thumbnailUrl?: string;
    altText?: string;
  }[];
  platforms: SocialPlatform[];
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduledAt?: string;
  publishedAt?: string;
  propertyId?: string;
  propertyAddress?: string;
  agentId: string;
  agentName: string;
  hashtags: string[];
  mentions: string[];
  language: 'en' | 'ar' | 'both';
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
    clickThroughRate: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SocialPlatform {
  name: 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'tiktok' | 'youtube';
  connected: boolean;
  accountName: string;
  followers: number;
  lastSync: string;
  postingEnabled: boolean;
  analyticsEnabled: boolean;
}

export interface ContentTemplate {
  id: string;
  name: string;
  type: 'property_showcase' | 'market_update' | 'agent_introduction' | 'client_testimonial' | 'investment_tip' | 'area_spotlight';
  platform: SocialPlatform['name'][];
  template: string;
  defaultHashtags: string[];
  language: 'en' | 'ar' | 'both';
  mediaSlots: number;
  isActive: boolean;
  usageCount: number;
  lastUsed?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Property Listing Interfaces
export interface PropertyListing {
  id: string;
  title: string;
  description: string;
  propertyType: 'apartment' | 'villa' | 'townhouse' | 'penthouse' | 'office' | 'retail' | 'plot';
  area: string;
  subArea?: string;
  address: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  price: number;
  currency: 'AED' | 'USD';
  saleType: 'sale' | 'rent';
  specifications: {
    bedrooms?: number;
    bathrooms?: number;
    size: number;
    furnished: 'furnished' | 'unfurnished' | 'semi_furnished';
    parking?: number;
    balcony?: boolean;
    view?: string;
    floor?: number;
    totalFloors?: number;
  };
  amenities: string[];
  media: {
    images: string[];
    videos: string[];
    virtualTour?: string;
    floorPlans: string[];
  };
  agent: {
    id: string;
    name: string;
    phone: string;
    email: string;
    reraNumber: string;
  };
  portals: {
    [key in PropertyPortal]: {
      published: boolean;
      listingId?: string;
      url?: string;
      publishedAt?: string;
      views: number;
      inquiries: number;
      lastUpdated: string;
    };
  };
  seoOptimization: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    slug: string;
  };
  status: 'draft' | 'active' | 'inactive' | 'sold' | 'rented';
  featured: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

export type PropertyPortal = 'bayut' | 'property_finder' | 'dubizzle' | 'website' | 'instagram' | 'facebook';

export interface ListingPerformance {
  listingId: string;
  propertyAddress: string;
  period: 'daily' | 'weekly' | 'monthly';
  metrics: {
    totalViews: number;
    uniqueViews: number;
    inquiries: number;
    phoneClicks: number;
    emailClicks: number;
    whatsappClicks: number;
    viewingRequests: number;
    favoriteCount: number;
    shareCount: number;
  };
  portalBreakdown: {
    [key in PropertyPortal]: {
      views: number;
      inquiries: number;
      conversionRate: number;
    };
  };
  lastUpdated: string;
}

// Marketing Campaign Interfaces
export interface MarketingCampaign {
  id: string;
  name: string;
  type: 'property_promotion' | 'agent_branding' | 'area_marketing' | 'seasonal_campaign' | 'lead_generation';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  objective: 'brand_awareness' | 'lead_generation' | 'property_sales' | 'engagement';
  budget: {
    total: number;
    spent: number;
    currency: 'AED';
    dailyLimit?: number;
  };
  dateRange: {
    startDate: string;
    endDate: string;
  };
  targetAudience: {
    demographics: {
      ageRange: [number, number];
      gender: 'all' | 'male' | 'female';
      interests: string[];
      location: string[];
      languages: string[];
    };
    behaviors: {
      propertyBuyers: boolean;
      investors: boolean;
      renters: boolean;
      firstTimeBuyers: boolean;
    };
  };
  content: {
    creativeAssets: string[];
    copies: {
      headline: string;
      description: string;
      callToAction: string;
    }[];
    landingPageUrl?: string;
  };
  platforms: {
    [key in SocialPlatform['name']]?: {
      enabled: boolean;
      budget: number;
      targeting: any;
      adFormat: string;
    };
  };
  performance: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    cpc: number;
    cpl: number;
    roas: number;
    leads: number;
    sales: number;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Branding & Design Interfaces
export interface BrandingProfile {
  id: string;
  agentId: string;
  agentName: string;
  branding: {
    logo: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
    tagline: string;
    bio: string;
    contactInfo: {
      phone: string;
      email: string;
      whatsapp: string;
      website?: string;
      socialMedia: {
        [key in SocialPlatform['name']]?: string;
      };
    };
  };
  templates: {
    socialMediaFrame: string;
    propertyFlyer: string;
    businessCard: string;
    emailSignature: string;
    watermark: string;
  };
  preferences: {
    autoWatermark: boolean;
    includeBranding: boolean;
    language: 'en' | 'ar' | 'both';
    defaultHashtags: string[];
  };
  usage: {
    postsCreated: number;
    templatesUsed: number;
    lastUsed: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DesignTemplate {
  id: string;
  name: string;
  category: 'social_post' | 'property_flyer' | 'story' | 'carousel' | 'video_template';
  dimensions: {
    width: number;
    height: number;
    ratio: string;
  };
  platform: SocialPlatform['name'][];
  thumbnailUrl: string;
  templateUrl: string;
  variables: string[];
  tags: string[];
  isPremium: boolean;
  downloads: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

// Analytics & Performance Interfaces
export interface MarketingAnalytics {
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  startDate: string;
  endDate: string;
  overview: {
    totalPosts: number;
    totalImpressions: number;
    totalEngagement: number;
    averageEngagementRate: number;
    totalReach: number;
    totalClicks: number;
    totalLeads: number;
    costPerLead: number;
    roi: number;
  };
  platformBreakdown: {
    [key in SocialPlatform['name']]?: {
      posts: number;
      impressions: number;
      engagement: number;
      clicks: number;
      followers: number;
      followerGrowth: number;
    };
  };
  contentPerformance: {
    topPosts: SocialMediaPost[];
    bestPerformingType: ContentTemplate['type'];
    optimalPostingTimes: string[];
    hashtagPerformance: {
      hashtag: string;
      usage: number;
      avgEngagement: number;
    }[];
  };
  audienceInsights: {
    demographics: {
      ageGroups: { range: string; percentage: number }[];
      genderSplit: { male: number; female: number };
      topLocations: { location: string; percentage: number }[];
      languages: { language: string; percentage: number }[];
    };
    interests: string[];
    behaviors: {
      propertyBuyers: number;
      investors: number;
      renters: number;
    };
  };
}

// Filter & Search Interfaces
export interface MarketingFilter {
  dateRange?: {
    start: string;
    end: string;
  };
  status?: string[];
  platforms?: SocialPlatform['name'][];
  contentType?: ContentTemplate['type'][];
  agent?: string;
  propertyArea?: string[];
  campaign?: string;
  engagement?: {
    min: number;
    max: number;
  };
  searchTerm?: string;
}

// Dubai Real Estate Marketing Context
export const DUBAI_HASHTAGS = [
  '#DubaiRealEstate',
  '#DubaiProperties',
  '#DubaiInvestment',
  '#DubaiHomes',
  '#DubaiLife',
  '#UAE',
  '#PropertyInvestment',
  '#LuxuryHomes',
  '#DubaiMarina',
  '#DowntownDubai',
  '#JBR',
  '#BusinessBay',
  '#PalmJumeirah',
  '#DubaiHills',
  '#ArabianRanches',
  '#DIFC',
  '#GoldenVisa',
  '#DubaiVillas',
  '#DubaiApartments',
  '#RealEstateAgent'
] as const;

export const CONTENT_CATEGORIES = [
  'property_showcase',
  'market_update',
  'agent_introduction',
  'client_testimonial',
  'investment_tip',
  'area_spotlight',
  'luxury_lifestyle',
  'market_trends',
  'property_comparison',
  'investment_opportunity'
] as const;

export const MARKETING_OBJECTIVES = [
  'brand_awareness',
  'lead_generation',
  'property_sales',
  'engagement',
  'follower_growth',
  'website_traffic',
  'app_downloads',
  'event_promotion'
] as const;

// Sample Data Constants
export const SAMPLE_PLATFORMS: SocialPlatform[] = [
  {
    name: 'instagram',
    connected: true,
    accountName: '@dubai_realestate_pro',
    followers: 12547,
    lastSync: '2024-07-08T09:30:00+04:00',
    postingEnabled: true,
    analyticsEnabled: true
  },
  {
    name: 'facebook',
    connected: true,
    accountName: 'Dubai Real Estate Professional',
    followers: 8934,
    lastSync: '2024-07-08T09:15:00+04:00',
    postingEnabled: true,
    analyticsEnabled: true
  },
  {
    name: 'linkedin',
    connected: true,
    accountName: 'Ahmad Al-Mansouri',
    followers: 3456,
    lastSync: '2024-07-08T08:45:00+04:00',
    postingEnabled: true,
    analyticsEnabled: true
  },
  {
    name: 'tiktok',
    connected: false,
    accountName: '',
    followers: 0,
    lastSync: '',
    postingEnabled: false,
    analyticsEnabled: false
  }
];

// Marketing Dashboard Stats
export interface MarketingDashboardStats {
  totalPosts: number;
  scheduledPosts: number;
  activeListings: number;
  activeCampaigns: number;
  totalImpressions: number;
  totalEngagement: number;
  leadGenerated: number;
  roi: number;
  topPerformingPlatform: string;
  averageEngagementRate: number;
} 