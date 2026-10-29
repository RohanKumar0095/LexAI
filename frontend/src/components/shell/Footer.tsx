import React from 'react';
import { Scale, Shield, Heart } from 'lucide-react';

const LOGO_ASSET_URL = "/assets/logo.jpg";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#07050D] border-t border-[#C084FC]/15 text-[#AAA1BC] pt-16 pb-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand with Logo */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-[#A855F7]/30 shadow-md shadow-purple-950/40">
                <img 
                  src={LOGO_ASSET_URL} 
                  alt="LexAI-India Logo" 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#7C3AED] via-[#A855F7] to-[#C084FC] flex items-center justify-center">
                  <Scale className="w-4 h-4 text-white" />
                </div>
              </div>
              <span className="font-display font-extrabold text-lg text-white tracking-tight">
                LEXAI<span className="text-[#A855F7]">-INDIA</span>
              </span>
            </div>
            <p className="text-xs text-[#AAA1BC] leading-relaxed">
              AI-first legal awareness and conversational intelligence platform engineered for Indian citizens. Empowering every citizen with accessible, understandable legal knowledge.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#A855F7]/15 text-[#C084FC] border border-[#A855F7]/30">
                India Jurisdiction
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#151020] text-[#AAA1BC] border border-[#30243F]">
                Version 2.0
              </span>
            </div>
          </div>

          {/* Col 2: Core Platform */}
          <div className="space-y-3">
            <h4 className="caption-text text-[#FAF8FF]">Core Features</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#features" className="hover:text-[#C084FC] transition-colors">AI Chat Assistant</a></li>
              <li><a href="#features" className="hover:text-[#C084FC] transition-colors">Rights Checker</a></li>
              <li><a href="#features" className="hover:text-[#C084FC] transition-colors">Scenario Simulator</a></li>
              <li><a href="#features" className="hover:text-[#C084FC] transition-colors">Document AI & Complaints</a></li>
              <li><a href="#features" className="hover:text-[#C084FC] transition-colors">Daily Law & Learning</a></li>
            </ul>
          </div>

          {/* Col 3: Future Vision */}
          <div className="space-y-3">
            <h4 className="caption-text text-[#FAF8FF]">Future Roadmap</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#roadmap" className="hover:text-[#C084FC] transition-colors">Agentic AI Execution</a></li>
              <li><a href="#roadmap" className="hover:text-[#C084FC] transition-colors">Lawyer Directory & Consultation</a></li>
              <li><a href="#roadmap" className="hover:text-[#C084FC] transition-colors">Voice Assistant & Regional Languages</a></li>
              <li><a href="#roadmap" className="hover:text-[#C084FC] transition-colors">Court E-filing & Status Tracking</a></li>
              <li><a href="#roadmap" className="hover:text-[#C084FC] transition-colors">Global Jurisdiction Scaling</a></li>
            </ul>
          </div>

          {/* Col 4: Important Legal Disclaimer */}
          <div className="space-y-3 bg-[#151020] p-5 rounded-2xl border border-[#C084FC]/15 shadow-lg shadow-black/50">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
              <Shield className="w-4 h-4 shrink-0" />
              <span>Legal Information Disclaimer</span>
            </div>
            <p className="text-[11px] text-[#AAA1BC] leading-relaxed">
              LexAI-India is an artificial intelligence application designed for legal literacy, awareness, and administrative guidance. It does not provide formal legal representation, attorney-client privilege, or formal legal advice. Consult a licensed Indian advocate for specific legal disputes.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#30243F]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#AAA1BC]/80">
          <div className="flex items-center gap-1.5">
            <span>Built with care for Indian citizens</span>
            <Heart className="w-3.5 h-3.5 text-[#C084FC] fill-[#C084FC]" />
            <span>in India</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="hover:text-white transition-colors cursor-pointer">DPDP Act 2023 Compliant</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
