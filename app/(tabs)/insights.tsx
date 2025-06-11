import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useData } from '@/contexts/DataContext';
import { Card } from '@/components/ui/Card';
import { Colors, Spacing, Typography } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Calendar, TrendingUp, Target } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function InsightsScreen() {
  const {
    questions,
    answers,
    currentStreak,
    longestStreak,
    getAnswersForDate,
  } = useData();
  
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [calendarData, setCalendarData] = useState<Record<string, number>>({});

  useEffect(() => {
    generateCalendarData();
  }, [answers, questions]);

  const generateCalendarData = () => {
    const data: Record<string, number> = {};
    const activeQuestions = questions.filter(q => !q.isArchived);
    
    // Group answers by date
    const answersByDate = answers.reduce((acc, answer) => {
      if (!acc[answer.date]) {
        acc[answer.date] = [];
      }
      acc[answer.date].push(answer);
      return acc;
    }, {} as Record<string, typeof answers>);

    // Calculate completion percentage for each date
    Object.keys(answersByDate).forEach(date => {
      const dayAnswers = answersByDate[date];
      const completion = activeQuestions.length > 0 
        ? (dayAnswers.length / activeQuestions.length) * 100 
        : 0;
      data[date] = Math.round(completion);
    });

    setCalendarData(data);
  };

  const getLast30Days = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    
    return days;
  };

  const getCompletionColor = (percentage: number) => {
    if (percentage === 0) return colors.border;
    if (percentage < 50) return '#FEF3C7'; // Light yellow
    if (percentage < 100) return '#FDE68A'; // Medium yellow
    return colors.success; // Green for 100%
  };

  const calculateWeeklyAverage = () => {
    const last7Days = getLast30Days().slice(-7);
    const completions = last7Days.map(date => calendarData[date] || 0);
    const average = completions.reduce((sum, val) => sum + val, 0) / 7;
    return Math.round(average);
  };

  const calculateMonthlyAverage = () => {
    const last30Days = getLast30Days();
    const completions = last30Days.map(date => calendarData[date] || 0);
    const average = completions.reduce((sum, val) => sum + val, 0) / 30;
    return Math.round(average);
  };

  const renderCalendarGrid = () => {
    const last30Days = getLast30Days();
    const cellSize = (width - Spacing.lg * 2 - Spacing.md * 2 - 6 * 4) / 7; // 7 columns with gaps

    return (
      <View style={styles.calendarGrid}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <Text
            key={index}
            style={[
              styles.dayLabel,
              { color: colors.textMuted, width: cellSize },
            ]}
          >
            {day}
          </Text>
        ))}
        
        {last30Days.map((date, index) => {
          const dayOfWeek = new Date(date).getDay();
          const completion = calendarData[date] || 0;
          const isToday = date === new Date().toISOString().split('T')[0];
          
          return (
            <View
              key={date}
              style={[
                styles.calendarCell,
                {
                  backgroundColor: getCompletionColor(completion),
                  width: cellSize,
                  height: cellSize,
                  borderColor: isToday ? colors.primary : 'transparent',
                  borderWidth: isToday ? 2 : 0,
                },
              ]}
            >
              <Text style={[styles.cellText, { color: colors.text }]}>
                {new Date(date).getDate()}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Your Progress
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Track your reflection journey
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <View style={styles.statHeader}>
              <Target size={20} color={colors.primary} />
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Current Streak
              </Text>
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {currentStreak}
            </Text>
            <Text style={[styles.statUnit, { color: colors.textMuted }]}>
              days
            </Text>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statHeader}>
              <TrendingUp size={20} color={colors.accent} />
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Best Streak
              </Text>
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {longestStreak}
            </Text>
            <Text style={[styles.statUnit, { color: colors.textMuted }]}>
              days
            </Text>
          </Card>
        </View>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <View style={styles.statHeader}>
              <Calendar size={20} color={colors.secondary} />
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                This Week
              </Text>
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {calculateWeeklyAverage()}%
            </Text>
            <Text style={[styles.statUnit, { color: colors.textMuted }]}>
              average
            </Text>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statHeader}>
              <Calendar size={20} color={colors.warning} />
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                This Month
              </Text>
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {calculateMonthlyAverage()}%
            </Text>
            <Text style={[styles.statUnit, { color: colors.textMuted }]}>
              average
            </Text>
          </Card>
        </View>

        {/* Calendar Heatmap */}
        <Card style={styles.calendarCard}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Last 30 Days
          </Text>
          <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
            Your daily completion rate
          </Text>
          
          {renderCalendarGrid()}
          
          <View style={styles.legend}>
            <Text style={[styles.legendText, { color: colors.textMuted }]}>
              Less
            </Text>
            <View style={styles.legendColors}>
              {[0, 25, 50, 75, 100].map((percentage, index) => (
                <View
                  key={index}
                  style={[
                    styles.legendColor,
                    { backgroundColor: getCompletionColor(percentage) },
                  ]}
                />
              ))}
            </View>
            <Text style={[styles.legendText, { color: colors.textMuted }]}>
              More
            </Text>
          </View>
        </Card>

        {/* Insights */}
        <Card style={styles.insightsCard}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Insights
          </Text>
          
          <View style={styles.insight}>
            <Text style={[styles.insightText, { color: colors.textSecondary }]}>
              {currentStreak > 0 
                ? `🔥 You're on a ${currentStreak}-day streak! Keep it up!`
                : "💪 Start a new streak today by answering your questions."
              }
            </Text>
          </View>
          
          {longestStreak > currentStreak && (
            <View style={styles.insight}>
              <Text style={[styles.insightText, { color: colors.textSecondary }]}>
                🎯 Your best streak was {longestStreak} days. You can beat that!
              </Text>
            </View>
          )}
          
          <View style={styles.insight}>
            <Text style={[styles.insightText, { color: colors.textSecondary }]}>
              📊 You have {questions.filter(q => !q.isArchived).length} active questions
              {questions.filter(q => q.isArchived).length > 0 && 
                ` and ${questions.filter(q => q.isArchived).length} archived`
              }.
            </Text>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.sizes['2xl'],
    fontFamily: 'Inter-Bold',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.sizes.base,
    fontFamily: 'Inter-Regular',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  statHeader: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    fontFamily: 'Inter-Medium',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: Spacing.xs,
  },
  statValue: {
    fontSize: Typography.sizes['3xl'],
    fontFamily: 'Inter-Bold',
    marginBottom: Spacing.xs,
  },
  statUnit: {
    fontSize: Typography.sizes.sm,
    fontFamily: 'Inter-Regular',
  },
  calendarCard: {
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    fontSize: Typography.sizes.lg,
    fontFamily: 'Inter-SemiBold',
    marginBottom: Spacing.xs,
  },
  cardSubtitle: {
    fontSize: Typography.sizes.sm,
    fontFamily: 'Inter-Regular',
    marginBottom: Spacing.lg,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: Spacing.md,
  },
  dayLabel: {
    fontSize: Typography.sizes.xs,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  calendarCell: {
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    fontSize: Typography.sizes.xs,
    fontFamily: 'Inter-Medium',
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  legendText: {
    fontSize: Typography.sizes.xs,
    fontFamily: 'Inter-Regular',
  },
  legendColors: {
    flexDirection: 'row',
    gap: 2,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  insightsCard: {
    marginBottom: Spacing.xl,
  },
  insight: {
    marginBottom: Spacing.md,
  },
  insightText: {
    fontSize: Typography.sizes.base,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
});