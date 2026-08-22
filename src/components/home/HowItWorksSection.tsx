import React from 'react';
import { MessageSquare, Cpu, HelpCircle, Database, FileText, BookmarkCheck, ArrowRight, Compass } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { GradientText } from '../ui/GradientText';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: "01",
      icon: <MessageSquare className="w-5 h-5 text-indigo-400" />,
      title: "User Asks a Legal Question",
      desc: "User enters a natural language legal scenario or query into the Chat Command Center.",
    },
    {
      num: "02",
      icon: <Cpu className="w-5 h-5 text-saffron-400" />,
      title: "AI Understands Situation",
      desc: "LexAI parses the factual context, categorizing legal domains (tenancy, traffic, criminal, consumer).",
    },
    {
      num: "03",
      icon: <HelpCircle className="w-5 h-5 text-emerald-400" />,
      title: "Asks Clarifications",
      desc: "Requests missing state or location context if needed to determine applicable state rules.",
    },
    {
      num: "04",
      icon: <Database className="w-5 h-5 text-indigo-400" />,
      title: "Retrieves Verified Statutes",
      desc: "Queries verified Indian legal database (IPC/BNS, Motor Vehicles Act, Consumer Protection Act, RERA).",
    },
    {
      num: "05",
      icon: <FileText className="w-5 h-5 text-saffron-400" />,
      title: "Plain-Language Explanation",
      desc: "Translates complex legalese into clear, understandable guidance in English or Hindi.",
    },
    {
      num: "06",
      icon: <BookmarkCheck className="w-5 h-5 text-emerald-400" />,
      title: "Cites Official Acts & Sections",
      desc: "Provides verifiable legal citations (e.g. IPC Section 354, MV Act Section 130) with official sources.",
    },
    {
      num: "07",
      icon: <ArrowRight className="w-5 h-5 text-indigo-400" />,
      title: "Suggests Actionable Next Steps",
      desc: "Outlines practical citizen actions (filing RTI, sending formal notice, contacting helpline).",
    },
    {
      num: "08",
      icon: <Compass className="w-5 h-5 text-saffron-400" />,
      title: "Launches Connected Legal Tool",
      desc: "Optionally opens connected tools (Rights Checker, Scenario Simulator, Complaint Draft) directly inside chat.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative bg-[#070A12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="electric" icon={<Cpu className="w-3.5 h-3.5" />}>
            Execution Pipeline
          </Badge>
          <h2 className="heading-xl text-white font-display">
            How <GradientText variant="signature">LexAI Works</GradientText>
          </h2>
          <p className="body-md text-slate-300">
            From natural language query to verified statutory citation and connected legal tool action in 8 intelligent steps.
          </p>
        </div>

        {/* Step Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <Card key={idx} variant="card" className="space-y-3 relative overflow-hidden border-white/5 hover:border-indigo-500/30">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-500">{step.num}</span>
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                  {step.icon}
                </div>
              </div>
              <h3 className="font-semibold text-white text-sm">{step.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};
