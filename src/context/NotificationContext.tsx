import React, { createContext, useContext, useState, useEffect } from 'react';

export type NotificationType = 'tip' | 'alert' | 'promo';

export interface Notification {
  id: number;
  title: string;
  desc: string;
  time: string;
  type: NotificationType;
  link: string;
  unread: boolean;
  timestamp: number;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'unread' | 'timestamp'>) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: number) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('fingers_love_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse notifications', e);
      }
    }
    return [
      { id: 1, title: '最新保養知識', desc: '凝膠美甲後如何維持持久度？', time: '2小時前', type: 'tip', link: '/news/1', unread: true, timestamp: Date.now() - 7200000 },
      { id: 2, title: '預約提醒', desc: '您明天下午 2:00 有一個美甲預約', time: '5小時前', type: 'alert', link: '/booking/2', unread: true, timestamp: Date.now() - 18000000 },
      { id: 3, title: '優惠活動', desc: '新客 8 折優惠即將結束，立即領取！', time: '1天前', type: 'promo', link: '/', unread: false, timestamp: Date.now() - 86400000 },
    ];
  });

  useEffect(() => {
    localStorage.setItem('fingers_love_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const addNotification = (n: Omit<Notification, 'id' | 'unread' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...n,
      id: Date.now(),
      unread: true,
      timestamp: Date.now(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAll
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
