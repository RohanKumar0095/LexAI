import React from 'react';
import { Cpu, Server, Database, Code, Layers, FileCheck, Globe, Zap } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { GradientText } from '../ui/GradientText';

export const TechStackSection: React.FC = () => {
  const stackItems = [
    {
      title: "React 18 + TypeScript",
      category: "Frontend Core",
      desc: "High-performance client UI with component-level type safety, Tailwind CSS design tokens, and smooth Framer Motion micro-animations.",
      icon: <Code className="w-5 h-5 text-indigo-400" />,
      tag: "Vite + TS",
    },
    {
      title: "FastAPI Backend",
      category: "API Layer",
      desc: "Asynchronous Python web framework providing low-latency REST endpoints, streaming SSE chat responses, and JWT session handling.",
      icon: <Server className="w-5 h-5 text-emerald-400" />,
      tag: "Python 3.11",
    },
    {
      title: "Legal RAG Engine",
      category: "Retrieval Architecture",
      desc: "Retrieval-Augmented Generation pipeline over indexed Indian Acts, Supreme Court judgments, and State amendments.",
      icon: <Database className="w-5 h-5 text-saffron-400" />,
      tag: "Vector DB",
    },
    {
      title: "LangChain / LangGraph",
      category: "Agentic Orchestration",
      desc: "Multi-step AI agent workflows with tool calling capabilities, structured reasoning, and step progress indicators.",
      icon: <Layers className="w-5 h-5 text-indigo-400" />,
      tag: "Agentic AI",
    },
    {
      title: "Document OCR Pipeline",
      category: "Contract AI",
      desc: "Computer vision and PDF text extraction pipeline scanning rental contracts, employment terms, and legal notices.",
      icon: <FileCheck className="w-5 h-5 text-emerald-400" />,
      tag: "Vision OCR",
    },
    {
      title: "Bilingual i18n Engine",
      category: "Localization",
      desc: "Dynamic translation and legal terminology mapping layer supporting English, Hindi, and future Indian regional languages.",
      icon: <Globe className="w-5 h-5 text-saffron-400" />,
      tag: "EN + HI",
    },
  ];

  return (
    <section id="tech-stack" className="py-24 relative bg-[#080B14] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="electric" icon={<Cpu className="w-3.5 h-3.5" />}>
            Technology Architecture Showcase
          </Badge>
          <h2 className="heading-xl text-white font-display">
            The Technology Behind <GradientText variant="signature">LexAI-India</GradientText>
          </h2>
          <p className="body-md text-slate-300">
            Engineered with modern full-stack web technologies, vector search RAG architecture, and agentic AI pipelines ready for global jurisdiction scaling.
          </p>
        </div>

        {/* Architecture Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stackItems.map((item, idx) => (
            <Card key={idx} variant="elevated" className="space-y-4 border-white/5 hover:border-indigo-500/30">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  {item.icon}
                </div>
                <Badge variant="glass" className="text-[10px]">{item.tag}</Badge>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
                  {item.category}
                </span>
                <h3 className="font-semibold text-white text-base">{item.title}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.desc}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Architecture Banner */}
        <div className="lexai-surface-glass rounded-2xl p-6 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-[#FF9933] shrink-0" />
            <span>Jurisdiction-Aware Design: Core architecture keeps country schema decoupled for future global expansion.</span>
          </div>
          <Badge variant="saffron">India Launch → Global Ready</Badge>
        </div>

      </div>
    </section>
  );
};
