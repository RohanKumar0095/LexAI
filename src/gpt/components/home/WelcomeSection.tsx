import React from 'react';

export const WelcomeSection: React.FC = () => {
  return (
    <div className="text-center max-w-2xl mx-auto mb-8 px-4">
      <div className="flex justify-center mb-4">
        <img 
          src="/assets/logo.jpg" 
          alt="LexAI Logo" 
          className="h-16 w-16 rounded-2xl shadow-lg object-cover border border-slate-200 dark:border-slate-800" 
        />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
        LexAI India
      </h1>
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-gold-550 dark:text-brand-gold-300 mt-1.5">
        Your Personal AI Legal Assistant
      </p>
      
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-8 mb-2">
        How can I help you today?
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Ask about your rights, a legal problem, a document, or what you should do next.
      </p>
    </div>
  );
};
export default WelcomeSection;
