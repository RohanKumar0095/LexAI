import React, { useState } from 'react';
import { Scale, Globe, Sparkles, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';


export interface HeaderProps {
  onOpenAuth: (persona?: 'citizen' | 'lawyer') => void;
  onEnterApp: () => void;
  currentLang: 'EN' | 'HI';
  onToggleLang: () => void;
  onToggleDesignSystem: () => void;
  showingDesignSystem: boolean;
}

// Logo configuration: Change this URL to import a file path when available
const LOGO_ASSET_URL = ""; 

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
    <header className="sticky top-0 z-40 w-full lexai-surface-glass border-b border-midnight-border backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Tag */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          {LOGO_ASSET_URL ? (
            <img 
              src={LOGO_ASSET_URL} 
              alt="LexAI-India Logo" 
              className="w-10 h-10 object-contain" 
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0284c7] via-[#a855f7] to-[#6366f1] flex items-center justify-center shadow-lg shadow-saffron-glow">
              <Scale className="w-5 h-5 text-white" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-xl tracking-tight text-white">LEXAI-INDIA</span>
              <Badge variant="saffron" className="hidden sm:inline-flex text-[10px]">India 🇮🇳</Badge>
            </div>
            <span className="text-[11px] text-text-muted block font-medium">Your Personal Legal Assistant</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-text-secondary">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-white hover:text-saffron transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          
          {/* Language Switcher Toggle */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-midnight-surface/80 hover:bg-midnight-border/50 border border-midnight-border text-xs font-semibold text-text-secondary transition-colors"
            title="Switch Language (English / Hindi)"
          >
            <Globe className="w-3.5 h-3.5 text-saffron" />
            <span>{currentLang}</span>
          </button>

          {/* Enter LexAI Primary CTA */}
          <Button
            variant="primary"
            size="md"
            onClick={onEnterApp}
            rightIcon={<Sparkles className="w-4 h-4 text-[#0d0f13]" />}
          >
            Enter LexAI
          </Button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-text-secondary hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden lexai-surface-modal border-t border-midnight-border px-6 py-6 space-y-4 animate-in slide-in-from-top">
          <nav className="flex flex-col gap-3 text-base font-medium">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-text-secondary hover:text-white py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-4 border-t border-midnight-border flex flex-col gap-3">
            {/* Mobile primary CTA */}
            <Button
              variant="primary"
              className="w-full"
              onClick={() => {
                onEnterApp();
                setMobileMenuOpen(false);
              }}
              rightIcon={<Sparkles className="w-4 h-4 text-[#0d0f13]" />}
            >
              Enter LexAI
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
