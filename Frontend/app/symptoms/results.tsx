import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { DiseaseCard } from '../../components/DiseaseCard';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { predictDisease } from '../../services/diseaseService';
import { colors, typography, spacing } from '../../constants/theme';

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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Prediction Results</Text>
        <Text style={styles.subtitle}>Based on your symptoms, here are the possible conditions:</Text>
      </View>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : predictions.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No diseases matched your symptoms. Please consult a General Practitioner.</Text>
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
  error: { ...typography.body, color: colors.accent, padding: spacing.lg },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  emptyText: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  list: { padding: spacing.md },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.md,
  },
  disclaimer: { ...typography.caption, color: '#7A5F00', textAlign: 'center' },
});
