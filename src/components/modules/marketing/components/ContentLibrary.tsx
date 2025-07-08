import React, { useState } from 'react';
import { Image, Video, FileText, Upload, Search, Grid, List, Folder, Eye, Trash2, Edit, Plus, File, Palette } from 'lucide-react';

// Sample asset data
const sampleAssets = [
  {
    id: 'asset-001',
    name: 'Marina View Living Room',
    type: 'image',
    category: 'Property Photos',
    url: '/images/marina-living.jpg',
    thumbnail: '/images/marina-living-thumb.jpg',
    size: 2.1,
    uploadedAt: '2024-07-07T10:00:00+04:00',
    usedIn: ['listing-001', 'post-1'],
    metadata: { location: 'Dubai Marina', resolution: '1920x1080', format: 'jpg' }
  },
  {
    id: 'asset-002',
    name: 'Downtown Skyline Video',
    type: 'video',
    category: 'Marketing Materials',
    url: '/videos/downtown-skyline.mp4',
    thumbnail: '/images/downtown-skyline-thumb.jpg',
    size: 18.4,
    uploadedAt: '2024-07-06T15:30:00+04:00',
    usedIn: ['cmp-003'],
    metadata: { location: 'Downtown Dubai', duration: '00:45', format: 'mp4' }
  },
  {
    id: 'asset-003',
    name: 'Instagram Property Template',
    type: 'template',
    category: 'Templates',
    url: '/templates/insta-property.psd',
    thumbnail: '/images/template-insta-thumb.jpg',
    size: 4.2,
    uploadedAt: '2024-07-05T09:00:00+04:00',
    usedIn: ['post-2'],
    metadata: { platform: 'Instagram', format: 'psd', editable: true }
  },
  {
    id: 'asset-004',
    name: 'Company Logo',
    type: 'brand',
    category: 'Brand Assets',
    url: '/brand/logo.png',
    thumbnail: '/brand/logo-thumb.png',
    size: 0.3,
    uploadedAt: '2024-07-01T08:00:00+04:00',
    usedIn: ['all'],
    metadata: { format: 'png', color: '#FFD700', usage: 'logo' }
  },
  {
    id: 'asset-005',
    name: 'JBR Beach Balcony',
    type: 'image',
    category: 'Property Photos',
    url: '/images/jbr-balcony.jpg',
    thumbnail: '/images/jbr-balcony-thumb.jpg',
    size: 1.8,
    uploadedAt: '2024-07-08T11:00:00+04:00',
    usedIn: ['listing-002'],
    metadata: { location: 'JBR', resolution: '1920x1080', format: 'jpg' }
  },
  {
    id: 'asset-006',
    name: 'Watermark',
    type: 'brand',
    category: 'Brand Assets',
    url: '/brand/watermark.svg',
    thumbnail: '/brand/watermark-thumb.svg',
    size: 0.1,
    uploadedAt: '2024-07-01T08:10:00+04:00',
    usedIn: ['all'],
    metadata: { format: 'svg', usage: 'watermark' }
  }
];

const categories = [
  'All',
  'Property Photos',
  'Marketing Materials',
  'Templates',
  'Brand Assets'
];

