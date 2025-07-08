import React, { useState, useMemo } from 'react';
import { Users, DollarSign, TrendingUp, Calendar, Phone, Mail } from 'lucide-react';
import type { ClientPortfolio } from '../types';

const sampleClientPortfolios: ClientPortfolio[] = [
  {
    clientId: 'client-001',
    clientName: 'Ahmed Al-Mansouri',
    clientType: 'investor',
    totalInvestment: 8500000,
    portfolioValue: 10625000,
    totalROI: 25.0,
    properties: [
      {
        id: 'prop-001',
        address: 'Downtown Dubai, Burj Khalifa District',
        type: 'apartment',
        purchasePrice: 3500000,
        currentValue: 4375000,
        rentalIncome: 262500,
        monthlyROI: 0.75
      },
      {
        id: 'prop-002',
        address: 'Dubai Marina, Marina Walk',
        type: 'apartment',
        purchasePrice: 2800000,
        currentValue: 3150000,
        rentalIncome: 236250,
        monthlyROI: 0.84
      },
      {
        id: 'prop-003',
        address: 'Business Bay, Bay Square',
        type: 'apartment',
        purchasePrice: 2200000,
        currentValue: 3100000,
        rentalIncome: 217000,
        monthlyROI: 0.98
      }
    ],
    leadSource: 'referral',
    agentAssigned: 'Sarah (Manager Agent)',
    acquisitionDate: '2022-03-15',
    lifetimeValue: 12750000,
    nextContactDate: '2024-07-15'
  },
  {
    clientId: 'client-002',
    clientName: 'Priya Investment Holdings',
    clientType: 'corporate',
    totalInvestment: 25000000,
    portfolioValue: 31250000,
    totalROI: 25.0,
    properties: [
      {
        id: 'prop-004',
        address: 'DIFC, Index Tower',
        type: 'office',
        purchasePrice: 12000000,
        currentValue: 15000000,
        rentalIncome: 1080000,
        monthlyROI: 0.75
      },
      {
        id: 'prop-005',
        address: 'Palm Jumeirah, Villa 23',
        type: 'villa',
        purchasePrice: 13000000,
        currentValue: 16250000,
        rentalIncome: 1137500,
        monthlyROI: 0.73
      }
    ],
    leadSource: 'bayut',
    agentAssigned: 'Alex (Pipeline Coordinator)',
    acquisitionDate: '2021-08-20',
    lifetimeValue: 37500000,
    nextContactDate: '2024-07-12'
  },
  {
    clientId: 'client-003',
    clientName: 'Fatima Al-Zahra',
    clientType: 'individual',
    totalInvestment: 1850000,
    portfolioValue: 2035000,
    totalROI: 10.0,
    properties: [
      {
        id: 'prop-006',
        address: 'JBR, Bahar 4',
        type: 'apartment',
        purchasePrice: 1850000,
        currentValue: 2035000,
        rentalIncome: 135000,
        monthlyROI: 0.61
      }
    ],
    leadSource: 'website',
    agentAssigned: 'Omar (Lead Qualification)',
    acquisitionDate: '2023-11-10',
    lifetimeValue: 2442000,
    nextContactDate: '2024-07-20'
  },
  {
    clientId: 'client-004',
    clientName: 'John & Sarah Mitchell',
    clientType: 'individual',
    totalInvestment: 4200000,
    portfolioValue: 4830000,
    totalROI: 15.0,
    properties: [
      {
        id: 'prop-007',
        address: 'Arabian Ranches, Villa 42',
        type: 'villa',
        purchasePrice: 4200000,
        currentValue: 4830000,
        rentalIncome: 336000,
        monthlyROI: 0.67
      }
    ],
    leadSource: 'property_finder',
    agentAssigned: 'Layla (Follow-up Specialist)',
    acquisitionDate: '2023-05-22',
    lifetimeValue: 5796000,
    nextContactDate: '2024-07-18'
  }
];

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
}

