import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { DiseaseCard } from '../../components/DiseaseCard';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { predictDisease } from '../../services/diseaseService';
import { TopBar } from '../../components/TopBar';
import { globalStyles } from '../../constants/globalStyles';
import { colors } from '../../constants/theme';

export default function ResultsScreen() {
  const { symptomIds } = useLocalSearchParams<{ symptomIds: string }>();
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (symptomIds) {
      runPrediction();
    }
  }, [symptomIds]);

  const runPrediction = async () => {
    setLoading(true);
    const ids = symptomIds.split(',').map(Number);
    const { data, error: predError } = await predictDisease(ids);
    if (predError) {
      setError(predError);
    } else {
      setPredictions(data ?? []);
    }
    setLoading(false);
  };

  return (
    <View style={globalStyles.safeArea}>
      <TopBar />
      <View style={globalStyles.container}>
        <View style={styles.header}>
          <Text style={globalStyles.pageTitle}>Prediction Results</Text>
          <Text style={globalStyles.pageDescription}>Based on your symptoms, here are the possible conditions:</Text>
        </View>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : predictions.length === 0 ? (
        <View style={styles.empty}>
          <Text style={globalStyles.emptyText}>No diseases matched your symptoms. Please consult a General Practitioner.</Text>
        </View>
      ) : (
        <FlatList
          data={predictions}
          keyExtractor={(item) => item.disease_id.toString()}
          renderItem={({ item }) => (
            <DiseaseCard disease={item} onFindDoctors={() =>
              router.push({ pathname: '/(tabs)/doctors', params: { specialty: item.specialty } })
            } />
          )}
          contentContainerStyle={styles.list}
        />
      )}

      <View style={styles.footer}>
        <Text style={styles.disclaimer}>
          ⚠️ These results are indicative only. Always consult a qualified healthcare professional.
        </Text>
        <Button title="Start Over" onPress={() => router.back()} variant="outline" />
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 24, paddingTop: 20 },
  error: { fontSize: 14, color: colors.accent, padding: 24 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  list: { padding: 24 },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    gap: 16,
  },
  disclaimer: { fontSize: 12, color: '#7A5F00', textAlign: 'center' },
});
