import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { supabase } from '../../lib/supabase';
import { TopBar } from '../../components/TopBar';

const MOCK_DOCTORS_DETAIL: Record<string, any> = {
  '1': {
    id: '1',
    profiles: { first_name: 'Sarah', last_name: 'Jenkins', profile_image: 'https://i.pravatar.cc/150?img=47' },
    average_rating: 4.9,
    total_reviews: 127,
    specialty: 'Cardiologist',
    experience_years: 15,
    qualification: 'MD, FACC',
    hospital_name: 'City Heart Institute',
    consultation_fee: 3500,
    bio: 'Dr. Sarah Jenkins is a board-certified cardiologist with over 15 years of experience in interventional and preventive cardiology. She specializes in heart failure management, arrhythmia treatment, and cardiac rehabilitation programs.',
    available_days: 'Mon, Wed, Fri',
    available_from: '09:00',
    available_to: '17:00',
  },
  '2': {
    id: '2',
    profiles: { first_name: 'Michael', last_name: 'Chen', profile_image: 'https://i.pravatar.cc/150?img=11' },
    average_rating: 4.8,
    total_reviews: 98,
    specialty: 'Neurologist',
    experience_years: 12,
    qualification: 'MD, PhD',
    hospital_name: 'NeuroCare Center',
    consultation_fee: 4000,
    bio: 'Dr. Michael Chen is a leading neurologist specializing in movement disorders and neurodegenerative diseases. He has extensive experience in treating Parkinson\'s disease and offers advanced therapeutic options.',
    available_days: 'Tue, Thu, Sat',
    available_from: '10:00',
    available_to: '18:00',
  },
  '3': {
    id: '3',
    profiles: { first_name: 'Emily', last_name: 'Davis', profile_image: 'https://i.pravatar.cc/150?img=32' },
    average_rating: 4.7,
    total_reviews: 215,
    specialty: 'General Medicine',
    experience_years: 8,
    qualification: 'MBBS, MD',
    hospital_name: 'Community Health Clinic',
    consultation_fee: 2500,
    bio: 'Dr. Emily Davis is a compassionate general physician focused on comprehensive adult medicine. She provides routine check-ups, chronic disease management, and preventive care for her patients.',
    available_days: 'Mon, Tue, Wed, Thu, Fri',
    available_from: '08:00',
    available_to: '16:00',
  }
};

