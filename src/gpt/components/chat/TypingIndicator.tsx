import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex w-full gap-3 py-4 border-b border-slate-100 dark:border-slate-800/40 px-4 bg-slate-50/20 dark:bg-brand-navy-950/10">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-navy-950 text-white dark:bg-brand-navy-900 border border-slate-850 text-xs font-bold animate-pulse">
        AI
      </div>
      <div className="flex-1 space-y-2 mt-1">
        <div className="text-[10px] font-semibold text-slate-400">
          LexAI is generating guidance...
        </div>
        <div className="flex items-center gap-1.5 py-1">
          <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400 dark:bg-slate-600 [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400 dark:bg-slate-600 [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400 dark:bg-slate-600"></div>
        </div>
      </div>
    </div>
  );
};
export default TypingIndicator;
