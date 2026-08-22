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
        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold-550 dark:text-brand-gold-300">
          Today's Law
        </span>
        <span className="text-slate-350 dark:text-slate-650 text-xs">•</span>
        <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[9px] font-medium text-indigo-650 dark:text-indigo-400">
          Daily Bite
        </span>
      </div>

      <h3 className="text-base font-bold text-slate-850 dark:text-slate-100">
        Can police search your phone without permission?
      </h3>
      <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
        Learn when police may lawfully search or seize a device and what questions you can ask about the process.
      </p>

      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          onClick={onReadMore}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-brand-navy-900 dark:text-slate-200 dark:hover:bg-brand-navy-850 transition-colors"
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>Read More</span>
        </button>
        <button
          onClick={() => onAskLex('Can police search my phone without permission in India? What are my rights?')}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-brand-navy-900 dark:text-slate-200 dark:hover:bg-brand-navy-850 transition-colors"
        >
          <MessageSquare className="h-3.5 w-3.5 text-slate-450" />
          <span>Ask LexAI</span>
        </button>
      </div>
    </div>
  );
};
export default DailyLawCard;
