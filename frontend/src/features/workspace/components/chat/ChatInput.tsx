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

  const currentMode = explanationOptions.find(o => o.value === explainMode) || explanationOptions[0];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-3 bg-transparent transition-colors duration-200">
      {/* Main Elevated Input Box with Travelling White Light Border */}
      <div className="travelling-light-border w-full">
        <form onSubmit={handleSubmit} className="relative z-10 rounded-2xl bg-[#15111F] transition-all focus-within:ring-1 focus-within:ring-[#A855F7]/40 shadow-xl shadow-purple-950/20 overflow-hidden">
          {/* Text Area */}
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your legal situation or ask a question..."
            rows={1}
            disabled={disabled}
            className="w-full resize-none bg-transparent pl-4 pr-12 pt-3.5 pb-12 text-sm text-[#F8F7FC] focus:outline-none placeholder:text-[#AAA3BB]/60 min-h-[48px]"
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
                className="rounded-xl p-1.5 text-[#AAA3BB] hover:text-[#C084FC] hover:bg-white/5 transition-colors cursor-pointer"
                title="Official Indian Law Resource (India Code)"
                aria-label="Open Official Indian Law Resource"
              >
                <BookOpen className="h-4 w-4" />
              </button>
              
              {/* Mic icon */}
              <button
                type="button"
                className="rounded-xl p-1.5 text-[#AAA3BB] hover:text-[#C084FC] hover:bg-white/5 transition-colors cursor-help"
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
                  className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-lg border border-[#30243F] bg-[#100D18] text-[#D4CFE2] shadow-sm hover:border-[#A855F7]/40 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-[#A855F7] cursor-pointer"
                  aria-label="Select explanation mode"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="listbox"
                >
                  <span>Explain: {currentMode.label}</span>
                  <ChevronDown className="h-3 w-3 opacity-70 text-[#C084FC]" />
                </button>

                {dropdownOpen && (
                  <div 
                    className="absolute left-0 bottom-full mb-2 w-40 rounded-xl border border-[#30243F] bg-[#15111F] p-1.5 shadow-2xl shadow-purple-950/40 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150 backdrop-blur-xl"
                    role="listbox"
                    aria-label="Explanation mode options"
                  >
                    <div className="px-2.5 py-1 text-[10px] font-bold text-[#AAA3BB] uppercase tracking-wider">
                      Explanation Style
                    </div>
                    <div className="h-[1px] bg-[#30243F] my-1 mx-1" />
                    {explanationOptions.map((opt) => {
                      const isSelected = explainMode === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleSelectMode(opt.value)}
                          className={`flex w-full items-center justify-between px-2.5 py-1.5 text-left text-xs rounded-lg transition-colors cursor-pointer ${
                            isSelected 
                              ? 'bg-[#A855F7]/20 text-[#C084FC] font-semibold border border-[#A855F7]/30' 
                              : 'text-[#D4CFE2] hover:bg-[#1C1728] hover:text-white'
                          }`}
                          role="option"
                          aria-selected={isSelected}
                        >
                          <span>{opt.label}</span>
                          {isSelected && <Check className="h-3 w-3 text-[#C084FC]" />}
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
              className={`rounded-xl p-2.5 transition-all pointer-events-auto shrink-0 flex items-center justify-center ${
                inputText.trim() && !disabled
                  ? 'bg-[#A855F7] text-white hover:bg-[#9333EA] shadow-md shadow-purple-500/25 cursor-pointer hover:scale-105 active:scale-95'
                  : 'bg-[#1C1728] text-[#AAA3BB]/40 border border-[#30243F] cursor-not-allowed'
              }`}
              title="Send Legal Query"
              aria-label="Send Query"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
      
      {/* Disclaimer */}
      <div className="text-[10px] text-center text-[#AAA3BB]/70 mt-2 select-none">
        LexAI India provides legal information and awareness, not professional legal representation or legal advice. Laws and procedures may vary by location and situation.
      </div>
    </div>
  );
};
export default ChatInput;
