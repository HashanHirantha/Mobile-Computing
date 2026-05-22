import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Badge } from './ui/Badge';
import { colors, typography, spacing } from '../constants/theme';

interface DiseaseCardProps {
  disease: {
    disease_id: number;
    disease_name: string;
    confidence: number;
    specialty: string;
    severity?: string;
  };
  onFindDoctors?: () => void;
}

const CONFIDENCE_COLOR = (score: number) => {
  if (score >= 70) return colors.secondary;
  if (score >= 40) return '#FF9500';
  return colors.accent;
};

export function DiseaseCard({ disease, onFindDoctors }: DiseaseCardProps) {
  const confidence = Math.round(disease.confidence);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.name}>{disease.disease_name}</Text>
          <Badge label={disease.specialty} />
        </View>
        {disease.severity && (
          <Text style={[styles.severity, { color: CONFIDENCE_COLOR(confidence) }]}>
            {disease.severity?.toUpperCase()}
          </Text>
        )}
      </View>

      {/* Confidence Bar */}
      <View style={styles.confidenceRow}>
        <Text style={styles.confidenceLabel}>Match Confidence</Text>
        <Text style={[styles.confidenceValue, { color: CONFIDENCE_COLOR(confidence) }]}>
          {confidence}%
        </Text>
      </View>
      <View style={styles.barBg}>
        <View
          style={[
            styles.barFill,
            { width: `${confidence}%`, backgroundColor: CONFIDENCE_COLOR(confidence) },
          ]}
        />
      </View>

      {onFindDoctors && (
        <TouchableOpacity style={styles.btn} onPress={onFindDoctors} activeOpacity={0.8}>
          <Text style={styles.btnText}>Find {disease.specialty} Doctors →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  header: { marginBottom: spacing.sm },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  name: { ...typography.body, color: colors.textPrimary, fontWeight: '700', flex: 1, marginRight: spacing.sm },
  severity: { ...typography.caption, fontWeight: '700' },
  confidenceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  confidenceLabel: { ...typography.caption, color: colors.textSecondary },
  confidenceValue: { ...typography.caption, fontWeight: '700' },
  barBg: { height: 6, backgroundColor: colors.border, borderRadius: 3, marginBottom: spacing.md },
  barFill: { height: 6, borderRadius: 3 },
  btn: { backgroundColor: colors.primary + '15', borderRadius: 8, paddingVertical: spacing.sm, alignItems: 'center' },
  btnText: { ...typography.caption, color: colors.primary, fontWeight: '700' },
});
