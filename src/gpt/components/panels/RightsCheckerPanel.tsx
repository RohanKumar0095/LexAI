import React, { useState } from 'react';
import { Shield, ArrowRight, ArrowLeft, CheckCircle, Scale, MessageSquare } from 'lucide-react';

interface RightsCheckerPanelProps {
  onAskLex: (prompt: string) => void;
}

export const RightsCheckerPanel: React.FC<RightsCheckerPanelProps> = ({ onAskLex }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const totalSteps = 4;

  const questions = [
    {
      id: 1,
      title: "What is your current situation?",
      subtitle: "Select the action that best matches what you are experiencing",
      options: [
        "I was stopped while driving / travelling on the road",
        "I was asked to show personal documents or devices",
        "I am being searched (body or vehicle)",
        "I have been detained or taken to the police station",
        "Other administrative query"
      ]
    },
    {
      id: 2,
      title: "Where did this incident occur?",
      subtitle: "Legal jurisdictions and officer powers vary by location",
      options: [
        "On a public highway / street",
        "Inside a private residence / home",
        "At a public commercial establishment (shop, office)",
        "Inside a police station premises",
        "At an airport, railway station, or border checkpoint"
      ]
    },
    {
      id: 3,
      title: "Are you being accused or questioned?",
      subtitle: "Accused suspects have stronger protections against self-incrimination",
      options: [
        "I am being questioned as a suspect in a case",
        "I am being asked to witness or give general information",
        "The officer has not stated any charges or reasons",
        "No questioning has happened, just document checks"
      ]
    },
    {
      id: 4,
      title: "Has the officer presented a warrant or identity card?",
      subtitle: "Official actions require credentials or judicial permissions",
      options: [
        "Yes, they showed a badge/ID and a court warrant",
        "They showed their police ID card only (no warrant)",
        "No, they refused to show any badge or warrant",
        "I did not ask them for any identification"
      ]
    }
  ];

  const handleSelectOption = (opt: string) => {
    setAnswers(prev => ({ ...prev, [currentStep]: opt }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      setCurrentStep(5); // Show results screen
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setAnswers({});
  };

  const handleContinueWithAI = () => {
    const sit = answers[1] || 'stopped';
    const loc = answers[2] || 'public place';
    const charge = answers[3] || 'unknown reasons';
    const warrant = answers[4] || 'no warrant shown';

    const prompt = `I was ${sit.toLowerCase()} in a ${loc.toLowerCase()}. The questioning status is: "${charge}", and the officer\'s warrant status was: "${warrant}". What are my specific legal rights, and what should I do next?`;
    onAskLex(prompt);
  };

  return (
    <div className="h-full flex flex-col justify-between">
      
      {currentStep <= totalSteps ? (
        // Questionnaire Wizard View
        <div className="space-y-5 flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header & Step progress */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Interactive Rights Checker
              </span>
              <span className="text-xs font-semibold text-brand-gold-550 dark:text-brand-gold-300">
                Question {currentStep} of {totalSteps}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-1 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-brand-gold-550 transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <div className="pt-2">
              <h3 className="text-sm font-bold text-slate-905 dark:text-white leading-tight">
                {questions[currentStep - 1].title}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">
                {questions[currentStep - 1].subtitle}
              </p>
            </div>

            {/* Options List */}
            <div className="space-y-2.5 pt-2">
              {questions[currentStep - 1].options.map((opt, idx) => {
                const isSelected = answers[currentStep] === opt;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(opt)}
                    className={`w-full text-left text-xs p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-brand-gold-550 bg-brand-gold-550/5 text-slate-900 dark:text-white font-medium shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-650 dark:text-slate-350'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected 
                          ? 'border-brand-gold-550 bg-brand-gold-550 text-slate-900' 
                          : 'border-slate-300 dark:border-slate-700'
                      }`}>
                        {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-slate-900" />}
                      </div>
                      <span className="leading-tight">{opt}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center gap-3 pt-6 border-t border-slate-200/80 dark:border-slate-800 mt-8">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                currentStep === 1
                  ? 'border-slate-100 text-slate-300 dark:border-slate-800 dark:text-slate-700 cursor-not-allowed'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-brand-navy-900 dark:text-slate-200 dark:hover:bg-brand-navy-850'
              }`}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>
            <button
              onClick={handleNext}
              disabled={!answers[currentStep]}
              className={`flex items-center gap-1 px-5 py-2.5 rounded-xl text-xs font-bold text-center transition-colors ${
                answers[currentStep]
                  ? 'bg-brand-navy-950 text-white hover:bg-slate-850 dark:bg-brand-gold-550 dark:text-slate-950 dark:hover:bg-brand-gold-400'
                  : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-650 cursor-not-allowed'
              }`}
            >
              <span>{currentStep === totalSteps ? 'See Results' : 'Continue'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : (
        // Results View
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="text-center pb-2">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 mb-2">
              <CheckCircle className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Evaluation Complete
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Based on your answers, here are your relevant rights under Indian Law.
            </p>
          </div>

          {/* Right Cards */}
          <div className="space-y-3.5">
            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60">
              <h4 className="text-xs font-bold text-brand-gold-550 dark:text-brand-gold-300 flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-brand-gold-550" />
                <span>Right to know the grounds</span>
              </h4>
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 mt-1.5">
                Under Section 50 of CrPC (now Section 47 BNSS), any officer checking your documents or stopping you must identify themselves and clearly state the offence/suspicion.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60">
              <h4 className="text-xs font-bold text-brand-gold-550 dark:text-brand-gold-300 flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-brand-gold-550" />
                <span>No arbitrary search of device</span>
              </h4>
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 mt-1.5">
                Unless a specific cybercrime warrant exists, you cannot be forced to unlock your phone, read out messages, or disclose social credentials on the street.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60">
              <h4 className="text-xs font-bold text-brand-gold-550 dark:text-brand-gold-300 flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-brand-gold-550" />
                <span>Right to consult an advocate</span>
              </h4>
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 mt-1.5">
                Under Article 22(1) of the Constitution, you have the fundamental right to contact and consult a legal practitioner of your choice at the earliest opportunity.
              </p>
            </div>
          </div>

          {/* Action box */}
          <div className="rounded-xl border border-indigo-500/10 bg-indigo-500/5 p-4 mt-4">
            <h4 className="text-xs font-bold text-indigo-750 dark:text-indigo-300 flex items-center gap-1.5 mb-1">
              <Scale className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>Recommended Action</span>
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              If the officer insists on taking you to the station, demand to note down their name and station diary entry. Contact a lawyer immediately. Zero physical coercion is permissible for simple documentation discrepancies.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-2.5 pt-4">
            <button
              onClick={handleContinueWithAI}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-brand-navy-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-850 dark:bg-brand-gold-550 dark:text-slate-950 dark:hover:bg-brand-gold-400 transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Continue with LexAI</span>
            </button>
            <button
              onClick={handleReset}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-brand-navy-900 dark:text-slate-200 dark:hover:bg-slate-850 transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>
      )}
      
    </div>
  );
};
export default RightsCheckerPanel;
