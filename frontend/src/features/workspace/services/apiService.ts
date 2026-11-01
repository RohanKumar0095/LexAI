/**
 * Consolidated Workspace API Service for LexAI India.
 * Integrates modular feature APIs (chat, document analysis, complaints, roadmaps, daily law)
 * and authoritative auth APIs using the centralized API client.
 */

import { API_BASE_URL } from '../../../services/apiClient';
import type { DailyLaw, Scenario } from '../types/legal';
import { mockDailyLaws } from '../data/mockLaws';
import { mockScenarios } from '../data/mockScenarios';

import { 
  sendChatMessage, 
  getPipelineTrace,
  fetchUserConversations,
  fetchConversationDetails,
  renameUserConversation,
  deleteUserConversation,
  clearAllUserConversations
} from './chatApi';
import { getTodayLaw } from './dailyLawApi';
import { analyzeDocument, type DocumentAnalysisResult } from './documentApi';
import { generateComplaint, type ComplaintData } from './complaintApi';
import { generateRoadmap } from './roadmapApi';
import { loginApi, signupApi, logoutApi, getMeApi } from '../../../services/authApi';

export {
  sendChatMessage,
  getPipelineTrace,
  fetchUserConversations,
  fetchConversationDetails,
  renameUserConversation,
  deleteUserConversation,
  clearAllUserConversations,
  getTodayLaw,
  analyzeDocument,
  generateComplaint,
  generateRoadmap,
  type DocumentAnalysisResult,
  type ComplaintData,
};

export const apiService = {
  /**
   * Health check to test backend reachability
   */
  async checkHealth(): Promise<{ status: string; database_connected?: boolean; chroma_connected?: boolean }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/rag/health`);
      if (response.ok) {
        return await response.json();
      }
      return { status: 'degraded' };
    } catch {
      return { status: 'unreachable' };
    }
  },

  sendChatMessage,
  getPipelineTrace,
  getTodayLaw,
  analyzeDocument,
  generateComplaint,
  generateRoadmap,

  // Supabase-backed persistent chat history
  getChatHistory: fetchUserConversations,
  getConversations: fetchUserConversations,
  fetchConversationDetails,
  renameConversation: renameUserConversation,
  deleteConversation: deleteUserConversation,
  clearAllConversations: clearAllUserConversations,

  getScenarios(): Promise<Scenario[]> {
    return Promise.resolve(mockScenarios);
  },

  getDailyLaws(): Promise<DailyLaw[]> {
    return Promise.resolve(mockDailyLaws);
  },

  // Authoritative auth integration (delegated to authApi.ts)
  login: loginApi,
  signup: signupApi,
  logout: logoutApi,
  getCurrentUser: getMeApi,
};

export default apiService;
