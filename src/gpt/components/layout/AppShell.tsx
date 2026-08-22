import React from 'react';
import { Sidebar } from './Sidebar';
import { MobileSidebar } from './MobileSidebar';
import { Header } from './Header';
import type { Notification } from '../../types/user';
import type { Conversation } from '../../types/chat';

interface AppShellProps {
  theme: 'light' | 'dark' | 'system';
  setTheme: (t: 'light' | 'dark' | 'system') => void;
  language: 'en' | 'hi';
  setLanguage: (l: 'en' | 'hi') => void;
  activePanel: string | null;
  onSelectPanel: (panelId: string | null) => void;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  isMobileSidebarOpen: boolean;
  onToggleMobileSidebar: () => void;
  onCloseMobileSidebar: () => void;
  notifications: Notification[];
  guestMode: boolean;
  currentConversationTitle: string;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onPinConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  theme,
  setTheme,
  language,
  setLanguage,
  activePanel,
  onSelectPanel,
  isSidebarCollapsed,
  onToggleSidebar,
  isMobileSidebarOpen,
  onToggleMobileSidebar,
  onCloseMobileSidebar,
  notifications,
  guestMode,
  currentConversationTitle,
  conversations,
  activeConversationId,
  onSelectConversation,
  onPinConversation,
  onDeleteConversation,
  children
}) => {
  return (
    <div className={`flex h-screen w-screen overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Desktop Collapsible Left Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={onToggleSidebar}
        activePanel={activePanel}
        onSelectPanel={onSelectPanel}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={onSelectConversation}
        onPinConversation={onPinConversation}
        onDeleteConversation={onDeleteConversation}
      />

      {/* Mobile Sidebar Sheet Drawer */}
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={onCloseMobileSidebar}
        activePanel={activePanel}
        onSelectPanel={onSelectPanel}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={onSelectConversation}
        onPinConversation={onPinConversation}
        onDeleteConversation={onDeleteConversation}
      />

      {/* Main Content Pane */}
      <div className="flex flex-1 flex-col h-full overflow-hidden bg-background text-foreground transition-colors duration-250">
        
        {/* Top Header */}
        <Header
          currentConversationTitle={currentConversationTitle}
          theme={theme}
          setTheme={setTheme}
          language={language}
          setLanguage={setLanguage}
          notifications={notifications}
          onToggleMobileSidebar={onToggleMobileSidebar}
          onOpenNotifications={() => onSelectPanel('notifications')}
          onOpenSettings={() => onSelectPanel('settings')}
          guestMode={guestMode}
        />

        {/* Workspace Children Screen View */}
        <main className="flex-1 overflow-hidden relative bg-background">
          {children}
        </main>
      </div>
    </div>
  );
};
export default AppShell;
