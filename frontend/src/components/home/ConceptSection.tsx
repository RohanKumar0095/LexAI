import React from 'react';
import { MessageSquare, ArrowRight, Layers, FileText, Compass, ShieldCheck, Sparkles } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { GradientText } from '../ui/GradientText';

export const ConceptSection: React.FC = () => {
  return (
    <section className="py-20 relative bg-[#080B14]/80 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="electric" icon={<Layers className="w-3.5 h-3.5" />}>
            UX Architectural Principle
          </Badge>
          <h2 className="heading-xl text-white font-display">
            Conversation is the <GradientText variant="signature">Operating System</GradientText>
          </h2>
          <p className="body-md text-slate-300">
            Unlike traditional administrative platforms with separate isolated dashboards, LexAI keeps conversation at the heart of the experience. Specialized tools connect directly to your active chat session.
          </p>
        </div>

        {/* Visual Concept Flow Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          
          {/* Step 1 */}
          <Card variant="glass" className="space-y-3 relative overflow-hidden border-indigo-500/30">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-300 font-bold text-xs flex items-center justify-center">1</span>
              <Badge variant="electric">Active Chat</Badge>
            </div>
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span>User Asks Question</span>
            </div>
            <p className="text-xs text-slate-400">
              "What happens if my landlord refuses to refund my security deposit in Bengaluru?"
            </p>
          </Card>

          {/* Step 2 */}
          <Card variant="elevated" className="space-y-3 relative overflow-hidden border-saffron-500/30">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-lg bg-saffron-500/20 text-[#FF9933] font-bold text-xs flex items-center justify-center">2</span>
              <Badge variant="saffron">AI Context</Badge>
            </div>
            <div className="flex items-center gap-2 text-[#FF9933] font-semibold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>LexAI Identifies Tool</span>
            </div>
            <p className="text-xs text-slate-400">
              LexAI detects the dispute and suggests launching the Tenant Rights Simulator.
            </p>
          </Card>

          {/* Step 3 */}
          <Card variant="modal" className="space-y-3 relative overflow-hidden border-emerald-500/40">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center">3</span>
              <Badge variant="emerald">Connected Overlay</Badge>
            </div>
            <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm">
              <Compass className="w-4 h-4" />
              <span>Tool Executes</span>
            </div>
            <p className="text-xs text-slate-300">
              User completes the quick 3-step Tenant Dispute wizard inside a focused modal.
            </p>
          </Card>

          {/* Step 4 */}
          <Card variant="glass" className="space-y-3 relative overflow-hidden border-indigo-500/30">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-300 font-bold text-xs flex items-center justify-center">4</span>
              <Badge variant="electric">Stream Output</Badge>
            </div>
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Returns to Chat</span>
            </div>
            <p className="text-xs text-slate-400">
              The tool output feeds directly back into the conversation with a legal roadmap and draft notice.
            </p>
          </Card>
        </div>

        {/* Footnote Bar */}
        <div className="lexai-surface-card rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300 border border-white/5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>No context lost. All tools preserve conversation history and state.</span>
          </div>
          <a href="#features" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium">
            <span>See connected tools below</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
