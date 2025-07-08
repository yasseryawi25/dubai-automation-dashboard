import { useState, useEffect, useRef } from 'react';

export type NotificationType = 'lead' | 'workflow' | 'system' | 'marketing' | 'admin';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  priority: NotificationPriority;
  icon?: React.ReactNode;
  data?: any;
  autoDismiss?: boolean;
}

const sampleNotifications: Notification[] = [
  {
    id: '1',
    type: 'lead',
    title: 'New Lead from WhatsApp',
    message: 'Ahmed Al-Rashid interested in Marina apartment',
    timestamp: new Date().toISOString(),
    read: false,
    priority: 'high',
    autoDismiss: false
  },
  {
    id: '2',
    type: 'workflow',
    title: "Workflow 'Lead Qualification' completed",
    message: 'Completed successfully for 5 leads',
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    read: false,
    priority: 'medium',
    autoDismiss: true
  },
  {
    id: '3',
    type: 'marketing',
    title: "Campaign 'Downtown Properties' reached 10,000 impressions",
    message: 'Performance alert: 10,000+ impressions',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    read: true,
    priority: 'low',
    autoDismiss: true
  },
  {
    id: '4',
    type: 'system',
    title: 'System Maintenance',
    message: 'Scheduled for tonight 2 AM UAE time',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: false,
    priority: 'urgent',
    autoDismiss: false
  },
  {
    id: '5',
    type: 'admin',
    title: 'Task Reminder',
    message: 'Call John Smith about Downtown viewing',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    read: true,
    priority: 'medium',
    autoDismiss: false
  }
];

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const stored = localStorage.getItem('dubai_notifications');
    return stored ? JSON.parse(stored) : sampleNotifications;
  });
  const [preferences, setPreferences] = useState({ sound: true });
  const [unreadCount, setUnreadCount] = useState(0);
  const soundRef = useRef<HTMLAudioElement | null>(null);

  // Update unread count
  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  // Persist notifications
  useEffect(() => {
    localStorage.setItem('dubai_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newNotif: Notification = {
          id: Date.now().toString(),
          type: ['lead', 'workflow', 'system', 'marketing', 'admin'][Math.floor(Math.random() * 5)] as NotificationType,
          title: 'Dubai Real Estate Alert',
          message: 'حدث جديد في النظام / New event in the system',
          timestamp: new Date().toISOString(),
          read: false,
          priority: ['low', 'medium', 'high', 'urgent'][Math.floor(Math.random() * 4)] as NotificationPriority,
          autoDismiss: Math.random() > 0.5
        };
        setNotifications(prev => [newNotif, ...prev]);
        if (preferences.sound && soundRef.current) {
          soundRef.current.play();
        }
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [preferences.sound]);

  // Auto-dismiss notifications
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    notifications.forEach(n => {
      if (n.autoDismiss && !n.read) {
        const timer = setTimeout(() => {
          setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
        }, 10000);
        timers.push(timer);
      }
    });
    return () => timers.forEach(clearTimeout);
  }, [notifications]);

  // CRUD operations
  const markAsRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAsUnread = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: false } : n));
  const markAllAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const deleteNotification = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));
  const clearAll = () => setNotifications([]);

  // Preferences
  const setSound = (enabled: boolean) => setPreferences(p => ({ ...p, sound: enabled }));

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    clearAll,
    preferences,
    setSound,
    soundRef
  };
} 