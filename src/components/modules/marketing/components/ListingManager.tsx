import React, { useState, useEffect } from 'react';
import { Home, Eye, Edit, Trash2, Camera, TrendingUp, Plus, ExternalLink } from 'lucide-react';
import type { PropertyListing, ListingPerformance, PropertyPortal } from '../types';

const sampleListings: PropertyListing[] = [
  // ... (use the sampleListings array from the prompt)
];

const ListingManager: React.FC = () => {
  const [listings, setListings] = useState<PropertyListing[]>(sampleListings);
  const [performance, setPerformance] = useState<ListingPerformance[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredListings = filterStatus === 'all'
    ? listings
    : listings.filter(l => l.status === filterStatus);

  return (
    <div>
      {/* Listing Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Active Listings</h3>
              <p className="text-2xl font-bold text-primary-gold">{listings.filter(l => l.status === 'active').length}</p>
              <p className="text-xs text-green-600">Live on portals</p>
            </div>
            <Home className="w-8 h-8 text-primary-gold" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Total Views</h3>
              <p className="text-2xl font-bold text-primary-gold">
                {listings.reduce((sum, listing) => 
                  sum + Object.values(listing.portals).reduce((pSum, portal) => pSum + portal.views, 0), 0
                ).toLocaleString()}
              </p>
              <p className="text-xs text-green-600">This month</p>
            </div>
            <Eye className="w-8 h-8 text-primary-gold" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Total Inquiries</h3>
              <p className="text-2xl font-bold text-primary-gold">
                {listings.reduce((sum, listing) => 
                  sum + Object.values(listing.portals).reduce((pSum, portal) => pSum + portal.inquiries, 0), 0
                )}
              </p>
              <p className="text-xs text-green-600">This month</p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary-gold" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Avg. Price</h3>
              <p className="text-2xl font-bold text-primary-gold">
                AED {(listings.reduce((sum, l) => sum + l.price, 0) / listings.length / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs text-blue-600">Per property</p>
            </div>
            <Camera className="w-8 h-8 text-primary-gold" />
          </div>
        </div>
      </div>

      {/* Property Listings Table */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Property Listings</h3>
            <div className="flex space-x-2">
              <select 
                className="border rounded-md px-3 py-1 text-sm"
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="inactive">Inactive</option>
              </select>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="flex items-center px-3 py-1 bg-primary-gold text-white rounded text-sm hover:bg-yellow-600"
              >
                <Plus className="w-4 h-4 mr-1" />
                New Listing
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Portals</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredListings.map(listing => (
                <tr key={listing.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-md mr-3">
                        <img 
                          src={listing.media.images[0] || '/placeholder-property.jpg'} 
                          alt={listing.title}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <div>
                        <span className="font-medium text-sm">{listing.title.substring(0, 40)}...</span>
                        <div className="text-xs text-gray-500">{listing.area}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="capitalize text-sm">{listing.propertyType}</span>
                    <div className="text-xs text-gray-500">{listing.specifications.bedrooms}BR</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium">AED {(listing.price / 1000000).toFixed(1)}M</span>
                    <div className="text-xs text-gray-500">{listing.saleType}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      listing.status === 'active' ? 'bg-green-100 text-green-800' :
                      listing.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {listing.status}
                    </span>
                    {listing.featured && (
                      <div className="text-xs text-primary-gold font-medium mt-1">Featured</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-1">
                      {Object.entries(listing.portals).map(([portal, data]) => (
                        <div
                          key={portal}
                          className={`w-6 h-6 rounded text-xs flex items-center justify-center ${
                            data.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'
                          }`}
                          title={`${portal}: ${data.published ? 'Published' : 'Not published'}`}
                        >
                          {portal.charAt(0).toUpperCase()}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <div className="font-medium">
                        {Object.values(listing.portals).reduce((sum, portal) => sum + portal.views, 0)} views
                      </div>
                      <div className="text-xs text-gray-500">
                        {Object.values(listing.portals).reduce((sum, portal) => sum + portal.inquiries, 0)} inquiries
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-1">
                      <button className="p-1 text-gray-400 hover:text-blue-600" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-yellow-600" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-600" title="External Link">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600" title="Delete">
                        <Trash2 className="w-4 h-4" />
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

export default ListingManager; 