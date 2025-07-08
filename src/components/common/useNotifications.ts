import { useState } from 'react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  createdAt: string;
  read: boolean;
}

export const useNotifications = () => {
  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'info',
      message: 'New lead from Dubai Marina inquiry',
      createdAt: new Date().toISOString(),
      read: false
    },
    {
      id: '2',
      type: 'success',
      message: 'WhatsApp automation workflow completed',
      createdAt: new Date().toISOString(),
      read: false
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    // Implementation for marking notification as read
    console.log('Marking notification as read:', id);
  };

  const markAllAsRead = () => {
    // Implementation for marking all notifications as read
    console.log('Marking all notifications as read');
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  };
};