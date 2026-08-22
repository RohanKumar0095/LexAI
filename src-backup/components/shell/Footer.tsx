import React from 'react';
import { Scale, Shield, Heart } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#05070E] border-t border-slate-800/80 text-slate-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF9933] via-[#E11D48] to-[#6366F1] flex items-center justify-center shadow-md">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-white">LEXAI-INDIA</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-first legal awareness and conversational assistant for Indian citizens. Empowering every citizen with accessible, understandable legal knowledge.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <Badge variant="saffron" className="text-[10px]">India Jurisdiction</Badge>
              <Badge variant="glass" className="text-[10px]">Version 2.0</Badge>
            </div>
          </div>

          {/* Col 2: Core Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Core Features</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#features" className="hover:text-white transition-colors">AI Chat Assistant</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Rights Checker</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Scenario Simulator</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Document AI & Complaints</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Daily Law & Learning</a></li>
            </ul>
          </div>

          {/* Col 3: Future Vision */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Future Roadmap</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#roadmap" className="hover:text-white transition-colors">Agentic AI Execution</a></li>
              <li><a href="#roadmap" className="hover:text-white transition-colors">Lawyer Directory & Consultation</a></li>
              <li><a href="#roadmap" className="hover:text-white transition-colors">Voice Assistant & Regional Languages</a></li>
              <li><a href="#roadmap" className="hover:text-white transition-colors">Court E-filing & Status Tracking</a></li>
              <li><a href="#roadmap" className="hover:text-white transition-colors">Global Jurisdiction Scaling</a></li>
            </ul>
          </div>

          {/* Col 4: Important Legal Disclaimer */}
          <div className="space-y-3 bg-[#080B14] p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
              <Shield className="w-4 h-4" />
              <span>Legal Information Disclaimer</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              LexAI-India is an artificial intelligence application designed for legal literacy, awareness, and administrative guidance. It does not provide formal legal representation, attorney-client privilege, or legal advice. Consult a licensed Indian advocate for specific legal disputes.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <span>Built with care for Indian citizens</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>in India</span>
          </div>

          <div className="flex items-center gap-6">
            <span>DPDP Act 2023 Compliant</span>
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
