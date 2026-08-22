export interface Notification {
  id: string;
  title: string;
  type: 'daily-law' | 'law-update' | 'learning-reminder' | 'important-alert';
  message: string;
  timestamp: string;
  read: boolean;
}

export interface LearningProgress {
  day: number;
  totalXp: number;
  streakDays: number;
  completedDailyLawsCount: number;
  completedQuizzesCount: number;
  exploredCategoriesCount: number;
  savedArticlesCount: number;
  certificates: {
    id: string;
    title: string;
    description: string;
    unlockedAt: string;
  }[];
}

export interface UserSettings {
  language: 'en' | 'hi';
  theme: 'light' | 'dark' | 'system';
  locationState: string;
  locationDistrict: string;
  accessibilityTextSize: 'sm' | 'base' | 'lg' | 'xl';
  accessibilityReducedMotion: boolean;
  accessibilityHighContrast: boolean;
  chatHistoryEnabled: boolean;
  guestMode: boolean;
}
