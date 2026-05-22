import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { RatingStars } from '../../components/RatingStars';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { supabase } from '../../lib/supabase';
import { colors, typography, spacing } from '../../constants/theme';

export default function DoctorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [doctor, setDoctor] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  const fetchDoctor = async () => {
    const [docRes, revRes] = await Promise.all([
      supabase
        .from('doctors')
        .select('*, profiles(first_name, last_name, profile_image)')
        .eq('id', id)
        .single(),
      supabase
        .from('reviews')
        .select('*, profiles(first_name, last_name)')
        .eq('doctor_id', id)
        .order('created_at', { ascending: false })
        .limit(5),
    ]);
    setDoctor(docRes.data);
    setReviews(revRes.data ?? []);
    setLoading(false);
  };

  if (loading) return <LoadingSpinner />;
  if (!doctor) return <Text style={styles.error}>Doctor not found.</Text>;

  const name = `Dr. ${doctor.profiles?.first_name} ${doctor.profiles?.last_name}`;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Avatar uri={doctor.profiles?.profile_image} name={name} size={72} />
        <Text style={styles.name}>{name}</Text>
        <Badge label={doctor.specialty} />
        <RatingStars rating={doctor.average_rating} total={doctor.total_reviews} />
      </View>

      {/* Details */}
      <View style={styles.card}>
        {[
          { label: 'Qualification', value: doctor.qualification },
          { label: 'Experience', value: `${doctor.experience_years} years` },
          { label: 'Hospital', value: doctor.hospital_name ?? 'N/A' },
          { label: 'Consultation Fee', value: `LKR ${doctor.consultation_fee}` },
          { label: 'Available Days', value: doctor.available_days ?? 'N/A' },
          { label: 'Hours', value: doctor.available_from && doctor.available_to ? `${doctor.available_from} – ${doctor.available_to}` : 'N/A' },
        ].map((item, idx, arr) => (
          <View key={item.label} style={[styles.row, idx < arr.length - 1 && styles.rowBorder]}>
            <Text style={styles.rowLabel}>{item.label}</Text>
            <Text style={styles.rowValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      {/* Bio */}
      {doctor.bio ? (
        <>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bio}>{doctor.bio}</Text>
        </>
      ) : null}

      {/* Reviews */}
      {reviews.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Reviews</Text>
          {reviews.map((r) => (
            <View key={r.id} style={styles.reviewCard}>
              <Text style={styles.reviewAuthor}>
                {r.is_anonymous ? 'Anonymous' : `${r.profiles?.first_name} ${r.profiles?.last_name}`}
              </Text>
              <RatingStars rating={r.rating} />
              {r.comment ? <Text style={styles.reviewComment}>{r.comment}</Text> : null}
            </View>
          ))}
        </>
      )}

      <Button
        title="Book Appointment"
        onPress={() => router.push({ pathname: '/doctors/book', params: { doctorId: id } })}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md },
  profileHeader: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
  name: { ...typography.h2, color: colors.textPrimary },
  card: { backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  row: { flexDirection: 'row', justifyContent: 'space-between', padding: spacing.md },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  rowLabel: { ...typography.caption, color: colors.textSecondary },
  rowValue: { ...typography.body, color: colors.textPrimary, fontWeight: '500', maxWidth: '60%', textAlign: 'right' },
  sectionTitle: { ...typography.h2, color: colors.textPrimary },
  bio: { ...typography.body, color: colors.textSecondary, lineHeight: 22 },
  reviewCard: { backgroundColor: colors.surface, borderRadius: 12, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  reviewAuthor: { ...typography.body, color: colors.textPrimary, fontWeight: '600' },
  reviewComment: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
  error: { ...typography.body, color: colors.accent, padding: spacing.lg },
});
