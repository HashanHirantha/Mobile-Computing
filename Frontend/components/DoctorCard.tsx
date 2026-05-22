import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Avatar } from './ui/Avatar';
import { Badge } from './ui/Badge';
import { RatingStars } from './RatingStars';
import { colors, typography, spacing } from '../constants/theme';

interface DoctorCardProps {
  doctor: {
    id: string;
    specialty: string;
    experience_years: number;
    hospital_name?: string;
    consultation_fee: number;
    average_rating: number;
    total_reviews: number;
    is_verified: boolean;
    profiles?: {
      first_name: string;
      last_name: string;
      profile_image?: string;
    };
  };
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  const name = `Dr. ${doctor.profiles?.first_name ?? ''} ${doctor.profiles?.last_name ?? ''}`;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/doctors/${doctor.id}`)}
      activeOpacity={0.85}
    >
      <View style={styles.left}>
        <Avatar uri={doctor.profiles?.profile_image} name={name} size={52} />
      </View>
      <View style={styles.right}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{name}</Text>
          {doctor.is_verified && <Text style={styles.verified}>✓</Text>}
        </View>
        <Badge label={doctor.specialty} />
        <RatingStars rating={doctor.average_rating} total={doctor.total_reviews} />
        <View style={styles.footer}>
          <Text style={styles.meta}>{doctor.experience_years} yrs exp</Text>
          <Text style={styles.fee}>LKR {doctor.consultation_fee}</Text>
        </View>
        {doctor.hospital_name && (
          <Text style={styles.hospital} numberOfLines={1}>{doctor.hospital_name}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  left: { justifyContent: 'flex-start' },
  right: { flex: 1, gap: 4 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  name: { ...typography.body, color: colors.textPrimary, fontWeight: '700' },
  verified: { color: colors.secondary, fontWeight: '700', fontSize: 14 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  meta: { ...typography.caption, color: colors.textSecondary },
  fee: { ...typography.caption, color: colors.primary, fontWeight: '700' },
  hospital: { ...typography.caption, color: colors.textSecondary },
});
