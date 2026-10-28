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
          className="inline-flex items-center gap-1 rounded bg-surface/80 px-1.5 py-0.5 text-[9px] font-medium text-brand-gold-550 border border-brand-gold-550/20"
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
        className="inline-flex items-center gap-1 rounded bg-brand-gold-550/10 hover:bg-brand-gold-550/20 px-1.5 py-0.5 text-[9px] font-medium text-brand-gold-550 dark:text-brand-gold-300 border border-brand-gold-550/25 transition-colors cursor-default"
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
          return <strong key={ptIdx} className="font-bold text-foreground">{part.slice(2, -2)}</strong>;
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
      <div className="space-y-3.5 font-sans">
        {/* 1. Plain language summary */}
        {structured.summary && (
          <div className="text-xs leading-relaxed text-foreground bg-surface/60 border border-border/50 rounded-lg p-3">
            <p className="font-medium">{renderInlineFormatting(structured.summary)}</p>
            {structured.summary_source_ids && structured.summary_source_ids.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-2 pt-2 border-t border-border/40">
                <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Source:</span>
                {structured.summary_source_ids.map((sId, idx) => renderSourceChip(sId, idx))}
              </div>
            )}
          </div>
        )}

        {/* 2. Key Legal Findings */}
        {structured.key_points && structured.key_points.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5 border-b border-border/40 pb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gold-550"></span>
              Key Legal Findings
            </h4>
            <ul className="space-y-2 pl-0.5">
              {structured.key_points.map((kp: KeyPointItem, idx: number) => (
                <li key={idx} className="text-xs text-secondary-foreground flex flex-col gap-1 leading-relaxed">
                  <div className="flex items-start gap-1.5">
                    <span className="text-brand-gold-550 font-bold mt-0.5">•</span>
                    <span>{renderInlineFormatting(kp.text)}</span>
                  </div>
                  {kp.source_ids && kp.source_ids.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 pl-3.5">
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
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5 border-b border-border/40 pb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
              Procedure & Steps
            </h4>
            <ol className="space-y-2 pl-0.5">
              {structured.steps.map((step, idx: number) => {
                const text = typeof step === 'string' ? step : step.text;
                const srcIds = typeof step === 'object' ? step.source_ids : [];
                return (
                  <li key={idx} className="text-xs text-secondary-foreground flex flex-col gap-1 leading-relaxed">
                    <div className="flex items-start gap-2">
                      <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 font-bold text-[10px] shrink-0 mt-0.5">
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
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5 border-b border-border/40 pb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Conditions & Requirements
            </h4>
            <ul className="space-y-2 pl-0.5">
              {structured.conditions.map((cond, idx: number) => {
                const text = typeof cond === 'string' ? cond : cond.text;
                const srcIds = typeof cond === 'object' ? cond.source_ids : [];
                return (
                  <li key={idx} className="text-xs text-secondary-foreground flex flex-col gap-1 leading-relaxed">
                    <div className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                      <span>{renderInlineFormatting(text)}</span>
                    </div>
                    {srcIds && srcIds.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 pl-3.5">
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
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 space-y-1.5">
            <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              Exceptions & Provisos
            </h4>
            <ul className="space-y-1.5 pl-1">
              {structured.exceptions.map((exc, idx: number) => {
                const text = typeof exc === 'string' ? exc : exc.text;
                const srcIds = typeof exc === 'object' ? exc.source_ids : [];
                return (
                  <li key={idx} className="text-xs text-secondary-foreground flex flex-col gap-1 leading-relaxed">
                    <div className="flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold mt-0.5">•</span>
                      <span>{renderInlineFormatting(text)}</span>
                    </div>
                    {srcIds && srcIds.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 pl-3.5">
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
          <div className="rounded-lg border border-border/60 bg-surface/40 p-3 space-y-1.5">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gold-550"></span>
              Important Notes
            </h4>
            <ul className="space-y-1 pl-1">
              {structured.important_notes.map((note, idx: number) => {
                const text = typeof note === 'string' ? note : note.text;
                const srcIds = typeof note === 'object' ? note.source_ids : [];
                return (
                  <li key={idx} className="text-xs text-secondary-foreground flex flex-col gap-1 leading-relaxed">
                    <div className="flex items-start gap-1.5">
                      <span className="text-brand-gold-550 font-bold mt-0.5">•</span>
                      <span>{renderInlineFormatting(text)}</span>
                    </div>
                    {srcIds && srcIds.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 pl-3.5">
                        {srcIds.map((sId, sIdx) => renderSourceChip(sId, sIdx))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* 7. Unavailable Information Notice */}
        {structured.unavailable_information && structured.unavailable_information.length > 0 && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span>Information Not in Indexed Documents</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              The indexed corpus does not contain verified provisions for the following requested aspect(s):
            </p>
            <ul className="space-y-1 pl-4 list-disc text-[11px] text-secondary-foreground leading-relaxed">
              {structured.unavailable_information.map((item, idx) => (
                <li key={idx}>{renderInlineFormatting(item)}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  // Robust markdown parser for unstructured or fallback content
  const renderFormattedContent = (text: string) => {
    const rawBlocks = text.split(/\n\s*\n/);
    const elements: React.ReactNode[] = [];

    rawBlocks.forEach((block, bIdx) => {
      const trimmed = block.trim();
      if (!trimmed) return;

      // Blockquotes
      if (trimmed.startsWith('> ')) {
        const quoteText = trimmed.replace(/^>\s*/gm, '');
        elements.push(
          <div key={`quote-${bIdx}`} className="border-l-2 border-brand-gold-550 bg-brand-gold-550/5 pl-3 py-1.5 my-2 text-xs italic text-secondary-foreground rounded-r">
            {renderInlineFormatting(quoteText)}
          </div>
        );
        return;
      }

      // Headings
      if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
        const lines = trimmed.split('\n');
        const headingLine = lines[0].replace(/^#{1,3}\s+/, '').trim();
        elements.push(
          <h4 key={`h-${bIdx}`} className="text-xs font-bold text-foreground mt-3 mb-1.5 first:mt-0 flex items-center gap-1.5 border-b border-border/50 pb-1 font-sans">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-gold-550"></span>
            {renderInlineFormatting(headingLine)}
          </h4>
        );

        if (lines.length > 1) {
          const rest = lines.slice(1).join('\n').trim();
          if (rest) {
            elements.push(renderParagraphOrList(rest, `h-rest-${bIdx}`));
          }
        }
        return;
      }

      elements.push(renderParagraphOrList(trimmed, `p-${bIdx}`));
    });

    return elements;
  };

  const renderParagraphOrList = (content: string, keyPrefix: string) => {
    const lines = content.split('\n');
    
    // Check for bullet list
    const isBulletList = lines.every(l => !l.trim() || /^\s*[\*\-]\s+/.test(l));
    if (isBulletList) {
      return (
        <ul key={keyPrefix} className="list-disc pl-5 space-y-1 text-xs leading-relaxed text-secondary-foreground my-2 font-sans">
          {lines.filter(l => l.trim()).map((li, liIdx) => (
            <li key={liIdx}>{renderInlineFormatting(li.replace(/^\s*[\*\-]\s+/, ''))}</li>
          ))}
        </ul>
      );
    }

    // Check for numbered list
    const isNumberedList = lines.every(l => !l.trim() || /^\s*\d+\.\s+/.test(l));
    if (isNumberedList) {
      return (
        <ol key={keyPrefix} className="list-decimal pl-5 space-y-1 text-xs leading-relaxed text-secondary-foreground my-2 font-sans">
          {lines.filter(l => l.trim()).map((li, liIdx) => (
            <li key={liIdx}>{renderInlineFormatting(li.replace(/^\s*\d+\.\s+/, ''))}</li>
          ))}
        </ol>
      );
    }

    return (
      <div key={keyPrefix} className="text-xs leading-relaxed text-secondary-foreground font-sans space-y-1">
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
      <div className={`flex flex-col space-y-1 max-w-[85%] md:max-w-2xl ${
        isAssistant ? 'items-start' : 'items-end'
      }`}>
        
        {/* Message bubble */}
        <div className={`rounded-2xl p-4 text-xs leading-relaxed shadow-sm border ${
          isAssistant 
            ? 'bg-surface border-border text-foreground rounded-tl-none' 
            : 'bg-selected border-border/50 text-foreground rounded-tr-none'
        }`}>
          {/* Evidence state badge */}
          {isAssistant && message.evidenceState && (
            <div className="mb-3 flex items-center gap-1.5 select-none">
              {message.evidenceState === 'sufficient' && (
                <span 
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  title="All substantive points directly supported and verified by indexed legal documents"
                >
                  <ShieldCheck className="h-3 w-3 text-emerald-500" />
                  Corpus Evidence Grounded
                </span>
              )}
              {message.evidenceState === 'partial' && (
                <span 
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25"
                  title="Indexed documents answer part of inquiry; unsupported aspects are identified and omitted"
                >
                  <AlertTriangle className="h-3 w-3 text-amber-500" />
                  Partial Evidence (Corpus Only)
                </span>
              )}
              {message.evidenceState === 'insufficient' && (
                <span 
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold bg-muted/60 text-muted-foreground border border-border"
                  title="No sufficiently relevant evidence found in the indexed corpus"
                >
                  <SearchX className="h-3 w-3 text-muted-foreground" />
                  Not in Indexed Documents
                </span>
              )}
              {message.evidenceState === 'validation_failed' && (
                <span 
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/25"
                  title="Grounding verification could not be completed"
                >
                  <AlertCircle className="h-3 w-3 text-red-500" />
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
              <p className="text-xs leading-relaxed">{message.content}</p>
            )}
          </div>

          {/* Legal Citations Panel */}
          {isAssistant && message.citations && message.citations.length > 0 && (
            <div className="space-y-2 mt-4 pt-3 border-t border-border/60">
              <div className="flex items-center justify-between">
                <h5 className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground font-sans flex items-center gap-1.5">
                  <BookOpen className="h-3 w-3 text-brand-gold-550" />
                  Verified Supporting Sources ({message.citations.length})
                </h5>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {message.citations.map((citation) => (
                  <div
                    key={citation.id}
                    className="group block rounded-lg border border-border bg-surface p-2.5 hover:bg-hover text-left transition-all"
                  >
                    <div className="flex items-center justify-between text-[10px] font-semibold text-brand-gold-550 dark:text-brand-gold-300">
                      <span>{citation.section}</span>
                      <div className="flex items-center gap-1 text-[9px] text-muted-foreground font-normal">
                        {citation.pageNumber && (
                          <span>PDF Page {citation.pageNumber}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs font-bold text-foreground mt-0.5 line-clamp-1">
                      {citation.title}
                    </div>
                    <div className="text-[10px] text-secondary-foreground mt-1 line-clamp-2 leading-relaxed">
                      {citation.context}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Timestamp & message actions below the bubble */}
        <div className="flex items-center gap-2.5 text-[9px] text-muted-foreground px-1.5 mt-1 font-sans select-none">
          <span>{message.timestamp}</span>
          {isAssistant && (
            <>
              <span>•</span>
              <button
                onClick={handleCopy}
                className="hover:text-foreground transition-colors"
                title="Copy to Clipboard"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <span>•</span>
              <button
                onClick={() => onBookmarkMessage && onBookmarkMessage(message.id)}
                className={`transition-colors ${
                  isBookmarked 
                    ? 'text-brand-gold-550 dark:text-brand-gold-300 font-semibold' 
                    : 'hover:text-foreground'
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
                    className="flex items-center gap-1 text-brand-gold-550 dark:text-brand-gold-300 hover:underline transition-colors font-semibold"
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
                className={`hover:text-foreground transition-colors ${rated === 'up' ? 'text-emerald-500' : ''}`}
                title="Helpful"
              >
                <ThumbsUp className="h-3 w-3" />
              </button>
              <button
                onClick={() => setRated('down')}
                className={`hover:text-foreground transition-colors ${rated === 'down' ? 'text-red-500' : ''}`}
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
