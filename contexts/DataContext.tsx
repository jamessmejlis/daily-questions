import React, { createContext, useContext, useEffect, useState } from 'react';
import { Question, Answer, DataState } from '@/types';
import { dataService } from '@/services/dataService';
import { useAuth } from './AuthContext';

interface DataContextType extends DataState {
  addQuestion: (text: string, type: Question['type']) => Promise<void>;
  updateQuestion: (id: string, updates: Partial<Question>) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;
  archiveQuestion: (id: string) => Promise<void>;
  saveAnswer: (questionId: string, value: boolean | number | string) => Promise<void>;
  getTodayAnswers: () => Answer[];
  getAnswersForDate: (date: string) => Answer[];
  calculateStreaks: () => { current: number; longest: number };
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [dataState, setDataState] = useState<DataState>({
    questions: [],
    answers: [],
    currentStreak: 0,
    longestStreak: 0,
    isLoading: false,
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData();
    } else {
      setDataState({
        questions: [],
        answers: [],
        currentStreak: 0,
        longestStreak: 0,
        isLoading: false,
      });
    }
  }, [isAuthenticated, user]);

  const loadUserData = async () => {
    if (!user) return;
    
    setDataState(prev => ({ ...prev, isLoading: true }));
    try {
      const [questions, answers] = await Promise.all([
        dataService.getQuestions(user.id),
        dataService.getAnswers(user.id),
      ]);
      
      const streaks = calculateStreaksFromData(answers);
      
      setDataState({
        questions,
        answers,
        currentStreak: streaks.current,
        longestStreak: streaks.longest,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading user data:', error);
      setDataState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const calculateStreaksFromData = (answers: Answer[]) => {
    // Group answers by date
    const answersByDate = answers.reduce((acc, answer) => {
      if (!acc[answer.date]) {
        acc[answer.date] = [];
      }
      acc[answer.date].push(answer);
      return acc;
    }, {} as Record<string, Answer[]>);

    // Get unique dates and sort them
    const dates = Object.keys(answersByDate).sort();
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date().toISOString().split('T')[0];
    
    // Calculate streaks
    for (let i = dates.length - 1; i >= 0; i--) {
      const date = dates[i];
      const dayAnswers = answersByDate[date];
      
      if (dayAnswers.length > 0) {
        tempStreak++;
        if (date === today || (i === dates.length - 1)) {
          currentStreak = tempStreak;
        }
      } else {
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
        tempStreak = 0;
        if (date === today) {
          currentStreak = 0;
        }
      }
    }
    
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }

    return { current: currentStreak, longest: longestStreak };
  };

  const addQuestion = async (text: string, type: Question['type']) => {
    if (!user) return;
    
    try {
      const question = await dataService.addQuestion(user.id, text, type, dataState.questions.length);
      setDataState(prev => ({
        ...prev,
        questions: [...prev.questions, question],
      }));
    } catch (error) {
      throw error;
    }
  };

  const updateQuestion = async (id: string, updates: Partial<Question>) => {
    try {
      const updatedQuestion = await dataService.updateQuestion(id, updates);
      setDataState(prev => ({
        ...prev,
        questions: prev.questions.map(q => q.id === id ? updatedQuestion : q),
      }));
    } catch (error) {
      throw error;
    }
  };

  const deleteQuestion = async (id: string) => {
    try {
      await dataService.deleteQuestion(id);
      setDataState(prev => ({
        ...prev,
        questions: prev.questions.filter(q => q.id !== id),
        answers: prev.answers.filter(a => a.questionId !== id),
      }));
    } catch (error) {
      throw error;
    }
  };

  const archiveQuestion = async (id: string) => {
    try {
      await updateQuestion(id, { isArchived: true });
    } catch (error) {
      throw error;
    }
  };

  const saveAnswer = async (questionId: string, value: boolean | number | string) => {
    if (!user) return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const answer = await dataService.saveAnswer(user.id, questionId, today, value);
      
      setDataState(prev => {
        const existingAnswerIndex = prev.answers.findIndex(
          a => a.questionId === questionId && a.date === today
        );
        
        let newAnswers;
        if (existingAnswerIndex >= 0) {
          newAnswers = [...prev.answers];
          newAnswers[existingAnswerIndex] = answer;
        } else {
          newAnswers = [...prev.answers, answer];
        }
        
        const streaks = calculateStreaksFromData(newAnswers);
        
        return {
          ...prev,
          answers: newAnswers,
          currentStreak: streaks.current,
          longestStreak: streaks.longest,
        };
      });
    } catch (error) {
      throw error;
    }
  };

  const getTodayAnswers = () => {
    const today = new Date().toISOString().split('T')[0];
    return dataState.answers.filter(answer => answer.date === today);
  };

  const getAnswersForDate = (date: string) => {
    return dataState.answers.filter(answer => answer.date === date);
  };

  const calculateStreaks = () => {
    return { current: dataState.currentStreak, longest: dataState.longestStreak };
  };

  const refreshData = async () => {
    await loadUserData();
  };

  return (
    <DataContext.Provider
      value={{
        ...dataState,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        archiveQuestion,
        saveAnswer,
        getTodayAnswers,
        getAnswersForDate,
        calculateStreaks,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}