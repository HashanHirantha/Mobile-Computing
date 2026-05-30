import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { TopBar } from '../../components/TopBar';
import { globalStyles } from '../../constants/globalStyles';
export default function SymptomCheckerScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const selectedSymptoms = ['Palpitations', 'Fatigue'];
  const allSymptoms = ['Palpitations', 'Chest Tightness', 'Fatigue', 'Dizziness', 'Swollen Ankles'];

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <TopBar />
      <ScrollView style={globalStyles.container} contentContainerStyle={styles.content}>
        
        {/* Huge Title */}
        <Text style={styles.mainTitle}>Symptom Checker</Text>
        <Text style={globalStyles.pageDescription}>
          Tell us how you're feeling. Our AI analyzes your inputs for potential cardiac patterns.
        </Text>

        {/* Step Card */}
        <View style={globalStyles.cardPadded}>
          <View style={styles.stepContainer}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressText}>75%</Text>
            </View>
            <View style={styles.stepTextContainer}>
              <Text style={styles.sectionLabel}>STEP 3 OF 4</Text>
              <Text style={styles.stepDescription}>Analyzing symptoms & history</Text>
            </View>
          </View>
        </View>

        {/* Add Symptom Card */}
        <View style={globalStyles.cardPadded}>
          <Text style={globalStyles.sectionTitle}>ADD SYMPTOM</Text>
          <View style={styles.inputContainer}>
            <Feather name="search" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.input}
              placeholder="e.g., Shortness of breath"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Common Observations Card */}
        <View style={globalStyles.cardPadded}>
          <Text style={globalStyles.sectionTitle}>COMMON OBSERVATIONS</Text>
          <View style={styles.chipsContainer}>
            {allSymptoms.map((symptom) => {
              const isSelected = selectedSymptoms.includes(symptom);
              return (
                <View key={symptom} style={styles.chip}>
                  <Text style={styles.chipText}>{symptom}</Text>
                  {isSelected && <Feather name="check" size={14} color="#000" style={styles.chipIcon} />}
                </View>
              );
            })}
          </View>
        </View>

        {/* Duration Card */}
        <View style={globalStyles.cardPadded}>
          <Text style={globalStyles.sectionTitle}>DURATION</Text>
          <View style={styles.durationRow}>
            <Text style={styles.durationLabel}>Ongoing since:</Text>
            <Text style={styles.durationValue}>3 days</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarActive} />
            <View style={styles.progressBarInactive} />
          </View>
          <View style={styles.infoRow}>
            <Feather name="info" size={14} color="#666" />
            <Text style={styles.infoText}>AI needs more context for precision</Text>
          </View>
        </View>

        {/* Generate Prediction Button */}
        <TouchableOpacity style={styles.generateButton}>
          <Text style={styles.generateButtonText}>Generate Prediction</Text>
          <MaterialCommunityIcons name="brain" size={20} color="#000" />
        </TouchableOpacity>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          * This tool is for informational purposes and not a substitute for professional diagnosis.
        </Text>

        {/* Preliminary Insights Card */}
        <View style={globalStyles.cardPadded}>
          <View style={styles.insightsHeader}>
            <Text style={styles.insightsTitle}>Preliminary Insights</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>LOW RISK</Text>
            </View>
          </View>
          <Text style={styles.insightsSubtitle}>Based on 4 reported indicators</Text>

          <View style={styles.insightItem}>
            <View style={styles.insightIconContainer}>
              <MaterialCommunityIcons name="chart-bell-curve" size={24} color="#000" />
            </View>
            <View style={styles.insightDetails}>
              <Text style={styles.insightName}>Atrial Fibrillation</Text>
              <Text style={styles.insightPossibility}>POSSIBILITY</Text>
            </View>
            <Text style={styles.insightPercentage}>12%</Text>
          </View>

          <View style={styles.insightItem}>
            <View style={styles.insightIconContainer}>
              <MaterialCommunityIcons name="yoga" size={24} color="#000" />
            </View>
            <View style={styles.insightDetails}>
              <Text style={styles.insightName}>General Anxiety</Text>
              <Text style={styles.insightPossibility}>POSSIBILITY</Text>
            </View>
            <Text style={styles.insightPercentage}>64%</Text>
          </View>

          <View style={styles.recommendationContainer}>
            <Feather name="briefcase" size={16} color="#000" style={styles.recommendationIcon} />
            <Text style={styles.recommendationText}>
              High correlation with stress fatigue. We recommend a checkup with <Text style={styles.linkText}>Richard Brown</Text> to confirm these findings.
            </Text>
          </View>
        </View>
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#112233',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 40,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
    lineHeight: 45,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#000',
    borderRightColor: 'rgba(0,0,0,0.1)', // fake 75% progress
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  stepTextContainer: {
    flex: 1,
  },
  stepDescription: {
    fontSize: 16,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 5,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  chipText: {
    fontSize: 14,
    color: '#000',
  },
  chipIcon: {
    marginLeft: 5,
  },
  durationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  durationLabel: {
    fontSize: 16,
    color: '#000',
  },
  durationValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  progressBarContainer: {
    flexDirection: 'row',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 15,
  },
  progressBarActive: {
    flex: 1,
    backgroundColor: '#000',
  },
  progressBarInactive: {
    flex: 2,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  generateButton: {
    backgroundColor: '#C8E8FE',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    marginBottom: 15,
  },
  generateButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginRight: 10,
  },
  disclaimer: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  insightsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  insightsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  badge: {
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 1,
  },
  insightsSubtitle: {
    fontSize: 14,
    color: '#000',
    marginBottom: 20,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  insightIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  insightDetails: {
    flex: 1,
  },
  insightName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  insightPossibility: {
    fontSize: 10,
    fontWeight: '700',
    color: '#666',
    letterSpacing: 1,
  },
  insightPercentage: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  recommendationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  recommendationIcon: {
    marginTop: 2,
    marginRight: 10,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  linkText: {
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  bottomPadding: {
    height: 40,
  },
});
