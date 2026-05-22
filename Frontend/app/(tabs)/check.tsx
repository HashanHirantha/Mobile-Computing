import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { router } from 'expo-router';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { SymptomCard } from '../../components/SymptomCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useSymptoms } from '../../hooks/useSymptoms';
import { colors, typography, spacing } from '../../constants/theme';

export default function CheckScreen() {
  const { symptoms, loading, searchSymptoms } = useSymptoms();
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<number[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchSymptoms(query);
  };

  const toggleSymptom = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (selected.length === 0) return;
    router.push({ pathname: '/symptoms/results', params: { symptomIds: selected.join(',') } });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Symptom Checker</Text>
        <Text style={styles.subtitle}>Select all symptoms you are experiencing</Text>
      </View>

      <Input
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Search symptoms..."
        style={styles.search}
      />

      {selected.length > 0 && (
        <View style={styles.selectedBar}>
          <Text style={styles.selectedText}>{selected.length} symptom(s) selected</Text>
          <TouchableOpacity onPress={() => setSelected([])}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={symptoms}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <SymptomCard
              symptom={item}
              selected={selected.includes(item.id)}
              onPress={() => toggleSymptom(item.id)}
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}

      <View style={styles.footer}>
        <Button
          title={`Check Symptoms (${selected.length})`}
          onPress={handleSubmit}
          disabled={selected.length === 0}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.lg, paddingBottom: 0 },
  title: { ...typography.h1, color: colors.textPrimary },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
  search: { margin: spacing.md },
  selectedBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  selectedText: { ...typography.caption, color: colors.primary, fontWeight: '600' },
  clearText: { ...typography.caption, color: colors.accent },
  list: { padding: spacing.md },
  footer: { padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
});
