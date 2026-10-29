import React from 'react';
import { MessageSquare, FileText, Compass, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';

export const ConceptSection: React.FC = () => {
  return (
    <section className="py-24 relative bg-[#0D0918]/95 border-y border-[#C084FC]/15">
      {/* Restrained Violet Lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[300px] bg-[#A855F7]/08 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Header — Loopy SaaS Hierarchy */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="caption-text text-[#C084FC] inline-block font-semibold tracking-wider">
            UX Architectural Principle
          </span>
          <h2 className="heading-xl text-white font-display">
            Conversation is the <span className="lexai-signature-gradient">Operating System</span>
          </h2>
          <p className="body-md text-[#AAA1BC] max-w-2xl mx-auto leading-relaxed">
            Unlike fragmented legal databases with disconnected dashboards, LexAI places intelligent dialogue at the center. Specialized tools trigger contextually and feed verified legal outcomes straight into your active conversation.
          </p>
        </div>

        {/* Visual Concept Flow Diagram with Loopy cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
          
          {/* Step 1 */}
          <Card variant="elevated" className="space-y-4 relative overflow-hidden border-[#C084FC]/15 bg-[#151020] hover:border-[#A855F7]/40 hover:bg-[#1C1530] transition-all duration-300 shadow-lg shadow-black/50 group">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-xl bg-[#A855F7]/20 text-[#C084FC] font-bold text-xs flex items-center justify-center border border-[#A855F7]/30">
                01
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#D8B4FE] bg-[#A855F7]/10 px-2 py-0.5 rounded-full border border-[#A855F7]/25">
                Active Chat
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-white font-semibold text-sm">
              <MessageSquare className="w-4 h-4 text-[#C084FC]" />
              <span>User Asks Question</span>
            </div>
            <p className="text-xs text-[#AAA1BC] leading-relaxed">
              "What happens if my landlord refuses to refund my security deposit in Bengaluru?"
            </p>
          </Card>

          {/* Step 2 */}
          <Card variant="elevated" className="space-y-4 relative overflow-hidden border-[#C084FC]/15 bg-[#151020] hover:border-[#A855F7]/40 hover:bg-[#1C1530] transition-all duration-300 shadow-lg shadow-black/50 group">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-xl bg-[#7C3AED]/20 text-[#D8B4FE] font-bold text-xs flex items-center justify-center border border-[#7C3AED]/30">
                02
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C084FC] bg-[#7C3AED]/15 px-2 py-0.5 rounded-full border border-[#C084FC]/25">
                AI Context
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-[#C084FC] font-semibold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>LexAI Identifies Tool</span>
            </div>
            <p className="text-xs text-[#AAA1BC] leading-relaxed">
              LexAI identifies the tenancy dispute and proposes launching the interactive Tenant Rights Simulator.
            </p>
          </Card>

          {/* Step 3 */}
          <Card variant="elevated" className="space-y-4 relative overflow-hidden border-[#C084FC]/15 bg-[#151020] hover:border-[#C084FC]/40 hover:bg-[#1C1530] transition-all duration-300 shadow-lg shadow-black/50 group">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-xl bg-[#A855F7]/20 text-[#C084FC] font-bold text-xs flex items-center justify-center border border-[#A855F7]/30">
                03
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#D8B4FE] bg-[#A855F7]/10 px-2 py-0.5 rounded-full border border-[#A855F7]/25">
                Connected Overlay
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-[#C084FC] font-semibold text-sm">
              <Compass className="w-4 h-4" />
              <span>Tool Executes</span>
            </div>
            <p className="text-xs text-[#AAA1BC] leading-relaxed">
              User steps through a structured 3-part dispute checklist inside a focused overlay modal.
            </p>
          </Card>

          {/* Step 4 */}
          <Card variant="elevated" className="space-y-4 relative overflow-hidden border-[#C084FC]/15 bg-[#151020] hover:border-[#A855F7]/40 hover:bg-[#1C1530] transition-all duration-300 shadow-lg shadow-black/50 group">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-xl bg-[#A855F7]/20 text-[#C084FC] font-bold text-xs flex items-center justify-center border border-[#A855F7]/30">
                04
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C084FC] bg-[#A855F7]/10 px-2 py-0.5 rounded-full border border-[#A855F7]/25">
                Stream Output
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-white font-semibold text-sm">
              <FileText className="w-4 h-4 text-[#C084FC]" />
              <span>Citations in Conversation</span>
            </div>
            <p className="text-xs text-[#AAA1BC] leading-relaxed">
              Karnataka Rent Control Act Section 14 and custom formal legal notice format stream directly back into the chat.
            </p>
          </Card>

        </div>

        {/* Footnote Bar */}
        <div className="bg-[#151020] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF8FF] border border-[#C084FC]/15 shadow-md shadow-black/50">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#C084FC] shrink-0" />
            <span className="text-[#AAA1BC]">No context lost. All tools preserve conversation history and state.</span>
          </div>
          <a href="#features" className="text-[#C084FC] hover:text-white flex items-center gap-1 font-semibold transition-colors">
            <span>Explore tool capabilities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
};
export default ConceptSection;