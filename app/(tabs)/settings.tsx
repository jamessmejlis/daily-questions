import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Toggle } from '@/components/ui/Toggle';
import { Colors, Spacing, Typography } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { 
  User, 
  Bell, 
  HelpCircle, 
  Shield, 
  Download, 
  LogOut,
  Trash2,
  ChevronRight,
  Edit3
} from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

export default function SettingsScreen() {
  const { user, signOut, updateProfile, deleteAccount } = useAuth();
  const { questions } = useData();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [notificationsEnabled, setNotificationsEnabled] = useState(user?.notificationsEnabled ?? true);
  const [reminderTime, setReminderTime] = useState(user?.reminderTime || '20:00');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await updateProfile({
        displayName: displayName.trim() || undefined,
        notificationsEnabled,
        reminderTime,
      });
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/(auth)');
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all your data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!user) return;
            
            try {
              await deleteAccount();
              router.replace('/(auth)');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete account');
            }
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'This feature will be available soon. You\'ll be able to export your questions and answers as a CSV file.',
      [{ text: 'OK' }]
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    showChevron = true,
    danger = false 
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress: () => void;
    showChevron?: boolean;
    danger?: boolean;
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingIcon}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={[
          styles.settingTitle, 
          { color: danger ? colors.error : colors.text }
        ]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {showChevron && (
        <ChevronRight size={20} color={colors.textMuted} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Settings
          </Text>
        </View>

        {/* Profile Section */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Profile
            </Text>
            <TouchableOpacity
              onPress={() => setIsEditing(!isEditing)}
              style={styles.editButton}
            >
              <Edit3 size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
              {user?.email}
            </Text>
          </View>

          {isEditing ? (
            <View style={styles.editForm}>
              <Input
                label="Display Name"
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Enter your name"
              />
              
              <View style={styles.actions}>
                <Button
                  title="Cancel"
                  onPress={() => {
                    setIsEditing(false);
                    setDisplayName(user?.displayName || '');
                  }}
                  variant="outline"
                  style={styles.actionButton}
                />
                <Button
                  title="Save"
                  onPress={handleSaveProfile}
                  loading={loading}
                  style={styles.actionButton}
                />
              </View>
            </View>
          ) : (
            <View style={styles.profileDisplay}>
              <Text style={[styles.profileName, { color: colors.text }]}>
                {user?.displayName || 'No name set'}
              </Text>
            </View>
          )}
        </Card>

        {/* Notifications Section */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Notifications
          </Text>
          
          <View style={styles.notificationSetting}>
            <View style={styles.notificationInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                Daily Reminders
              </Text>
              <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                Get reminded to answer your daily questions
              </Text>
            </View>
            <Toggle
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          </View>

          {notificationsEnabled && (
            <View style={styles.reminderTime}>
              <Input
                label="Reminder Time"
                value={reminderTime}
                onChangeText={setReminderTime}
                placeholder="20:00"
              />
            </View>
          )}
        </Card>

        {/* Questions Section */}
        <Card style={styles.section}>
          <SettingItem
            icon={<HelpCircle size={20} color={colors.primary} />}
            title="Manage Questions"
            subtitle={`${questions.filter(q => !q.isArchived).length} active questions`}
            onPress={() => router.push('/questions')}
          />
        </Card>

        {/* Data Section */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Your Data
          </Text>
          
          <SettingItem
            icon={<Download size={20} color={colors.primary} />}
            title="Export Data"
            subtitle="Download your questions and answers"
            onPress={handleExportData}
          />
          
          <SettingItem
            icon={<Shield size={20} color={colors.primary} />}
            title="Privacy Policy"
            subtitle="How we protect your data"
            onPress={() => {
              Alert.alert(
                'Privacy Policy',
                'Your data is stored locally on your device and never sent to our servers. We respect your privacy and keep your reflections completely private.',
                [{ text: 'OK' }]
              );
            }}
          />
        </Card>

        {/* Account Actions */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Account
          </Text>
          
          <SettingItem
            icon={<LogOut size={20} color={colors.textSecondary} />}
            title="Sign Out"
            onPress={handleSignOut}
            showChevron={false}
          />
          
          <SettingItem
            icon={<Trash2 size={20} color={colors.error} />}
            title="Delete Account"
            subtitle="Permanently delete your account and data"
            onPress={handleDeleteAccount}
            showChevron={false}
            danger
          />
        </Card>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            Daily Questions Coach v1.0.0
          </Text>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            Made with ❤️ for better habits
          </Text>
        </View>
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
  },
  section: {
    marginBottom: Spacing.lg,
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
    marginBottom: Spacing.md,
  },
  editButton: {
    padding: Spacing.sm,
  },
  profileInfo: {
    marginBottom: Spacing.md,
  },
  profileEmail: {
    fontSize: Typography.sizes.sm,
    fontFamily: 'Inter-Regular',
  },
  profileDisplay: {
    paddingVertical: Spacing.sm,
  },
  profileName: {
    fontSize: Typography.sizes.base,
    fontFamily: 'Inter-Medium',
  },
  editForm: {
    marginTop: Spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  notificationSetting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  notificationInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  reminderTime: {
    marginTop: Spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  settingIcon: {
    marginRight: Spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: Typography.sizes.base,
    fontFamily: 'Inter-Medium',
    marginBottom: Spacing.xs,
  },
  settingSubtitle: {
    fontSize: Typography.sizes.sm,
    fontFamily: 'Inter-Regular',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.xs,
  },
  footerText: {
    fontSize: Typography.sizes.xs,
    fontFamily: 'Inter-Regular',
  },
});