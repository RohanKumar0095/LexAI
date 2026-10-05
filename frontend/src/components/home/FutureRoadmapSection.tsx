import React from 'react';
import { Sparkles, Compass, Mic, Globe, Scale, Clock, Landmark } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { GradientText } from '../ui/GradientText';

export const FutureRoadmapSection: React.FC = () => {
  const futureItems = [
    {
      title: "Agentic AI Execution Engine",
      desc: "Autonomous multi-step AI agents that break down complex legal processes, query multiple government APIs, and draft complete notice packages.",
      icon: <Sparkles className="w-5 h-5 text-saffron-400" />,
      phase: "Phase 3 Roadmap",
    },
    {
      title: "Verified Advocate Directory & Referral",
      desc: "Connect seamlessly with verified Indian advocates for formal court representation when legal advice is required.",
      icon: <Scale className="w-5 h-5 text-indigo-400" />,
      phase: "Phase 3 Roadmap",
    },
    {
      title: "Voice Conversation Assistant",
      desc: "Speak naturally to LexAI in English or Hindi with instant speech-to-text and voice guidance capabilities.",
      icon: <Mic className="w-5 h-5 text-emerald-400" />,
      phase: "Phase 4 Roadmap",
    },
    {
      title: "Indian Regional Language Expansion",
      desc: "Expanding legal literacy into Marathi, Tamil, Bengali, Gujarati, Telugu, Kannada, Malayalam, and Punjabi.",
      icon: <Globe className="w-5 h-5 text-saffron-400" />,
      phase: "Phase 4 Roadmap",
    },
    {
      title: "e-Courts Case Status Integration",
      desc: "Track hearing dates, case status, e-filing stages, and cause lists directly from official Indian e-Courts portals.",
      icon: <Landmark className="w-5 h-5 text-indigo-400" />,
      phase: "Phase 4 Roadmap",
    },
    {
      title: "Global Jurisdiction Expansion",
      desc: "Multi-country jurisdiction selector scaling LexAI into a global jurisdiction-aware legal AI platform.",
      icon: <Compass className="w-5 h-5 text-emerald-400" />,
      phase: "Global Roadmap",
    },
  ];

  return (
    <section id="roadmap" className="py-24 relative bg-[#070A12] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="electric" icon={<Clock className="w-3.5 h-3.5" />}>
            Future Vision & Expansion Roadmap
          </Badge>
          <h2 className="heading-xl text-white font-display">
            The Future of <GradientText variant="signature">LexAI-India</GradientText>
          </h2>
          <p className="body-md text-slate-300">
            A transparent overview of our planned technological roadmap — from Agentic AI workflows to verified lawyer referrals and global jurisdiction expansion.
          </p>
        </div>

        {/* Future Roadmap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {futureItems.map((item, idx) => (
            <Card key={idx} variant="card" className="space-y-4 border-slate-800 opacity-90 hover:opacity-100 transition-opacity">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  {item.icon}
                </div>
                <Badge variant="electric" className="text-[10px]">{item.phase}</Badge>
              </div>

              <div>
                <h3 className="font-semibold text-white text-base">{item.title}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.desc}</p>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};
