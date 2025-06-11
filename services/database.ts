import * as SQLite from 'expo-sqlite';
import * as SecureStore from 'expo-secure-store';
import { User, Question, Answer } from '@/types';

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async initialize() {
    try {
      this.db = await SQLite.openDatabaseAsync('dailyquestions.db');
      await this.createTables();
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  private async createTables() {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.execAsync(`
      PRAGMA journal_mode = WAL;
      
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        display_name TEXT,
        reminder_time TEXT,
        notifications_enabled INTEGER DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS questions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        text TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('toggle', 'numeric', 'text')),
        order_index INTEGER NOT NULL,
        is_archived INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS answers (
        id TEXT PRIMARY KEY,
        question_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        date TEXT NOT NULL,
        value TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        UNIQUE(question_id, date)
      );

      CREATE INDEX IF NOT EXISTS idx_questions_user_id ON questions(user_id);
      CREATE INDEX IF NOT EXISTS idx_answers_user_id ON answers(user_id);
      CREATE INDEX IF NOT EXISTS idx_answers_date ON answers(date);
      CREATE INDEX IF NOT EXISTS idx_answers_question_id ON answers(question_id);
    `);
  }

  async getDatabase() {
    if (!this.db) {
      await this.initialize();
    }
    return this.db!;
  }

  // User operations
  async createUser(user: Omit<User, 'createdAt'> & { createdAt?: Date }): Promise<User> {
    const db = await this.getDatabase();
    const now = new Date().toISOString();
    const createdAt = user.createdAt?.toISOString() || now;

    await db.runAsync(
      `INSERT INTO users (id, email, display_name, reminder_time, notifications_enabled, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        user.id,
        user.email,
        user.displayName || null,
        user.reminderTime || null,
        user.notificationsEnabled ? 1 : 0,
        createdAt,
        now,
      ]
    );

    return {
      ...user,
      createdAt: new Date(createdAt),
    };
  }

  async getUserById(id: string): Promise<User | null> {
    const db = await this.getDatabase();
    const result = await db.getFirstAsync(
      'SELECT * FROM users WHERE id = ?',
      [id]
    ) as any;

    if (!result) return null;

    return {
      id: result.id,
      email: result.email,
      displayName: result.display_name,
      reminderTime: result.reminder_time,
      notificationsEnabled: Boolean(result.notifications_enabled),
      createdAt: new Date(result.created_at),
    };
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const db = await this.getDatabase();
    const result = await db.getFirstAsync(
      'SELECT * FROM users WHERE email = ?',
      [email]
    ) as any;

    if (!result) return null;

    return {
      id: result.id,
      email: result.email,
      displayName: result.display_name,
      reminderTime: result.reminder_time,
      notificationsEnabled: Boolean(result.notifications_enabled),
      createdAt: new Date(result.created_at),
    };
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const db = await this.getDatabase();
    const now = new Date().toISOString();

    const setClause = [];
    const values = [];

    if (updates.email !== undefined) {
      setClause.push('email = ?');
      values.push(updates.email);
    }
    if (updates.displayName !== undefined) {
      setClause.push('display_name = ?');
      values.push(updates.displayName);
    }
    if (updates.reminderTime !== undefined) {
      setClause.push('reminder_time = ?');
      values.push(updates.reminderTime);
    }
    if (updates.notificationsEnabled !== undefined) {
      setClause.push('notifications_enabled = ?');
      values.push(updates.notificationsEnabled ? 1 : 0);
    }

    setClause.push('updated_at = ?');
    values.push(now);
    values.push(id);

    await db.runAsync(
      `UPDATE users SET ${setClause.join(', ')} WHERE id = ?`,
      values
    );

    const updatedUser = await this.getUserById(id);
    if (!updatedUser) throw new Error('User not found after update');
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    const db = await this.getDatabase();
    await db.runAsync('DELETE FROM users WHERE id = ?', [id]);
  }

  // Question operations
  async createQuestion(question: Omit<Question, 'createdAt' | 'updatedAt'>): Promise<Question> {
    const db = await this.getDatabase();
    const now = new Date().toISOString();

    await db.runAsync(
      `INSERT INTO questions (id, user_id, text, type, order_index, is_archived, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        question.id,
        question.userId,
        question.text,
        question.type,
        question.order,
        question.isArchived ? 1 : 0,
        now,
        now,
      ]
    );

    return {
      ...question,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    };
  }

  async getQuestionsByUserId(userId: string): Promise<Question[]> {
    const db = await this.getDatabase();
    const results = await db.getAllAsync(
      'SELECT * FROM questions WHERE user_id = ? ORDER BY order_index ASC',
      [userId]
    ) as any[];

    return results.map(row => ({
      id: row.id,
      userId: row.user_id,
      text: row.text,
      type: row.type as Question['type'],
      order: row.order_index,
      isArchived: Boolean(row.is_archived),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));
  }

  async updateQuestion(id: string, updates: Partial<Question>): Promise<Question> {
    const db = await this.getDatabase();
    const now = new Date().toISOString();

    const setClause = [];
    const values = [];

    if (updates.text !== undefined) {
      setClause.push('text = ?');
      values.push(updates.text);
    }
    if (updates.type !== undefined) {
      setClause.push('type = ?');
      values.push(updates.type);
    }
    if (updates.order !== undefined) {
      setClause.push('order_index = ?');
      values.push(updates.order);
    }
    if (updates.isArchived !== undefined) {
      setClause.push('is_archived = ?');
      values.push(updates.isArchived ? 1 : 0);
    }

    setClause.push('updated_at = ?');
    values.push(now);
    values.push(id);

    await db.runAsync(
      `UPDATE questions SET ${setClause.join(', ')} WHERE id = ?`,
      values
    );

    const result = await db.getFirstAsync(
      'SELECT * FROM questions WHERE id = ?',
      [id]
    ) as any;

    if (!result) throw new Error('Question not found after update');

    return {
      id: result.id,
      userId: result.user_id,
      text: result.text,
      type: result.type as Question['type'],
      order: result.order_index,
      isArchived: Boolean(result.is_archived),
      createdAt: new Date(result.created_at),
      updatedAt: new Date(result.updated_at),
    };
  }

  async deleteQuestion(id: string): Promise<void> {
    const db = await this.getDatabase();
    await db.runAsync('DELETE FROM questions WHERE id = ?', [id]);
  }

  // Answer operations
  async createAnswer(answer: Omit<Answer, 'createdAt'>): Promise<Answer> {
    const db = await this.getDatabase();
    const now = new Date().toISOString();

    await db.runAsync(
      `INSERT OR REPLACE INTO answers (id, question_id, user_id, date, value, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        answer.id,
        answer.questionId,
        answer.userId,
        answer.date,
        JSON.stringify(answer.value),
        now,
      ]
    );

    return {
      ...answer,
      createdAt: new Date(now),
    };
  }

  async getAnswersByUserId(userId: string): Promise<Answer[]> {
    const db = await this.getDatabase();
    const results = await db.getAllAsync(
      'SELECT * FROM answers WHERE user_id = ? ORDER BY date DESC',
      [userId]
    ) as any[];

    return results.map(row => ({
      id: row.id,
      questionId: row.question_id,
      userId: row.user_id,
      date: row.date,
      value: JSON.parse(row.value),
      createdAt: new Date(row.created_at),
    }));
  }

  async getAnswersByDate(userId: string, date: string): Promise<Answer[]> {
    const db = await this.getDatabase();
    const results = await db.getAllAsync(
      'SELECT * FROM answers WHERE user_id = ? AND date = ?',
      [userId, date]
    ) as any[];

    return results.map(row => ({
      id: row.id,
      questionId: row.question_id,
      userId: row.user_id,
      date: row.date,
      value: JSON.parse(row.value),
      createdAt: new Date(row.created_at),
    }));
  }

  async deleteAnswer(id: string): Promise<void> {
    const db = await this.getDatabase();
    await db.runAsync('DELETE FROM answers WHERE id = ?', [id]);
  }

  // Utility methods
  async clearAllData(): Promise<void> {
    const db = await this.getDatabase();
    await db.execAsync(`
      DELETE FROM answers;
      DELETE FROM questions;
      DELETE FROM users;
    `);
  }
}

export const databaseService = new DatabaseService();