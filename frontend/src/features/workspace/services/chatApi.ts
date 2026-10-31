import { API_BASE_URL, getJsonHeaders } from '../../../services/apiClient';
import type { Message, Citation, PipelineTrace } from '../types/chat';

export interface ChatApiRequest {
  query: string;
  conversation_id?: string;
  explain_mode?: 'simple' | 'detailed';
  trace_id?: string;
}

export async function sendChatMessage(
  messageText: string,
  _history: Message[],
  explainMode: 'simple' | 'detailed' = 'simple',
  conversationId?: string,
  traceId?: string
): Promise<Message> {
  const token = localStorage.getItem('lexai_auth_token');
  const headers = getJsonHeaders(token);

  const response = await fetch(`${API_BASE_URL}/api/v1/rag/chat`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query: messageText,
      conversation_id: conversationId || undefined,
      explain_mode: explainMode,
      trace_id: traceId || undefined,
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const errMsg = errData.detail || `Server error (${response.status})`;
    throw new Error(errMsg);
  }

  const data = await response.json();

  const citations: Citation[] = (data.sources || []).map((s: {
    evidence_id?: string;
    chunk_id?: string;
    document_id?: string;
    title?: string;
    case_name?: string;
    court?: string;
    citation?: string;
    section_reference?: string;
    paragraph_reference?: string;
    page_number?: number;
    source_url?: string;
    relevance_score?: number;
    snippet?: string;
    source?: string;
    section?: string;
    content?: string;
  }, idx: number) => {
    const evidenceId = s.evidence_id || `EVIDENCE_${idx + 1}`;
    const docTitle = s.title || s.case_name || s.source || 'Legal Document';
    const secRef = s.section_reference || s.section || (s.paragraph_reference ? s.paragraph_reference : 'Statutory Reference');
    
    return {
      id: evidenceId,
      chunkId: s.chunk_id,
      evidenceId,
      title: docTitle,
      section: secRef,
      pageNumber: s.page_number,
      court: s.court,
      citation: s.citation,
      relevanceScore: s.relevance_score,
      url: s.source_url || '#',
      context: s.snippet || s.content || 'Statutory excerpt cited by Legal RAG.',
    };
  });

  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: data.answer || 'No answer generated.',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    citations: citations.length > 0 ? citations : undefined,
    explainMode,
    traceId: data.trace_id || traceId,
    evidenceState: data.evidence_state,
    structuredAnswer: data.structured_answer,
  };
}

export async function getPipelineTrace(traceId: string): Promise<PipelineTrace | null> {
  const token = localStorage.getItem('lexai_auth_token');
  const headers = getJsonHeaders(token);

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/rag/trace/${traceId}`, {
      headers,
    });
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (e) {
    console.warn(`Could not load trace ${traceId}:`, e);
    return null;
  }
}

