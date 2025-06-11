import * as SecureStore from 'expo-secure-store';
import { User } from '@/types';
import { databaseService } from './database';

class AuthService {
  private currentUser: User | null = null;
  private readonly USER_KEY = 'current_user';
  private readonly PASSWORD_KEY = 'user_password';

  async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) {
      return this.currentUser;
    }

    try {
      const userJson = await SecureStore.getItemAsync(this.USER_KEY);
      if (userJson) {
        const userData = JSON.parse(userJson);
        this.currentUser = {
          ...userData,
          createdAt: new Date(userData.createdAt),
        };
        return this.currentUser;
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }

    return null;
  }

  async signIn(email: string, password: string): Promise<User> {
    try {
      // Check if user exists in database
      const user = await databaseService.getUserByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }

      // Verify password (in a real app, you'd hash and compare)
      const storedPassword = await SecureStore.getItemAsync(`${this.PASSWORD_KEY}_${user.id}`);
      if (storedPassword !== password) {
        throw new Error('Invalid password');
      }

      // Store current user
      await SecureStore.setItemAsync(this.USER_KEY, JSON.stringify(user));
      this.currentUser = user;

      return user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  async signUp(email: string, password: string, displayName?: string): Promise<User> {
    try {
      // Check if user already exists
      const existingUser = await databaseService.getUserByEmail(email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Create new user
      const userId = this.generateId();
      const user: User = {
        id: userId,
        email,
        displayName,
        createdAt: new Date(),
        notificationsEnabled: true,
      };

      // Save to database
      const createdUser = await databaseService.createUser(user);

      // Store password securely
      await SecureStore.setItemAsync(`${this.PASSWORD_KEY}_${userId}`, password);

      // Store current user
      await SecureStore.setItemAsync(this.USER_KEY, JSON.stringify(createdUser));
      this.currentUser = createdUser;

      // Create default questions
      await this.createDefaultQuestions(userId);

      return createdUser;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(this.USER_KEY);
      this.currentUser = null;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    try {
      const updatedUser = await databaseService.updateUser(userId, updates);
      await SecureStore.setItemAsync(this.USER_KEY, JSON.stringify(updatedUser));
      this.currentUser = updatedUser;
      return updatedUser;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  async deleteAccount(userId: string): Promise<void> {
    try {
      // Delete from database
      await databaseService.deleteUser(userId);
      
      // Clear stored data
      await SecureStore.deleteItemAsync(this.USER_KEY);
      await SecureStore.deleteItemAsync(`${this.PASSWORD_KEY}_${userId}`);
      
      this.currentUser = null;
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  }

  private async createDefaultQuestions(userId: string): Promise<void> {
    const defaultQuestions = [
      { text: "Did I do my best to set clear goals today?", type: "toggle" as const },
      { text: "Did I do my best to make progress towards my goals today?", type: "toggle" as const },
      { text: "Did I do my best to find meaning today?", type: "toggle" as const },
      { text: "Did I do my best to be happy today?", type: "toggle" as const },
      { text: "Did I do my best to build positive relationships today?", type: "toggle" as const },
      { text: "Did I do my best to be engaged today?", type: "toggle" as const },
    ];

    for (let i = 0; i < defaultQuestions.length; i++) {
      const question = defaultQuestions[i];
      await databaseService.createQuestion({
        id: this.generateId(),
        userId,
        text: question.text,
        type: question.type,
        order: i,
        isArchived: false,
      });
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export const authService = new AuthService();