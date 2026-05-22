import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { colors, typography, spacing } from '../../constants/theme';

const STATUS_COLORS: Record<string, string> = {
  pending: '#FF9500',
  confirmed: colors.secondary,
  completed: colors.primary,
  cancelled: colors.accent,
  no_show: '#8E8E93',
};

export default function AppointmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointment();
  }, [id]);

  const fetchAppointment = async () => {
    const { data } = await supabase
      .from('appointments')
      .select('*, doctors(specialty, hospital_name, consultation_fee, profiles(first_name, last_name, profile_image)), diseases(name, severity)')
      .eq('id', id)
      .single();
    setAppointment(data);
    setLoading(false);
  };

  const handleCancel = () => {
    Alert.alert('Cancel Appointment', 'Are you sure you want to cancel this appointment?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: async () => {
          await supabase
            .from('appointments')
            .update({ status: 'cancelled' })
            .eq('id', id);
          router.back();
        },
      },
    ]);
  };

  if (loading) return <LoadingSpinner />;
  if (!appointment) return <Text style={styles.error}>Appointment not found.</Text>;

  const doctorName = `Dr. ${appointment.doctors?.profiles?.first_name} ${appointment.doctors?.profiles?.last_name}`;
  const canCancel = ['pending', 'confirmed'].includes(appointment.status);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Appointment Details</Text>

      <View style={styles.card}>
        <Text style={styles.doctorName}>{doctorName}</Text>
        <Text style={styles.specialty}>{appointment.doctors?.specialty}</Text>
        <Text style={styles.hospital}>{appointment.doctors?.hospital_name}</Text>
        <View style={styles.statusRow}>
          <Badge
            label={appointment.status.toUpperCase()}
            color={STATUS_COLORS[appointment.status]}
          />
        </View>
      </View>

      <View style={styles.card}>
        {[
          { label: 'Date', value: new Date(appointment.appointment_date).toLocaleDateString('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
          { label: 'Time', value: appointment.appointment_time },
          { label: 'Consultation Fee', value: `LKR ${appointment.doctors?.consultation_fee}` },
          { label: 'Predicted Condition', value: appointment.diseases?.name ?? 'Not specified' },
        ].map((item, idx, arr) => (
          <View key={item.label} style={[styles.row, idx < arr.length - 1 && styles.rowBorder]}>
            <Text style={styles.rowLabel}>{item.label}</Text>
            <Text style={styles.rowValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      {appointment.notes ? (
        <View style={styles.card}>
          <Text style={styles.rowLabel}>Notes</Text>
          <Text style={styles.notes}>{appointment.notes}</Text>
        </View>
      ) : null}

      {canCancel && (
        <Button title="Cancel Appointment" onPress={handleCancel} variant="danger" />
      )}

      {appointment.status === 'completed' && (
        <Button
          title="Leave a Review"
          onPress={() => router.push({ pathname: `/doctors/${appointment.doctor_id}` })}
          variant="outline"
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md },
  title: { ...typography.h1, color: colors.textPrimary },
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: spacing.md, borderWidth: 1, borderColor: colors.border, gap: spacing.xs },
  doctorName: { ...typography.h2, color: colors.textPrimary },
  specialty: { ...typography.body, color: colors.primary },
  hospital: { ...typography.caption, color: colors.textSecondary },
  statusRow: { alignSelf: 'flex-start', marginTop: spacing.xs },
  row: { flexDirection: 'row', justifyContent: 'space-between', padding: spacing.sm },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  rowLabel: { ...typography.caption, color: colors.textSecondary },
  rowValue: { ...typography.body, color: colors.textPrimary, fontWeight: '500', maxWidth: '60%', textAlign: 'right' },
  notes: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
  error: { ...typography.body, color: colors.accent, padding: spacing.lg },
});
