import React, { useState } from 'react';
import { Send, Mic, Paperclip, Scale, ShieldCheck } from 'lucide-react';
import { Button } from './Button';

export interface CommandCenterInputProps {
  placeholder?: string;
  onSend?: (text: string) => void;
  className?: string;
}

export const CommandCenterInput: React.FC<CommandCenterInputProps> = ({
  placeholder = "Ask LexAI about Indian legal rights, laws, IPC/BNS sections...",
  onSend,
  className = '',
}) => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSend?.(value);
    setValue('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative w-full rounded-2xl transition-all duration-300 ${
        isFocused 
          ? 'shadow-2xl shadow-saffron-glow border-saffron bg-midnight-card' 
          : 'shadow-lg shadow-black/40 border-midnight-border bg-midnight-base/90 hover:border-midnight-border/80'
      } border backdrop-blur-xl p-2.5 sm:p-3.5 flex flex-col gap-3 ${className}`}
    >
      {/* Top subtle mode indicator bar */}
      <div className="flex items-center justify-between px-1.5 text-xs text-text-muted border-b border-midnight-border pb-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-saffron font-medium">
            <Scale className="w-3.5 h-3.5" />
            <span>LexAI Legal Intelligence</span>
          </span>
          <span className="text-text-muted/60">•</span>
          <span className="text-text-secondary text-xs hidden sm:inline">India Jurisdiction Mode</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-emerald bg-emerald/5 px-2 py-0.5 rounded-full border border-emerald/20">
          <ShieldCheck className="w-3 h-3" />
          <span>Verified Statutes</span>
        </div>
      </div>

      {/* Main input area */}
      <div className="flex items-end gap-2">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          rows={2}
          className="w-full bg-transparent text-sm sm:text-base text-text-primary placeholder-text-muted focus:outline-none resize-none px-1 py-1"
        />

        {/* Action icons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            className="p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
            title="Attach Document or Contract"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            className="p-2 rounded-lg text-text-secondary hover:text-saffron hover:bg-saffron/10 transition-colors"
            title="Voice Assistant Mode"
          >
            <Mic className="w-4 h-4" />
          </button>

          <Button
            type="submit"
            variant="ai"
            size="md"
            className="rounded-xl px-4"
            disabled={!value.trim()}
            rightIcon={<Send className="w-4 h-4" />}
          >
            <span className="hidden sm:inline">Ask AI</span>
          </Button>
        </div>
      </div>

      {/* Subtle bottom suggestions */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-text-secondary">
        <span className="text-text-muted">Try asking:</span>
        <button
          type="button"
          onClick={() => setValue("What are my rights during a police traffic stop in Delhi?")}
          className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-electric/15 hover:text-electric-400 text-text-secondary transition-colors border border-white/5"
        >
          Rights during traffic stop
        </button>
        <button
          type="button"
          onClick={() => setValue("Draft an official consumer complaint for an e-commerce refund delay.")}
          className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-electric/15 hover:text-electric-400 text-text-secondary transition-colors border border-white/5"
        >
          Draft Consumer Complaint
        </button>
      </div>
    </form>
  );
};
