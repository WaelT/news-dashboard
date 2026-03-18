import { useState, useCallback } from 'react';

const STORAGE_KEY = 'notifications-enabled';

function getNotificationAPI() {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    return window.Notification;
  }
  return null;
}

export default function useNotifications() {
  const NotificationAPI = getNotificationAPI();

  const [enabled, setEnabled] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [permission, setPermission] = useState(() =>
    NotificationAPI ? NotificationAPI.permission : 'denied'
  );

  const requestPermission = useCallback(async () => {
    if (!NotificationAPI) return 'denied';
    const result = await NotificationAPI.requestPermission();
    setPermission(result);
    return result;
  }, [NotificationAPI]);

  const toggleEnabled = useCallback(async () => {
    if (!NotificationAPI) return;

    if (!enabled) {
      // Turning on — request permission if not already granted
      let perm = NotificationAPI.permission;
      if (perm !== 'granted') {
        perm = await requestPermission();
      }
      if (perm === 'granted') {
        setEnabled(true);
        try { localStorage.setItem(STORAGE_KEY, 'true'); } catch {}
      }
    } else {
      setEnabled(false);
      try { localStorage.setItem(STORAGE_KEY, 'false'); } catch {}
    }
  }, [enabled, NotificationAPI, requestPermission]);

  const sendNotification = useCallback((title, body) => {
    if (!NotificationAPI || !enabled) return;
    if (NotificationAPI.permission !== 'granted') return;
    try {
      new NotificationAPI(title, {
        body,
        icon: '/favicon.ico',
        tag: 'breaking-news',
      });
    } catch {}
  }, [NotificationAPI, enabled]);

  return {
    enabled,
    permission,
    requestPermission,
    toggleEnabled,
    sendNotification,
    supported: !!NotificationAPI,
  };
}
