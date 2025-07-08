import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Clock, Users, Calculator } from 'lucide-react';
import type { ROIMetrics } from '../types';

const sampleROIData: ROIMetrics = {
  totalRevenue: 2847500,
  totalCosts: 1423750,
  netProfit: 1423750,
  profitMargin: 50.0,
  roi: 100.0,
  period: 'monthly',
  startDate: '2024-06-01',
  endDate: '2024-06-30',
  breakdown: {
    commissions: 2135625, // 75% of revenue
    operationalCosts: 284750,
    marketingSpend: 426750,
    toolingCosts: 142375,
    automationSavings: 184375
  }
};

const ROIDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [roiData, setROIData] = useState<ROIMetrics>(sampleROIData);

  // Period filter handler (mocked)
  const handlePeriodChange = (period: 'monthly' | 'quarterly' | 'yearly') => {
    setSelectedPeriod(period);
    // In real app, fetch new data here
    setROIData(sampleROIData); // For now, static
  };

  return (
    <div>
      {/* Period Filter */}
      <div className="flex gap-2 mb-4">
        {['monthly', 'quarterly', 'yearly'].map((period) => (
          <button
            key={period}
            className={`px-4 py-2 rounded font-medium text-sm transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2
              ${selectedPeriod === period ? 'bg-primary-gold text-white' : 'bg-gray-100 text-gray-700 hover:bg-gold-100'}`}
            onClick={() => handlePeriodChange(period as 'monthly' | 'quarterly' | 'yearly')}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>

      {/* Key ROI Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-primary-gold">AED {(roiData.totalRevenue / 1000000).toFixed(2)}M</p>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +15.3% vs last period
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-primary-gold" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Costs</p>
              <p className="text-2xl font-bold text-red-600">AED {(roiData.totalCosts / 1000000).toFixed(2)}M</p>
              <p className="text-sm text-red-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +8.7% vs last period
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Profit</p>
              <p className="text-2xl font-bold text-green-600">AED {(roiData.netProfit / 1000000).toFixed(2)}M</p>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +23.1% vs last period
              </p>
            </div>
            <Calculator className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ROI</p>
              <p className="text-2xl font-bold text-primary-gold">{roiData.roi.toFixed(1)}%</p>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12.8% vs last period
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary-gold" />
          </div>
        </div>
      </div>

      {/* Automation Savings Display */}
      <div className="bg-white p-6 rounded-lg border mb-6">
        <h3 className="text-lg font-semibold mb-4">Automation Impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">1,247</p>
            <p className="text-sm text-gray-600">Hours Saved/Month</p>
            <p className="text-xs text-green-600">Worth AED 124,700</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">3.2x</p>
            <p className="text-sm text-gray-600">Efficiency Multiplier</p>
            <p className="text-xs text-blue-600">vs Manual Process</p>
          </div>
          <div className="text-center p-4 bg-primary-gold bg-opacity-10 rounded-lg">
            <DollarSign className="w-8 h-8 text-primary-gold mx-auto mb-2" />
            <p className="text-2xl font-bold text-primary-gold">AED 184K</p>
            <p className="text-sm text-gray-600">Monthly Savings</p>
            <p className="text-xs text-primary-gold">From Automation</p>
          </div>
        </div>
      </div>

      {/* Placeholder for Revenue Breakdown Chart and Performance Table */}
      <div className="bg-white p-6 rounded-lg border mb-6">
        <h3 className="text-lg font-semibold mb-4">Revenue Breakdown Chart</h3>
        <div className="h-32 flex items-center justify-center text-gray-400">[Chart Coming Soon]</div>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Performance Comparison Table</h3>
        <div className="h-32 flex items-center justify-center text-gray-400">[Table Coming Soon]</div>
      </div>
    </div>
  );
};

export default ROIDashboard; 