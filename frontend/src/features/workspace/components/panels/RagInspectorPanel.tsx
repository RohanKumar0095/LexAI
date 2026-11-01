import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ChevronDown, 
  ChevronUp, 
  Cpu, 
  Layers, 
  Terminal,
  ShieldCheck
} from 'lucide-react';
import type { PipelineTrace } from '../../types/chat';
import { apiService } from '../../services/apiService';

interface RagInspectorPanelProps {
  traceId: string | null;
  isOpen: boolean;
  onClose: () => void;
  isProcessing?: boolean;
}

export const RagInspectorPanel: React.FC<RagInspectorPanelProps> = ({
  traceId,
  isOpen,
  onClose,
  isProcessing = false
}) => {
  const [trace, setTrace] = useState<PipelineTrace | null>(null);
  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<'simple' | 'technical'>('simple');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);


  const pollIntervalRef = useRef<number | null>(null);

  // Poll trace while processing, or load once if completed
  useEffect(() => {
    if (!isOpen || !traceId) {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      return;
    }

    setTrace(null);
    setErrorMsg(null);

    let isMounted = true;

    const fetchTrace = async () => {
      try {
        const data = await apiService.getPipelineTrace(traceId);
        if (isMounted) {
          if (data) {
            setTrace(data);
            setErrorMsg(null);
            // If trace is finished, stop polling
            if (data.status === 'completed' || data.status === 'failed') {
              if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
              }
            }
          } else {
            // Trace not yet ready on server
            if (!trace) {
              setTrace(null);
            }
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setErrorMsg(err?.message || 'Failed to load telemetry trace');
        }
      }
    };


    fetchTrace();

    // Poll every 600ms while running
    pollIntervalRef.current = window.setInterval(fetchTrace, 600);

    return () => {
      isMounted = false;
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [isOpen, traceId, isProcessing]);

  if (!isOpen) return null;

  const toggleStage = (stageId: string) => {
    setExpandedStages(prev => ({
      ...prev,
      [stageId]: !prev[stageId]
    }));
  };

  const expandAll = () => {
    if (!trace) return;
    const all: Record<string, boolean> = {};
    trace.stages.forEach(s => {
      all[s.stage_id] = true;
    });
    setExpandedStages(all);
  };

  const collapseAll = () => {
    setExpandedStages({});
  };

  const stages = trace?.stages || [];
  const completedCount = stages.filter(s => s.status === 'completed').length;
  const inProgressStage = stages.find(s => s.status === 'in_progress');


  const overallStatus = trace?.status || (isProcessing ? 'processing' : 'pending');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        );
      case 'in_progress':
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Loader2 className="w-3 h-3 animate-spin" /> In Progress
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3 h-3" /> Failed
          </span>
        );
      case 'skipped':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-500 border border-slate-500/20">
            Skipped
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">
            Pending
          </span>
        );
    }
  };

  const renderStageIcon = (status: string, stageNum: number) => {
    switch (status) {
      case 'completed':
        return (
          <div className="w-7 h-7 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      case 'in_progress':
        return (
          <div className="w-7 h-7 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        );
      case 'failed':
        return (
          <div className="w-7 h-7 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
            <AlertCircle className="w-4 h-4" />
          </div>
        );
      case 'skipped':
        return (
          <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700 flex items-center justify-center shrink-0 text-xs font-semibold">
            -
          </div>
        );
      default:
        return (
          <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 text-xs font-semibold">
            {stageNum}
          </div>
        );
    }
  };

  return (
    <div 
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] md:w-[520px] bg-white dark:bg-brand-navy-950 border-l border-border shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out"
      role="dialog"
      aria-modal="true"
      aria-label="RAG Pipeline Inspector"
    >
      {/* Header */}
      <div className="p-4 border-b border-border bg-slate-50/80 dark:bg-brand-navy-900/60 backdrop-blur-md flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-gold-550/10 text-brand-gold-550 dark:text-brand-gold-300 flex items-center justify-center">
            <Cpu className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              RAG Pipeline Inspector
              {trace && getStatusBadge(overallStatus)}
            </h2>
            <p className="text-[11px] text-muted-foreground">
              See how LexAI processes a legal question step by step.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
          title="Close Inspector"
          aria-label="Close Inspector"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* No active or selected trace */}
        {!traceId ? (
          <div className="py-16 px-4 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-gold-550/10 text-brand-gold-550 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-foreground">No Chat Request Selected</h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Ask a question in the chat or select an existing conversation to inspect its backend RAG retrieval, ranking, and synthesis telemetry.
            </p>
          </div>
        ) : (
          <>
            {/* Run Summary Card */}
            <div className="p-4 rounded-xl border border-border bg-slate-50/50 dark:bg-brand-navy-900/40 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-muted-foreground">Trace ID</span>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-muted text-foreground select-all">
                  {traceId}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/60">
                <div className="p-2 rounded-lg bg-surface border border-border/40 text-center">
                  <div className="text-[10px] font-medium text-muted-foreground uppercase">Stages</div>
                  <div className="text-sm font-bold text-foreground mt-0.5">
                    {completedCount} / {stages.length || 12}
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-surface border border-border/40 text-center">
                  <div className="text-[10px] font-medium text-muted-foreground uppercase">Total Time</div>
                  <div className="text-sm font-bold text-foreground mt-0.5">
                    {trace?.total_duration_ms != null 
                      ? `${(trace.total_duration_ms / 1000).toFixed(2)}s` 
                      : (isProcessing ? 'Measuring...' : 'N/A')}
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-surface border border-border/40 text-center">
                  <div className="text-[10px] font-medium text-muted-foreground uppercase">Active Step</div>
                  <div className="text-xs font-bold text-brand-gold-550 dark:text-brand-gold-300 truncate mt-1">
                    {inProgressStage ? (inProgressStage.simple_name || inProgressStage.stage_name) : (overallStatus === 'completed' ? 'Finished' : (overallStatus === 'failed' ? 'Failed' : (isProcessing ? 'Waiting' : 'Not Available')))}
                  </div>
                </div>
              </div>

              {/* View Toggle and Expand Controls */}
              <div className="pt-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 bg-surface rounded-lg p-0.5 border border-border">
                  <button
                    onClick={() => setViewMode('simple')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                      viewMode === 'simple'
                        ? 'bg-selected text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Simple
                  </button>
                  <button
                    onClick={() => setViewMode('technical')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                      viewMode === 'technical'
                        ? 'bg-selected text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Technical
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={expandAll}
                    className="text-[11px] font-medium text-brand-gold-550 dark:text-brand-gold-300 hover:underline"
                  >
                    Expand all
                  </button>
                  <span className="text-muted-foreground text-[10px]">|</span>
                  <button
                    onClick={collapseAll}
                    className="text-[11px] font-medium text-muted-foreground hover:text-foreground hover:underline"
                  >
                    Collapse
                  </button>
                </div>
              </div>
            </div>

            {/* Error banner if telemetry endpoint failed */}
            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Vertical Execution Timeline */}
            <div className="space-y-3 relative pl-3 sm:pl-4">
              {/* Connecting line */}
              <div className="absolute left-[26px] sm:left-[30px] top-4 bottom-4 w-0.5 bg-border -z-10" />

              {stages.map((stage) => {
                const isExpanded = expandedStages[stage.stage_id] ?? (stage.status === 'in_progress' || stage.status === 'failed');
                const hasTechDetails = Object.keys(stage.technical_details || {}).length > 0;

                return (
                  <div
                    key={stage.stage_id}
                    className={`relative rounded-xl border transition-all ${
                      stage.status === 'in_progress'
                        ? 'border-amber-500/50 bg-amber-500/5 shadow-sm ring-1 ring-amber-500/20'
                        : stage.status === 'failed'
                        ? 'border-rose-500/50 bg-rose-500/5'
                        : 'border-border bg-surface'
                    }`}
                  >
                    {/* Stage Header Row */}
                    <div
                      onClick={() => toggleStage(stage.stage_id)}
                      className="p-3 sm:p-3.5 flex items-start gap-3 cursor-pointer select-none"
                    >
                      {renderStageIcon(stage.status, stage.stage_number)}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-foreground truncate">
                            {viewMode === 'simple' ? stage.simple_name : stage.stage_name}
                          </h4>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {stage.duration_ms != null && (
                              <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" />
                                {stage.duration_ms}ms
                              </span>
                            )}
                            <button
                              type="button"
                              className="text-muted-foreground p-0.5 hover:text-foreground"
                              aria-label={isExpanded ? "Collapse stage" : "Expand stage"}
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                          {stage.status_message || stage.description}
                        </p>
                      </div>
                    </div>

                    {/* Expandable Details Body */}
                    {isExpanded && (
                      <div className="px-3.5 pb-3.5 pt-1 border-t border-border/50 text-xs space-y-2.5 animate-in fade-in duration-150">
                        <p className="text-[11px] text-secondary-foreground leading-relaxed">
                          {stage.description}
                        </p>

                        {/* Status message */}
                        {stage.status_message && (
                          <div className="p-2 rounded bg-muted/50 text-[11px] flex items-center gap-1.5 text-foreground font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-550" />
                            <span>{stage.status_message}</span>
                          </div>
                        )}

                        {/* Error info */}
                        {stage.error && (
                          <div className="p-2 rounded bg-rose-500/10 text-[11px] text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>Error: {stage.error}</span>
                          </div>
                        )}

                        {/* Technical Metadata Table */}
                        {hasTechDetails && (
                          <div className="space-y-1.5 pt-1">
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                              <Terminal className="w-3 h-3" /> Technical Parameters
                            </div>
                            <div className="rounded-lg border border-border/70 bg-background/50 p-2 font-mono text-[10px] space-y-1 overflow-x-auto">
                              {Object.entries(stage.technical_details).map(([key, val]) => (
                                <div key={key} className="flex justify-between gap-4 py-0.5 border-b border-border/30 last:border-0">
                                  <span className="text-muted-foreground">{key}:</span>
                                  <span className="text-foreground font-semibold text-right truncate">
                                    {typeof val === 'boolean' ? (val ? 'true' : 'false') : String(val)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Privacy and Trust Safeguard Note */}
            <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 text-[11px] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Privacy Safeguard Active:</span> Raw prompts, API credentials, and internal chain-of-thought are strictly kept on the secure backend and never broadcast over the telemetry channel.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RagInspectorPanel;
