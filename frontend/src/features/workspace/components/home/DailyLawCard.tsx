import React from 'react';
import { BookOpen, MessageSquare } from 'lucide-react';

interface DailyLawCardProps {
  onReadMore: () => void;
  onAskLex: (prompt: string) => void;
}

export const DailyLawCard: React.FC<DailyLawCardProps> = ({ onReadMore, onAskLex }) => {
  return (
    <div className="text-center transition-colors duration-200">
      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white max-w-xl mx-auto">
        Can police search your phone without permission?
      </h3>
      <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-[#AAA3BB] max-w-md mx-auto">
        Learn when police may lawfully search or seize a device and what questions you can ask about the process.
      </p>

      <div className="mt-5 flex items-center justify-center gap-3">
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
