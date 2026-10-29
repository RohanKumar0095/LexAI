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

export interface FeaturesSectionProps {
  onEnterApp: () => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onEnterApp }) => {
  const currentFeatures = [
    {
      icon: <MessageSquare className="w-5 h-5 text-[#C084FC]" />,
      title: "AI Chat Assistant",
      desc: "Conversational legal assistant providing plain-language explanations cited with verified Indian statutes.",
      badge: "Core OS",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#C084FC]" />,
      title: "Fundamental Rights Checker",
      desc: "Instant breakdown of constitutionally guaranteed fundamental rights during police stops, arrests, and detention.",
      badge: "Rights Engine",
    },
    {
      icon: <Compass className="w-5 h-5 text-[#C084FC]" />,
      title: "Legal Scenario Simulator",
      desc: "Interactive wizard guiding you step-by-step through real-life scenarios (tenancy, traffic, workplace, consumer).",
      badge: "Interactive Wizard",
    },
    {
      icon: <Layers className="w-5 h-5 text-[#C084FC]" />,
      title: "Legal Step Roadmaps",
      desc: "Actionable, visual step-by-step roadmaps showing timelines and official procedures for legal actions.",
      badge: "Visual Guides",
    },
    {
      icon: <MapPin className="w-5 h-5 text-[#C084FC]" />,
      title: "State-wise Legal Awareness",
      desc: "Jurisdiction selector tailoring guidance based on local state rules (e.g. Maharashtra, Delhi, Karnataka, UP).",
      badge: "State Specific",
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-[#EF4444]" />,
      title: "SOS Emergency Guidance",
      desc: "One-tap emergency rights protocol during urgent police stops, accidents, or immediate legal risk.",
      badge: "Emergency SOS",
      crimson: true,
    },
    {
      icon: <FileText className="w-5 h-5 text-[#C084FC]" />,
      title: "Document AI & Analysis",
      desc: "Summarize rental agreements, employment contracts, and legal notices to highlight risk clauses.",
      badge: "Contract AI",
    },
    {
      icon: <Edit3 className="w-5 h-5 text-[#C084FC]" />,
      title: "Official Complaint Generator",
      desc: "Draft structured formal legal complaints for Consumer Forums, RERA, Cyber Crime, or Local Authorities.",
      badge: "Drafting Engine",
    },
    {
      icon: <BookOpen className="w-5 h-5 text-[#C084FC]" />,
      title: "Daily Law & Literacy",
      desc: "Short, understandable daily legal insights delivered every morning. 100% free for all citizens without streaks.",
      badge: "Daily Awareness",
    },
    {
      icon: <Bookmark className="w-5 h-5 text-[#C084FC]" />,
      title: "Saved Chats & Bookmarks",
      desc: "Bookmark important statute explanations, save legal roadmaps, and organize chat history.",
      badge: "Vault Memory",
    },
    {
      icon: <Globe className="w-5 h-5 text-[#C084FC]" />,
      title: "Bilingual (English + Hindi)",
      desc: "Full bilingual user interface allowing seamless switching between English and Hindi legal explanations.",
      badge: "Dual Language",
    },
    {
      icon: <Sparkles className="w-5 h-5 text-[#C084FC]" />,
      title: "Connected Tool Overlays",
      desc: "Tools launch as contextual overlays inside the chat and feed execution results directly back into conversation.",
      badge: "Unified UX",
    },
  ];

  return (
    <section id="features" className="py-24 relative bg-[#07050D]">
      {/* Background soft radial purple glow */}
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[350px] bg-[#A855F7]/08 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="caption-text text-[#C084FC] inline-block font-semibold tracking-wider">
            Comprehensive Capabilities
          </span>
          <h2 className="heading-xl text-white font-display">
            Engineered for <span className="lexai-signature-gradient">Complete Legal Empowerment</span>
          </h2>
          <p className="body-md text-[#AAA1BC] max-w-2xl mx-auto leading-relaxed">
            Every feature is architected specifically for Indian legal contexts—giving citizens instant, accurate, and actionable legal knowledge.
          </p>
        </div>

        {/* Feature Cards Grid (Loopy SaaS Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentFeatures.map((feat, idx) => (
            <Card 
              key={idx} 
              variant="elevated" 
              className={`p-6 space-y-4 rounded-2xl border transition-all duration-300 hover:-translate-y-1 group bg-[#151020] shadow-lg shadow-black/50 ${
                feat.crimson 
                  ? 'border-red-500/30 hover:border-red-500/60 hover:shadow-red-950/20' 
                  : 'border-[#C084FC]/15 hover:border-[#A855F7]/50 hover:shadow-purple-950/20 hover:bg-[#1C1530]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-colors ${
                  feat.crimson 
                    ? 'bg-red-500/10 border-red-500/25' 
                    : 'bg-[#1C1530] border-[#C084FC]/20 group-hover:border-[#C084FC]/40'
                }`}>
                  {feat.icon}
                </div>
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  feat.crimson 
                    ? 'bg-red-500/15 text-red-400 border-red-500/30' 
                    : 'bg-[#A855F7]/10 text-[#D8B4FE] border-[#A855F7]/25'
                }`}>
                  {feat.badge}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-white text-base group-hover:text-[#C084FC] transition-colors duration-200">
                  {feat.title}
                </h3>
                <p className="text-xs text-[#AAA1BC] leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom Workspace Action */}
        <div className="pt-4 flex justify-center">
          <button
            onClick={onEnterApp}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#151020] hover:bg-[#1C1530] border border-[#C084FC]/25 hover:border-[#A855F7]/50 text-sm font-medium text-[#FAF8FF] transition-all duration-300 hover:scale-[1.02] cursor-pointer group shadow-md shadow-black/50"
          >
            <span>Launch Complete Tool Suite in Workspace</span>
            <ArrowRight className="w-4 h-4 text-[#C084FC] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};
export default FeaturesSection;