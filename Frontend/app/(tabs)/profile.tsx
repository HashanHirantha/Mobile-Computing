import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { colors, typography, spacing } from '../../constants/theme';

export default function ProfileScreen() {
  const { user, profile, signOut, loading } = useAuth();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  if (loading) return <LoadingSpinner />;

  const infoItems = [
    { label: 'Email', value: user?.email ?? '-' },
    { label: 'Phone', value: profile?.phone ?? 'Not set' },
    { label: 'Date of Birth', value: profile?.date_of_birth ?? 'Not set' },
    { label: 'Gender', value: profile?.gender ?? 'Not set' },
    { label: 'Blood Group', value: profile?.blood_group ?? 'Not set' },
    { label: 'Role', value: profile?.role ?? 'patient' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar & Name */}
      <View style={styles.avatarSection}>
        <Avatar
          uri={profile?.profile_image}
          name={`${profile?.first_name ?? ''} ${profile?.last_name ?? ''}`}
          size={80}
        />
        <Text style={styles.name}>
          {profile?.first_name} {profile?.last_name}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {/* Info Cards */}
      <View style={styles.card}>
        {infoItems.map((item, idx) => (
          <View
            key={item.label}
            style={[styles.infoRow, idx < infoItems.length - 1 && styles.infoRowBorder]}
          >
            <Text style={styles.infoLabel}>{item.label}</Text>
            <Text style={styles.infoValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      {/* Actions */}
      <Button
        title="Edit Profile"
        onPress={() => {/* TODO: navigate to edit profile */}}
        variant="outline"
      />
      <Button
        title="Medical History"
        onPress={() => {/* TODO */}}
        variant="outline"
      />
      <Button
        title="Sign Out"
        onPress={handleSignOut}
        variant="danger"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md },
  avatarSection: { alignItems: 'center', paddingVertical: spacing.xl },
  name: { ...typography.h2, color: colors.textPrimary, marginTop: spacing.sm },
  email: { ...typography.body, color: colors.textSecondary },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  infoRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  infoLabel: { ...typography.caption, color: colors.textSecondary },
  infoValue: { ...typography.body, color: colors.textPrimary, fontWeight: '500' },
});
