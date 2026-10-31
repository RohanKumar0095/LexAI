import React from 'react';
import { Scale, ShieldCheck, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CelestialBackground } from './CelestialBackground';
import { LEXAI_LOGO_URL } from '../../constants/brand';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  badgeText?: string;
  badgeVariant?: 'primary' | 'saffron' | 'electric' | 'emerald' | 'glass';
  cardWidth?: string;
}

const LOGO_ASSET_URL = LEXAI_LOGO_URL; 

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  badgeText,
  cardWidth = "max-w-[440px]",
}) => {
  return (
    <div className="relative min-h-screen text-[#F7F4FC] flex flex-col justify-between selection:bg-[#7C22E8]/40 selection:text-white overflow-x-hidden font-sans">
      
      {/* Monty Hayton Inspired Luminous Purple Celestial Planetary Sphere Background */}
      <CelestialBackground />

      {/* Top Header / Branding Nav */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 cursor-pointer group select-none">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-[#A855F7]/30 shadow-md shadow-purple-950/40 group-hover:border-[#C084FC]/60 transition-all duration-300">
            <img 
              src={LOGO_ASSET_URL} 
              alt="LexAI-India Logo" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#7C3AED] via-[#A855F7] to-[#C084FC] flex items-center justify-center">
              <Scale className="w-4.5 h-4.5 text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-lg tracking-tight text-white group-hover:text-[#C084FC] transition-colors">
                LEXAI<span className="text-[#A855F7]">-INDIA</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-[#A855F7]/15 text-[#C084FC] border border-[#A855F7]/30">
                India 🇮🇳
              </span>
            </div>
            <span className="text-[10px] text-[#B8AEC9] block font-normal tracking-wide">Your Personal Legal Assistant</span>
          </div>
        </Link>

        <Link 
          to="/" 
          className="text-xs font-medium text-[#B8AEC9] hover:text-[#FAF8FF] transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
        >
          ← Back to Home
        </Link>
      </header>

      {/* Main Content Area — Center-stage Monty Hayton Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div 
          className={`w-full ${cardWidth} rounded-2xl p-7 sm:p-9 border transition-all duration-300 shadow-2xl relative`}
          style={{
            backgroundColor: 'rgba(15, 12, 24, 0.88)',
            borderColor: 'rgba(192, 132, 252, 0.18)',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.85), 0 0 35px -5px rgba(168, 85, 247, 0.15)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          {/* Subtle perimeter reflection highlight on card header */}
          <div 
            className="absolute top-0 left-8 right-8 h-[1px] opacity-40"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(232, 121, 249, 0.6), transparent)'
            }}
          />

          {/* Optional Eyebrow Badge */}
          {badgeText && (
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full bg-[#A855F7]/15 text-[#C084FC] border border-[#A855F7]/25">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{badgeText}</span>
              </span>
            </div>
          )}

          {/* Card Header inspired by Monty Hayton */}
          <div className="space-y-1.5 mb-6 text-left">
            <h1 className="text-2xl sm:text-[26px] font-bold font-display text-[#F7F4FC] tracking-tight leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-[#B8AEC9] leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Render Page Children */}
          {children}

          {/* Privacy & Legal Compliance Footer */}
          <div className="border-t border-[#30243F]/60 mt-6 pt-4 space-y-1.5">
            <p className="text-[10px] text-[#B8AEC9] text-center flex items-center justify-center gap-1.5 font-medium">
              <Lock className="w-3 h-3 text-[#C084FC]" />
              <span>DPDP Act 2023 Compliant • 256-bit Encrypted</span>
            </p>
            <p className="text-[9px] text-[#B8AEC9]/70 text-center leading-normal max-w-xs mx-auto">
              LexAI-India is a legal awareness and education platform. It does not provide formal court advocacy or attorney-client privilege.
            </p>
          </div>
        </div>
      </main>

      {/* Mini Minimal Footer */}
      <footer className="relative z-10 w-full py-4 text-center border-t border-[#30243F]/40 bg-[#08070D]/75 backdrop-blur-md">
        <p className="text-[10px] text-[#B8AEC9] tracking-wide">
          © {new Date().getFullYear()} LexAI-India Platform. Built for Indian citizens.
        </p>
      </footer>
    </div>
  );
};
export default AuthLayout;