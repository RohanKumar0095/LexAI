import React from 'react';
import { Sparkles, ShieldCheck, Scale, Globe, BookOpen } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { GradientText } from '../ui/GradientText';
import { StatusIndicator } from '../ui/StatusIndicator';

export interface HeroSectionProps {
  onEnterApp: () => void;
  currentLang: 'EN' | 'HI';
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onEnterApp,
  currentLang,
}) => {
  return (
    <section id="hero" className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden">
      {/* Ambient background glows - Aligned with sky blue / purple */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-saffron-glow rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-electric-glow rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-emerald-500/05 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          
          {/* Top Pill Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Badge variant="saffron" icon={<Scale className="w-3.5 h-3.5" />} pulse>
              {currentLang === 'EN' ? 'India-First Legal Awareness Platform' : 'भारत-प्रथम कानूनी जागरूकता मंच'}
            </Badge>
            <StatusIndicator type="verified" label={currentLang === 'EN' ? 'Statutes Verified' : 'सत्यापित अधिनियम'} />
            <StatusIndicator type="ai-active" label="Agentic Ready" />
          </div>

          {/* Main Hero Heading */}
          <div className="space-y-4">
            <h1 className="display-xl text-white font-display tracking-tight leading-[1.08]">
              {currentLang === 'EN' ? (
                <>
                  LexAI-India <br />
                  <GradientText variant="saffron">Your Personal Legal Assistant</GradientText>
                </>
              ) : (
                <>
                  लेक्सएआई-इंडिया <br />
                  <GradientText variant="saffron">आपका व्यक्तिगत कानूनी सहायक</GradientText>
                </>
              )}
            </h1>

            <p className="body-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
              {currentLang === 'EN' 
                ? 'An AI-first legal awareness platform engineered specifically for Indian citizens. Understand your rights, check applicable statutes, and navigate legal processes with plain-language intelligence.'
                : 'भारतीय नागरिकों के लिए विशेष रूप से इंजीनियर एक एआई-प्रथम कानूनी जागरूकता मंच। अपने अधिकारों को समझें और सरल भाषा में सहायता प्राप्त करें।'}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              onClick={onEnterApp}
              className="w-full sm:w-auto min-w-[240px] text-base"
              rightIcon={<Sparkles className="w-5 h-5 text-[#0D0F13]" />}
            >
              {currentLang === 'EN' ? 'Enter LexAI' : 'लेक्सएआई प्रारंभ करें'}
            </Button>
          </div>

          {/* Core Feature Highlights Pills */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full text-left">
            <div className="lexai-surface-card rounded-xl p-4 border border-midnight-border space-y-1">
              <div className="flex items-center gap-2 text-saffron font-semibold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Rights Protection</span>
              </div>
              <p className="text-[11px] text-text-muted">Police stop, traffic, tenant & consumer rights</p>
            </div>

            <div className="lexai-surface-card rounded-xl p-4 border border-midnight-border space-y-1">
              <div className="flex items-center gap-2 text-electric font-semibold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>Conversation as OS</span>
              </div>
              <p className="text-[11px] text-text-muted">Tools feed results directly back into chat</p>
            </div>

            <div className="lexai-surface-card rounded-xl p-4 border border-midnight-border space-y-1">
              <div className="flex items-center gap-2 text-emerald-500 font-semibold text-xs">
                <Globe className="w-4 h-4" />
                <span>Bilingual (EN + HI)</span>
              </div>
              <p className="text-[11px] text-text-muted">English and Hindi legal explanations</p>
            </div>

            <div className="lexai-surface-card rounded-xl p-4 border border-midnight-border space-y-1">
              <div className="flex items-center gap-2 text-saffron font-semibold text-xs">
                <BookOpen className="w-4 h-4" />
                <span>State Laws</span>
              </div>
              <p className="text-[11px] text-text-muted">Location & state-specific legal awareness</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
