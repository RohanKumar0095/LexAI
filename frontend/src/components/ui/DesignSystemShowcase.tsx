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
    <div className="lexai-ambient-bg lexai-grid-pattern min-h-screen text-[#F8F7FC] pb-24">
      {/* Top Banner / Internal Header */}
      <header className="sticky top-0 z-50 bg-[#08070D]/85 backdrop-blur-xl border-b border-[#30243F] px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] via-[#A855F7] to-[#C084FC] flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-extrabold text-xl tracking-tight text-white">LEXAI-INDIA</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#A855F7]/15 text-[#C084FC] border border-[#A855F7]/30 uppercase tracking-widest">
                  Design System 2.0
                </span>
              </div>
              <p className="text-xs text-[#AAA3BB]">Black & Luminous Purple Visual Identity & Component Registry</p>
            </div>
          </div>

          {/* Quick Tab Selector */}
          <div className="flex flex-wrap items-center gap-1 bg-[#100D18] p-1 rounded-xl border border-[#30243F] text-xs">
            {(['all', 'colors', 'surfaces', 'typography', 'buttons', 'inputs'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all font-medium cursor-pointer ${
                  activeTab === tab 
                    ? 'bg-[#A855F7] text-white shadow-md shadow-purple-500/20' 
                    : 'text-[#AAA3BB] hover:text-white hover:bg-white/5'
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
        <div className="bg-[#15111F] rounded-3xl p-8 border border-[#30243F] relative overflow-hidden shadow-2xl shadow-purple-950/20">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#A855F7]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-[#7C3AED]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <Badge variant="primary" icon={<Sparkles className="w-3.5 h-3.5" />} pulse>
                LexAI India — Visual Identity 2.0
              </Badge>
              <h2 className="display-lg text-white font-display">
                Legal Trust meets <GradientText variant="signature">Artificial Intelligence</GradientText>
              </h2>
              <p className="body-md text-[#AAA3BB]">
                A bespoke Black and Luminous Purple visual foundation engineered for Indian legal awareness. Professional, futuristic, accessible, and highly refined.
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
            <div className="flex items-center gap-3 border-b border-[#30243F] pb-3">
              <Palette className="w-6 h-6 text-[#C084FC]" />
              <h3 className="heading-xl text-white font-display">1. LexAI Color System & Design Tokens</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Background */}
              <div className="bg-[#08070D] border border-[#30243F] rounded-2xl p-4 space-y-3 shadow-lg">
                <div className="h-16 rounded-xl bg-[#08070D] border border-[#30243F] flex items-center justify-center font-mono text-xs text-[#AAA3BB]">#08070D</div>
                <div>
                  <h4 className="font-semibold text-sm text-white">Background</h4>
                  <p className="text-xs text-[#AAA3BB]">Canvas & deep base foundation</p>
                </div>
              </div>

              {/* Surface */}
              <div className="bg-[#15111F] border border-[#30243F] rounded-2xl p-4 space-y-3 shadow-lg">
                <div className="h-16 rounded-xl bg-[#15111F] border border-[#30243F] flex items-center justify-center font-mono text-xs text-[#AAA3BB]">#15111F</div>
                <div>
                  <h4 className="font-semibold text-sm text-white">Surface</h4>
                  <p className="text-xs text-[#AAA3BB]">Base container & card surface</p>
                </div>
              </div>

              {/* Surface Elevated */}
              <div className="bg-[#1C1728] border border-[#30243F] rounded-2xl p-4 space-y-3 shadow-lg">
                <div className="h-16 rounded-xl bg-[#1C1728] border border-[#30243F] flex items-center justify-center font-mono text-xs text-[#AAA3BB]">#1C1728</div>
                <div>
                  <h4 className="font-semibold text-sm text-white">Surface Elevated</h4>
                  <p className="text-xs text-[#AAA3BB]">Elevated cards & user bubbles</p>
                </div>
              </div>

              {/* Primary Purple */}
              <div className="bg-[#15111F] border border-[#A855F7]/40 rounded-2xl p-4 space-y-3 shadow-lg shadow-purple-500/10">
                <div className="h-16 rounded-xl bg-[#A855F7] flex items-center justify-center font-mono text-xs text-white font-bold">#A855F7</div>
                <div>
                  <h4 className="font-semibold text-sm text-[#C084FC]">Primary (Luminous Purple)</h4>
                  <p className="text-xs text-[#AAA3BB]">Key CTAs, active states, brand accent</p>
                </div>
              </div>

              {/* Primary Bright */}
              <div className="bg-[#15111F] border border-[#C084FC]/40 rounded-2xl p-4 space-y-3 shadow-lg">
                <div className="h-16 rounded-xl bg-[#C084FC] flex items-center justify-center font-mono text-xs text-[#08070D] font-bold">#C084FC</div>
                <div>
                  <h4 className="font-semibold text-sm text-[#D8B4FE]">Primary Bright</h4>
                  <p className="text-xs text-[#AAA3BB]">Text highlights, icons & glows</p>
                </div>
              </div>

              {/* Primary Deep */}
              <div className="bg-[#15111F] border border-[#7C3AED]/40 rounded-2xl p-4 space-y-3 shadow-lg">
                <div className="h-16 rounded-xl bg-[#7C3AED] flex items-center justify-center font-mono text-xs text-white font-bold">#7C3AED</div>
                <div>
                  <h4 className="font-semibold text-sm text-white">Primary Deep</h4>
                  <p className="text-xs text-[#AAA3BB]">Gradients & pressed interaction</p>
                </div>
              </div>

              {/* Emerald */}
              <div className="bg-[#15111F] border border-emerald-500/30 rounded-2xl p-4 space-y-3 shadow-lg">
                <div className="h-16 rounded-xl bg-[#10B981] flex items-center justify-center font-mono text-xs text-[#08070D] font-bold">#10B981</div>
                <div>
                  <h4 className="font-semibold text-sm text-[#34D399]">Emerald (Verified Trust)</h4>
                  <p className="text-xs text-[#AAA3BB]">Statutory groundings & successes</p>
                </div>
              </div>

              {/* Crimson */}
              <div className="bg-[#15111F] border border-rose-500/30 rounded-2xl p-4 space-y-3 shadow-lg">
                <div className="h-16 rounded-xl bg-[#EF4444] flex items-center justify-center font-mono text-xs text-white font-bold">#EF4444</div>
                <div>
                  <h4 className="font-semibold text-sm text-rose-400">Crimson (SOS Emergency)</h4>
                  <p className="text-xs text-[#AAA3BB]">Urgent helpline & alert warnings</p>
                </div>
              </div>
            </div>

            {/* Signature LexAI Gradient */}
            <div className="p-6 rounded-2xl bg-[#15111F] border border-[#30243F] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-display font-semibold text-white">Signature LexAI Gradient Accent</h4>
                  <p className="text-xs text-[#AAA3BB]">White → Bright Violet → Luminous Purple</p>
                </div>
                <Badge variant="primary">Brand Highlight</Badge>
              </div>

              <div className="h-12 rounded-xl bg-gradient-to-r from-white via-[#C084FC] to-[#A855F7] flex items-center justify-center font-semibold text-[#08070D] shadow-xl text-sm tracking-wide">
                LexAI Signature Accent Gradient
              </div>
            </div>
          </section>
        )}

        {/* 2. SURFACE SYSTEM */}
        {(activeTab === 'all' || activeTab === 'surfaces') && (
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-[#30243F] pb-3">
              <Layers className="w-6 h-6 text-[#C084FC]" />
              <h3 className="heading-xl text-white font-display">2. LexAI Surface & Elevation System</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Glass Surface */}
              <Card variant="glass" className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-[#C084FC]">Glass Surface</span>
                  <Badge variant="glass">Blur 16px</Badge>
                </div>
                <h4 className="font-semibold text-white">LexAI Glass Surface</h4>
                <p className="text-xs text-[#AAA3BB]">
                  Utilizes subtle transparency (`rgba(21, 17, 31, 0.8)`), backdrop blur, and fine 1px violet border. Ideal for floating bars and headers.
                </p>
              </Card>

              {/* Elevated Surface */}
              <Card variant="elevated" className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-[#AAA3BB]">Elevated Surface</span>
                  <Badge variant="neutral">Solid #1C1728</Badge>
                </div>
                <h4 className="font-semibold text-white">LexAI Elevated Surface</h4>
                <p className="text-xs text-[#AAA3BB]">
                  Solid elevated container `#1C1728` with soft deep shadow. Used for major tool containers and sidebar panels.
                </p>
              </Card>

              {/* Interactive Card */}
              <Card variant="card" hoverable className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-[#C084FC]">Interactive Card</span>
                  <Badge variant="primary">Hover Glow</Badge>
                </div>
                <h4 className="font-semibold text-white">LexAI Interactive Card</h4>
                <p className="text-xs text-[#AAA3BB]">
                  Features hover translation, border highlight (`#A855F7/50`), and subtle purple lighting lift on cursor hover.
                </p>
              </Card>

              {/* Modal Surface */}
              <Card variant="modal" className="space-y-3 md:col-span-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-[#34D399]">Modal Overlay Surface</span>
                  <Badge variant="emerald">24px Blur + Deep Shadow</Badge>
                </div>
                <h4 className="font-semibold text-white">LexAI Modal Surface</h4>
                <p className="text-xs text-[#AAA3BB]">
                  Heavy backdrop blur (`24px`), custom purple border aura, and maximum contrast for legal overlays, simulator popovers, and dialogs.
                </p>
              </Card>
            </div>
          </section>
        )}

        {/* 3. TYPOGRAPHY SYSTEM */}
        {(activeTab === 'all' || activeTab === 'typography') && (
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-[#30243F] pb-3">
              <Type className="w-6 h-6 text-[#34D399]" />
              <h3 className="heading-xl text-white font-display">3. Typography Hierarchy & Hindi Support</h3>
            </div>

            <div className="bg-[#15111F] rounded-2xl p-6 border border-[#30243F] space-y-6">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-mono text-[#AAA3BB]">Display XL — Outfit / Plus Jakarta Sans (56px / 800)</span>
                  <h2 className="display-xl text-white">Protecting Citizen Rights</h2>
                </div>

                <div>
                  <span className="text-xs font-mono text-[#AAA3BB]">Display LG — Outfit / Plus Jakarta Sans (44px / 700)</span>
                  <h3 className="display-lg text-white">Your Personal Legal Assistant</h3>
                </div>

                <div>
                  <span className="text-xs font-mono text-[#AAA3BB]">Heading XL — (32px / 700)</span>
                  <h4 className="heading-xl text-white">India-First Legal Awareness Engine</h4>
                </div>

                <div>
                  <span className="text-xs font-mono text-[#AAA3BB]">Heading LG — (24px / 600)</span>
                  <h5 className="heading-lg text-white">Know your rights before you need them</h5>
                </div>

                <div>
                  <span className="text-xs font-mono text-[#AAA3BB]">Body LG — Inter (18px / 400)</span>
                  <p className="body-lg text-[#D4CFE2]">
                    LexAI-India provides instant, jurisdiction-aware guidance across fundamental rights, police stops, consumer rights, and legal procedures.
                  </p>
                </div>

                <div>
                  <span className="text-xs font-mono text-[#AAA3BB]">Hindi / Devanagari — Noto Sans Devanagari</span>
                  <p className="text-xl hindi-text text-[#C084FC] font-medium leading-relaxed">
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
            <div className="flex items-center justify-between border-b border-[#30243F] pb-3">
              <div className="flex items-center gap-3">
                <MousePointer className="w-6 h-6 text-[#C084FC]" />
                <h3 className="heading-xl text-white font-display">4. Reusable Button System</h3>
              </div>
              <Button size="sm" variant="ghost" onClick={toggleLoading}>
                Trigger Loading State
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* Primary Purple Button */}
              <div className="bg-[#15111F] border border-[#30243F] rounded-2xl p-5 space-y-3">
                <span className="text-xs font-mono text-[#AAA3BB]">Primary (Luminous Purple)</span>
                <div>
                  <Button variant="primary" className="w-full" isLoading={buttonLoading}>
                    Primary Action
                  </Button>
                </div>
                <p className="text-xs text-[#AAA3BB]">Main call-to-actions & primary steps</p>
              </div>

              {/* AI Button */}
              <div className="bg-[#15111F] border border-[#30243F] rounded-2xl p-5 space-y-3">
                <span className="text-xs font-mono text-[#AAA3BB]">AI Button (Purple Gradient)</span>
                <div>
                  <Button variant="ai" className="w-full" leftIcon={<Sparkles className="w-4 h-4" />} isLoading={buttonLoading}>
                    Ask LexAI Assistant
                  </Button>
                </div>
                <p className="text-xs text-[#AAA3BB]">AI generation & prompt triggers</p>
              </div>

              {/* Secondary Button */}
              <div className="bg-[#15111F] border border-[#30243F] rounded-2xl p-5 space-y-3">
                <span className="text-xs font-mono text-[#AAA3BB]">Secondary</span>
                <div>
                  <Button variant="secondary" className="w-full" isLoading={buttonLoading}>
                    Secondary Option
                  </Button>
                </div>
                <p className="text-xs text-[#AAA3BB]">Supporting actions & dialog cancels</p>
              </div>

              {/* Success Emerald Button */}
              <div className="bg-[#15111F] border border-[#30243F] rounded-2xl p-5 space-y-3">
                <span className="text-xs font-mono text-[#AAA3BB]">Success (Verified Emerald)</span>
                <div>
                  <Button variant="success" className="w-full" leftIcon={<CheckCircle2 className="w-4 h-4" />} isLoading={buttonLoading}>
                    Confirm Legal Right
                  </Button>
                </div>
                <p className="text-xs text-[#AAA3BB]">Verified actions & confirmations</p>
              </div>

              {/* Danger Crimson Button */}
              <div className="bg-[#15111F] border border-[#30243F] rounded-2xl p-5 space-y-3">
                <span className="text-xs font-mono text-[#AAA3BB]">Danger / Urgent (Crimson)</span>
                <div>
                  <Button variant="danger" className="w-full" leftIcon={<AlertTriangle className="w-4 h-4" />} isLoading={buttonLoading}>
                    SOS Emergency Assistance
                  </Button>
                </div>
                <p className="text-xs text-[#AAA3BB]">Urgent legal SOS & warnings</p>
              </div>

              {/* Ghost Button */}
              <div className="bg-[#15111F] border border-[#30243F] rounded-2xl p-5 space-y-3">
                <span className="text-xs font-mono text-[#AAA3BB]">Ghost Variant</span>
                <div>
                  <Button variant="ghost" className="w-full" rightIcon={<ChevronRight className="w-4 h-4" />}>
                    Learn More Details
                  </Button>
                </div>
                <p className="text-xs text-[#AAA3BB]">Subtle inline links & navigation</p>
              </div>
            </div>
          </section>
        )}

        {/* 5. INPUT & COMMAND CENTER SYSTEM */}
        {(activeTab === 'all' || activeTab === 'inputs') && (
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-[#30243F] pb-3">
              <Search className="w-6 h-6 text-[#C084FC]" />
              <h3 className="heading-xl text-white font-display">5. Input System & Chat Command Center Preview</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Default Input */}
              <div className="bg-[#15111F] border border-[#30243F] rounded-2xl p-6 space-y-4">
                <h4 className="font-semibold text-white">Standard Form Input Fields</h4>
                <Input
                  label="Search Statutes or IPC Sections"
                  placeholder="e.g. IPC Section 354 or Motor Vehicles Act"
                  leftIcon={<Search className="w-4 h-4 text-[#AAA3BB]" />}
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

              {/* Chat Command Center Preview */}
              <div className="bg-[#15111F] border border-[#30243F] rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-white">Chat Command Center Input</h4>
                  <Badge variant="primary">Primary App Surface</Badge>
                </div>
                <p className="text-xs text-[#AAA3BB]">
                  The central interactive entry point of LexAI-India. Engineered with purple focus glow & quick Legal Prompt triggers.
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
export default DesignSystemShowcase;
