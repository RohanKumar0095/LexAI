import React from 'react';
import { Award, BookOpen, MessageSquare } from 'lucide-react';

interface DayOneCardProps {
  onStartLearning: () => void;
  onAskLex: (prompt: string) => void;
}

export const DayOneCard: React.FC<DayOneCardProps> = ({ onStartLearning, onAskLex }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-premium transition-colors duration-200 dark:border-slate-800 dark:bg-brand-navy-900/50 hover:shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-gold-550 dark:text-brand-gold-300">
          <Award className="h-4 w-4" />
          <span>Day 1 — Know Your Rights</span>
        </div>
        <span className="rounded-full bg-brand-gold-500/10 px-2.5 py-0.5 text-[10px] font-medium text-brand-gold-550 dark:text-brand-gold-300">
          Day 1 of your Legal Awareness Journey
        </span>
      </div>

      <h3 className="text-base font-bold text-slate-850 dark:text-slate-100">
        Start with the basics
      </h3>
      <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        Understanding your basic legal rights can help you make better decisions when facing everyday legal situations.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={onStartLearning}
          className="flex items-center gap-1.5 rounded-lg bg-brand-navy-950 px-3.5 py-1.8 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-brand-gold-550 dark:text-slate-950 dark:hover:bg-brand-gold-400 transition-colors"
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>Start Learning</span>
        </button>
        <button
          onClick={() => onAskLex('What are my basic constitutional rights as an Indian citizen?')}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.8 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-brand-navy-900 dark:text-slate-200 dark:hover:bg-brand-navy-850 transition-colors"
        >
          <MessageSquare className="h-3.5 w-3.5 text-slate-450" />
          <span>Ask LexAI</span>
        </button>
      </div>
    </div>
  );
};
export default DayOneCard;
