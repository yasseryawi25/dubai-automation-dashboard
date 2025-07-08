import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Image, Video, Send, Edit, Trash2, Plus } from 'lucide-react';
import type { SocialMediaPost, SocialPlatform, ContentTemplate } from '../types';

function formatTime(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleString('en-GB', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const samplePlatforms: SocialPlatform[] = [
  { name: 'instagram', connected: true, accountName: '@dubai_properties', followers: 12547, lastSync: '2024-07-08T09:30:00+04:00', postingEnabled: true, analyticsEnabled: true },
  { name: 'facebook', connected: true, accountName: 'Dubai Properties Pro', followers: 8934, lastSync: '2024-07-08T09:15:00+04:00', postingEnabled: true, analyticsEnabled: true },
  { name: 'linkedin', connected: true, accountName: 'Ahmad Al-Mansouri', followers: 3456, lastSync: '2024-07-08T08:45:00+04:00', postingEnabled: true, analyticsEnabled: true },
  { name: 'tiktok', connected: false, accountName: '', followers: 0, lastSync: '', postingEnabled: false, analyticsEnabled: false }
];

const samplePosts: SocialMediaPost[] = [
  // ... (use the samplePosts array from the prompt)
];

const ContentScheduler: React.FC = () => {
  const [posts, setPosts] = useState<SocialMediaPost[]>(samplePosts);
  const [platforms, setPlatforms] = useState<SocialPlatform[]>(samplePlatforms);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  return (
    <div>
      {/* Platform Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {platforms.map(platform => (
          <div key={platform.name} className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${platform.connected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="font-medium capitalize">{platform.name}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{platform.followers.toLocaleString()}</p>
                <p className="text-xs text-gray-500">followers</p>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-600">{platform.accountName}</p>
              <p className="text-xs text-gray-500">
                {platform.connected ? `Synced ${formatTime(platform.lastSync)}` : 'Not connected'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Content Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-lg border mb-6">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Content Calendar</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('list')}
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                >
                  List View
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center px-3 py-1 bg-primary-gold text-white rounded text-sm hover:bg-yellow-600"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  New Post
                </button>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="font-semibold text-center py-2 text-sm bg-gray-50 rounded">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }, (_, i) => {
                const dayNumber = i - 6;
                const dayPosts = posts.filter(post => {
                  const postDate = new Date(post.scheduledAt || post.createdAt);
                  return postDate.getDate() === dayNumber && dayNumber > 0 && dayNumber <= 31;
                });
                return (
                  <div
                    key={i}
                    className={`min-h-[100px] border p-1 rounded ${
                      dayNumber > 0 && dayNumber <= 31 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    {dayNumber > 0 && dayNumber <= 31 && (
                      <>
                        <div className="font-medium text-sm mb-1">{dayNumber}</div>
                        <div className="space-y-1">
                          {dayPosts.slice(0, 2).map(post => (
                            <div
                              key={post.id}
                              className={`text-xs p-1 rounded cursor-pointer ${
                                post.status === 'published' ? 'bg-green-100 text-green-800' :
                                post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}
                              title={post.title}
                            >
                              {post.title.substring(0, 20)}...
                            </div>
                          ))}
                          {dayPosts.length > 2 && (
                            <div className="text-xs text-gray-500">+{dayPosts.length - 2} more</div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Quick Post Creator */}
      <div className="bg-white rounded-lg border mb-6">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Quick Post Creator</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Content Template</label>
                  <select className="w-full border rounded-md px-3 py-2">
                    <option value="">Choose a template...</option>
                    <option value="property_showcase">Property Showcase</option>
                    <option value="market_update">Market Update</option>
                    <option value="client_testimonial">Client Testimonial</option>
                    <option value="investment_tip">Investment Tip</option>
                    <option value="area_spotlight">Area Spotlight</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Caption</label>
                  <textarea
                    className="w-full border rounded-md px-3 py-2 h-32"
                    placeholder="Write your caption... Use hashtags and mentions!"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Platforms</label>
                  <div className="flex flex-wrap gap-2">
                    {platforms.filter(p => p.connected).map(platform => (
                      <label key={platform.name} className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        <span className="capitalize text-sm">{platform.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Media Upload</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                    <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Drop images/videos here or click to upload
                    </p>
                    <button className="mt-2 text-sm text-primary-gold hover:text-yellow-600">
                      Browse Files
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Schedule</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      className="border rounded-md px-3 py-2"
                      defaultValue={selectedDate}
                    />
                    <input
                      type="time"
                      className="border rounded-md px-3 py-2"
                      defaultValue="15:00"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-primary-gold text-white py-2 px-4 rounded hover:bg-yellow-600">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Schedule Post
                  </button>
                  <button className="px-4 py-2 border rounded hover:bg-gray-50">
                    <Send className="w-4 h-4 inline mr-1" />
                    Post Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentScheduler; 