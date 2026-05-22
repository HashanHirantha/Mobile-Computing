import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { Badge } from './ui/Badge';
import { Avatar } from './ui/Avatar';
import { supabase } from '../lib/supabase';
import { colors, typography, spacing } from '../constants/theme';

interface AppointmentCardProps {
  appointment: {
    id: string;
    appointment_date: string;
    appointment_time: string;
    status: string;
    doctors?: {
      specialty?: string;
      profiles?: {
        first_name?: string;
        last_name?: string;
        profile_image?: string;
      };
    };
  };
  onRefresh?: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#FF9500',
  confirmed: colors.secondary,
  completed: colors.primary,
  cancelled: colors.accent,
  no_show: '#8E8E93',
};

export function AppointmentCard({ appointment, onRefresh }: AppointmentCardProps) {
  const doctor = appointment.doctors;
  const name = `Dr. ${doctor?.profiles?.first_name ?? ''} ${doctor?.profiles?.last_name ?? ''}`;

  const handleCancel = () => {
    Alert.alert('Cancel Appointment', 'Are you sure?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', appointment.id);
          onRefresh?.();
        },
      },
    ]);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/appointments/${appointment.id}`)}
      activeOpacity={0.85}
    >
      <View style={styles.header}>
        <View style={styles.doctorRow}>
          <Avatar uri={doctor?.profiles?.profile_image} name={name} size={40} />
          <View>
            <Text style={styles.doctorName}>{name}</Text>
            <Text style={styles.specialty}>{doctor?.specialty}</Text>
          </View>
        </View>
        <Badge label={appointment.status} color={STATUS_COLORS[appointment.status]} />
      </View>

      <View style={styles.info}>
        <Text style={styles.dateText}>
          📅 {new Date(appointment.appointment_date).toLocaleDateString('en', {
            weekday: 'short', month: 'short', day: 'numeric',
          })}
        </Text>
        <Text style={styles.timeText}>🕐 {appointment.appointment_time}</Text>
      </View>

      {['pending', 'confirmed'].includes(appointment.status) && (
        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  doctorRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  doctorName: { ...typography.body, color: colors.textPrimary, fontWeight: '700' },
  specialty: { ...typography.caption, color: colors.textSecondary },
  info: { flexDirection: 'row', gap: spacing.lg },
  dateText: { ...typography.caption, color: colors.textPrimary },
  timeText: { ...typography.caption, color: colors.textPrimary },
  cancelBtn: { alignSelf: 'flex-end' },
  cancelText: { ...typography.caption, color: colors.accent, fontWeight: '600' },
});
