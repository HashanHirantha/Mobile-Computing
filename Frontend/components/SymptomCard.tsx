import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../constants/theme';

interface SymptomCardProps {
  symptom: {
    id: number;
    name: string;
    body_part: string;
    severity_level: string;
    is_emergency?: boolean;
  };
  selected: boolean;
  onPress: () => void;
}

const SEVERITY_COLORS: Record<string, string> = {
  mild: '#34C759',
  moderate: '#FF9500',
  severe: '#FF3B30',
};

export function SymptomCard({ symptom, selected, onPress }: SymptomCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.left}>
        <Text style={styles.name}>{symptom.name}</Text>
        <Text style={styles.bodyPart}>{symptom.body_part}</Text>
      </View>
      <View style={styles.right}>
        {symptom.is_emergency && <Text style={styles.emergency}>🚨</Text>}
        <View style={[styles.severityDot, { backgroundColor: SEVERITY_COLORS[symptom.severity_level] ?? '#ccc' }]} />
        <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
          {selected && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  cardSelected: { borderColor: colors.primary, backgroundColor: colors.primary + '08' },
  left: { flex: 1 },
  name: { ...typography.body, color: colors.textPrimary, fontWeight: '600' },
  bodyPart: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  right: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  emergency: { fontSize: 14 },
  severityDot: { width: 8, height: 8, borderRadius: 4 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkmark: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
