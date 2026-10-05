import { API_BASE_URL } from '../../../services/apiClient';
import type { DailyLaw } from '../types/legal';
import { mockDailyLaws } from '../data/mockLaws';

export async function getTodayLaw(): Promise<DailyLaw> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/rag/daily-law`);
    if (response.ok) {
      const data = await response.json();
      const fallback = mockDailyLaws[0];
      return {
        id: data.id || 'law-today',
        title: data.title || fallback.title,
        explanation: data.explanation || fallback.explanation,
        example: data.practical_tip || data.why_matters || fallback.example,
        readMoreUrl: data.readMoreUrl || fallback.readMoreUrl || '#',
        quizQuestions: data.quizQuestions || fallback.quizQuestions || [],
        date: new Date().toISOString().split('T')[0],
      };
    }
  } catch (err) {
    console.warn('Backend daily-law fetch failed, using fallback:', err);
  }
  return mockDailyLaws[0];
}
