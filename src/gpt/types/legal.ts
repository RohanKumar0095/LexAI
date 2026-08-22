export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  xpReward: number;
}

export interface DailyLaw {
  id: string;
  title: string;
  explanation: string;
  example: string;
  readMoreUrl: string;
  quizQuestions: QuizQuestion[];
  date: string;
}

export interface MockArticle {
  id: string;
  title: string;
  section: string;
  description: string;
}

export interface LawCategory {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  description: string;
  articleCount: number;
  articles: MockArticle[];
}

export interface ScenarioStep {
  stepNumber: number;
  title: string;
  description: string;
  details: string;
}

export interface Scenario {
  id: string;
  title: string;
  icon: string; // Lucide icon name
  description: string;
  steps: ScenarioStep[];
}

export interface GovernmentResource {
  id: string;
  name: string;
  purpose: string;
  authority: string;
  url: string;
  category: string;
}
