import { API_BASE_URL } from '../../../services/apiClient';
import type { Message, Citation } from '../types/chat';

export interface ChatApiRequest {
  query: string;
  conversation_id?: string;
  explain_mode?: 'simple' | 'detailed' | 'case-analysis' | 'technical';
}

export async function sendChatMessage(
  messageText: string,
  _history: Message[],
  explainMode: 'simple' | 'detailed' | 'case-analysis' | 'technical' = 'simple',
  conversationId?: string
): Promise<Message> {
  const response = await fetch(`${API_BASE_URL}/api/v1/rag/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: messageText,
      conversation_id: conversationId || undefined,
      explain_mode: explainMode,
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const errMsg = errData.detail || `Server error (${response.status})`;
    throw new Error(errMsg);
  }

  const data = await response.json();

  const citations: Citation[] = (data.sources || []).map((s: {
    source: string;
    section?: string;
    title?: string;
    chunk_index?: number;
    score?: number;
    content?: string;
  }, idx: number) => ({
    id: `cite-${idx + 1}`,
    title: s.title || s.source || 'Statutory Source',
    section: s.section || 'BNSS / Constitutional Section',
    url: '#',
    context: s.content?.slice(0, 160) + '...' || 'Statutory provision cited by Legal RAG.',
  }));

  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: data.answer || 'No answer generated.',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    citations: citations.length > 0 ? citations : undefined,
    explainMode,
  };
}
