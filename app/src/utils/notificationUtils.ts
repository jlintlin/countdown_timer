export type NotificationPermission = 'granted' | 'denied' | 'default';

export function isNotificationSupported(): boolean {
  return 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission as NotificationPermission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission === 'denied') {
    return 'denied';
  }

  const permission = await Notification.requestPermission();
  return permission as NotificationPermission;
}

export function sendNotification(title: string, options?: NotificationOptions): Notification | null {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return null;
  }

  try {
    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    });

    return notification;
  } catch (error) {
    console.error('Failed to send notification:', error);
    return null;
  }
}

export function sendTimerCompleteNotification(durationText: string): void {
  sendNotification("Time's up! ⏰", {
    body: `Your ${durationText} timer has completed.`,
    tag: 'timer-complete',
    requireInteraction: true,
    vibrate: [200, 100, 200],
  });
}

// Preferences
export function getNotificationPreference(): boolean {
  const stored = localStorage.getItem('timer-notifications');
  return stored === 'true';
}

export function setNotificationPreference(enabled: boolean): void {
  localStorage.setItem('timer-notifications', enabled.toString());
}
