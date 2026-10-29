import React from 'react';
import { BookOpen, MessageSquare } from 'lucide-react';

interface DailyLawCardProps {
  onReadMore: () => void;
  onAskLex: (prompt: string) => void;
}

export const DailyLawCard: React.FC<DailyLawCardProps> = ({ onReadMore, onAskLex }) => {
  return (
    <div className="text-center transition-colors duration-200">
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#C084FC]">
          Today's Law
        </span>
        <span className="text-[#AAA3BB] text-xs">•</span>
        <span className="rounded-full bg-[#A855F7]/15 px-2.5 py-0.5 text-[9px] font-medium text-[#C084FC] border border-[#A855F7]/30">
          Daily Bite
        </span>
      </div>

      <h3 className="text-base font-bold text-white">
        Can police search your phone without permission?
      </h3>
      <p className="mt-2 text-xs leading-relaxed text-[#AAA3BB] max-w-sm mx-auto">
        Learn when police may lawfully search or seize a device and what questions you can ask about the process.
      </p>

      <div className="mt-4 flex items-center justify-center gap-2.5">
        <button
          onClick={onReadMore}
          className="flex items-center gap-1.5 rounded-xl border border-[#30243F] bg-[#1C1728] px-3.5 py-1.5 text-xs font-semibold text-[#F8F7FC] hover:border-[#A855F7]/40 hover:bg-[#251C38] transition-all cursor-pointer"
        >
          <BookOpen className="h-3.5 w-3.5 text-[#C084FC]" />
          <span>Read More</span>
        </button>
        <button
          onClick={() => onAskLex('Can police search my phone without permission in India? What are my rights?')}
          className="flex items-center gap-1.5 rounded-xl border border-[#30243F] bg-[#1C1728] px-3.5 py-1.5 text-xs font-semibold text-[#F8F7FC] hover:border-[#A855F7]/40 hover:bg-[#251C38] transition-all cursor-pointer"
        >
          <MessageSquare className="h-3.5 w-3.5 text-[#C084FC]" />
          <span>Ask LexAI</span>
        </button>
      </div>
    </div>
  );
};
export default DailyLawCard;
