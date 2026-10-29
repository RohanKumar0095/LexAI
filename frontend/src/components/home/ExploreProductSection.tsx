import React from 'react';
import { MessageSquare, ShieldCheck, Compass, FileText, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export interface ExploreProductSectionProps {
  onEnterApp: () => void;
}

export const ExploreProductSection: React.FC<ExploreProductSectionProps> = ({ onEnterApp }) => {
  const views = [
    {
      title: "Conversational Chat OS Surface",
      desc: "The primary interactive interface. Ask questions, view citations, and receive real-time statutory guidance.",
      icon: <MessageSquare className="w-5 h-5 text-[#C084FC]" />,
      badge: "Primary Surface",
    },
    {
      title: "Fundamental Rights Hub",
      desc: "Interactive catalog of constitutional rights during police stops, arrests, traffic checks, and detention.",
      icon: <ShieldCheck className="w-5 h-5 text-[#C084FC]" />,
      badge: "Citizen Rights",
    },
    {
      title: "Legal Scenario Simulator",
      desc: "Step-by-step guided simulations for tenant disputes, workplace issues, and consumer delays.",
      icon: <Compass className="w-5 h-5 text-[#C084FC]" />,
      badge: "Interactive Wizard",
    },
    {
      title: "Document AI & Complaint Generator",
      desc: "Summarize legal notices, analyze rental contracts, and draft official consumer complaints.",
      icon: <FileText className="w-5 h-5 text-[#C084FC]" />,
      badge: "Drafting Suite",
    },
    {
      title: "My Learning & Milestone Hub",
      desc: "Track daily laws, complete optional legal challenges, earn XP, and unlock the 30-Day LexAI Vault.",
      icon: <BookOpen className="w-5 h-5 text-[#C084FC]" />,
      badge: "Literacy Hub",
    },
  ];

  return (
    <section className="py-24 relative bg-[#07050D] border-t border-[#C084FC]/15">
      {/* Background illumination */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-[#A855F7]/07 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Header — Loopy SaaS Hierarchy */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="caption-text text-[#C084FC] inline-block font-semibold tracking-wider">
            Interactive Product Preview
          </span>
          <h2 className="heading-xl text-white font-display">
            Explore the <span className="lexai-signature-gradient">LexAI Workspace</span>
          </h2>
          <p className="body-md text-[#AAA1BC] max-w-2xl mx-auto leading-relaxed">
            Preview key workspaces of LexAI-India. Click any card to launch the interactive workspace and start exploring immediately.
          </p>
        </div>

        {/* Views Grid with Loopy Dark Surfaces */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {views.map((view, idx) => (
            <Card
              key={idx}
              variant="card"
              hoverable
              onClick={onEnterApp}
              className="p-6 space-y-4 flex flex-col justify-between border border-[#C084FC]/15 bg-[#151020] hover:border-[#A855F7]/50 hover:bg-[#1C1530] hover:shadow-xl hover:shadow-purple-950/20 group cursor-pointer rounded-2xl shadow-lg shadow-black/50 transition-all duration-300"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-[#1C1530] border border-[#C084FC]/20 flex items-center justify-center group-hover:border-[#C084FC]/40 transition-colors">
                    {view.icon}
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#D8B4FE] bg-[#A855F7]/10 px-2.5 py-0.5 rounded-full border border-[#A855F7]/25">
                    {view.badge}
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <h3 className="font-semibold text-white text-base group-hover:text-[#C084FC] transition-colors duration-200">
                    {view.title}
                  </h3>
                  <p className="text-xs text-[#AAA1BC] leading-relaxed">
                    {view.desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#30243F]/60 flex items-center justify-between text-xs font-medium text-[#C084FC] group-hover:text-white transition-colors">
                <span>Launch Interactive View</span>
                <ArrowRight className="w-4 h-4 text-[#C084FC] group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          ))}

          {/* Launch Workspace Callout Card */}
          <div className="p-8 rounded-2xl border border-[#A855F7]/40 bg-gradient-to-br from-[#1C1530] to-[#151020] flex flex-col justify-between space-y-6 shadow-xl shadow-purple-950/30">
            <div className="space-y-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-white bg-[#A855F7] px-2.5 py-0.5 rounded-full shadow-sm shadow-purple-500/30">
                Ready to Experience?
              </span>
              <h3 className="heading-lg text-white font-display">
                Try LexAI in Guest Mode
              </h3>
              <p className="text-xs text-[#AAA1BC] leading-relaxed">
                No sign up required to explore basic queries, fundamental rights checklists, and daily law lessons.
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={onEnterApp}
              rightIcon={<Sparkles className="w-4 h-4 text-white" />}
              className="w-full justify-center shadow-lg shadow-purple-500/30 font-semibold tracking-tight"
            >
              Enter LexAI Workspace
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
};
export default ExploreProductSection;