import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image, Alert } from 'react-native';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';

export default function SettingsScreen() {
  const { user, profile, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  const firstName = profile?.first_name || 'Richard';
  const lastName = profile?.last_name || 'Brown';
  const fullName = `${firstName} ${lastName}`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
            <Feather name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <Image 
            source={{ uri: profile?.profile_image || 'https://i.pravatar.cc/150?img=11' }} 
            style={styles.smallAvatar} 
          />
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: profile?.profile_image || 'https://i.pravatar.cc/150?img=11' }} 
              style={styles.largeAvatar} 
            />
            <View style={styles.editBadge}>
              <MaterialCommunityIcons name="pencil" size={12} color="#FFF" />
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{fullName}</Text>
            <Text style={styles.profileTier}>VITALITY TIER: GOLD MEMBER</Text>
          </View>
        </View>

        {/* General Section */}
        <Text style={styles.sectionHeader}>GENERAL</Text>
        <View style={styles.sectionCard}>
          
          <TouchableOpacity style={styles.row}>
            <View style={styles.iconContainer}>
              <Feather name="user" size={20} color="#2E4A62" />
            </View>
            <View style={styles.rowTextContainer}>
              <Text style={styles.rowTitle}>Profile Settings</Text>
              <Text style={styles.rowSubtitle}>Manage your personal health data</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#88B0C8" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.row}>
            <View style={styles.iconContainer}>
              <Feather name="bell" size={20} color="#2E4A62" />
            </View>
            <View style={styles.rowTextContainer}>
              <Text style={styles.rowTitle}>Notifications</Text>
              <Text style={styles.rowSubtitle}>Alerts: sounds: and health reminders</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#88B0C8" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.row}>
            <View style={styles.iconContainer}>
              <Feather name="shield" size={20} color="#2E4A62" />
            </View>
            <View style={styles.rowTextContainer}>
              <Text style={styles.rowTitle}>Security</Text>
              <Text style={styles.rowSubtitle}>Biometrics and data encryption</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#88B0C8" />
          </TouchableOpacity>

        </View>

        {/* Preference Section */}
        <Text style={styles.sectionHeader}>PREFERENCE</Text>
        <View style={styles.sectionCard}>
          
          <TouchableOpacity style={styles.row}>
            <View style={styles.iconContainer}>
              <Feather name="globe" size={20} color="#2E4A62" />
            </View>
            <View style={styles.rowTextContainer}>
              <Text style={styles.rowTitle}>Language</Text>
              <Text style={styles.rowSubtitle}>English (United States)</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#88B0C8" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.row}>
            <View style={styles.iconContainer}>
              <Feather name="help-circle" size={20} color="#2E4A62" />
            </View>
            <View style={styles.rowTextContainer}>
              <Text style={styles.rowTitle}>Help/Support</Text>
              <Text style={styles.rowSubtitle}>FAQ and contact center</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#88B0C8" />
          </TouchableOpacity>

        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  smallAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  profileCard: {
    backgroundColor: '#C8E8FE',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  largeAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#C8E8FE',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#004C70',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#C8E8FE',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  profileTier: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4A5B69',
    letterSpacing: 0.5,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4A5B69',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: '#C8E8FE',
    borderRadius: 16,
    marginBottom: 30,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rowTextContainer: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    color: '#1A1A1A',
    marginBottom: 2,
  },
  rowSubtitle: {
    fontSize: 12,
    color: '#4A5B69',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginLeft: 72, // Aligns with the text
  },
  signOutButton: {
    backgroundColor: '#C8E8FE',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 10,
  },
  signOutText: {
    fontSize: 16,
    color: '#D32F2F',
  },
});
