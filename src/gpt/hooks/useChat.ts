import { useState, useEffect } from 'react';
import type { Conversation, Message } from '../types/chat';
import { apiService } from '../services/apiService';

export const useChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [explainMode, setExplainMode] = useState<'simple' | 'detailed' | 'case-analysis' | 'technical'>('simple');

  // Load initial history
  useEffect(() => {
    const loadHistory = async () => {
      const history = await apiService.getChatHistory();
      setConversations(history);
    };
    loadHistory();
  }, []);

  // Update messages when active conversation changes
  useEffect(() => {
    if (activeConversationId) {
      const active = conversations.find(c => c.id === activeConversationId);
      if (active) {
        setMessages(active.messages);
      }
    } else {
      setMessages([]);
    }
  }, [activeConversationId, conversations]);

  const startNewChat = () => {
    setActiveConversationId(null);
    setMessages([]);
    setExplainMode('simple');
  };

  const loadConversation = (id: string) => {
    setActiveConversationId(id);
    const active = conversations.find(c => c.id === id);
    if (active) {
      setMessages(active.messages);
    }
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConversationId === id) {
      startNewChat();
    }
  };

  const clearAllConversations = () => {
    setConversations([]);
    startNewChat();
  };

  const addPinConversation = (id: string) => {
    // Simply prefix or mark conversation in local state
    setConversations(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, title: c.title.startsWith('📌 ') ? c.title.replace('📌 ', '') : `📌 ${c.title}` };
      }
      return c;
    }));
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Create user message
    const userMsg: Message = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsTyping(true);

    let currentConvId = activeConversationId;
    let updatedConversations = [...conversations];

    // If new chat, generate a conversation entry
    if (!currentConvId) {
      currentConvId = `conv-${Date.now()}`;
      setActiveConversationId(currentConvId);

      const words = text.split(' ');
      const title = words.slice(0, 4).join(' ') + (words.length > 4 ? '...' : '');

      const newConv: Conversation = {
        id: currentConvId,
        title: title || 'Legal Inquiry',
        category: 'General',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        preview: text.substring(0, 60) + (text.length > 60 ? '...' : ''),
        dateGroup: 'today',
        pinned: false,
        messages: [userMsg]
      };
      
      updatedConversations = [newConv, ...updatedConversations];
      setConversations(updatedConversations);
    } else {
      updatedConversations = conversations.map(c => {
        if (c.id === currentConvId) {
          return { ...c, messages: [...c.messages, userMsg] };
        }
        return c;
      });
      setConversations(updatedConversations);
    }

    try {
      // Fetch simulated AI response
      const aiResponse = await apiService.sendChatMessage(text, updatedMessages, explainMode);
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);

      // Save to conversations history
      setConversations(prev => prev.map(c => {
        if (c.id === currentConvId) {
          return { 
            ...c, 
            preview: aiResponse.content.substring(0, 65).replace(/\n/g, ' ') + (aiResponse.content.length > 65 ? '...' : ''),
            messages: [...c.messages, aiResponse] 
          };
        }
        return c;
      }));
    } catch (e) {
      setIsTyping(false);
      const errorMsg: Message = {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        content: '⚠️ **Something went wrong.** We couldn\'t connect to our mock assistant. Please try sending your message again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
    setMessages
  };
};