const MOCK_REVIEWS = [
  { id: '1', rating: 5, comment: 'Excellent doctor! Very thorough and caring. Explained everything clearly.', is_anonymous: false, profiles: { first_name: 'Alex', last_name: 'Morgan' } },
  { id: '2', rating: 4, comment: 'Very professional and knowledgeable. Highly recommend.', is_anonymous: false, profiles: { first_name: 'Jordan', last_name: 'Lee' } },
];

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
    const mockDoc = MOCK_DOCTORS_DETAIL[id] || MOCK_DOCTORS_DETAIL['1'];
    setDoctor(docRes.data || mockDoc);
    setReviews(revRes.data?.length ? revRes.data : MOCK_REVIEWS);
    setLoading(false);
  };

  if (loading) return <LoadingSpinner />;

  const mockDoc = MOCK_DOCTORS_DETAIL[id] || MOCK_DOCTORS_DETAIL['1'];
  const doc = doctor || mockDoc;
  const name = `Dr. ${doc.profiles?.first_name} ${doc.profiles?.last_name}`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* Doctor Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: doc.profiles?.profile_image || 'https://i.pravatar.cc/150?img=11' }}
            style={styles.doctorImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.doctorName}>{name}</Text>
            <View style={styles.specialtyBadge}>
              <Text style={styles.specialtyText}>{doc.specialty?.toUpperCase() || 'CARDIOLOGIST'}</Text>
            </View>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#F5A623" />
              <Text style={styles.ratingText}>{doc.average_rating?.toFixed(1) || '4.9'}</Text>
              <Text style={styles.reviewCount}>({doc.total_reviews || 127} reviews)</Text>
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <MaterialCommunityIcons name="clock-outline" size={20} color="#2E4A62" />
            <Text style={styles.statValue}>{doc.experience_years || 15}+</Text>
            <Text style={styles.statLabel}>Years Exp.</Text>
          </View>
          <View style={styles.statBox}>
            <MaterialCommunityIcons name="account-group-outline" size={20} color="#2E4A62" />
            <Text style={styles.statValue}>{doc.total_reviews || 127}</Text>
            <Text style={styles.statLabel}>Patients</Text>
          </View>
          <View style={styles.statBox}>
            <MaterialCommunityIcons name="star-outline" size={20} color="#2E4A62" />
            <Text style={styles.statValue}>{doc.average_rating?.toFixed(1) || '4.9'}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>ABOUT</Text>
          <Text style={styles.aboutText}>
            {doc.bio || `${name} is a highly experienced ${doc.specialty} dedicated to providing exceptional patient care.`}
          </Text>
        </View>

        {/* Details Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>DETAILS</Text>
          {[
            { icon: 'briefcase', label: 'Qualification', value: doc.qualification || 'MD, FACC' },
            { icon: 'map-pin', label: 'Hospital', value: doc.hospital_name || 'City Heart Institute' },
            { icon: 'dollar-sign', label: 'Consultation Fee', value: `LKR ${doc.consultation_fee || 3500}` },
            { icon: 'calendar', label: 'Available Days', value: doc.available_days || 'Mon, Wed, Fri' },
            { icon: 'clock', label: 'Working Hours', value: doc.available_from && doc.available_to ? `${doc.available_from} – ${doc.available_to}` : '09:00 – 17:00' },
          ].map((item, idx, arr) => (
            <View key={item.label}>
              <View style={styles.detailRow}>
                <View style={styles.detailIconContainer}>
                  <Feather name={item.icon as any} size={16} color="#2E4A62" />
                </View>
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>{item.label}</Text>
                  <Text style={styles.detailValue}>{item.value}</Text>
                </View>
              </View>
              {idx < arr.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Reviews Section */}
        <View style={styles.sectionCard}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionLabel}>REVIEWS</Text>
            <Text style={styles.seeAll}>See All</Text>
          </View>
          {reviews.map((r) => (
            <View key={r.id} style={styles.reviewItem}>
              <View style={styles.reviewTop}>
                <Text style={styles.reviewAuthor}>
                  {r.is_anonymous ? 'Anonymous' : `${r.profiles?.first_name} ${r.profiles?.last_name}`}
                </Text>
                <View style={styles.reviewRating}>
                  {Array.from({ length: r.rating }, (_, i) => (
                    <Ionicons key={i} name="star" size={12} color="#F5A623" />
                  ))}
                </View>
              </View>
              {r.comment && <Text style={styles.reviewComment}>{r.comment}</Text>}
            </View>
          ))}
        </View>

        {/* Bottom Padding */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed Book Now Button */}
      <View style={styles.bookBarContainer}>
        <View style={styles.bookBar}>
          <View>
            <Text style={styles.feeLabel}>CONSULTATION FEE</Text>
            <Text style={styles.feeValue}>LKR {doc.consultation_fee || 3500}</Text>
          </View>
          <TouchableOpacity
            style={styles.bookButton}
            activeOpacity={0.8}
            onPress={() => router.push({ pathname: '/doctors/book', params: { doctorId: id } })}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
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

  // Profile Card
  profileCard: {
    backgroundColor: '#C8E8FE',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  profileInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  specialtyBadge: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  specialtyText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4A5568',
    letterSpacing: 0.5,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  reviewCount: {
    fontSize: 12,
    color: '#4A5568',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#C8E8FE',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4A5568',
    letterSpacing: 0.5,
  },

  // Section Card
  sectionCard: {
    backgroundColor: '#C8E8FE',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2E4A62',
    letterSpacing: 1,
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 22,
  },

  // Detail Rows
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#4A5568',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginLeft: 50,
  },

  // Reviews
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2E4A62',
    marginBottom: 12,
  },
  reviewItem: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  reviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  reviewAuthor: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 13,
    color: '#4A5568',
    lineHeight: 20,
  },

  // Book Bar
  bookBarContainer: {
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
  bookBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4A5568',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  feeValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  bookButton: {
    backgroundColor: '#111827',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 14,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
