import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { AppointmentCard } from '../../components/AppointmentCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useRealtime } from '../../hooks/useRealtime';
import { colors, typography, spacing } from '../../constants/theme';

export default function AppointmentsScreen() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('appointments')
      .select('*, doctors(specialty, consultation_fee, profiles(first_name, last_name, profile_image))')
      .eq('patient_id', user.id)
      .order('appointment_date', { ascending: true });
    setAppointments(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  // Realtime updates for appointment status changes
  useRealtime('appointments', `patient_id=eq.${user?.id}`, fetchAppointments);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Appointments</Text>
      </View>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AppointmentCard appointment={item} onRefresh={fetchAppointments} />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>You have no appointments yet.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary },
  list: { padding: spacing.md },
  empty: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xl },
});
