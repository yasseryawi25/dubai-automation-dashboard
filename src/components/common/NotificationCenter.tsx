import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, Trash2, Filter, Eye, EyeOff } from 'lucide-react';
import { useNotifications } from './useNotifications';
import { NotificationType } from './useNotifications';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'top-right' | 'top-left';
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  position = 'top-right'
}) => {
  const { notifications, unreadCount, markAsRead, markAsUnread, deleteNotification, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread' | NotificationType>('all');
  const [showFilters, setShowFilters] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (isOpen && panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, onClose]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'lead': return '👤';
      case 'workflow': return '⚙️';
      case 'system': return '🔧';
      case 'marketing': return '📢';
      case 'admin': return '📋';
      default: return '📌';
    }
  };

  const getTypeLabel = (type: NotificationType) => {
    switch (type) {
      case 'lead': return 'Lead';
      case 'workflow': return 'Workflow';
      case 'system': return 'System';
      case 'marketing': return 'Marketing';
      case 'admin': return 'Admin';
      default: return 'Other';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-gray-300 bg-gray-50';
      default: return 'border-gray-300 bg-white';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-25 z-40" onClick={onClose} />
      
      {/* Notification Panel */}
      <div
        ref={panelRef}
        className={`fixed z-50 w-96 max-w-[90vw] max-h-[80vh] bg-white rounded-lg shadow-xl border ${
          position === 'top-right' ? 'top-16 right-4' : 'top-16 left-4'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary-gold" />
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-1 hover:bg-gray-100 rounded"
              style={{ minWidth: 32, minHeight: 32 }}
            >
              <Filter className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded"
              style={{ minWidth: 32, minHeight: 32 }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="p-3 border-b bg-gray-50">
            <div className="flex flex-wrap gap-2">
              {(['all', 'unread', 'lead', 'workflow', 'system', 'marketing', 'admin'] as const).map(filterType => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-3 py-1 rounded-full text-xs ${
                    filter === filterType
                      ? 'bg-primary-gold text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {filterType === 'all' ? 'All' : 
                   filterType === 'unread' ? 'Unread' : 
                   getTypeLabel(filterType)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between p-3 border-b">
          <button
            onClick={markAllAsRead}
            className="text-sm text-primary-gold hover:underline"
          >
            Mark all as read
          </button>
          <span className="text-xs text-gray-500">
            {filteredNotifications.length} notifications
          </span>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto max-h-96">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <span className="text-lg">{getTypeIcon(notification.type)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className={`font-medium text-sm ${!notification.read ? 'font-semibold' : ''}`}>
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-500">
                              {formatTime(notification.timestamp)}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              notification.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                              notification.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                              notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {notification.priority}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => notification.read ? markAsUnread(notification.id) : markAsRead(notification.id)}
                            className="p-1 hover:bg-gray-200 rounded"
                            style={{ minWidth: 28, minHeight: 28 }}
                            title={notification.read ? 'Mark as unread' : 'Mark as read'}
                          >
                            {notification.read ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 hover:bg-red-100 rounded text-red-500"
                            style={{ minWidth: 28, minHeight: 28 }}
                            title="Delete notification"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationCenter; 