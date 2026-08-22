import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Scale, LogOut, Sparkles, MessageSquare, ShieldCheck, MapPin, Globe, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LOGO_ASSET_URL = ""; 

export const WorkspacePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="lexai-ambient-bg lexai-grid-pattern min-h-screen text-[#F8FAFC] flex flex-col selection:bg-saffron-glow">
      
      {/* Workspace Header */}
      <header className="sticky top-0 z-40 w-full bg-[#15171C]/85 border-b border-midnight-border backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {LOGO_ASSET_URL ? (
              <img 
                src={LOGO_ASSET_URL} 
                alt="LexAI-India Logo" 
                className="w-9 h-9 object-contain" 
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0284c7] via-[#a855f7] to-[#6366f1] flex items-center justify-center shadow-md shadow-saffron-glow">
                <Scale className="w-4.5 h-4.5 text-white" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-base tracking-tight text-white">LEXAI-INDIA</span>
                <Badge variant="saffron" className="text-[9px] px-1 py-0.5">Workspace</Badge>
              </div>
            </div>
          </div>

          {/* User Info & Action */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col text-right text-xs">
              <span className="font-semibold text-slate-200">{user?.name}</span>
              <span className="text-[10px] text-text-secondary flex items-center justify-end gap-1">
                <MapPin className="w-3 h-3 text-saffron" />
                {user?.district ? `${user.district}, ${user.state}` : 'Location Unset'}
              </span>
            </div>
            
            <div className="h-6 w-px bg-[#2A2D34] hidden md:block" />

            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
              leftIcon={<LogOut className="w-3.5 h-3.5 text-slate-400" />}
              className="text-xs"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 flex flex-col justify-center relative z-10">
        
        {/* Glow Spheres */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-saffron-glow/40 rounded-full blur-[130px] pointer-events-none" />
        
        <Card variant="glass" className="p-8 sm:p-12 border border-midnight-border shadow-2xl space-y-8 relative overflow-hidden text-center animate-in zoom-in-95 duration-300">
          {/* Ambient glow inside container */}
          <div className="absolute -top-20 -right-20 w-44 h-44 bg-saffron-glow/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-electric-glow/10 rounded-full blur-3xl pointer-events-none" />

          {/* Icon Header */}
          <div className="relative inline-flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-midnight-base border border-midnight-border flex items-center justify-center text-slate-400">
              <MessageSquare className="w-8 h-8 opacity-40" />
            </div>
            <div className="absolute -right-2 -bottom-2 w-7 h-7 rounded-full bg-electric border border-[#15171C] flex items-center justify-center text-white animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Titles */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
              Your LexAI Workspace is Ready
            </h1>
            <p className="text-sm text-electric font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5">
              <span>AI Chat Assistant</span>
              <span className="w-1 h-1 rounded-full bg-electric" />
              <span>Coming in Phase 4</span>
            </p>
            <p className="text-xs text-text-secondary max-w-xl mx-auto leading-relaxed">
              Welcome, <strong className="text-slate-200">{user?.name}</strong>. Your account has been initialized under the jurisdiction of <strong className="text-slate-200">{user?.state}</strong>, with local guidelines configured for <strong className="text-slate-200">{user?.district} district</strong> in <strong className="text-slate-200">{user?.language === 'hi' ? 'हिन्दी (Hindi)' : 'English'}</strong>.
            </p>
          </div>

          {/* Config Detail Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <Badge variant="saffron" icon={<MapPin className="w-3.5 h-3.5" />}>
              Jurisdiction: {user?.state} ({user?.district})
            </Badge>
            <Badge variant="electric" icon={<Globe className="w-3.5 h-3.5" />}>
              Language: {user?.language === 'hi' ? 'हिन्दी' : 'English'}
            </Badge>
            <Badge variant="emerald" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
              Profile Status: Active Onboarded
            </Badge>
          </div>

          {/* Phase 4 Integration Plan Preview */}
          <div className="max-w-md mx-auto pt-6 border-t border-midnight-border text-left space-y-4">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-widest text-center">
              Phase 4 Release Schedule Highlights
            </h3>
            
            <div className="space-y-3 text-xs text-text-secondary">
              <div className="flex gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200 block">Retrieval-Augmented Generation (RAG)</span>
                  Queries will route directly to the India Central Statutes Index database.
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200 block">Scenario Simulator Interface</span>
                  Simulate interactive scenarios (e.g. landlord notices, consumer delays).
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200 block">Advocate Dashboard & Network (Future)</span>
                  Connect with licensed lawyers for complex cases.
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/')}
            >
              Return to Public Homepage
            </Button>
            
            <Button
              variant="ghost"
              size="md"
              onClick={handleLogout}
              className="text-slate-400 hover:text-white"
            >
              Sign Out
            </Button>
          </div>

        </Card>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-text-muted border-t border-midnight-border mt-auto">
        LexAI-India Workspace Sandbox. Educational Demo Version.
      </footer>
    </div>
  );
};
