import React from 'react';
import { Check } from 'lucide-react';

interface OnboardingStepIndicatorProps {
  currentStep: number; // 1 to 5
}

export const OnboardingStepIndicator: React.FC<OnboardingStepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Profile' },
    { number: 2, label: 'State' },
    { number: 3, label: 'District' },
    { number: 4, label: 'Language' },
    { number: 5, label: 'Welcome' },
  ];

  return (
    <div className="w-full py-4">
      {/* Visual step line and nodes */}
      <div className="relative flex items-center justify-between">
        {/* Background Track Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#30243F] -translate-y-1/2 z-0" />
        
        {/* Active Progress Fill Line */}
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] -translate-y-1/2 transition-all duration-500 ease-out z-0"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;
          
          return (
            <div key={step.number} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-[#10B981] border-[#10B981] text-[#08070D]' 
                    : isActive 
                      ? 'bg-[#1C1728] border-[#A855F7] text-[#C084FC] scale-110 shadow-lg shadow-purple-500/25' 
                      : 'bg-[#100D18] border-[#30243F] text-[#AAA3BB]'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  step.number
                )}
              </div>
              
              <span 
                className={`text-[9px] font-semibold uppercase tracking-wider mt-1.5 transition-colors duration-200 ${
                  isActive 
                    ? 'text-[#C084FC]' 
                    : isCompleted 
                      ? 'text-[#34D399]' 
                      : 'text-[#AAA3BB]'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default OnboardingStepIndicator;
