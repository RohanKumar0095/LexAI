import React from 'react';
import { Bell, Globe, Workflow } from 'lucide-react';
import { LEXAI_LOGO_URL } from '../../../../constants/brand';
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
  onToggleInspector?: () => void;
  isInspectorOpen?: boolean;
  isProcessing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentConversationTitle,
  language,
  setLanguage,
  notifications,
  onToggleMobileSidebar,
  onOpenNotifications,
  onToggleInspector,
  isInspectorOpen = false,
  isProcessing = false
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between bg-[#08070D]/90 px-4 backdrop-blur-md transition-colors duration-200">
      {/* Left: Mobile Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="rounded-xl p-1.5 text-[#AAA3BB] hover:bg-[#15111F] hover:text-white md:hidden cursor-pointer"
          aria-label="Toggle mobile menu"
          id="mobile-sidebar-toggle"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div className="hidden items-baseline gap-2 md:flex">
          <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[#C084FC]">
            {currentConversationTitle ? 'Active Session' : 'LexAI India'}
          </span>
          <h2 className="text-sm font-medium text-white line-clamp-1">
            {currentConversationTitle || 'Your Personal AI Legal Assistant'}
          </h2>
        </div>

        <div className="flex items-center gap-2 md:hidden font-sans">
          <div className="relative h-6 w-6 rounded-md overflow-hidden border border-[#A855F7]/30 shadow-sm shrink-0">
            <img 
              src={LEXAI_LOGO_URL} 
              alt="LexAI-India Logo" 
              className="w-full h-full object-cover" 
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <span className="text-base font-bold text-white">
            LexAI<span className="text-[#A855F7]">.in</span>
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* RAG Pipeline Inspector Button */}
        {onToggleInspector && (
          <button
            onClick={onToggleInspector}
            className={`relative flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium transition-all focus:outline-none focus:ring-1 focus:ring-[#A855F7] cursor-pointer ${
              isInspectorOpen
                ? 'bg-[#A855F7]/20 text-[#C084FC] border border-[#A855F7]/40 shadow-sm'
                : 'text-[#AAA3BB] hover:bg-[#15111F] hover:text-white border border-transparent'
            }`}
            title="RAG Pipeline Inspector"
            aria-label="RAG Pipeline"
            aria-pressed={isInspectorOpen}
          >
            <Workflow className={`h-4 w-4 ${isProcessing ? 'animate-spin text-[#C084FC]' : 'text-[#C084FC]'}`} />
            <span className="hidden sm:inline">RAG Pipeline</span>
            {isProcessing && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A855F7] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A855F7]"></span>
              </span>
            )}
          </button>
        )}

        {/* Language Selector */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium text-[#AAA3BB] hover:bg-[#15111F] hover:text-white border border-[#30243F] transition-colors cursor-pointer"
          title="Switch Language"
        >
          <Globe className="h-3.5 w-3.5 text-[#C084FC]" />
          <span className="font-semibold text-white uppercase">{language}</span>
        </button>

        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          className="relative rounded-xl p-2 text-[#AAA3BB] hover:bg-[#15111F] hover:text-white border border-transparent hover:border-[#30243F] transition-colors cursor-pointer"
          title="Notifications"
          aria-label="Open notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A855F7] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A855F7]"></span>
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
export default Header;
