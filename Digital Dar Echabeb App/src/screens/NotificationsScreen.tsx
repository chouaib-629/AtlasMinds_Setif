import React from 'react';
import { useApp } from '../lib/context';
import { mockNotifications } from '../lib/data';
import { Button } from '../components/ui/button';
import { ArrowLeft, ArrowRight, Bell, Trophy, Gift, Megaphone, Settings } from 'lucide-react';

interface NotificationsScreenProps {
  onBack: () => void;
}

export function NotificationsScreen({ onBack }: NotificationsScreenProps) {
  const { t, language } = useApp();
  const BackIcon = language === 'ar' ? ArrowRight : ArrowLeft;

  const getIcon = (type: string) => {
    switch (type) {
      case 'reminder': return Bell;
      case 'achievement': return Trophy;
      case 'reward': return Gift;
      case 'announcement': return Megaphone;
      default: return Bell;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'reminder': return 'text-blue-500 bg-blue-500/10';
      case 'achievement': return 'text-yellow-500 bg-yellow-500/10';
      case 'reward': return 'text-green-500 bg-green-500/10';
      case 'announcement': return 'text-purple-500 bg-purple-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-muted">
              <BackIcon className="w-6 h-6" />
            </button>
            <h2>{t('الإشعارات', 'Notifications')}</h2>
          </div>
          <button className="p-2 rounded-full hover:bg-muted">
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-b border-border">
        <Button variant="outline" size="sm" className="w-full">
          {t('تعليم الكل كمقروء', 'Mark All as Read')}
        </Button>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {mockNotifications.map((notification) => {
          const Icon = getIcon(notification.type);
          const iconColorClass = getIconColor(notification.type);

          return (
            <div
              key={notification.id}
              className={`p-4 border-b border-border ${
                !notification.read ? 'bg-primary/5' : ''
              }`}
            >
              <div className="flex gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${iconColorClass}`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4>{notification.title}</h4>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-2" />
                    )}
                  </div>
                  <p className="text-muted-foreground mb-2">
                    {notification.message}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {notification.createdAt}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {mockNotifications.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>{t('لا توجد إشعارات', 'No notifications')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
