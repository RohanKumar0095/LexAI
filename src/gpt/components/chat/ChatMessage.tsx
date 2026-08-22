import React, { useState } from 'react';
import { 
  ThumbsUp, ThumbsDown, ChevronRight 
} from 'lucide-react';
import type { Message } from '../../types/chat';

interface ChatMessageProps {
  message: Message;
  onOpenPanel: (panelId: string) => void;
  onBookmarkMessage?: (msgId: string) => void;
  isBookmarked?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onBookmarkMessage,
  isBookmarked = false
}) => {
  const isAssistant = message.role === 'assistant';
  const [copied, setCopied] = useState(false);
  const [rated, setRated] = useState<'up' | 'down' | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Basic markdown-like parser for content formatting
  const renderFormattedContent = (text: string) => {
    return text.split('\n\n').map((paragraph, pIdx) => {
      // Check for headings
      if (paragraph.startsWith('### ')) {
        return (
          <h4 key={pIdx} className="text-sm font-bold text-foreground mt-4 mb-2 first:mt-0 flex items-center gap-1.5 border-b border-border/50 pb-1 font-sans">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-gold-550"></span>
            {paragraph.replace('### ', '')}
          </h4>
        );
      }
      
      // Check for bullet lists
      if (paragraph.startsWith('* ') || paragraph.startsWith('- ')) {
        return (
          <ul key={pIdx} className="list-disc pl-5 space-y-1 text-xs leading-relaxed text-secondary-foreground my-2 font-sans">
            {paragraph.split('\n').map((li, liIdx) => (
              <li key={liIdx}>{li.replace(/^[\*\-]\s+/, '')}</li>
            ))}
          </ul>
        );
      }

      // Check for numbered lists
      if (/^\d+\.\s/.test(paragraph)) {
        return (
          <ol key={pIdx} className="list-decimal pl-5 space-y-1 text-xs leading-relaxed text-secondary-foreground my-2 font-sans">
            {paragraph.split('\n').map((li, liIdx) => (
              <li key={liIdx}>{li.replace(/^\d+\.\s+/, '')}</li>
            ))}
          </ol>
        );
      }

      // Check for bold sections
      const parts = paragraph.split(/(\*\*.*?\*\*)/);
      if (parts.length > 1) {
        return (
          <p key={pIdx} className="text-xs leading-relaxed text-secondary-foreground font-sans">
            {parts.map((part, ptIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={ptIdx} className="font-bold text-foreground">{part.slice(2, -2)}</strong>;
              }
              return part;
            })}
          </p>
        );
      }

      return (
        <p key={pIdx} className="text-xs leading-relaxed text-secondary-foreground font-sans">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className={`flex w-full mb-6 animate-in fade-in duration-200 ${
      isAssistant ? 'justify-start' : 'justify-end'
    }`}>
      <div className={`flex flex-col space-y-1 max-w-[85%] md:max-w-2xl ${
        isAssistant ? 'items-start' : 'items-end'
      }`}>
        
        {/* Message bubble */}
        <div className={`rounded-2xl p-4 text-xs leading-relaxed shadow-sm border ${
          isAssistant 
            ? 'bg-surface border-border text-foreground rounded-tl-none' 
            : 'bg-selected border-border/50 text-foreground rounded-tr-none'
        }`}>
          {/* Message body */}
          <div className="space-y-3 font-sans">
            {isAssistant ? renderFormattedContent(message.content) : (
              <p className="text-xs leading-relaxed">{message.content}</p>
            )}
          </div>

          {/* Legal Citations Panel (Only for assistant messages, rendered cleanly inside bubble) */}
          {isAssistant && message.citations && message.citations.length > 0 && (
            <div className="space-y-2 mt-4 pt-3 border-t border-border/60">
              <h5 className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground font-sans">
                Legal Citations
              </h5>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {message.citations.map((citation) => (
                  <a
                    key={citation.id}
                    href={citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-lg border border-border bg-surface p-2.5 hover:bg-hover text-left transition-all"
                  >
                    <div className="flex items-center justify-between text-[10px] font-semibold text-brand-gold-550 dark:text-brand-gold-300">
                      <span>{citation.section}</span>
                      <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-xs font-bold text-foreground mt-0.5 line-clamp-1">
                      {citation.title}
                    </div>
                    <div className="text-[10px] text-secondary-foreground mt-1 line-clamp-2 leading-relaxed">
                      {citation.context}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Timestamp & message actions below the bubble */}
        <div className="flex items-center gap-2.5 text-[9px] text-muted-foreground px-1.5 mt-1 font-sans select-none">
          <span>{message.timestamp}</span>
          {isAssistant && (
            <>
              <span>•</span>
              <button
                onClick={handleCopy}
                className="hover:text-foreground transition-colors"
                title="Copy to Clipboard"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <span>•</span>
              <button
                onClick={() => onBookmarkMessage && onBookmarkMessage(message.id)}
                className={`transition-colors ${
                  isBookmarked 
                    ? 'text-brand-gold-550 dark:text-brand-gold-300 font-semibold' 
                    : 'hover:text-foreground'
                }`}
                title="Bookmark Information"
              >
                {isBookmarked ? 'Saved' : 'Save'}
              </button>
              
              {/* Thumbs Ratings */}
              <span>•</span>
              <button
                onClick={() => setRated('up')}
                className={`hover:text-foreground transition-colors ${rated === 'up' ? 'text-emerald-500' : ''}`}
                title="Helpful"
              >
                <ThumbsUp className="h-3 w-3" />
              </button>
              <button
                onClick={() => setRated('down')}
                className={`hover:text-foreground transition-colors ${rated === 'down' ? 'text-red-500' : ''}`}
                title="Not helpful"
              >
                <ThumbsDown className="h-3 w-3" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default ChatMessage;
