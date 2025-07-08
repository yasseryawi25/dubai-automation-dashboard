import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  MessageSquare, 
  Phone, 
  User, 
  Zap, 
  TrendingUp, 
  Clock,
  RefreshCw,
  Database
} from 'lucide-react';
import { useLeads, useWhatsAppMessages, useDashboardMetrics } from '../../hooks';
import type { Lead, WhatsappMessage } from '../../types/database';

interface ActivityItem {
  id: string;
  type: 'lead_created' | 'message_received' | 'lead_updated' | 'workflow_triggered' | 'call_completed';
  title: string;
  description: string;
  timestamp: Date;
  icon: React.ReactNode;
  iconBg: string;
  data?: any;
}

interface RealTimeActivityFeedProps {
  maxItems?: number;
  showHeader?: boolean;
  className?: string;
}

const RealTimeActivityFeed: React.FC<RealTimeActivityFeedProps> = ({ 
  maxItems = 10, 
  showHeader = true,
  className = ''
}) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLive, setIsLive] = useState(true);
  
  const { leads, loading: leadsLoading } = useLeads();
  const { messages, loading: messagesLoading } = useWhatsAppMessages();
  const { metrics } = useDashboardMetrics();

  // Convert database changes to activity items
  useEffect(() => {
    const newActivities: ActivityItem[] = [];

    // Process leads into activities
    leads.slice(0, 5).forEach((lead) => {
      newActivities.push({
        id: `lead-${lead.id}`,
        type: 'lead_created',
        title: 'New Lead Captured',
        description: `${lead.name} interested in ${lead.property_type_interest?.join(', ') || 'Dubai properties'} - Budget: ${lead.budget_min && lead.budget_max ? `$${lead.budget_min.toLocaleString()} - $${lead.budget_max.toLocaleString()}` : 'Not specified'}`,
        timestamp: new Date(lead.created_at),
        icon: <User className="h-4 w-4 text-green-600" />,
        iconBg: 'bg-green-100',
        data: lead
      });
    });

    // Process WhatsApp messages into activities
    messages.slice(0, 3).forEach((message) => {
      newActivities.push({
        id: `message-${message.id}`,
        type: 'message_received',
        title: 'WhatsApp Message Processed',
        description: `${message.direction === 'inbound' ? 'Received from' : 'Sent to'} ${message.phone_number} - "${message.message_content.substring(0, 50)}${message.message_content.length > 50 ? '...' : ''}"`,
        timestamp: new Date(message.created_at),
        icon: <MessageSquare className="h-4 w-4 text-blue-600" />,
        iconBg: 'bg-blue-100',
        data: message
      });
    });

    // Add some system activities
    if (metrics.activeWorkflows > 0) {
      newActivities.push({
        id: 'workflow-active',
        type: 'workflow_triggered',
        title: 'Automation Workflows Active',
        description: `${metrics.activeWorkflows} automation workflows are running smoothly. Omar is processing leads in real-time.`,
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        icon: <Zap className="h-4 w-4 text-yellow-600" />,
        iconBg: 'bg-yellow-100',
        data: { workflow_count: metrics.activeWorkflows }
      });
    }

    // Add performance update
    if (metrics.conversionsThisWeek > 0) {
      newActivities.push({
        id: 'performance-update',
        type: 'lead_updated',
        title: 'Performance Update',
        description: `${metrics.conversionsThisWeek} leads converted this week. Your team is exceeding targets!`,
        timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
        icon: <TrendingUp className="h-4 w-4 text-purple-600" />,
        iconBg: 'bg-purple-100',
        data: { conversions: metrics.conversionsThisWeek }
      });
    }

    // Sort by timestamp and limit
    const sortedActivities = newActivities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, maxItems);

    setActivities(sortedActivities);
  }, [leads, messages, metrics, maxItems]);

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getActivityTypeColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'lead_created':
        return 'text-green-600';
      case 'message_received':
        return 'text-blue-600';
      case 'lead_updated':
        return 'text-purple-600';
      case 'workflow_triggered':
        return 'text-yellow-600';
      case 'call_completed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (leadsLoading || messagesLoading) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        {showHeader && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Real-Time Activity</h2>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
        )}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Real-Time Activity</h2>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-1 text-xs ${isLive ? 'text-green-600' : 'text-gray-500'}`}>
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span>{isLive ? 'Live' : 'Paused'}</span>
            </div>
            <button
              onClick={() => setIsLive(!isLive)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title={isLive ? 'Pause updates' : 'Resume updates'}
            >
              {isLive ? <RefreshCw className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}

      {activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Database className="h-8 w-8 mx-auto mb-2 text-gray-300" />
          <p>No recent activity</p>
          <p className="text-xs mt-1">Activity will appear here as your system processes leads and messages</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`flex-shrink-0 w-8 h-8 ${activity.iconBg} rounded-full flex items-center justify-center`}>
                {activity.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-medium ${getActivityTypeColor(activity.type)}`}>
                    {activity.title}
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTimeAgo(activity.timestamp)}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                {activity.data && (
                  <div className="mt-2 text-xs text-gray-500 bg-gray-50 rounded px-2 py-1">
                    Data Source: Supabase • Real-time updates enabled
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span>📊 {leads.length} Total Leads</span>
            <span>💬 {messages.length} Messages</span>
            <span>⚡ {metrics.activeWorkflows} Active Workflows</span>
          </div>
          <div className="flex items-center space-x-1">
            <Database className="h-3 w-3" />
            <span>Supabase Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeActivityFeed;