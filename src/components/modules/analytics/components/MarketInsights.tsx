import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, MapPin, Home, AlertTriangle, Star } from 'lucide-react';
import type { MarketInsight } from '../types';

const sampleMarketInsights: MarketInsight[] = [
  {
    id: 'downtown-dubai-apt',
    area: 'Downtown Dubai',
    propertyType: 'apartment',
    averagePrice: 1850000,
    priceChange: 12.5,
    averageRent: 115000,
    rentalYield: 6.2,
    demandLevel: 'high',
    supplyLevel: 'medium',
    transactionVolume: 347,
    daysOnMarket: 28,
    pricePerSqFt: 1547,
    lastUpdated: '2024-07-08T09:00:00+04:00',
    forecast: {
      nextQuarterPrice: 1924750,
      nextQuarterVolume: 385,
      confidence: 82
    }
  },
  {
    id: 'dubai-marina-apt',
    area: 'Dubai Marina',
    propertyType: 'apartment',
    averagePrice: 1650000,
    priceChange: 8.3,
    averageRent: 117000,
    rentalYield: 7.1,
    demandLevel: 'very_high',
    supplyLevel: 'low',
    transactionVolume: 489,
    daysOnMarket: 18,
    pricePerSqFt: 1456,
    lastUpdated: '2024-07-08T09:00:00+04:00',
    forecast: {
      nextQuarterPrice: 1717950,
      nextQuarterVolume: 534,
      confidence: 88
    }
  },
  {
    id: 'business-bay-apt',
    area: 'Business Bay',
    propertyType: 'apartment',
    averagePrice: 1200000,
    priceChange: 15.2,
    averageRent: 102000,
    rentalYield: 8.5,
    demandLevel: 'high',
    supplyLevel: 'medium',
    transactionVolume: 623,
    daysOnMarket: 22,
    pricePerSqFt: 1234,
    lastUpdated: '2024-07-08T09:00:00+04:00',
    forecast: {
      nextQuarterPrice: 1302400,
      nextQuarterVolume: 695,
      confidence: 79
    }
  },
  {
    id: 'jbr-apt',
    area: 'JBR (Jumeirah Beach Residence)',
    propertyType: 'apartment',
    averagePrice: 1750000,
    priceChange: 6.8,
    averageRent: 126000,
    rentalYield: 7.2,
    demandLevel: 'high',
    supplyLevel: 'low',
    transactionVolume: 234,
    daysOnMarket: 31,
    pricePerSqFt: 1623,
    lastUpdated: '2024-07-08T09:00:00+04:00',
    forecast: {
      nextQuarterPrice: 1809100,
      nextQuarterVolume: 267,
      confidence: 85
    }
  },
  {
    id: 'palm-jumeirah-villa',
    area: 'Palm Jumeirah',
    propertyType: 'villa',
    averagePrice: 12500000,
    priceChange: 18.7,
    averageRent: 875000,
    rentalYield: 7.0,
    demandLevel: 'very_high',
    supplyLevel: 'low',
    transactionVolume: 89,
    daysOnMarket: 45,
    pricePerSqFt: 2234,
    lastUpdated: '2024-07-08T09:00:00+04:00',
    forecast: {
      nextQuarterPrice: 13437500,
      nextQuarterVolume: 103,
      confidence: 91
    }
  },
  {
    id: 'emirates-hills-villa',
    area: 'Emirates Hills',
    propertyType: 'villa',
    averagePrice: 18500000,
    priceChange: 22.3,
    averageRent: 1295000,
    rentalYield: 7.0,
    demandLevel: 'high',
    supplyLevel: 'low',
    transactionVolume: 34,
    daysOnMarket: 67,
    pricePerSqFt: 2876,
    lastUpdated: '2024-07-08T09:00:00+04:00',
    forecast: {
      nextQuarterPrice: 20387500,
      nextQuarterVolume: 42,
      confidence: 87
    }
  },
  {
    id: 'dubai-hills-townhouse',
    area: 'Dubai Hills Estate',
    propertyType: 'townhouse',
    averagePrice: 2850000,
    priceChange: 11.4,
    averageRent: 228000,
    rentalYield: 8.0,
    demandLevel: 'high',
    supplyLevel: 'medium',
    transactionVolume: 156,
    daysOnMarket: 35,
    pricePerSqFt: 1456,
    lastUpdated: '2024-07-08T09:00:00+04:00',
    forecast: {
      nextQuarterPrice: 3074850,
      nextQuarterVolume: 178,
      confidence: 84
    }
  },
  {
    id: 'arabian-ranches-villa',
    area: 'Arabian Ranches',
    propertyType: 'villa',
    averagePrice: 4200000,
    priceChange: 9.6,
    averageRent: 336000,
    rentalYield: 8.0,
    demandLevel: 'medium',
    supplyLevel: 'medium',
    transactionVolume: 78,
    daysOnMarket: 42,
    pricePerSqFt: 1234,
    lastUpdated: '2024-07-08T09:00:00+04:00',
    forecast: {
      nextQuarterPrice: 4403200,
      nextQuarterVolume: 89,
      confidence: 76
    }
  }
];

