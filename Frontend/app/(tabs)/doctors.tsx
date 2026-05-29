import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDoctors } from '../../hooks/useDoctors';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { colors, typography, spacing, radius } from '../../constants/theme';
import { Avatar } from '../../components/ui/Avatar';

const SPECIALTIES = ['All Doctors', 'Cardiologist', 'Neurologist', 'General Medicine'];

export default function DoctorsScreen() {
  const { doctors, loading, fetchDoctors } = useDoctors();
  const [activeSpecialty, setActiveSpecialty] = useState('All Doctors');

  useEffect(() => {
    fetchDoctors(activeSpecialty === 'All Doctors' ? undefined : activeSpecialty);
  }, [activeSpecialty]);

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={colors.black} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Medi Guide</Text>
      <Avatar 
        uri="https://i.pravatar.cc/150?img=47" 
        name="User" 
        size={36} 
      />
    </View>
  );

  const renderTitle = () => (
    <View style={styles.titleContainer}>
      <Text style={styles.title}>Find Your Specialist</Text>
      <Text style={styles.description}>
        Consult with our world-class medical professionals specializing in cardiac vitality and neurological flow.
      </Text>
    </View>
  );

  const renderFilters = () => (
    <FlatList
      data={SPECIALTIES}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item}
      contentContainerStyle={styles.filterList}
      renderItem={({ item }) => {
        const isActive = activeSpecialty === item;
        return (
          <TouchableOpacity
            style={[styles.filterChip, isActive ? styles.filterChipActive : styles.filterChipInactive]}
            onPress={() => setActiveSpecialty(item)}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterText, isActive ? styles.filterTextActive : styles.filterTextInactive]}>
              {item}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );

  const renderDoctor = ({ item, index }: { item: any; index: number }) => {
    const name = `Dr. ${item.profiles?.first_name ?? ''} ${item.profiles?.last_name ?? ''}`;
    
    if (index === 0) {
      return (
        <TouchableOpacity 
          style={styles.featuredCard} 
          onPress={() => router.push(`/doctors/${item.id}`)}
          activeOpacity={0.9}
        >
          <View style={styles.featuredTop}>
            <Image 
              source={{ uri: item.profiles?.profile_image || 'https://i.pravatar.cc/150?img=11' }} 
              style={styles.featuredImage} 
            />
            <View style={styles.featuredInfo}>
              <View style={styles.featuredNameRow}>
                <Text style={styles.featuredName}>{item.profiles?.first_name} {item.profiles?.last_name}</Text>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star-outline" size={14} color={colors.black} />
                  <Text style={styles.ratingText}>{item.average_rating?.toFixed(1) || '4.9'}</Text>
                </View>
              </View>
              <View style={styles.specialtyBadge}>
                <Text style={styles.specialtyText}>{item.specialty?.toUpperCase() || 'CARDIOLOGIST'}</Text>
              </View>
              <Text style={styles.featuredBio} numberOfLines={2}>
                {item.profiles?.first_name} is an invasive, non-interventional cardiologist...
              </Text>
            </View>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>NEXT SLOT</Text>
              <Text style={styles.statValue}>Today, 14:30</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>EXPERIENCE</Text>
              <Text style={styles.statValue}>{item.experience_years || 15} Years</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.bookButtonMain}>
            <Text style={styles.bookButtonMainText}>Book Now</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity 
        style={styles.compactCard}
        onPress={() => router.push(`/doctors/${item.id}`)}
        activeOpacity={0.9}
      >
        <Image 
          source={{ uri: item.profiles?.profile_image || `https://i.pravatar.cc/150?img=${index + 20}` }} 
          style={styles.compactImage} 
        />
        <View style={styles.compactInfo}>
          <Text style={styles.compactName}>{item.profiles?.first_name} {item.profiles?.last_name}</Text>
          <Text style={styles.compactSpecialty}>{item.specialty?.toUpperCase() || 'NEUROLOGIST'}</Text>
          <View style={styles.compactRating}>
            <Ionicons name="star-outline" size={12} color={colors.black} />
            <Text style={styles.compactRatingText}>{item.average_rating?.toFixed(1) || '4.8'}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.bookButtonSmall}>
          <Text style={styles.bookButtonSmallText}>Book</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      <FlatList
        ListHeaderComponent={
          <>
            {renderTitle()}
            {renderFilters()}
          </>
        }
        data={doctors}
        keyExtractor={(item) => item.id}
        renderItem={renderDoctor}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? <LoadingSpinner /> : <Text style={styles.emptyText}>No doctors found.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  backButton: {
    padding: spacing.xs,
    marginLeft: -spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.black,
  },
  titleContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.black,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: '#4A5568', // slightly darker secondary text for better readability
    lineHeight: 22,
  },
  filterList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    marginRight: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: '#111827', // dark almost black
  },
  filterChipInactive: {
    backgroundColor: colors.authCardBg,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  filterTextInactive: {
    color: '#4A5568',
  },
  listContainer: {
    paddingBottom: spacing.xl,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: spacing.xl,
  },
  
  // Featured Card Styles
  featuredCard: {
    backgroundColor: colors.authCardBg,
    borderRadius: 16,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  featuredTop: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  featuredImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  featuredInfo: {
    flex: 1,
  },
  featuredNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  featuredName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.black,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.black,
  },
  specialtyBadge: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
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
  featuredBio: {
    fontSize: 13,
    color: '#4A5568',
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.6)',
    padding: spacing.sm,
    borderRadius: 8,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4A5568',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.black,
  },
  bookButtonMain: {
    backgroundColor: '#111827',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonMainText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Compact Card Styles
  compactCard: {
    backgroundColor: colors.authCardBg,
    borderRadius: 16,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  compactImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  compactInfo: {
    flex: 1,
  },
  compactName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 2,
  },
  compactSpecialty: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4A5568',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  compactRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactRatingText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.black,
  },
  bookButtonSmall: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  bookButtonSmallText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.black,
  },
});
