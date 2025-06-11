export interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt: Date;
  reminderTime?: string;
  notificationsEnabled: boolean;
}

export interface Question {
  id: string;
  userId: string;
  text: string;
  type: 'toggle' | 'numeric' | 'text';
  order: number;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Answer {
  id: string;
  questionId: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  value: boolean | number | string;
  createdAt: Date;
}

export interface DailyProgress {
  date: string;
  totalQuestions: number;
  answeredQuestions: number;
  completionPercentage: number;
  streak: number;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface DataState {
  questions: Question[];
  answers: Answer[];
  currentStreak: number;
  longestStreak: number;
  isLoading: boolean;
}