// Analytics Data Interfaces
export interface DataSource {
  id: string;
  name: string;
  type: 'crm' | 'property_portal' | 'social_media' | 'email' | 'whatsapp' | 'calendar' | 'financial';
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  lastSync: string;
  errorMessage?: string;
  recordCount: number;
  syncFrequency: 'real_time' | 'hourly' | 'daily' | 'weekly';
  healthScore: number; // 0-100
  integrationDetails: {
    provider: string;
    apiVersion?: string;
    endpoint?: string;
    credentials?: string;
  };
}

export interface ROIMetrics {
  totalRevenue: number;
  totalCosts: number;
  netProfit: number;
  profitMargin: number;
  roi: number; // percentage
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate: string;
  breakdown: {
    commissions: number;
    operationalCosts: number;
    marketingSpend: number;
    toolingCosts: number;
    automationSavings: number;
  };
}

export interface MarketInsight {
  id: string;
  area: string;
  propertyType: 'apartment' | 'villa' | 'townhouse' | 'penthouse' | 'office' | 'retail';
  averagePrice: number;
  priceChange: number; // percentage change
  averageRent: number;
  rentalYield: number;
  demandLevel: 'low' | 'medium' | 'high' | 'very_high';
  supplyLevel: 'low' | 'medium' | 'high' | 'oversupply';
  transactionVolume: number;
  daysOnMarket: number;
  pricePerSqFt: number;
  lastUpdated: string;
  forecast: {
    nextQuarterPrice: number;
    nextQuarterVolume: number;
    confidence: number; // 0-100
  };
}

export interface ClientPortfolio {
  clientId: string;
  clientName: string;
  clientType: 'individual' | 'investor' | 'developer' | 'corporate';
  totalInvestment: number;
  portfolioValue: number;
  totalROI: number;
  properties: {
    id: string;
    address: string;
    type: string;
    purchasePrice: number;
    currentValue: number;
    rentalIncome: number;
    monthlyROI: number;
  }[];
  leadSource: string;
  agentAssigned: string;
  acquisitionDate: string;
  lifetimeValue: number;
  nextContactDate?: string;
}

export interface LeadSourceMetrics {
  source: 'bayut' | 'property_finder' | 'dubizzle' | 'website' | 'referral' | 'social_media' | 'walk_in';
  totalLeads: number;
  qualifiedLeads: number;
  convertedLeads: number;
  conversionRate: number;
  costPerLead: number;
  averageTimeToConvert: number; // days
  totalRevenue: number;
  roi: number;
  qualityScore: number; // 0-100
  period: string;
}

export interface Report {
  id: string;
  name: string;
  type: 'performance' | 'market_analysis' | 'client_portfolio' | 'roi_analysis' | 'lead_source' | 'custom';
  description: string;
  generatedAt: string;
  generatedBy: string;
  format: 'pdf' | 'excel' | 'csv' | 'json';
  status: 'generating' | 'completed' | 'failed';
  fileSize?: number;
  downloadUrl?: string;
  parameters: {
    dateRange: {
      start: string;
      end: string;
    };
    includeCharts: boolean;
    includeRawData: boolean;
    areas?: string[];
    propertyTypes?: string[];
    agents?: string[];
  };
  scheduleConfig?: {
    frequency: 'weekly' | 'monthly' | 'quarterly';
    recipients: string[];
    nextRun: string;
  };
}

export interface ChartData {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'heatmap';
  title: string;
  data: any[]; // Will be specific to chart type
  xAxisLabel?: string;
  yAxisLabel?: string;
  colors?: string[];
  period?: string;
  lastUpdated: string;
}

// Filter Interfaces
export interface AnalyticsFilter {
  dateRange: {
    start: string;
    end: string;
  };
  areas?: string[];
  propertyTypes?: string[];
  agents?: string[];
  clientTypes?: string[];
  leadSources?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
}

// Dubai Real Estate Context
export const DUBAI_AREAS = [
  'Downtown Dubai',
  'Dubai Marina', 
  'JBR (Jumeirah Beach Residence)',
  'Business Bay',
  'DIFC (Dubai International Financial Centre)',
  'Dubai Hills Estate',
  'Arabian Ranches',
  'The Springs',
  'Emirates Hills',
  'Palm Jumeirah',
  'Dubai South',
  'Al Barsha',
  'Jumeirah Village Circle (JVC)',
  'Dubai Investment Park (DIP)',
  'Jumeirah',
  'Bur Dubai',
  'Deira',
  'Sheikh Zayed Road',
  'Motor City',
  'Discovery Gardens'
] as const;

export const PROPERTY_TYPES = [
  'apartment',
  'villa', 
  'townhouse',
  'penthouse',
  'studio',
  'office',
  'retail',
  'warehouse',
  'plot'
] as const;

export const LEAD_SOURCES = [
  'bayut',
  'property_finder', 
  'dubizzle',
  'website',
  'referral',
  'social_media',
  'walk_in',
  'cold_call',
  'exhibition',
  'google_ads'
] as const;

// Analytics Dashboard Stats
export interface AnalyticsDashboardStats {
  totalRevenue: number;
  monthlyGrowth: number;
  activeClients: number;
  conversionRate: number;
  averageDealSize: number;
  portfolioValue: number;
  dataSourcesConnected: number;
  lastReportGenerated: string;
  topPerformingArea: string;
  topPerformingAgent: string;
}

// Sample Market Data
export const SAMPLE_MARKET_DATA = {
  'Downtown Dubai': {
    apartmentPrice: 1850000,
    villaPrice: 8500000,
    rentalYield: 6.2,
    priceChange: 12.5,
    demandLevel: 'high' as const
  },
  'Dubai Marina': {
    apartmentPrice: 1650000,
    villaPrice: 12000000,
    rentalYield: 7.1,
    priceChange: 8.3,
    demandLevel: 'very_high' as const
  },
  'Business Bay': {
    apartmentPrice: 1200000,
    villaPrice: 6500000,
    rentalYield: 8.5,
    priceChange: 15.2,
    demandLevel: 'high' as const
  }
  // Add more areas...
};

// Sample ROI Data
export const SAMPLE_ROI_DATA = {
  totalRevenue: 2850000,
  totalCosts: 1420000,
  netProfit: 1430000,
  profitMargin: 50.2,
  roi: 100.7,
  automationSavings: 180000
}; 