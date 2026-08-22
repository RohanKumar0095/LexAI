import React from 'react';
import { Sun, Moon, Bell, Globe } from 'lucide-react';
import type { Notification } from '../../types/user';

interface HeaderProps {
  currentConversationTitle: string;
  theme: 'light' | 'dark' | 'system';
  setTheme: (t: 'light' | 'dark' | 'system') => void;
  language: 'en' | 'hi';
  setLanguage: (l: 'en' | 'hi') => void;
  notifications: Notification[];
  onToggleMobileSidebar: () => void;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  guestMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentConversationTitle,
  theme,
  setTheme,
  language,
  setLanguage,
  notifications,
  onToggleMobileSidebar,
  onOpenNotifications
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md transition-colors duration-200 dark:border-slate-800 dark:bg-brand-navy-950/80">
      {/* Left: Mobile Toggle & Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 md:hidden"
          aria-label="Toggle mobile menu"
          id="mobile-sidebar-toggle"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div className="hidden items-baseline gap-2 md:flex">
          <span className="font-sans text-xs font-semibold uppercase tracking-wider text-brand-gold-550 dark:text-brand-gold-300">
            {currentConversationTitle ? 'Active Session' : 'LexAI India'}
          </span>
          <h2 className="text-sm font-medium text-slate-800 dark:text-slate-200 line-clamp-1">
            {currentConversationTitle || 'Your Personal AI Legal Assistant'}
          </h2>
        </div>

        <div className="flex items-center md:hidden font-sans">
          <span className="text-base font-bold text-slate-900 dark:text-white">
            LexAI<span className="text-brand-gold-550 dark:text-brand-gold-300">.in</span>
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-650 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            title="Switch Language"
          >
            <Globe className="h-3.5 w-3.5 opacity-80" />
            <span>{language === 'en' ? 'English' : 'हिंदी'}</span>
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>

        {/* Notifications trigger */}
        <button
          onClick={onOpenNotifications}
          className="relative rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
export default Header;
