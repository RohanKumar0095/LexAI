import React from 'react';
import { MessageSquare, ShieldCheck, Compass, FileText, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { GradientText } from '../ui/GradientText';

export interface ExploreProductSectionProps {
  onEnterApp: () => void;
}

export const ExploreProductSection: React.FC<ExploreProductSectionProps> = ({ onEnterApp }) => {
  const views = [
    {
      title: "Conversational Chat OS Surface",
      desc: "The primary interactive interface. Ask questions, view citations, and receive real-time statutory guidance.",
      icon: <MessageSquare className="w-6 h-6 text-indigo-400" />,
      badge: "Primary Surface",
    },
    {
      title: "Fundamental Rights Hub",
      desc: "Interactive catalog of constitutional rights during police stops, arrests, traffic checks, and detention.",
      icon: <ShieldCheck className="w-6 h-6 text-saffron-400" />,
      badge: "Citizen Rights",
    },
    {
      title: "Legal Scenario Simulator",
      desc: "Step-by-step guided simulations for tenant disputes, workplace issues, and consumer delays.",
      icon: <Compass className="w-6 h-6 text-emerald-400" />,
      badge: "Interactive Wizard",
    },
    {
      title: "Document AI & Complaint Generator",
      desc: "Summarize legal notices, analyze rental contracts, and draft official consumer complaints.",
      icon: <FileText className="w-6 h-6 text-indigo-400" />,
      badge: "Drafting Suite",
    },
    {
      title: "My Learning & Milestone Hub",
      desc: "Track daily laws, complete optional legal challenges, earn XP, and unlock the 30-Day LexAI Vault.",
      icon: <BookOpen className="w-6 h-6 text-saffron-400" />,
      badge: "Literacy Hub",
    },
  ];

  return (
    <section className="py-24 relative bg-[#080B14] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="saffron" icon={<Sparkles className="w-3.5 h-3.5" />}>
            Interactive Product Preview
          </Badge>
          <h2 className="heading-xl text-white font-display">
            Explore the <GradientText variant="signature">LexAI Product Views</GradientText>
          </h2>
          <p className="body-md text-slate-300">
            Preview the key views of LexAI-India. Click any view to launch the interactive application shell.
          </p>
        </div>

        {/* Views Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {views.map((view, idx) => (
            <Card
              key={idx}
              variant="card"
              hoverable
              onClick={onEnterApp}
              className="space-y-4 flex flex-col justify-between border-white/5 hover:border-saffron-500/40 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    {view.icon}
                  </div>
                  <Badge variant="glass">{view.badge}</Badge>
                </div>

                <h3 className="font-semibold text-white text-base group-hover:text-[#FF9933] transition-colors">
                  {view.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{view.desc}</p>
              </div>

              <div className="pt-2 flex items-center text-xs font-semibold text-saffron-400 group-hover:text-saffron-300">
                <span>Launch View</span>
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="lexai-surface-modal rounded-3xl p-8 border border-saffron-500/30 text-center max-w-3xl mx-auto space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-saffron-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <h3 className="heading-xl text-white font-display">
            Ready to experience <GradientText variant="signature">LexAI-India</GradientText>?
          </h3>
          <p className="body-md text-slate-300">
            Empowering every Indian citizen with instant legal awareness, statutory clarity, and intelligent legal guidance.
          </p>

          <Button variant="primary" size="lg" onClick={onEnterApp} rightIcon={<Sparkles className="w-5 h-5 text-[#070A12]" />}>
            Enter LexAI Assistant
          </Button>
        </div>

      </div>
    </section>
  );
};
