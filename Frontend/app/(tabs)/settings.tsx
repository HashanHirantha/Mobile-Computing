import React from 'react';
import { router } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image, Alert } from 'react-native';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { TopBar } from '../../components/TopBar';
import { globalStyles } from '../../constants/globalStyles';

export default function SettingsScreen() {
  const { user, profile, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  const firstName = profile?.first_name || 'User';
  const lastName = profile?.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <TopBar />
      <ScrollView style={globalStyles.container} contentContainerStyle={globalStyles.content}>

        {/* Profile Card */}
        <View style={globalStyles.profileCard}>
          <View style={globalStyles.avatarContainer}>
            <Image 
              source={{ uri: profile?.profile_image || 'https://i.pravatar.cc/150?img=11' }} 
              style={globalStyles.avatarLarge} 
            />
            <View style={globalStyles.editBadge}>
              <MaterialCommunityIcons name="pencil" size={12} color="#FFF" />
            </View>
          </View>
          <View style={globalStyles.profileInfo}>
            <Text style={globalStyles.profileName}>{fullName}</Text>
            <Text style={globalStyles.profileTier}>VITALITY TIER: GOLD MEMBER</Text>
          </View>
        </View>

        {/* General Section */}
        <Text style={globalStyles.sectionTitle}>GENERAL</Text>
        <View style={globalStyles.card}>
          
          <TouchableOpacity style={globalStyles.row} onPress={() => router.push('/settings/profile')}>
            <View style={globalStyles.iconContainer}>
              <Feather name="user" size={20} color="#2E4A62" />
            </View>
            <View style={globalStyles.rowTextContainer}>
              <Text style={globalStyles.rowTitle}>Profile Settings</Text>
              <Text style={globalStyles.rowSubtitle}>Manage your personal health data</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#88B0C8" />
          </TouchableOpacity>

          <View style={[globalStyles.divider, { marginLeft: 72 }]} />

          <TouchableOpacity style={globalStyles.row} onPress={() => router.push('/settings/notifications')}>
            <View style={globalStyles.iconContainer}>
              <Feather name="bell" size={20} color="#2E4A62" />
            </View>
            <View style={globalStyles.rowTextContainer}>
              <Text style={globalStyles.rowTitle}>Notifications</Text>
              <Text style={globalStyles.rowSubtitle}>Alerts, sounds, and health reminders</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#88B0C8" />
          </TouchableOpacity>

          <View style={[globalStyles.divider, { marginLeft: 72 }]} />

          <TouchableOpacity style={globalStyles.row} onPress={() => router.push('/settings/security')}>
            <View style={globalStyles.iconContainer}>
              <Feather name="shield" size={20} color="#2E4A62" />
            </View>
            <View style={globalStyles.rowTextContainer}>
              <Text style={globalStyles.rowTitle}>Security</Text>
              <Text style={globalStyles.rowSubtitle}>Biometrics and data encryption</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#88B0C8" />
          </TouchableOpacity>

        </View>

        {/* Preference Section */}
        <Text style={globalStyles.sectionTitle}>PREFERENCE</Text>
        <View style={globalStyles.card}>
          
          <TouchableOpacity style={globalStyles.row}>
            <View style={globalStyles.iconContainer}>
              <Feather name="globe" size={20} color="#2E4A62" />
            </View>
            <View style={globalStyles.rowTextContainer}>
              <Text style={globalStyles.rowTitle}>Language</Text>
              <Text style={globalStyles.rowSubtitle}>English (United States)</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#88B0C8" />
          </TouchableOpacity>

          <View style={[globalStyles.divider, { marginLeft: 72 }]} />

          <TouchableOpacity style={globalStyles.row}>
            <View style={globalStyles.iconContainer}>
              <Feather name="help-circle" size={20} color="#2E4A62" />
            </View>
            <View style={globalStyles.rowTextContainer}>
              <Text style={globalStyles.rowTitle}>Help/Support</Text>
              <Text style={globalStyles.rowSubtitle}>FAQ and contact center</Text>
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
