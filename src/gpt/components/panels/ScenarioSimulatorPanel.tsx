import React, { useState } from 'react';
import { 
  Shield, Car, Laptop, HeartHandshake, ShoppingBag, 
  Home, Briefcase, ArrowLeft, ArrowRight, 
  Play, CheckCircle, AlertOctagon, MessageSquare 
} from 'lucide-react';
import type { Scenario } from '../../types/legal';

interface ScenarioSimulatorPanelProps {
  scenarios: Scenario[];
  onOpenSos: () => void;
  onAskLex: (prompt: string) => void;
}

export const ScenarioSimulatorPanel: React.FC<ScenarioSimulatorPanelProps> = ({
  scenarios,
  onOpenSos,
  onAskLex
}) => {
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const iconMap: Record<string, any> = {
    Shield,
    Car,
    Laptop,
    HeartHandshake,
    ShoppingBag,
    Home,
    Briefcase
  };

  const handleStartScenario = (sc: Scenario) => {
    setActiveScenario(sc);
    setCurrentStepIdx(0);
  };

  const handleNext = () => {
    if (activeScenario && currentStepIdx < activeScenario.steps.length) {
      setCurrentStepIdx(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    setActiveScenario(null);
  };

  const handleAskLexForScenario = () => {
    if (!activeScenario) return;
    onAskLex(`I would like to discuss a "${activeScenario.title}" scenario. Specifically, I am dealing with: ${activeScenario.steps[0]?.description}. What should be my legal strategy?`);
  };

  return (
    <div className="h-full flex flex-col justify-between">
      
      {!activeScenario ? (
        // Scenario Directory Grid
        <div className="space-y-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Scenario Simulator
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
              Select a situation to simulate
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Practice legal action steps interactively in a safe environment.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 pt-2">
            {scenarios.map((sc) => {
              const IconComp = iconMap[sc.icon] || Shield;
              return (
                <button
                  key={sc.id}
                  onClick={() => handleStartScenario(sc)}
                  className="group w-full rounded-2xl border border-slate-200 bg-white p-4 text-left transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-850 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gold-550/10 text-brand-gold-550 group-hover:bg-brand-gold-550 group-hover:text-slate-950 transition-colors">
                        <IconComp className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100">
                          {sc.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {sc.description}
                        </p>
                      </div>
                    </div>
                    <Play className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        // Active Scenario Simulation Wizard
        <div className="space-y-5 flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* Header & Steps progress indicator */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setActiveScenario(null)}
                className="flex items-center gap-1 text-[10px] font-bold text-slate-450 hover:text-slate-650"
              >
                <ArrowLeft className="h-3 w-3" />
                <span>ALL SCENARIOS</span>
              </button>
              
              <span className="text-[10px] font-semibold text-brand-gold-550 dark:text-brand-gold-300">
                Step {currentStepIdx + 1} of {activeScenario.steps.length + 1}
              </span>
            </div>

            <div className="h-1 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-brand-gold-550 transition-all duration-300"
                style={{ width: `${((currentStepIdx + 1) / (activeScenario.steps.length + 1)) * 100}%` }}
              />
            </div>

            <div className="pt-2">
              <span className="text-[9px] font-bold text-brand-gold-550 uppercase tracking-widest">
                {activeScenario.title} Simulation
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight mt-0.5">
                {currentStepIdx < activeScenario.steps.length 
                  ? activeScenario.steps[currentStepIdx].title 
                  : "Scenario Completed"}
              </h3>
            </div>

            {currentStepIdx < activeScenario.steps.length ? (
              // Step Detail Card
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4.5 dark:border-slate-800 dark:bg-slate-900/60 shadow-premium">
                  <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-200">
                    {activeScenario.steps[currentStepIdx].description}
                  </p>
                </div>

                <div className="rounded-2xl border border-indigo-500/10 bg-indigo-500/5 p-4">
                  <h5 className="text-[10px] font-bold text-indigo-750 dark:text-indigo-300 uppercase tracking-wider mb-1">
                    Details & Tips
                  </h5>
                  <p className="text-[11px] leading-relaxed text-slate-650 dark:text-slate-350">
                    {activeScenario.steps[currentStepIdx].details}
                  </p>
                </div>
              </div>
            ) : (
              // Completed/Congrats Card
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/60 text-center shadow-premium">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 mb-2">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    Well Done!
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    You have finished the guided steps for resolving a **{activeScenario.title}** conflict.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/50 space-y-2">
                  <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Next Legal Steps
                  </h5>
                  <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                    If this is a real-life emergency or active threat, immediately access SOS support. Otherwise, click Ask LexAI to start drafting a detailed roadmap in chat.
                  </p>
                </div>

                {/* Completed Action Shortcuts */}
                <div className="flex gap-2">
                  <button
                    onClick={onOpenSos}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-red-500/10 border border-red-500/20 px-3.5 py-2 text-xs font-bold text-red-650 hover:bg-red-500/20 dark:text-red-400 transition-colors"
                  >
                    <AlertOctagon className="h-3.5 w-3.5" />
                    <span>Open SOS Help</span>
                  </button>
                  <button
                    onClick={handleAskLexForScenario}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-brand-navy-950 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-850 dark:bg-brand-gold-550 dark:text-slate-950 dark:hover:bg-brand-gold-400 transition-colors"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Ask LexAI</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center gap-3 pt-6 border-t border-slate-200/80 dark:border-slate-800 mt-8">
            <button
              onClick={handleBack}
              disabled={currentStepIdx === 0 || currentStepIdx >= activeScenario.steps.length}
              className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                (currentStepIdx === 0 || currentStepIdx >= activeScenario.steps.length)
                  ? 'border-slate-100 text-slate-300 dark:border-slate-800 dark:text-slate-700 cursor-not-allowed'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-brand-navy-900 dark:text-slate-200 dark:hover:bg-brand-navy-850'
              }`}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>

            {currentStepIdx < activeScenario.steps.length ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-navy-950 text-white hover:bg-slate-850 dark:bg-brand-gold-550 dark:text-slate-950 dark:hover:bg-brand-gold-400 transition-colors"
              >
                <span>Continue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="flex items-center gap-1 px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-navy-950 text-white hover:bg-slate-850 dark:bg-brand-gold-550 dark:text-slate-950 dark:hover:bg-brand-gold-400 transition-colors"
              >
                <span>Finish</span>
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
export default ScenarioSimulatorPanel;
