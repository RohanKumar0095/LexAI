import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Plus, BookOpen, Bookmark, PenTool,
  MapPin, AlertOctagon, Settings,
  MessageSquare, Pin, PinOff, Trash2, User, ChevronDown, ChevronRight, LogOut
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import type { Conversation } from '../../types/chat';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activePanel: string | null;
  onSelectPanel: (panel: string | null) => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onPinConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
}

interface MenuItem {
  id: string | null;
  label: string;
  icon: React.ComponentType<any>;
  description?: string;
  highlight?: boolean;
}

interface MenuGroup {
  group: string;
  items: MenuItem[];
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  onClose,
  activePanel,
  onSelectPanel,
  conversations,
  activeConversationId,
  onSelectConversation,
  onPinConversation,
  onDeleteConversation
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const accountMenuRef = useRef<HTMLDivElement>(null);

  // Close account menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const menuItems: MenuGroup[] = [
    {
      group: 'Primary',
      items: [
        { id: null, label: 'New Chat', icon: Plus, description: 'Start a fresh legal assistant chat' },
        { id: 'daily-law', label: 'Daily Law', icon: BookOpen, description: 'Learn a law a day & quiz' },
        { id: 'saved-laws', label: 'Saved Space', icon: Bookmark, description: 'Saved laws and chat bookmarks' },
        { id: 'complaint-generator', label: 'Complaint Drafts', icon: PenTool, description: 'Generate mock legal notices' },
      ]
    },
    {
      group: 'Location & Emergency',
      items: [
        { id: 'state-awareness', label: 'State-wise Info', icon: MapPin, description: 'Local and district laws' },
        { id: 'sos-help', label: 'SOS Emergency Help', icon: AlertOctagon, description: 'Immediate helpline emergency checklist', highlight: true },
      ]
    }
  ];

  // Group conversations for history list
  const pinnedConvs = conversations.filter(c => c.pinned);
  const unpinnedConvs = conversations.filter(c => !c.pinned);

  const todayConvs = unpinnedConvs.filter(c => c.dateGroup === 'today');
  const yesterdayConvs = unpinnedConvs.filter(c => c.dateGroup === 'yesterday');
  const weekConvs = unpinnedConvs.filter(c => c.dateGroup === 'week');
  const olderConvs = unpinnedConvs.filter(c => c.dateGroup === 'older');

  const handleSelect = (id: string | null) => {
    onSelectPanel(id);
    onClose();
  };

  const handleConversationClick = (id: string) => {
    onSelectConversation(id);
    onClose();
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmId(id);
  };

  const handlePinClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onPinConversation(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      onDeleteConversation(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const renderHistoryItem = (conv: Conversation) => {
    const isActive = conv.id === activeConversationId && activePanel === null;
    return (
      <div
        key={conv.id}
        onClick={() => handleConversationClick(conv.id)}
        className={`group relative flex items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-all duration-150 cursor-pointer ${
          isActive 
            ? 'bg-selected text-foreground font-semibold border border-border/40' 
            : 'text-secondary-foreground hover:bg-hover border border-transparent'
        }`}
      >
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <MessageSquare className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-brand-gold-550 dark:text-brand-gold-300' : 'text-muted-foreground'}`} />
          <span className="truncate leading-tight pr-4">
            {conv.title}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={(e) => handlePinClick(conv.id, e)}
            className="p-0.5 rounded text-muted-foreground hover:text-brand-gold-550 dark:hover:text-brand-gold-300"
          >
            {conv.pinned ? <PinOff className="h-3 w-3" /> : <Pin className="h-3 w-3" />}
          </button>
          <button
            onClick={(e) => handleDeleteClick(conv.id, e)}
            className="p-0.5 rounded text-muted-foreground hover:text-red-500"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    );
  };

  const renderHistoryGroup = (title: string, items: Conversation[]) => {
    if (items.length === 0) return null;
    return (
      <div className="space-y-1 mt-3 first:mt-0">
        <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground px-2">
          {title}
        </span>
        <div className="space-y-[2px]">
          {items.map(renderHistoryItem)}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex md:hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Body */}
      <div className="relative flex w-80 max-w-xs flex-col bg-surface text-foreground p-4 shadow-xl border-r border-border ring-1 ring-black/5 animate-in slide-in-from-left duration-250 z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleSelect(null)}>
            <img src="/assets/logo.jpg" alt="LexAI Logo" className="h-8 w-8 rounded-lg object-cover" />
            <span className="font-sans font-bold text-lg text-foreground">
              LexAI<span className="text-brand-gold-550 dark:text-brand-gold-300">.in</span>
            </span>
          </div>
          <button 
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-hover hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 scrollbar-none">
          {menuItems.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <h3 className="px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {group.group}
              </h3>
              <div className="space-y-0.5">
                {group.items.map((item, iIdx) => {
                  const Icon = item.icon;
                  const isActive = activePanel === item.id;
                  
                  return (
                    <button
                      key={iIdx}
                      onClick={() => handleSelect(item.id)}
                      className={`flex w-full items-center gap-3 rounded-lg py-2 px-3 text-left text-xs transition-all duration-150 ${
                        isActive
                          ? 'bg-selected text-foreground font-semibold border-l-2 border-brand-gold-550'
                          : item.highlight
                            ? 'border border-red-500/20 bg-red-50/50 text-red-500 hover:bg-red-500/10'
                            : 'text-secondary-foreground hover:bg-hover hover:text-foreground'
                      }`}
                    >
                      <Icon className={`h-4.5 w-4.5 shrink-0 ${
                        isActive ? 'text-brand-gold-550 dark:text-brand-gold-300' : item.highlight ? 'text-red-500 animate-pulse' : 'text-muted-foreground'
                      }`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* History Collapsible */}
          <div className="space-y-1 pt-2">
            <button
              onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
              className="flex w-full items-center justify-between px-2 py-1 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              aria-label={isHistoryExpanded ? "Collapse chat history" : "Expand chat history"}
            >
              <span>History</span>
              {isHistoryExpanded ? (
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
              )}
            </button>

            {isHistoryExpanded && (
              <div className="space-y-3 px-1 mt-1">
                {conversations.length === 0 ? (
                  <div className="text-center py-4 text-[10px] text-muted-foreground">
                    No past conversations
                  </div>
                ) : (
                  <>
                    {renderHistoryGroup('Pinned', pinnedConvs)}
                    {renderHistoryGroup('Today', todayConvs)}
                    {renderHistoryGroup('Yesterday', yesterdayConvs)}
                    {renderHistoryGroup('Previous 7 Days', weekConvs)}
                    {renderHistoryGroup('Older', olderConvs)}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Account Area */}
        <div className="border-t border-border p-3 mt-auto bg-background/30 flex flex-col items-center relative" ref={accountMenuRef}>
          <div className="flex w-full items-center justify-between">
            <button
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              className={`flex items-center gap-2 overflow-hidden hover:bg-hover rounded-lg p-1 transition-colors text-left focus:outline-none focus:ring-1 focus:ring-brand-gold-550 flex-1 mr-2 ${
                accountMenuOpen ? 'bg-hover' : ''
              }`}
              title="Account Options"
              aria-label="Open account menu"
              aria-expanded={accountMenuOpen}
              aria-haspopup="true"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-hover text-secondary-foreground">
                <User className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-secondary-foreground truncate">
                {isAuthenticated ? (user?.name || user?.email || 'Citizen User') : 'Guest Mode'}
              </span>
            </button>
            
            <button
              onClick={() => handleSelect('settings')}
              className={`p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-hover transition-colors focus:outline-none focus:ring-1 focus:ring-brand-gold-550 ${
                activePanel === 'settings' ? 'bg-selected text-brand-gold-550 dark:text-brand-gold-300' : ''
              }`}
              title="Settings"
              aria-label="Open settings"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>

          {/* Account Menu Popover */}
          {accountMenuOpen && (
            <div className="absolute bottom-full mb-2 w-48 rounded-xl border border-border bg-surface p-1.5 shadow-lg z-50 animate-in fade-in slide-in-from-bottom-2 duration-150 left-2">
              <div className="px-2.5 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">
                {isAuthenticated ? (user?.email || 'Logged In') : 'Guest Mode'}
              </div>
              <div className="h-[1px] bg-border my-1 mx-1" />
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setAccountMenuOpen(false);
                    logout();
                    window.location.href = '/login';
                  }}
                  className="w-full text-left flex items-center gap-2 px-2.5 py-2 text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-lg transition-colors font-medium focus:outline-none cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setAccountMenuOpen(false);
                      window.location.href = '/login';
                    }}
                    className="w-full text-left px-2.5 py-2 text-xs text-secondary-foreground hover:bg-hover hover:text-foreground rounded-lg transition-colors font-medium focus:outline-none focus:bg-hover focus:text-foreground cursor-pointer"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => {
                      setAccountMenuOpen(false);
                      window.location.href = '/signup';
                    }}
                    className="w-full text-left px-2.5 py-2 text-xs text-secondary-foreground hover:bg-hover hover:text-foreground rounded-lg transition-colors font-medium focus:outline-none focus:bg-hover focus:text-foreground cursor-pointer"
                  >
                    Create account
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Individual Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-sm w-full p-5 shadow-premium border border-border space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <h4 className="text-sm font-bold text-foreground">
                Delete this conversation?
              </h4>
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-secondary-foreground leading-relaxed">
              This will permanently delete this conversation from your session cache.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 rounded-lg border border-border text-xs font-bold text-secondary-foreground bg-surface hover:bg-hover"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-red-650 hover:bg-red-500 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default MobileSidebar;
