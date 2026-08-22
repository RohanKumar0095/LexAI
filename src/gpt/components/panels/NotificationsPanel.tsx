import React from 'react';
import { Bell, BookOpen, AlertOctagon, RefreshCw, Sparkles, CheckCheck } from 'lucide-react';
import type { Notification } from '../../types/user';

interface NotificationsPanelProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onSelectPanel: (panel: string | null) => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onSelectPanel
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'daily-law':
        return <BookOpen className="h-4 w-4 text-brand-gold-550" />;
      case 'law-update':
        return <RefreshCw className="h-4 w-4 text-indigo-500" />;
      case 'learning-reminder':
        return <Sparkles className="h-4 w-4 text-emerald-500" />;
      case 'important-alert':
        return <AlertOctagon className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-slate-450" />;
    }
  };

  const handleNotificationClick = (n: Notification) => {
    onMarkRead(n.id);
    if (n.type === 'daily-law') {
      onSelectPanel('daily-law');
    } else if (n.type === 'important-alert') {
      onSelectPanel('sos-help');
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      
      {/* Title & Toolbar */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
        <div>
          <span className="text-[10px] font-bold text-slate-450 uppercase">
            User Alerts
          </span>
          <h3 className="text-sm font-bold text-slate-905 dark:text-white mt-0.5">
            Notifications ({unreadCount} Unread)
          </h3>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="flex items-center gap-1 text-[10px] font-bold text-brand-gold-555 hover:text-brand-gold-800 dark:text-brand-gold-300 dark:hover:text-brand-gold-100 transition-colors"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            <span>MARK ALL READ</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4 space-y-2">
            <Bell className="h-8 w-8 text-slate-300 dark:text-slate-750" />
            <h5 className="text-xs font-bold text-slate-700 dark:text-slate-350">
              You're all caught up
            </h5>
            <p className="text-[10px] text-slate-405 mt-1">
              Any live system announcements or reminders will appear here.
            </p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className={`rounded-2xl border p-4 text-left transition-all cursor-pointer relative flex gap-3 items-start ${
                n.read
                  ? 'border-slate-200 bg-white/50 dark:border-slate-800 dark:bg-slate-900/20 opacity-75'
                  : 'border-brand-gold-550/20 bg-white dark:border-slate-800 dark:bg-slate-900/60 shadow-sm'
              }`}
            >
              {/* Blue dot indicator */}
              {!n.read && (
                <span className="absolute top-4.5 right-4.5 h-2 w-2 rounded-full bg-indigo-650 dark:bg-indigo-400" />
              )}

              <div className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 ${
                n.read ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' : 'bg-brand-gold-550/10 text-brand-gold-550'
              }`}>
                {getIcon(n.type)}
              </div>

              <div className="space-y-1 pr-4">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {n.title}
                </h4>
                <p className="text-[10.5px] leading-relaxed text-slate-500 dark:text-slate-400">
                  {n.message}
                </p>
                <span className="text-[9px] text-slate-400 block pt-1">
                  {n.timestamp}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
export default NotificationsPanel;
