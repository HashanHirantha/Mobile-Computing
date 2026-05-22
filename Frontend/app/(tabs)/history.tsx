import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { AppointmentCard } from '../../components/AppointmentCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { colors, typography, spacing } from '../../constants/theme';

const STATUS_FILTERS = ['All', 'pending', 'confirmed', 'completed', 'cancelled'];

export default function HistoryScreen() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [diagnosisHistory, setDiagnosisHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'appointments' | 'diagnoses'>('appointments');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    setLoading(true);
    const [apptRes, diagRes] = await Promise.all([
      supabase
        .from('appointments')
        .select('*, doctors(*, profiles(first_name, last_name, profile_image))')
        .eq('patient_id', user!.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('diagnosis_history')
        .select('*, diseases(name, specialty, severity)')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false }),
    ]);
    setAppointments(apptRes.data ?? []);
    setDiagnosisHistory(diagRes.data ?? []);
    setLoading(false);
  };

  const filteredAppointments = appointments.filter(
    (a) => statusFilter === 'All' || a.status === statusFilter
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My History</Text>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'appointments' && styles.tabActive]}
            onPress={() => setActiveTab('appointments')}
          >
            <Text style={[styles.tabText, activeTab === 'appointments' && styles.tabTextActive]}>
              Appointments
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'diagnoses' && styles.tabActive]}
            onPress={() => setActiveTab('diagnoses')}
          >
            <Text style={[styles.tabText, activeTab === 'diagnoses' && styles.tabTextActive]}>
              Diagnoses
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <LoadingSpinner />
      ) : activeTab === 'appointments' ? (
        <FlatList
          data={filteredAppointments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AppointmentCard appointment={item} onRefresh={fetchHistory} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No appointments found.</Text>}
        />
      ) : (
        <FlatList
          data={diagnosisHistory}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.diagCard}>
              <Text style={styles.diagName}>{item.diseases?.name ?? 'Unknown'}</Text>
              <Text style={styles.diagMeta}>
                Confidence: {item.confidence_score}% · {item.diseases?.severity}
              </Text>
              <Text style={styles.diagDate}>
                {new Date(item.created_at).toLocaleDateString()}
              </Text>
            </View>
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No diagnosis history.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.md },
  tabs: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 10, padding: 4 },
  tab: { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', borderRadius: 8 },
  tabActive: { backgroundColor: colors.primary },
  tabText: { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },
  tabTextActive: { color: '#fff' },
  list: { padding: spacing.md },
  empty: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xl },
  diagCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  diagName: { ...typography.body, color: colors.textPrimary, fontWeight: '700' },
  diagMeta: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  diagDate: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
});
