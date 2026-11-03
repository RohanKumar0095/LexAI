import React, { useEffect, useRef } from 'react';
import { DailyLawCard } from '../home/DailyLawCard';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { ChatGeometricBackground } from './ChatGeometricBackground';
import { ChatScalesBackground } from './ChatScalesBackground';
import type { Message } from '../../types/chat';
import { X, Sparkles, Scale } from 'lucide-react';
import { LEXAI_LOGO_URL } from '../../../../constants/brand';
import { speechService } from '../../services/speechService';

interface ChatScreenProps {
  messages: Message[];
  isTyping: boolean;
  explainMode: 'simple' | 'detailed';
  onChangeExplainMode: (mode: 'simple' | 'detailed') => void;
  onSendMessage: (text: string) => void;
  onSelectQuickPrompt: (text: string) => void;
  onStartLearning: () => void;
  // Panel split-screen support
  activePanelId: string | null;
  activePanelNode: React.ReactNode | null;
  onClosePanel: () => void;
  bookmarkedMsgIds: string[];
  onBookmarkMessage: (msgId: string) => void;
  onInspectTrace?: (traceId: string) => void;
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
  onBookmarkMessage,
  onInspectTrace
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Stop active speech playback when navigating away or unmounting
  useEffect(() => {
    return () => {
      speechService.stop();
    };
  }, []);

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#08070D] text-[#F8F7FC] transition-colors duration-200 relative">
      
      {/* LEFT PORTION: The Chat Area (Splits or stays full width) */}
      <div className={`flex flex-col h-full transition-all duration-300 relative ${
        activePanelNode ? 'w-full md:w-[45%] border-r border-[#30243F]' : 'w-full'
      }`}>
        
        {/* Subtle Geometric Background Motif & Glowing Scales of Justice */}
        <ChatGeometricBackground />
        <ChatScalesBackground />

        {/* Messages Scroll Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-2 py-4 space-y-2 sm:px-6 select-text flex flex-col relative z-10"
        >
          {!hasMessages ? (
            <div className="flex-1 flex flex-col items-center justify-center py-6 md:py-10 animate-in fade-in duration-300">
              <div className="w-full max-w-2xl px-4 flex flex-col items-center text-center">
                {/* Official LexAI India Brand Logo */}
                <div className="mb-5 flex items-center justify-center">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-[#A855F7]/30 shadow-xl shadow-purple-950/40">
                    <img 
                      src={LEXAI_LOGO_URL} 
                      alt="LexAI-India Logo" 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#7C3AED] via-[#A855F7] to-[#C084FC] flex items-center justify-center">
                      <Scale className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Daily Legal Question directly on background (Cardless, minimal presentation) */}
                <div className="w-full mb-8">
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
                  onInspectTrace={onInspectTrace}
                />
              ))}
              {isTyping && <TypingIndicator />}
            </div>
          )}
        </div>

        {/* Floating suggestion if split workspace is active */}
        {activePanelNode && (
          <div className="hidden md:flex px-6 py-2 bg-[#15111F] text-xs text-[#C084FC] font-semibold items-center gap-1.5 border-t border-[#30243F] relative z-10">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#A855F7] animate-pulse" />
            <span>Ask follow-ups here based on the {activePanelId?.replace('-', ' ')} panel output.</span>
          </div>
        )}

        {/* Input Bar Section */}
        {hasMessages && (
          <div className="bg-[#08070D]/90 backdrop-blur-md shrink-0 relative z-10">
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
        <div className="fixed inset-0 z-40 flex flex-col bg-[#100D18] md:static md:w-[55%] md:flex md:animate-in md:slide-in-from-right-12 md:duration-300 border-l border-[#30243F]">
          {/* Workspace Panel Header */}
          <div className="flex h-14 items-center justify-between border-b border-[#30243F] bg-[#15111F] px-4 shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#A855F7] animate-pulse"></span>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                {activePanelId?.replace('-', ' ')} Workspace
              </h3>
            </div>
            
            <button
              onClick={onClosePanel}
              className="rounded-lg p-1.5 text-[#AAA3BB] hover:bg-[#1C1728] hover:text-white transition-colors cursor-pointer"
              title="Close Workspace"
              aria-label="Close Workspace"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Workspace Content Panel container */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#08070D]/50">
            {activePanelNode}
          </div>
        </div>
      )}
    </div>
  );
};
export default ChatScreen;
