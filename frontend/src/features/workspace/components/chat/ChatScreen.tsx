import React, { useEffect, useRef } from 'react';
import { DailyLawCard } from '../home/DailyLawCard';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import type { Message } from '../../types/chat';
import { X, Sparkles } from 'lucide-react';

interface ChatScreenProps {
  messages: Message[];
  isTyping: boolean;
  explainMode: 'simple' | 'detailed' | 'case-analysis' | 'technical';
  onChangeExplainMode: (mode: 'simple' | 'detailed' | 'case-analysis' | 'technical') => void;
  onSendMessage: (text: string) => void;
  onSelectQuickPrompt: (text: string) => void;
  onStartLearning: () => void;
  // Panel split-screen support
  activePanelId: string | null;
  activePanelNode: React.ReactNode | null;
  onClosePanel: () => void;
  bookmarkedMsgIds: string[];
  onBookmarkMessage: (msgId: string) => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  messages,
  isTyping,
  explainMode,
  onChangeExplainMode,
  onSendMessage,
  onSelectQuickPrompt,
  onStartLearning,
  activePanelId,
  activePanelNode,
  onClosePanel,
  bookmarkedMsgIds,
  onBookmarkMessage
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-full w-full overflow-hidden bg-background text-foreground transition-colors duration-200">
      
      {/* LEFT PORTION: The Chat Area (Splits or stays full width) */}
      <div className={`flex flex-col h-full transition-all duration-300 relative ${
        activePanelNode ? 'w-full md:w-[45%] border-r border-border' : 'w-full'
      }`}>
        
        {/* Messages Scroll Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-2 py-4 space-y-2 sm:px-6 select-text flex flex-col bg-background"
        >
          {!hasMessages ? (
            <div className="flex-1 flex flex-col items-center justify-center py-6 md:py-10 animate-in fade-in duration-300">
              <div className="w-full max-w-xl px-4 flex flex-col items-center text-center">
                {/* Brand Logo & Title */}
                <div className="flex flex-col items-center mb-6">
                  <img 
                    src="/assets/logo.jpg" 
                    alt="LexAI Logo" 
                    className="h-16 w-16 rounded-xl object-cover mb-4" 
                  />
                  <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                    LexAI India
                  </h1>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-1.5">
                    Your Personal AI Legal Assistant
                  </p>
                </div>

                {/* Today's Law content (cardless) */}
                <div className="w-full mb-6">
                  <DailyLawCard 
                    onReadMore={onStartLearning}
                    onAskLex={onSelectQuickPrompt}
                  />
                </div>

                {/* Centered Composer */}
                <div className="w-full">
                  <ChatInput
                    onSendMessage={onSendMessage}
                    explainMode={explainMode}
                    onChangeExplainMode={onChangeExplainMode}
                    onSelectQuickPrompt={onSelectQuickPrompt}
                    disabled={isTyping}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto w-full pb-10">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  onOpenPanel={onSelectQuickPrompt}
                  onBookmarkMessage={onBookmarkMessage}
                  isBookmarked={bookmarkedMsgIds.includes(msg.id)}
                />
              ))}
              {isTyping && <TypingIndicator />}
            </div>
          )}
        </div>

        {/* Floating suggestion if split workspace is active */}
        {activePanelNode && (
          <div className="hidden md:flex px-6 py-2 bg-indigo-500/5 text-[10px] text-indigo-650 dark:text-indigo-400 font-semibold items-center gap-1 border-t border-border bg-surface">
            <Sparkles className="h-3 w-3 shrink-0 animate-pulse" />
            <span>Ask follow-ups here based on the {activePanelId?.replace('-', ' ')} panel output.</span>
          </div>
        )}

        {/* Input Bar Section */}
        {hasMessages && (
          <div className="border-t border-border bg-surface/70 backdrop-blur-md shrink-0">
            <ChatInput
              onSendMessage={onSendMessage}
              explainMode={explainMode}
              onChangeExplainMode={onChangeExplainMode}
              onSelectQuickPrompt={onSelectQuickPrompt}
              disabled={isTyping}
            />
          </div>
        )}
      </div>

      {/* RIGHT PORTION: The Tool Panel Workspace (Desktop: splits screen, Mobile: full-screen overlay) */}
      {activePanelNode && (
        <div className="fixed inset-0 z-40 flex flex-col bg-surface md:static md:w-[55%] md:flex md:animate-in md:slide-in-from-right-12 md:duration-300 border-l border-border">
          {/* Workspace Panel Header */}
          <div className="flex h-14 items-center justify-between border-b border-border bg-background/50 px-4 shrink-0">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-brand-gold-550"></span>
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">
                {activePanelId?.replace('-', ' ')} Workspace
              </h3>
            </div>
            
            <button
              onClick={onClosePanel}
              className="rounded-lg p-1.5 text-secondary-foreground hover:bg-hover hover:text-foreground transition-colors"
              title="Close Workspace"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Workspace Content Panel container */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-background/30">
            {activePanelNode}
          </div>
        </div>
      )}
    </div>
  );
};
export default ChatScreen;
