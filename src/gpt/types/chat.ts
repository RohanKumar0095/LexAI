export interface Citation {
  id: string;
  title: string;
  section: string;
  url: string;
  context: string;
}

export interface RoadmapStep {
  number: number;
  title: string;
  description: string;
  details?: string;
  documents?: string[];
  rights?: string[];
  notes?: string;
}

export interface Roadmap {
  id: string;
  title: string;
  steps: RoadmapStep[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: Citation[];
  followUps?: string[];
  roadmapId?: string;
  evidenceChecklist?: string[];
  explainMode?: 'normal' | 'detailed' | 'personalized'; // Updated to Normal, Personalized, Detailed
}

export interface Conversation {
  id: string;
  title: string;
  category: string;
  timestamp: string;
  preview?: string; // Snippet of first or last message
  dateGroup: 'today' | 'yesterday' | 'week' | 'older'; // Date category grouping
  pinned?: boolean; // Pinned state
  messages: Message[];
}
