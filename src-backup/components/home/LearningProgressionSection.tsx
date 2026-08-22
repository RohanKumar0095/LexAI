import React from 'react';
import { BookOpen, Flame, Award, Lock, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { GradientText } from '../ui/GradientText';

export const LearningProgressionSection: React.FC = () => {
  const milestones = [
    { day: "7 Days", title: "Rights Explorer", reward: "+100 XP & Fundamental Rights Badge", active: true },
    { day: "14 Days", title: "Citizen Scholar", reward: "Unlock State Laws Guide", active: true },
    { day: "21 Days", title: "Legal Guardian", reward: "Unlock Contract Risk Checklist", active: true },
    { day: "30 Days", title: "LexAI Vault Unlock", reward: "Access Curated Legal Vault Guides", active: true, hero: true },
  ];

  return (
    <section className="py-24 relative bg-[#080B14] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="saffron" icon={<BookOpen className="w-3.5 h-3.5" />}>
            Ethical & Prestigious Learning Paradigm
          </Badge>
          <h2 className="heading-xl text-white font-display">
            Legal Awareness for Everyone — <GradientText variant="saffron">No Coercive Streaks</GradientText>
          </h2>
          <p className="body-md text-slate-300">
            At LexAI, basic legal literacy is a fundamental right. Daily Law snippets remain 100% FREE for every citizen without forcing payments or streak maintenance.
          </p>
        </div>

        {/* Core Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="glass" className="space-y-3 border-emerald-500/30">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <ShieldCheck className="w-5 h-5" />
              <span>100% Free Daily Legal Awareness</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every citizen receives short, understandable daily legal insights every morning. It never requires a paid subscription or forced streak to read.
            </p>
            <div className="pt-2 text-[11px] text-emerald-300 font-medium bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-800/40">
              "Did you know? You have the right to ask why you are being detained under CrPC Section 50."
            </div>
          </Card>

          <Card variant="glass" className="space-y-3 border-saffron-500/30">
            <div className="flex items-center gap-2 text-saffron font-semibold text-sm">
              <Flame className="w-5 h-5" />
              <span>Optional 30-Day Legal Literacy Milestone</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              For citizens who want to dive deeper, optional daily challenges award XP, badges, and unlock the prestigious 30-Day LexAI Legal Vault.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] text-saffron font-medium bg-saffron/5 p-2.5 rounded-lg border border-saffron/20">
              <span>Current Milestone: 30-Day Vault Program</span>
              <Badge variant="saffron">+20 XP Daily</Badge>
            </div>
          </Card>
        </div>

        {/* 30-Day Milestone Timeline */}
        <div className="space-y-6 pt-4">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider text-center">
            30-Day Legal Literacy Progression Milestone
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className={`lexai-surface-card rounded-2xl p-5 border space-y-3 relative overflow-hidden ${
                  m.hero ? 'border-saffron-500/50 bg-saffron-950/20' : 'border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-saffron-400 bg-saffron-500/10 px-2.5 py-1 rounded-full border border-saffron-500/20">
                    {m.day}
                  </span>
                  {m.hero ? <Award className="w-5 h-5 text-saffron" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>

                <div>
                  <h4 className="font-semibold text-white text-sm">{m.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{m.reward}</p>
                </div>

                {m.hero && (
                  <div className="pt-2 text-[11px] text-saffron-300 font-medium flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Unlocks Exclusive Legal Vault</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Future Certification Notice */}
        <div className="lexai-surface-card rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 border border-slate-800">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Future Concept: Publicly Verifiable Legal Literacy Certificates and Proctored Knowledge Examinations will be introduced in V3+.</span>
          </div>
          <Badge variant="electric">V3+ Future Scope</Badge>
        </div>

      </div>
    </section>
  );
};
