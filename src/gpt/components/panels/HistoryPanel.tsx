import React, { useState } from 'react';
import { Search, Trash2, Pin, PinOff, MessageSquare, Archive, Trash, X } from 'lucide-react';
import type { Conversation } from '../../types/chat';

interface HistoryPanelProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onPinConversation: (id: string) => void;
  onClearAllHistory?: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  onPinConversation,
  onClearAllHistory
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Filter conversations based on query
  const filtered = conversations.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.preview && c.preview.toLowerCase().includes(searchQuery.toLowerCase())) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Separate pinned and non-pinned
  const pinnedConversations = filtered.filter(c => c.pinned);
  const nonPinned = filtered.filter(c => !c.pinned);

  // Date category grouping for non-pinned items
  const todayConvs = nonPinned.filter(c => c.dateGroup === 'today');
  const yesterdayConvs = nonPinned.filter(c => c.dateGroup === 'yesterday');
  const weekConvs = nonPinned.filter(c => c.dateGroup === 'week');
  const olderConvs = nonPinned.filter(c => c.dateGroup === 'older');

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

  const confirmClearAll = () => {
    if (onClearAllHistory) {
      onClearAllHistory();
    }
    setShowClearConfirm(false);
  };

  const renderGroup = (title: string, items: Conversation[]) => {
    if (items.length === 0) return null;
    return (
      <div className="space-y-1.5 mt-5 first:mt-0">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2">
          {title}
        </h4>
        <div className="space-y-[4px]">
          {items.map((conv) => {
            const isActive = conv.id === activeConversationId;
            return (
              <div
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`group relative flex flex-col rounded-xl p-3 text-left transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm' 
                    : 'border border-transparent hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:border-slate-100 dark:hover:border-slate-800/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 overflow-hidden flex-1">
                    <MessageSquare className={`h-4 w-4 shrink-0 mt-0.5 ${isActive ? 'text-brand-gold-550' : 'text-slate-400'}`} />
                    <h5 className={`font-sans font-bold text-xs truncate leading-tight ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                      {conv.title}
                    </h5>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">
                    {conv.timestamp}
                  </span>
                </div>
                
                {conv.preview && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-405 truncate mt-1 pl-6">
                    {conv.preview}
                  </p>
                )}

                {/* Actions: Pin & Delete on Hover */}
                <div className="absolute right-2 bottom-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-50 dark:bg-slate-900/80 px-1 rounded-md border border-slate-100 dark:border-slate-800 shadow-sm">
                  <button
                    onClick={(e) => handlePinClick(conv.id, e)}
                    className="p-1 rounded text-slate-400 hover:text-brand-gold-550 dark:hover:text-brand-gold-300 transition-colors"
                    title={conv.pinned ? "Unpin Conversation" : "Pin Conversation"}
                    aria-label={conv.pinned ? "Unpin conversation" : "Pin conversation"}
                  >
                    {conv.pinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(conv.id, e)}
                    className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors"
                    title="Delete Conversation"
                    aria-label="Delete conversation"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col space-y-4 relative">
      {/* Panel Header */}
      <div>
        <span className="rounded bg-brand-gold-550/10 px-2 py-0.5 text-[10px] font-bold text-brand-gold-550 dark:text-brand-gold-300 uppercase tracking-wider">
          History Log
        </span>
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1">
          Chat History
        </h3>
        <p className="text-[11px] text-slate-500 dark:text-slate-405 mt-0.5">
          View and continue your previous conversations.
        </p>
      </div>

      {/* Actions & Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:border-brand-gold-550 focus:outline-none focus:ring-1 focus:ring-brand-gold-550/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            aria-label="Search conversations"
          />
        </div>
        {conversations.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold border border-red-200 text-red-600 bg-red-50/50 hover:bg-red-50 hover:text-red-700 dark:border-red-900/30 dark:text-red-400 dark:bg-red-950/20 dark:hover:bg-red-950/40 transition-colors"
            title="Clear All History"
          >
            <Trash className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Clear All</span>
          </button>
        )}
      </div>

      {/* History Lists */}
      <div className="flex-1 overflow-y-auto pr-1">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-56 text-center px-4">
            <Archive className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-3" />
            <h5 className="text-xs font-bold text-slate-700 dark:text-slate-350">
              No conversations yet
            </h5>
            <p className="text-[11px] text-slate-500 dark:text-slate-405 mt-1 max-w-[200px]">
              Your legal assistant interactions will appear here once you send a message.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center text-slate-400 dark:text-slate-500">
            <Archive className="h-8 w-8 mb-2 opacity-50" />
            <span className="text-xs font-semibold">No conversations found</span>
            <span className="text-[10px] mt-0.5">Try searching with a different keyword.</span>
          </div>
        ) : (
          <div className="space-y-1">
            {renderGroup('Pinned', pinnedConversations)}
            {renderGroup('Today', todayConvs)}
            {renderGroup('Yesterday', yesterdayConvs)}
            {renderGroup('Previous 7 Days', weekConvs)}
            {renderGroup('Older', olderConvs)}
          </div>
        )}
      </div>

      {/* Delete Individual Conversation Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-5 shadow-premium border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Delete this conversation?
              </h4>
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="text-slate-400 hover:text-slate-650 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              This will permanently delete this conversation from your session cache. You cannot undo this action.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 dark:border-slate-800 dark:text-slate-350 dark:bg-slate-950 dark:hover:bg-slate-900"
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

      {/* Clear All History Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-5 shadow-premium border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Clear chat history?
              </h4>
              <button 
                onClick={() => setShowClearConfirm(false)}
                className="text-slate-400 hover:text-slate-650 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
              All saved conversation history will be removed from this device.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 dark:border-slate-800 dark:text-slate-350 dark:bg-slate-950 dark:hover:bg-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={confirmClearAll}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-red-650 hover:bg-red-500 transition-colors"
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default HistoryPanel;
