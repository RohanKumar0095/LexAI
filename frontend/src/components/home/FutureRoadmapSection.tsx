import React from 'react';
import { Sparkles, Compass, Mic, Globe, Scale, Landmark } from 'lucide-react';
import { Card } from '../ui/Card';

export const FutureRoadmapSection: React.FC = () => {
  const futureItems = [
    {
      title: "Agentic AI Execution Engine",
      desc: "Autonomous multi-step AI agents that break down complex legal processes, query multiple government APIs, and draft complete notice packages.",
      icon: <Sparkles className="w-5 h-5 text-[#C084FC]" />,
      phase: "Phase 3 Roadmap",
    },
    {
      title: "Verified Advocate Directory & Referral",
      desc: "Connect seamlessly with verified Indian advocates for formal court representation when legal advice is required.",
      icon: <Scale className="w-5 h-5 text-[#C084FC]" />,
      phase: "Phase 3 Roadmap",
    },
    {
      title: "Voice Conversation Assistant",
      desc: "Speak naturally to LexAI in English or Hindi with instant speech-to-text and voice guidance capabilities.",
      icon: <Mic className="w-5 h-5 text-[#C084FC]" />,
      phase: "Phase 4 Roadmap",
    },
    {
      title: "Indian Regional Language Expansion",
      desc: "Expanding legal literacy into Marathi, Tamil, Bengali, Gujarati, Telugu, Kannada, Malayalam, and Punjabi.",
      icon: <Globe className="w-5 h-5 text-[#C084FC]" />,
      phase: "Phase 4 Roadmap",
    },
    {
      title: "e-Courts Case Status Integration",
      desc: "Track hearing dates, case status, e-filing stages, and cause lists directly from official Indian e-Courts portals.",
      icon: <Landmark className="w-5 h-5 text-[#C084FC]" />,
      phase: "Phase 4 Roadmap",
    },
    {
      title: "Global Jurisdiction Expansion",
      desc: "Multi-country jurisdiction selector scaling LexAI into a global jurisdiction-aware legal AI platform.",
      icon: <Compass className="w-5 h-5 text-[#C084FC]" />,
      phase: "Global Roadmap",
    },
  ];

  return (
    <section id="roadmap" className="py-24 relative bg-[#07050D] border-t border-[#C084FC]/15">
      {/* Background illumination */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[550px] h-[320px] bg-[#A855F7]/07 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Header — Loopy SaaS Hierarchy */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="caption-text text-[#C084FC] inline-block font-semibold tracking-wider">
            Future Vision & Expansion
          </span>
          <h2 className="heading-xl text-white font-display">
            The Future of <span className="lexai-signature-gradient">LexAI-India</span>
          </h2>
          <p className="body-md text-[#AAA1BC] max-w-2xl mx-auto leading-relaxed">
            A transparent overview of our planned technological roadmap — from Agentic AI workflows to verified lawyer referrals and global jurisdiction expansion.
          </p>
        </div>

        {/* Future Roadmap Grid with Loopy Dark Surfaces */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {futureItems.map((item, idx) => (
            <Card 
              key={idx} 
              variant="card" 
              className="p-6 space-y-4 border border-[#C084FC]/15 bg-[#151020] hover:border-[#A855F7]/40 hover:bg-[#1C1530] hover:-translate-y-1 transition-all duration-300 group rounded-2xl shadow-lg shadow-black/50"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-[#1C1530] border border-[#C084FC]/20 flex items-center justify-center group-hover:border-[#C084FC]/40 transition-colors">
                  {item.icon}
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#D8B4FE] bg-[#A855F7]/10 px-2.5 py-0.5 rounded-full border border-[#A855F7]/25">
                  {item.phase}
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="font-semibold text-white text-base group-hover:text-[#C084FC] transition-colors duration-200">
                  {item.title}
                </h3>
                <p className="text-xs text-[#AAA1BC] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};
export default FutureRoadmapSection;