import React from 'react';
import { 
  MessageSquare, 
  ShieldCheck, 
  Compass, 
  MapPin, 
  AlertTriangle, 
  FileText, 
  Edit3, 
  BookOpen, 
  Bookmark, 
  Globe, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { GradientText } from '../ui/GradientText';

export interface FeaturesSectionProps {
  onEnterApp: () => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onEnterApp }) => {
  const currentFeatures = [
    {
      icon: <MessageSquare className="w-5 h-5 text-indigo-400" />,
      title: "AI Chat Assistant",
      desc: "Conversational legal assistant providing plain-language explanations cited with verified Indian statutes.",
      badge: "Core OS",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-saffron-400" />,
      title: "Fundamental Rights Checker",
      desc: "Instant breakdown of constitutionally guaranteed fundamental rights during police stops, arrests, and detention.",
      badge: "Rights Engine",
    },
    {
      icon: <Compass className="w-5 h-5 text-emerald-400" />,
      title: "Legal Scenario Simulator",
      desc: "Interactive wizard guiding you step-by-step through real-life scenarios (tenancy, traffic, workplace, consumer).",
      badge: "Interactive Wizard",
    },
    {
      icon: <Layers className="w-5 h-5 text-indigo-400" />,
      title: "Legal Step Roadmaps",
      desc: "Actionable, visual step-by-step roadmaps showing timelines and official procedures for legal actions.",
      badge: "Visual Guides",
    },
    {
      icon: <MapPin className="w-5 h-5 text-saffron-400" />,
      title: "State-wise Legal Awareness",
      desc: "Jurisdiction selector tailoring guidance based on local state rules (e.g. Maharashtra, Delhi, Karnataka, UP).",
      badge: "State Specific",
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-rose-500" />,
      title: "SOS Emergency Guidance",
      desc: "One-tap emergency rights protocol during urgent police stops, accidents, or immediate legal risk.",
      badge: "Emergency SOS",
      crimson: true,
    },
    {
      icon: <FileText className="w-5 h-5 text-emerald-400" />,
      title: "Document AI & Analysis",
      desc: "Summarize rental agreements, employment contracts, and legal notices to highlight risk clauses.",
      badge: "Contract AI",
    },
    {
      icon: <Edit3 className="w-5 h-5 text-indigo-400" />,
      title: "Official Complaint Generator",
      desc: "Draft structured formal legal complaints for Consumer Forums, RERA, Cyber Crime, or Local Authorities.",
      badge: "Drafting Engine",
    },
    {
      icon: <BookOpen className="w-5 h-5 text-saffron-400" />,
      title: "Daily Law & Literacy",
      desc: "Short, understandable daily legal insights delivered every morning. 100% free for all citizens without streaks.",
      badge: "Daily Awareness",
    },
    {
      icon: <Bookmark className="w-5 h-5 text-emerald-400" />,
      title: "Saved Chats & Bookmarks",
      desc: "Bookmark important statute explanations, save legal roadmaps, and organize chat history.",
      badge: "Vault Memory",
    },
    {
      icon: <Globe className="w-5 h-5 text-indigo-400" />,
      title: "Bilingual (English + Hindi)",
      desc: "Full bilingual user interface allowing seamless switching between English and Hindi legal explanations.",
      badge: "Dual Language",
    },
    {
      icon: <Sparkles className="w-5 h-5 text-saffron-400" />,
      title: "Connected Tool Overlays",
      desc: "Tools launch as contextual overlays inside the chat and feed execution results directly back into conversation.",
      badge: "Unified UX",
    },
  ];

  return (
    <section id="features" className="py-24 relative bg-[#070A12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="emerald" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
            Active Version 2.0 Scope
          </Badge>
          <h2 className="heading-xl text-white font-display">
            What <GradientText variant="signature">LexAI Can Do</GradientText>
          </h2>
          <p className="body-md text-slate-300">
            A comprehensive suite of conversational tools, rights guides, document analysis, and state-specific legal awareness engineered for Indian citizens.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentFeatures.map((feat, idx) => (
            <Card
              key={idx}
              variant="card"
              hoverable
              onClick={onEnterApp}
              className={`space-y-3 flex flex-col justify-between ${
                feat.crimson ? 'border-crimson-500/30 hover:border-crimson-500/60' : ''
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    {feat.icon}
                  </div>
                  <Badge variant={feat.crimson ? 'crimson' : 'glass'} className="text-[10px]">
                    {feat.badge}
                  </Badge>
                </div>
                <h3 className="font-semibold text-white text-sm">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>

              <div className="pt-2 flex items-center text-xs font-medium text-indigo-400 group-hover:text-indigo-300">
                <span>Explore Tool</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};
