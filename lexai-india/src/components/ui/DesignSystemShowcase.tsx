import React, { useState } from 'react';
import { 
  Sparkles, 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  ChevronRight,
  Palette,
  Type,
  Layers,
  MousePointer
} from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { Badge } from './Badge';
import { Card } from './Card';
import { GradientText } from './GradientText';
import { StatusIndicator } from './StatusIndicator';
import { CommandCenterInput } from './CommandCenterInput';

export const DesignSystemShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'colors' | 'surfaces' | 'typography' | 'buttons' | 'inputs'>('all');
  const [inputText, setInputText] = useState('');
  const [buttonLoading, setButtonLoading] = useState(false);

  const toggleLoading = () => {
    setButtonLoading(true);
    setTimeout(() => setButtonLoading(false), 2000);
  };

  return (
    <div className="lexai-ambient-bg lexai-grid-pattern min-h-screen text-[#F8FAFC] pb-24">
      {/* Top Banner / Internal Header */}
      <header className="sticky top-0 z-50 lexai-surface-glass border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF9933] via-[#E11D48] to-[#6366F1] flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-extrabold text-xl tracking-tight text-white">LEXAI-INDIA</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest">
                  Phase 1 Internal Foundation
                </span>
              </div>
              <p className="text-xs text-slate-400">Visual Identity, Design Tokens & Reusable UI Component Showcase</p>
            </div>
          </div>

          {/* Quick Tab Selector */}
          <div className="flex flex-wrap items-center gap-1 bg-[#070A12]/80 p-1 rounded-xl border border-slate-800 text-xs">
            {(['all', 'colors', 'surfaces', 'typography', 'buttons', 'inputs'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all font-medium ${
                  activeTab === tab 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-16">
        
        {/* Intro Hero Badge */}
        <div className="lexai-surface-glass rounded-2xl p-8 border border-indigo-500/20 relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-saffron-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <Badge variant="saffron" icon={<Sparkles className="w-3.5 h-3.5" />} pulse>
                LexAI India — Design System 1.0
              </Badge>
              <h2 className="display-lg text-white font-display">
                Legal Trust meets <GradientText variant="signature">Artificial Intelligence</GradientText>
              </h2>
              <p className="body-md text-slate-300">
                A custom Midnight Legal Indigo visual identity tailored for Indian legal awareness. Non-generic, secure, atmospheric, and highly functional.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <StatusIndicator type="verified" label="Statute Engine Ready" />
              <StatusIndicator type="ai-active" label="Agent Pipeline Enabled" />
            </div>
          </div>
        </div>

        {/* 1. COLOR SYSTEM */}
        {(activeTab === 'all' || activeTab === 'colors') && (
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <Palette className="w-6 h-6 text-[#FF9933]" />
              <h3 className="heading-xl text-white font-display">1. LexAI Color System & Design Tokens</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Midnight Base */}
              <div className="bg-[#070A12] border border-slate-800 rounded-xl p-4 space-y-3 shadow-lg">
                <div className="h-16 rounded-lg bg-[#070A12] border border-slate-700 flex items-center justify-center font-mono text-xs text-slate-300">#070A12</div>
                <div>
                  <h4 className="font-semibold text-sm text-white">Midnight Base</h4>
                  <p className="text-xs text-slate-400">Canvas & deep background foundation</p>
                </div>
              </div>

              {/* Midnight Surface */}
              <div className="bg-[#080B14] border border-slate-800 rounded-xl p-4 space-y-3 shadow-lg">
                <div className="h-16 rounded-lg bg-[#080B14] border border-slate-700 flex items-center justify-center font-mono text-xs text-slate-300">#080B14</div>
                <div>
                  <h4 className="font-semibold text-sm text-white">Midnight Surface</h4>
                  <p className="text-xs text-slate-400">Elevated container background</p>
                </div>
              </div>

              {/* Midnight Card */}
              <div className="bg-[#0B1020] border border-slate-800 rounded-xl p-4 space-y-3 shadow-lg">
                <div className="h-16 rounded-lg bg-[#0B1020] border border-slate-700 flex items-center justify-center font-mono text-xs text-slate-300">#0B1020</div>
                <div>
                  <h4 className="font-semibold text-sm text-white">Midnight Card</h4>
                  <p className="text-xs text-slate-400">Interactive card surface</p>
                </div>
              </div>

              {/* Saffron */}
              <div className="bg-[#0B1020] border border-saffron-500/30 rounded-xl p-4 space-y-3 shadow-lg shadow-saffron-500/5">
                <div className="h-16 rounded-lg bg-[#FF9933] flex items-center justify-center font-mono text-xs text-[#070A12] font-bold">#FF9933</div>
                <div>
                  <h4 className="font-semibold text-sm text-[#FF9933]">Saffron (Primary Accent)</h4>
                  <p className="text-xs text-slate-400">Legal awareness, Indian identity, CTAs</p>
                </div>
              </div>

              {/* Electric Indigo */}
              <div className="bg-[#0B1020] border border-indigo-500/30 rounded-xl p-4 space-y-3 shadow-lg shadow-indigo-500/5">
                <div className="h-16 rounded-lg bg-[#6366F1] flex items-center justify-center font-mono text-xs text-white font-bold">#6366F1</div>
                <div>
                  <h4 className="font-semibold text-sm text-[#818CF8]">Electric Indigo (AI)</h4>
                  <p className="text-xs text-slate-400">AI intelligence & interactive focus</p>
                </div>
              </div>

              {/* Emerald */}
              <div className="bg-[#0B1020] border border-emerald-500/30 rounded-xl p-4 space-y-3 shadow-lg">
                <div className="h-16 rounded-lg bg-[#10B981] flex items-center justify-center font-mono text-xs text-[#070A12] font-bold">#10B981</div>
                <div>
                  <h4 className="font-semibold text-sm text-[#34D399]">Emerald (Trust / Verified)</h4>
                  <p className="text-xs text-slate-400">Verified legal sources & safe states</p>
                </div>
              </div>

              {/* Crimson */}
              <div className="bg-[#0B1020] border border-crimson-500/30 rounded-xl p-4 space-y-3 shadow-lg">
                <div className="h-16 rounded-lg bg-[#E11D48] flex items-center justify-center font-mono text-xs text-white font-bold">#E11D48</div>
                <div>
                  <h4 className="font-semibold text-sm text-[#F43F5E]">Crimson (SOS / Urgent)</h4>
                  <p className="text-xs text-slate-400">Emergency guidance & critical alerts</p>
                </div>
              </div>
            </div>

            {/* Signature LexAI Gradient */}
            <div className="p-6 rounded-2xl bg-[#080B14] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-display font-semibold text-white">Signature LexAI Gradient Accent</h4>
                  <p className="text-xs text-slate-400">Saffron → Crimson → Electric Indigo → Deep Indigo</p>
                </div>
                <Badge variant="glass">Rare Brand Highlight</Badge>
              </div>

              <div className="h-12 rounded-xl lexai-signature-gradient flex items-center justify-center font-semibold text-white shadow-xl text-sm tracking-wide">
                LexAI Signature Accent Gradient
              </div>
            </div>
          </section>
        )}

        {/* 2. SURFACE SYSTEM */}
        {(activeTab === 'all' || activeTab === 'surfaces') && (
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <Layers className="w-6 h-6 text-[#6366F1]" />
              <h3 className="heading-xl text-white font-display">2. LexAI Surface & Elevation System</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Glass Surface */}
              <Card variant="glass" className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-indigo-400">Glass Surface</span>
                  <Badge variant="glass">Blur 16px</Badge>
                </div>
                <h4 className="font-semibold text-white">LexAI Glass Surface</h4>
                <p className="text-xs text-slate-300">
                  Utilizes subtle transparency (`rgba(8,11,20,0.75)`), backdrop blur, and fine 1px light border. Ideal for floating bars and headers.
                </p>
              </Card>

              {/* Elevated Surface */}
              <Card variant="elevated" className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-slate-400">Elevated Surface</span>
                  <Badge variant="neutral">Solid #0B1020</Badge>
                </div>
                <h4 className="font-semibold text-white">LexAI Elevated Surface</h4>
                <p className="text-xs text-slate-400">
                  Solid elevated container `#0B1020` with soft deep shadow. Used for major tool containers and sidebar panels.
                </p>
              </Card>

              {/* Interactive Card */}
              <Card variant="card" hoverable className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-saffron-400">Interactive Card</span>
                  <Badge variant="saffron">Hover Glow</Badge>
                </div>
                <h4 className="font-semibold text-white">LexAI Interactive Card</h4>
                <p className="text-xs text-slate-400">
                  Features hover translation, border highlight (`indigo-500/35`), and subtle lighting lift on cursor hover.
                </p>
              </Card>

              {/* Modal Surface */}
              <Card variant="modal" className="space-y-3 md:col-span-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-emerald-400">Modal Overlay Surface</span>
                  <Badge variant="emerald">24px Blur + Deep Shadow</Badge>
                </div>
                <h4 className="font-semibold text-white">LexAI Modal Surface</h4>
                <p className="text-xs text-slate-300">
                  Heavy backdrop blur (`24px`), custom Indigo border aura, and maximum contrast for legal overlays, simulator popovers, and dialogs.
                </p>
              </Card>
            </div>
          </section>
        )}

        {/* 3. TYPOGRAPHY SYSTEM */}
        {(activeTab === 'all' || activeTab === 'typography') && (
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <Type className="w-6 h-6 text-[#10B981]" />
              <h3 className="heading-xl text-white font-display">3. Typography Hierarchy & Hindi Support</h3>
            </div>

            <div className="lexai-surface-elevated rounded-2xl p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-mono text-slate-400">Display XL — Outfit / Plus Jakarta Sans (56px / 800)</span>
                  <h2 className="display-xl text-white">Protecting Citizen Rights</h2>
                </div>

                <div>
                  <span className="text-xs font-mono text-slate-400">Display LG — Outfit / Plus Jakarta Sans (44px / 700)</span>
                  <h3 className="display-lg text-white">Your Personal Legal Assistant</h3>
                </div>

                <div>
                  <span className="text-xs font-mono text-slate-400">Heading XL — (32px / 700)</span>
                  <h4 className="heading-xl text-white">India-First Legal Awareness Engine</h4>
                </div>

                <div>
                  <span className="text-xs font-mono text-slate-400">Heading LG — (24px / 600)</span>
                  <h5 className="heading-lg text-white">Know your rights before you need them</h5>
                </div>

                <div>
                  <span className="text-xs font-mono text-slate-400">Body LG — Inter (18px / 400)</span>
                  <p className="body-lg text-slate-200">
                    LexAI-India provides instant, jurisdiction-aware guidance across fundamental rights, police stops, consumer rights, and legal procedures.
                  </p>
                </div>

                <div>
                  <span className="text-xs font-mono text-slate-400">Hindi / Devanagari — Noto Sans Devanagari</span>
                  <p className="text-xl hindi-text text-[#FF9933] font-medium leading-relaxed">
                    लेक्सएआई-इंडिया: आपका व्यक्तिगत कानूनी सहायक। कानून की शक्ति, हर नागरिक के साथ।
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 4. BUTTON SYSTEM */}
        {(activeTab === 'all' || activeTab === 'buttons') && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <MousePointer className="w-6 h-6 text-[#FF9933]" />
                <h3 className="heading-xl text-white font-display">4. Reusable Button System</h3>
              </div>
              <Button size="sm" variant="ghost" onClick={toggleLoading}>
                Trigger Loading State
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* Primary Saffron Button */}
              <div className="lexai-surface-card rounded-xl p-4 space-y-3">
                <span className="text-xs font-mono text-slate-400">Primary (Saffron)</span>
                <div>
                  <Button variant="primary" className="w-full" isLoading={buttonLoading}>
                    Primary Action
                  </Button>
                </div>
                <p className="text-xs text-slate-400">Main call-to-actions & primary steps</p>
              </div>

              {/* AI Electric Button */}
              <div className="lexai-surface-card rounded-xl p-4 space-y-3">
                <span className="text-xs font-mono text-slate-400">AI Button (Electric Indigo)</span>
                <div>
                  <Button variant="ai" className="w-full" leftIcon={<Sparkles className="w-4 h-4" />} isLoading={buttonLoading}>
                    Ask LexAI Assistant
                  </Button>
                </div>
                <p className="text-xs text-slate-400">AI generation & prompt triggers</p>
              </div>

              {/* Secondary Button */}
              <div className="lexai-surface-card rounded-xl p-4 space-y-3">
                <span className="text-xs font-mono text-slate-400">Secondary (Glass Surface)</span>
                <div>
                  <Button variant="secondary" className="w-full" isLoading={buttonLoading}>
                    Secondary Option
                  </Button>
                </div>
                <p className="text-xs text-slate-400">Supporting actions & dialog cancels</p>
              </div>

              {/* Success Emerald Button */}
              <div className="lexai-surface-card rounded-xl p-4 space-y-3">
                <span className="text-xs font-mono text-slate-400">Success (Verified Emerald)</span>
                <div>
                  <Button variant="success" className="w-full" leftIcon={<CheckCircle2 className="w-4 h-4" />} isLoading={buttonLoading}>
                    Confirm Legal Right
                  </Button>
                </div>
                <p className="text-xs text-slate-400">Verified actions & confirmations</p>
              </div>

              {/* Danger Crimson Button */}
              <div className="lexai-surface-card rounded-xl p-4 space-y-3">
                <span className="text-xs font-mono text-slate-400">Danger / Urgent (Crimson)</span>
                <div>
                  <Button variant="danger" className="w-full" leftIcon={<AlertTriangle className="w-4 h-4" />} isLoading={buttonLoading}>
                    SOS Emergency Assistance
                  </Button>
                </div>
                <p className="text-xs text-slate-400">Urgent legal SOS & warnings</p>
              </div>

              {/* Ghost Button */}
              <div className="lexai-surface-card rounded-xl p-4 space-y-3">
                <span className="text-xs font-mono text-slate-400">Ghost Variant</span>
                <div>
                  <Button variant="ghost" className="w-full" rightIcon={<ChevronRight className="w-4 h-4" />}>
                    Learn More Details
                  </Button>
                </div>
                <p className="text-xs text-slate-400">Subtle inline links & navigation</p>
              </div>
            </div>
          </section>
        )}

        {/* 5. INPUT & COMMAND CENTER SYSTEM */}
        {(activeTab === 'all' || activeTab === 'inputs') && (
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <Search className="w-6 h-6 text-[#6366F1]" />
              <h3 className="heading-xl text-white font-display">5. Input System & Chat Command Center Preview</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Default Input */}
              <div className="lexai-surface-elevated rounded-2xl p-6 space-y-4">
                <h4 className="font-semibold text-white">Standard Form Input Fields</h4>
                <Input
                  label="Search Statutes or IPC Sections"
                  placeholder="e.g. IPC Section 354 or Motor Vehicles Act"
                  leftIcon={<Search className="w-4 h-4" />}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  helperText="Search officially verified legal codes"
                />

                <Input
                  label="Input with Error State"
                  placeholder="Enter invalid state code"
                  errorText="Invalid state jurisdiction selected. Please choose a valid Indian state."
                  defaultValue="XYZ Region"
                />

                <Input
                  label="Input with Success State"
                  placeholder="State selected"
                  successText="Verified: Maharashtra State Laws Loaded"
                  defaultValue="Maharashtra"
                />
              </div>

              {/* Future Chat Command Center Preview */}
              <div className="lexai-surface-elevated rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-white">Chat Command Center Input</h4>
                  <Badge variant="electric">Primary App Surface</Badge>
                </div>
                <p className="text-xs text-slate-400">
                  The central interactive entry point of LexAI-India. Engineered with Electric Indigo focus glow & quick Legal Prompt triggers.
                </p>

                <CommandCenterInput
                  onSend={(val) => alert(`Command Center Prompt Triggered: "${val}"`)}
                />
              </div>
            </div>
          </section>
        )}

      </main>
    </div>
  );
};
