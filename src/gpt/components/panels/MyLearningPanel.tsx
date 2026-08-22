import React from 'react';
import { Trophy, Flame, Lock, Unlock, ArrowRight, GraduationCap } from 'lucide-react';

interface MyLearningPanelProps {
  xp: number;
  onSelectPanel: (panel: string | null) => void;
}

export const MyLearningPanel: React.FC<MyLearningPanelProps> = ({ xp, onSelectPanel }) => {
  const currentLevel = Math.floor(xp / 500) + 1;
  const nextLevelXp = currentLevel * 500;
  const prevLevelXp = (currentLevel - 1) * 500;
  const progressPercent = Math.min(100, ((xp - prevLevelXp) / 500) * 100);

  const certificates = [
    {
      id: 'cert-1',
      title: 'Constitution Beginner',
      description: 'Understanding fundamental rights and duties under Part III of the Indian Constitution.',
      xpRequired: 100,
    },
    {
      id: 'cert-2',
      title: 'Digital Citizen Advocate',
      description: 'Mastery of digital privacy, cyber fraud protection, and IT Act guidelines.',
      xpRequired: 300,
    },
    {
      id: 'cert-3',
      title: 'Consumer Rights Specialist',
      description: 'Navigating consumer commission procedures and legal Notice drafting.',
      xpRequired: 600,
    }
  ];

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="space-y-5">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">
            Legal Learning Journey
          </span>
          <h3 className="text-sm font-bold text-slate-909 dark:text-white mt-1">
            My Learning Progress Dashboard
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Increase your legal literacy, complete daily quizzes, and unlock certified milestones.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 text-center">
            <Trophy className="h-4.5 w-4.5 text-brand-gold-550 mx-auto mb-1" />
            <div className="text-xs font-bold text-slate-800 dark:text-slate-100">{xp} XP</div>
            <div className="text-[9px] text-slate-450 uppercase font-semibold">Total Points</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 text-center">
            <Flame className="h-4.5 w-4.5 text-orange-500 mx-auto mb-1 animate-pulse" />
            <div className="text-xs font-bold text-slate-800 dark:text-slate-100">1 Day</div>
            <div className="text-[9px] text-slate-450 uppercase font-semibold">Active Streak</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 text-center">
            <GraduationCap className="h-4.5 w-4.5 text-indigo-500 mx-auto mb-1" />
            <div className="text-xs font-bold text-slate-800 dark:text-slate-100">Lvl {currentLevel}</div>
            <div className="text-[9px] text-slate-450 uppercase font-semibold">Citizen Rank</div>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/50 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-350">Level {currentLevel} Progress</span>
            <span className="text-slate-450 text-[10px]">{xp} / {nextLevelXp} XP</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-brand-gold-550 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center">
            Earn {nextLevelXp - xp} more XP to reach Level {currentLevel + 1}!
          </p>
        </div>

        {/* Certificate milestones */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-450 px-1">
            Milestone Certifications
          </h4>

          <div className="space-y-2.5">
            {certificates.map((cert) => {
              const isUnlocked = xp >= cert.xpRequired;
              return (
                <div 
                  key={cert.id}
                  className={`rounded-xl border p-4.5 flex gap-3.5 items-start ${
                    isUnlocked
                      ? 'border-brand-gold-550/20 bg-brand-gold-550/[0.02] dark:border-slate-800 dark:bg-slate-900/40'
                      : 'border-slate-200 bg-slate-50/50 dark:border-slate-850 dark:bg-slate-900/10'
                  }`}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 ${
                    isUnlocked 
                      ? 'bg-brand-gold-550/15 text-brand-gold-550' 
                      : 'bg-slate-200 text-slate-450 dark:bg-slate-800 dark:text-slate-655'
                  }`}>
                    {isUnlocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  </div>

                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-150 flex items-center gap-1.5 leading-none">
                      {cert.title}
                      {isUnlocked && (
                        <span className="bg-emerald-500/15 text-emerald-600 text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase">
                          Unlocked
                        </span>
                      )}
                    </h5>
                    <p className="text-[10.5px] leading-relaxed text-slate-500 dark:text-slate-450">
                      {cert.description}
                    </p>
                    <div className="text-[9px] text-slate-400 pt-1 font-semibold">
                      Requirement: {cert.xpRequired} XP
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      <div className="pt-6">
        <button
          onClick={() => onSelectPanel('daily-law')}
          className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-brand-navy-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-850 dark:bg-brand-gold-550 dark:text-slate-950 dark:hover:bg-brand-gold-400 transition-colors"
        >
          <span>Continue Learning Session</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
};
export default MyLearningPanel;
