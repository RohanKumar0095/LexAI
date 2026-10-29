import React from 'react';
import { MessageSquare, Cpu, HelpCircle, Database, FileText, BookmarkCheck, ArrowRight, Compass } from 'lucide-react';
import { Card } from '../ui/Card';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: "01",
      icon: <MessageSquare className="w-5 h-5 text-[#C084FC]" />,
      title: "User Asks a Legal Question",
      desc: "User enters a natural language legal scenario or query into the Chat Command Center.",
    },
    {
      num: "02",
      icon: <Cpu className="w-5 h-5 text-[#C084FC]" />,
      title: "AI Understands Situation",
      desc: "LexAI parses the factual context, categorizing legal domains (tenancy, traffic, criminal, consumer).",
    },
    {
      num: "03",
      icon: <HelpCircle className="w-5 h-5 text-[#C084FC]" />,
      title: "Asks Clarifications",
      desc: "Requests missing state or location context if needed to determine applicable state rules.",
    },
    {
      num: "04",
      icon: <Database className="w-5 h-5 text-[#C084FC]" />,
      title: "Retrieves Verified Statutes",
      desc: "Queries verified Indian legal database (IPC/BNS, Motor Vehicles Act, Consumer Protection Act, RERA).",
    },
    {
      num: "05",
      icon: <FileText className="w-5 h-5 text-[#C084FC]" />,
      title: "Plain-Language Explanation",
      desc: "Translates complex legalese into clear, understandable guidance in English or Hindi.",
    },
    {
      num: "06",
      icon: <BookmarkCheck className="w-5 h-5 text-[#C084FC]" />,
      title: "Cites Official Acts & Sections",
      desc: "Provides verifiable legal citations (e.g. IPC Section 354, MV Act Section 130) with official sources.",
    },
    {
      num: "07",
      icon: <ArrowRight className="w-5 h-5 text-[#C084FC]" />,
      title: "Suggests Actionable Next Steps",
      desc: "Outlines practical citizen actions (filing RTI, sending formal notice, contacting helpline).",
    },
    {
      num: "08",
      icon: <Compass className="w-5 h-5 text-[#C084FC]" />,
      title: "Launches Connected Legal Tool",
      desc: "Optionally opens connected tools (Rights Checker, Scenario Simulator, Complaint Draft) directly inside chat.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative bg-[#07050D]">
      {/* Background illumination */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[550px] h-[320px] bg-[#A855F7]/07 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Header — Loopy SaaS Hierarchy */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="caption-text text-[#C084FC] inline-block font-semibold tracking-wider">
            Execution Pipeline
          </span>
          <h2 className="heading-xl text-white font-display">
            How <span className="lexai-signature-gradient">LexAI Works</span>
          </h2>
          <p className="body-md text-[#AAA1BC] max-w-2xl mx-auto leading-relaxed">
            From natural language citizen query to verified statutory citation and connected legal tool action in 8 intelligent steps.
          </p>
        </div>

        {/* Step Grid with Loopy Dark Surfaces */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <Card 
              key={idx} 
              variant="elevated" 
              className="p-6 space-y-4 border border-[#C084FC]/15 bg-[#151020] hover:border-[#A855F7]/40 hover:bg-[#1C1530] transition-all duration-300 hover:-translate-y-1 group rounded-2xl shadow-lg shadow-black/50"
            >
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-[#A855F7]/15 text-[#C084FC] font-bold text-xs flex items-center justify-center border border-[#A855F7]/25 font-display">
                  {step.num}
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#1C1530] flex items-center justify-center border border-[#C084FC]/20 group-hover:border-[#C084FC]/40 transition-colors">
                  {step.icon}
                </div>
              </div>

              <div className="space-y-1.5">
                <h3 className="font-semibold text-white text-sm group-hover:text-[#C084FC] transition-colors duration-200">
                  {step.title}
                </h3>
                <p className="text-xs text-[#AAA1BC] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};
export default HowItWorksSection;