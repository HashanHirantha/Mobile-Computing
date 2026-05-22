import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Input } from '../../components/ui/Input';
import { SymptomCard } from '../../components/SymptomCard';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useSymptoms } from '../../hooks/useSymptoms';
import { colors, typography, spacing } from '../../constants/theme';

const BODY_PARTS = ['All', 'Head', 'Chest', 'Abdomen', 'Skin', 'Eyes', 'Musculoskeletal', 'Neurological', 'General'];

export default function SymptomSelectScreen() {
  const { symptoms, loading, searchSymptoms } = useSymptoms();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<number[]>([]);
  const [bodyPart, setBodyPart] = useState('All');

  const handleSearch = (q: string) => {
    setSearch(q);
    searchSymptoms(q);
  };

  const toggle = (id: number) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const filtered = symptoms.filter(
    (s) => bodyPart === 'All' || s.body_part?.toLowerCase() === bodyPart.toLowerCase()
  );

  const handleNext = () => {
    if (selected.length === 0) return;
    router.push({ pathname: '/symptoms/results', params: { symptomIds: selected.join(',') } });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Symptoms</Text>
        <Input
          value={search}
          onChangeText={handleSearch}
          placeholder="Search symptoms..."
        />
      </View>

      {/* Body Part Filter */}
      <FlatList
        data={BODY_PARTS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.filterRow}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.chip, bodyPart === item && styles.chipActive]}
            onPress={() => setBodyPart(item)}
          >
            <Text style={[styles.chipText, bodyPart === item && styles.chipTextActive]}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <SymptomCard symptom={item} selected={selected.includes(item.id)} onPress={() => toggle(item.id)} />
          )}
          contentContainerStyle={styles.list}
        />
      )}

      <View style={styles.footer}>
        <Button
          title={`Predict Disease (${selected.length} symptoms)`}
          onPress={handleNext}
          disabled={selected.length === 0}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.lg, gap: spacing.md },
  title: { ...typography.h1, color: colors.textPrimary },
  filterRow: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm, gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { ...typography.caption, color: colors.textSecondary },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  list: { padding: spacing.md },
  footer: { padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface },
});
