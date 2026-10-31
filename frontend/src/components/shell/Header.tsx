import React, { useState } from 'react';
import { Scale, Globe, Sparkles, Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { LEXAI_LOGO_URL } from '../../constants/brand';

export interface HeaderProps {
  onOpenAuth: (persona?: 'citizen' | 'lawyer') => void;
  onEnterApp: () => void;
  currentLang: 'EN' | 'HI';
  onToggleLang: () => void;
  onToggleDesignSystem: () => void;
  showingDesignSystem: boolean;
}

const LOGO_ASSET_URL = LEXAI_LOGO_URL; 

export const Header: React.FC<HeaderProps> = ({
  onEnterApp,
  currentLang,
  onToggleLang,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: currentLang === 'EN' ? 'Vision' : 'दृष्टिकोण', href: '#hero' },
    { label: currentLang === 'EN' ? 'Features' : 'सुविधाएं', href: '#features' },
    { label: currentLang === 'EN' ? 'How it Works' : 'कार्यप्रणाली', href: '#how-it-works' },
    { label: currentLang === 'EN' ? 'Tech Architecture' : 'तकनीक', href: '#tech-stack' },
    { label: currentLang === 'EN' ? 'Future Roadmap' : 'भविष्य', href: '#roadmap' },
    { label: currentLang === 'EN' ? 'Meet the Team' : 'टीम से मिलें', href: '#meet-the-team' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#07050D]/90 backdrop-blur-xl border-b border-[#C084FC]/15 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Title with Logo asset */}
        <div 
          className="flex items-center gap-3 cursor-pointer group select-none" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-[#A855F7]/30 shadow-md shadow-purple-950/40 group-hover:border-[#C084FC]/60 transition-all duration-300">
            <img 
              src={LOGO_ASSET_URL} 
              alt="LexAI-India Logo" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#7C3AED] via-[#A855F7] to-[#C084FC] flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-xl tracking-tight text-white group-hover:text-[#C084FC] transition-colors">
                LEXAI<span className="text-[#A855F7]">-INDIA</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#A855F7]/15 text-[#C084FC] border border-[#A855F7]/30">
                India 🇮🇳
              </span>
            </div>
            <span className="text-[11px] text-[#AAA1BC] block font-normal tracking-wide">Your Personal Legal Assistant</span>
          </div>
        </div>

        {/* Desktop Navigation Links — Loopy SaaS styling */}
        <nav className="hidden lg:flex items-center gap-8 text-[13px] font-medium tracking-tight text-[#AAA1BC]">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-white transition-colors duration-200 relative py-1 group"
            >
              <span>{link.label}</span>
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#C084FC] transition-all duration-200 group-hover:w-full rounded-full" />
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          
          {/* Language Switcher Toggle */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#151020] hover:bg-[#1C1530] border border-[#C084FC]/20 hover:border-[#A855F7]/50 text-xs font-medium text-[#FAF8FF] transition-all cursor-pointer"
            title="Switch Language (English / Hindi)"
            aria-label="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-[#C084FC]" />
            <span className="font-semibold">{currentLang}</span>
          </button>

          {/* Enter LexAI Primary CTA — Luminous Purple Loopy Button */}
          <Button
            variant="primary"
            size="md"
            onClick={onEnterApp}
            rightIcon={<Sparkles className="w-4 h-4 text-white" />}
            className="hidden sm:inline-flex shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 font-semibold tracking-tight"
          >
            <span>{currentLang === 'EN' ? 'Enter LexAI' : 'लेक्सएआई प्रारंभ करें'}</span>
          </Button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-[#AAA1BC] hover:text-white bg-[#151020] border border-[#C084FC]/20 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#C084FC]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0D0918] border-b border-[#C084FC]/20 px-4 pt-4 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-sm font-medium text-[#FAF8FF] hover:bg-[#151020] transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-2 border-t border-[#C084FC]/15 flex flex-col gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setMobileMenuOpen(false);
                onEnterApp();
              }}
              rightIcon={<ArrowRight className="w-4 h-4 text-white" />}
              className="w-full justify-center"
            >
              {currentLang === 'EN' ? 'Enter LexAI' : 'लेक्सएआई प्रारंभ करें'}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
export default Header;