const ClientDatabase: React.FC = () => {
  const [clients, setClients] = useState<ClientPortfolio[]>(sampleClientPortfolios);
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'investment' | 'roi' | 'ltv'>('ltv');

  // Filter and sort logic
  const filteredClients = useMemo(() => {
    let filtered = clients;
    if (filterType !== 'all') {
      filtered = filtered.filter(c => c.clientType === filterType);
    }
    switch (sortBy) {
      case 'ltv':
        filtered = [...filtered].sort((a, b) => b.lifetimeValue - a.lifetimeValue);
        break;
      case 'roi':
        filtered = [...filtered].sort((a, b) => b.totalROI - a.totalROI);
        break;
      case 'investment':
        filtered = [...filtered].sort((a, b) => b.totalInvestment - a.totalInvestment);
        break;
      case 'name':
        filtered = [...filtered].sort((a, b) => a.clientName.localeCompare(b.clientName));
        break;
    }
    return filtered;
  }, [clients, filterType, sortBy]);

  // Overview metrics
  const totalPortfolioValue = useMemo(() => clients.reduce((sum, c) => sum + c.portfolioValue, 0), [clients]);
  const averageROI = useMemo(() => clients.length === 0 ? 0 : clients.reduce((sum, c) => sum + c.totalROI, 0) / clients.length, [clients]);
  const averageLTV = useMemo(() => clients.length === 0 ? 0 : clients.reduce((sum, c) => sum + c.lifetimeValue, 0) / clients.length, [clients]);

  return (
    <div>
      {/* Client Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold text-primary-gold">{clients.length}</p>
              <p className="text-sm text-green-600">+12 this month</p>
            </div>
            <Users className="w-8 h-8 text-primary-gold" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Portfolio Value</p>
              <p className="text-2xl font-bold text-primary-gold">AED {(totalPortfolioValue / 1000000).toFixed(1)}M</p>
              <p className="text-sm text-green-600">+18.5% growth</p>
            </div>
            <DollarSign className="w-8 h-8 text-primary-gold" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Client ROI</p>
              <p className="text-2xl font-bold text-green-600">{averageROI.toFixed(1)}%</p>
              <p className="text-sm text-green-600">Above market avg</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Lifetime Value</p>
              <p className="text-2xl font-bold text-primary-gold">AED {(averageLTV / 1000000).toFixed(1)}M</p>
              <p className="text-sm text-blue-600">Per client</p>
            </div>
            <Calendar className="w-8 h-8 text-primary-gold" />
          </div>
        </div>
      </div>

      {/* Client Portfolio Table */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Client Portfolio Database</h3>
            <div className="flex space-x-2">
              <select 
                className="border rounded-md px-3 py-1 text-sm"
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
              >
                <option value="all">All Client Types</option>
                <option value="individual">Individual</option>
                <option value="investor">Investor</option>
                <option value="corporate">Corporate</option>
                <option value="developer">Developer</option>
              </select>
              <select 
                className="border rounded-md px-3 py-1 text-sm"
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
              >
                <option value="ltv">Sort by Lifetime Value</option>
                <option value="roi">Sort by ROI</option>
                <option value="investment">Sort by Investment</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Investment</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Portfolio Value</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ROI</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Properties</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClients.map(client => (
                <tr key={client.clientId} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <span className="font-medium">{client.clientName}</span>
                        <div className="text-xs text-gray-500">Since {formatDate(client.acquisitionDate)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      client.clientType === 'corporate' ? 'bg-blue-100 text-blue-800' :
                      client.clientType === 'investor' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {client.clientType}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium">AED {(client.totalInvestment / 1000000).toFixed(1)}M</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-green-600">AED {(client.portfolioValue / 1000000).toFixed(1)}M</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span className="font-medium">{client.totalROI.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-900">{client.properties.length} properties</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">{client.agentAssigned}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm">{formatDate(client.nextContactDate || '')}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-1">
                      <button className="p-1 text-gray-400 hover:text-blue-600" title="Call">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-600" title="Email">
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientDatabase; 