import { useMemo } from 'react';
import type { MarketInsight, ClientPortfolio, LeadSourceMetrics } from '../types';

export const useChartData = (
  marketInsights: MarketInsight[],
  clientPortfolios: ClientPortfolio[],
  leadSourceMetrics: LeadSourceMetrics[]
) => {
  // Lead Source Distribution Pie Chart
  const leadSourcePieData = useMemo(() => {
    const sourceData = [
      { name: 'Bayut', value: 156, color: '#d4af37' },
      { name: 'Property Finder', value: 134, color: '#10b981' },
      { name: 'Website', value: 89, color: '#3b82f6' },
      { name: 'Referrals', value: 67, color: '#f59e0b' },
      { name: 'Social Media', value: 45, color: '#ef4444' },
      { name: 'Walk-in', value: 23, color: '#8b5cf6' }
    ];
    const total = sourceData.reduce((sum, item) => sum + item.value, 0);
    return sourceData.map(item => ({ ...item, total }));
  }, []);

  // Revenue Comparison Bar Chart
  const revenueBarData = useMemo(() => [
    { name: 'Jan', value: 2400000, comparison: 2100000 },
    { name: 'Feb', value: 2800000, comparison: 2300000 },
    { name: 'Mar', value: 3200000, comparison: 2800000 },
    { name: 'Apr', value: 2900000, comparison: 2500000 },
    { name: 'May', value: 3400000, comparison: 2900000 },
    { name: 'Jun', value: 3800000, comparison: 3100000 }
  ], []);

  // Price Trend Line Chart
  const priceTrendLineData = useMemo(() => {
    const areas = ['Downtown', 'Marina', 'JBR', 'Business Bay'];
    return areas.map((area, index) => ({
      name: area,
      value: 1500000 + (index * 200000) + Math.random() * 500000,
      trend: 1400000 + (index * 180000) + Math.random() * 400000,
      forecast: 1600000 + (index * 220000) + Math.random() * 600000
    }));
  }, [marketInsights]);

  // Client Portfolio Distribution
  const clientPortfolioPieData = useMemo(() => {
    const typeData = clientPortfolios.reduce((acc, client) => {
      acc[client.clientType] = (acc[client.clientType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(typeData).map(([type, count], index) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: count,
      color: ['#d4af37', '#10b981', '#3b82f6', '#f59e0b'][index]
    }));
  }, [clientPortfolios]);

  // Market Performance Bar Chart
  const marketPerformanceBarData = useMemo(() => {
    return marketInsights.slice(0, 8).map(insight => ({
      name: insight.area.replace(' Dubai', '').substring(0, 10),
      value: insight.averagePrice,
      comparison: insight.averagePrice * (1 - insight.priceChange / 100)
    }));
  }, [marketInsights]);

  // ROI Trend Line Chart
  const roiTrendLineData = useMemo(() => [
    { name: 'Q1 2023', value: 85.5, trend: 82.1, forecast: 88.2 },
    { name: 'Q2 2023', value: 92.3, trend: 89.7, forecast: 94.8 },
    { name: 'Q3 2023', value: 96.8, trend: 94.2, forecast: 99.1 },
    { name: 'Q4 2023', value: 103.2, trend: 98.6, forecast: 105.7 },
    { name: 'Q1 2024', value: 108.9, trend: 103.4, forecast: 112.3 },
    { name: 'Q2 2024', value: 115.6, trend: 108.9, forecast: 118.9 }
  ], []);

  return {
    leadSourcePieData,
    revenueBarData,
    priceTrendLineData,
    clientPortfolioPieData,
    marketPerformanceBarData,
    roiTrendLineData
  };
}; 