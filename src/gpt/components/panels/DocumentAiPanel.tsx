import React, { useState } from 'react';
import { UploadCloud, FileText, AlertTriangle, Loader2, MessageSquare, RefreshCw } from 'lucide-react';
import { apiService } from '../../services/apiService';

interface DocumentAiPanelProps {
  onAskLex: (prompt: string) => void;
}

export const DocumentAiPanel: React.FC<DocumentAiPanelProps> = ({ onAskLex }) => {
  const [file, setFile] = useState<{ name: string; size: string; type: string } | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    summary: string;
    clauses: { title: string; text: string; page?: number }[];
    terms: { term: string; meaning: string }[];
    riskFlags: { title: string; severity: 'low' | 'medium' | 'high'; description: string }[];
  } | null>(null);

  const mockDocs = [
    { name: 'Residential_Rent_Agreement.pdf', size: '1.2 MB', type: 'Agreement' },
    { name: 'Landlord_Eviction_Notice.pdf', size: '420 KB', type: 'Notice' },
    { name: 'FIR_Draft_Theft.pdf', size: '650 KB', type: 'FIR' }
  ];

  const handleSelectMockDoc = async (doc: typeof mockDocs[0]) => {
    setFile(doc);
    setAnalyzing(true);
    setAnalysisResult(null);
    try {
      const result = await apiService.analyzeDocument(doc.name, doc.type);
      setAnalysisResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setAnalysisResult(null);
  };

  const handleDiscussInChat = () => {
    if (!file) return;
    onAskLex(`I have uploaded the document "${file.name}" for analysis. I would like to discuss the identified risk flags, particularly: "${analysisResult?.riskFlags[0]?.title}". What are my options?`);
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="space-y-4">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">
            Document AI Assistant
          </span>
          <h3 className="text-sm font-bold text-slate-905 dark:text-white mt-1">
            Analyze legal documents instantly
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Identify hidden risk clauses, translate legal jargon, and summarize terms in simple language.
          </p>
        </div>

        {/* Upload Zone */}
        {!file && !analyzing && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center bg-white dark:bg-slate-900/40 hover:border-brand-gold-550 dark:hover:border-brand-gold-550 transition-colors">
              <UploadCloud className="h-10 w-10 text-slate-350 dark:text-slate-650 mx-auto mb-3" />
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Drag & drop your document here
              </h4>
              <p className="text-[10px] text-slate-400 mt-1">
                Supports PDF, Images, Agreements, Notices or FIRs (Max 10MB)
              </p>
              
              <div className="mt-4">
                <span className="text-[10px] text-slate-500 font-semibold block mb-2">
                  Or select a demo document:
                </span>
                <div className="flex flex-col gap-2 max-w-xs mx-auto">
                  {mockDocs.map((doc, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectMockDoc(doc)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-850 bg-white text-left text-[11px] font-medium text-slate-705 dark:bg-slate-900"
                    >
                      <FileText className="h-4 w-4 text-brand-gold-550 shrink-0" />
                      <span className="truncate flex-1">{doc.name}</span>
                      <span className="text-[9px] text-slate-450 shrink-0">{doc.size}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="text-[10px] text-center text-slate-400 italic">
              *All processing is performed in local demo state. No file data is uploaded to servers in Phase 1.
            </div>
          </div>
        )}

        {/* Scanning Progress */}
        {analyzing && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900/60 shadow-premium flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 text-brand-gold-550 animate-spin" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Analyzing Document Structure
              </h4>
              <p className="text-[10px] text-slate-400 animate-pulse">
                Running mock OCR scanning & clause hazard inspection...
              </p>
            </div>
            <div className="w-full max-w-xs bg-slate-100 rounded-full h-1.5 dark:bg-slate-800 overflow-hidden">
              <div className="bg-brand-gold-550 h-1.5 rounded-full animate-pulse-slow" style={{ width: '70%' }}></div>
            </div>
          </div>
        )}

        {/* Analysis Results Display */}
        {analysisResult && !analyzing && (
          <div className="space-y-5 animate-in fade-in duration-300 pr-1">
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4.5 w-4.5 text-brand-gold-550" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                  {file?.name}
                </span>
              </div>
              <button 
                onClick={handleReset}
                className="flex items-center gap-1 text-[10px] font-bold text-slate-450 hover:text-slate-750"
              >
                <RefreshCw className="h-3 w-3" />
                <span>UPLOAD NEW</span>
              </button>
            </div>

            {/* Summary */}
            <div className="space-y-1.5">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Document Summary
              </h4>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-350">
                {analysisResult.summary}
              </p>
            </div>

            {/* Risk Flags Banners */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-450">
                Detected Risk Flags
              </h4>
              <div className="space-y-2">
                {analysisResult.riskFlags.map((risk, rIdx) => (
                  <div 
                    key={rIdx}
                    className={`rounded-xl border p-3 flex gap-2.5 items-start text-xs ${
                      risk.severity === 'high'
                        ? 'border-red-500/25 bg-red-500/5 text-red-750 dark:border-red-950/45 dark:text-red-400'
                        : 'border-amber-500/25 bg-amber-500/5 text-amber-750 dark:border-amber-950/45 dark:text-amber-400'
                    }`}
                  >
                    <AlertTriangle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold flex items-center gap-1.5">
                        {risk.title}
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase ${
                          risk.severity === 'high' ? 'bg-red-500/15 text-red-650' : 'bg-amber-500/15 text-amber-650'
                        }`}>
                          {risk.severity} Risk
                        </span>
                      </strong>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">
                        {risk.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Clauses Accordions */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-450">
                Key Extracted Clauses
              </h4>
              <div className="space-y-2">
                {analysisResult.clauses.map((cl, cIdx) => (
                  <div key={cIdx} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/50">
                    <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400 mb-1">
                      <span>{cl.title}</span>
                      {cl.page && <span>Page {cl.page}</span>}
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-650 dark:text-slate-350 italic">
                      "{cl.text}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Jargon dictionary */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-450">
                Legal Jargon Glossary
              </h4>
              <div className="grid grid-cols-1 gap-2.5">
                {analysisResult.terms.map((term, tIdx) => (
                  <div key={tIdx} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/30">
                    <h5 className="text-[11px] font-bold text-brand-gold-550 dark:text-brand-gold-300">
                      {term.term}
                    </h5>
                    <p className="text-[10.5px] leading-relaxed text-slate-500 dark:text-slate-400 mt-0.5">
                      {term.meaning}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {analysisResult && !analyzing && (
        <div className="pt-6">
          <button
            onClick={handleDiscussInChat}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-brand-navy-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-850 dark:bg-brand-gold-550 dark:text-slate-950 dark:hover:bg-brand-gold-400 transition-colors"
          >
            <MessageSquare className="h-4.5 w-4.5" />
            <span>Discuss Document in Chat</span>
          </button>
        </div>
      )}

    </div>
  );
};
export default DocumentAiPanel;
