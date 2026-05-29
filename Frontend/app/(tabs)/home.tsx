import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView, Image } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { TopBar } from '../../components/TopBar';
export default function HomeScreen() {
  const { profile } = useAuth();
  
  // Use profile name if available, otherwise fallback to "Alex" to match the mockup
  const firstName = profile?.first_name || 'Alex';

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        
        {/* Greeting */}
        <Text style={styles.greetingTitle}>Good Morning, {firstName}</Text>
        <Text style={styles.greetingSubtitle}>Your heart vitality is at 94% today.</Text>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#88B0C8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search doctors or programs..."
            placeholderTextColor="#88B0C8"
          />
        </View>

        {/* Card: Disease Prediction */}
        <TouchableOpacity 
          style={styles.card} 
          activeOpacity={0.8} 
          onPress={() => router.push('/(tabs)/check')}
        >
          <MaterialCommunityIcons 
            name="file-document-edit-outline" 
            size={32} 
            color="#2E4A62" 
            style={styles.cardIcon} 
          />
          <Text style={styles.cardTitle}>Disease{'\n'}Prediction</Text>
          <Text style={styles.cardSubtitle}>AI ANALYSIS</Text>
        </TouchableOpacity>

        {/* Card: Book a Doctor */}
        <TouchableOpacity 
          style={styles.card} 
          activeOpacity={0.8} 
          onPress={() => router.push('/(tabs)/doctors')}
        >
          <MaterialCommunityIcons 
            name="medical-bag" 
            size={32} 
            color="#2E4A62" 
            style={styles.cardIcon} 
          />
          <Text style={styles.cardTitle}>Book a Doctor</Text>
          <Text style={styles.cardSubtitle}>24/7 AVAILABILITY</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab}>
        <Feather name="plus" size={28} color="#FFF" />
      </TouchableOpacity>
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
    paddingBottom: 100, // Space for FAB
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
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  greetingTitle: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'serif',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F4FE',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 30,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  card: {
    backgroundColor: '#C8E8FE',
    borderRadius: 16,
    padding: 24,
    minHeight: 180,
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  cardIcon: {
    marginBottom: 30,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'serif',
    color: '#1A1A1A',
    marginBottom: 6,
    lineHeight: 28,
  },
  cardSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4A5B69',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 25,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#385F85',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});
