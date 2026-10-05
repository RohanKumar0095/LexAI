import React, { useState } from 'react';
import { BookOpen, HelpCircle, ArrowRight, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import type { DailyLaw, QuizQuestion } from '../../types/legal';

interface DailyLawPanelProps {
  dailyLaws: DailyLaw[];
  onAddXp: (amount: number) => void;
  onAskLex: (prompt: string) => void;
}

export const DailyLawPanel: React.FC<DailyLawPanelProps> = ({
  dailyLaws,
  onAskLex
}) => {
  const [selectedLaw, setSelectedLaw] = useState<DailyLaw>(dailyLaws[0]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({});

  const handleSelectAnswer = (qId: string, idx: number) => {
    if (submittedQuestions[qId]) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: idx }));
  };

  const handleSubmitQuestion = (qId: string, question: QuizQuestion) => {
    if (selectedAnswers[qId] === undefined || submittedQuestions[qId]) return;
    
    setSubmittedQuestions(prev => ({ ...prev, [qId]: true }));
    
    // If correct, reward XP (Disabled for now)
    if (selectedAnswers[qId] === question.correctAnswerIndex) {
      // onAddXp(question.xpReward);
    }
  };

  const handleSelectArchiveLaw = (law: DailyLaw) => {
    setSelectedLaw(law);
    // Reset quiz states for the newly selected law
    setSelectedAnswers({});
    setSubmittedQuestions({});
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      
      {/* Featured Law Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-premium dark:border-slate-800 dark:bg-slate-900/60 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold-550 dark:text-brand-gold-300">
            {selectedLaw.date} Topic
          </span>
          <span className="rounded-full bg-brand-gold-550/10 px-2 py-0.5 text-[9px] font-bold text-brand-gold-550 dark:text-brand-gold-300">
            Bite-sized Legal Learning
          </span>
        </div>
        
        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
          {selectedLaw.title}
        </h3>
        
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-350 mt-3 whitespace-pre-line">
          {selectedLaw.explanation}
        </p>

        {/* Example Callout */}
        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800/80 dark:bg-brand-navy-950/20">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
            <BookOpen className="h-4 w-4 text-brand-gold-550 shrink-0" />
            <span>Real-Life Scenario Example</span>
          </h4>
          <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 italic">
            "{selectedLaw.example}"
          </p>
        </div>

        {/* Action button inside card */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onAskLex(`Regarding "${selectedLaw.title}": can you explain this in detail under Indian laws?`)}
            className="flex items-center gap-1.5 rounded-lg bg-slate-950 px-3 py-1.8 text-xs font-semibold text-white hover:bg-slate-850 dark:bg-brand-gold-550 dark:text-slate-950 dark:hover:bg-brand-gold-400 transition-colors"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Ask LexAI</span>
          </button>
          <a
            href={selectedLaw.readMoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.8 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-850 dark:bg-brand-navy-900 dark:text-slate-200 dark:hover:bg-brand-navy-850 transition-colors"
          >
            <span>Read Official Statute</span>
            <ArrowRight className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Interactive Quiz Section */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-450 flex items-center gap-1.5 px-1">
          <HelpCircle className="h-4 w-4 text-brand-gold-550" />
          <span>Test Your Knowledge</span>
        </h4>

        {selectedLaw.quizQuestions && selectedLaw.quizQuestions.length > 0 ? (
          <div className="space-y-4">
            {selectedLaw.quizQuestions.map((q) => {
              const selectedIdx = selectedAnswers[q.id];
              const isSubmitted = !!submittedQuestions[q.id];
              const isCorrect = selectedIdx === q.correctAnswerIndex;

              return (
                <div 
                  key={q.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/40"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-450">
                      MULTIPLE CHOICE QUESTION
                    </span>
                  </div>

                  <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100 mb-3">
                    {q.question}
                  </h5>

                  {/* Options */}
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedIdx === optIdx;
                      const showAsCorrect = isSubmitted && optIdx === q.correctAnswerIndex;
                      const showAsIncorrect = isSubmitted && isSelected && !isCorrect;

                      return (
                        <button
                          key={optIdx}
                          disabled={isSubmitted}
                          onClick={() => handleSelectAnswer(q.id, optIdx)}
                          className={`w-full text-left text-xs p-2.5 rounded-xl border transition-all ${
                            showAsCorrect
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-800 dark:text-emerald-400 font-semibold'
                              : showAsIncorrect
                                ? 'bg-red-500/10 border-red-500 text-red-800 dark:text-red-400 font-semibold'
                                : isSelected
                                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-950/20 dark:border-indigo-400 dark:text-indigo-300 font-medium'
                                  : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-850 text-slate-650 dark:text-slate-350'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="h-4 w-4 shrink-0 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[9px] font-semibold">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="leading-tight">{opt}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Actions & Explanations */}
                  <div className="mt-3.5 flex flex-col gap-2.5">
                    {!isSubmitted && (
                      <button
                        onClick={() => handleSubmitQuestion(q.id, q)}
                        disabled={selectedIdx === undefined}
                        className={`w-full rounded-xl py-2 text-xs font-bold text-center transition-colors ${
                          selectedIdx !== undefined
                            ? 'bg-brand-navy-950 text-white hover:bg-slate-850 dark:bg-brand-gold-550 dark:text-slate-950 dark:hover:bg-brand-gold-400'
                            : 'bg-slate-100 text-slate-450 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
                        }`}
                      >
                        Submit Answer
                      </button>
                    )}

                    {isSubmitted && (
                      <div className={`rounded-xl p-3 border text-xs leading-relaxed ${
                        isCorrect
                          ? 'bg-emerald-50/50 border-emerald-100 dark:bg-emerald-950/10 dark:border-emerald-900 text-emerald-800 dark:text-emerald-350'
                          : 'bg-red-50/50 border-red-100 dark:bg-red-950/10 dark:border-red-900 text-red-800 dark:text-red-350'
                      }`}>
                        <div className="flex items-center gap-1.5 font-bold mb-1">
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                              <span>Correct Answer!</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                              <span>Incorrect Answer</span>
                            </>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-550 dark:text-slate-400">
                          {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-400">
            No quiz available for this topic.
          </div>
        )}
      </div>

      {/* Archive Section */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-450 px-1">
          Daily Law Archive
        </h4>
        <div className="grid grid-cols-1 gap-2.5">
          {dailyLaws.map((law) => {
            const isFeatured = law.id === selectedLaw.id;
            return (
              <button
                key={law.id}
                onClick={() => handleSelectArchiveLaw(law)}
                className={`w-full text-left rounded-xl p-3.5 border transition-all ${
                  isFeatured
                    ? 'border-brand-gold-550 bg-brand-gold-550/5 shadow-premium'
                    : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-850'
                }`}
              >
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold mb-1">
                  <span>{law.date}</span>
                  {isFeatured && <span className="text-brand-gold-550 dark:text-brand-gold-300">Reading Now</span>}
                </div>
                <h5 className="text-xs font-bold text-slate-850 dark:text-slate-200 leading-tight">
                  {law.title}
                </h5>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
export default DailyLawPanel;
