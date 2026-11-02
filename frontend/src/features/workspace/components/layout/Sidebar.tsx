import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, MessageSquare, BookOpen, Bookmark, PenTool,
  MapPin, AlertOctagon, ChevronLeft, ChevronRight, 
  History, Settings, Pin, PinOff, Trash2, User, ChevronDown, X, LogOut, Scale 
} from 'lucide-react';
import { useAuth } from '../../../../context';
import { LEXAI_LOGO_URL } from '../../../../constants/brand';
import type { Conversation } from '../../types/chat';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
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
  description: string;
  highlight?: boolean;
}

interface MenuGroup {
  group: string;
  items: MenuItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
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
        onClick={() => {
          onSelectConversation(conv.id);
        }}
        className={`group relative flex items-center justify-between rounded-xl px-2.5 py-1.5 text-left text-xs transition-all duration-150 cursor-pointer ${
          isActive 
            ? 'bg-[#1C1728] text-white font-semibold border border-[#30243F] shadow-sm shadow-purple-950/20' 
            : 'text-[#AAA3BB] hover:bg-[#15111F] hover:text-white border border-transparent'
        }`}
      >
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <MessageSquare className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-[#C084FC]' : 'text-[#AAA3BB]/60'}`} />
          <span className="truncate leading-tight pr-4">
            {conv.title}
          </span>
        </div>

        {/* Floating actions on hover */}
        <div className="absolute right-1.5 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-[#15111F] p-0.5 rounded-lg border border-[#30243F] shadow-sm">
          <button
            onClick={(e) => handlePinClick(conv.id, e)}
            className="p-1 rounded text-[#AAA3BB] hover:text-[#C084FC] transition-colors"
            title={conv.pinned ? "Unpin Conversation" : "Pin Conversation"}
            aria-label={conv.pinned ? "Unpin conversation" : "Pin conversation"}
          >
            {conv.pinned ? <PinOff className="h-3 w-3" /> : <Pin className="h-3 w-3" />}
          </button>
          <button
            onClick={(e) => handleDeleteClick(conv.id, e)}
            className="p-1 rounded text-[#AAA3BB] hover:text-rose-400 transition-colors"
            title="Delete Conversation"
            aria-label="Delete conversation"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>

        {/* Small pin indicator if pinned and not hovered */}
        {conv.pinned && (
          <Pin className="h-2.5 w-2.5 text-[#C084FC] absolute right-2 group-hover:hidden shrink-0" />
        )}
      </div>
    );
  };

  const renderHistoryGroup = (title: string, items: Conversation[]) => {
    if (items.length === 0) return null;
    return (
      <div className="space-y-1 mt-3 first:mt-0">
        <span className="text-[9px] font-bold uppercase tracking-wider text-[#AAA3BB]/70 px-2.5">
          {title}
        </span>
        <div className="space-y-[2px]">
          {items.map(renderHistoryItem)}
        </div>
      </div>
    );
  };

  return (
    <aside 
      className={`relative hidden h-screen shrink-0 border-r border-[#30243F] bg-[#08070D] text-[#F8F7FC] transition-all duration-300 md:flex flex-col ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-14 items-center justify-between border-b border-[#30243F] px-4">
        {!isCollapsed && (
          <>
            <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => onSelectPanel(null)}>
              <div className="relative h-7 w-7 rounded-lg overflow-hidden border border-[#A855F7]/30 shadow-md shadow-purple-950/40 group-hover:border-[#C084FC]/60 transition-all shrink-0">
                <img 
                  src={LEXAI_LOGO_URL} 
                  alt="LexAI-India Logo" 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#7C3AED] via-[#A855F7] to-[#C084FC] flex items-center justify-center">
                  <Scale className="h-3.5 w-3.5 text-white" />
                </div>
              </div>
              <span className="font-sans font-bold text-base text-white group-hover:text-[#C084FC] transition-colors">
                LexAI<span className="text-[#A855F7]">.in</span>
              </span>
            </div>
            <button
              onClick={onToggleCollapse}
              className="rounded-lg p-1.5 text-[#AAA3BB] hover:bg-[#15111F] hover:text-white transition-colors cursor-pointer"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </>
        )}
        {isCollapsed && (
          <button 
            className="mx-auto h-8 w-8 rounded-xl overflow-hidden border border-[#A855F7]/30 shadow-md shadow-purple-950/40 hover:border-[#C084FC]/60 transition-all cursor-pointer relative group flex items-center justify-center p-0"
            onClick={onToggleCollapse}
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            <img 
              src={LEXAI_LOGO_URL} 
              alt="LexAI-India Logo" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#7C3AED] via-[#A855F7] to-[#C084FC] flex items-center justify-center">
              <Scale className="h-4 w-4 text-white" />
            </div>
          </button>
        )}
      </div>

      {/* Main Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-5 scrollbar-none">
        {menuItems.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!isCollapsed && (
              <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#AAA3BB]/70">
                {group.group}
              </h3>
            )}
            
            <div className="space-y-[2px]">
              {group.items.map((item, iIdx) => {
                const IconComponent = item.icon;
                const isActive = activePanel === item.id;
                
                return (
                  <button
                    key={iIdx}
                    onClick={() => onSelectPanel(item.id)}
                    className={`flex w-full items-center gap-3 rounded-xl py-2 px-3 text-left transition-all duration-150 group relative cursor-pointer ${
                      isActive 
                        ? 'bg-[#1C1728] text-white font-semibold border-l-2 border-[#A855F7] shadow-sm' 
                        : item.highlight
                          ? 'border border-rose-500/25 bg-rose-500/08 text-rose-400 hover:bg-rose-500/15'
                          : 'text-[#AAA3BB] hover:bg-[#15111F] hover:text-white'
                    }`}
                    title={isCollapsed ? `${item.label} - ${item.description}` : undefined}
                  >
                    <IconComponent className={`h-4 w-4 shrink-0 ${
                      isActive ? 'text-[#C084FC]' : item.highlight ? 'text-rose-400 animate-pulse' : 'text-[#AAA3BB]'
                    }`} />
                    
                    {!isCollapsed && (
                      <div className="flex-1">
                        <div className="text-xs">{item.label}</div>
                      </div>
                    )}

                    {/* Tooltip for collapsed mode */}
                    {isCollapsed && (
                      <div className="absolute left-16 z-50 hidden rounded-lg bg-[#15111F] border border-[#30243F] px-2.5 py-1 text-xs text-white opacity-0 transition-opacity group-hover:block group-hover:opacity-100 whitespace-nowrap shadow-xl pointer-events-none">
                        {item.label}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Collapsible History Section */}
        <div className="space-y-1">
          {isCollapsed ? (
            <button
              onClick={onToggleCollapse}
              className="flex w-full items-center justify-center rounded-xl py-2 text-[#AAA3BB] hover:bg-[#15111F] hover:text-white transition-all duration-150 cursor-pointer"
              title="Chat History"
            >
              <History className="h-4 w-4" />
            </button>
          ) : (
            <div className="space-y-1">
              <button
                onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                className="flex w-full items-center justify-between px-3 py-1.5 text-left text-[10px] font-bold uppercase tracking-wider text-[#AAA3BB]/70 hover:text-white transition-colors cursor-pointer"
                aria-label={isHistoryExpanded ? "Collapse chat history" : "Expand chat history"}
              >
                <span>History</span>
                {isHistoryExpanded ? (
                  <ChevronDown className="h-3 w-3 text-[#AAA3BB]" />
                ) : (
                  <ChevronRight className="h-3 w-3 text-[#AAA3BB]" />
                )}
              </button>

              {isHistoryExpanded && (
                <div className="space-y-3 px-1">
                  {conversations.length === 0 ? (
                    <div className="text-center py-4 text-[10px] text-[#AAA3BB]/60">
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
          )}
        </div>
      </div>

      {/* Bottom Account Area */}
      <div className="border-t border-[#30243F] p-3 mt-auto bg-[#08070D] flex flex-col items-center relative" ref={accountMenuRef}>
        <div className="flex w-full items-center justify-between">
          <button
            onClick={() => setAccountMenuOpen(!accountMenuOpen)}
            className={`flex items-center gap-2 overflow-hidden hover:bg-[#15111F] rounded-xl p-1.5 transition-colors text-left focus:outline-none focus:ring-1 focus:ring-[#A855F7] flex-1 mr-2 cursor-pointer ${
              accountMenuOpen ? 'bg-[#15111F]' : ''
            }`}
            title="Account Options"
            aria-label="Open account menu"
            aria-expanded={accountMenuOpen}
            aria-haspopup="true"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#1C1728] border border-[#30243F] text-[#C084FC]">
              <User className="h-3.5 w-3.5" />
            </div>
            {!isCollapsed && (
              <span className="text-xs font-semibold text-[#D4CFE2] truncate">
                {isAuthenticated ? (user?.name || user?.email || 'Citizen User') : 'Guest Mode'}
              </span>
            )}
          </button>
          
          {!isCollapsed && (
            <button
              onClick={() => onSelectPanel('settings')}
              className={`p-1.5 rounded-xl text-[#AAA3BB] hover:text-white hover:bg-[#15111F] transition-colors focus:outline-none focus:ring-1 focus:ring-[#A855F7] cursor-pointer ${
                activePanel === 'settings' ? 'bg-[#1C1728] text-[#C084FC]' : ''
              }`}
              title="Settings"
              aria-label="Open settings"
            >
              <Settings className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Account Menu Popover */}
        {accountMenuOpen && (
          <div className={`absolute bottom-full mb-2 w-48 rounded-2xl border border-[#30243F] bg-[#15111F] p-1.5 shadow-2xl shadow-purple-950/40 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150 backdrop-blur-xl ${
            isCollapsed ? 'left-2' : 'left-3'
          }`}>
            <div className="px-2.5 py-1.5 text-[10px] font-bold text-[#AAA3BB] uppercase tracking-wider truncate">
              {isAuthenticated ? (user?.email || 'Logged In') : 'Guest Mode'}
            </div>
            <div className="h-[1px] bg-[#30243F] my-1 mx-1" />
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setAccountMenuOpen(false);
                  logout();
                  window.location.href = '/login';
                }}
                className="w-full text-left flex items-center gap-2 px-2.5 py-2 text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl transition-colors font-medium focus:outline-none cursor-pointer"
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
                  className="w-full text-left px-2.5 py-2 text-xs text-[#D4CFE2] hover:bg-[#1C1728] hover:text-white rounded-xl transition-colors font-medium focus:outline-none cursor-pointer"
                >
                  Sign in
                </button>
                <button
                  onClick={() => {
                    setAccountMenuOpen(false);
                    window.location.href = '/signup';
                  }}
                  className="w-full text-left px-2.5 py-2 text-xs text-[#D4CFE2] hover:bg-[#1C1728] hover:text-white rounded-xl transition-colors font-medium focus:outline-none cursor-pointer"
                >
                  Create account
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Delete Individual Conversation Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-[#15111F] rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-[#30243F] space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <h4 className="text-sm font-bold text-white">
                Delete this conversation?
              </h4>
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="text-[#AAA3BB] hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-[#AAA3BB] leading-relaxed">
              This will permanently delete this conversation from your session cache.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 rounded-xl border border-[#30243F] text-xs font-semibold text-[#D4CFE2] bg-[#100D18] hover:bg-[#1C1728] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
export default Sidebar;
