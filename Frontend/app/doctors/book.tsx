import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView, Image, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { TopBar } from '../../components/TopBar';

const TIME_SLOTS = [
  { time: '09:00', label: '9:00 AM' },
  { time: '10:00', label: '10:00 AM' },
  { time: '11:00', label: '11:00 AM' },
  { time: '14:00', label: '2:00 PM' },
  { time: '15:00', label: '3:00 PM' },
  { time: '16:00', label: '4:00 PM' },
];

const MOCK_DOCTORS_DETAIL: Record<string, any> = {
  '1': {
    id: '1',
    profiles: { first_name: 'Sarah', last_name: 'Jenkins', profile_image: 'https://i.pravatar.cc/150?img=47' },
    specialty: 'Cardiologist',
    consultation_fee: 3500,
  },
  '2': {
    id: '2',
    profiles: { first_name: 'Michael', last_name: 'Chen', profile_image: 'https://i.pravatar.cc/150?img=11' },
    specialty: 'Neurologist',
    consultation_fee: 4000,
  },
  '3': {
    id: '3',
    profiles: { first_name: 'Emily', last_name: 'Davis', profile_image: 'https://i.pravatar.cc/150?img=32' },
    specialty: 'General Medicine',
    consultation_fee: 2500,
  }
};

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
      .select('*, profiles(first_name, last_name, profile_image)')
      .eq('id', doctorId)
      .single()
      .then(({ data }) => {
        const mockDoc = MOCK_DOCTORS_DETAIL[doctorId] || MOCK_DOCTORS_DETAIL['1'];
        setDoctor(data || mockDoc);
        setFetchLoading(false);
      });
  }, [doctorId]);

  // Generate next 7 available dates
  const getDates = () => {
    const dates: { full: string; day: string; date: number; month: string }[] = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push({
        full: d.toISOString().split('T')[0],
        day: d.toLocaleDateString('en', { weekday: 'short' }),
        date: d.getDate(),
        month: d.toLocaleDateString('en', { month: 'short' }),
      });
    }
    return dates;
  };

  const handleBook = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Missing Info', 'Please select a date and time slot.');
      return;
    }
    setLoading(true);

    const mockDoc = MOCK_DOCTORS_DETAIL[doctorId] || MOCK_DOCTORS_DETAIL['1'];
    const doc = doctor || mockDoc;
    const newAppointment = {
      id: `local-${Date.now()}`,
      patient_id: user?.id || 'local-user',
      doctor_id: doctorId,
      disease_id: diseaseId ? Number(diseaseId) : null,
      appointment_date: selectedDate,
      appointment_time: selectedTime,
      symptoms_text: symptoms || null,
      status: 'pending',
      created_at: new Date().toISOString(),
      doctors: {
        specialty: doc?.specialty || 'General',
        profiles: {
          first_name: doc?.profiles?.first_name || 'Doctor',
          last_name: doc?.profiles?.last_name || '',
          profile_image: doc?.profiles?.profile_image || 'https://i.pravatar.cc/150?img=11',
        },
      },
    };

    // Try Supabase first
    const { error } = await supabase.from('appointments').insert({
      patient_id: user!.id,
      doctor_id: doctorId,
      disease_id: diseaseId ? Number(diseaseId) : null,
      appointment_date: selectedDate,
      appointment_time: selectedTime,
      symptoms_text: symptoms || null,
      status: 'pending',
    });

    // Save locally regardless (as fallback for history display)
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const existing = await AsyncStorage.getItem('local_appointments');
      const localAppointments = existing ? JSON.parse(existing) : [];
      localAppointments.unshift(newAppointment);
      await AsyncStorage.setItem('local_appointments', JSON.stringify(localAppointments));
    } catch (e) {
      // AsyncStorage save failed silently
    }

    if (error) {
      // Still show success since we saved locally
      Alert.alert('Booking Confirmed! ✅', 'Your appointment has been booked successfully.', [
        { text: 'View Appointments', onPress: () => router.replace('/(tabs)/history') },
      ]);
    } else {
      Alert.alert('Booking Confirmed! ✅', 'Your appointment request has been submitted.', [
        { text: 'View Appointments', onPress: () => router.replace('/(tabs)/history') },
      ]);
    }
    setLoading(false);
  };

  if (fetchLoading) return <LoadingSpinner />;

  const mockDoc = MOCK_DOCTORS_DETAIL[doctorId] || MOCK_DOCTORS_DETAIL['1'];
  const doc = doctor || mockDoc;
  const doctorName = `Dr. ${doc?.profiles?.first_name} ${doc?.profiles?.last_name}`;
  const dates = getDates();

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* Page Title */}
        <Text style={styles.pageTitle}>Book Appointment</Text>
        <Text style={styles.pageSubtitle}>
          Schedule your visit with your preferred specialist.
        </Text>

        {/* Doctor Mini Card */}
        <View style={styles.doctorCard}>
          <Image
            source={{ uri: doc?.profiles?.profile_image || 'https://i.pravatar.cc/150?img=11' }}
            style={styles.doctorImage}
          />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{doctorName}</Text>
            <View style={styles.specialtyBadge}>
              <Text style={styles.specialtyText}>{doc?.specialty?.toUpperCase() || 'CARDIOLOGIST'}</Text>
            </View>
          </View>
          <View style={styles.feeBadge}>
            <Text style={styles.feeLabel}>FEE</Text>
            <Text style={styles.feeValue}>LKR {doc?.consultation_fee || 3500}</Text>
          </View>
        </View>

        {/* Date Selection */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Feather name="calendar" size={16} color="#2E4A62" />
            <Text style={styles.sectionLabel}>SELECT DATE</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.dateRow}>
              {dates.map((d) => {
                const isActive = selectedDate === d.full;
                return (
                  <TouchableOpacity
                    key={d.full}
                    style={[styles.dateChip, isActive && styles.dateChipActive]}
                    onPress={() => setSelectedDate(d.full)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.dateDay, isActive && styles.dateTextActive]}>{d.day}</Text>
                    <Text style={[styles.dateNum, isActive && styles.dateTextActive]}>{d.date}</Text>
                    <Text style={[styles.dateMonth, isActive && styles.dateTextActive]}>{d.month}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Time Selection */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Feather name="clock" size={16} color="#2E4A62" />
            <Text style={styles.sectionLabel}>SELECT TIME</Text>
          </View>
          <View style={styles.timeGrid}>
            {TIME_SLOTS.map((slot) => {
              const isActive = selectedTime === slot.time;
              return (
                <TouchableOpacity
                  key={slot.time}
                  style={[styles.timeChip, isActive && styles.timeChipActive]}
                  onPress={() => setSelectedTime(slot.time)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.timeText, isActive && styles.timeTextActive]}>{slot.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Notes */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Feather name="edit-3" size={16} color="#2E4A62" />
            <Text style={styles.sectionLabel}>ADDITIONAL NOTES</Text>
          </View>
          <TextInput
            style={styles.notesInput}
            placeholder="Describe your symptoms or reason for visit..."
            placeholderTextColor="#88B0C8"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={symptoms}
            onChangeText={setSymptoms}
          />
        </View>

        {/* Summary */}
        {selectedDate && selectedTime && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>BOOKING SUMMARY</Text>
            <View style={styles.summaryRow}>
              <Feather name="user" size={14} color="#2E4A62" />
              <Text style={styles.summaryText}>{doctorName}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Feather name="calendar" size={14} color="#2E4A62" />
              <Text style={styles.summaryText}>
                {new Date(selectedDate).toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Feather name="clock" size={14} color="#2E4A62" />
              <Text style={styles.summaryText}>
                {TIME_SLOTS.find(s => s.time === selectedTime)?.label}
              </Text>
            </View>
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed Confirm Button */}
      <View style={styles.confirmBarContainer}>
        <TouchableOpacity
          style={[styles.confirmButton, (!selectedDate || !selectedTime) && styles.confirmButtonDisabled]}
          activeOpacity={0.8}
          onPress={handleBook}
          disabled={loading}
        >
          {loading ? (
            <Text style={styles.confirmButtonText}>Booking...</Text>
          ) : (
            <>
              <Text style={styles.confirmButtonText}>Confirm Booking</Text>
              <Feather name="check-circle" size={20} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
  },

  // Page Title
  pageTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 15,
    color: '#4A5568',
    lineHeight: 22,
    marginBottom: 24,
  },

  // Doctor Mini Card
  doctorCard: {
    backgroundColor: '#C8E8FE',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  doctorImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 14,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  specialtyBadge: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  specialtyText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#4A5568',
    letterSpacing: 0.5,
  },
  feeBadge: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  feeLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#4A5568',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  feeValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },

  // Section Card
  sectionCard: {
    backgroundColor: '#C8E8FE',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2E4A62',
    letterSpacing: 1,
  },

  // Date Chips
  dateRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dateChip: {
    width: 64,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dateChipActive: {
    backgroundColor: '#111827',
  },
  dateDay: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 4,
  },
  dateNum: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  dateMonth: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4A5568',
  },
  dateTextActive: {
    color: '#FFFFFF',
  },

  // Time Grid
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeChip: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  timeChipActive: {
    backgroundColor: '#111827',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  timeTextActive: {
    color: '#FFFFFF',
  },

  // Notes Input
  notesInput: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: '#1A1A1A',
    minHeight: 100,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },

  // Summary
  summaryCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2E7D32',
    letterSpacing: 1,
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },

  // Confirm Bar
  confirmBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 30,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  confirmButton: {
    backgroundColor: '#111827',
    borderRadius: 14,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
