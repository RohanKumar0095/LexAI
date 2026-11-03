import { useState, useEffect } from 'react';
import type { Conversation, Message } from '../types/chat';
import { apiService } from '../services/apiService';
import { speechService } from '../services/speechService';
import { useAuth } from '../../../context';

export const useChat = () => {
  const { isAuthenticated, isGuest, token } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [explainMode, setExplainMode] = useState<'simple' | 'detailed'>('simple');

  const [activeTraceId, setActiveTraceId] = useState<string | null>(null);
  const [latestTraceId, setLatestTraceId] = useState<string | null>(null);

  // Load user conversation history from Supabase when authenticated
  useEffect(() => {
    let isCurrent = true;

    const loadHistory = async () => {
      if (isAuthenticated && token) {
        try {
          const history = await apiService.getChatHistory(token);
          if (isCurrent) {
            setConversations(history);
          }
        } catch (err) {
          console.warn('Failed to load user chat history from Supabase:', err);
        }
      } else {
        if (isCurrent) {
          setConversations([]);
          setActiveConversationId(null);
          setMessages([]);
        }
      }
    };

    loadHistory();

    return () => {
      isCurrent = false;
    };
  }, [isAuthenticated, token, isGuest]);

  const startNewChat = () => {
    speechService.stop();
    setActiveConversationId(null);
    setMessages([]);
    setExplainMode('simple');
    setActiveTraceId(null);
  };

  const loadConversation = async (id: string) => {
    speechService.stop();
    setActiveConversationId(id);

    // 1. Immediately display in-memory messages if available
    const active = conversations.find(c => c.id === id);
    if (active && active.messages && active.messages.length > 0) {
      setMessages(active.messages);
      const lastWithTrace = [...active.messages].reverse().find(m => m.traceId);
      if (lastWithTrace?.traceId) {
        setLatestTraceId(lastWithTrace.traceId);
      }
    }

    // 2. If authenticated, fetch full messages from Supabase to guarantee complete sync
    if (isAuthenticated && token && id && !id.startsWith('temp-')) {
      try {
        const details = await apiService.fetchConversationDetails(id, token);
        if (details && details.messages) {
          setMessages(details.messages);
          const lastWithTrace = [...details.messages].reverse().find(m => m.traceId);
          if (lastWithTrace?.traceId) {
            setLatestTraceId(lastWithTrace.traceId);
          }
          // Update in-memory conversation list
          setConversations(prev =>
            prev.map(c => (c.id === id ? { ...c, messages: details.messages } : c))
          );
        }
      } catch (err) {
        console.warn(`Could not sync messages for conversation ${id} from Supabase:`, err);
      }
    }
  };

  const deleteConversation = async (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConversationId === id) {
      startNewChat();
    }
    if (isAuthenticated && token && !id.startsWith('temp-')) {
      try {
        await apiService.deleteConversation(id, token);
      } catch (err) {
        console.warn(`Failed to delete conversation ${id} from Supabase:`, err);
      }
    }
  };

  const clearAllConversations = async () => {
    setConversations([]);
    startNewChat();
    if (isAuthenticated && token) {
      try {
        await apiService.clearAllConversations(token);
      } catch (err) {
        console.warn('Failed to clear conversations from Supabase:', err);
      }
    }
  };

  const addPinConversation = (id: string) => {
    setConversations(prev =>
      prev.map(c => {
        if (c.id === id) {
          return {
            ...c,
            pinned: !c.pinned,
          };
        }
        return c;
      })
    );
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Generate correlated trace ID immediately
    const traceId = `trace_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    setActiveTraceId(traceId);
    setLatestTraceId(traceId);

    // Create user message
    const userMsg: Message = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      traceId,
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsTyping(true);

    let currentConvId = activeConversationId;
    const isNewChat = !currentConvId;

    // Optimistic local UI conversation preview
    if (isNewChat) {
      const tempId = `temp-${Date.now()}`;
      currentConvId = tempId;

      const words = text.split(' ');
      const title = words.slice(0, 5).join(' ') + (words.length > 5 ? '...' : '');

      const newConv: Conversation = {
        id: tempId,
        title: title || 'Legal Inquiry',
        category: 'General',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        preview: text.substring(0, 60) + (text.length > 60 ? '...' : ''),
        dateGroup: 'today',
        pinned: false,
        messages: [userMsg],
      };

      setConversations(prev => [newConv, ...prev]);
    } else {
      setConversations(prev =>
        prev.map(c => {
          if (c.id === currentConvId) {
            return { ...c, messages: [...c.messages, userMsg] };
          }
          return c;
        })
      );
    }

    try {
      // Send message to FastAPI RAG backend with correlated traceId
      const convIdToSend = currentConvId && !currentConvId.startsWith('temp-') ? currentConvId : undefined;
      const aiResponse = await apiService.sendChatMessage(
        text,
        updatedMessages,
        explainMode,
        convIdToSend,
        traceId
      );

      const canonicalConvId = aiResponse.conversationId || currentConvId;
      if (canonicalConvId) {
        setActiveConversationId(canonicalConvId);
      }

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);

      // Update conversations history list with canonical ID and preview
      setConversations(prev =>
        prev.map(c => {
          if (c.id === currentConvId || (canonicalConvId && c.id === canonicalConvId)) {
            return {
              ...c,
              id: canonicalConvId || c.id,
              preview:
                aiResponse.content.substring(0, 65).replace(/\n/g, ' ') +
                (aiResponse.content.length > 65 ? '...' : ''),
              messages: [...c.messages.filter(m => m.id !== aiResponse.id), aiResponse],
            };
          }
          return c;
        })
      );
    } catch (err) {
      console.error('Failed to send chat message:', err);
      setIsTyping(false);
      const errorMsg: Message = {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        content:
          "⚠️ **Something went wrong.** We couldn't connect to our assistant. Please try sending your message again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        traceId,
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  return {
    messages,
    conversations,
    activeConversationId,
    isTyping,
    explainMode,
    setExplainMode,
    sendMessage,
    startNewChat,
    loadConversation,
    deleteConversation,
    addPinConversation,
    clearAllConversations,
    setMessages,
    activeTraceId,
    latestTraceId,
    setActiveTraceId,
  };
};
