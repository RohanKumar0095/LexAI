import React from 'react';
import { Sparkles } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex w-full gap-3.5 py-4 border-b border-[#30243F]/40 px-4 bg-[#100D18]/40 rounded-2xl animate-in fade-in duration-200">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#A855F7] text-white border border-[#C084FC]/30 text-xs font-bold shadow-md shadow-purple-500/20">
        <Sparkles className="h-4 w-4" />
      </div>
      <div className="flex-1 space-y-1.5 mt-0.5">
        <div className="text-[11px] font-semibold text-[#C084FC]">
          LexAI is researching statutes & drafting guidance...
        </div>
        <div className="flex items-center gap-1.5 py-1">
          <div className="h-2 w-2 animate-bounce rounded-full bg-[#A855F7] [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-[#C084FC] [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-[#D8B4FE]"></div>
        </div>
      </div>
    </div>
  );
};
export default TypingIndicator;
