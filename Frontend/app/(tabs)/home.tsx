import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import { colors, typography, spacing } from '../../constants/theme';

export default function HomeScreen() {
  const { user, profile } = useAuth();

  const quickActions = [
    { id: 'check', label: 'Check Symptoms', icon: '🩺', route: '/(tabs)/check', color: colors.primary },
    { id: 'doctors', label: 'Find Doctors', icon: '👨‍⚕️', route: '/(tabs)/doctors', color: colors.secondary },
    { id: 'history', label: 'My History', icon: '📋', route: '/(tabs)/history', color: '#FF9500' },
    { id: 'profile', label: 'My Profile', icon: '👤', route: '/(tabs)/profile', color: '#AF52DE' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Hello, {profile?.first_name ?? 'there'} 👋
          </Text>
          <Text style={styles.subGreeting}>How are you feeling today?</Text>
        </View>
      </View>

      {/* Emergency Banner */}
      <View style={styles.emergencyBanner}>
        <Text style={styles.emergencyIcon}>🚨</Text>
        <View style={styles.emergencyText}>
          <Text style={styles.emergencyTitle}>Emergency?</Text>
          <Text style={styles.emergencySubtitle}>Call 1990 (Sri Lanka Emergency)</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.grid}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[styles.actionCard, { borderLeftColor: action.color }]}
            onPress={() => router.push(action.route as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.actionIcon}>{action.icon}</Text>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          ⚠️ MediGuide is a decision-support tool and does NOT replace professional
          medical advice. Always consult a licensed healthcare provider.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  header: { marginBottom: spacing.xl },
  greeting: { ...typography.h1, color: colors.textPrimary },
  subGreeting: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
  emergencyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.accent,
    gap: spacing.sm,
  },
  emergencyIcon: { fontSize: 24 },
  emergencyText: {},
  emergencyTitle: { ...typography.body, color: colors.accent, fontWeight: '700' },
  emergencySubtitle: { ...typography.caption, color: colors.textSecondary },
  sectionTitle: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.xl },
  actionCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIcon: { fontSize: 32, marginBottom: spacing.sm },
  actionLabel: { ...typography.body, color: colors.textPrimary, fontWeight: '600' },
  disclaimer: {
    backgroundColor: '#FFF8E6',
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#FFD60A',
  },
  disclaimerText: { ...typography.caption, color: '#7A5F00' },
});
