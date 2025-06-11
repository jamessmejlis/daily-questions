import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { Input } from '@/components/ui/Input';
import { Colors, Spacing, Typography } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Question, Answer } from '@/types';
import { Plus, CheckCircle } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

export default function TodayScreen() {
  const { user, isAuthenticated } = useAuth();
  const {
    questions,
    saveAnswer,
    getTodayAnswers,
    currentStreak,
    isLoading,
  } = useData();
  
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [todayAnswers, setTodayAnswers] = useState<Answer[]>([]);
  const [answerValues, setAnswerValues] = useState<Record<string, boolean | number | string>>({});
  const [showCompletion, setShowCompletion] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)');
      return;
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const answers = getTodayAnswers();
    setTodayAnswers(answers);
    
    // Initialize answer values from existing answers
    const values: Record<string, boolean | number | string> = {};
    answers.forEach(answer => {
      values[answer.questionId] = answer.value;
    });
    setAnswerValues(values);
  }, [getTodayAnswers]);

  const activeQuestions = questions.filter(q => !q.isArchived);
  const answeredCount = todayAnswers.length;
  const totalCount = activeQuestions.length;
  const completionPercentage = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;
  const isCompleted = answeredCount === totalCount && totalCount > 0;

  const handleAnswerChange = async (questionId: string, value: boolean | number | string) => {
    try {
      setAnswerValues(prev => ({ ...prev, [questionId]: value }));
      await saveAnswer(questionId, value);
      
      const newAnswers = getTodayAnswers();
      setTodayAnswers(newAnswers);
      
      // Check if just completed all questions
      if (newAnswers.length === activeQuestions.length && !showCompletion) {
        setShowCompletion(true);
        setTimeout(() => setShowCompletion(false), 3000);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save answer. Please try again.');
    }
  };

  const renderQuestionInput = (question: Question) => {
    const value = answerValues[question.id];

    switch (question.type) {
      case 'toggle':
        return (
          <Toggle
            value={Boolean(value)}
            onValueChange={(newValue) => handleAnswerChange(question.id, newValue)}
          />
        );
      case 'numeric':
        return (
          <Input
            value={value?.toString() || ''}
            onChangeText={(text) => {
              const numValue = parseFloat(text) || 0;
              handleAnswerChange(question.id, numValue);
            }}
            placeholder="Enter a number"
            keyboardType="numeric"
            style={styles.numericInput}
          />
        );
      case 'text':
        return (
          <Input
            value={value?.toString() || ''}
            onChangeText={(text) => handleAnswerChange(question.id, text)}
            placeholder="Enter your answer"
            multiline
            style={styles.textInput}
          />
        );
      default:
        return null;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading your questions...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: colors.text }]}>
            Hello{user?.displayName ? `, ${user.displayName}` : ''}! 👋
          </Text>
          <Text style={[styles.date, { color: colors.textSecondary }]}>
            {formatDate(new Date())}
          </Text>
        </View>

        <Card style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={[styles.progressTitle, { color: colors.text }]}>
                Today's Progress
              </Text>
              <Text style={[styles.progressSubtitle, { color: colors.textSecondary }]}>
                {answeredCount} of {totalCount} questions answered
              </Text>
            </View>
            {isCompleted && (
              <CheckCircle size={24} color={colors.success} />
            )}
          </View>
          
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: colors.primary,
                  width: `${completionPercentage}%`,
                },
              ]}
            />
          </View>
          
          <View style={styles.streakContainer}>
            <Text style={[styles.streakText, { color: colors.textSecondary }]}>
              Current streak: {' '}
              <Text style={[styles.streakNumber, { color: colors.primary }]}>
                {currentStreak} days
              </Text>
            </Text>
          </View>
        </Card>

        {showCompletion && (
          <Card style={[styles.completionCard, { backgroundColor: colors.success }]}>
            <Text style={styles.completionText}>
              🎉 Well done! You've completed all your questions for today!
            </Text>
          </Card>
        )}

        <View style={styles.questionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Today's Questions
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/questions/add')}
            >
              <Plus size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {activeQuestions.length === 0 ? (
            <Card style={styles.emptyState}>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No questions yet
              </Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Add your first reflection question to get started
              </Text>
              <Button
                title="Add Question"
                onPress={() => router.push('/questions/add')}
                style={styles.emptyButton}
              />
            </Card>
          ) : (
            <View style={styles.questionsList}>
              {activeQuestions.map((question, index) => (
                <Card key={question.id} style={styles.questionCard}>
                  <View style={styles.questionHeader}>
                    <Text style={[styles.questionNumber, { color: colors.textMuted }]}>
                      {index + 1}
                    </Text>
                    <View style={styles.questionContent}>
                      <Text style={[styles.questionText, { color: colors.text }]}>
                        {question.text}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.questionInput}>
                    {renderQuestionInput(question)}
                  </View>
                </Card>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: Typography.sizes.lg,
    fontFamily: 'Inter-Medium',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.lg,
  },
  greeting: {
    fontSize: Typography.sizes['2xl'],
    fontFamily: 'Inter-Bold',
    marginBottom: Spacing.xs,
  },
  date: {
    fontSize: Typography.sizes.base,
    fontFamily: 'Inter-Regular',
  },
  progressCard: {
    marginBottom: Spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  progressTitle: {
    fontSize: Typography.sizes.lg,
    fontFamily: 'Inter-SemiBold',
  },
  progressSubtitle: {
    fontSize: Typography.sizes.sm,
    fontFamily: 'Inter-Regular',
    marginTop: Spacing.xs,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: Spacing.md,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  streakContainer: {
    alignItems: 'center',
  },
  streakText: {
    fontSize: Typography.sizes.sm,
    fontFamily: 'Inter-Regular',
  },
  streakNumber: {
    fontFamily: 'Inter-Bold',
  },
  completionCard: {
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  completionText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.base,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  questionsSection: {
    paddingBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontFamily: 'Inter-SemiBold',
  },
  addButton: {
    padding: Spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyTitle: {
    fontSize: Typography.sizes.lg,
    fontFamily: 'Inter-SemiBold',
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: Typography.sizes.base,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  emptyButton: {
    minWidth: 150,
  },
  questionsList: {
    gap: Spacing.md,
  },
  questionCard: {
    padding: Spacing.lg,
  },
  questionHeader: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  questionNumber: {
    fontSize: Typography.sizes.sm,
    fontFamily: 'Inter-Medium',
    marginRight: Spacing.md,
    marginTop: 2,
  },
  questionContent: {
    flex: 1,
  },
  questionText: {
    fontSize: Typography.sizes.base,
    fontFamily: 'Inter-Medium',
    lineHeight: 22,
  },
  questionInput: {
    marginLeft: 24,
  },
  numericInput: {
    marginBottom: 0,
  },
  textInput: {
    marginBottom: 0,
    minHeight: 80,
  },
});