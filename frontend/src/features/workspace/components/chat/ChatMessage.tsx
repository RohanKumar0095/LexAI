import React, { useState } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Workflow, 
  ShieldCheck, 
  AlertTriangle, 
  SearchX, 
  AlertCircle, 
  BookOpen, 
  FileText 
} from 'lucide-react';
import type { Message, Citation, KeyPointItem } from '../../types/chat';

interface ChatMessageProps {
  message: Message;
  onOpenPanel: (panelId: string) => void;
  onBookmarkMessage?: (msgId: string) => void;
  isBookmarked?: boolean;
  onInspectTrace?: (traceId: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onBookmarkMessage,
  isBookmarked = false,
  onInspectTrace
}) => {
  const isAssistant = message.role === 'assistant';
  const [copied, setCopied] = useState(false);
  const [rated, setRated] = useState<'up' | 'down' | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to find a citation by ID (evidence_id, chunk_id, or cite-id)
  const findCitation = (srcId: string): Citation | undefined => {
    if (!message.citations) return undefined;
    return message.citations.find(
      c => c.evidenceId === srcId || c.chunkId === srcId || c.id === srcId
    );
  };

  // Render inline source chip/badge next to factual statements
  const renderSourceChip = (srcId: string, idx: number) => {
    const citation = findCitation(srcId);
    if (!citation) {
      return (
        <span
          key={idx}
          className="inline-flex items-center gap-1 rounded-md bg-[#1C1728] px-1.5 py-0.5 text-[9px] font-medium text-[#C084FC] border border-[#A855F7]/25"
          title={`Supporting Evidence: ${srcId}`}
        >
          <FileText className="h-2.5 w-2.5" />
          {srcId}
        </span>
      );
    }

    const label = citation.section 
      ? `${citation.section}${citation.pageNumber ? ` (p. ${citation.pageNumber})` : ''}`
      : (citation.pageNumber ? `Page ${citation.pageNumber}` : citation.title);

    return (
      <span
        key={idx}
        className="inline-flex items-center gap-1 rounded-md bg-[#A855F7]/15 hover:bg-[#A855F7]/25 px-1.5 py-0.5 text-[9px] font-medium text-[#C084FC] border border-[#A855F7]/30 transition-colors cursor-default"
        title={`${citation.title} — ${citation.section || 'Statutory reference'}`}
      >
        <BookOpen className="h-2.5 w-2.5 shrink-0" />
        <span className="truncate max-w-[200px]">{label}</span>
      </span>
    );
  };

  // Helper to parse bolding and inline markdown in text
  const renderInlineFormatting = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/);
    if (parts.length > 1) {
      return parts.map((part, ptIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={ptIdx} className="font-bold text-white">{part.slice(2, -2)}</strong>;
        }
        return part;
      });
    }
    return text;
  };

  // Render structured legal answer directly with dedicated React UI
  const renderStructuredAnswer = () => {
    const structured = message.structuredAnswer!;

    return (
      <div className="space-y-4 font-sans">
        {/* 1. Plain language summary */}
        {structured.summary && (
          <div className="text-xs leading-relaxed text-[#F8F7FC] bg-[#100D18] border border-[#30243F] rounded-xl p-3.5">
            <p className="font-medium">{renderInlineFormatting(structured.summary)}</p>
            {structured.summary_source_ids && structured.summary_source_ids.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2.5 border-t border-[#30243F]">
                <span className="text-[9px] text-[#AAA3BB] uppercase font-bold tracking-wider">Source:</span>
                {structured.summary_source_ids.map((sId, idx) => renderSourceChip(sId, idx))}
              </div>
            )}
          </div>
        )}

        {/* 2. Key Legal Findings */}
        {structured.key_points && structured.key_points.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-2 border-b border-[#30243F] pb-1.5">
              <span className="h-2 w-2 rounded-full bg-[#A855F7]"></span>
              Key Legal Findings
            </h4>
            <ul className="space-y-2 pl-0.5">
              {structured.key_points.map((kp: KeyPointItem, idx: number) => (
                <li key={idx} className="text-xs text-[#D4CFE2] flex flex-col gap-1 leading-relaxed">
                  <div className="flex items-start gap-2">
                    <span className="text-[#C084FC] font-bold mt-0.5">•</span>
                    <span>{renderInlineFormatting(kp.text)}</span>
                  </div>
                  {kp.source_ids && kp.source_ids.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 pl-4">
                      {kp.source_ids.map((sId, sIdx) => renderSourceChip(sId, sIdx))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 3. Procedure & Steps */}
        {structured.steps && structured.steps.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-2 border-b border-[#30243F] pb-1.5">
              <span className="h-2 w-2 rounded-full bg-[#C084FC]"></span>
              Procedure & Steps
            </h4>
            <ol className="space-y-2 pl-0.5">
              {structured.steps.map((step, idx: number) => {
                const text = typeof step === 'string' ? step : step.text;
                const srcIds = typeof step === 'object' ? step.source_ids : [];
                return (
                  <li key={idx} className="text-xs text-[#D4CFE2] flex flex-col gap-1 leading-relaxed">
                    <div className="flex items-start gap-2">
                      <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-[#A855F7]/20 text-[#C084FC] font-bold text-[10px] shrink-0 mt-0.5 border border-[#A855F7]/30">
                        {idx + 1}
                      </span>
                      <span>{renderInlineFormatting(text)}</span>
                    </div>
                    {srcIds && srcIds.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 pl-6">
                        {srcIds.map((sId, sIdx) => renderSourceChip(sId, sIdx))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        )}

        {/* 4. Conditions & Requirements */}
        {structured.conditions && structured.conditions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-2 border-b border-[#30243F] pb-1.5">
              <span className="h-2 w-2 rounded-full bg-[#10B981]"></span>
              Conditions & Requirements
            </h4>
            <ul className="space-y-2 pl-0.5">
              {structured.conditions.map((cond, idx: number) => {
                const text = typeof cond === 'string' ? cond : cond.text;
                const srcIds = typeof cond === 'object' ? cond.source_ids : [];
                return (
                  <li key={idx} className="text-xs text-[#D4CFE2] flex flex-col gap-1 leading-relaxed">
                    <div className="flex items-start gap-2">
                      <span className="text-[#34D399] font-bold mt-0.5">✓</span>
                      <span>{renderInlineFormatting(text)}</span>
                    </div>
                    {srcIds && srcIds.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 pl-4">
                        {srcIds.map((sId, sIdx) => renderSourceChip(sId, sIdx))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* 5. Exceptions & Provisos */}
        {structured.exceptions && structured.exceptions.length > 0 && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/05 p-3.5 space-y-2">
            <h4 className="text-xs font-bold text-amber-400 flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5" />
              Exceptions & Provisos
            </h4>
            <ul className="space-y-1.5 pl-1">
              {structured.exceptions.map((exc, idx: number) => {
                const text = typeof exc === 'string' ? exc : exc.text;
                const srcIds = typeof exc === 'object' ? exc.source_ids : [];
                return (
                  <li key={idx} className="text-xs text-[#D4CFE2] flex flex-col gap-1 leading-relaxed">
                    <div className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold mt-0.5">•</span>
                      <span>{renderInlineFormatting(text)}</span>
                    </div>
                    {srcIds && srcIds.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 pl-4">
                        {srcIds.map((sId, sIdx) => renderSourceChip(sId, sIdx))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* 6. Important Notes */}
        {structured.important_notes && structured.important_notes.length > 0 && (
          <div className="rounded-xl border border-[#30243F] bg-[#100D18] p-3.5 space-y-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#C084FC]"></span>
              Important Notes
            </h4>
            <ul className="space-y-1.5 pl-1">
              {structured.important_notes.map((note, idx: number) => {
                const text = typeof note === 'string' ? note : note.text;
                const srcIds = typeof note === 'object' ? note.source_ids : [];
                return (
                  <li key={idx} className="text-xs text-[#D4CFE2] flex flex-col gap-1 leading-relaxed">
                    <div className="flex items-start gap-2">
                      <span className="text-[#C084FC] font-bold mt-0.5">•</span>
                      <span>{renderInlineFormatting(text)}</span>
                    </div>
                    {srcIds && srcIds.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 pl-4">
                        {srcIds.map((sId, sIdx) => renderSourceChip(sId, sIdx))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    );
  };

  // Helper to render plain formatted content if not structured
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="text-xs leading-relaxed text-[#D4CFE2] font-sans space-y-2">
        {lines.map((line, lIdx) => (
          <p key={lIdx}>{renderInlineFormatting(line)}</p>
        ))}
      </div>
    );
  };

  return (
    <div className={`flex w-full mb-6 animate-in fade-in duration-200 ${
      isAssistant ? 'justify-start' : 'justify-end'
    }`}>
      <div className={`flex flex-col space-y-1 max-w-[88%] md:max-w-2xl ${
        isAssistant ? 'items-start' : 'items-end'
      }`}>
        
        {/* Message bubble */}
        <div className={`rounded-2xl p-4 sm:p-5 text-xs leading-relaxed shadow-md border ${
          isAssistant 
            ? 'bg-[#15111F] border-[#30243F] text-[#F8F7FC] rounded-tl-none shadow-purple-950/20' 
            : 'bg-[#1C1728] border-[#30243F] text-[#F8F7FC] rounded-tr-none shadow-purple-950/20'
        }`}>
          {/* Evidence state badge */}
          {isAssistant && message.evidenceState && (
            <div className="mb-3.5 flex items-center gap-1.5 select-none">
              {message.evidenceState === 'sufficient' && (
                <span 
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30"
                  title="All substantive points directly supported and verified by indexed legal documents"
                >
                  <ShieldCheck className="h-3 w-3 text-[#34D399]" />
                  Corpus Evidence Grounded
                </span>
              )}
              {message.evidenceState === 'partial' && (
                <span 
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30"
                  title="Indexed documents answer part of inquiry; unsupported aspects are identified and omitted"
                >
                  <AlertTriangle className="h-3 w-3 text-amber-400" />
                  Partial Evidence (Corpus Only)
                </span>
              )}
              {message.evidenceState === 'insufficient' && (
                <span 
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold bg-[#1C1728] text-[#AAA3BB] border border-[#30243F]"
                  title="No sufficiently relevant evidence found in the indexed corpus"
                >
                  <SearchX className="h-3 w-3 text-[#AAA3BB]" />
                  Not in Indexed Documents
                </span>
              )}
              {message.evidenceState === 'validation_failed' && (
                <span 
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30"
                  title="Grounding verification could not be completed"
                >
                  <AlertCircle className="h-3 w-3 text-rose-400" />
                  Verification Unavailable
                </span>
              )}
            </div>
          )}

          {/* Message body */}
          <div className="space-y-3 font-sans">
            {isAssistant ? (
              message.structuredAnswer ? (
                renderStructuredAnswer()
              ) : (
                renderFormattedContent(message.content)
              )
            ) : (
              <p className="text-xs leading-relaxed text-[#F8F7FC]">{message.content}</p>
            )}
          </div>

          {/* Legal Citations Panel */}
          {isAssistant && message.citations && message.citations.length > 0 && (
            <div className="space-y-2 mt-4 pt-3.5 border-t border-[#30243F]">
              <div className="flex items-center justify-between">
                <h5 className="text-[9px] font-bold uppercase tracking-wider text-[#AAA3BB] font-sans flex items-center gap-1.5">
                  <BookOpen className="h-3 w-3 text-[#C084FC]" />
                  Verified Supporting Sources ({message.citations.length})
                </h5>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {message.citations.map((citation) => (
                  <div
                    key={citation.id}
                    className="group block rounded-xl border border-[#30243F] bg-[#100D18] p-3 hover:bg-[#1C1728] hover:border-[#A855F7]/40 text-left transition-all"
                  >
                    <div className="flex items-center justify-between text-[10px] font-semibold text-[#C084FC]">
                      <span>{citation.section}</span>
                      <div className="flex items-center gap-1 text-[9px] text-[#AAA3BB] font-normal">
                        {citation.pageNumber && (
                          <span>PDF Page {citation.pageNumber}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs font-bold text-white mt-1 line-clamp-1">
                      {citation.title}
                    </div>
                    <div className="text-[10px] text-[#AAA3BB] mt-1 line-clamp-2 leading-relaxed">
                      {citation.context}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Timestamp & message actions below the bubble */}
        <div className="flex items-center gap-2.5 text-[10px] text-[#AAA3BB] px-2 mt-1 font-sans select-none">
          <span>{message.timestamp}</span>
          {isAssistant && (
            <>
              <span>•</span>
              <button
                onClick={handleCopy}
                className="hover:text-white transition-colors cursor-pointer"
                title="Copy to Clipboard"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <span>•</span>
              <button
                onClick={() => onBookmarkMessage && onBookmarkMessage(message.id)}
                className={`transition-colors cursor-pointer ${
                  isBookmarked 
                    ? 'text-[#C084FC] font-semibold' 
                    : 'hover:text-white'
                }`}
                title="Bookmark Information"
              >
                {isBookmarked ? 'Saved' : 'Save'}
              </button>
              
              {/* RAG Pipeline Trace Inspector button */}
              {message.traceId && onInspectTrace && (
                <>
                  <span>•</span>
                  <button
                    onClick={() => onInspectTrace(message.traceId!)}
                    className="flex items-center gap-1 text-[#C084FC] hover:text-white hover:underline transition-colors font-semibold cursor-pointer"
                    title="Inspect RAG Pipeline Telemetry"
                  >
                    <Workflow className="w-2.5 h-2.5" />
                    <span>Inspect Pipeline</span>
                  </button>
                </>
              )}

              {/* Thumbs Ratings */}
              <span>•</span>
              <button
                onClick={() => setRated('up')}
                className={`hover:text-white transition-colors cursor-pointer ${rated === 'up' ? 'text-[#34D399]' : ''}`}
                title="Helpful"
              >
                <ThumbsUp className="h-3 w-3" />
              </button>
              <button
                onClick={() => setRated('down')}
                className={`hover:text-white transition-colors cursor-pointer ${rated === 'down' ? 'text-rose-400' : ''}`}
                title="Not helpful"
              >
                <ThumbsDown className="h-3 w-3" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