const MarketInsights: React.FC = () => {
  const [insights, setInsights] = useState<MarketInsight[]>(sampleMarketInsights);
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price' | 'change' | 'yield' | 'demand'>('change');

  // Filter and sort logic
  const filteredInsights = useMemo(() => {
    let filtered = insights;
    if (selectedPropertyType !== 'all') {
      filtered = filtered.filter(i => i.propertyType === selectedPropertyType);
    }
    switch (sortBy) {
      case 'price':
        filtered = [...filtered].sort((a, b) => b.averagePrice - a.averagePrice);
        break;
      case 'change':
        filtered = [...filtered].sort((a, b) => b.priceChange - a.priceChange);
        break;
      case 'yield':
        filtered = [...filtered].sort((a, b) => b.rentalYield - a.rentalYield);
        break;
      case 'demand':
        const demandOrder = { 'very_high': 3, 'high': 2, 'medium': 1, 'low': 0 };
        filtered = [...filtered].sort((a, b) => (demandOrder[b.demandLevel] - demandOrder[a.demandLevel]));
        break;
    }
    return filtered;
  }, [insights, selectedPropertyType, sortBy]);

  // Overview metrics
  const avgPrice = useMemo(() => {
    if (filteredInsights.length === 0) return 0;
    return filteredInsights.reduce((sum, i) => sum + i.averagePrice, 0) / filteredInsights.length;
  }, [filteredInsights]);
  const avgYield = useMemo(() => {
    if (filteredInsights.length === 0) return 0;
    return filteredInsights.reduce((sum, i) => sum + i.rentalYield, 0) / filteredInsights.length;
  }, [filteredInsights]);
  const totalTransactions = useMemo(() => filteredInsights.reduce((sum, i) => sum + i.transactionVolume, 0), [filteredInsights]);
  const bestArea = useMemo(() => {
    if (filteredInsights.length === 0) return '';
    return filteredInsights.reduce((best, i) => (i.priceChange > (best?.priceChange || -Infinity) ? i : best), filteredInsights[0]).area;
  }, [filteredInsights]);
  const bestGrowth = useMemo(() => {
    if (filteredInsights.length === 0) return 0;
    return filteredInsights.reduce((max, i) => Math.max(max, i.priceChange), -Infinity);
  }, [filteredInsights]);

  return (
    <div>
      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Property Price</p>
              <p className="text-2xl font-bold text-primary-gold">AED {(avgPrice/1000000).toFixed(1)}M</p>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12.8% YoY
              </p>
            </div>
            <Home className="w-8 h-8 text-primary-gold" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Best Performing Area</p>
              <p className="text-xl font-bold text-green-600">{bestArea}</p>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +{bestGrowth.toFixed(1)}% growth
              </p>
            </div>
            <Star className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Rental Yield</p>
              <p className="text-2xl font-bold text-primary-gold">{avgYield.toFixed(1)}%</p>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                Above global avg
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary-gold" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-primary-gold">{totalTransactions.toLocaleString()}</p>
              <p className="text-sm text-blue-600">This Quarter</p>
            </div>
            <MapPin className="w-8 h-8 text-primary-gold" />
          </div>
        </div>
      </div>

      {/* Dubai Areas Performance Table */}
      <div className="bg-white rounded-lg border mb-6">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Dubai Market Analysis</h3>
            <div className="flex space-x-2">
              <select 
                className="border rounded-md px-3 py-1 text-sm"
                value={selectedPropertyType}
                onChange={e => setSelectedPropertyType(e.target.value)}
              >
                <option value="all">All Property Types</option>
                <option value="apartment">Apartments</option>
                <option value="villa">Villas</option>
                <option value="townhouse">Townhouses</option>
              </select>
              <select 
                className="border rounded-md px-3 py-1 text-sm"
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
              >
                <option value="change">Sort by Price Change</option>
                <option value="price">Sort by Price</option>
                <option value="yield">Sort by Yield</option>
                <option value="demand">Sort by Demand</option>
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Area</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price Change</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rental Yield</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Demand</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days on Market</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Forecast</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInsights.map(insight => (
                <tr key={insight.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="font-medium">{insight.area}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="capitalize text-sm text-gray-600">{insight.propertyType}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium">AED {(insight.averagePrice / 1000000).toFixed(1)}M</span>
                    <div className="text-xs text-gray-500">AED {insight.pricePerSqFt}/sqft</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className={`flex items-center ${insight.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {insight.priceChange >= 0 ? 
                        <TrendingUp className="w-4 h-4 mr-1" /> : 
                        <TrendingDown className="w-4 h-4 mr-1" />
                      }
                      <span className="font-medium">{Math.abs(insight.priceChange).toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-green-600">{insight.rentalYield.toFixed(1)}%</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      insight.demandLevel === 'very_high' ? 'bg-red-100 text-red-800' :
                      insight.demandLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                      insight.demandLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {insight.demandLevel.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-900">{insight.daysOnMarket} days</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <div className="font-medium text-green-600">
                        +{((insight.forecast.nextQuarterPrice - insight.averagePrice) / insight.averagePrice * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">{insight.forecast.confidence}% confidence</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Property Type Analysis & Investment Opportunities Alert */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Property Type Analysis</h3>
        <div className="h-24 flex items-center justify-center text-gray-400">[Property Type Trends Coming Soon]</div>
      </div>
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-6 flex items-center">
        <AlertTriangle className="w-6 h-6 text-yellow-500 mr-3" />
        <div>
          <span className="font-medium text-yellow-800">Investment Opportunities:</span> Several areas show double-digit price growth and high rental yields. Consider Emirates Hills, Palm Jumeirah, and Business Bay for high-confidence investments this quarter.
        </div>
      </div>
    </div>
  );
};

export default MarketInsights; 