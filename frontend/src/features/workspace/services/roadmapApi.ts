import { API_BASE_URL } from '../../../services/apiClient';
import type { Roadmap } from '../types/chat';

export async function generateRoadmap(roadmapId: string): Promise<Roadmap> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/roadmaps/${encodeURIComponent(roadmapId)}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn('Backend roadmap fetch failed, using fallback:', err);
  }

  return {
    id: roadmapId,
    title: `Roadmap: ${roadmapId.replace('-', ' ').toUpperCase()}`,
    steps: [
      {
        number: 1,
        title: 'Collect Evidence',
        description: 'Document and gather all relevant evidence including bills, chat logs, photos, and emails.',
      },
      {
        number: 2,
        title: 'Identify Correct Legal Forum',
        description: 'Figure out the jurisdiction (local police station, consumer court, or labor commissioner).',
      },
      {
        number: 3,
        title: 'File Formal Grievance',
        description: 'Draft the grievance, attach evidence, and submit online or physically.',
      },
    ],
  };
}
