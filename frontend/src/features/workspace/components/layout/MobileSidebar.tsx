import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Plus, BookOpen, Bookmark, PenTool,
  MapPin, AlertOctagon, Settings,
  MessageSquare, Pin, PinOff, Trash2, User, ChevronDown, ChevronRight, LogOut, Scale 
} from 'lucide-react';
import { useAuth } from '../../../../context';
import { LEXAI_LOGO_URL } from '../../../../constants/brand';
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
        className={`group relative flex items-center justify-between rounded-xl px-2.5 py-2 text-left text-xs transition-all duration-150 cursor-pointer ${
          isActive 
            ? 'bg-[#1C1728] text-white font-semibold border border-[#30243F]' 
            : 'text-[#AAA3BB] hover:bg-[#15111F] hover:text-white'
        }`}
      >
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <MessageSquare className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-[#C084FC]' : 'text-[#AAA3BB]/60'}`} />
          <span className="truncate leading-tight pr-4">
            {conv.title}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {conv.pinned && (
            <Pin className="h-3 w-3 text-[#C084FC] shrink-0" />
          )}
          <button
            onClick={(e) => handlePinClick(conv.id, e)}
            className="p-1 rounded text-[#AAA3BB] hover:text-[#C084FC]"
            title={conv.pinned ? "Unpin" : "Pin"}
          >
            {conv.pinned ? <PinOff className="h-3 w-3" /> : <Pin className="h-3 w-3" />}
          </button>
          <button
            onClick={(e) => handleDeleteClick(conv.id, e)}
            className="p-1 rounded text-[#AAA3BB] hover:text-rose-400"
            title="Delete"
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
    <div className="fixed inset-0 z-50 flex md:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside className="relative flex w-4/5 max-w-xs flex-1 flex-col bg-[#08070D] border-r border-[#30243F] text-[#F8F7FC] pt-3 pb-4">
        {/* Brand Header & Close */}
        <div className="flex h-12 items-center justify-between border-b border-[#30243F] px-4 pb-2">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleSelect(null)}>
            <div className="relative h-7 w-7 rounded-lg overflow-hidden border border-[#A855F7]/30 shadow-md shadow-purple-950/40 shrink-0">
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
            <span className="font-sans font-bold text-base text-white">
              LexAI<span className="text-[#A855F7]">.in</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-[#AAA3BB] hover:bg-[#15111F] hover:text-white transition-colors cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          {menuItems.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#AAA3BB]/70">
                {group.group}
              </h3>
              
              <div className="space-y-[2px]">
                {group.items.map((item, iIdx) => {
                  const IconComponent = item.icon;
                  const isActive = activePanel === item.id;
                  
                  return (
                    <button
                      key={iIdx}
                      onClick={() => handleSelect(item.id)}
                      className={`flex w-full items-center gap-3 rounded-xl py-2 px-3 text-left transition-all duration-150 cursor-pointer ${
                        isActive 
                          ? 'bg-[#1C1728] text-white font-semibold border-l-2 border-[#A855F7]' 
                          : item.highlight
                            ? 'border border-rose-500/25 bg-rose-500/08 text-rose-400'
                            : 'text-[#AAA3BB] hover:bg-[#15111F] hover:text-white'
                      }`}
                    >
                      <IconComponent className={`h-4 w-4 shrink-0 ${
                        isActive ? 'text-[#C084FC]' : item.highlight ? 'text-rose-400' : 'text-[#AAA3BB]'
                      }`} />
                      <span className="text-xs">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* History */}
          <div className="space-y-1">
            <button
              onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
              className="flex w-full items-center justify-between px-3 py-1.5 text-left text-[10px] font-bold uppercase tracking-wider text-[#AAA3BB]/70 hover:text-white"
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
        </div>

        {/* Footer Account Area */}
        <div className="border-t border-[#30243F] p-3 mt-auto bg-[#08070D]" ref={accountMenuRef}>
          <div className="flex w-full items-center justify-between">
            <button
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              className="flex items-center gap-2 overflow-hidden hover:bg-[#15111F] rounded-xl p-1.5 text-left flex-1 mr-2"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#1C1728] border border-[#30243F] text-[#C084FC]">
                <User className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-semibold text-[#D4CFE2] truncate">
                {isAuthenticated ? (user?.name || user?.email || 'Citizen User') : 'Guest Mode'}
              </span>
            </button>
            
            <button
              onClick={() => handleSelect('settings')}
              className="p-1.5 rounded-xl text-[#AAA3BB] hover:text-white hover:bg-[#15111F]"
              title="Settings"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>

          {accountMenuOpen && (
            <div className="absolute bottom-full mb-2 left-3 right-3 rounded-2xl border border-[#30243F] bg-[#15111F] p-1.5 shadow-2xl z-50">
              <div className="px-2.5 py-1 text-[10px] font-bold text-[#AAA3BB] uppercase tracking-wider truncate">
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
                  className="w-full text-left flex items-center gap-2 px-2.5 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl"
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
                    className="w-full text-left px-2.5 py-2 text-xs text-[#D4CFE2] hover:bg-[#1C1728] rounded-xl"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => {
                      setAccountMenuOpen(false);
                      window.location.href = '/signup';
                    }}
                    className="w-full text-left px-2.5 py-2 text-xs text-[#D4CFE2] hover:bg-[#1C1728] rounded-xl"
                  >
                    Create account
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Delete Dialog */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-[#15111F] rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-[#30243F] space-y-4">
              <h4 className="text-sm font-bold text-white">Delete conversation?</h4>
              <p className="text-xs text-[#AAA3BB]">This will remove it permanently.</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-3 py-1.5 rounded-xl border border-[#30243F] text-xs text-[#AAA3BB] bg-[#100D18]"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-3 py-1.5 rounded-xl text-xs text-white bg-rose-600 hover:bg-rose-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};
export default MobileSidebar;
