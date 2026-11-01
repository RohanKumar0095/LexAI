import { API_BASE_URL, getJsonHeaders } from '../../../services/apiClient';
import type { Message, Citation, PipelineTrace, Conversation } from '../types/chat';

export interface ChatApiRequest {
  query: string;
  conversation_id?: string;
  explain_mode?: 'simple' | 'detailed';
  trace_id?: string;
}

export function getAuthToken(): string | null {
  return localStorage.getItem('lexai_access_token') || localStorage.getItem('lexai_auth_token') || null;
}

export function computeDateGroup(dateStr?: string): 'today' | 'yesterday' | 'week' | 'older' {
  if (!dateStr) return 'today';
  const d = new Date(dateStr);
  const now = new Date();
  
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const dStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((todayStart - dStart) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays <= 7) return 'week';
  return 'older';
}

export function formatTime(dateStr?: string): string {
  if (!dateStr) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  try {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export function mapSupabaseMessage(raw: any): Message {
  const meta = raw.metadata || {};
  return {
    id: raw.id,
    role: raw.role as 'user' | 'assistant',
    content: raw.content || '',
    timestamp: formatTime(raw.created_at),
    citations: meta.citations,
    structuredAnswer: meta.structured_answer,
    evidenceState: meta.evidence_state,
    explainMode: meta.explain_mode || 'simple',
    traceId: meta.trace_id,
    conversationId: raw.conversation_id,
  };
}

export function mapSupabaseConversation(raw: any): Conversation {
  const msgs = Array.isArray(raw.messages) ? raw.messages.map(mapSupabaseMessage) : [];
  const lastMsg = msgs[msgs.length - 1];
  const preview = lastMsg
    ? lastMsg.content.substring(0, 65).replace(/\n/g, ' ') + (lastMsg.content.length > 65 ? '...' : '')
    : '';

  return {
    id: raw.id,
    title: raw.title || 'Legal Inquiry',
    category: 'General',
    timestamp: formatTime(raw.updated_at || raw.created_at),
    preview,
    dateGroup: computeDateGroup(raw.updated_at || raw.created_at),
    pinned: false,
    messages: msgs,
  };
}

export async function fetchUserConversations(tokenOverride?: string): Promise<Conversation[]> {
  const token = tokenOverride || getAuthToken();
  if (!token) return [];

  const headers = getJsonHeaders(token);
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/rag/conversations`, {
      method: 'GET',
      headers,
    });
    if (!res.ok) {
      return [];
    }
    const data = await res.json();
    if (Array.isArray(data)) {
      return data.map(mapSupabaseConversation);
    }
    return [];
  } catch (err) {
    console.warn('Failed to load user conversations from Supabase:', err);
    return [];
  }
}

export async function fetchConversationDetails(
  conversationId: string,
  tokenOverride?: string
): Promise<{ conversation: Conversation; messages: Message[] } | null> {
  const token = tokenOverride || getAuthToken();
  if (!token) return null;

  const headers = getJsonHeaders(token);
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/rag/conversations/${conversationId}`, {
      method: 'GET',
      headers,
    });
    if (!res.ok) return null;
    const data = await res.json();
    const conv = mapSupabaseConversation(data);
    return {
      conversation: conv,
      messages: conv.messages,
    };
  } catch (err) {
    console.warn(`Failed to load conversation ${conversationId} from Supabase:`, err);
    return null;
  }
}

export async function renameUserConversation(
  conversationId: string,
  title: string,
  tokenOverride?: string
): Promise<boolean> {
  const token = tokenOverride || getAuthToken();
  if (!token) return false;

  const headers = getJsonHeaders(token);
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/rag/conversations/${conversationId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ title }),
    });
    return res.ok;
  } catch (err) {
    console.warn(`Failed to rename conversation ${conversationId}:`, err);
    return false;
  }
}

export async function deleteUserConversation(
  conversationId: string,
  tokenOverride?: string
): Promise<boolean> {
  const token = tokenOverride || getAuthToken();
  if (!token) return false;

  const headers = getJsonHeaders(token);
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/rag/conversations/${conversationId}`, {
      method: 'DELETE',
      headers,
    });
    return res.ok;
  } catch (err) {
    console.warn(`Failed to delete conversation ${conversationId}:`, err);
    return false;
  }
}

export async function clearAllUserConversations(tokenOverride?: string): Promise<boolean> {
  const token = tokenOverride || getAuthToken();
  if (!token) return false;

  const headers = getJsonHeaders(token);
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/rag/conversations`, {
      method: 'DELETE',
      headers,
    });
    return res.ok;
  } catch (err) {
    console.warn('Failed to clear all conversations:', err);
    return false;
  }
}

export async function sendChatMessage(
  messageText: string,
  _history: Message[],
  explainMode: 'simple' | 'detailed' = 'simple',
  conversationId?: string,
  traceId?: string
): Promise<Message> {
  const token = getAuthToken();
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
    conversationId: data.conversation_id || conversationId,
  };
}

export async function getPipelineTrace(traceId: string): Promise<PipelineTrace | null> {
  const token = getAuthToken();
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
