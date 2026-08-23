import React, { useState, useRef, useEffect } from 'react';
import { Send, BookOpen, Mic, ChevronDown, Check } from 'lucide-react';

export const OFFICIAL_LEGAL_RESOURCE_URL = 'https://www.indiacode.nic.in';

const explanationOptions = [
  { value: 'simple', label: 'Simple' },
  { value: 'detailed', label: 'Detailed' },
  { value: 'case-analysis', label: 'Case Analysis' },
  { value: 'technical', label: 'Technical' }
] as const;

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  explainMode: 'simple' | 'detailed' | 'case-analysis' | 'technical';
  onChangeExplainMode: (mode: 'simple' | 'detailed' | 'case-analysis' | 'technical') => void;
  onSelectQuickPrompt: (text: string) => void;
  disabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  explainMode,
  onChangeExplainMode,
  disabled
}) => {
  const [inputText, setInputText] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || disabled) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-grow textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [inputText]);

  const handleSelectMode = (value: 'simple' | 'detailed' | 'case-analysis' | 'technical') => {
    onChangeExplainMode(value);
    setDropdownOpen(false);
  };

  // Authoritative match or fallback to Normal
  const currentMode = explanationOptions.find(o => o.value === explainMode) || explanationOptions[0];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-3 bg-background transition-colors duration-200">
      {/* Main Input Box */}
      <form onSubmit={handleSubmit} className="relative rounded-2xl border border-border bg-input transition-all focus-within:ring-2 focus-within:ring-brand-gold-550/20 focus-within:border-brand-gold-550 shadow-sm">
        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your legal situation or ask a question..."
          rows={1}
          disabled={disabled}
          className="w-full resize-none bg-transparent pl-4 pr-12 pt-3.5 pb-12 text-sm text-foreground focus:outline-none placeholder:text-muted-foreground min-h-[46px]"
          aria-label="Legal query input"
        />

        {/* Input Bar Controls */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Left Controls: File attachment, microphone, and explain mode dropdown */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {/* Book/Legal Resource Icon */}
            <button
              type="button"
              onClick={() => window.open(OFFICIAL_LEGAL_RESOURCE_URL, '_blank', 'noopener,noreferrer')}
              className="rounded-lg p-1.5 text-secondary-foreground hover:text-foreground hover:bg-hover transition-colors"
              title="Official Indian Law Resource (India Code)"
              aria-label="Open Official Indian Law Resource"
            >
              <BookOpen className="h-4 w-4" />
            </button>
            
            {/* Mic icon */}
            <button
              type="button"
              className="rounded-lg p-1.5 text-secondary-foreground hover:text-foreground hover:bg-hover transition-colors cursor-help"
              title="Voice Input (Demo only)"
              onClick={() => alert("Voice assistant input is simulated in Phase 1. Keyboard input is operational!")}
              aria-label="Voice Input"
            >
              <Mic className="h-4 w-4" />
            </button>

            {/* Explain Mode Dropdown */}
            <div className="relative ml-2" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg border border-border bg-surface text-secondary-foreground shadow-sm hover:bg-hover transition-colors focus:outline-none focus:ring-1 focus:ring-brand-gold-550"
                aria-label="Select explanation mode"
                aria-expanded={dropdownOpen}
                aria-haspopup="listbox"
              >
                <span>Explain: {currentMode.label}</span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </button>

              {dropdownOpen && (
                <div 
                  className="absolute left-0 bottom-full mb-2 w-36 rounded-xl border border-border bg-surface p-1 shadow-lg z-50 animate-in fade-in slide-in-from-bottom-2 duration-150"
                  role="listbox"
                  aria-label="Explanation mode options"
                >
                  <div className="px-2.5 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Explain
                  </div>
                  <div className="h-[1px] bg-border my-0.5 mx-1" />
                  {explanationOptions.map((opt) => {
                    const isSelected = explainMode === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleSelectMode(opt.value)}
                        className={`flex w-full items-center justify-between px-2.5 py-1.5 text-left text-xs rounded-lg transition-colors ${
                          isSelected 
                            ? 'bg-selected text-foreground font-semibold' 
                            : 'text-secondary-foreground hover:bg-hover hover:text-foreground'
                        }`}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <Check className="h-3 w-3 text-brand-gold-550 dark:text-brand-gold-300" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Controls: Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || disabled}
            className={`rounded-xl p-2 transition-all pointer-events-auto shrink-0 flex items-center justify-center ${
              inputText.trim() && !disabled
                ? 'bg-selected text-foreground hover:opacity-90 cursor-pointer border border-border/50'
                : 'bg-hover text-muted-foreground cursor-not-allowed'
            }`}
            title="Send Legal Query"
            aria-label="Send Query"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
      
      {/* Disclaimer */}
      <div className="text-[10px] text-center text-muted-foreground mt-2 select-none">
        LexAI India provides legal information and awareness, not professional legal representation or legal advice. Laws and procedures may vary by location and situation.
      </div>
    </div>
  );
};
export default ChatInput;
