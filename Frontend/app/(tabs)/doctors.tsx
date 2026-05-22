import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';
import { DoctorCard } from '../../components/DoctorCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useDoctors } from '../../hooks/useDoctors';
import { colors, typography, spacing } from '../../constants/theme';

const SPECIALTIES = ['All', 'General Medicine', 'Cardiology', 'Dermatology', 'Neurology', 'Orthopedics', 'ENT', 'Pediatrics'];

export default function DoctorsScreen() {
  const { doctors, loading, fetchDoctors } = useDoctors();
  const [search, setSearch] = useState('');
  const [activeSpecialty, setActiveSpecialty] = useState('All');

  useEffect(() => {
    fetchDoctors(activeSpecialty === 'All' ? undefined : activeSpecialty);
  }, [activeSpecialty]);

  const filtered = doctors.filter((d) =>
    d.profiles?.first_name?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Doctors</Text>
        <TextInput
          style={styles.search}
          value={search}
          onChangeText={setSearch}
          placeholder="Search by name or specialty..."
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      {/* Specialty Filter Tabs */}
      <FlatList
        data={SPECIALTIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.filterList}
        renderItem={({ item }) => (
          <View
            style={[styles.filterChip, activeSpecialty === item && styles.filterChipActive]}
          >
            <Text
              style={[styles.filterText, activeSpecialty === item && styles.filterTextActive]}
              onPress={() => setActiveSpecialty(item)}
            >
              {item}
            </Text>
          </View>
        )}
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <DoctorCard doctor={item} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>No doctors found.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.lg, paddingBottom: spacing.sm },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.md },
  search: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textPrimary,
    ...typography.body,
  },
  filterList: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, gap: spacing.sm },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { ...typography.caption, color: colors.textSecondary },
  filterTextActive: { color: '#fff', fontWeight: '600' },
  list: { padding: spacing.lg },
  empty: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xl },
});
