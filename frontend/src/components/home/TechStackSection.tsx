import React from 'react';
import { Server, Database, Code, Layers, FileCheck, Globe } from 'lucide-react';
import { Card } from '../ui/Card';

export const TechStackSection: React.FC = () => {
  const stackItems = [
    {
      title: "React 19 + TypeScript",
      category: "Frontend Core",
      desc: "High-performance client UI with component-level type safety, Tailwind CSS design tokens, and smooth Framer Motion micro-animations.",
      icon: <Code className="w-5 h-5 text-[#C084FC]" />,
      tag: "Vite + TS",
    },
    {
      title: "FastAPI Backend",
      category: "API Layer",
      desc: "Asynchronous Python web framework providing low-latency REST endpoints, streaming SSE chat responses, and JWT session handling.",
      icon: <Server className="w-5 h-5 text-[#C084FC]" />,
      tag: "Python 3.12",
    },
    {
      title: "Legal RAG Engine",
      category: "Retrieval Architecture",
      desc: "Retrieval-Augmented Generation pipeline over indexed Indian Acts, Supreme Court judgments, and State amendments.",
      icon: <Database className="w-5 h-5 text-[#C084FC]" />,
      tag: "Vector DB",
    },
    {
      title: "LangChain / LangGraph",
      category: "Agentic Orchestration",
      desc: "Multi-step AI agent workflows with tool calling capabilities, structured reasoning, and step progress indicators.",
      icon: <Layers className="w-5 h-5 text-[#C084FC]" />,
      tag: "Agentic AI",
    },
    {
      title: "Document OCR Pipeline",
      category: "Contract AI",
      desc: "Computer vision and PDF text extraction pipeline scanning rental contracts, employment terms, and legal notices.",
      icon: <FileCheck className="w-5 h-5 text-[#C084FC]" />,
      tag: "Vision OCR",
    },
    {
      title: "Bilingual i18n Engine",
      category: "Localization",
      desc: "Dynamic translation and legal terminology mapping layer supporting English, Hindi, and future Indian regional languages.",
      icon: <Globe className="w-5 h-5 text-[#C084FC]" />,
      tag: "EN + HI",
    },
  ];

  return (
    <section id="tech-stack" className="py-24 relative bg-[#0D0918]/95 border-t border-[#C084FC]/15">
      {/* Background illumination */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[550px] h-[320px] bg-[#A855F7]/07 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Header — Loopy SaaS Hierarchy */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="caption-text text-[#C084FC] inline-block font-semibold tracking-wider">
            Architecture Showcase
          </span>
          <h2 className="heading-xl text-white font-display">
            The Technology Behind <span className="lexai-signature-gradient">LexAI-India</span>
          </h2>
          <p className="body-md text-[#AAA1BC] max-w-2xl mx-auto leading-relaxed">
            Engineered with modern full-stack web technologies, vector search RAG architecture, and agentic AI pipelines built for precision and low latency.
          </p>
        </div>

        {/* Architecture Grid with Loopy Dark Surfaces */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stackItems.map((item, idx) => (
            <Card 
              key={idx} 
              variant="elevated" 
              className="p-6 space-y-4 border border-[#C084FC]/15 bg-[#151020] hover:border-[#A855F7]/40 hover:bg-[#1C1530] hover:-translate-y-1 transition-all duration-300 group rounded-2xl shadow-lg shadow-black/50"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-[#1C1530] border border-[#C084FC]/20 flex items-center justify-center group-hover:border-[#C084FC]/40 transition-colors">
                  {item.icon}
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#D8B4FE] bg-[#A855F7]/10 px-2.5 py-0.5 rounded-full border border-[#A855F7]/25">
                  {item.tag}
                </span>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C084FC]">
                  {item.category}
                </span>
                <h3 className="font-semibold text-white text-base group-hover:text-[#C084FC] transition-colors duration-200">
                  {item.title}
                </h3>
                <p className="text-xs text-[#AAA1BC] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};
export default TechStackSection;