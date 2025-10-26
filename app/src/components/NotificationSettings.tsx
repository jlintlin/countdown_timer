import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { Bell, BellOff } from 'lucide-react';
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  getNotificationPreference,
  setNotificationPreference,
  type NotificationPermission,
} from '../utils/notificationUtils';
import { toast } from 'sonner@2.0.3';

export function NotificationSettings() {
  const [permission, setPermission] = useState<NotificationPermission>(() => getNotificationPermission());
  const [enabled, setEnabled] = useState(() => getNotificationPreference());
  const [open, setOpen] = useState(false);

  const supported = isNotificationSupported();

  useEffect(() => {
    if (open) {
      setPermission(getNotificationPermission());
    }
  }, [open]);

  const handleToggle = async (checked: boolean) => {
    if (!supported) {
      toast.error('Notifications not supported', {
        description: 'Your browser does not support notifications.',
      });
      return;
    }

    if (checked && permission === 'default') {
      const newPermission = await requestNotificationPermission();
      setPermission(newPermission);

      if (newPermission === 'granted') {
        setEnabled(true);
        setNotificationPreference(true);
        toast.success('Notifications enabled', {
          description: 'You will receive notifications when timers complete.',
        });
      } else if (newPermission === 'denied') {
        setEnabled(false);
        setNotificationPreference(false);
        toast.error('Notification permission denied', {
          description: 'Please enable notifications in your browser settings.',
        });
      }
    } else if (checked && permission === 'denied') {
      toast.error('Notification permission denied', {
        description: 'Please enable notifications in your browser settings.',
      });
      setEnabled(false);
    } else if (checked && permission === 'granted') {
      setEnabled(true);
      setNotificationPreference(true);
      toast.success('Notifications enabled');
    } else {
      setEnabled(false);
      setNotificationPreference(false);
      toast.info('Notifications disabled');
    }
  };

  const canEnable = supported && permission !== 'denied';
  const showWarning = permission === 'denied';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notification settings"
        >
          {enabled && permission === 'granted' ? (
            <Bell className="h-4 w-4" />
          ) : (
            <BellOff className="h-4 w-4" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-1">Browser Notifications</h4>
            <p className="text-xs text-muted-foreground">
              Get notified when your timer completes, even when the tab is not focused.
            </p>
          </div>

          {!supported ? (
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
              Notifications are not supported in your browser.
            </div>
          ) : showWarning ? (
            <div className="text-sm text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-md">
              Notification permission denied. Please enable notifications in your browser settings.
            </div>
          ) : null}

          <div className="flex items-center justify-between">
            <Label htmlFor="notifications-toggle">Enable notifications</Label>
            <Switch
              id="notifications-toggle"
              checked={enabled && permission === 'granted'}
              onCheckedChange={handleToggle}
              disabled={!canEnable}
            />
          </div>

          {permission === 'granted' && (
            <div className="text-xs text-muted-foreground pt-2 border-t">
              <p>✓ Permission granted</p>
              <p className="mt-1">
                Notifications will appear when a timer completes, even if the browser tab is in the background.
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
