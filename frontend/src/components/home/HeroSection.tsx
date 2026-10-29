import React from 'react';
import { Sparkles, ShieldCheck, Globe, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';

export interface HeroSectionProps {
  onEnterApp: () => void;
  currentLang: 'EN' | 'HI';
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onEnterApp,
  currentLang,
}) => {
  return (
    <section id="hero" className="relative pt-20 pb-28 md:pt-28 md:pb-40 overflow-hidden">
      {/* Reference 1 Inspired: Luminous Violet & Purple Atmospheric Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[480px] bg-[#A855F7]/14 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 right-4 w-[420px] h-[420px] bg-[#7C3AED]/12 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-[360px] h-[360px] bg-[#C084FC]/06 rounded-full blur-[120px] pointer-events-none" />

      {/* Subtle Restrained Geometric Hex Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-hex-grid" width="60" height="104" patternUnits="userSpaceOnUse" patternTransform="scale(1)">
              <path d="M 30 0 L 60 17.32 L 60 51.96 L 30 69.28 L 0 51.96 L 0 17.32 Z" fill="none" stroke="#A855F7" strokeWidth="0.6" strokeOpacity="0.25" />
              <path d="M 30 104 L 60 86.68 L 60 52.04 L 30 69.36 L 0 52.04 L 0 86.68 Z" fill="none" stroke="#A855F7" strokeWidth="0.6" strokeOpacity="0.25" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-hex-grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
          
          {/* Loopy Inspired Eyebrow Badge Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#151020]/90 border border-[#C084FC]/25 shadow-lg shadow-purple-950/40 backdrop-blur-md animate-in fade-in duration-500">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C084FC] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A855F7]"></span>
            </span>
            <span className="text-xs font-semibold text-[#D8B4FE] tracking-tight">
              {currentLang === 'EN' ? 'Next-Gen Legal AI Platform • India 🇮🇳' : 'अगली पीढ़ी का कानूनी एआई मंच • भारत 🇮🇳'}
            </span>
            <span className="text-[#30243F]">|</span>
            <span className="text-[11px] font-medium text-[#AAA1BC]">
              {currentLang === 'EN' ? 'Statutes Verified' : 'सत्यापित अधिनियम'}
            </span>
          </div>

          {/* Reference 2 (Loopy) Typography: Bold, Confident, Clean Sans-serif Heading */}
          <div className="space-y-6">
            <h1 className="display-xl text-white font-display tracking-tight leading-[1.06]">
              {currentLang === 'EN' ? (
                <>
                  Democratizing Indian Law <br />
                  <span className="lexai-signature-gradient">Through Intelligent AI</span>
                </>
              ) : (
                <>
                  भारतीय कानून का लोकतंत्रीकरण <br />
                  <span className="lexai-signature-gradient">बुद्धिमान एआई के माध्यम से</span>
                </>
              )}
            </h1>

            {/* Controlled Line Length Body Paragraph with Loopy Spacing */}
            <p className="body-lg text-[#AAA1BC] max-w-2xl mx-auto leading-relaxed font-normal">
              {currentLang === 'EN' 
                ? 'An AI-first legal awareness and conversational intelligence platform engineered specifically for Indian citizens. Understand your rights, verify statutory citations, and navigate complex legal scenarios in plain language.'
                : 'भारतीय नागरिकों के लिए विशेष रूप से तैयार एक एआई-प्रथम कानूनी जागरूकता मंच। अपने अधिकारों को समझें, अधिनियमों की पुष्टि करें और जटिल कानूनी प्रक्रियाओं को सरल भाषा में हल करें।'}
            </p>
          </div>

          {/* Loopy Inspired High-Contrast Buttons System */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              onClick={onEnterApp}
              className="w-full sm:w-auto min-w-[220px] text-[15px] font-semibold shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
              rightIcon={<Sparkles className="w-5 h-5 text-white" />}
            >
              {currentLang === 'EN' ? 'Enter LexAI' : 'लेक्सएआई प्रारंभ करें'}
            </Button>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-[#C084FC]/25 bg-[#151020]/90 hover:bg-[#1C1530] hover:border-[#C084FC]/50 text-[#FAF8FF] text-[15px] font-medium transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-black/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{currentLang === 'EN' ? 'Explore How it Works' : 'कार्यप्रणाली देखें'}</span>
              <ArrowRight className="w-4 h-4 text-[#C084FC]" />
            </a>
          </div>

          {/* Trust Telemetry Proof Points */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-[#AAA1BC]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#C084FC]" />
              <span>100% Free Daily Law</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#C084FC]" />
              <span>Verified Indian Acts & BNS</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#C084FC]" />
              <span>No Account Needed to Explore</span>
            </div>
          </div>

          {/* 4 Core Pillars Grid — Loopy Dark Cards with Subtle Glowing Borders */}
          <div className="pt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full text-left">
            
            <div className="bg-[#151020] rounded-2xl p-5 border border-[#C084FC]/15 hover:border-[#A855F7]/50 hover:bg-[#1C1530] transition-all duration-300 hover:-translate-y-1 group shadow-lg shadow-black/50">
              <div className="flex items-center gap-3 text-[#C084FC] font-semibold text-xs mb-2">
                <div className="w-9 h-9 rounded-xl bg-[#A855F7]/10 flex items-center justify-center border border-[#A855F7]/25 group-hover:border-[#C084FC]/40 transition-colors">
                  <ShieldCheck className="w-4 h-4 text-[#C084FC]" />
                </div>
                <span className="text-white font-medium text-sm">Rights Protection</span>
              </div>
              <p className="text-xs text-[#AAA1BC] leading-relaxed">Police stops, traffic rules, tenant protections & consumer rights breakdown</p>
            </div>

            <div className="bg-[#151020] rounded-2xl p-5 border border-[#C084FC]/15 hover:border-[#A855F7]/50 hover:bg-[#1C1530] transition-all duration-300 hover:-translate-y-1 group shadow-lg shadow-black/50">
              <div className="flex items-center gap-3 text-[#C084FC] font-semibold text-xs mb-2">
                <div className="w-9 h-9 rounded-xl bg-[#A855F7]/10 flex items-center justify-center border border-[#A855F7]/25 group-hover:border-[#C084FC]/40 transition-colors">
                  <Sparkles className="w-4 h-4 text-[#C084FC]" />
                </div>
                <span className="text-white font-medium text-sm">Conversation OS</span>
              </div>
              <p className="text-xs text-[#AAA1BC] leading-relaxed">Specialized legal tools feed analysis and results directly back into active chat</p>
            </div>

            <div className="bg-[#151020] rounded-2xl p-5 border border-[#C084FC]/15 hover:border-[#A855F7]/50 hover:bg-[#1C1530] transition-all duration-300 hover:-translate-y-1 group shadow-lg shadow-black/50">
              <div className="flex items-center gap-3 text-[#C084FC] font-semibold text-xs mb-2">
                <div className="w-9 h-9 rounded-xl bg-[#A855F7]/10 flex items-center justify-center border border-[#A855F7]/25 group-hover:border-[#C084FC]/40 transition-colors">
                  <Globe className="w-4 h-4 text-[#C084FC]" />
                </div>
                <span className="text-white font-medium text-sm">Bilingual Engine</span>
              </div>
              <p className="text-xs text-[#AAA1BC] leading-relaxed">English and Hindi legal explanations with authentic statutory citations</p>
            </div>

            <div className="bg-[#151020] rounded-2xl p-5 border border-[#C084FC]/15 hover:border-[#A855F7]/50 hover:bg-[#1C1530] transition-all duration-300 hover:-translate-y-1 group shadow-lg shadow-black/50">
              <div className="flex items-center gap-3 text-[#C084FC] font-semibold text-xs mb-2">
                <div className="w-9 h-9 rounded-xl bg-[#A855F7]/10 flex items-center justify-center border border-[#A855F7]/25 group-hover:border-[#C084FC]/40 transition-colors">
                  <BookOpen className="w-4 h-4 text-[#C084FC]" />
                </div>
                <span className="text-white font-medium text-sm">Daily Law Literacy</span>
              </div>
              <p className="text-xs text-[#AAA1BC] leading-relaxed">Free daily byte-sized legal awareness for citizens with zero forced streaks</p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
export default HeroSection;