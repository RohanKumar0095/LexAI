import React from 'react';
import { Flame, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';

export const LearningProgressionSection: React.FC = () => {
  const milestones = [
    { day: "7 Days", title: "Rights Explorer", reward: "+100 XP & Fundamental Rights Badge", active: true },
    { day: "14 Days", title: "Citizen Scholar", reward: "Unlock State Laws Guide", active: true },
    { day: "21 Days", title: "Legal Guardian", reward: "Unlock Contract Risk Checklist", active: true },
    { day: "30 Days", title: "LexAI Vault Unlock", reward: "Access Curated Legal Vault Guides", active: true, hero: true },
  ];

  return (
    <section className="py-24 relative bg-[#0D0918]/95 border-t border-[#C084FC]/15">
      {/* Background illumination */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[500px] h-[300px] bg-[#A855F7]/07 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Header — Loopy SaaS Hierarchy */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="caption-text text-[#C084FC] inline-block font-semibold tracking-wider">
            Ethical Learning Paradigm
          </span>
          <h2 className="heading-xl text-white font-display">
            Legal Literacy for Everyone — <span className="lexai-signature-gradient">Zero Coercive Streaks</span>
          </h2>
          <p className="body-md text-[#AAA1BC] max-w-2xl mx-auto leading-relaxed">
            At LexAI, legal literacy is a fundamental right. Daily Law snippets remain 100% free forever for every Indian citizen without paywalls or punitive streak loss.
          </p>
        </div>

        {/* Core Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="elevated" className="space-y-4 border-[#C084FC]/15 bg-[#151020] p-6 rounded-2xl shadow-lg shadow-black/50 hover:border-[#A855F7]/40 hover:bg-[#1C1530] transition-all">
            <div className="flex items-center gap-3 text-[#C084FC] font-semibold text-sm">
              <div className="w-9 h-9 rounded-xl bg-[#A855F7]/10 flex items-center justify-center border border-[#A855F7]/25">
                <ShieldCheck className="w-4 h-4 text-[#C084FC]" />
              </div>
              <span className="text-white font-medium text-base">100% Free Daily Legal Awareness</span>
            </div>
            <p className="text-xs text-[#AAA1BC] leading-relaxed">
              Every citizen receives short, understandable daily legal insights every morning. It never requires a paid subscription or forced streak maintenance to read.
            </p>
            <div className="pt-2 text-xs text-[#D8B4FE] font-medium bg-[#A855F7]/10 p-3.5 rounded-xl border border-[#A855F7]/20">
              "Did you know? Under CrPC Section 50, police must immediately inform an arrested person of the full particulars of the offence."
            </div>
          </Card>

          <Card variant="elevated" className="space-y-4 border-[#C084FC]/15 bg-[#151020] p-6 rounded-2xl shadow-lg shadow-black/50 hover:border-[#A855F7]/40 hover:bg-[#1C1530] transition-all">
            <div className="flex items-center gap-3 text-[#C084FC] font-semibold text-sm">
              <div className="w-9 h-9 rounded-xl bg-[#A855F7]/10 flex items-center justify-center border border-[#A855F7]/25">
                <Flame className="w-4 h-4 text-[#A855F7]" />
              </div>
              <span className="text-white font-medium text-base">Optional 30-Day Legal Literacy Milestone</span>
            </div>
            <p className="text-xs text-[#AAA1BC] leading-relaxed">
              For citizens who want to dive deeper, optional daily challenges award XP, badges, and unlock the prestigious 30-Day LexAI Legal Vault.
            </p>
            <div className="pt-2 flex items-center justify-between text-xs text-[#D8B4FE] font-medium bg-[#A855F7]/10 p-3 rounded-xl border border-[#A855F7]/20">
              <span>Current Milestone: 30-Day Vault Program</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#A855F7]/20 text-[#C084FC] px-2 py-0.5 rounded-full border border-[#A855F7]/30">
                +20 XP Daily
              </span>
            </div>
          </Card>
        </div>

        {/* 30-Day Milestone Timeline */}
        <div className="space-y-6 pt-4">
          <h3 className="caption-text text-[#AAA1BC] text-center">
            30-Day Legal Literacy Progression Milestone
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-5 border space-y-3 relative overflow-hidden transition-all duration-300 shadow-lg shadow-black/50 ${
                  m.hero 
                    ? 'border-[#A855F7]/60 bg-[#1C1530] shadow-purple-950/30' 
                    : 'border-[#C084FC]/15 bg-[#151020] hover:border-[#A855F7]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#C084FC] bg-[#A855F7]/15 px-2.5 py-1 rounded-full border border-[#A855F7]/30">
                    {m.day}
                  </span>
                  {m.hero && (
                    <span className="text-[10px] uppercase tracking-wider font-semibold bg-[#A855F7] text-white px-2 py-0.5 rounded-full shadow-sm shadow-purple-500/30">
                      Vault Milestone
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="font-semibold text-sm text-white">{m.title}</h4>
                  <p className="text-xs text-[#AAA1BC] leading-relaxed">{m.reward}</p>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-[#C084FC] pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C084FC]" />
                  <span>Verified Path</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
export default LearningProgressionSection;