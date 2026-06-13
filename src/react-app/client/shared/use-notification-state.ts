'use client';

import { useCallback, useState } from 'react';

export interface NotificationState {
  message: string;
  tone: 'success' | 'warning' | 'danger';
}

export function useNotificationState() {
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const clearNotification = useCallback(() => setNotification(null), []);
  return { notification, setNotification, clearNotification };
}
