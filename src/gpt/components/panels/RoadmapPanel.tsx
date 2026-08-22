import React, { useState } from 'react';
import { Map, FileText, Scale, Info, ChevronDown, ChevronUp, Sparkles, Loader } from 'lucide-react';
import { apiService } from '../../services/apiService';
import type { Roadmap } from '../../types/chat';

export const RoadmapPanel: React.FC = () => {
  const [goalInput, setGoalInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({ 1: true });

  const quickGoals = [
    { label: 'File an FIR', id: 'fir-roadmap' },
    { label: 'Report Cyber Fraud', id: 'cyber-fraud-roadmap' },
    { label: 'Vehicle Stop protocol', id: 'police-stop-roadmap' }
  ];

  const handleGenerate = async (id: string) => {
    setLoading(true);
    setRoadmap(null);
    try {
      const generated = await apiService.generateRoadmap(id);
      setRoadmap(generated);
      // Reset expanded steps, default step 1 to expanded
      setExpandedSteps({ 1: true });
    } catch (e) {
      console.error("Roadmap generation failed", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalInput.trim()) return;

    // Convert string to match one of the keys or default
    const query = goalInput.toLowerCase();
    let selectedId = 'custom-roadmap';
    if (query.includes('fir')) selectedId = 'fir-roadmap';
    else if (query.includes('cyber') || query.includes('fraud') || query.includes('scam')) selectedId = 'cyber-fraud-roadmap';
    else if (query.includes('police') || query.includes('stop') || query.includes('search')) selectedId = 'police-stop-roadmap';

    handleGenerate(selectedId);
  };

  const toggleStep = (stepNo: number) => {
    setExpandedSteps(prev => ({ ...prev, [stepNo]: !prev[stepNo] }));
  };

  return (
    <div className="h-full flex flex-col space-y-5">
      <div>
        <span className="text-[10px] font-bold text-slate-400 uppercase">
          Legal Roadmaps
        </span>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
          Turn a legal goal into clear steps
        </h3>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Generate an action plan detailing documents, procedures, and rights.
        </p>
      </div>

      {/* Goal Input form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            placeholder="What are you trying to do? (e.g. I want to file an FIR)"
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-12 text-xs text-slate-800 placeholder-slate-400 focus:border-brand-gold-550 focus:outline-none focus:ring-1 focus:ring-brand-gold-550/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
          />
          <button
            type="submit"
            disabled={!goalInput.trim() || loading}
            className="absolute right-2 top-2 rounded-lg bg-slate-950 p-1.5 text-white dark:bg-brand-gold-550 dark:text-slate-950 disabled:bg-slate-100 disabled:text-slate-350 dark:disabled:bg-slate-800 dark:disabled:text-slate-650"
          >
            <Sparkles className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Quick select buttons */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {quickGoals.map((qg) => (
            <button
              key={qg.id}
              type="button"
              onClick={() => {
                setGoalInput(qg.label);
                handleGenerate(qg.id);
              }}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-medium text-slate-650 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-350 dark:hover:bg-slate-850"
            >
              {qg.label}
            </button>
          ))}
        </div>
      </form>

      {/* Loading State */}
      {loading && (
        <div className="flex-1 flex flex-col items-center justify-center py-16 space-y-3">
          <Loader className="h-8 w-8 text-brand-gold-550 animate-spin" />
          <p className="text-xs text-slate-500 animate-pulse">
            Generating custom legal roadmap...
          </p>
        </div>
      )}

      {/* Roadmap Output */}
      {roadmap && !loading && (
        <div className="flex-1 space-y-4 pr-1 animate-in fade-in duration-300">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-200/80 dark:border-slate-800">
            <Map className="h-4.5 w-4.5 text-brand-gold-550" />
            <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100">
              {roadmap.title}
            </h4>
          </div>

          <div className="space-y-3">
            {roadmap.steps.map((step) => {
              const isExpanded = !!expandedSteps[step.number];
              return (
                <div 
                  key={step.number}
                  className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/40 overflow-hidden shadow-sm"
                >
                  {/* Step Header Accordion Toggle */}
                  <button
                    onClick={() => toggleStep(step.number)}
                    className="w-full flex items-center justify-between p-3.5 text-left hover:bg-slate-50 dark:hover:bg-slate-850/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-950 text-white dark:bg-brand-gold-550 dark:text-slate-950 text-[10px] font-bold shrink-0">
                        {step.number}
                      </div>
                      <span className="text-xs font-bold text-slate-850 dark:text-slate-250">
                        {step.title}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                  </button>

                  {/* Step Details */}
                  {isExpanded && (
                    <div className="p-3.5 pt-0 border-t border-slate-100 dark:border-slate-800 space-y-3 bg-slate-50/20 dark:bg-brand-navy-950/10">
                      <p className="text-[11px] leading-relaxed text-slate-650 dark:text-slate-350">
                        {step.description}
                      </p>

                      {/* Documents Check box list */}
                      {step.documents && step.documents.length > 0 && (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                            <FileText className="h-3 w-3" />
                            <span>Documents Required</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {step.documents.map((doc, dIdx) => (
                              <span 
                                key={dIdx}
                                className="rounded bg-brand-gold-550/10 text-brand-gold-550 dark:text-brand-gold-300 px-2 py-0.5 text-[9px] font-semibold"
                              >
                                {doc}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Rights Highlights */}
                      {step.rights && step.rights.length > 0 && (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                            <Scale className="h-3 w-3" />
                            <span>Your Legal Rights</span>
                          </div>
                          <div className="space-y-1">
                            {step.rights.map((right, rIdx) => (
                              <div key={rIdx} className="flex gap-1.5 items-start text-[10px] text-slate-650 dark:text-slate-300">
                                <span className="text-emerald-500 font-bold">•</span>
                                <span className="leading-tight">{right}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Notes Box */}
                      {step.notes && (
                        <div className="flex gap-1.5 rounded-lg bg-indigo-500/5 p-2 text-[10px] border border-indigo-500/10">
                          <Info className="h-3.5 w-3.5 text-indigo-500 shrink-0 mt-0.5" />
                          <span className="text-slate-500 dark:text-slate-400 leading-normal">
                            <strong>Note:</strong> {step.notes}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!roadmap && !loading && (
        <div className="flex-1 flex flex-col items-center justify-center py-16 text-center px-4">
          <Map className="h-8 w-8 text-slate-300 dark:text-slate-700 mb-2 animate-bounce" />
          <h5 className="text-xs font-bold text-slate-700 dark:text-slate-350">
            No roadmap generated yet
          </h5>
          <p className="text-[10px] text-slate-400 mt-1 max-w-xs">
            Describe your goal in the input field above or click one of the suggestions to see step-by-step guidance.
          </p>
        </div>
      )}

    </div>
  );
};
export default RoadmapPanel;
