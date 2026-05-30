import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../hooks/useAuth';

export function TopBar() {
  const { profile } = useAuth();
  
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
        <Feather name="arrow-left" size={24} color="#5C7C99" />
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>MediGuide</Text>
      
      <TouchableOpacity onPress={() => router.push('/settings/profile')}>
        {profile?.profile_image ? (
          <Image 
            source={{ uri: profile.profile_image }} 
            style={styles.avatar} 
          />
        ) : (
          <View style={[styles.avatar, { backgroundColor: '#E1E8ED', justifyContent: 'center', alignItems: 'center' }]}>
            <Feather name="user" size={20} color="#88B0C8" />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
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
    color: '#000000',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
