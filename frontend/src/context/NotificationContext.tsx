'use client';

import React, { createContext, useContext, useCallback, useState } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  show: (type: NotificationType, message: string, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  dismiss: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const show = useCallback(
    (type: NotificationType, message: string, duration: number = 5000) => {
      const id = Date.now().toString();
      const notification: Notification = { id, type, message, duration };

      setNotifications((prev) => [...prev, notification]);

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }

      return id;
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const success = useCallback(
    (message: string, duration?: number) => show('success', message, duration),
    [show]
  );

  const error = useCallback(
    (message: string, duration?: number) => show('error', message, duration),
    [show]
  );

  const warning = useCallback(
    (message: string, duration?: number) => show('warning', message, duration),
    [show]
  );

  const info = useCallback(
    (message: string, duration?: number) => show('info', message, duration),
    [show]
  );

  return (
    <NotificationContext.Provider
      value={{ notifications, show, success, error, warning, info, dismiss }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}

export function Toast({ notification }: { notification: Notification }) {
  const { dismiss } = useNotification();

  const colors: Record<NotificationType, { bg: string; border: string; text: string }> = {
    success: {
      bg: '#f0fdf4',
      border: '#22c55e',
      text: '#15803d',
    },
    error: {
      bg: '#fef2f2',
      border: '#ef4444',
      text: '#991b1b',
    },
    warning: {
      bg: '#fffbeb',
      border: '#f59e0b',
      text: '#92400e',
    },
    info: {
      bg: '#f0f9ff',
      border: '#3b82f6',
      text: '#1e40af',
    },
  };

  const icons: Record<NotificationType, string> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  const color = colors[notification.type];

  return (
    <div
      style={{
        backgroundColor: color.bg,
        borderLeft: `4px solid ${color.border}`,
        padding: '16px',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        justifyContent: 'space-between',
        marginBottom: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        animation: 'slideIn 0.3s ease-out',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: color.border,
          }}
        >
          {icons[notification.type]}
        </span>
        <p style={{ margin: 0, color: color.text, fontWeight: '500' }}>
          {notification.message}
        </p>
      </div>
      <button
        onClick={() => dismiss(notification.id)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: color.text,
          fontSize: '18px',
          padding: '0',
          opacity: 0.7,
        }}
      >
        ✕
      </button>
    </div>
  );
}

export function NotificationContainer() {
  const { notifications } = useNotification();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        maxWidth: '400px',
        zIndex: 9999,
      }}
    >
      {notifications.map((notification) => (
        <Toast key={notification.id} notification={notification} />
      ))}
    </div>
  );
}