const ContentLibrary: React.FC = () => {
  const [assets, setAssets] = useState(sampleAssets);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [previewAsset, setPreviewAsset] = useState<any>(null);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  // Filtered assets
  const filteredAssets = assets.filter(a =>
    (selectedCategory === 'All' || a.category === selectedCategory) &&
    (a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Overview metrics
  const totalFiles = assets.length;
  const totalStorage = assets.reduce((sum, a) => sum + a.size, 0).toFixed(1);
  const recentAssets = [...assets].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()).slice(0, 3);

  // Drag-and-drop upload (placeholder)
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setShowUpload(false);
    // Handle file upload logic here
    alert('File(s) uploaded! (Demo only)');
  };

  // Asset icon by type
  const assetIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-5 h-5 text-primary-gold" />;
      case 'video': return <Video className="w-5 h-5 text-blue-500" />;
      case 'template': return <FileText className="w-5 h-5 text-green-600" />;
      case 'brand': return <Palette className="w-5 h-5 text-yellow-600" />;
      default: return <File className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div>
      {/* Asset Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Total Files</h3>
              <p className="text-2xl font-bold text-primary-gold">{totalFiles}</p>
              <p className="text-xs text-green-600">All assets</p>
            </div>
            <File className="w-8 h-8 text-primary-gold" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Storage Used</h3>
              <p className="text-2xl font-bold text-primary-gold">{totalStorage} MB</p>
              <p className="text-xs text-blue-600">All assets</p>
            </div>
            <Folder className="w-8 h-8 text-primary-gold" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Recently Uploaded</h3>
              <div className="flex space-x-2 mt-2">
                {recentAssets.map(a => (
                  <img key={a.id} src={a.thumbnail} alt={a.name} className="w-8 h-8 rounded object-cover border" />
                ))}
              </div>
            </div>
            <Upload className="w-8 h-8 text-primary-gold" />
          </div>
        </div>
      </div>

      {/* Controls: Category, Search, View Mode, Upload */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <select
          className="border rounded-md px-3 py-1 text-sm"
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <div className="relative">
          <input
            type="text"
            className="border rounded-md px-3 py-1 text-sm pl-8"
            placeholder="Search assets..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Search className="w-4 h-4 absolute left-2 top-2 text-gray-400" />
        </div>
        <button
          className={`px-3 py-1 rounded text-sm border flex items-center ${viewMode === 'grid' ? 'bg-primary-gold text-white' : 'bg-white text-gray-700'}`}
          onClick={() => setViewMode('grid')}
        >
          <Grid className="w-4 h-4 mr-1" /> Grid
        </button>
        <button
          className={`px-3 py-1 rounded text-sm border flex items-center ${viewMode === 'list' ? 'bg-primary-gold text-white' : 'bg-white text-gray-700'}`}
          onClick={() => setViewMode('list')}
        >
          <List className="w-4 h-4 mr-1" /> List
        </button>
        <button
          className="ml-auto flex items-center px-3 py-1 bg-primary-gold text-white rounded text-sm hover:bg-yellow-600"
          onClick={() => setShowUpload(true)}
        >
          <Plus className="w-4 h-4 mr-1" /> Upload
        </button>
      </div>

      {/* Upload Area (Modal) */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div
            className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative flex flex-col items-center"
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              onClick={() => setShowUpload(false)}
              aria-label="Close"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <Upload className="w-12 h-12 text-primary-gold mb-2" />
            <p className="text-lg font-semibold mb-2">Upload Files</p>
            <p className="text-sm text-gray-500 mb-4">Drag and drop files here or click to browse</p>
            <input type="file" multiple className="mb-2" />
            <button className="mt-2 px-4 py-2 bg-primary-gold text-white rounded hover:bg-yellow-600" onClick={() => setShowUpload(false)}>Done</button>
          </div>
        </div>
      )}

      {/* File Browser */}
      <div className="bg-white rounded-lg border">
        {viewMode === 'grid' ? (
          <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredAssets.map(a => (
              <div key={a.id} className="border rounded-lg p-2 flex flex-col items-center cursor-pointer hover:shadow" onClick={() => setPreviewAsset(a)}>
                <div className="w-20 h-20 mb-2 flex items-center justify-center bg-gray-50 rounded overflow-hidden">
                  {a.type === 'image' ? (
                    <img src={a.thumbnail} alt={a.name} className="w-full h-full object-cover" />
                  ) : a.type === 'video' ? (
                    <Video className="w-10 h-10 text-blue-500" />
                  ) : a.type === 'template' ? (
                    <FileText className="w-10 h-10 text-green-600" />
                  ) : a.type === 'brand' ? (
                    <Palette className="w-10 h-10 text-yellow-600" />
                  ) : (
                    <File className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <div className="text-xs font-medium text-center truncate w-full" title={a.name}>{a.name}</div>
                <div className="text-[10px] text-gray-400">{a.category}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-2 py-2 text-left">Asset</th>
                  <th className="px-2 py-2 text-left">Category</th>
                  <th className="px-2 py-2 text-left">Type</th>
                  <th className="px-2 py-2 text-left">Size (MB)</th>
                  <th className="px-2 py-2 text-left">Uploaded</th>
                  <th className="px-2 py-2 text-left">Used In</th>
                  <th className="px-2 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-2 py-2 flex items-center gap-2">
                      {assetIcon(a.type)}
                      <span className="truncate max-w-[120px]" title={a.name}>{a.name}</span>
                    </td>
                    <td className="px-2 py-2">{a.category}</td>
                    <td className="px-2 py-2 capitalize">{a.type}</td>
                    <td className="px-2 py-2">{a.size}</td>
                    <td className="px-2 py-2">{a.uploadedAt.split('T')[0]}</td>
                    <td className="px-2 py-2 text-xs">{Array.isArray(a.usedIn) ? a.usedIn.join(', ') : a.usedIn}</td>
                    <td className="px-2 py-2">
                      <div className="flex space-x-1">
                        <button className="p-1 text-gray-400 hover:text-blue-600" title="Preview" onClick={() => setPreviewAsset(a)}>
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-yellow-600" title="Edit" onClick={() => setSelectedAsset(a)}>
                          <Edit className="w-4 h-4" />
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
        )}
      </div>

      {/* Preview Modal */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              onClick={() => setPreviewAsset(null)}
              aria-label="Close"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <div className="mb-4 flex items-center gap-2">
              {assetIcon(previewAsset.type)}
              <span className="font-medium text-lg">{previewAsset.name}</span>
              <span className="text-xs text-gray-400">({previewAsset.category})</span>
            </div>
            <div className="mb-4 flex justify-center">
              {previewAsset.type === 'image' ? (
                <img src={previewAsset.url} alt={previewAsset.name} className="max-h-64 rounded shadow" />
              ) : previewAsset.type === 'video' ? (
                <video src={previewAsset.url} controls className="max-h-64 rounded shadow" />
              ) : previewAsset.type === 'template' ? (
                <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded">Template Preview</div>
              ) : previewAsset.type === 'brand' ? (
                <img src={previewAsset.url} alt={previewAsset.name} className="max-h-32 rounded shadow" />
              ) : (
                <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded">No Preview</div>
              )}
            </div>
            <div className="mb-2">
              <div className="text-xs text-gray-500">Uploaded: {previewAsset.uploadedAt.split('T')[0]}</div>
              <div className="text-xs text-gray-500">Size: {previewAsset.size} MB</div>
              <div className="text-xs text-gray-500">Used In: {Array.isArray(previewAsset.usedIn) ? previewAsset.usedIn.join(', ') : previewAsset.usedIn}</div>
            </div>
            <div className="mb-2">
              <div className="font-medium text-sm mb-1">Metadata</div>
              <pre className="bg-gray-50 rounded p-2 text-xs overflow-x-auto">{JSON.stringify(previewAsset.metadata, null, 2)}</pre>
            </div>
            <button className="mt-2 px-4 py-2 bg-primary-gold text-white rounded hover:bg-yellow-600" onClick={() => setPreviewAsset(null)}>Close</button>
          </div>
        </div>
      )}

      {/* Asset Details/Edit Panel (placeholder) */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              onClick={() => setSelectedAsset(null)}
              aria-label="Close"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4">Edit Asset</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" className="w-full border rounded-md px-3 py-2" defaultValue={selectedAsset.name} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select className="w-full border rounded-md px-3 py-2" defaultValue={selectedAsset.category}>
                  {categories.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-2 mt-4">
                <button type="submit" className="flex-1 bg-primary-gold text-white py-2 px-4 rounded hover:bg-yellow-600">Save</button>
                <button type="button" className="px-4 py-2 border rounded hover:bg-gray-50" onClick={() => setSelectedAsset(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Template Gallery */}
      <div className="bg-white rounded-lg border mt-8">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Template Gallery</h3>
        </div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {assets.filter(a => a.type === 'template').map(t => (
            <div key={t.id} className="border rounded-lg p-2 flex flex-col items-center cursor-pointer hover:shadow" onClick={() => setPreviewAsset(t)}>
              <img src={t.thumbnail} alt={t.name} className="w-20 h-20 object-cover rounded mb-2" />
              <div className="text-xs font-medium text-center truncate w-full" title={t.name}>{t.name}</div>
              <div className="text-[10px] text-gray-400">{t.metadata.platform}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentLibrary; 