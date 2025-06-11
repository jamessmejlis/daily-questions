import { Question, Answer } from '@/types';
import { databaseService } from './database';

class DataService {
  async getQuestions(userId: string): Promise<Question[]> {
    try {
      return await databaseService.getQuestionsByUserId(userId);
    } catch (error) {
      console.error('Error getting questions:', error);
      throw error;
    }
  }

  async addQuestion(userId: string, text: string, type: Question['type'], order: number): Promise<Question> {
    try {
      const question: Omit<Question, 'createdAt' | 'updatedAt'> = {
        id: this.generateId(),
        userId,
        text,
        type,
        order,
        isArchived: false,
      };

      return await databaseService.createQuestion(question);
    } catch (error) {
      console.error('Error adding question:', error);
      throw error;
    }
  }

  async updateQuestion(id: string, updates: Partial<Question>): Promise<Question> {
    try {
      return await databaseService.updateQuestion(id, updates);
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  }

  async deleteQuestion(id: string): Promise<void> {
    try {
      await databaseService.deleteQuestion(id);
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  }

  async getAnswers(userId: string): Promise<Answer[]> {
    try {
      return await databaseService.getAnswersByUserId(userId);
    } catch (error) {
      console.error('Error getting answers:', error);
      throw error;
    }
  }

  async saveAnswer(userId: string, questionId: string, date: string, value: boolean | number | string): Promise<Answer> {
    try {
      const answer: Omit<Answer, 'createdAt'> = {
        id: this.generateId(),
        questionId,
        userId,
        date,
        value,
      };

      return await databaseService.createAnswer(answer);
    } catch (error) {
      console.error('Error saving answer:', error);
      throw error;
    }
  }

  async getAnswersForDate(userId: string, date: string): Promise<Answer[]> {
    try {
      return await databaseService.getAnswersByDate(userId, date);
    } catch (error) {
      console.error('Error getting answers for date:', error);
      throw error;
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export const dataService = new DataService();