import React, { useState, useRef, useEffect } from 'react';
import { Send, BookOpen, Mic, ChevronDown, Check, X, Square, Loader2, AlertCircle } from 'lucide-react';
import { useVoiceInput } from '../../hooks/useVoiceInput';

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

  const {
    isRecording,
    isTranscribing,
    recordingDuration,
    audioLevels,
    errorMessage,
    startRecording,
    stopRecording,
    cancelRecording,
    clearError,
  } = useVoiceInput({
    onTranscriptionSuccess: (transcription) => {
      if (!transcription || !transcription.trim()) return;
      const cleanText = transcription.trim();
      setInputText((prev) => (prev.trim() ? `${prev.trim()} ${cleanText}` : cleanText));
      // Focus textarea so the user can immediately review, edit, or confirm
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const len = textareaRef.current.value.length;
          textareaRef.current.setSelectionRange(len, len);
        }
      }, 50);
    },
  });

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
      {/* Voice Error Notification Banner */}
      {errorMessage && (
        <div className="mb-2 flex items-center justify-between px-3.5 py-2 rounded-xl border border-red-500/30 bg-[#1F1118]/90 text-red-200 text-xs backdrop-blur-md shadow-lg shadow-red-950/20 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={clearError}
            className="p-1 text-red-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Dismiss error"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Main Elevated Input Box with Travelling White Light Border */}
      <div className="travelling-light-border w-full">
        <form onSubmit={handleSubmit} className="relative z-10 rounded-2xl bg-[#15111F] transition-all focus-within:ring-1 focus-within:ring-[#A855F7]/40 shadow-xl shadow-purple-950/20 overflow-hidden">
          {isRecording || isTranscribing ? (
            /* Voice Recording Interface (ChatGPT-Style) */
            <div className="flex items-center justify-between px-4 py-3 min-h-[58px] gap-3">
              {/* Cancel Button */}
              <button
                type="button"
                onClick={cancelRecording}
                disabled={isTranscribing}
                className={`rounded-xl p-2 transition-all flex items-center justify-center shrink-0 ${
                  isTranscribing
                    ? 'text-[#AAA3BB]/30 cursor-not-allowed'
                    : 'text-[#AAA3BB] hover:text-white hover:bg-white/10 cursor-pointer active:scale-95'
                }`}
                title="Cancel voice recording"
                aria-label="Cancel recording"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Dynamic Waveform & Timer / Transcribing Spinner */}
              <div className="flex-1 flex items-center justify-center gap-3 overflow-hidden">
                {isTranscribing ? (
                  <div className="flex items-center gap-2.5 text-xs text-[#D4CFE2]">
                    <Loader2 className="h-4 w-4 animate-spin text-[#C084FC]" />
                    <span className="font-medium tracking-wide">Transcribing speech...</span>
                  </div>
                ) : (
                  <>
                    {/* Live indicator & duration */}
                    <div className="flex items-center gap-1.5 shrink-0 text-xs font-mono text-[#AAA3BB] select-none">
                      <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                      <span>
                        {Math.floor(recordingDuration / 60)}:
                        {recordingDuration % 60 < 10 ? '0' : ''}
                        {recordingDuration % 60}
                      </span>
                    </div>

                    {/* Responsive Audio Waveform Equalizer */}
                    <div
                      className="flex items-center justify-center gap-[3px] h-9 px-2 overflow-hidden flex-1 max-w-sm"
                      aria-label="Microphone audio levels"
                    >
                      {audioLevels.map((level, idx) => (
                        <span
                          key={idx}
                          className="w-[3px] rounded-full transition-all duration-75 bg-gradient-to-t from-[#A855F7] via-[#C084FC] to-white"
                          style={{
                            height: `${Math.max(4, Math.round(level * 30))}px`,
                            opacity: Math.max(0.4, level),
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Stop & Transcribe Button */}
              <button
                type="button"
                onClick={stopRecording}
                disabled={isTranscribing}
                className={`rounded-xl p-2.5 transition-all flex items-center justify-center shrink-0 ${
                  isTranscribing
                    ? 'bg-[#1C1728] text-[#AAA3BB]/30 border border-[#30243F] cursor-not-allowed'
                    : 'bg-[#A855F7] text-white hover:bg-[#9333EA] shadow-md shadow-purple-500/25 cursor-pointer hover:scale-105 active:scale-95'
                }`}
                title="Stop recording and transcribe"
                aria-label="Stop and transcribe"
              >
                <Square className="h-3.5 w-3.5 fill-current" />
              </button>
            </div>
          ) : (
            <>
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
                    disabled={disabled}
                    className={`rounded-xl p-1.5 transition-colors ${
                      disabled
                        ? 'text-[#AAA3BB]/30 cursor-not-allowed'
                        : 'text-[#AAA3BB] hover:text-[#C084FC] hover:bg-white/5 cursor-pointer'
                    }`}
                    title="Voice Input (Speech to Text)"
                    onClick={startRecording}
                    aria-label="Start Voice Recording"
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
            </>
          )}
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
