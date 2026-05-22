import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { colors, typography, spacing } from '../../constants/theme';

const TIME_SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

export default function BookScreen() {
  const { doctorId, diseaseId } = useLocalSearchParams<{ doctorId: string; diseaseId?: string }>();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('doctors')
      .select('*, profiles(first_name, last_name)')
      .eq('id', doctorId)
      .single()
      .then(({ data }) => {
        setDoctor(data);
        setFetchLoading(false);
      });
  }, [doctorId]);

  // Generate next 7 available dates
  const getDates = () => {
    const dates: string[] = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  const handleBook = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Missing Info', 'Please select a date and time slot.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('appointments').insert({
      patient_id: user!.id,
      doctor_id: doctorId,
      disease_id: diseaseId ? Number(diseaseId) : null,
      appointment_date: selectedDate,
      appointment_time: selectedTime,
      symptoms_text: symptoms || null,
      status: 'pending',
    });
    if (error) {
      Alert.alert('Booking Failed', error.message);
    } else {
      Alert.alert('Booking Confirmed! ✅', 'Your appointment request has been submitted.', [
        { text: 'View Appointments', onPress: () => router.replace('/(tabs)/history') },
      ]);
    }
    setLoading(false);
  };

  if (fetchLoading) return <LoadingSpinner />;

  const doctorName = `Dr. ${doctor?.profiles?.first_name} ${doctor?.profiles?.last_name}`;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Book Appointment</Text>
      <Text style={styles.doctorName}>{doctorName}</Text>
      <Text style={styles.specialty}>{doctor?.specialty}</Text>

      {/* Date Picker */}
      <Text style={styles.sectionTitle}>Select Date</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.dateRow}>
          {getDates().map((date) => (
            <TouchableOpacity
              key={date}
              style={[styles.dateChip, selectedDate === date && styles.dateChipActive]}
              onPress={() => setSelectedDate(date)}
            >
              <Text style={[styles.dateDay, selectedDate === date && styles.dateTextActive]}>
                {new Date(date).toLocaleDateString('en', { weekday: 'short' })}
              </Text>
              <Text style={[styles.dateNum, selectedDate === date && styles.dateTextActive]}>
                {new Date(date).getDate()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Time Slots */}
      <Text style={styles.sectionTitle}>Select Time</Text>
      <View style={styles.timeGrid}>
        {TIME_SLOTS.map((slot) => (
          <TouchableOpacity
            key={slot}
            style={[styles.timeChip, selectedTime === slot && styles.timeChipActive]}
            onPress={() => setSelectedTime(slot)}
          >
            <Text style={[styles.timeText, selectedTime === slot && styles.timeTextActive]}>{slot}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title={loading ? 'Booking...' : 'Confirm Booking'} onPress={handleBook} loading={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md },
  title: { ...typography.h1, color: colors.textPrimary },
  doctorName: { ...typography.h2, color: colors.textPrimary },
  specialty: { ...typography.body, color: colors.primary },
  sectionTitle: { ...typography.body, color: colors.textPrimary, fontWeight: '700', marginTop: spacing.sm },
  dateRow: { flexDirection: 'row', gap: spacing.sm },
  dateChip: {
    width: 56,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dateDay: { ...typography.caption, color: colors.textSecondary },
  dateNum: { ...typography.body, color: colors.textPrimary, fontWeight: '700' },
  dateTextActive: { color: '#fff' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  timeChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  timeText: { ...typography.body, color: colors.textPrimary },
  timeTextActive: { color: '#fff' },
});
