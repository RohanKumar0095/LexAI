import React from 'react';
import { Scale, ShieldCheck, Lock } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  badgeText?: string;
  badgeVariant?: 'saffron' | 'electric' | 'emerald' | 'glass';
}

const LOGO_ASSET_URL = ""; 

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  badgeText = "Citizen Access Portal",
  badgeVariant = "saffron"
}) => {
  return (
    <div className="lexai-ambient-bg lexai-grid-pattern min-h-screen text-text-primary flex flex-col justify-between selection:bg-saffron-glow">
      
      {/* Mini Header / Branding */}
      <header className="max-w-7xl w-full mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 cursor-pointer">
          {LOGO_ASSET_URL ? (
            <img 
              src={LOGO_ASSET_URL} 
              alt="LexAI-India Logo" 
              className="w-9 h-9 object-contain" 
            />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0284c7] via-[#a855f7] to-[#6366f1] flex items-center justify-center shadow-lg shadow-saffron-glow">
              <Scale className="w-4.5 h-4.5 text-white" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-lg tracking-tight text-white">LEXAI-INDIA</span>
              <Badge variant="saffron" className="text-[9px] px-1.5 py-0.5">India 🇮🇳</Badge>
            </div>
            <span className="text-[10px] text-text-muted block font-medium">Your Personal Legal Assistant</span>
          </div>
        </Link>
        <Link to="/" className="text-xs font-semibold text-text-muted hover:text-white transition-colors">
          Back to Home
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        {/* Glow Spheres - Aligned with sky blue / purple */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-saffron-glow rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[250px] h-[250px] bg-electric-glow rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-lg lexai-surface-modal rounded-3xl p-6 sm:p-8 border border-midnight-border shadow-2xl relative overflow-hidden transition-all duration-300">
          
          {/* Top Badge */}
          <div className="flex items-center gap-2 mb-4">
            <Badge variant={badgeVariant} icon={<ShieldCheck className="w-3.5 h-3.5" />}>
              {badgeText}
            </Badge>
          </div>

          {/* Heading */}
          <div className="space-y-1.5 mb-6">
            <h1 className="text-2xl font-bold font-display text-white tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-text-muted leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Render Page Children */}
          {children}

          {/* Security & Disclaimer Notice */}
          <div className="border-t border-midnight-border mt-6 pt-5 space-y-2">
            <p className="text-[10px] text-text-muted text-center flex items-center justify-center gap-1.5">
              <Lock className="w-3 h-3 text-emerald-500" />
              <span>LexAI protects data under the Indian DPDP Act 2023.</span>
            </p>
            <p className="text-[9px] text-text-muted text-center leading-normal max-w-xs mx-auto">
              Disclaimer: LexAI-India is a legal awareness platform for educational demonstration purposes. It does not provide binding legal counsel or formal legal advocacy services.
            </p>
          </div>
        </div>
      </main>

      {/* Mini Footer */}
      <footer className="w-full py-4 text-center border-t border-midnight-border bg-midnight-base/40">
        <p className="text-[10px] text-text-muted">
          © {new Date().getFullYear()} LexAI-India. Engineered for Public Legal Literacy.
        </p>
      </footer>
    </div>
  );
};
