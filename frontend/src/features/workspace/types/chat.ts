export interface Citation {
  id: string;
  title: string;
  section: string;
  url: string;
  context: string;
  chunkId?: string;
  evidenceId?: string;
  pageNumber?: number;
  court?: string;
  citation?: string;
  relevanceScore?: number;
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

export interface StageTrace {
  stage_id: string;
  stage_number: number;
  stage_name: string;
  simple_name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  started_at?: number | null;
  completed_at?: number | null;
  duration_ms?: number | null;
  technical_details: Record<string, any>;
  status_message?: string | null;
  error?: string | null;
}

export interface PipelineTrace {
  trace_id: string;
  conversation_id?: string | null;
  user_id?: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: number;
  started_at?: number | null;
  completed_at?: number | null;
  total_duration_ms?: number | null;
  current_stage_id?: string | null;
  stages: StageTrace[];
}

export interface KeyPointItem {
  text: string;
  source_ids: string[];
}

export interface StructuredLegalAnswer {
  status: 'supported' | 'partially_supported' | 'sufficient' | 'partial' | 'insufficient';
  summary: string;
  summary_source_ids?: string[];
  key_points: KeyPointItem[];
  steps?: (KeyPointItem | string)[];
  conditions?: (KeyPointItem | string)[];
  exceptions?: (KeyPointItem | string)[];
  important_notes?: (KeyPointItem | string)[];
  unavailable_information?: string[];
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
  explainMode?: 'simple' | 'detailed';
  traceId?: string;
  evidenceState?: 'sufficient' | 'partial' | 'insufficient' | 'validation_failed';
  structuredAnswer?: StructuredLegalAnswer;
  conversationId?: string;
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

