import React, { useState } from 'react';
import { Bookmark, BookmarkMinus, MessageSquare, AlertCircle, FileText, Trash2 } from 'lucide-react';
import type { LawCategory, MockArticle } from '../../types/legal';
import type { Conversation } from '../../types/chat';

interface SavedLawsPanelProps {
  savedArticleIds: string[];
  categories: LawCategory[];
  onToggleBookmarkArticle: (id: string) => void;
  onAskLex: (prompt: string) => void;
  bookmarkedMsgIds: string[];
  onBookmarkMessage: (msgId: string) => void;
  conversations: Conversation[];
  onSelectPanel: (panelId: string | null) => void;
}

interface SavedDraft {
  id: string;
  type: string;
  filename: string;
  description: string;
  date: string;
}

export const SavedLawsPanel: React.FC<SavedLawsPanelProps> = ({
  savedArticleIds,
  categories,
  onToggleBookmarkArticle,
  onAskLex,
  bookmarkedMsgIds,
  onBookmarkMessage,
  conversations,
  onSelectPanel
}) => {
  const [activeTab, setActiveTab] = useState<'articles' | 'chats' | 'drafts'>('articles');
  
  // Local state for mock drafts to allow live unsaving
  const [savedDrafts, setSavedDrafts] = useState<SavedDraft[]>([
    {
      id: 'draft-1',
      type: 'CONSUMER COMPLAINT',
      filename: 'Consumer_Complaint_Acme_Pvt_Ltd.txt',
      description: 'Complaint under Section 35 of the Consumer Protection Act, 2019 regarding deficiency of service for online orders...',
      date: 'Saved Today'
    }
  ]);

  // Find the actual article items matching the saved IDs
  const allArticles = categories.flatMap(cat => cat.articles);
  const savedArticles = allArticles.filter(art => savedArticleIds.includes(art.id));

  // Find actual messages that are bookmarked across all conversations
  const savedChats = conversations
    .flatMap(c => c.messages.map(m => ({ ...m, conversationTitle: c.title })))
    .filter(m => bookmarkedMsgIds.includes(m.id));

  const handleAskAboutArticle = (art: MockArticle) => {
    onAskLex(`Regarding my saved article on "${art.title}" (${art.section}): can you summarize the primary compliance rules and how I can utilize them?`);
  };

  const handleUnsaveDraft = (id: string) => {
    setSavedDrafts(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <div>
        <span className="text-[10px] font-bold text-muted-foreground uppercase">
          My Saved Items
        </span>
        <h3 className="text-sm font-bold text-foreground mt-1">
          Saved Space
        </h3>
        <p className="text-[11px] text-secondary-foreground mt-0.5">
          Review bookmarks, pinned assistant messages, and generated documents.
        </p>
      </div>

      {/* Tabs Row */}
      <div className="flex border border-border p-0.5 bg-hover rounded-xl shrink-0">
        {(['articles', 'chats', 'drafts'] as const).map((tab) => {
          let count = 0;
          let label = '';
          if (tab === 'articles') {
            count = savedArticles.length;
            label = `Articles (${count})`;
          } else if (tab === 'chats') {
            count = savedChats.length;
            label = `Chats (${count})`;
          } else {
            count = savedDrafts.length;
            label = `Drafts (${count})`;
          }

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-center py-2 text-[10px] font-bold uppercase rounded-lg transition-all focus:outline-none focus:ring-1 focus:ring-brand-gold-550 ${
                activeTab === tab
                  ? 'bg-surface text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto pr-1">
        {activeTab === 'articles' && (
          <div className="space-y-3">
            {savedArticles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4 space-y-2">
                <Bookmark className="h-8 w-8 text-muted-foreground opacity-50" />
                <h5 className="text-xs font-bold text-foreground">
                  No saved articles yet.
                </h5>
                <p className="text-[10px] text-muted-foreground mt-1 max-w-xs">
                  Bookmark key statutes from the Law Categories directory to access them here instantly.
                </p>
              </div>
            ) : (
              savedArticles.map((art) => (
                <div 
                  key={art.id}
                  className="rounded-2xl border border-border bg-surface p-4 shadow-sm space-y-2 relative"
                >
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="rounded bg-brand-gold-550/10 px-2 py-0.5 text-[9px] font-bold text-brand-gold-550 dark:text-brand-gold-300">
                      {art.section}
                    </span>
                    <button
                      onClick={() => onToggleBookmarkArticle(art.id)}
                      className="text-muted-foreground hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-hover focus:outline-none focus:ring-1 focus:ring-red-500"
                      title="Remove from Saved Space"
                      aria-label="Remove from Saved Space"
                    >
                      <BookmarkMinus className="h-4 w-4" />
                    </button>
                  </div>

                  <h4 className="text-xs font-bold text-foreground">
                    {art.title}
                  </h4>

                  <p className="text-[10.5px] leading-relaxed text-secondary-foreground">
                    {art.description}
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={() => handleAskAboutArticle(art)}
                      className="flex items-center gap-1.5 rounded-lg bg-selected border border-border px-2.5 py-1.5 text-[10px] font-bold text-foreground hover:opacity-90 transition-colors focus:outline-none focus:ring-1 focus:ring-brand-gold-550"
                    >
                      <MessageSquare className="h-3 w-3 text-brand-gold-550 dark:text-brand-gold-300" />
                      <span>Explain in Chat</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'chats' && (
          <div className="space-y-3">
            {savedChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4 space-y-2">
                <Bookmark className="h-8 w-8 text-muted-foreground opacity-50" />
                <h5 className="text-xs font-bold text-foreground">
                  No saved chats yet.
                </h5>
                <p className="text-[10px] text-muted-foreground mt-1 max-w-xs">
                  Click the bookmark/save icon below any AI message in your chat to save critical answers here.
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-xl border border-indigo-500/15 bg-indigo-500/5 p-4 flex gap-3.5 items-start">
                  <AlertCircle className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                      Pinned responses inside chat
                    </h5>
                    <p className="text-[10.5px] leading-relaxed text-secondary-foreground mt-1">
                      These bookmarked AI responses are highlighted in your chat history threads.
                    </p>
                  </div>
                </div>

                {savedChats.map((msg) => (
                  <div 
                    key={msg.id}
                    className="rounded-2xl border border-border bg-surface p-4 shadow-sm space-y-2 relative"
                  >
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase truncate tracking-wide">
                        Session: {msg.conversationTitle}
                      </span>
                      <button
                        onClick={() => onBookmarkMessage(msg.id)}
                        className="text-muted-foreground hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-hover focus:outline-none focus:ring-1 focus:ring-red-500"
                        title="Remove from Saved Space"
                        aria-label="Remove from Saved Space"
                      >
                        <BookmarkMinus className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="text-xs leading-relaxed text-foreground whitespace-pre-line line-clamp-4">
                      {msg.content}
                    </p>

                    <div className="pt-2 flex justify-between items-center text-[10px] text-muted-foreground">
                      <span>Saved: {msg.timestamp}</span>
                      <button
                        onClick={() => onAskLex(`Regarding the saved advice from "${msg.conversationTitle}": can you clarify this point?`)}
                        className="flex items-center gap-1.5 rounded-lg bg-selected border border-border px-2.5 py-1 text-[10px] font-bold text-foreground hover:opacity-90 transition-colors focus:outline-none focus:ring-1 focus:ring-brand-gold-550"
                      >
                        <MessageSquare className="h-3 w-3 text-brand-gold-550 dark:text-brand-gold-300" />
                        <span>Clarify in Chat</span>
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {activeTab === 'drafts' && (
          <div className="space-y-3">
            {savedDrafts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4 space-y-2">
                <FileText className="h-8 w-8 text-muted-foreground opacity-50" />
                <h5 className="text-xs font-bold text-foreground">
                  No saved drafts yet.
                </h5>
                <p className="text-[10px] text-muted-foreground mt-1 max-w-xs">
                  Generate draft notices or documents and save them to retrieve them here.
                </p>
              </div>
            ) : (
              savedDrafts.map((draft) => (
                <div 
                  key={draft.id}
                  className="rounded-2xl border border-border bg-surface p-4 shadow-sm space-y-2 relative"
                >
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="rounded bg-brand-gold-550/10 px-2 py-0.5 text-[9px] font-bold text-brand-gold-550 dark:text-brand-gold-300">
                      {draft.type}
                    </span>
                    <button
                      onClick={() => handleUnsaveDraft(draft.id)}
                      className="text-muted-foreground hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-hover focus:outline-none focus:ring-1 focus:ring-red-500"
                      title="Remove from Saved Space"
                      aria-label="Remove from Saved Space"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-brand-gold-550" />
                    <span>{draft.filename}</span>
                  </h4>
                  
                  <p className="text-[10px] text-secondary-foreground line-clamp-2">
                    {draft.description}
                  </p>
                  
                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => onSelectPanel('complaint-generator')}
                      className="flex items-center gap-1.5 rounded-lg border border-border bg-surface hover:bg-hover px-2.5 py-1.5 text-[10px] font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-brand-gold-550"
                    >
                      <span>Open Generator Workspace</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default SavedLawsPanel;
